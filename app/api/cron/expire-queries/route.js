// app/api/cron/expire-queries/route.js
import razorpay from '@/lib/razorpay';
import crypto from 'crypto';
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;  
const PLATFORM_FEE_PERCENT = 20;
const SOFT_LOCK_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
async function getStrapiDirect(endpoint) {
    const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
        headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    });
    if (!res.ok) throw new Error(`Strapi fetch failed: ${endpoint}`);
    return res.json();
}
async function updateStrapiDirect(endpoint, data) {
    const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${STRAPI_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
    });
    if (!res.ok) throw new Error(`Strapi update failed: ${endpoint}`);
    return res.json();
}

async function createTransaction(data) {
    const res = await fetch(`${STRAPI_URL}/api/transactions`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${STRAPI_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
    });
    if (!res.ok) throw new Error('Transaction creation failed');
    return res.json();
}

function isValidCronSecret(authHeader) {
    const expected = `Bearer ${process.env.CRON_SECRET}`;
    if (!authHeader || authHeader.length !== expected.length) return false;
    return crypto.timingSafeEqual(
        Buffer.from(authHeader),
        Buffer.from(expected)
    );
}

export async function GET(req) {
    if (!isValidCronSecret(req.headers.get('authorization'))) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const now = new Date().toISOString();

        await recoverStuckSoftLocks('processing_expire', 'open');

        // ✅ FIX 3: populate=* so fromUser is available for the refund toUser field
        const res = await getStrapiDirect(
            `personal-queries?filters[query_status][$eq]=open&filters[deadline_at][$lt]=${now}&filters[amount_paise][$gt]=0&populate=*&publicationState=preview`
        );

        const queries = res?.data || [];
        console.log(`[expire] Found ${queries.length}`);

        let processed = 0;

        for (const query of queries) {
            const qid = query.documentId;

            try {
                console.log(`[expire] Checking ${qid}`);

                // ✅ FIX: populate=* on re-fetch too
                const latestRes = await getStrapiDirect(
                    `personal-queries/${qid}?populate=*&publicationState=preview`
                );
                const latest = latestRes?.data;

                if (!latest || latest.query_status !== 'open') {
                    console.log(`[expire] Skip ${qid} — already processed`);
                    continue;
                }

                const amountPaise = latest.amount_paise;
                const razorpayPaymentId = latest.razorpay_payment_id;
                const fromUserDocumentId = latest.fromUser?.documentId; // ✅ FIX 3: student who paid

                // ✅ FIX 5: On expiry mentor did nothing — full refund minus platform fee only
                // Split: Platform 20%, User refund 80% (no mentor consolation on expiry)
                const platformPaise = Math.round((amountPaise * PLATFORM_FEE_PERCENT) / 100);
                const refundPaise = amountPaise - platformPaise; // 80% back to user
                // Check if refund transaction already exists
                const existingRefund = await getStrapiDirect(
                    `transactions?filters[personal_query][documentId][$eq]=${qid}&filters[type][$eq]=refund`
                );

                if (existingRefund?.data?.length > 0) {
                    console.log(`[expire] Skip ${qid} — refund transaction exists`);
                    if (['open', 'processing_expire'].includes(latest.query_status)) {
                        await updateStrapiDirect(`personal-queries/${qid}`, {
                            query_status: 'expired',
                            payment_status: 'refunded',
                        });
                    }
                    continue;
                }

                // Soft lock with timestamp
                await updateStrapiDirect(`personal-queries/${qid}`, {
                    query_status: 'processing_expire',
                    processing_started_at: new Date().toISOString(),
                });

                // Write refund record BEFORE calling Razorpay (prevents double refund on retry)
                await createTransaction({
                    amount_paise: refundPaise,
                    type: 'refund',
                    statuss: 'pending',
                    personal_query: qid,
                    toUser: fromUserDocumentId, // ✅ FIX 3: who receives the refund
                    note: `Auto-expired refund ₹${Math.floor(refundPaise / 100)} — payment ID: ${razorpayPaymentId || 'N/A'}`,
                });

                // Issue Razorpay refund
                let refundStatus = 'completed';
                let refundId = null;

                if (razorpayPaymentId) {
                    try {
                        const rzRefund = await razorpay.payments.refund(razorpayPaymentId, {
                            amount: refundPaise,
                            notes: { reason: 'Query expired — mentor did not respond', queryId: qid },
                        });
                        refundId = rzRefund.id;
                        console.log(`[expire] Razorpay refund issued: ${refundId}`);
                    } catch (err) {
                        if (err.error?.description?.includes('already refunded')) {
                            console.log(`[expire] Razorpay already refunded ${qid}`);
                        } else {
                            refundStatus = 'failed';
                            console.error(`[expire] Razorpay refund failed for ${qid}:`, err.message);
                        }
                    }
                } else {
                    console.warn(`[expire] No razorpay_payment_id on query ${qid} — skipping Razorpay call`);
                    refundStatus = 'failed';
                }

                // Update refund transaction with final status + refund ID
                const refundTxRes = await getStrapiDirect(
                    `transactions?filters[personal_query][documentId][$eq]=${qid}&filters[type][$eq]=refund`
                );
                const refundTxId = refundTxRes?.data?.[0]?.documentId;
                if (refundTxId) {
                    await updateStrapiDirect(`transactions/${refundTxId}`, {
                        statuss: refundStatus,
                        ...(refundId && { razorpay_refund_id: refundId }), // ✅ save refund ID
                        note: `Auto-expired refund ₹${Math.floor(refundPaise / 100)} — payment ID: ${razorpayPaymentId || 'N/A'}${refundId ? ` | refund ID: ${refundId}` : ' | pending admin action'}`,
                    });
                }

                if (refundStatus === 'failed') {
                    console.error(`[expire] Left ${qid} in processing_expire — manual review needed`);
                    continue;
                }

                // Platform fee transaction
                await createTransaction({
                    amount_paise: platformPaise,
                    type: 'platform_fee',
                    statuss: 'completed',
                    personal_query: qid,
                    note: `Platform fee 20% — ₹${Math.floor(platformPaise / 100)} | auto-expire`,
                });

                // Final state
                await updateStrapiDirect(`personal-queries/${qid}`, {
                    query_status: 'expired',
                    payment_status: 'refunded',
                });
                processed++;
                console.log(`[expire] SUCCESS ${qid}`);

            } catch (err) {
                console.error(`[expire] FAIL ${qid}:`, err.message);

                try {
                    const checkRefund = await getStrapiDirect(
                        `transactions?filters[personal_query][documentId][$eq]=${qid}&filters[type][$eq]=refund`
                    );
                    if (checkRefund?.data?.length > 0) {
                        console.error(`[expire] Not rolling back ${qid} — refund record exists`);
                    } else {
                        await updateStrapiDirect(`personal-queries/${qid}`, {
                            query_status: 'open',
                        });
                        console.log(`[expire] Rolled back ${qid} to open`);
                    }
                } catch {
                    console.error(`[expire] rollback/check failed ${qid}`);
                }
            }
        }

        return Response.json({ success: true, processed });

    } catch (err) {
        console.error('[expire] Fatal:', err);
        return Response.json({ error: err.message }, { status: 500 });
    }
}

