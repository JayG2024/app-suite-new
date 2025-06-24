// Netlify function for sending emails
// Simplified version - logs email instead of sending

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export const handler = async (event, context) => {
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
    
    // For now, just log the email details
    console.log('Email would be sent:', {
      from: from || process.env.EMAIL_FROM || 'App Suite <noreply@app-suite.io>',
      to,
      subject,
      text: text || 'No text content',
      replyTo: replyTo || from
    });
    
    // TODO: Implement actual email sending with SendGrid or SMTP
    // This requires proper setup in Netlify environment
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email logged successfully (sending disabled in demo)' 
      })
    };
    
  } catch (error) {
    console.error('Email handling error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process email request',
        details: error.message 
      })
    };
  }
};