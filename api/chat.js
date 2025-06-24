// App Suite AI Chatbot API
// Powered by Jaydus.AI for intelligent business conversations

import OpenAI from 'openai';

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
    const { message, conversationHistory = [] } = req.body;

    // Try AI API first, fall back to smart responses if needed
    let response;
    let model = "jaydus-ai";
    
    try {
      // Attempt to use Claude API first
      if (process.env.CLAUDE_API_KEY) {
        response = await generateClaudeResponse(message, conversationHistory);
        model = "claude-3.5-sonnet";
      } 
      // Fall back to OpenAI if Claude fails
      else if (process.env.OPENAI_API_KEY) {
        response = await generateOpenAIResponse(message, conversationHistory);
        model = "gpt-4";
      }
      // Use smart fallback responses
      else {
        response = generateFallbackResponse(message);
        model = "app-suite-smart";
      }
    } catch (apiError) {
      console.log('AI API unavailable, using smart responses:', apiError.message);
      response = generateFallbackResponse(message);
      model = "app-suite-smart";
    }
    
    res.status(200).json({
      success: true,
      response: response,
      conversationId: `CHAT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      model: model
    });

  } catch (error) {
    console.error('Chatbot API Error:', error);
    
    // Intelligent fallback
    const fallbackResponse = generateFallbackResponse(req.body.message || "");
    
    res.status(200).json({
      success: true,
      response: fallbackResponse,
      conversationId: `CHAT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      model: "app-suite-smart",
      note: "Using enhanced AI responses"
    });
  }
}

// Generate context-aware suggestions
function generateSmartSuggestions(userMessage, botResponse) {
  const message = userMessage.toLowerCase();
  const response = botResponse.toLowerCase();
  
  if (message.includes('price') || message.includes('cost')) {
    return ["Generate custom proposal", "See example projects", "Compare pricing tiers", "Schedule consultation"];
  }
  
  if (message.includes('ai') || response.includes('ai')) {
    return ["See AI capabilities", "AI pricing details", "Generate AI proposal", "Book AI consultation"];
  }
  
  if (message.includes('timeline') || message.includes('how long')) {
    return ["Start my project", "See development process", "Get timeline estimate", "Book planning call"];
  }
  
  if (message.includes('example') || message.includes('portfolio')) {
    return ["Generate my proposal", "Industry solutions", "Client testimonials", "Schedule demo"];
  }
  
  // Default suggestions
  return ["Generate proposal", "See pricing", "Book consultation", "View examples"];
}

// Intelligent fallback responses
function generateFallbackResponse(message) {
  const msg = message.toLowerCase();
  
  if (msg.includes('price') || msg.includes('cost')) {
    return {
      message: "App Suite offers transparent pricing with three tiers:\n\n💰 **$5,000 Standard Apps** - Full-featured custom applications\n🤖 **$7,500 AI-Enhanced Apps** - Include AI features and automation\n🚀 **$10,000 Enterprise Apps** - Complex systems with advanced integrations\n\nAll prices are fixed with no hidden costs. Would you like a custom proposal?",
      suggestions: ["Generate custom proposal", "See what's included", "Compare tiers", "Schedule consultation"]
    };
  }
  
  if (msg.includes('ai')) {
    return {
      message: "App Suite specializes in AI-powered business solutions! 🤖\n\nOur AI capabilities include:\n✨ Intelligent analytics and insights\n📝 Automated content generation\n🎯 Smart workflow automation\n💬 AI chatbots and assistants\n📊 Predictive analytics\n\nWe use the latest AI models powered by Jaydus.AI to give you cutting-edge capabilities.",
      suggestions: ["See AI pricing", "Generate AI proposal", "AI use cases", "Book AI consultation"]
    };
  }
  
  if (msg.includes('timeline') || msg.includes('how long')) {
    return {
      message: "App Suite delivers fast! ⚡\n\n**Development Timeline:**\n📋 Week 1: Discovery & Planning\n🎨 Week 2: Design & Architecture\n⚙️ Week 3: Development & Features\n🧪 Week 4: Testing & Deployment\n\nMost projects completed in 3-4 weeks. We use AI-powered development to build 10x faster than traditional agencies.",
      suggestions: ["Start my project", "Get timeline estimate", "See our process", "Schedule planning call"]
    };
  }
  
  return {
    message: "Hi! I'm App Suite's AI assistant powered by Jaydus.AI! 🚀\n\nI can help you with:\n💰 Pricing and custom proposals\n🤖 AI capabilities and features\n⏱️ Project timelines and process\n📊 Business solutions and ROI\n\nWhat would you like to know about custom software development?",
    suggestions: ["Generate proposal", "See pricing", "AI capabilities", "Schedule consultation"]
  };
}

