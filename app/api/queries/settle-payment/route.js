// app/api/queries/settle-payment/route.js
import razorpay from '@/lib/razorpay';

const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKENI;
const PLATFORM_FEE_PERCENT = 20;



async function getStrapiDirect(endpoint) {
    const fullUrl = `${STRAPI_URL}/api/${endpoint}`;
    console.log('[Strapi GET]', fullUrl);

    const res = await fetch(fullUrl, {
        headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    });

    if (!res.ok) {
        const errText = await res.text();
        console.error(`[Strapi GET failed] status=${res.status} url=${fullUrl}`);
        console.error('[Strapi error body]', errText.slice(0, 500));
        throw new Error(`Strapi fetch failed [${res.status}]: ${errText.slice(0, 200)}`);
    }

    return res.json();
}

async function updateStrapiDirect(endpoint, data) {
    const fullUrl = `${STRAPI_URL}/api/${endpoint}`;
    console.log('[Strapi PUT]', fullUrl, data);

    const res = await fetch(fullUrl, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${STRAPI_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
    });

    if (!res.ok) {
        const errText = await res.text();
        console.error(`[Strapi PUT failed] status=${res.status} url=${fullUrl}`);
        console.error('[Strapi error body]', errText.slice(0, 500));
        throw new Error(`Strapi update failed [${res.status}]: ${errText.slice(0, 200)}`);
    }

    return res.json();
}

async function createStrapiRecord(endpoint, data) {
    const fullUrl = `${STRAPI_URL}/api/${endpoint}`;
    console.log('[Strapi POST]', fullUrl, data);

    const res = await fetch(fullUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${STRAPI_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
    });

    if (!res.ok) {
        const errText = await res.text();
        console.error(`[Strapi POST failed] status=${res.status} url=${fullUrl}`);
        console.error('[Strapi error body]', errText.slice(0, 500));
        throw new Error(`Strapi create failed [${res.status}]: ${errText.slice(0, 200)}`);
    }

    return res.json();
}

// ── Main handler ──────────────────────────────────────────────────────────────

