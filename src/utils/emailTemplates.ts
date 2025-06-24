import { ProposalData } from '@/components/ProposalGenerator';

export const generateProposalEmailHTML = (formData: ProposalData): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Custom Application Proposal</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f8f9fa;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content {
      padding: 40px 30px;
    }
    .highlight-box {
      background: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
    }
    .cta-button {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      background: #f8f9fa;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 5px 0;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Custom Proposal is Ready!</h1>
      <p>Tailored specifically for ${formData.companyName}</p>
    </div>
    
    <div class="content">
      <p>Dear ${formData.contactName},</p>
      
      <p>Thank you for your interest in App Suite! We've analyzed your requirements for a ${formData.appType} application and created a comprehensive proposal just for you.</p>
      
      <div class="highlight-box">
        <h3 style="margin-top: 0; color: #667eea;">Your Challenge</h3>
        <p style="margin-bottom: 0;">"${formData.currentChallenge}"</p>
      </div>
      
      <p><strong>What's included in your proposal:</strong></p>
      <ul>
        <li>Custom solution designed for the ${formData.industry} industry</li>
        <li>AI-powered features tailored to your needs</li>
        <li>Detailed pricing breakdown and timeline</li>
        <li>Technical specifications and feature list</li>
        <li>Implementation roadmap</li>
        <li>ROI analysis and business impact</li>
      </ul>
      
      <p>Your proposal is attached as a PDF. We've designed this solution to address your specific challenges while leveraging cutting-edge AI technology.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://calendly.com/app-suite/discovery-call" class="cta-button">
          Schedule Your Discovery Call
        </a>
      </div>
      
      <p>Ready to get started? I'd love to discuss your project in detail and answer any questions you might have.</p>
      
      <p>Best regards,<br>
      <strong>Jason Gordon</strong><br>
      Founder & Lead Developer<br>
      App Suite</p>
    </div>
    
    <div class="footer">
      <p><strong>App Suite</strong> - Building AI-powered applications that businesses own, not rent.</p>
      <p>📧 jason@jaydus.ai | 📱 (833) APP-SUIT</p>
      <p>This proposal is valid for 30 days from today.</p>
    </div>
  </div>
</body>
</html>
`;
};

export const generateNotificationEmailHTML = (formData: ProposalData): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>New Proposal Generated - ${formData.companyName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 20px;
      background-color: #f8f9fa;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      border-bottom: 2px solid #667eea;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 20px 0;
    }
    .info-item {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
    }
    .info-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .info-value {
      font-weight: 600;
      color: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 New Proposal Generated!</h1>
      <p>A new custom proposal has been generated and sent to a potential client.</p>
    </div>
    
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Company</div>
        <div class="info-value">${formData.companyName}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Contact</div>
        <div class="info-value">${formData.contactName}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Email</div>
        <div class="info-value">${formData.email}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Industry</div>
        <div class="info-value">${formData.industry}</div>
      </div>
      <div class="info-item">
        <div class="info-label">App Type</div>
        <div class="info-value">${formData.appType}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Budget</div>
        <div class="info-value">$${formData.budget}</div>
      </div>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #667eea;">Challenge</h3>
      <p style="margin-bottom: 0;">"${formData.currentChallenge}"</p>
    </div>
    
    <div>
      <h3>Selected Features</h3>
      <ul>
        ${formData.desiredFeatures.map(feature => `<li>${feature}</li>`).join('')}
      </ul>
    </div>
    
    ${formData.additionalInfo ? `
    <div>
      <h3>Additional Information</h3>
      <p>${formData.additionalInfo}</p>
    </div>
    ` : ''}
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p><strong>Next Steps:</strong></p>
      <ol>
        <li>Follow up with the client within 24 hours</li>
        <li>Schedule a discovery call to discuss details</li>
        <li>Customize the proposal if needed</li>
        <li>Move to contract phase</li>
      </ol>
    </div>
    
    <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
      <p>Generated at ${new Date().toLocaleString()}</p>
    </div>
  </div>
</body>
</html>
`;
};