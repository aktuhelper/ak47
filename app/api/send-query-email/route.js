import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const {
            receiverEmail,
            receiverName,
            senderName,
            queryTitle,
            queryDescription,
            deadlineLabel,   // e.g. '1 hour', '24 hours', 'Free'
            deadlineHours,   // numeric
            amountPaise,     // numeric, 0 for free
        } = await request.json();
    
        if (!receiverEmail || !senderName || !queryTitle || !queryDescription) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const isFree = !amountPaise || amountPaise === 0;
      const amountRupees = isFree ? 0 : Math.floor(amountPaise / 100);
      const payout = isFree ? 0 : Math.floor((amountPaise * 0.8) / 100);

        // ── Pricing badge copy ──
        const pricingBadgeBg = isFree ? '#d1fae5' : '#ede9fe';
        const pricingBadgeColor = isFree ? '#065f46' : '#4c1d95';
        const pricingBadgeText = isFree ? 'Free query' : `₹${amountRupees} paid query`;

        // ── Deadline urgency color ──
        const isUrgent = deadlineHours && deadlineHours <= 2;
        const deadlineBg = isFree ? '#f3f4f6' : isUrgent ? '#fef2f2' : '#eff6ff';
        const deadlineColor = isFree ? '#374151' : isUrgent ? '#991b1b' : '#1e40af';
        const deadlineText = isFree
            ? `No deadline — answer at your convenience`
            : `You must respond within ${deadlineLabel}`;

        // ── Payout section (only for paid) ──
        const payoutSection = isFree ? '' : `
        <tr>
          <td style="padding: 0 32px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4; border-radius:8px; border:1px solid #bbf7d0;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0 0 4px 0; font-size:12px; color:#166534; font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">
                    Your earnings if you answer
                  </p>
                  <p style="margin:0; font-size:24px; font-weight:700; color:#15803d;">
                    ₹${payout}
                  </p>
                  <p style="margin:6px 0 0; font-size:12px; color:#4b5563;">
               (₹${amountRupees} paid by asker · platform retains 20%)
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;

        // ── Refund notice (only for paid) ──
        const refundNotice = isFree ? '' : `
        <tr>
          <td style="padding: 0 32px 24px;">
            <p style="margin:0; font-size:12px; color:#6b7280; line-height:1.6;">
              If you do not respond within <strong style="color:#374151;">${deadlineLabel}</strong>,
             ₹${Math.floor((amountPaise * 0.8) / 100)} will be automatically refunded to the asker.
              The platform retains 20% in all cases.
            </p>
          </td>
        </tr>`;

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New query from ${senderName}</title>
</head>
<body style="margin:0; padding:0; background:#f9fafb; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 28px 32px;">
              <p style="margin:0; font-size:11px; font-weight:600; color:rgba(255,255,255,0.7); text-transform:uppercase; letter-spacing:0.1em;">
                CampusConnect · AktuHelper
              </p>
              <h1 style="margin:8px 0 0; font-size:22px; font-weight:700; color:#ffffff; line-height:1.3;">
                You have a new query
              </h1>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 28px 32px 20px;">
              <p style="margin:0; font-size:15px; color:#374151; line-height:1.6;">
                Hi <strong>${receiverName || 'there'}</strong>,
              </p>
              <p style="margin:10px 0 0; font-size:15px; color:#374151; line-height:1.6;">
                <strong>${senderName}</strong> has sent you a private query on CampusConnect.
              </p>
            </td>
          </tr>

          <!-- Pricing + Deadline badges row -->
          <tr>
            <td style="padding: 0 32px 20px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <!-- Pricing badge -->
                  <td style="padding-right:8px;">
                    <span style="display:inline-block; background:${pricingBadgeBg}; color:${pricingBadgeColor}; font-size:12px; font-weight:600; padding:5px 12px; border-radius:20px;">
                      ${pricingBadgeText}
                    </span>
                  </td>
                  <!-- Deadline badge -->
                  <td>
                    <span style="display:inline-block; background:${deadlineBg}; color:${deadlineColor}; font-size:12px; font-weight:600; padding:5px 12px; border-radius:20px;">
                      ${isFree ? 'No deadline' : `Respond within ${deadlineLabel}`}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Query card -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 8px; font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.08em;">
                      Query title
                    </p>
                    <p style="margin:0 0 16px; font-size:16px; font-weight:600; color:#1e293b;">
                      ${queryTitle}
                    </p>
                    <p style="margin:0 0 8px; font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.08em;">
                      Message
                    </p>
                    <p style="margin:0; font-size:14px; color:#475569; line-height:1.7; white-space:pre-wrap;">
                      ${queryDescription}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Deadline info row -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:${deadlineBg}; border-radius:8px; border:1px solid ${isFree ? '#e5e7eb' : isUrgent ? '#fecaca' : '#bfdbfe'};">
                <tr>
                  <td style="padding:14px 16px;">
                    <p style="margin:0; font-size:13px; color:${deadlineColor}; font-weight:500; line-height:1.5;">
                      ${deadlineText}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Payout section (paid only) -->
          ${payoutSection}

          <!-- CTA button -->
          <tr>
            <td style="padding: 0 32px 28px;" align="center">
              <a href="https://www.aktuhelper.com/campusconnecthome"
                 style="display:inline-block; background:#4f46e5; color:#ffffff; font-size:14px; font-weight:600; text-decoration:none; padding:13px 32px; border-radius:8px;">
                View &amp; respond to query
              </a>
            </td>
          </tr>

          <!-- Refund notice (paid only) -->
          ${refundNotice}

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; border-top:1px solid #f1f5f9;">
              <p style="margin:0; font-size:12px; color:#9ca3af; line-height:1.6; text-align:center;">
                This is an automated notification from AktuHelper CampusConnect.<br/>
                You received this because someone sent you a private query.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

        const { data, error } = await resend.emails.send({
            from: 'CampusConnect <noreply@aktuhelper.com>',
            to: receiverEmail,
            subject: isFree
                ? `New query from ${senderName}: ${queryTitle}`
                : `[₹${amountRupees} paid · ${deadlineLabel}] New query from ${senderName}`,
            html,
            // plain text fallback
            text: [
                `Hi ${receiverName || 'there'},`,
                '',
                `${senderName} sent you a ${isFree ? 'free' : `₹${amountRupees} paid`} query on CampusConnect.`,
                isFree ? '' : `You must respond within ${deadlineLabel} to earn ₹${payout}.`,
                '',
                `Title: ${queryTitle}`,
                '',
                queryDescription,
                '',
                'View and respond: https://www.aktuhelper.com/campusconnecthome',
                '',
                'AktuHelper Team',
            ].filter(l => l !== null).join('\n'),
        });

        if (error) {
            return Response.json({ error: error.message }, { status: 500 });
        }

        return Response.json({ success: true, data });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}