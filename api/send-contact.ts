import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, company, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Store in Supabase
    const { error: dbError } = await supabase
      .from('contacts')
      .insert([
        {
          name,
          email,
          company,
          message,
          created_at: new Date().toISOString(),
        }
      ]);

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save contact');
    }

    // Send email notification
    await resend.emails.send({
      from: 'App Suite <noreply@app-suite.io>',
      to: 'support@app-suite.io',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // Send confirmation email to user
    await resend.emails.send({
      from: 'App Suite <noreply@app-suite.io>',
      to: email,
      subject: 'Thank you for contacting App Suite',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${name},</p>
        <p>We've received your message and will get back to you within 24 hours.</p>
        <p>Here's a copy of your message:</p>
        <blockquote style="padding: 10px; background: #f5f5f5; border-left: 3px solid #333;">
          ${message}
        </blockquote>
        <p>Best regards,<br>The App Suite Team</p>
      `,
    });

    res.status(200).json({ success: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to process contact form' });
  }
}