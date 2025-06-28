const Anthropic = require('@anthropic-ai/sdk');

// Initialize Claude with the API key from environment
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const ENHANCED_APP_SUITE_CONTEXT = `You are an expert sales consultant for App Suite, analyzing client calls to create highly personalized proposals.

App Suite builds custom business applications with these key differentiators:
- No monthly fees - one-time payment, own it forever
- Built 10x faster with AI technology
- 100% custom-built from scratch (never templates)
- Enterprise-grade quality at SMB prices

Your analysis should:
1. Identify ALL pain points mentioned (explicit and implicit)
2. Note frustrations with current systems/processes
3. Capture wishes and "nice-to-haves" 
4. Understand their industry-specific challenges
5. Recognize opportunities for AI to transform their workflow
6. Pick up on personal stress/overwhelm from manual tasks

When analyzing calls, pay special attention to:
- Manual processes that could be automated
- Data scattered across multiple systems
- Time wasted on repetitive tasks
- Compliance/regulatory requirements
- Growth blockers and scalability issues
- Team collaboration challenges
- Customer service bottlenecks

Your proposal should feel like a conversation, addressing their specific situation and showing you truly listened.`;

const PROPOSAL_GENERATION_PROMPT = `Based on the analysis, write a warm, conversational proposal that:

1. Opens with empathy - acknowledge their specific challenges
2. Shows you understood their unique situation
3. Presents the solution as a partnership, not just software
4. Explains how AI will specifically help with THEIR problems
5. Paints a picture of their business after implementation
6. Addresses concerns they mentioned
7. Suggests additional ways App Suite could help (based on what you heard)
8. Closes with clear next steps and enthusiasm

The tone should be:
- Professional but warm
- Confident but not pushy  
- Specific to their industry/situation
- Focused on outcomes, not features
- Emphasizing time savings and stress reduction

Include specific examples of how the solution addresses their exact pain points.`;

