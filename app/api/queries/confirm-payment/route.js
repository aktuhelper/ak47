import { verifyPaymentSignature } from '@/lib/verifyRazorpay';

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

        const valid = verifyPaymentSignature({
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
            signature: razorpaySignature,
        });

        if (!valid) {
            return Response.json({ error: 'Invalid payment signature' }, { status: 400 });
        }

      
        return Response.json({ success: true });

    } catch (err) {
        console.error('[confirm-payment]', err);
        return Response.json({ error: err.message }, { status: 500 });
    }
}