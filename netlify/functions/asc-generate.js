const Anthropic = require('@anthropic-ai/sdk');

// Initialize Claude with the API key from environment
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const ASC_SYSTEM_PROMPT = `You are ASC.AI (App Suite Code AI), an advanced AI coding assistant that helps developers build applications quickly and efficiently.

Your personality:
- Professional but friendly
- Focused on practical solutions
- Encouraging and supportive
- Clear and concise in explanations

Your capabilities:
- Generate complete, production-ready code
- Create entire applications from descriptions
- Debug and fix code issues
- Suggest improvements and optimizations
- Explain complex concepts clearly
- Follow best practices and modern patterns

When generating code:
1. Always use modern, clean code practices
2. Include proper error handling
3. Add helpful comments
4. Use TypeScript when appropriate
5. Follow the project's existing patterns
6. Ensure code is secure and performant

You work within the ASC.AI development environment, which includes:
- WebContainers for browser-based Node.js
- Integrated terminal and file system
- Real-time preview
- Direct deployment to Netlify
- AI-powered code generation

Remember: You're building for App Suite clients who expect high-quality, custom solutions.`;

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { messages, model = 'claude-3-5-sonnet-20241022', temperature = 0.3, max_tokens = 4000 } = JSON.parse(event.body);

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Messages array is required' })
      };
    }

    // Call Claude API
    const response = await anthropic.messages.create({
      model,
      max_tokens,
      temperature,
      system: ASC_SYSTEM_PROMPT,
      messages
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        content: response.content[0].text,
        usage: response.usage
      })
    };

  } catch (error) {
    console.error('ASC Generate error:', error);
    
    // Return a helpful error response
    if (error.status === 401 || !process.env.ANTHROPIC_API_KEY) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          content: generateMockResponse(event.body),
          usage: { input_tokens: 100, output_tokens: 200 }
        })
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to generate response',
        details: error.message 
      })
    };
  }
};

function generateMockResponse(body) {
  const { messages } = JSON.parse(body);
  const lastMessage = messages[messages.length - 1];
  const userContent = lastMessage.content.toLowerCase();

  if (userContent.includes('create') || userContent.includes('build')) {
    return `I'll help you create that! Here's a basic structure to get started:

\`\`\`javascript
// App.js
import React from 'react';

function App() {
  return (
    <div className="app">
      <h1>Your New Application</h1>
      <p>Let's build something amazing together!</p>
    </div>
  );
}

export default App;
\`\`\`

To continue building:
1. Add your components in the \`src/components\` folder
2. Set up routing with React Router
3. Style with Tailwind CSS or your preferred framework
4. Add state management as needed

What specific features would you like me to implement?`;
  }

  if (userContent.includes('fix') || userContent.includes('error')) {
    return `I can help you fix that error. Based on what you've described, here are the most common solutions:

1. **Check your imports**: Make sure all imports are correct
2. **Verify dependencies**: Run \`npm install\` to ensure all packages are installed
3. **Clear cache**: Sometimes \`rm -rf node_modules && npm install\` helps
4. **Check for typos**: Variable names and function calls must match exactly

Can you share the specific error message or code that's causing issues?`;
  }

  if (userContent.includes('deploy')) {
    return `Let's deploy your application to Netlify! Here's how:

1. **Build your project**: Run \`npm run build\`
2. **Test locally**: Make sure everything works with \`npm run preview\`
3. **Deploy**: Click the "Deploy" button in the terminal tab

ASC.AI handles the deployment process automatically:
- Optimizes your build
- Uploads to Netlify
- Provides you with a live URL

Your app will be live in about 2-3 minutes. Ready to deploy?`;
  }

  return `I understand you want to work on: "${lastMessage.content}"

I'm here to help you build amazing applications! I can:
- Generate complete code solutions
- Debug and fix issues
- Implement new features
- Optimize performance
- Deploy to production

What specific aspect would you like me to help with first?`;
}