exports.handler = async (event, context) => {
  // Add CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Handle CORS preflight
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
    const { transcript, clientName, projectName } = JSON.parse(event.body);

    if (!transcript) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Transcript is required' })
      };
    }

    // First pass: Deep analysis of the call (with timeout protection)
    const analysisMessage = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307', // Use faster model for analysis
      max_tokens: 2000, // Reduced for faster response
      temperature: 0.3,
      system: ENHANCED_APP_SUITE_CONTEXT,
      messages: [{
        role: 'user',
        content: `Analyze this sales call transcript with deep attention to detail. Extract EVERYTHING - pain points, frustrations, wishes, concerns, industry context, and opportunities for AI automation.

Call Transcript:
${transcript}

${clientName ? `Client Name: ${clientName}` : ''}
${projectName ? `Project Name: ${projectName}` : ''}

Provide a comprehensive JSON analysis with:
{
  "clientProfile": {
    "name": "Client name",
    "company": "Company name", 
    "role": "Their role/position",
    "industry": "Their industry",
    "companySize": "Size/scale indicators from call",
    "techSavviness": "Their comfort with technology"
  },
  "currentSituation": {
    "systems": ["Current tools/systems they use"],
    "processes": ["Manual processes mentioned"],
    "teamSize": "Team size if mentioned",
    "painPoints": [{
      "issue": "Specific problem",
      "impact": "How it affects them",
      "frequency": "How often it happens",
      "emotionalTone": "Frustration level"
    }],
    "timeWasters": ["Tasks taking too much time"],
    "growthBlockers": ["Things preventing growth"]
  },
  "desires": {
    "immediate": ["What they need solved now"],
    "future": ["Long-term goals mentioned"],
    "niceToHaves": ["Features they'd love but didn't ask for"],
    "concerns": ["Worries or objections raised"]
  },
  "aiOpportunities": [{
    "task": "What could be automated",
    "currentMethod": "How they do it now",
    "aiSolution": "How AI would transform it",
    "timeSaved": "Estimated time savings",
    "additionalBenefit": "Other improvements"
  }],
  "personalContext": {
    "stressPoints": ["Personal frustrations mentioned"],
    "motivations": ["What drives them"],
    "communicationStyle": "How they communicate",
    "decisionFactors": ["What matters for their decision"]
  },
  "proposalStrategy": {
    "hook": "Opening line that shows we heard them",
    "mainPainToAddress": "Primary problem to solve",
    "secondaryBenefits": ["Additional value we can provide"],
    "aiEmphasis": "How to position AI benefits",
    "concerns": ["Objections to address"],
    "closingApproach": "How to end the proposal"
  },
  "recommendedSolution": {
    "packageType": "starter|professional|enterprise|custom",
    "price": 5000|7500|10000|15000,
    "coreFeatures": ["Must-have features based on call"],
    "aiFeatures": ["AI-powered capabilities"],
    "integrations": ["Systems to connect with"],
    "timeline": "Realistic delivery timeframe",
    "quickWins": ["What they'll see first"]
  }
}`
      }]
    });

    // Parse the analysis
    const analysisText = analysisMessage.content[0].text;
    let analysis;
    
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse analysis');
      }
    }

    // Second pass: Generate conversational proposal
    const proposalMessage = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307', // Use faster model
      max_tokens: 1500, // Reduced for faster response
      temperature: 0.7,
      system: PROPOSAL_GENERATION_PROMPT,
      messages: [{
        role: 'user',
        content: `Based on this analysis, write a warm, conversational proposal that shows we truly understood their needs:

${JSON.stringify(analysis, null, 2)}

The proposal should:
- Start by acknowledging their specific situation
- Reference actual things they said
- Explain solutions in their language
- Show how AI will transform their daily work
- Suggest additional ways we could help
- Feel like a natural continuation of our conversation
- End with enthusiasm and clear next steps

Make it personal, not generic.`
      }]
    });

    const proposal = proposalMessage.content[0].text;

    // Combine everything into final response
    const result = {
      summary: `${analysis.clientProfile.name} from ${analysis.clientProfile.company} needs ${analysis.currentSituation.painPoints[0]?.issue || 'help with their business processes'}. They're currently ${analysis.currentSituation.painPoints[0]?.impact || 'struggling with manual tasks'} and want a solution that ${analysis.desires.immediate[0] || 'saves time and reduces errors'}.`,
      
      keyPoints: [
        ...analysis.currentSituation.painPoints.map(p => p.issue),
        ...analysis.desires.immediate
      ].slice(0, 5),
      
      clientNeeds: [
        ...analysis.desires.immediate,
        ...analysis.aiOpportunities.map(opp => opp.task)
      ],
      
      painPoints: analysis.currentSituation.painPoints,
      aiOpportunities: analysis.aiOpportunities,
      personalContext: analysis.personalContext,
      
      projectScope: {
        clientName: analysis.clientProfile.name || clientName,
        companyName: analysis.clientProfile.company,
        projectType: analysis.recommendedSolution.coreFeatures[0] || 'Custom Business Application',
        estimatedBudget: analysis.personalContext.decisionFactors.includes('budget') ? 'Price-sensitive' : 'Value-focused',
        timeline: analysis.recommendedSolution.timeline,
        challenges: analysis.currentSituation.painPoints.map(p => p.issue),
        proposedSolutions: analysis.recommendedSolution.coreFeatures,
        features: [
          ...analysis.recommendedSolution.coreFeatures,
          ...analysis.recommendedSolution.aiFeatures
        ],
        benefits: analysis.aiOpportunities.map(opp => opp.additionalBenefit),
        nextSteps: [
          'Schedule a follow-up call to dive deeper',
          'Create a detailed project roadmap',
          'Set up a demo of similar solutions',
          'Begin development within 48 hours of approval'
        ],
        recommendedPackage: analysis.recommendedSolution.packageType,
        price: analysis.recommendedSolution.price
      },
      
      proposal: proposal,
      
      additionalInsights: {
        clientProfile: analysis.clientProfile,
        quickWins: analysis.recommendedSolution.quickWins,
        longTermVision: analysis.desires.future,
        communicationTips: analysis.personalContext.communicationStyle
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Enhanced transcript analysis error:', error);
    
    // Fallback for testing without API key
    if (error.status === 401 || !process.env.ANTHROPIC_API_KEY) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(generateEnhancedMockAnalysis(event.body))
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to analyze transcript',
        details: error.message 
      })
    };
  }
};

