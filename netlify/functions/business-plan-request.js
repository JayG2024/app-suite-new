const nodemailer = require("nodemailer");

// Create transporter with proper error handling
const createTransporter = () => {
  const emailService = process.env.EMAIL_SERVICE || 'gmail';
  
  if (emailService === 'gmail') {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else if (emailService === 'resend') {
    return nodemailer.createTransporter({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    });
  }
};

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    };
  }

  try {
    const { businessPlan, name, phone, timestamp } = JSON.parse(event.body);

    // Validate required fields
    if (!businessPlan || !name || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
    }

    // Create email transporter
    const transporter = createTransporter();

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@app-suite.io',
      to: 'jason@jaydus.ai',
      subject: `Business Plan Request: ${businessPlan}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Business Plan Request</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Request Details:</h3>
            
            <p style="margin: 10px 0;">
              <strong>Business Plan Requested:</strong><br>
              <span style="font-size: 18px; color: #0066cc;">${businessPlan}</span>
            </p>
            
            <p style="margin: 10px 0;">
              <strong>Name:</strong><br>
              ${name}
            </p>
            
            <p style="margin: 10px 0;">
              <strong>Phone Number:</strong><br>
              <a href="tel:${phone}" style="color: #0066cc;">${phone}</a>
            </p>
            
            <p style="margin: 10px 0;">
              <strong>Submitted At:</strong><br>
              ${new Date(timestamp).toLocaleString()}
            </p>
          </div>
          
          <div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #0066cc;">
              <strong>Action Required:</strong> Send the ${businessPlan} business plan to this prospect within 24 hours.
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            This request was submitted from the App Suite website (Solutions We've Built page).
          </p>
        </div>
      `,
      text: `
        New Business Plan Request
        
        Business Plan Requested: ${businessPlan}
        Name: ${name}
        Phone: ${phone}
        Submitted: ${new Date(timestamp).toLocaleString()}
        
        Action Required: Send the ${businessPlan} business plan to this prospect within 24 hours.
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to requester if email was provided
    if (process.env.SEND_CONFIRMATIONS === 'true') {
      // Optional: Add confirmation email logic here
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Business plan request submitted successfully' 
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error processing business plan request:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process request',
        details: error.message 
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};