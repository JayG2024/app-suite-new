const OpenAI = require('openai');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { messages, context: chatContext, temperature = 0.7, maxTokens = 500 } = JSON.parse(event.body);

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Messages array is required' })
      };
    }

    // Get system prompt based on context
    let systemPrompt = '';
    switch (chatContext) {
      case 'customer_support':
        systemPrompt = `You are an AI assistant for App Suite, a company that builds custom business applications. Your role is to help visitors understand our services, create proposals, book demos, and answer questions.

Key Information:
- We build custom business applications from scratch (no templates)
- Flat-rate pricing: $5,000 (Standard), $7,500 (AI-Enhanced), $10,000 (Enterprise)
- 14-30 day delivery depending on package
- Clients own 100% of the code
- We offer payment plans and financing options

Be helpful, professional, and guide visitors toward booking a demo or getting a proposal.`;
        break;

      case 'proposal':
        systemPrompt = `You are a proposal specialist for App Suite. Help create detailed, customized proposals for potential clients based on their requirements.

Include in proposals:
- Project scope and understanding
- Recommended package (Standard/AI-Enhanced/Enterprise)
- Timeline breakdown
- Key features and deliverables
- Investment details
- Payment options
- Next steps`;
        break;

      case 'dashboard':
        systemPrompt = `You are an AI assistant integrated with App Suite's internal dashboard. You have access to business data and can help analyze metrics, answer questions about projects, and provide insights.`;
        break;

      case 'demo_booking':
        systemPrompt = `You are a scheduling assistant for App Suite. Help visitors book demos by understanding their needs and guiding them through the process.`;
        break;

      default:
        systemPrompt = `You are a helpful AI assistant for App Suite. Answer questions professionally and guide users to appropriate resources.`;
    }

    // Create messages array with system prompt
    const messagesWithSystem = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messagesWithSystem,
      temperature: temperature,
      max_tokens: maxTokens,
      stream: false
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: completion.choices[0].message.content,
        usage: completion.usage
      })
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Return user-friendly error messages
    if (error.code === 'insufficient_quota') {
      return {
        statusCode: 503,
        body: JSON.stringify({ 
          error: 'Service temporarily unavailable. Please try again later.' 
        })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'An error occurred while processing your request.' 
      })
    };
  }
};