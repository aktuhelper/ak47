import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
    try {
        const { amount, subjectCode, subjectName, customerName, customerEmail } = await request.json();

        // Validate required fields
        if (!amount || !subjectCode || !subjectName || !customerName || !customerEmail) {
            return NextResponse.json({
                error: 'Missing required fields'
            }, { status: 400 });
        }

        // Validate amount (minimum ₹20)
        if (amount < 20) {
            return NextResponse.json({
                error: 'Minimum donation amount is ₹20'
            }, { status: 400 });
        }

        const options = {
            amount: amount * 100, // Amount in paise (₹20 = 2000 paise)
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                subject_code: subjectCode,
                subject_name: subjectName,
                customer_name: customerName,
                customer_email: customerEmail,
            },
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            id: order.id, // Changed from orderId to id for consistency
            amount: order.amount,
            currency: order.currency,
        });

    } catch (error) {
        console.error('Order creation failed:', error);
        return NextResponse.json({
            error: 'Order creation failed',
            details: error.message
        }, { status: 500 });
    }
}