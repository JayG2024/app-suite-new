import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    to, 
    subject, 
    html, 
    text, 
    from = 'App Suite <notifications@app-suite.io>',
    replyTo,
    attachments
  } = req.body;

  try {
    if (process.env.RESEND_API_KEY) {
      // Send email with Resend
      const result = await resend.emails.send({
        from: from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html: html || text || '',
        text: text || '',
        reply_to: replyTo || 'jason@jaydus.ai',
        attachments: attachments?.map(att => ({
          filename: att.filename,
          content: Buffer.from(att.content, 'base64')
        }))
      });

      // Log email activity
      if (req.body.projectId) {
        const { db } = await import('@/lib/db');
        await db.query(
          `INSERT INTO admin_activities (action, details, created_at)
           VALUES ('email_sent', $1, NOW())`,
          [{
            to,
            subject,
            projectId: req.body.projectId,
            messageId: result.id
          }]
        );
      }

      return res.status(200).json({ 
        success: true, 
        messageId: result.id
      });
    } else {
      // Development fallback - just log the email
      console.log('Email send request (Resend not configured):', {
        to,
        subject,
        text: text?.substring(0, 100) + '...'
      });

      return res.status(200).json({ 
        success: true, 
        messageId: `dev-${Date.now()}`,
        warning: 'Resend API key not configured. Email logged to console.'
      });
    }
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ 
      error: 'Failed to send email', 
      details: error.message 
    });
  }
}