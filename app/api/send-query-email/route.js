import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const { receiverEmail, receiverName, senderName, queryTitle, queryDescription } = await request.json();

        if (!receiverEmail || !senderName || !queryTitle || !queryDescription) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: 'AKTUHELPER <noreply@aktuhelper.com>',
            to: receiverEmail,
            subject: `New Query from ${senderName}: ${queryTitle}`,
            text: `
Hi ${receiverName},

You have received a new query from ${senderName}.

Title: ${queryTitle}

Message:
${queryDescription}

View and respond to this query here:
https://www.aktuhelper.com/campusconnecthome

Best regards,
AktuHelper Team
            `.trim(),
        });

        if (error) {
            return Response.json({ error: error.message }, { status: 500 });
        }

        return Response.json({ success: true, data });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}