const Anthropic = require('@anthropic-ai/sdk');

// Initialize Claude with your API key
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { prompt, context: codeContext, projectType } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    // Create a detailed system prompt for code generation
    const systemPrompt = `You are an expert ${projectType || 'React'} developer. Generate clean, production-ready code based on the user's request. 
    
    Follow these guidelines:
    - Use TypeScript when appropriate
    - Include proper error handling
    - Add helpful comments
    - Follow best practices and modern patterns
    - Make the code reusable and maintainable
    - If creating a component, include props interfaces
    - If creating an API service, include proper types
    
    Current file context: ${codeContext || 'No specific context'}`;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Generate code for: ${prompt}`
        }
      ]
    });

    // Extract code from Claude's response
    const responseText = message.content[0].text;
    
    // Parse code blocks from the response
    const codeMatch = responseText.match(/```(?:jsx?|tsx?|javascript|typescript)?\n([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1].trim() : responseText;
    
    // Extract explanation (text outside code blocks)
    const explanation = responseText.replace(/```[\s\S]*?```/g, '').trim();

    return {
      statusCode: 200,
      body: JSON.stringify({
        code,
        explanation,
        model: 'claude-3-opus-20240229'
      })
    };
  } catch (error) {
    console.error('Claude API error:', error);
    
    // Fallback to simulated response if API fails
    if (error.status === 401) {
      return {
        statusCode: 401,
        body: JSON.stringify({ 
          error: 'Invalid API key. Please set ANTHROPIC_API_KEY in environment variables.' 
        })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to generate code',
        details: error.message 
      })
    };
  }
};

// Helper function to enhance prompts based on common patterns
function enhancePrompt(prompt, projectType) {
  const enhancements = {
    'react': {
      'form': 'Create a React form component with validation, error handling, and TypeScript interfaces',
      'api': 'Create a TypeScript API service with axios, error handling, and proper types',
      'component': 'Create a reusable React component with TypeScript, props interface, and proper styling',
      'hook': 'Create a custom React hook with TypeScript and proper return types',
      'context': 'Create a React context provider with TypeScript and custom hook for consumption'
    },
    'nextjs': {
      'api': 'Create a Next.js API route with proper TypeScript types and error handling',
      'page': 'Create a Next.js page component with SSR/SSG support and TypeScript',
      'component': 'Create a Next.js compatible React component with TypeScript'
    }
  };

  const projectEnhancements = enhancements[projectType] || enhancements['react'];
  
  // Check if prompt matches any enhancement patterns
  for (const [key, enhancement] of Object.entries(projectEnhancements)) {
    if (prompt.toLowerCase().includes(key)) {
      return `${enhancement}. Specific requirement: ${prompt}`;
    }
  }
  
  return prompt;
}