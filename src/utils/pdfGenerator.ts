import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ProposalData } from '@/components/ProposalGenerator';

// Function to generate PDF from form data
export const generateProposalPDF = async (formData: ProposalData): Promise<Blob> => {
  const htmlContent = generateProposalHTML(formData);
  
  // Create a temporary container with better styling for PDF
  const container = document.createElement('div');
  container.innerHTML = htmlContent;
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '210mm'; // A4 width
  container.style.maxWidth = '210mm';
  container.style.minHeight = '297mm'; // A4 height
  container.style.backgroundColor = 'white';
  container.style.fontFamily = 'Arial, sans-serif'; // Fallback font
  document.body.appendChild(container);

  // Wait for fonts to load
  await document.fonts.ready;
  
  // Small delay to ensure proper rendering
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    // Convert HTML to canvas with improved settings
    const canvas = await html2canvas(container, {
      width: 794, // A4 width in pixels at 96 DPI
      height: container.scrollHeight,
      scale: 2, // High DPI for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      removeContainer: false,
      imageTimeout: 15000,
      logging: false,
      onclone: (clonedDoc) => {
        // Ensure fonts are properly loaded in cloned document
        const clonedContainer = clonedDoc.querySelector('div');
        if (clonedContainer) {
          clonedContainer.style.fontFamily = 'Arial, sans-serif';
        }
      }
    });

    // Create PDF with proper dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const imgData = canvas.toDataURL('image/png', 0.95); // Slight compression for file size
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages with better positioning
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return pdf.output('blob');
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
};

