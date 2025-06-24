// Netlify function for sending emails
const nodemailer = require('nodemailer');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Create transporter (configure with your email service)
const createTransporter = () => {
  // Using SendGrid (recommended for production)
  if (process.env.SENDGRID_API_KEY) {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return {
      sendMail: async (mailOptions) => {
        await sgMail.send({
          to: mailOptions.to,
          from: mailOptions.from || process.env.EMAIL_FROM || `noreply@${process.env.VITE_SITE_URL ? new URL(process.env.VITE_SITE_URL).hostname.replace('www.', '') : 'localhost'}`,
          subject: mailOptions.subject,
          text: mailOptions.text,
          html: mailOptions.html
        });
      }
    };
  }
  
  // Fallback to SMTP
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

exports.handler = async (event, context) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { to, subject, text, html, from, replyTo } = JSON.parse(event.body);
    
    if (!to || !subject || (!text && !html)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: to, subject, and either text or html' })
      };
    }
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: from || process.env.EMAIL_FROM || `App Suite <noreply@${process.env.VITE_SITE_URL ? new URL(process.env.VITE_SITE_URL).hostname.replace('www.', '') : 'localhost'}>`,
      to,
      subject,
      text,
      html,
      replyTo: replyTo || from
    };
    
    await transporter.sendMail(mailOptions);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully' 
      })
    };
    
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      })
    };
  }
};