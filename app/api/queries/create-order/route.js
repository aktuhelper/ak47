import razorpay from '@/lib/razorpay';

export async function POST(req) {
    try {
        const { amountPaise, deadlineHours } = await req.json();

        // ✅ queryDocumentId removed — query doesn't exist yet

        if (!amountPaise || amountPaise < 100) {
            return Response.json({ error: 'Invalid amount' }, { status: 400 });
        }

        if (!deadlineHours || deadlineHours <= 0) {
            return Response.json({ error: 'Invalid deadline' }, { status: 400 });
        }

        // Create Razorpay order — no query to link yet
        const order = await razorpay.orders.create({
            amount: amountPaise,
            currency: 'INR',
            receipt: `q_${Date.now()}`,   // ✅ use timestamp since no queryDocumentId
            notes: {
                deadlineHours,             // ✅ store for reference only
            },
        });

        // ✅ No Strapi update here — query gets saved AFTER payment is confirmed
        return Response.json({
            orderId: order.id,
            deadlineAt: new Date(Date.now() + deadlineHours * 60 * 60 * 1000).toISOString(),
        });

    } catch (err) {
        console.error('[create-order]', err);
        return Response.json({ error: err.message }, { status: 500 });
    }
}