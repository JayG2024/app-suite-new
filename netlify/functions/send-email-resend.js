// Resend Email Service for App Suite Transactional Emails
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
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
    const { 
      type, 
      to, 
      from = 'App Suite <noreply@app-suite.io>',
      subject,
      content,
      data = {}
    } = JSON.parse(event.body);

    if (!to || !type) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: to, type' })
      };
    }

    // Email templates and content
    const emailTemplates = {
      proposal_sent: {
        subject: data.subject || `Your Custom Application Proposal - ${data.companyName || 'Business'}`,
        html: generateProposalEmail(data),
        text: generateProposalEmailText(data)
      },
      
      project_kickoff: {
        subject: data.subject || `Welcome to App Suite - ${data.projectName || 'Your Project'} Kickoff`,
        html: generateKickoffEmail(data),
        text: generateKickoffEmailText(data)
      },
      
      project_update: {
        subject: data.subject || `Project Update: ${data.projectName || 'Your Project'}`,
        html: generateProjectUpdateEmail(data),
        text: generateProjectUpdateEmailText(data)
      },
      
      project_completion: {
        subject: data.subject || `🎉 Your Project is Complete - ${data.projectName || 'Project'}`,
        html: generateCompletionEmail(data),
        text: generateCompletionEmailText(data)
      },
      
      invoice_sent: {
        subject: data.subject || `Invoice from App Suite - ${data.invoiceNumber || 'Invoice'}`,
        html: generateInvoiceEmail(data),
        text: generateInvoiceEmailText(data)
      },
      
      demo_booking: {
        subject: data.subject || 'Demo Booking Confirmation - App Suite',
        html: generateDemoBookingEmail(data),
        text: generateDemoBookingEmailText(data)
      },
      
      welcome: {
        subject: data.subject || 'Welcome to App Suite!',
        html: generateWelcomeEmail(data),
        text: generateWelcomeEmailText(data)
      },
      
      custom: {
        subject: subject || 'Message from App Suite',
        html: content || data.htmlContent || '<p>Custom email content</p>',
        text: data.textContent || 'Custom email content'
      }
    };

    const template = emailTemplates[type];
    if (!template) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: `Unknown email type: ${type}` })
      };
    }

    // Send email via Resend
    const result = await resend.emails.send({
      from: from,
      to: Array.isArray(to) ? to : [to],
      subject: template.subject,
      html: template.html,
      text: template.text,
      // Add tracking and analytics
      tags: [
        { name: 'category', value: type },
        { name: 'project', value: data.projectName || 'general' }
      ],
      headers: {
        'X-Entity-Ref-ID': data.referenceId || Date.now().toString()
      }
    });

    // Log email activity if project_id is provided
    if (data.project_id) {
      try {
        // This would typically log to your database
        console.log(`Email logged for project ${data.project_id}: ${type}`);
      } catch (logError) {
        console.error('Failed to log email activity:', logError);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        messageId: result.data?.id,
        message: `${type} email sent successfully`,
        result: result.data
      })
    };

  } catch (error) {
    console.error('Resend email error:', error);
    
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

// Email Template Generators
function generateProposalEmail(data) {
  const { 
    companyName = 'Your Business', 
    contactName = 'Business Owner',
    proposalUrl,
    packageType = 'Standard',
    estimatedValue = '$7,500',
    timeline = '30 days'
  } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Custom Application Proposal</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #000; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .highlight { background: #e8f4fd; padding: 15px; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Your Custom Application Proposal</h1>
      <p>Built specifically for ${companyName}</p>
    </div>
    
    <div class="content">
      <p>Hi ${contactName},</p>
      
      <p>Thank you for your interest in App Suite! I'm excited to present your custom application proposal.</p>
      
      <div class="highlight">
        <h3>📋 Proposal Summary</h3>
        <ul>
          <li><strong>Package:</strong> ${packageType}</li>
          <li><strong>Investment:</strong> ${estimatedValue}</li>
          <li><strong>Timeline:</strong> ${timeline}</li>
          <li><strong>Code Ownership:</strong> 100% yours</li>
        </ul>
      </div>
      
      ${proposalUrl ? `
      <div style="text-align: center;">
        <a href="${proposalUrl}" class="button">📄 View Your Proposal</a>
      </div>
      ` : ''}
      
      <p><strong>What happens next?</strong></p>
      <ol>
        <li>Review your detailed proposal</li>
        <li>Schedule a 30-minute consultation call</li>
        <li>Finalize requirements and timeline</li>
        <li>Begin development within 7 days</li>
      </ol>
      
      <p>Questions? Simply reply to this email or call me directly at <strong>(555) 123-4567</strong>.</p>
      
      <p>Looking forward to building something amazing together!</p>
      
      <p>Best regards,<br>
      <strong>Jason Gordon</strong><br>
      Founder, App Suite<br>
      jason@app-suite.io</p>
    </div>
    
    <div class="footer">
      <p>App Suite | Custom Business Applications<br>
      Stop renting software. Own it.</p>
    </div>
  </div>
</body>
</html>`;
}

function generateProposalEmailText(data) {
  const { 
    companyName = 'Your Business', 
    contactName = 'Business Owner',
    proposalUrl,
    packageType = 'Standard',
    estimatedValue = '$7,500',
    timeline = '30 days'
  } = data;

  return `
Your Custom Application Proposal - ${companyName}

Hi ${contactName},

Thank you for your interest in App Suite! I'm excited to present your custom application proposal.

PROPOSAL SUMMARY:
• Package: ${packageType}
• Investment: ${estimatedValue}
• Timeline: ${timeline}
• Code Ownership: 100% yours

${proposalUrl ? `View Your Proposal: ${proposalUrl}` : ''}

What happens next?
1. Review your detailed proposal
2. Schedule a 30-minute consultation call
3. Finalize requirements and timeline
4. Begin development within 7 days

Questions? Simply reply to this email or call me directly at (555) 123-4567.

Looking forward to building something amazing together!

Best regards,
Jason Gordon
Founder, App Suite
jason@app-suite.io

App Suite | Custom Business Applications
Stop renting software. Own it.
`;
}

function generateKickoffEmail(data) {
  const { 
    contactName = 'Business Owner',
    projectName = 'Your Project',
    startDate = 'this week',
    teamMembers = ['Jason Gordon (Lead Developer)'],
    nextSteps = ['Discovery call', 'Requirements gathering', 'Technical planning']
  } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Kickoff - ${projectName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .highlight { background: #dcfce7; padding: 15px; border-radius: 6px; margin: 20px 0; }
    .team-member { background: white; padding: 10px; margin: 5px 0; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to App Suite!</h1>
      <p>Your project "${projectName}" is officially starting</p>
    </div>
    
    <div class="content">
      <p>Hi ${contactName},</p>
      
      <p>Exciting news! Your custom application project is officially kicking off ${startDate}.</p>
      
      <div class="highlight">
        <h3>👥 Your Dedicated Team</h3>
        ${teamMembers.map(member => `<div class="team-member">${member}</div>`).join('')}
      </div>
      
      <h3>📋 Next Steps</h3>
      <ol>
        ${nextSteps.map(step => `<li>${step}</li>`).join('')}
      </ol>
      
      <p><strong>What to expect:</strong></p>
      <ul>
        <li>Daily progress updates</li>
        <li>Direct access to your development team</li>
        <li>Weekly milestone reviews</li>
        <li>Real-time project dashboard access</li>
      </ul>
      
      <p>You'll receive your project dashboard access within 24 hours.</p>
      
      <p>Ready to build something amazing!</p>
      
      <p>Best regards,<br>
      <strong>Jason Gordon</strong><br>
      Founder, App Suite</p>
    </div>
  </div>
</body>
</html>`;
}

function generateKickoffEmailText(data) {
  const { 
    contactName = 'Business Owner',
    projectName = 'Your Project',
    startDate = 'this week',
    teamMembers = ['Jason Gordon (Lead Developer)'],
    nextSteps = ['Discovery call', 'Requirements gathering', 'Technical planning']
  } = data;

  return `
Welcome to App Suite! - ${projectName}

Hi ${contactName},

Exciting news! Your custom application project is officially kicking off ${startDate}.

YOUR DEDICATED TEAM:
${teamMembers.map(member => `• ${member}`).join('\n')}

NEXT STEPS:
${nextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

What to expect:
• Daily progress updates
• Direct access to your development team
• Weekly milestone reviews
• Real-time project dashboard access

You'll receive your project dashboard access within 24 hours.

Ready to build something amazing!

Best regards,
Jason Gordon
Founder, App Suite
`;
}

// Add more template generators for other email types...
function generateProjectUpdateEmail(data) {
  return `<p>Project update email template - implement based on your needs</p>`;
}

function generateProjectUpdateEmailText(data) {
  return `Project update email template - implement based on your needs`;
}

function generateCompletionEmail(data) {
  return `<p>Project completion email template - implement based on your needs</p>`;
}

function generateCompletionEmailText(data) {
  return `Project completion email template - implement based on your needs`;
}

function generateInvoiceEmail(data) {
  return `<p>Invoice email template - implement based on your needs</p>`;
}

function generateInvoiceEmailText(data) {
  return `Invoice email template - implement based on your needs`;
}

function generateDemoBookingEmail(data) {
  return `<p>Demo booking email template - implement based on your needs</p>`;
}

function generateDemoBookingEmailText(data) {
  return `Demo booking email template - implement based on your needs`;
}

function generateWelcomeEmail(data) {
  return `<p>Welcome email template - implement based on your needs</p>`;
}

function generateWelcomeEmailText(data) {
  return `Welcome email template - implement based on your needs`;
}