import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const {
            senderEmail,
            senderName,
            receiverName,
            queryTitle,
            queryDescription,
            amountPaise,
        } = await request.json();

        if (!senderEmail || !receiverName || !queryTitle) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const isFree = !amountPaise || amountPaise === 0;
      const amountRupees = isFree ? 0 : Math.floor(amountPaise / 100);

        const pricingBadgeBg = isFree ? '#d1fae5' : '#ede9fe';
        const pricingBadgeColor = isFree ? '#065f46' : '#4c1d95';
        const pricingBadgeText = isFree ? 'Free query' : `₹${amountRupees} paid query`;

        const { data, error } = await resend.emails.send({
            from: 'CampusConnect <noreply@aktuhelper.com>',
            to: senderEmail,
            subject: isFree
                ? `${receiverName} answered your query: ${queryTitle}`
                : `[₹${amountRupees} paid] ${receiverName} answered your query`,
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your query has been answered</title>
</head>
<body style="margin:0; padding:0; background:#f9fafb; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 28px 32px;">
              <p style="margin:0; font-size:11px; font-weight:600; color:rgba(255,255,255,0.7); text-transform:uppercase; letter-spacing:0.1em;">
                CampusConnect · AktuHelper
              </p>
              <h1 style="margin:8px 0 0; font-size:22px; font-weight:700; color:#ffffff; line-height:1.3;">
                Your query has been answered 🎉
              </h1>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 28px 32px 20px;">
              <p style="margin:0; font-size:15px; color:#374151; line-height:1.6;">
                Hi <strong>${senderName}</strong>,
              </p>
              <p style="margin:10px 0 0; font-size:15px; color:#374151; line-height:1.6;">
                <strong>${receiverName}</strong> has answered your private query on CampusConnect.
              </p>
            </td>
          </tr>

          <!-- Pricing badge -->
          <tr>
            <td style="padding: 0 32px 20px;">
              <span style="display:inline-block; background:${pricingBadgeBg}; color:${pricingBadgeColor}; font-size:12px; font-weight:600; padding:5px 12px; border-radius:20px;">
                ${pricingBadgeText}
              </span>
            </td>
          </tr>

          <!-- Original Query card -->
          <tr>
            <td style="padding: 0 32px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 8px; font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.08em;">
                      Your Query
                    </p>
                    <p style="margin:0 0 16px; font-size:16px; font-weight:600; color:#1e293b;">
                      ${queryTitle}
                    </p>
                    <p style="margin:0 0 8px; font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.08em;">
                      Your Message
                    </p>
                    <p style="margin:0; font-size:14px; color:#475569; line-height:1.7; white-space:pre-wrap;">
                      ${queryDescription}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Answer teaser -->
          <tr>
            <td style="padding: 0 32px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef2ff; border-radius:8px; border:1px solid #c7d2fe;">
                <tr>
                  <td style="padding:20px; border-left: 4px solid #4f46e5; border-radius:8px;">
                    <p style="margin:0 0 6px; font-size:14px; font-weight:600; color:#4f46e5;">
                      ${receiverName} has posted an answer 💬
                    </p>
                    <p style="margin:0; font-size:13px; color:#6b7280; line-height:1.6;">
                      Click the button below to view the full answer on CampusConnect.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 0 32px 28px;" align="center">
              <a href="https://www.aktuhelper.com/campusconnecthome"
                 style="display:inline-block; background:#4f46e5; color:#ffffff; font-size:14px; font-weight:600; text-decoration:none; padding:13px 32px; border-radius:8px;">
                View Full Answer →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; border-top:1px solid #f1f5f9;">
              <p style="margin:0; font-size:12px; color:#9ca3af; line-height:1.6; text-align:center;">
                This is an automated notification from AktuHelper CampusConnect.<br/>
                You received this because someone answered your private query.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`,
            text: [
                `Hi ${senderName},`,
                '',
                `${receiverName} has answered your query on CampusConnect.`,
                '',
                `Your Query: ${queryTitle}`,
                `${queryDescription}`,
                '',
                'Visit CampusConnect to view the full answer:',
                'https://www.aktuhelper.com/campusconnecthome',
                '',
                'AktuHelper Team',
            ].join('\n'),
        });

        if (error) {
            return Response.json({ error: error.message }, { status: 500 });
        }

        return Response.json({ success: true, data });

    } catch (error) {
        console.error('Answer notification email error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}