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

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
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
    const { 
      name, 
      email, 
      phone, 
      company, 
      projectDescription, 
      projectDetails, 
      timestamp 
    } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !phone) {
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

    // Admin email content
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
          New Financing Application Received
        </h2>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #555; margin-top: 0;">Applicant Information:</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 150px;">Name:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Company:</td>
              <td style="padding: 8px 0;">${company || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #0066cc;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #0066cc;">${phone}</a></td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #555; margin-top: 0;">Project Details:</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 200px;">Project Type:</td>
              <td style="padding: 8px 0;">${projectDetails.projectType}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Total Project Cost:</td>
              <td style="padding: 8px 0; font-size: 18px; color: #0066cc;">${formatCurrency(projectDetails.totalProjectCost)}</td>
            </tr>
            ${projectDetails.needFinancing ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Down Payment:</td>
                <td style="padding: 8px 0;">${formatCurrency(projectDetails.downPayment)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Amount to Finance:</td>
                <td style="padding: 8px 0;">${formatCurrency(projectDetails.amountToFinance)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Financing Term:</td>
                <td style="padding: 8px 0;">${projectDetails.financingTerm} months</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Monthly Payment:</td>
                <td style="padding: 8px 0; font-size: 18px; color: #0066cc;">${formatCurrency(projectDetails.monthlyPayment)}/month</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Total with Financing:</td>
                <td style="padding: 8px 0;">${formatCurrency(projectDetails.totalWithFinancing)}</td>
              </tr>
            ` : `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Payment Method:</td>
                <td style="padding: 8px 0;">Full Payment or 50/50 Split</td>
              </tr>
            `}
          </table>
          
          ${projectDescription ? `
            <div style="margin-top: 15px;">
              <strong>Project Description:</strong>
              <p style="margin: 10px 0; padding: 10px; background-color: white; border-radius: 4px;">
                ${projectDescription}
              </p>
            </div>
          ` : ''}
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
          <h4 style="margin: 0 0 10px 0; color: #856404;">Action Required:</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Review application details</li>
            <li>Run credit check if financing requested</li>
            <li>Prepare contract and payment terms</li>
            <li>Contact applicant within 24 hours</li>
          </ul>
        </div>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px;">
          Application submitted on ${new Date(timestamp).toLocaleString()} via App Suite Financing Calculator
        </p>
      </div>
    `;

    // Client email content
    const clientEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0066cc; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Application Received!</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px;">Hi ${name},</p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Thank you for submitting your ${projectDetails.needFinancing ? 'financing' : 'project'} application 
            for <strong>${projectDetails.projectType}</strong>. We've received your information and will review 
            it promptly.
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Application Summary:</h3>
            
            <table style="width: 100%;">
              <tr>
                <td style="padding: 8px 0;">Project Type:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${projectDetails.projectType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">Total Cost:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${formatCurrency(projectDetails.totalProjectCost)}</td>
              </tr>
              ${projectDetails.needFinancing ? `
                <tr>
                  <td style="padding: 8px 0;">Monthly Payment:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #0066cc;">
                    ${formatCurrency(projectDetails.monthlyPayment)}/mo
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">Term:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold;">${projectDetails.financingTerm} months</td>
                </tr>
              ` : ''}
            </table>
          </div>
          
          <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #0066cc; margin-top: 0;">What Happens Next?</h4>
            <ol style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 10px;">We'll review your application (1-2 hours)</li>
              <li style="margin-bottom: 10px;">You'll receive approval notification within 24 hours</li>
              <li style="margin-bottom: 10px;">We'll schedule a project kickoff meeting</li>
              <li style="margin-bottom: 10px;">Development begins immediately after contract signing</li>
            </ol>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">
            If you have any questions about your application or need to make changes, 
            please don't hesitate to reach out.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; margin: 0;">Best regards,</p>
            <p style="color: #666; margin: 5px 0;"><strong>The App Suite Team</strong></p>
            <p style="color: #666; margin: 5px 0;">
              Email: <a href="mailto:jason@jaydus.ai" style="color: #0066cc;">jason@jaydus.ai</a><br>
              Website: <a href="https://app-suite.io" style="color: #0066cc;">app-suite.io</a>
            </p>
          </div>
        </div>
      </div>
    `;

    // Send admin email
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'noreply@app-suite.io',
      to: 'jason@jaydus.ai',
      subject: `New Financing Application: ${name} - ${projectDetails.projectType}`,
      html: adminEmailContent,
    });

    // Send client confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'noreply@app-suite.io',
      to: email,
      subject: 'Application Received - App Suite',
      html: clientEmailContent,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Application submitted successfully' 
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error processing financing application:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process application',
        details: error.message 
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};