// Function to generate HTML content for PDF
export const generateProposalHTML = (formData: ProposalData): string => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const packageInfo = getPackageInfo(formData.budget);
  const featureDescriptions = getFeatureDescriptions(formData.desiredFeatures);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', Arial, -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: #ffffff;
      width: 100%;
      margin: 0;
      padding: 0;
      overflow-wrap: break-word;
      word-wrap: break-word;
      hyphens: auto;
    }
    
    .container {
      width: 100%;
      max-width: 794px; /* A4 width in pixels */
      margin: 0 auto;
      padding: 30px;
      box-sizing: border-box;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      margin: -30px -30px 30px -30px;
      text-align: center;
      position: relative;
      box-sizing: border-box;
    }
    
    .header-logo {
      position: absolute;
      top: 20px;
      left: 30px;
    }
    
    .logo-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .logo-box {
      background: rgba(255, 255, 255, 0.15);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      padding: 6px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    
    .logo-box::before {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      background: #00ff88;
      border-radius: 50%;
      top: 6px;
      right: 6px;
      animation: pulse 2s infinite;
    }
    
    .logo-text {
      font-size: 18px;
      font-weight: 800;
      color: white;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    
    .company-name {
      font-size: 20px;
      font-weight: 700;
      color: white;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    
    @keyframes pulse {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.1); }
      100% { opacity: 1; transform: scale(1); }
    }
    
    a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      border-bottom: 1px dotted #667eea;
    }
    
    a:hover {
      color: #764ba2;
      border-bottom-color: #764ba2;
    }
    
    .header h1 {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 10px;
    }
    
    .header .subtitle {
      font-size: 18px;
      opacity: 0.9;
    }
    
    .proposal-meta {
      background: #f8f9fa;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 40px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    .meta-item {
      margin-bottom: 10px;
    }
    
    .meta-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .meta-value {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
    }
    
    h2 {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 30px 0 15px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
      page-break-after: avoid;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    
    h3 {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 25px 0 12px 0;
      page-break-after: avoid;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    
    p {
      margin-bottom: 16px;
      color: #4a5568;
      line-height: 1.7;
      text-align: left;
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
      max-width: 100%;
    }
    
    .highlight-box {
      background: #f3f4f6;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
      page-break-inside: avoid;
      box-sizing: border-box;
    }
    
    .highlight-box h4 {
      color: #667eea;
      margin-bottom: 10px;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    
    .highlight-box p {
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
    }
    
    ul {
      margin: 15px 0;
      padding-left: 25px;
    }
    
    li {
      margin-bottom: 10px;
      color: #4a5568;
      line-height: 1.6;
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
      max-width: 100%;
    }
    
    .pricing-box {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      border-radius: 12px;
      padding: 25px;
      margin: 25px 0;
      text-align: center;
      page-break-inside: avoid;
      box-sizing: border-box;
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
    
    .features-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;
      margin: 20px 0;
    }
    
    .feature-item {
      display: flex;
      align-items: start;
      gap: 10px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    
    .feature-item div {
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
      max-width: 100%;
    }
    
    .feature-icon {
      color: #10b981;
      font-size: 20px;
      margin-top: 2px;
    }
    
    .timeline {
      margin: 30px 0;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    .timeline-item {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      page-break-inside: avoid;
      break-inside: avoid;
      position: relative;
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
      font-weight: 700;
      flex-shrink: 0;
    }
    
    .timeline-content h4 {
      margin-bottom: 5px;
      color: #1a1a1a;
    }
    
    .timeline-content p {
      font-size: 14px;
      color: #666;
    }
    
    .cta-section {
      background: #1a1a1a;
      color: white;
      padding: 40px;
      border-radius: 12px;
      text-align: center;
      margin: 40px 0;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    .section-wrapper {
      page-break-inside: avoid;
      break-inside: avoid;
      margin-bottom: 30px;
    }
    
    .cta-section h3 {
      color: white;
      margin-bottom: 20px;
    }
    
    .contact-info {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-top: 20px;
    }
    
    .contact-item {
      color: #ccc;
    }
    
    .footer {
      text-align: center;
      margin-top: 60px;
      padding-top: 30px;
      border-top: 1px solid #e5e7eb;
      color: #666;
      font-size: 14px;
    }
    
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .container {
        padding: 20px;
        max-width: 100%;
      }
      .header {
        margin: -20px -20px 25px -20px;
        padding: 30px 20px;
      }
      .header-logo {
        left: 20px;
      }
      .features-grid {
        grid-template-columns: 1fr;
      }
      .pricing-box, .highlight-box, .timeline-item {
        page-break-inside: avoid;
      }
      h2, h3 {
        page-break-after: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-logo">
        <div class="logo-container">
          <div class="logo-box">
            <span class="logo-text">AI</span>
          </div>
          <span class="company-name">App Suite</span>
        </div>
      </div>
      <h1>Your Custom ${getAppTypeLabel(formData.appType)} Solution</h1>
      <div class="subtitle">Built specifically for ${formData.companyName} - Own, Don't Rent</div>
    </div>
    
    <div class="proposal-meta">
      <div>
        <div class="meta-item">
          <div class="meta-label">Prepared For</div>
          <div class="meta-value">${formData.contactName}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Company</div>
          <div class="meta-value">${formData.companyName}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Industry</div>
          <div class="meta-value">${formData.industry}</div>
        </div>
      </div>
      <div>
        <div class="meta-item">
          <div class="meta-label">Date</div>
          <div class="meta-value">${currentDate}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Proposal ID</div>
          <div class="meta-value">PROP-${Date.now()}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Valid Until</div>
          <div class="meta-value">${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
        </div>
      </div>
    </div>

    <h2>Executive Summary</h2>
    <p>Dear ${formData.contactName},</p>
    <p>
      Following our analysis of ${formData.companyName}'s requirements for a ${getAppTypeLabel(formData.appType)} application, we're excited to present this custom solution designed specifically to address your challenge:
    </p>
    
    <div class="highlight-box">
      <h4>Your Challenge</h4>
      <p>"${formData.currentChallenge}"</p>
    </div>
    
    <p>
      App Suite specializes in building AI-powered business applications that businesses <strong>own, not rent</strong>. Your custom solution will be built from scratch, tailored specifically to ${formData.companyName}'s workflow, and delivered with complete source code ownership.
    </p>

    <div class="section-wrapper">
      <h2>Your Custom Solution</h2>
      <p>
        Based on your challenge of "${formData.currentChallenge}", we'll build a custom ${getAppTypeLabel(formData.appType)} application that directly addresses your pain points and streamlines your workflow. This isn't a template or modified SaaS product - it's built from scratch for ${formData.companyName}.
      </p>
      
      <div class="highlight-box">
        <h4>✨ What Makes This Different</h4>
        <p>
          Unlike subscription-based software that you rent monthly, this application becomes your property. You own the source code, control the data, and can modify it anytime. <a href="https://app-suite.io/solutions-weve-built">See examples of applications we've built</a>
        </p>
      </div>
    </div>
    
    <h3>Core Features Included</h3>
    <div class="features-grid">
      ${featureDescriptions.map(feature => `
        <div class="feature-item">
          <span class="feature-icon">✓</span>
          <div>
            <strong>${feature.label}</strong><br>
            <span style="font-size: 14px; color: #666;">${feature.description}</span>
          </div>
        </div>
      `).join('')}
    </div>
    
    <h3>Technical Architecture</h3>
    <p>
      Your application will be built using modern, scalable technology designed for performance and security. <a href="https://app-suite.io/documentation/security">View our security standards</a>
    </p>
    <ul>
      <li><strong>Frontend:</strong> React/Next.js with responsive design for all devices</li>
      <li><strong>Backend:</strong> Node.js with secure API architecture</li>
      <li><strong>Database:</strong> PostgreSQL with optimized schema for your workflow</li>
      <li><strong>Hosting:</strong> Cloud deployment with automatic backups and monitoring</li>
      <li><strong>Security:</strong> Enterprise-grade authentication and data encryption</li>
    </ul>

    <h2>Investment & Package Details</h2>
    <div class="pricing-box">
      <div class="meta-label">Selected Package</div>
      <div style="font-size: 24px; font-weight: 600; margin: 10px 0;">${packageInfo.name}</div>
      <div class="price">$${formData.budget}</div>
      <div class="price-subtitle">${packageInfo.description}</div>
    </div>
    
    <h3>What's Included</h3>
    <ul>
      ${packageInfo.includes.map(item => `<li>${item}</li>`).join('')}
    </ul>

    <h2>Development Timeline & Process</h2>
    <p>Your application will be delivered using our proven 5-phase methodology that delivers exceptional results in 6-8 weeks. <a href="https://app-suite.io/documentation/process">View complete process documentation</a></p>
    
    <div class="timeline">
      <div class="timeline-item">
        <div class="timeline-marker">1</div>
        <div class="timeline-content">
          <h4>Discovery & Planning - Week 1</h4>
          <p>Stakeholder interviews, business process analysis, technical requirements assessment, and project scope definition</p>
          <div style="font-size: 12px; color: #667eea; margin-top: 5px;">
            ✓ Detailed requirements document ✓ Technical architecture proposal ✓ Project timeline
          </div>
        </div>
      </div>
      <div class="timeline-item">
        <div class="timeline-marker">2</div>
        <div class="timeline-content">
          <h4>Design & Architecture - Week 2</h4>
          <p>UX/UI design, wireframing, database design, and system architecture planning</p>
          <div style="font-size: 12px; color: #667eea; margin-top: 5px;">
            ✓ Interactive prototypes ✓ Technical documentation ✓ Database schema
          </div>
        </div>
      </div>
      <div class="timeline-item">
        <div class="timeline-marker">3</div>
        <div class="timeline-content">
          <h4>AI-Powered Development - Weeks 3-5</h4>
          <p>AI-accelerated development, automated testing, real-time progress tracking, and security implementation</p>
          <div style="font-size: 12px; color: #667eea; margin-top: 5px;">
            ✓ Functional application ✓ Automated test suites ✓ Security audit
          </div>
        </div>
      </div>
      <div class="timeline-item">
        <div class="timeline-marker">4</div>
        <div class="timeline-content">
          <h4>Testing & Refinement - Week 6</h4>
          <p>User acceptance testing, performance optimization, security assessment, and bug fixes</p>
          <div style="font-size: 12px; color: #667eea; margin-top: 5px;">
            ✓ QA reports ✓ Performance benchmarks ✓ Deployment-ready application
          </div>
        </div>
      </div>
      <div class="timeline-item">
        <div class="timeline-marker">5</div>
        <div class="timeline-content">
          <h4>Deployment & Launch - Weeks 7-8</h4>
          <p>Production setup, data migration, user training, and go-live support with monitoring</p>
          <div style="font-size: 12px; color: #667eea; margin-top: 5px;">
            ✓ Live application ✓ Training materials ✓ Analytics dashboard
          </div>
        </div>
      </div>
    </div>
    
    <div class="highlight-box">
      <h4>🚀 Why We're 10x Faster</h4>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px;">
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #667eea;">80%</div>
          <div style="font-size: 12px;">Faster Development</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #667eea;">90%</div>
          <div style="font-size: 12px;">Automated Testing</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #667eea;">6-8</div>
          <div style="font-size: 12px;">Weeks vs 6+ Months</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 24px; font-weight: 700; color: #667eea;">100%</div>
          <div style="font-size: 12px;">Code Ownership</div>
        </div>
      </div>
    </div>

    <h2>AI Technology Integration</h2>
    <p>Your application will integrate the most advanced AI capabilities available today, customized for your specific industry and workflow. <a href="https://app-suite.io/documentation/ai-capabilities">Explore our complete AI capabilities</a></p>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
      <div>
        <h4 style="color: #667eea;">🧠 Language AI</h4>
        <ul style="font-size: 14px;">
          <li><strong>GPT-4 & Claude Sonnet:</strong> Content generation, analysis</li>
          <li><strong>Natural Language Processing:</strong> Smart search and categorization</li>
          <li><strong>Automated Communications:</strong> Email drafting and responses</li>
        </ul>
      </div>
      <div>
        <h4 style="color: #667eea;">🤖 Workflow AI</h4>
        <ul style="font-size: 14px;">
          <li><strong>Process Automation:</strong> Intelligent task routing</li>
          <li><strong>Predictive Analytics:</strong> Forecasting and insights</li>
          <li><strong>Decision Support:</strong> AI-powered recommendations</li>
        </ul>
      </div>
    </div>
    
    <div class="highlight-box">
      <h4>🎯 Industry-Specific AI Training</h4>
      <p>
        We don't just plug in generic AI - we train and customize AI models specifically for the ${formData.industry} industry and your unique business processes. This ensures relevant, accurate, and valuable AI assistance.
      </p>
    </div>

    <h2>Investment & Payment Options</h2>
    
    <h3>One-Time Development Investment</h3>
    <div class="highlight-box">
      <h4>💰 Split Payment (Most Popular)</h4>
      <ul>
        <li><strong>50% deposit upon contract signing:</strong> $${Math.round(parseInt(formData.budget) / 2).toLocaleString()}</li>
        <li><strong>50% final payment upon delivery:</strong> $${Math.round(parseInt(formData.budget) / 2).toLocaleString()}</li>
        <li>✓ Start development immediately after deposit</li>
        <li>✓ Risk-free - only pay balance when you're satisfied</li>
      </ul>
    </div>
    
    <div class="highlight-box">
      <h4>🎯 Full Payment (5% Discount)</h4>
      <ul>
        <li><strong>Total investment with discount:</strong> $${Math.round(parseInt(formData.budget) * 0.95).toLocaleString()}</li>
        <li><strong>You save:</strong> $${Math.round(parseInt(formData.budget) * 0.05).toLocaleString()}</li>
        <li>✓ Maximum savings on your project</li>
        <li>✓ Priority scheduling and support</li>
      </ul>
    </div>
    
    <h3>Optional: Ongoing Support & Hosting</h3>
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div>
          <h4 style="color: #667eea; margin-bottom: 10px;">💡 Monthly Plan</h4>
          <div style="font-size: 24px; font-weight: 600; color: #1a1a1a;">$99/month</div>
          <ul style="font-size: 14px; margin-top: 10px;">
            <li>✓ Cloud hosting & maintenance</li>
            <li>✓ Security updates & monitoring</li>
            <li>✓ Technical support</li>
            <li>✓ 1 hour of modifications monthly</li>
          </ul>
        </div>
        <div>
          <h4 style="color: #667eea; margin-bottom: 10px;">🏆 Annual Plan</h4>
          <div style="font-size: 24px; font-weight: 600; color: #1a1a1a;">$999/year</div>
          <div style="font-size: 14px; color: #059669;">Save $189/year</div>
          <ul style="font-size: 14px; margin-top: 10px;">
            <li>✓ Everything in monthly plan</li>
            <li>✓ Priority support response</li>
            <li>✓ 2 feature requests annually</li>
            <li>✓ Performance optimization</li>
          </ul>
        </div>
      </div>
      <p style="font-size: 12px; color: #666; margin-top: 15px; text-align: center;">
        <strong>Note:</strong> Support plans are optional. Your application runs independently and you can host it anywhere. <a href="https://app-suite.io/documentation/delivery">Learn about deployment options</a>
      </p>
    </div>

    <h2>Next Steps & Timeline</h2>
    <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin: 25px 0;">
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
        <div style="text-align: center;">
          <div style="background: #667eea; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px;">1</div>
          <h4 style="font-size: 16px; margin-bottom: 8px;">Discovery Call</h4>
          <p style="font-size: 13px; color: #666;">30-minute consultation to finalize requirements</p>
        </div>
        <div style="text-align: center;">
          <div style="background: #667eea; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px;">2</div>
          <h4 style="font-size: 16px; margin-bottom: 8px;">Contract & Deposit</h4>
          <p style="font-size: 13px; color: #666;">Sign agreement and make 50% deposit to begin</p>
        </div>
        <div style="text-align: center;">
          <div style="background: #667eea; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px;">3</div>
          <h4 style="font-size: 16px; margin-bottom: 8px;">Development Begins</h4>
          <p style="font-size: 13px; color: #666;">Your application launches in 6-8 weeks</p>
        </div>
      </div>
    </div>
    
    <div class="cta-section">
      <h3>Ready to Transform Your Business?</h3>
      <p>Let's schedule a 30-minute discovery call to discuss your project and answer any questions.</p>
      <div style="margin: 20px 0;">
        <div style="font-size: 18px; margin-bottom: 15px;">
          📧 <strong>Email:</strong> jason@jaydus.ai | 📱 <strong>Phone:</strong> (833) APP-SUIT
        </div>
        <div style="font-size: 14px; color: #ccc;">
          🌐 <strong>Website:</strong> <a href="https://app-suite.io" style="color: #ccc;">app-suite.io</a> | 
          📅 <strong>Book Call:</strong> <a href="https://app-suite.io/contact" style="color: #ccc;">app-suite.io/contact</a>
        </div>
      </div>
      <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-top: 20px;">
        <p style="font-size: 14px; margin: 0; color: #ccc;">
          🏆 <strong>Why choose App Suite?</strong> We've delivered 100+ custom applications with 98% client satisfaction. 
          <a href="https://app-suite.io/solutions-weve-built" style="color: #ccc;">View our portfolio</a>
        </p>
      </div>
    </div>

    <div class="footer">
      <p><strong>App Suite</strong> - Building AI-powered applications that businesses own, not rent.</p>
      <p>This proposal is valid for 30 days from ${currentDate}</p>
    </div>
  </div>
</body>
</html>
`;
};

// Helper functions
function getPackageInfo(budget: string) {
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
          'Custom AI training for your use case',
          'First 2 API connections FREE',
          '30-day post-launch support',
          'Complete source code ownership'
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
          'Multi-tenant architecture capabilities',
          'Custom reporting & business intelligence',
          'Priority development & support',
          'First 3 API connections FREE',
          '30-day post-launch support',
          'Complete source code ownership'
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
          'First 2 API connections FREE',
          '30-day post-launch support',
          'Complete source code ownership'
        ]
      };
  }
}

function getAppTypeLabel(appType: string): string {
  const types: Record<string, string> = {
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

function getFeatureDescriptions(features: string[]): Array<{label: string, description: string}> {
  const featureMap: Record<string, {label: string, description: string}> = {
    ai: { label: 'AI Integration', description: 'GPT-4, Claude, automated insights' },
    auth: { label: 'User Management', description: 'Roles, permissions, authentication' },
    mobile: { label: 'Mobile Responsive', description: 'Works on all devices' },
    api: { label: 'API Integrations', description: 'Connect to existing systems' },
    analytics: { label: 'Advanced Analytics', description: 'Reports and data visualization' },
    automation: { label: 'Workflow Automation', description: 'Automated processes and triggers' },
    notifications: { label: 'Notifications', description: 'Email, SMS, in-app alerts' },
    search: { label: 'Advanced Search', description: 'AI-powered data search' },
    export: { label: 'Data Export', description: 'PDF, CSV, API exports' },
    calendar: { label: 'Calendar Integration', description: 'Scheduling and calendar sync' },
    files: { label: 'File Management', description: 'Upload, store, organize documents' },
    realtime: { label: 'Real-time Updates', description: 'Live data synchronization' }
  };
  
  return features.map(f => featureMap[f] || { label: f, description: '' });
}

// Function to download PDF proposal
export const downloadProposalPDF = async (formData: ProposalData): Promise<void> => {
  try {
    const pdfBlob = await generateProposalPDF(formData);
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.companyName.replace(/[^a-zA-Z0-9]/g, '-')}-Custom-Proposal.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF proposal');
  }
};

// Function to send proposal via email
export const sendProposalEmail = async (formData: ProposalData, pdfBlob: Blob): Promise<void> => {
  // This would integrate with your email service
  // For now, we'll simulate the email sending
  console.log('Sending proposal email to:', formData.email);
  console.log('PDF size:', pdfBlob.size, 'bytes');
  
  // TODO: Integrate with actual email service (SendGrid, Resend, etc.)
  // import { generateProposalEmailHTML, generateNotificationEmailHTML } from './emailTemplates';
  // 
  // const clientEmailData = {
  //   to: formData.email,
  //   subject: `Your Custom Application Proposal - ${formData.companyName}`,
  //   html: generateProposalEmailHTML(formData),
  //   attachments: [{
  //     filename: `${formData.companyName.replace(/[^a-zA-Z0-9]/g, '-')}-Proposal.pdf`,
  //     content: pdfBlob
  //   }]
  // };
  // 
  // const notificationEmailData = {
  //   to: 'jason@jaydus.ai',
  //   subject: `New Proposal Generated - ${formData.companyName}`,
  //   html: generateNotificationEmailHTML(formData),
  //   attachments: [{
  //     filename: `${formData.companyName.replace(/[^a-zA-Z0-9]/g, '-')}-Proposal.pdf`,
  //     content: pdfBlob
  //   }]
  // };
  // 
  // await Promise.all([
  //   emailService.send(clientEmailData),
  //   emailService.send(notificationEmailData)
  // ]);
  
  // Simulate successful email sending
  await new Promise(resolve => setTimeout(resolve, 1000));
};