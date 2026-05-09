import { verifyPaymentSignature } from '@/lib/verifyRazorpay';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

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

export async function POST(req) {
    try {
        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,  
        } = await req.json();

        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return Response.json({ error: 'Missing payment fields' }, { status: 400 });
        }

        // 1. Verify signature
        const valid = verifyPaymentSignature({
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
            signature: razorpaySignature,
        });

        if (!valid) {
            return Response.json({ error: 'Invalid payment signature' }, { status: 400 });
        }

        // 2. Fetch query to get deadline_hours
        if (!queryDocumentId) {
            return Response.json({ error: 'Missing queryDocumentId' }, { status: 400 });
        }

        const queryRes = await getStrapiDirect(`personal-queries/${queryDocumentId}`);
        const query = queryRes?.data;

        if (!query) {
            return Response.json({ error: 'Query not found' }, { status: 404 });
        }

        // 3. Calculate deadline_at from deadline_hours
        const deadlineHours = query.deadline_hours || 24; // fallback 24h
        const deadlineAt = new Date(
            Date.now() + deadlineHours * 60 * 60 * 1000
        ).toISOString();

        // 4. Update query with payment info + deadline_at
        await updateStrapiDirect(`personal-queries/${queryDocumentId}`, {
            razorpay_payment_id: razorpayPaymentId,
            payment_status: 'paid',
            query_status: 'open',
            deadline_at: deadlineAt,  // ← this is what the cron needs
        });

        console.log(`[confirm-payment] Query ${queryDocumentId} marked paid, deadline: ${deadlineAt}`);

        return Response.json({ success: true });

    } catch (err) {
        console.error('[confirm-payment]', err);
        return Response.json({ error: err.message }, { status: 500 });
    }
}