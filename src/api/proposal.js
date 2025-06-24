// API endpoint for generating custom proposals
export const generateProposal = async (formData) => {
  try {
    // This would integrate with your AI service (OpenAI, Claude, etc.)
    const response = await fetch('/api/generate-proposal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to generate proposal');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error generating proposal:', error);
    throw error;
  }
};

// AI Prompt template for proposal generation
export const createProposalPrompt = (formData) => {
  const {
    companyName,
    contactName,
    industry,
    appType,
    currentChallenge,
    desiredFeatures,
    teamSize,
    timeline,
    budget,
    additionalInfo
  } = formData;

  return `
You are an expert proposal writer for App Suite, a custom AI-powered business application development company. Create a personalized, professional proposal based on this client information:

CLIENT DETAILS:
- Company: ${companyName}
- Contact: ${contactName}
- Industry: ${industry}
- App Type: ${appType}
- Current Challenge: ${currentChallenge}
- Team Size: ${teamSize}
- Timeline: ${timeline}
- Budget: ${budget}
- Additional Info: ${additionalInfo || 'None'}
- Desired Features: ${desiredFeatures.join(', ')}

COMPANY BACKGROUND:
App Suite specializes in building custom AI-powered business applications with flat-rate pricing, complete code ownership, and no monthly fees. We build NEW applications from scratch - we don't modify existing software unless originally built by us.

PRICING STRUCTURE:
- Standard Application: $5,000 (Custom dashboard, 2 free API connections)
- AI-Enhanced Application: $7,500 (AI integration, 2 free API connections)
- Enterprise Solution: $10,000 (Multi-AI orchestration, 3 free API connections)

ADD-ON MODULES:
- Feature Add-ons: $1,000 each (email tracking, calendar sync, search, etc.)
- Basic API Connections: $1,000 each (after free inclusions)
- Technical API Integrations: $2,500 each (complex integrations)
- Advanced Modules: $2,500 each (custom AI training, analytics suite, etc.)

AI TECHNOLOGIES:
OpenAI GPT-4, Anthropic Claude, Google Gemini, Microsoft Azure AI, Eleven Labs, Cohere, Llama, Grok, Fal.ai

DEVELOPMENT PROCESS:
14-day delivery: Discovery (Days 1-2) → Design (Days 3-5) → Development (Days 6-12) → Testing & Launch (Days 13-14)

Create a compelling 6-section proposal:

1. EXECUTIVE SUMMARY
Address ${contactName} personally. Reference their specific challenge: "${currentChallenge}". Explain how a custom ${appType} application will solve this for ${companyName}.

2. UNDERSTANDING YOUR CHALLENGE
Elaborate on their pain points and how it affects their ${industry} business. Show you understand their specific situation.

3. PROPOSED SOLUTION
Detail the custom ${appType} application with specific features they requested. Explain which AI technologies would be most beneficial for their use case.

4. TECHNOLOGY & AI CAPABILITIES
List relevant AI models and explain how they'll enhance their solution. Be specific about benefits for their industry.

5. INVESTMENT & TIMELINE
Provide exact pricing based on their budget selection. Include what's included, payment options, and 14-day timeline breakdown.

6. NEXT STEPS
Clear call-to-action with scheduling link and contact information.

Make it feel highly personalized to ${companyName} and ${contactName}. Use their industry terminology. Reference their specific timeline needs. Keep professional but conversational tone.
`;
};

// Email template for sending proposals
export const createProposalEmail = (formData, proposalContent) => {
  return {
    to: formData.email,
    subject: `Your Custom ${formData.appType} Proposal - ${formData.companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">Your Custom Proposal is Ready!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">AI-Powered Business Application for ${formData.companyName}</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <p>Dear ${formData.contactName},</p>
          
          <p>Thank you for your interest in App Suite! We've analyzed your requirements for a ${formData.appType} application and created a custom proposal specifically for ${formData.companyName}.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="margin-top: 0; color: #333;">What's Included in Your Proposal:</h3>
            <ul style="color: #666; line-height: 1.6;">
              <li>Custom solution overview for your ${formData.currentChallenge} challenge</li>
              <li>Detailed feature breakdown with AI capabilities</li>
              <li>14-day development timeline</li>
              <li>Transparent pricing with no hidden fees</li>
              <li>Technology stack and AI models we'll use</li>
              <li>Case study from similar ${formData.industry} projects</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">📅 Schedule Discovery Call</a>
          </div>
          
          <p>Questions? Reply to this email or call us at <strong>(833) APP-SUIT</strong></p>
          
          <p>Best regards,<br>
          Jason Gordon<br>
          App Suite<br>
          jason@jaydus.ai</p>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">App Suite - Building AI-powered applications that businesses own, not rent.</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `${formData.companyName}-Custom-Proposal.pdf`,
        content: proposalContent, // This would be the generated PDF
        contentType: 'application/pdf'
      }
    ]
  };
};