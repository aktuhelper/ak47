import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
    try {
        const { amount, subjectCode, subjectName } = await request.json();

        const options = {
            amount: amount * 100, // Amount in paise (₹10 = 1000 paise)
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                subject_code: subjectCode,
                subject_name: subjectName,
            },
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({ orderId: order.id, amount: order.amount });
    } catch (error) {
        console.error('Order creation failed:', error);
        return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
    }
}