function generateEnhancedMockAnalysis(body) {
  const { transcript, clientName, projectName } = JSON.parse(body);
  
  return {
    summary: "CJ from the asphalt paving company is drowning in paperwork and compliance headaches. Their paper-based system is literally falling apart in the trucks, and with the team doubling in size, she needs a digital solution yesterday.",
    
    keyPoints: [
      "Paper documents in trucks are getting damaged and lost constantly",
      "OSHA compliance is at risk with outdated documentation",
      "Company is scaling rapidly - doubling workforce",
      "Current system is completely manual and unsustainable",
      "Needs QR code access for field workers"
    ],
    
    painPoints: [
      {
        issue: "Paper documents getting damaged in trucks",
        impact: "Compliance risk and worker frustration",
        frequency: "Daily",
        emotionalTone: "High frustration"
      },
      {
        issue: "Manual updates across multiple trucks",
        impact: "Hours wasted, documents out of sync",
        frequency: "Weekly",
        emotionalTone: "Overwhelming"
      }
    ],
    
    aiOpportunities: [
      {
        task: "Document updates and distribution",
        currentMethod: "Manually copying and distributing to each truck",
        aiSolution: "AI automatically updates all documents when regulations change",
        timeSaved: "4-5 hours per week",
        additionalBenefit: "Never miss a compliance update again"
      },
      {
        task: "Safety checklist completion",
        currentMethod: "Paper forms filled by hand",
        aiSolution: "Voice-to-text AI for hands-free completion",
        timeSaved: "30 minutes per day per crew",
        additionalBenefit: "Better compliance tracking and insights"
      }
    ],
    
    projectScope: {
      clientName: clientName || "CJ",
      companyName: "Premier Paving Solutions",
      projectType: "Digital Document Management & Compliance System",
      estimatedBudget: "Value-focused",
      timeline: "4-6 weeks",
      challenges: [
        "Paper documents deteriorating in harsh conditions",
        "Manual distribution taking hours",
        "OSHA compliance at risk",
        "Rapid company growth making current system unsustainable"
      ],
      proposedSolutions: [
        "Cloud-based document management with version control",
        "QR code generation for instant field access",
        "Automatic compliance updates powered by AI",
        "Mobile-first design for muddy job sites",
        "Offline access for remote locations"
      ],
      features: [
        "Smart document categorization",
        "QR code generator and scanner",
        "AI-powered compliance monitoring",
        "Automatic update notifications",
        "Weather-resistant mobile interface",
        "Digital signature capture",
        "Usage analytics dashboard",
        "Multi-language support for diverse crews"
      ],
      benefits: [
        "100% paperless operations",
        "Guaranteed OSHA compliance",
        "5+ hours saved per week",
        "Scales automatically with growth"
      ],
      nextSteps: [
        "Schedule a 30-minute demo this week",
        "Visit your yard to understand workflow",
        "Create a pilot program for one crew",
        "Full rollout within 6 weeks"
      ],
      recommendedPackage: "professional",
      price: 7500
    },
    
    proposal: `Hi CJ,

I've been thinking about our conversation, and honestly, I'm amazed you've managed to keep everything running smoothly with paper documents bouncing around in those trucks. The fact that you're dealing with damaged binders, OSHA compliance, AND preparing to double your workforce - that's a lot on your plate.

Here's what really stood out to me: you mentioned spending hours every week just updating and distributing documents to each truck. That's time you could be spending on growing the business, not wrestling with paperwork. And with OSHA requirements constantly changing, the risk of outdated documents is real.

Let me paint a picture of how different your days could look:

**Morning**: Instead of printing and distributing updates, you make changes once in your digital system. Every truck instantly has the latest version.

**In the field**: Your crews scan a QR code with their muddy gloves still on. Boom - they've got every safety document, procedure, and form they need. No more damaged papers, no more "I can't find that form."

**Compliance updates**: Here's where it gets really cool. Our AI monitors OSHA and industry changes. When new requirements come out, it alerts you and even suggests which documents need updating. You'll never be caught off-guard by an inspection again.

**As you grow**: Add 10 new trucks? 20? The system scales instantly. No more weekend document runs.

But here's what I'm really excited about - we can do even more than just solve your document problem. Since you're scaling so fast, we could add:

- Digital safety checklists that crews can complete by voice while working
- Automatic incident reporting that creates OSHA-compliant records
- A simple dashboard showing which crews have accessed which documents (great for training compliance)
- Integration with your existing systems as you grow

The investment for your complete digital transformation would be $7,500 - that's a one-time payment, not another monthly subscription to worry about. You'll own this system forever, and it'll grow with you.

I know change can feel overwhelming when you're already juggling so much. That's why we'll handle everything - from importing your current documents to training your crews. You'll see results in the first week.

CJ, you've built something impressive with this company. Let's make sure paperwork never holds you back from growing even bigger. I'd love to show you exactly how this would work for your specific operation.

Are you free for a quick demo this week? I can even come to your yard and show you on an actual truck - muddy boots and all.

Looking forward to taking this paperwork burden off your shoulders!

Best regards,
Jason Gordon
App Suite

P.S. I've helped three other paving companies go paperless this year. They're all saying the same thing: "Why didn't we do this sooner?" Let's make sure you're saying that next month, not next year.`,
    
    additionalInsights: {
      clientProfile: {
        name: "CJ",
        company: "Premier Paving Solutions",
        role: "Operations Manager",
        industry: "Construction/Paving",
        companySize: "14 employees, expanding to 25-30",
        techSavviness: "Moderate - wants simple solutions"
      },
      quickWins: [
        "QR codes working on day one",
        "First week: 50% reduction in document distribution time",
        "Immediate mobile access for all crews"
      ],
      longTermVision: [
        "Fully digital operations",
        "Automated compliance management",
        "Data-driven safety insights"
      ],
      communicationTips: "CJ appreciates straight talk and practical solutions. Focus on time savings and compliance peace of mind."
    }
  };
}