async function recoverStuckSoftLocks(stuckStatus, recoveryStatus) {
    try {
        const cutoff = new Date(Date.now() - SOFT_LOCK_TIMEOUT_MS).toISOString();
        const res = await getStrapiDirect(
            `personal-queries?filters[query_status][$eq]=${stuckStatus}&filters[processing_started_at][$lt]=${cutoff}&publicationState=preview`
        );
        const stuck = res?.data || [];
        if (stuck.length > 0) {
            console.log(`[expire] Recovering ${stuck.length} stuck '${stuckStatus}' queries`);
        }
        for (const q of stuck) {
            const refundCheck = await getStrapiDirect(
                `transactions?filters[personal_query][documentId][$eq]=${q.documentId}&filters[type][$eq]=refund`
            );
            if (refundCheck?.data?.length > 0) {
                await updateStrapiDirect(`personal-queries/${q.documentId}`, {
                    query_status: 'expired',
                    payment_status: 'refunded',
                });
                console.log(`[expire] Finalized stuck+refunded query ${q.documentId}`);
            } else {
                await updateStrapiDirect(`personal-queries/${q.documentId}`, {
                    query_status: recoveryStatus,
                });
                console.log(`[expire] Recovered stuck query ${q.documentId} → ${recoveryStatus}`);
            }
        }
    } catch (err) {
        console.error(`[expire] recoverStuckSoftLocks failed:`, err.message);
    }
}