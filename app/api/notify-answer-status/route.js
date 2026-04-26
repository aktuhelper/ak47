import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const {
            status,           // 'accepted' | 'rejected'
            answererEmail,
            answererName,
            askerName,
            queryTitle,
            amountPaise,      // 0 for free
        } = await request.json();

        if (!answererEmail || !answererName || !askerName || !queryTitle || !status) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const isAccepted = status === 'accepted';
        const isFree = !amountPaise || amountPaise === 0;
      const amountRupees = isFree ? 0 : Math.floor(amountPaise / 100);
      const payout = isFree ? 0 : Math.floor((amountPaise * 0.8) / 100);

        // ── Colors based on status ──
        const headerGradient = isAccepted
            ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
            : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)';

        const statusTitle = isAccepted ? '🎉 Your answer was accepted!' : '❌ Your answer was rejected';
        const statusSubtitle = isAccepted
            ? `Great news! ${askerName} accepted your answer.`
            : `${askerName} has reviewed and rejected your answer.`;

        // ── Payout section (accepted + paid only) ──
        const payoutSection = isAccepted && !isFree ? `
        <tr>
          <td style="padding: 0 32px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4; border-radius:8px; border:1px solid #bbf7d0;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0 0 4px 0; font-size:12px; color:#166534; font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">
                    Your earnings
                  </p>
                  <p style="margin:0; font-size:28px; font-weight:700; color:#15803d;">
                    ₹${payout}
                  </p>
                  <p style="margin:6px 0 0; font-size:12px; color:#4b5563;">
                    This amount will be transferred to your account soon.
                  </p>
                  <p style="margin:4px 0 0; font-size:11px; color:#9ca3af;">
                 (₹${amountRupees} paid by asker · platform retains 20%)
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>` : '';

        // ── Rejection message section ──
        const rejectionSection = !isAccepted ? `
        <tr>
          <td style="padding: 0 32px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2; border-radius:8px; border:1px solid #fecaca;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0 0 6px; font-size:13px; font-weight:600; color:#991b1b;">
                    Why was it rejected?
                  </p>
                  <p style="margin:0; font-size:13px; color:#6b7280; line-height:1.6;">
                    The asker felt your answer didn't fully address their query.
                    You can view the query and try improving your response if allowed.
                  </p>
                  ${!isFree ? `<p style="margin:10px 0 0; font-size:12px; color:#9ca3af;">
                    Only 10 % of  payment will be transferred for rejected answers.
                  </p>` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>` : '';

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${statusTitle}</title>
</head>
<body style="margin:0; padding:0; background:#f9fafb; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background: ${headerGradient}; padding: 28px 32px;">
              <p style="margin:0; font-size:11px; font-weight:600; color:rgba(255,255,255,0.7); text-transform:uppercase; letter-spacing:0.1em;">
                CampusConnect · AktuHelper
              </p>
              <h1 style="margin:8px 0 0; font-size:22px; font-weight:700; color:#ffffff; line-height:1.3;">
                ${statusTitle}
              </h1>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 28px 32px 20px;">
              <p style="margin:0; font-size:15px; color:#374151; line-height:1.6;">
                Hi <strong>${answererName}</strong>,
              </p>
              <p style="margin:10px 0 0; font-size:15px; color:#374151; line-height:1.6;">
                ${statusSubtitle}
              </p>
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
                    <p style="margin:0; font-size:16px; font-weight:600; color:#1e293b;">
                      ${queryTitle}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Status badge -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <span style="display:inline-block; background:${isAccepted ? '#d1fae5' : '#fee2e2'}; color:${isAccepted ? '#065f46' : '#991b1b'}; font-size:13px; font-weight:700; padding:8px 20px; border-radius:20px; border:1px solid ${isAccepted ? '#6ee7b7' : '#fca5a5'};">
                ${isAccepted ? '✓ Accepted' : '✗ Rejected'} by ${askerName}
              </span>
            </td>
          </tr>

          <!-- Payout section (accepted + paid only) -->
          ${payoutSection}

          <!-- Rejection section -->
          ${rejectionSection}

          <!-- CTA -->
          <tr>
            <td style="padding: 0 32px 28px;" align="center">
              <a href="https://www.aktuhelper.com/campusconnecthome"
                 style="display:inline-block; background:#4f46e5; color:#ffffff; font-size:14px; font-weight:600; text-decoration:none; padding:13px 32px; border-radius:8px;">
                View on CampusConnect
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; border-top:1px solid #f1f5f9;">
              <p style="margin:0; font-size:12px; color:#9ca3af; line-height:1.6; text-align:center;">
                This is an automated notification from AktuHelper CampusConnect.<br/>
                You received this because someone reviewed your answer.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

        const subject = isAccepted
            ? `✅ Your answer was accepted${!isFree ? ` — ₹${payout} incoming` : ''}: ${queryTitle}`
            : `❌ Your answer was rejected: ${queryTitle}`;

        const { data, error } = await resend.emails.send({
            from: 'CampusConnect <noreply@aktuhelper.com>',
            to: answererEmail,
            subject,
            html,
            text: isAccepted
                ? `Hi ${answererName}, your answer to "${queryTitle}" was accepted by ${askerName}.${!isFree ? ` ₹${payout} will be transferred to your account soon.` : ''} Visit: https://www.aktuhelper.com/campusconnecthome`
                : `Hi ${answererName}, your answer to "${queryTitle}" was rejected by ${askerName}. Visit: https://www.aktuhelper.com/campusconnecthome`,
        });

        if (error) {
            return Response.json({ error: error.message }, { status: 500 });
        }

        return Response.json({ success: true, data });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}