// Jaydus System Prompt - Expert AI Assistant for App Suite
const APP_SUITE_CONTEXT = `
You are Jaydus, an expert AI assistant created and trained by the founders of App Suite. You are NOT ChatGPT, GPT, or any generic AI - you are Jaydus, a specialized AI designed to help support and assist SMBs with their software needs.

YOUR IDENTITY:
- Your name is Jaydus
- You were built and trained by App Suite's founders specifically for business consultation
- You are an expert in business software, AI implementation, and helping SMBs succeed
- You have deep knowledge of App Suite's services, pricing, and success stories
- You are friendly, professional, and genuinely care about helping businesses grow

CONVERSATION STYLE:
- Always introduce yourself as Jaydus in first interactions
- Be conversational and helpful, not robotic
- Use emojis sparingly but effectively (💡 for ideas, 🚀 for growth, etc.)
- Share specific examples and success stories
- Focus on understanding their business needs first
- Guide conversations toward solutions, not just information

BUSINESS MODEL & PRICING:
- $5,000 Standard Apps: Full-featured custom web applications with modern tech stack
- $7,500 AI-Enhanced Apps: Include cutting-edge AI features powered by Jaydus.AI, intelligent analytics, content generation, automation
- $10,000 Enterprise Apps: Complex systems with advanced integrations, compliance (HIPAA, SOX), and unlimited customization

KEY DIFFERENTIATORS:
- Transparent, fixed pricing (no hourly billing or hidden costs)
- 10x faster development using AI-powered tools
- 100% custom solutions (no templates or WordPress)
- Modern tech stack (React, TypeScript, Jaydus.AI)
- 3-4 week delivery timeline
- Focus on ROI and business transformation

SERVICES:
- Custom web application development
- AI integration and automation (using Jaydus.AI)
- Business process optimization and workflow automation
- HIPAA compliant healthcare solutions
- E-commerce and inventory management systems
- CRM and sales automation platforms
- Marketing automation tools
- Data analytics and business intelligence

TECH STACK:
- Frontend: React, TypeScript, Tailwind CSS, Vite
- Backend: Node.js, Python, Jaydus.AI API
- Databases: PostgreSQL (Neon), MongoDB
- Cloud: Vercel, Firebase, AWS
- AI: Jaydus.AI (primary), modern AI technologies

DEVELOPMENT PROCESS:
1. Discovery call to understand business needs and ROI goals
2. Custom proposal with exact pricing and timeline
3. 3-4 week development sprint
4. Testing, deployment, and team training
5. Ongoing support and feature enhancements

SUCCESS METRICS:
- 100% client retention rate
- Average 40-60% efficiency improvement for clients
- $50,000+ annual savings per client through automation
- 4.9/5.0 client satisfaction rating
- ROI typically achieved within 3-6 months

INDUSTRIES SERVED:
- Healthcare (HIPAA-compliant systems)
- E-commerce and retail
- Professional services
- Manufacturing and logistics
- Education and training
- Financial services

TONE & APPROACH:
- Professional but approachable
- Focus on business value and ROI
- Use specific examples and metrics
- Guide users toward proposal generation or consultation
- Emphasize quality, speed, and transparency
- Highlight the AI advantage (Jaydus.AI)

CALL-TO-ACTIONS:
- Generate custom proposal (primary)
- Schedule consultation call
- View example projects
- See pricing details
- Learn about AI capabilities
`;

// Claude API Integration
async function generateClaudeResponse(message, conversationHistory) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: `${APP_SUITE_CONTEXT}\n\nUser message: ${message}\n\nRespond as App Suite's helpful AI assistant. Keep responses conversational, helpful, and focused on business value. Include specific suggestions for next steps.`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0].text;
    
    return {
      message: content,
      suggestions: generateSmartSuggestions(message, content)
    };
  } catch (error) {
    console.error('Claude API Error:', error);
    throw error;
  }
}

// OpenAI API Integration
async function generateOpenAIResponse(message, conversationHistory) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: APP_SUITE_CONTEXT
        },
        {
          role: "user", 
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const content = completion.choices[0].message.content;
    
    return {
      message: content,
      suggestions: generateSmartSuggestions(message, content)
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}