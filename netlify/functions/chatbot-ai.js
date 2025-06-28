const Anthropic = require('@anthropic-ai/sdk');

// Initialize Claude with the API key from environment
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const CHATBOT_SYSTEM_PROMPT = `You are Jaydus, the AI assistant for App Suite. You help businesses understand how custom software can solve their problems.

Key information about App Suite:
- We build 100% custom business applications (no templates)
- Fixed pricing: $5,000 (Starter), $7,500 (Professional), $10,000 (Enterprise), $15,000 (Custom)
- One-time payment, no monthly fees - clients own the code forever
- Built 10x faster with AI technology
- 30-45 day delivery for most projects
- Founded by Jason Gordon, expert in AI and business automation

Common solutions we build:
- CRM systems with sales pipelines
- Inventory management with real-time tracking
- Document management and compliance tools
- E-commerce platforms
- Analytics dashboards
- Booking and scheduling systems
- HR management systems
- Custom workflows and automation

Your personality:
- Friendly and professional
- Solution-focused
- Emphasize ROI and time savings
- Guide users toward getting a proposal
- Highlight our no monthly fees advantage

Always be helpful and try to understand their specific business needs. When appropriate, suggest they generate a proposal or schedule a consultation.`;

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { message, conversationHistory = [] } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    // Build messages array with conversation history
    const messages = [
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022', // Use latest Sonnet model
      max_tokens: 1000,
      temperature: 0.7,
      system: CHATBOT_SYSTEM_PROMPT,
      messages
    });

    // Extract suggestions from the response
    const responseText = response.content[0].text;
    const suggestions = extractSuggestions(responseText, message);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        content: responseText,
        suggestions
      })
    };

  } catch (error) {
    console.error('Chatbot AI error:', error);
    
    // Return a helpful fallback response
    if (error.status === 401 || !process.env.ANTHROPIC_API_KEY) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          content: generateFallbackResponse(JSON.parse(event.body).message),
          suggestions: ["See our pricing", "Generate proposal", "Learn more", "Contact us"]
        })
      };
    }

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Failed to generate response',
        details: error.message 
      })
    };
  }
};

function extractSuggestions(response, userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  // Smart suggestions based on context
  if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return ["See detailed pricing", "Calculate my ROI", "Generate proposal", "Compare packages"];
  }
  
  if (lowerMessage.includes('crm') || lowerMessage.includes('customer')) {
    return ["CRM features", "See CRM examples", "Generate CRM proposal", "Schedule demo"];
  }
  
  if (lowerMessage.includes('ai') || lowerMessage.includes('automat')) {
    return ["AI capabilities", "Automation examples", "Calculate time savings", "See AI pricing"];
  }
  
  // Default suggestions
  return ["Generate proposal", "See pricing", "Learn more", "Schedule consultation"];
}

function generateFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm Jaydus, your AI assistant from App Suite. I'm here to help you understand how custom software can transform your business. What challenges are you facing that technology could solve?";
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return `Our transparent pricing:\n\n💰 Starter Package: $5,000\n- Up to 5 core features\n- 30-day delivery\n- Perfect for small businesses\n\n🚀 Professional: $7,500\n- AI-powered features\n- 45-day delivery\n- Ideal for growing companies\n\n🏢 Enterprise: $10,000\n- Unlimited features\n- Advanced analytics\n- 60-day delivery\n\n✨ Custom: $15,000+\n- Complex integrations\n- Dedicated support\n\nAll packages include: One-time payment (no monthly fees!), you own the code, and post-launch support.`;
  }
  
  if (lowerMessage.includes('ai') || lowerMessage.includes('artificial')) {
    return "App Suite leverages cutting-edge AI to build your applications 10x faster and add intelligent features like:\n\n🤖 Automated data entry and processing\n📊 Predictive analytics and insights\n💬 Natural language interfaces\n🔍 Smart search and recommendations\n⚡ Workflow automation\n\nEvery Professional package and above includes AI capabilities tailored to your business needs!";
  }
  
  return "I'd love to help you explore how App Suite can build a custom solution for your business! We specialize in creating applications that save time, reduce costs, and scale with your growth. What specific business process would you like to improve?";
}