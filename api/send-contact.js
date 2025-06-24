// App Suite Contact Form Email API
// Powered by Resend for professional email delivery

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const formData = req.body;

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'message']
      });
    }

    const results = [];

    // Send notification to team
    if (process.env.RESEND_API_KEY) {
      try {
        const teamEmail = await resend.emails.send({
          from: 'App Suite <contact@app-suite.io>',
          to: 'jason@jaydus.ai',
          subject: `💬 New Contact Form: ${formData.subject || 'General Inquiry'}`,
          html: generateContactNotificationHTML(formData),
          replyTo: formData.email // Allow direct replies
        });

        results.push({ 
          type: 'team_notification', 
          status: 'success', 
          id: teamEmail.data?.id 
        });

      } catch (emailError) {
        console.error('Team notification error:', emailError);
        results.push({ 
          type: 'team_notification', 
          status: 'error', 
          error: emailError.message 
        });
      }

      // Send auto-reply to client
      try {
        const clientEmail = await resend.emails.send({
          from: 'App Suite <jason@jaydus.ai>',
          to: formData.email,
          subject: 'Thanks for contacting App Suite - We\'ll respond within 24 hours',
          html: generateAutoReplyHTML(formData)
        });

        results.push({ 
          type: 'client_auto_reply', 
          status: 'success', 
          id: clientEmail.data?.id 
        });

      } catch (emailError) {
        console.error('Auto-reply error:', emailError);
        results.push({ 
          type: 'client_auto_reply', 
          status: 'error', 
          error: emailError.message 
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
      results: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Contact form API error:', error);
    res.status(500).json({
      error: 'Failed to process contact form',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// Generate team notification email
function generateContactNotificationHTML(formData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
        .header { background: #3b82f6; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 20px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 15px; border-radius: 0 0 8px 8px; }
        .message-box { background: #f0f9ff; padding: 15px; border-left: 4px solid #3b82f6; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>💬 New Contact Form Submission</h2>
        <p>Someone wants to connect with App Suite</p>
      </div>
      
      <div class="content">
        <h3>📞 Contact Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${formData.name}</li>
          <li><strong>Email:</strong> ${formData.email}</li>
          <li><strong>Company:</strong> ${formData.company || 'Not provided'}</li>
          <li><strong>Phone:</strong> ${formData.phone || 'Not provided'}</li>
          <li><strong>Project Type:</strong> ${formData.projectType || 'Not specified'}</li>
          <li><strong>Subject:</strong> ${formData.subject || 'General Inquiry'}</li>
        </ul>
        
        <div class="message-box">
          <h4>💬 Message:</h4>
          <p>${formData.message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <h3>⚡ Recommended Actions:</h3>
        <ul>
          <li>Respond within 2-4 hours for best conversion</li>
          <li>Offer free consultation call</li>
          <li>Send relevant case studies</li>
          <li>Add to sales pipeline if qualified</li>
        </ul>
      </div>
      
      <div class="footer">
        <p><strong>Reply directly to this email</strong> to respond to ${formData.name}</p>
        <p style="font-size: 12px; color: #666;">
          Submitted: ${new Date().toLocaleString()}
        </p>
      </div>
    </body>
    </html>
  `;
}

// Generate auto-reply to client
function generateAutoReplyHTML(formData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
        .highlight { background: #f0f7ff; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Message Received!</h1>
          <p>We'll respond within 24 hours</p>
        </div>
        
        <div class="content">
          <h2>Hi ${formData.name}!</h2>
          
          <p>Thank you for reaching out to App Suite. I've received your message and will personally respond within 24 hours (usually much sooner!).</p>
          
          <div class="highlight">
            <h3>📋 What you submitted:</h3>
            <p><strong>Subject:</strong> ${formData.subject || 'General Inquiry'}<br>
            <strong>Company:</strong> ${formData.company || 'Not provided'}<br>
            <strong>Project:</strong> ${formData.projectType || 'To be discussed'}</p>
          </div>
          
          <h3>🚀 While you wait, check out:</h3>
          <ul>
            <li>📊 <a href="https://www.app-suite.io/get-started">Generate a custom proposal</a> with instant pricing</li>
            <li>🎯 <a href="https://www.app-suite.io/solutions-weve-built">View our recent projects</a> and client success stories</li>
            <li>🤖 <a href="https://www.app-suite.io/ai-development-process">Learn about our AI capabilities</a></li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.app-suite.io/get-started" class="button">🎯 Generate My Proposal</a>
          </div>
          
          <p><strong>Questions or urgent matters?</strong><br>
          Feel free to reply to this email or call/text: <strong>(555) 123-4567</strong></p>
          
          <p>Looking forward to discussing your project!</p>
          
          <p>Best regards,<br>
          <strong>Jason Gordon</strong><br>
          Founder & Lead Developer<br>
          App Suite</p>
        </div>
        
        <div class="footer">
          <p>🌟 <strong>App Suite</strong> - Custom Software Development<br>
          <a href="https://app-suite.io">app-suite.io</a> | jason@jaydus.ai</p>
        </div>
      </div>
    </body>
    </html>
  `;
}