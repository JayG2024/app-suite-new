// App Suite Newsletter Subscription API
// Powered by Resend for professional email delivery

import { Resend } from 'resend';
import pkg from 'pg';
const { Pool } = pkg;

const resend = new Resend(process.env.RESEND_API_KEY);

// Database configuration for storing subscribers
const pool = process.env.DATABASE_URL ? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}) : null;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let client;
  
  try {
    const { email, source } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        error: 'Valid email address required' 
      });
    }

    const results = [];

    // Store subscriber in database if available
    if (pool) {
      try {
        client = await pool.connect();
        
        // Check if email already exists
        const existingCheck = await client.query(
          'SELECT id FROM newsletter_subscribers WHERE email = $1',
          [email]
        );
        
        if (existingCheck.rows.length === 0) {
          // Insert new subscriber
          await client.query(
            `INSERT INTO newsletter_subscribers (email, source, subscribed_at, status) 
             VALUES ($1, $2, NOW(), 'active')`,
            [email, source || 'website']
          );
          
          results.push({ 
            type: 'database', 
            status: 'success',
            message: 'Subscriber added to database'
          });
        } else {
          results.push({ 
            type: 'database', 
            status: 'existing',
            message: 'Email already subscribed'
          });
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        results.push({ 
          type: 'database', 
          status: 'error',
          error: dbError.message
        });
      } finally {
        if (client) client.release();
      }
    }

    // Send emails via Resend
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return res.status(500).json({ 
        error: 'Email service not configured. Please contact jason@jaydus.ai' 
      });
    }

    // Send welcome email to subscriber
    try {
      const welcomeEmail = await resend.emails.send({
        from: `App Suite <newsletter@${process.env.VITE_SITE_URL ? new URL(process.env.VITE_SITE_URL).hostname.replace('www.', '') : 'localhost'}>`,
        to: email,
        subject: '🚀 Welcome to App Suite Insider - Your Custom Software Journey Starts Here!',
        html: generateWelcomeEmailHTML(email, source),
        reply_to: 'jason@jaydus.ai'
      });

      results.push({ 
        type: 'welcome_email', 
        status: 'success', 
        id: welcomeEmail.data?.id 
      });

    } catch (emailError) {
      console.error('Welcome email error:', emailError);
      results.push({ 
        type: 'welcome_email', 
        status: 'error', 
        error: emailError.message 
      });
    }

    // Add to Resend contacts if available
    try {
      // Resend Contacts API is in beta - check if available
      if (process.env.RESEND_AUDIENCE_ID && resend.contacts?.create) {
        const contact = await resend.contacts.create({
          email: email,
          audience_id: process.env.RESEND_AUDIENCE_ID
        });
        
        results.push({ 
          type: 'resend_contact', 
          status: 'success',
          contact_id: contact.id
        });
      }
    } catch (contactError) {
      console.error('Resend contact error:', contactError);
      // Don't fail the request if contact creation fails
    }

    // Notify team of new subscriber
    try {
      const teamEmail = await resend.emails.send({
        from: `App Suite <notifications@${process.env.VITE_SITE_URL ? new URL(process.env.VITE_SITE_URL).hostname.replace('www.', '') : 'localhost'}>`,
        to: 'jason@jaydus.ai',
        subject: `📧 New Newsletter Subscriber: ${email}`,
        html: generateSubscriberNotificationHTML(email, source)
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

    // Return success even if some operations failed
    const hasErrors = results.some(r => r.status === 'error');
    const isSuccess = results.some(r => r.status === 'success');

    if (isSuccess) {
      res.status(200).json({
        success: true,
        message: 'Newsletter subscription successful! Check your email.',
        results: results,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to process subscription. Please try again or contact jason@jaydus.ai',
        results: results,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Newsletter subscription API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process newsletter subscription',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// Generate welcome email for new subscriber
function generateWelcomeEmailHTML(email, source) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
        .highlight { background: #f0f7ff; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        .feature { display: flex; align-items: center; margin: 10px 0; }
        .feature-icon { margin-right: 10px; font-size: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Welcome to App Suite Insider!</h1>
          <p>Your journey to custom software success starts now</p>
        </div>
        
        <div class="content">
          <h2>Welcome aboard! 🎉</h2>
          
          <p>I'm Jason, founder of App Suite, and I'm personally excited to have you join our community of forward-thinking business leaders.</p>
          
          <div class="highlight">
            <h3>🎯 What you'll get as an App Suite Insider:</h3>
            <div class="feature">
              <span class="feature-icon">💡</span>
              <span><strong>Industry Insights:</strong> Latest trends in AI and custom software</span>
            </div>
            <div class="feature">
              <span class="feature-icon">📊</span>
              <span><strong>Case Studies:</strong> Real client transformations and ROI stories</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🛠️</span>
              <span><strong>Tech Tips:</strong> Practical advice for digital transformation</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🎁</span>
              <span><strong>Exclusive Offers:</strong> Early access to new solutions and special pricing</span>
            </div>
          </div>
          
          <h3>📚 Quick Resources to Get Started:</h3>
          <p>Here are some resources our subscribers love:</p>
          
          <div style="text-align: center;">
            <a href="${process.env.VITE_SITE_URL || 'https://www.app-suite.io'}/whitepapers/geo-blocking-ai-search" class="button">
              📄 Download: AI Search Visibility Guide
            </a>
            <a href="${process.env.VITE_SITE_URL || 'https://www.app-suite.io'}/financing-calculator" class="button">
              💰 Calculate Your Project Cost
            </a>
          </div>
          
          <p style="margin-top: 20px;">
            <strong>Have a specific challenge?</strong> Simply reply to this email and tell me about it. 
            I personally read every response and often feature solutions in our newsletter.
          </p>
          
          <p>Looking forward to helping you build something amazing!</p>
          
          <p><strong>Jason Gordon</strong><br>
          Founder & CEO, App Suite<br>
          <a href="mailto:jason@jaydus.ai">jason@jaydus.ai</a></p>
        </div>
        
        <div class="footer">
          <p style="color: #6b7280; font-size: 14px;">
            App Suite - Custom Business Software at Flat Rates<br>
            <a href="${process.env.VITE_SITE_URL || 'https://www.app-suite.io'}" style="color: #667eea;">${process.env.VITE_SITE_URL ? new URL(process.env.VITE_SITE_URL).hostname.replace('www.', '') : 'app-suite.io'}</a> | 
            <a href="${process.env.VITE_SITE_URL || 'https://www.app-suite.io'}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #667eea;">Unsubscribe</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate notification email for team
function generateSubscriberNotificationHTML(email, source) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .info { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .label { font-weight: bold; color: #4b5563; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>📧 New Newsletter Subscriber</h2>
        
        <div class="info">
          <p><span class="label">Email:</span> ${email}</p>
          <p><span class="label">Source:</span> ${source || 'Website'}</p>
          <p><span class="label">Date:</span> ${new Date().toLocaleString()}</p>
        </div>
        
        <p>This subscriber has been added to our newsletter list and received the welcome email sequence.</p>
        
        <p><strong>Next Steps:</strong></p>
        <ul>
          <li>Add to CRM for nurture sequence</li>
          <li>Monitor engagement with welcome series</li>
          <li>Consider personal outreach if B2B email domain</li>
        </ul>
        
        <p>View all subscribers in the <a href="${process.env.VITE_SITE_URL || 'https://www.app-suite.io'}/admin">Admin Dashboard</a></p>
      </div>
    </body>
    </html>
  `;
}