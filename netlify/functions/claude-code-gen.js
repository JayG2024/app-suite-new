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

    // For now, simulate Claude's response
    // In production, you would call the Claude API here
    const simulatedResponse = generateCodeResponse(prompt, codeContext, projectType);

    return {
      statusCode: 200,
      body: JSON.stringify({
        code: simulatedResponse.code,
        explanation: simulatedResponse.explanation
      })
    };
  } catch (error) {
    console.error('Claude code generation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to generate code',
        details: error.message 
      })
    };
  }
};

function generateCodeResponse(prompt, context, projectType = 'react') {
  // Simulate intelligent code generation based on the prompt
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('component') || promptLower.includes('button')) {
    return {
      code: `import React from 'react';
import { Button } from '@/components/ui/button';

interface ${capitalizeFirst(extractComponentName(prompt))}Props {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

const ${capitalizeFirst(extractComponentName(prompt))}: React.FC<${capitalizeFirst(extractComponentName(prompt))}Props> = ({ 
  onClick, 
  children, 
  variant = 'primary',
  disabled = false 
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      className="custom-button"
    >
      {children}
    </Button>
  );
};

export default ${capitalizeFirst(extractComponentName(prompt))};`,
      explanation: `I've created a reusable ${extractComponentName(prompt)} component with TypeScript support. It includes:
- Props interface for type safety
- Customizable variants
- Click handler support
- Disabled state handling`
    };
  }
  
  if (promptLower.includes('api') || promptLower.includes('fetch')) {
    return {
      code: `// API service for ${prompt}
import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export const apiService = {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await axios.get(\`\${API_BASE_URL}\${endpoint}\`);
      return {
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error('API GET error:', error);
      return {
        data: null as any,
        error: error.message,
        status: error.response?.status || 500
      };
    }
  },

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await axios.post(\`\${API_BASE_URL}\${endpoint}\`, data);
      return {
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error('API POST error:', error);
      return {
        data: null as any,
        error: error.message,
        status: error.response?.status || 500
      };
    }
  }
};`,
      explanation: `I've created a complete API service with:
- Axios for HTTP requests
- TypeScript generics for type safety
- Error handling
- Environment variable support
- GET and POST methods ready to use`
    };
  }
  
  if (promptLower.includes('form') || promptLower.includes('input')) {
    return {
      code: `import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Submit form data
      console.log('Submitting:', formData);
      
      // Reset form
      setFormData({ name: '', email: '', message: '' });
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          rows={4}
          required
        />
      </div>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
};

export default ContactForm;`,
      explanation: `I've created a complete form component with:
- Controlled inputs with state management
- Form validation
- Submit handler with loading state
- Error handling
- TypeScript interfaces for type safety`
    };
  }
  
  // Default response for general requests
  return {
    code: `// Generated code for: ${prompt}
import React from 'react';

const GeneratedComponent: React.FC = () => {
  // TODO: Implement ${prompt}
  
  return (
    <div className="generated-component">
      <h2>${prompt}</h2>
      <p>Implementation goes here</p>
    </div>
  );
};

export default GeneratedComponent;`,
    explanation: `I've created a basic component structure for your request. You can now:
1. Add your specific implementation
2. Import any additional dependencies
3. Add props and state as needed
4. Style with CSS or Tailwind classes`
  };
}

function extractComponentName(prompt) {
  // Try to extract a component name from the prompt
  const words = prompt.split(' ');
  const componentWords = words.filter(word => 
    word.length > 3 && 
    !['create', 'make', 'build', 'component', 'for', 'with'].includes(word.toLowerCase())
  );
  
  return componentWords[0] || 'Generated';
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}