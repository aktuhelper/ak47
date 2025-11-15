import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';
import { BOOK_LINKS } from '@/app/_utils/bookLinks';


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        // Get the raw body and signature
        const body = await request.text();
        const signature = request.headers.get('x-razorpay-signature');

        // Verify webhook signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(body)
            .digest('hex');

        if (signature !== expectedSignature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // Parse the webhook payload
        const payload = JSON.parse(body);
        const event = payload.event;

        // Handle payment.captured event
        if (event === 'payment.captured') {
            const payment = payload.payload.payment.entity;

            // Extract customer details and subject code from notes
            const customerEmail = payment.email;
            const subjectCode = payment.notes?.subject_code;
            const subjectName = payment.notes?.subject_name;

            if (!customerEmail || !subjectCode) {
                console.error('Missing email or subject code');
                return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
            }

            // Get book link
            const bookInfo = BOOK_LINKS[subjectCode];

            if (!bookInfo) {
                console.error('Book link not found for:', subjectCode);
                return NextResponse.json({ error: 'Book not found' }, { status: 404 });
            }

            // Send email with book link
            await resend.emails.send({
                from: 'AKTU Helper <noreply@aktuhelper.com>',
                to: customerEmail,
                subject: `Your ${subjectName} Quantum Book - Download Link`,
                html: `
          <h2>Thank you for your purchase!</h2>
          <p>Your payment has been confirmed. You can now download your book.</p>
          <p><strong>Subject:</strong> ${subjectName} (${subjectCode})</p>
          <p><strong>Download Link:</strong> <a href="${bookInfo.link}">Click here to download</a></p>
          <p>If you have any issues, please contact us.</p>
          <p>Best regards,<br/>AKTU Helper Team</p>
        `,
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
    }
}