export async function POST(req) {
    try {
        const { queryDocumentId, answerDocumentId, action } = await req.json();

        console.log('[settle-payment] called with:', { queryDocumentId, answerDocumentId, action });
        console.log('[settle-payment] STRAPI_URL:', STRAPI_URL);
        console.log('[settle-payment] TOKEN exists:', !!STRAPI_TOKEN);

        if (!['accept', 'reject'].includes(action)) {
            return Response.json({ error: 'Invalid action. Must be accept or reject.' }, { status: 400 });
        }

        if (!queryDocumentId || !answerDocumentId) {
            return Response.json({ error: 'Missing queryDocumentId or answerDocumentId' }, { status: 400 });
        }

        // ── 1. Fetch query ────────────────────────────────────────────────────
        const queryRes = await getStrapiDirect(
            `personal-queries/${queryDocumentId}?populate[0]=fromUser&populate[1]=toUser`
        );
        const query = queryRes?.data;

        if (!query) {
            return Response.json({ error: 'Query not found' }, { status: 404 });
        }

        // ── Idempotency guard ─────────────────────────────────────────────────
        const alreadySettled = ['accepted', 'rejected'].includes(query.query_status);
        if (alreadySettled) {
            console.warn('[settle-payment] query already settled, rejecting duplicate call');
            return Response.json({ error: 'This query has already been settled.' }, { status: 409 });
        }

        const amountPaise = query.amount_paise;
        const razorpayPaymentId = query.razorpay_payment_id;
        const mentorDocumentId = query.toUser?.documentId;
        const fromUserDocumentId = query.fromUser?.documentId;

        console.log('[settle-payment] query found:', { amountPaise, razorpayPaymentId, mentorDocumentId });

        // ── Free query — skip payment logic ───────────────────────────────────
        if (!amountPaise || amountPaise === 0) {
            await updateStrapiDirect(`personal-queries/${queryDocumentId}`, {
                query_status: action === 'accept' ? 'accepted' : 'rejected',
            });
            await updateStrapiDirect(`personal-query-answers/${answerDocumentId}`, {
                isAccepted: action === 'accept',
                isRejected: action === 'reject',
            });
            return Response.json({ success: true, type: 'free' });
        }

        if (!razorpayPaymentId) {
            return Response.json({ error: 'No payment found for this query' }, { status: 400 });
        }

        // ── 2. Calculate split ────────────────────────────────────────────────
        const platformPaise = Math.round(amountPaise * PLATFORM_FEE_PERCENT / 100);

        let mentorPaise, refundPaise, note;

        if (action === 'accept') {
            // Accept: 80% to mentor, 20% platform fee
            mentorPaise = amountPaise - platformPaise;
            refundPaise = 0;
            note = `Answer accepted — Pay ₹${Math.floor(mentorPaise / 100)} to mentor`;
        } else {
            // Reject: 10% to mentor, 20% platform fee, 70% refund to user
            mentorPaise = Math.round(amountPaise * 10 / 100);
            refundPaise = amountPaise - platformPaise - mentorPaise;
            note = `Answer rejected — Refund ₹${Math.floor(refundPaise / 100)} to user, Pay ₹${Math.floor(mentorPaise / 100)} to mentor`;
        }

        console.log('[settle-payment] split calculated:', { mentorPaise, refundPaise, platformPaise });

        // ── 3. Issue Razorpay refund + record transaction (reject only) ───────
        if (action === 'reject' && refundPaise > 0) {
            let refundStatus = 'pending';
            let refundId = null;

            try {
                const rzRefund = await razorpay.payments.refund(razorpayPaymentId, {
                    amount: refundPaise,
                    notes: {
                        reason: 'Answer rejected by user',
                        queryId: queryDocumentId,
                    },
                });
                refundId = rzRefund.id;   // rfnd_XXXXXXXX
                refundStatus = 'completed';
                console.log('[settle-payment] Razorpay refund issued:', refundId);
            } catch (err) {
                // Don't throw — record as pending so admin can retry from the panel
                console.error('[settle-payment] Razorpay refund failed:', err.message);
            }

            await createStrapiRecord('transactions', {
                amount_paise: refundPaise,
                type: 'refund',
                statuss: refundStatus,
                personal_query: queryDocumentId,
                toUser: fromUserDocumentId,
                razorpay_refund_id: refundId,
                note: `Refund ₹${Math.floor(refundPaise / 100)} to user — payment ID: ${razorpayPaymentId}${refundId ? ` | refund ID: ${refundId}` : ' | pending admin action'}`,
            });
        }

        // ── 4. Fetch mentor UPI details ───────────────────────────────────────
        const payoutRes = await getStrapiDirect(
            `payout-accounts?filters[user_profile][documentId][$eq]=${mentorDocumentId}`
        );
        const payoutAccount = payoutRes?.data?.[0];
        const upiId = payoutAccount?.upiId || null;
        const accountName = payoutAccount?.accountHolderName || 'Unknown';

        console.log('[settle-payment] mentor payout account:', { upiId, accountName });

        // ── 5. Record mentor payout transaction ───────────────────────────────
        await createStrapiRecord('transactions', {
            amount_paise: mentorPaise,
            type: 'mentor_payout',
            statuss: 'pending',
            personal_query: queryDocumentId,
            toUser: mentorDocumentId,
            note: `${note} | UPI: ${upiId || 'not set'} (${accountName})`,
        });

        // ── 6. Record platform fee transaction ────────────────────────────────
        await createStrapiRecord('transactions', {
            amount_paise: platformPaise,
            type: 'platform_fee',
            statuss: 'completed',
            personal_query: queryDocumentId,
            note: `Platform fee 20% — ₹${Math.floor(platformPaise / 100)} | action: ${action}`,
        });

        // ── 7. Update answer status ───────────────────────────────────────────
        await updateStrapiDirect(`personal-query-answers/${answerDocumentId}`, {
            isAccepted: action === 'accept',
            isRejected: action === 'reject',
        });

        // ── 8. Update query status ────────────────────────────────────────────
        await updateStrapiDirect(`personal-queries/${queryDocumentId}`, {
            query_status: action === 'accept' ? 'accepted' : 'rejected',
            payment_status: action === 'accept' ? 'settled' : 'refund',
        });

        console.log('[settle-payment] completed successfully');

        return Response.json({
            success: true,
            action,
            mentorPaise,
            refundPaise,
            platformPaise,
        });

    } catch (err) {
        console.error('[settle-payment] ERROR:', err.message);
        return Response.json({ error: err.message }, { status: 500 });
    }
}