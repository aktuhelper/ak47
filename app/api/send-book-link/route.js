// File: app/api/send-book-link/route.js

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { BOOK_LINKS } from '@/app/_utils/bookLinks';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const { email, name, subjectCode, subjectName } = await request.json();

        // Validate inputs
        if (!email || !name || !subjectCode || !subjectName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get book link
        const bookInfo = BOOK_LINKS[subjectCode];

        if (!bookInfo || !bookInfo.link) {
            return NextResponse.json(
                { error: `Book not found for subject code: ${subjectCode}` },
                { status: 404 }
            );
        }

        // Send email with download link
        const emailResult = await resend.emails.send({
            from: 'AKTU Helper <noreply@aktuhelper.com>',
            to: email,
            subject: `📚 Your ${subjectName} Study Material Download Link`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
                        .info-box { background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 5px; }
                        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>📚 Your Study Material is Ready!</h1>
                            <p>Download your ${subjectName} materials</p>
                        </div>
                        
                        <div class="content">
                            <p>Hi ${name},</p>
                            
                            <p>Thank you for requesting the study materials! Your download link is ready below:</p>
                            
                            <div class="info-box">
                                <h3>📖 Subject Details:</h3>
                                <p><strong>Subject:</strong> ${subjectName}</p>
                                <p><strong>Subject Code:</strong> ${subjectCode}</p>
                            </div>
                            
                            <div style="text-align: center;">
                                <a href="${bookInfo.link}" class="button">
                                    📥 Download Now
                                </a>
                            </div>
                            
                            <div class="info-box">
                                <h3>✅ What You Get:</h3>
                                <ul>
                                    <li>Complete PDF study material</li>
                                    <li>All chapters with solutions</li>
                                    <li>Previous year questions</li>
                                    <li>Lifetime access</li>
                                </ul>
                            </div>
                            
                            <p style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 5px;">
                                <strong>💡 Tip:</strong> Keep this email for future reference. The download link works indefinitely.
                            </p>
                            
                            <p>If you face any issues downloading, please reply to this email.</p>
                            
                            <p>Happy studying! 🎓</p>
                            
                            <p>Best regards,<br/>
                            <strong>AKTU Helper Team</strong></p>
                        </div>
                        
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} AKTU Helper. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        if (emailResult.error) {
            console.error('Resend error:', emailResult.error);
            return NextResponse.json(
                { error: 'Failed to send email' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully',
            id: emailResult.data.id
        });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process request' },
            { status: 500 }
        );
    }
}