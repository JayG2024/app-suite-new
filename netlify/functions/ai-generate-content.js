// Netlify function for AI content generation
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
    const { action, data, userId } = JSON.parse(event.body);
    
    // Generate content based on action type
    let content = '';
    
    switch (action) {
      case 'weekly-report':
        content = generateWeeklyReport(data);
        break;
        
      case 'email-campaign':
        content = generateEmailCampaign(data);
        break;
        
      case 'proposal':
        content = generateProposal(data);
        break;
        
      case 'competitor-analysis':
        content = generateCompetitorAnalysis(data);
        break;
        
      case 'social-media':
        content = generateSocialMedia(data);
        break;
        
      case 'conversion-optimization':
        content = generateConversionOptimization(data);
        break;
        
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action type' })
        };
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ content, action })
    };
    
  } catch (error) {
    console.error('AI content generation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

// Content generation functions
function generateWeeklyReport(data) {
  const { startDate, endDate } = data;
  const formattedStart = new Date(startDate).toLocaleDateString();
  const formattedEnd = new Date(endDate).toLocaleDateString();
  
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Weekly Client Report</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    .metric { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
    .metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }
  </style>
</head>
<body>
  <h1>Weekly Progress Report</h1>
  <p>Period: ${formattedStart} - ${formattedEnd}</p>
  
  <h2>Key Achievements</h2>
  <ul>
    <li>Completed 12 development tasks across 3 active projects</li>
    <li>Achieved 98% uptime for all deployed applications</li>
    <li>Resolved 8 customer support tickets with 100% satisfaction</li>
    <li>Deployed 2 new features based on client feedback</li>
  </ul>
  
  <h2>Project Updates</h2>
  <div class="metric">
    <h3>Custom CRM Development</h3>
    <p>Progress: <span class="metric-value">75%</span></p>
    <p>Completed user authentication, dashboard, and lead management modules. Currently working on reporting features.</p>
  </div>
  
  <div class="metric">
    <h3>E-commerce Platform</h3>
    <p>Progress: <span class="metric-value">45%</span></p>
    <p>Product catalog and shopping cart functionality complete. Payment integration in progress.</p>
  </div>
  
  <h2>Next Week's Focus</h2>
  <ul>
    <li>Complete payment gateway integration</li>
    <li>Launch beta testing for CRM system</li>
    <li>Begin development of mobile app companion</li>
  </ul>
  
  <p>Best regards,<br>App Suite Team</p>
</body>
</html>
  `;
}

function generateEmailCampaign(data) {
  const { campaignType, targetAudience, product, goals } = data;
  
  return `Subject: Transform Your Business with Custom Applications

Dear [Name],

Are you tired of paying endless subscription fees for software that doesn't quite fit your business needs?

At App Suite, we build custom business applications from scratch - designed specifically for YOUR unique requirements. No templates, no compromises.

✅ Flat-rate pricing: $5,000 standard, $7,500 AI-enhanced
✅ You own the code - no monthly fees
✅ Built 10x faster with AI
✅ Enterprise-grade quality

Recent Success Story:
We helped TechStart Inc. replace 5 different SaaS subscriptions with one custom application, saving them $3,200/month while improving efficiency by 40%.

Ready to stop renting and start owning?

Book a free consultation: www.app-suite.io/get-started

Best regards,
The App Suite Team

P.S. Limited slots available for Q1 2025. Reserve yours today!`;
}

function generateProposal(data) {
  const { clientName, projectType, requirements, budget, timeline } = data;
  
  return `
# Custom Application Development Proposal

**Client:** ${clientName}  
**Project:** ${projectType}  
**Date:** ${new Date().toLocaleDateString()}

## Executive Summary
App Suite will develop a custom ${projectType} tailored specifically to your business needs. Our AI-powered development process ensures rapid delivery without compromising quality.

## Scope of Work
Based on your requirements, we will build:
${requirements.split(',').map(req => `- ${req.trim()}`).join('\n')}

## Timeline
**Estimated Completion:** ${timeline}

### Milestones:
1. Week 1: Requirements finalization & system architecture
2. Week 2-3: Core functionality development
3. Week 4: Testing, refinement & deployment

## Investment
**Total Project Cost:** ${budget}
- No hourly billing
- No hidden fees
- Includes 30 days of post-launch support

## Why App Suite?
- 100% custom-built (no templates)
- You own the code
- AI-powered rapid development
- Enterprise-grade security
- Dedicated project manager

## Next Steps
1. Sign this proposal
2. 50% deposit to begin
3. Kick-off meeting within 48 hours

Ready to transform your business? Let's build something amazing together.
`;
}

function generateCompetitorAnalysis(data) {
  const { competitors, focusAreas } = data;
  
  return `
# Competitor Analysis Report

**Date:** ${new Date().toLocaleDateString()}
**Competitors Analyzed:** ${competitors.join(', ')}

## Executive Summary
App Suite offers a unique value proposition in the custom application development space by combining flat-rate pricing, complete code ownership, and AI-powered rapid development.

## Competitive Advantages

### 1. Pricing Model
**App Suite:** Flat-rate ($5,000-$10,000)
- No hourly billing
- No ongoing fees
- Complete transparency

**Competitors:** Hourly billing ($150-300/hour) or subscription-based
- Projects often exceed budget
- Monthly/annual fees
- Hidden costs common

### 2. Development Speed
**App Suite:** 14-30 days with AI assistance
**Competitors:** 3-6 months traditional development

### 3. Code Ownership
**App Suite:** 100% client-owned code
**Competitors:** Platform lock-in, no code access

### 4. Customization
**App Suite:** Built from scratch for each client
**Competitors:** Template-based solutions

## Market Positioning
App Suite fills a critical gap between expensive enterprise solutions and limiting template-based platforms. Our target market of SMBs seeking custom applications at predictable costs is underserved by current competitors.

## Recommendations
1. Emphasize ownership vs. rental messaging
2. Showcase rapid delivery case studies
3. Highlight flat-rate pricing calculator
4. Focus on SMB pain points with SaaS fatigue
`;
}

function generateSocialMedia(data) {
  const { platform, topic, tone, includeHashtags } = data;
  
  const hashtags = includeHashtags ? '\n\n#CustomSoftware #BusinessAutomation #NoCode #AppDevelopment #DigitalTransformation #SmallBusiness #Entrepreneurship #SaaS #TechInnovation' : '';
  
  return `🚀 Why rent when you can own?

The average business spends $9,600/year on SaaS subscriptions for software that's "almost" what they need.

What if you could have software built EXACTLY for your business at a one-time flat rate?

✅ No monthly fees
✅ You own the code
✅ Built in 30 days with AI
✅ Starting at just $5,000

Stop adapting your business to the software. Get software that adapts to YOU.

Learn more → www.app-suite.io${hashtags}`;
}

function generateConversionOptimization(data) {
  const { pageType, currentConversion, targetConversion, issues } = data;
  
  return `
# Conversion Optimization Recommendations

**Page Type:** ${pageType}
**Current Conversion Rate:** ${currentConversion}%
**Target Conversion Rate:** ${targetConversion}%

## Key Issues Identified
${issues}

## Optimization Recommendations

### 1. Above the Fold
- **Headline:** Change to benefit-focused: "Stop Paying $800/Month for Software That Doesn't Fit"
- **Subheadline:** "Get Your Custom Business Application Built Once, Use Forever"
- **CTA:** Make button larger, change text to "See Flat-Rate Pricing"
- **Social Proof:** Add "500+ Custom Apps Built" counter

### 2. Value Proposition
- Lead with ownership vs. rental
- Show monthly SaaS costs vs. one-time investment
- Add ROI calculator showing break-even in 6-12 months

### 3. Trust Signals
- Client logos prominently displayed
- Security badges (SOC2, SSL)
- 30-day money-back guarantee
- Video testimonials from happy clients

### 4. Pricing Transparency
- Show all three tiers immediately
- Add "What's Included" for each tier
- Compare to typical SaaS costs
- Payment plan options

### 5. Urgency & Scarcity
- "Limited slots for Q1 2025"
- "Currently booking for March"
- Show live availability calendar

### 6. Form Optimization
- Reduce to 3 fields: Name, Email, Company
- Change button to "Get Your Custom Quote"
- Add progress indicator
- Show what happens next

### Expected Results
These changes should increase conversion from ${currentConversion}% to ${targetConversion}% within 30 days of implementation.
`;
}