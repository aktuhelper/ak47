// app/api/cron/auto-accept/route.js

import razorpay from '@/lib/razorpay';
import crypto from 'crypto';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKENI;  // ← pick one, use same everywhere
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
    if (!res.ok) {
        const errBody = await res.text(); // ← ADD THIS
        console.error('Transaction creation error body:', errBody); // ← ADD THIS
        throw new Error('Transaction creation failed');
    }
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

        // Recover stuck soft-locks before processing new ones
        await recoverStuckSoftLocks('processing', 'answered');

        const res = await getStrapiDirect(
            `personal-queries?filters[query_status][$eq]=answered&filters[review_deadline_at][$lt]=${now}&filters[amount_paise][$gt]=0&populate=*&publicationState=preview`
        );

        const queries = res?.data || [];
        console.log(`[auto-accept] Found ${queries.length} queries`);

        let processed = 0;

        for (const query of queries) {
            const qid = query.documentId;

            try {
                console.log(`[auto-accept] Checking ${qid}`);

                // ✅ FIX 1: populate=* so toUser and fromUser are available
                const latestRes = await getStrapiDirect(
                    `personal-queries/${qid}?populate=*&publicationState=preview`
                );
                const latest = latestRes?.data;

                if (!latest || latest.query_status !== 'answered') {
                    console.log(`[auto-accept] Skip ${qid} — already processed`);
                    continue;
                }
                const mentorDocumentId = latest.toUser?.documentId;
                const fromUserDocumentId = latest.fromUser?.documentId; // ✅ FIX 2: capture student
                if (!mentorDocumentId) {
                    console.error(`[auto-accept] Skip ${qid} — no mentor assigned`);
                    await updateStrapiDirect(`personal-queries/${qid}`, {
                        query_status: 'error_no_mentor',
                    });
                    continue;
                }

                // Check if payout already exists
                const existingTx = await getStrapiDirect(
                    `transactions?filters[personal_query][documentId][$eq]=${qid}&filters[type][$eq]=mentor_payout`
                );

                if (existingTx?.data?.length > 0) {
                    console.log(`[auto-accept] Skip ${qid} — payout exists`);
                    if (['answered', 'processing'].includes(latest.query_status)) {
                        await updateStrapiDirect(`personal-queries/${qid}`, {
                            query_status: 'accepted',
                            payment_status: 'settled',
                        });
                    }
                    continue;
                }

                const amountPaise = latest.amount_paise;
                const platformPaise = Math.round((amountPaise * PLATFORM_FEE_PERCENT) / 100);
                const mentorPaise = amountPaise - platformPaise;

                // Soft lock with timestamp
                await updateStrapiDirect(`personal-queries/${qid}`, {
                    query_status: 'processing',
                    processing_started_at: new Date().toISOString(),
                });

                // Fetch mentor UPI details
                const payoutRes = await getStrapiDirect(
                    `payout-accounts?filters[user_profile][documentId][$eq]=${mentorDocumentId}`
                );
                const upiId = payoutRes?.data?.[0]?.upiId || null;
                const accountName = payoutRes?.data?.[0]?.accountHolderName || 'Unknown';

                if (!upiId) {
                    console.warn(`[auto-accept] No UPI ID for mentor ${mentorDocumentId} on query ${qid}`);
                }

                // Mentor payout transaction
                await createTransaction({
                    amount_paise: mentorPaise,
                    type: 'mentor_payout',
                    statuss: 'pending',
                    personal_query: { connect: [qid] },        // ← was: qid
                    toUser: { connect: [mentorDocumentId] },    // ← was: mentorDocumentId
                    fromUser: { connect: [fromUserDocumentId] },// ← was: fromUserDocumentId
                  
                    note: `Auto-accepted — ₹${Math.floor(mentorPaise / 100)} → ${upiId || 'NO UPI ID — manual payout needed'}`,
                });

                // Platform fee transaction
                await createTransaction({
                    amount_paise: platformPaise,
                    type: 'platform_fee',
                    statuss: 'completed',
                    personal_query: { connect: [qid] },        // ← was: qid
                    note: `Platform fee 20% — ₹${Math.floor(platformPaise / 100)} | auto-accept`,
                });
                const answersRes = await getStrapiDirect(
                    `personal-query-answers?filters[personal_query][documentId][$eq]=${qid}&publicationState=preview`
                );
                const answersList = answersRes?.data || [];
                for (const ans of answersList) {
                    await updateStrapiDirect(`personal-query-answers/${ans.documentId}`, {
                        isAccepted: true,
                    });
                }

                // Final state
                await updateStrapiDirect(`personal-queries/${qid}`, {
                    query_status: 'accepted',
                    payment_status: 'settled',
                    settlement_type: 'auto_accepted',
                });
                processed++;
                console.log(`[auto-accept] SUCCESS ${qid}`);
            } catch (err) {
                console.error(`[auto-accept] FAIL ${qid}:`, err.message);
                try {
                    const checkPayout = await getStrapiDirect(
                        `transactions?filters[personal_query][documentId][$eq]=${qid}&filters[type][$eq]=mentor_payout`
                    );
                    if (checkPayout?.data?.length > 0) {
                        await updateStrapiDirect(`personal-queries/${qid}`, {
                            query_status: 'accepted',
                            payment_status: 'settled',
                        });
                        console.log(`[auto-accept] Finalized ${qid} after partial failure`);
                    } else {
                        await updateStrapiDirect(`personal-queries/${qid}`, {
                            query_status: 'answered',
                        });
                        console.log(`[auto-accept] Rolled back ${qid} to answered`);
                    }
                } catch (rollbackErr) {
                    console.error(`[auto-accept] rollback/check failed ${qid}:`, rollbackErr.message);
                }
            }
        }

        return Response.json({ success: true, processed });

    } catch (err) {
        console.error('[auto-accept] Fatal:', err);
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
            console.log(`[auto-accept] Recovering ${stuck.length} stuck '${stuckStatus}' queries`);
        }
        for (const q of stuck) {
            const payoutCheck = await getStrapiDirect(
                `transactions?filters[personal_query][documentId][$eq]=${q.documentId}&filters[type][$eq]=mentor_payout`
            );
            if (payoutCheck?.data?.length > 0) {
                await updateStrapiDirect(`personal-queries/${q.documentId}`, {
                    query_status: 'accepted',
                    payment_status: 'settled',
                });
                console.log(`[auto-accept] Finalized stuck+paid query ${q.documentId}`);
            } else {
                await updateStrapiDirect(`personal-queries/${q.documentId}`, {
                    query_status: recoveryStatus,
                });
                console.log(`[auto-accept] Recovered stuck query ${q.documentId} → ${recoveryStatus}`);
            }
        }
    } catch (err) {
        console.error(`[auto-accept] recoverStuckSoftLocks failed:`, err.message);
    }
}