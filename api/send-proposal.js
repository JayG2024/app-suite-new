// App Suite Proposal Email API
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
    const { clientData, proposalPDF, proposalUrl, accessCode, leadData } = req.body;

    // Validate required data
    if (!clientData || !clientData.email || !clientData.companyName) {
      return res.status(400).json({ 
        error: 'Missing required client data',
        required: ['clientData.email', 'clientData.companyName']
      });
    }

    const results = [];

    // 1. Send proposal to client
    if (process.env.RESEND_API_KEY) {
      try {
        const clientEmail = await resend.emails.send({
          from: 'App Suite <proposals@app-suite.io>',
          to: clientData.email,
          subject: `Your Custom Software Proposal - ${clientData.companyName}`,
          html: generateProposalEmailHTML(clientData, proposalUrl, accessCode),
          // TODO: Add PDF attachment when proposalPDF is available
          // attachments: proposalPDF ? [{
          //   filename: `${clientData.companyName}_Proposal.pdf`,
          //   content: proposalPDF
          // }] : []
        });

        results.push({ 
          type: 'client_email', 
          status: 'success', 
          id: clientEmail.data?.id,
          to: clientData.email 
        });

      } catch (emailError) {
        console.error('Client email error:', emailError);
        results.push({ 
          type: 'client_email', 
          status: 'error', 
          error: emailError.message 
        });
      }
    }

    // 2. Notify team about new lead
    if (process.env.RESEND_API_KEY && leadData) {
      try {
        const teamEmail = await resend.emails.send({
          from: 'App Suite <notifications@app-suite.io>',
          to: 'jason@jaydus.ai',
          subject: `🎯 New Lead: ${clientData.companyName} - $${leadData.estimatedValue}`,
          html: generateTeamNotificationHTML(clientData, leadData)
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
    }

    // 3. Schedule follow-up email sequence (future enhancement)
    // TODO: Implement automated follow-up sequence
    
    res.status(200).json({
      success: true,
      message: 'Proposal emails processed',
      results: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Proposal email API error:', error);
    res.status(500).json({
      error: 'Failed to send proposal emails',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// Generate professional proposal email HTML
function generateProposalEmailHTML(clientData, proposalUrl, accessCode) {
  const appType = clientData.appType || clientData.projectType || 'custom';
  const appTypeLabel = getAppTypeLabel(appType);
  const budget = clientData.budget || '5000';
  const packageInfo = getPackageInfo(budget);
  const features = clientData.desiredFeatures || [];
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Custom ${appTypeLabel} Proposal - App Suite</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.6; 
          color: #1a1a1a; 
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .wrapper { background-color: #f5f5f5; padding: 20px 0; }
        .container { 
          max-width: 700px; 
          margin: 0 auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 { margin: 0 0 10px 0; font-size: 32px; }
        .header p { margin: 0; opacity: 0.9; font-size: 18px; }
        .logo { 
          display: inline-block;
          background: rgba(255,255,255,0.2);
          padding: 8px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-weight: bold;
        }
        .content { padding: 40px 30px; }
        .section { margin-bottom: 35px; }
        h2 { 
          color: #1a1a1a; 
          font-size: 24px; 
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e5e7eb;
        }
        h3 { color: #333; font-size: 18px; margin-bottom: 12px; }
        .highlight-box { 
          background: #f8f9fa; 
          border-left: 4px solid #667eea; 
          padding: 20px; 
          margin: 25px 0; 
          border-radius: 0 8px 8px 0;
        }
        .challenge-box {
          background: #f0f7ff;
          border-left: 4px solid #667eea;
          padding: 20px;
          margin: 25px 0;
          border-radius: 0 8px 8px 0;
        }
        .challenge-box h4 { color: #667eea; margin-bottom: 10px; }
        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .meta-item { text-align: center; }
        .meta-label { 
          font-size: 12px; 
          color: #666; 
          text-transform: uppercase; 
          letter-spacing: 0.5px;
        }
        .meta-value { 
          font-size: 18px; 
          font-weight: 600; 
          color: #1a1a1a; 
          margin-top: 5px;
        }
        .button { 
          display: inline-block; 
          background: #667eea; 
          color: white; 
          padding: 14px 28px; 
          text-decoration: none; 
          border-radius: 8px; 
          margin: 10px 5px; 
          font-weight: 600;
          text-align: center;
        }
        .button-secondary {
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;
        }
        .feature-list {
          background: #fafafa;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .feature-item {
          display: flex;
          align-items: start;
          margin-bottom: 12px;
        }
        .feature-icon {
          color: #10b981;
          margin-right: 10px;
          font-size: 20px;
        }
        .timeline {
          margin: 20px 0;
        }
        .timeline-item {
          display: flex;
          align-items: start;
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .timeline-marker {
          width: 40px;
          height: 40px;
          background: #667eea;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 15px;
          flex-shrink: 0;
        }
        .timeline-content h4 { margin: 0 0 5px 0; color: #1a1a1a; }
        .timeline-content p { margin: 0; font-size: 14px; color: #666; }
        .pricing-box {
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          margin: 20px 0;
        }
        .price {
          font-size: 48px;
          font-weight: 700;
          color: #667eea;
          margin: 10px 0;
        }
        .price-subtitle {
          font-size: 18px;
          color: #666;
        }
        .cta-section {
          background: #1a1a1a;
          color: white;
          padding: 40px;
          border-radius: 12px;
          text-align: center;
          margin: 30px 0;
        }
        .cta-section h3 { color: white; margin-bottom: 15px; }
        .footer { 
          background: #f8f9fa; 
          padding: 30px; 
          text-align: center; 
          border-top: 1px solid #e5e7eb;
        }
        ul { padding-left: 20px; }
        li { margin-bottom: 8px; }
        a { color: #667eea; }
        @media (max-width: 600px) {
          .meta-grid { grid-template-columns: 1fr; }
          .content { padding: 30px 20px; }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <div class="logo">AI App Suite</div>
            <h1>Your Custom ${appTypeLabel} Solution</h1>
            <p>Built specifically for ${clientData.companyName} - Own, Don't Rent</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h2>Hi ${clientData.contactName}! 👋</h2>
              <p>Thank you for your interest in custom software development with App Suite. Based on your requirements, I've prepared a comprehensive proposal for ${clientData.companyName}.</p>
              
              <div class="challenge-box">
                <h4>Your Challenge</h4>
                <p>"${clientData.currentChallenge || 'Streamline business operations with custom software'}"</p>
              </div>
              
              <p>We specialize in building AI-powered business applications that businesses <strong>own, not rent</strong>. Your custom solution will be built from scratch, tailored specifically to your workflow.</p>
            </div>

            <div class="section">
              <h2>Proposal Overview</h2>
              <div class="meta-grid">
                <div class="meta-item">
                  <div class="meta-label">Project Type</div>
                  <div class="meta-value">${appTypeLabel}</div>
                </div>
                <div class="meta-item">
                  <div class="meta-label">Investment</div>
                  <div class="meta-value">$${parseInt(budget).toLocaleString()}</div>
                </div>
                <div class="meta-item">
                  <div class="meta-label">Timeline</div>
                  <div class="meta-value">${clientData.timeline || '6-8 weeks'}</div>
                </div>
                <div class="meta-item">
                  <div class="meta-label">Team Size</div>
                  <div class="meta-value">${clientData.teamSize || 'Scalable'}</div>
                </div>
              </div>
            </div>

            <div class="section">
              <h2>Your Custom Solution</h2>
              <p>Based on your challenge, we'll build a custom ${appTypeLabel} application that directly addresses your pain points and streamlines your workflow. This isn't a template or modified SaaS product - it's built from scratch for ${clientData.companyName}.</p>
              
              <div class="highlight-box">
                <h4>✨ What Makes This Different</h4>
                <p>Unlike subscription-based software that you rent monthly, this application becomes your property. You own the source code, control the data, and can modify it anytime.</p>
              </div>
              
              ${features.length > 0 ? `
              <h3>Core Features Included</h3>
              <div class="feature-list">
                ${features.map(feature => `
                  <div class="feature-item">
                    <span class="feature-icon">✓</span>
                    <div>
                      <strong>${getFeatureLabel(feature)}</strong><br>
                      <span style="font-size: 14px; color: #666;">${getFeatureDescription(feature)}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
              ` : ''}
            </div>

            <div class="section">
              <h2>Development Timeline & Process</h2>
              <p>Your application will be delivered using our proven 5-phase methodology in 6-8 weeks:</p>
              
              <div class="timeline">
                <div class="timeline-item">
                  <div class="timeline-marker">1</div>
                  <div class="timeline-content">
                    <h4>Discovery & Planning - Week 1</h4>
                    <p>Requirements gathering, business analysis, and project planning</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-marker">2</div>
                  <div class="timeline-content">
                    <h4>Design & Architecture - Week 2</h4>
                    <p>UI/UX design, database planning, and system architecture</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-marker">3</div>
                  <div class="timeline-content">
                    <h4>AI-Powered Development - Weeks 3-5</h4>
                    <p>Rapid development with automated testing and quality assurance</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-marker">4</div>
                  <div class="timeline-content">
                    <h4>Testing & Launch - Weeks 6-8</h4>
                    <p>Comprehensive testing, deployment, and team training</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="section">
              <h2>Investment & Package Details</h2>
              <div class="pricing-box">
                <div class="meta-label">Selected Package</div>
                <div style="font-size: 24px; font-weight: 600; margin: 10px 0;">${packageInfo.name}</div>
                <div class="price">$${parseInt(budget).toLocaleString()}</div>
                <div class="price-subtitle">${packageInfo.description}</div>
              </div>
              
              <h3>What's Included</h3>
              <ul>
                ${packageInfo.includes.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>

            ${proposalUrl ? `
            <div class="proposal-access-section" style="background: #f0f7ff; border: 2px solid #667eea; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center;">
              <h3 style="color: #667eea; margin-bottom: 15px;">🔐 Your Complete Proposal</h3>
              <p style="margin-bottom: 20px;">View your full interactive proposal with detailed timeline, features breakdown, and project specifications:</p>
              
              <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e5e7eb;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">Secure Proposal URL:</p>
                <a href="${proposalUrl}" class="button" style="font-size: 16px; margin-bottom: 15px;">📋 View Full Proposal</a>
                <div style="background: #f9fafb; padding: 12px; border-radius: 6px; margin-top: 15px;">
                  <p style="margin: 0; font-size: 14px; color: #374151;"><strong>Access Code:</strong> <code style="background: #1f2937; color: white; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${accessCode}</code></p>
                  <p style="margin: 5px 0 0 0; font-size: 12px; color: #6b7280;">This proposal is private and expires in 30 days</p>
                </div>
              </div>
            </div>
            ` : ''}

            <div class="cta-section">
              <h3>Ready to Transform Your Business?</h3>
              <p>Let's schedule a 30-minute discovery call to finalize your requirements and get started.</p>
              <div style="margin-top: 25px;">
                <a href="https://app-suite.io/contact" class="button">📅 Schedule Discovery Call</a>
                <a href="https://app-suite.io/portfolio/webaudit-dashboard" class="button button-secondary">🔍 View Similar Projects</a>
              </div>
            </div>

            <div class="section">
              <h3>Why Choose App Suite?</h3>
              <ul>
                <li>✅ <strong>100% Code Ownership</strong> - You own everything we build</li>
                <li>✅ <strong>Transparent Pricing</strong> - No hidden costs or hourly billing</li>
                <li>✅ <strong>AI-Powered Development</strong> - 10x faster delivery with Claude & GPT-4</li>
                <li>✅ <strong>Proven Track Record</strong> - 100+ successful applications delivered</li>
                <li>✅ <strong>Ongoing Support</strong> - We're your long-term technology partner</li>
              </ul>
            </div>

            <p>Questions? Simply reply to this email - I typically respond within 2 hours during business days.</p>
            
            <p>Looking forward to building something amazing together!</p>
            
            <p>Best regards,<br>
            <strong>Jason Gordon</strong><br>
            Founder & Lead Developer<br>
            App Suite<br>
            📧 jason@jaydus.ai | 📱 (833) APP-SUIT</p>
          </div>
          
          <div class="footer">
            <p><strong>🌟 App Suite</strong> - Building AI-powered applications that businesses own, not rent</p>
            <p>
              <a href="https://app-suite.io">app-suite.io</a> | 
              <a href="https://app-suite.io/examples">View Portfolio</a> |
              <a href="https://app-suite.io/documentation/process">How We Work</a>
            </p>
            <p style="font-size: 12px; color: #666; margin-top: 20px;">
              This proposal is valid for 30 days from ${new Date().toLocaleDateString()}. 
              Your proposal PDF is attached to this email.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Helper functions for email template
function getAppTypeLabel(appType) {
  const types = {
    crm: 'CRM System',
    dashboard: 'Analytics Dashboard',
    inventory: 'Inventory Management',
    booking: 'Booking System',
    ecommerce: 'E-commerce Platform',
    project: 'Project Management',
    finance: 'Financial Management',
    custom: 'Custom Application'
  };
  return types[appType] || 'Custom Application';
}

function getPackageInfo(budget) {
  switch(budget) {
    case '7500':
      return {
        name: 'AI-Enhanced Solution',
        description: 'Advanced applications with AI capabilities',
        includes: [
          'Everything in Standard Package',
          'AI model integration (GPT-4, Claude, etc.)',
          'Intelligent automation workflows',
          'Natural language processing features',
          'Advanced analytics with AI insights',
          '30-day post-launch support'
        ]
      };
    case '10000':
      return {
        name: 'Enterprise AI Solution',
        description: 'Complex systems with multi-AI orchestration',
        includes: [
          'Everything in AI-Enhanced Package',
          'Multiple AI model orchestration',
          'Advanced security & compliance features',
          'Custom reporting & business intelligence',
          'Priority development & support',
          '30-day post-launch support'
        ]
      };
    default:
      return {
        name: 'Standard Application',
        description: 'Perfect for custom dashboard applications',
        includes: [
          'Custom dashboard tailored to your business',
          'User authentication & role management',
          'Database design & implementation',
          'Responsive design (all devices)',
          '30-day post-launch support',
          'Complete source code ownership'
        ]
      };
  }
}

function getFeatureLabel(feature) {
  const featureMap = {
    ai: 'AI Integration',
    auth: 'User Management',
    mobile: 'Mobile Responsive',
    api: 'API Integrations',
    analytics: 'Advanced Analytics',
    automation: 'Workflow Automation',
    notifications: 'Notifications',
    search: 'Advanced Search',
    export: 'Data Export',
    calendar: 'Calendar Integration',
    files: 'File Management',
    realtime: 'Real-time Updates'
  };
  return featureMap[feature] || feature;
}

function getFeatureDescription(feature) {
  const descriptionMap = {
    ai: 'GPT-4, Claude, automated insights',
    auth: 'Roles, permissions, authentication',
    mobile: 'Works on all devices',
    api: 'Connect to existing systems',
    analytics: 'Reports and data visualization',
    automation: 'Automated processes and triggers',
    notifications: 'Email, SMS, in-app alerts',
    search: 'AI-powered data search',
    export: 'PDF, CSV, API exports',
    calendar: 'Scheduling and calendar sync',
    files: 'Upload, store, organize documents',
    realtime: 'Live data synchronization'
  };
  return descriptionMap[feature] || '';
}

// Generate team notification email
function generateTeamNotificationHTML(clientData, leadData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
        .alert { background: #10b981; color: white; padding: 20px; border-radius: 8px; }
        .details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="alert">
        <h2>🎯 New Qualified Lead!</h2>
        <p><strong>${clientData.companyName}</strong> just generated a proposal</p>
      </div>
      
      <div class="details">
        <h3>📊 Lead Details:</h3>
        <ul>
          <li><strong>Company:</strong> ${clientData.companyName}</li>
          <li><strong>Contact:</strong> ${clientData.contactName}</li>
          <li><strong>Email:</strong> ${clientData.email}</li>
          <li><strong>Phone:</strong> ${clientData.phone || 'Not provided'}</li>
          <li><strong>Industry:</strong> ${clientData.industry || 'Not specified'}</li>
          <li><strong>Project Type:</strong> ${leadData.projectType}</li>
          <li><strong>Estimated Value:</strong> $${leadData.estimatedValue}</li>
          <li><strong>Features:</strong> ${leadData.features?.join(', ') || 'Standard features'}</li>
        </ul>
        
        <h3>⚡ Next Actions:</h3>
        <ul>
          <li>Follow up within 24 hours</li>
          <li>Review proposal details</li>
          <li>Schedule discovery call</li>
          <li>Add to Command Center pipeline</li>
        </ul>
      </div>
      
      <p>Generated at: ${new Date().toLocaleString()}</p>
    </body>
    </html>
  `;
}