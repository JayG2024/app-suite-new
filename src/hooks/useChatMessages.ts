
import { useState } from "react";
import { toast } from "sonner";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! I'm your AI Assistant. I can help you:"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const getFallbackResponse = (userMessage: string) => {
    const lowerCaseInput = userMessage.toLowerCase();
    
    if (lowerCaseInput.includes("demo") || lowerCaseInput.includes("consultation")) {
      setShowContactForm(true);
      return "I'd be happy to help you schedule a demo! Please fill out this quick form, and our team will get back to you shortly.";
    }
    
    if (lowerCaseInput.includes("pricing") || lowerCaseInput.includes("cost")) {
      return "Our AI-powered business applications start at $5,000 per application with full customization included. We also offer mini tools starting at $2,500. Would you like to schedule a demo to learn more? I can help you with that!";
    }

    if (lowerCaseInput.includes("documentation") || lowerCaseInput.includes("docs")) {
      return "You can find our detailed documentation at [Documentation](/documentation). Would you like me to walk you through any specific features?";
    }

    if (lowerCaseInput.includes("feature") || lowerCaseInput.includes("capability")) {
      return "We offer comprehensive AI solutions across four main categories:\n\n1. [Finance Apps](/finance-apps): AI Invoice Generator, Budget Analyzer, and Financial Forecaster\n2. [Customer Management](/customer-management): AI CRM Manager, Customer Insights, and Feedback Analyzer\n3. [Operations Tools](/operations-tools): Workflow Optimizer, Resource Allocator, and Supply Chain Manager\n4. [Marketing Solutions](/marketing-solutions): Content Generator, Campaign Analyzer, and Market Researcher\n\nWould you like to schedule a demo to see these tools in action?";
    }
    
    return "Thanks for your interest in our AI solutions! I can help you explore our products, schedule a demo, or find technical documentation. What specific area would you like to learn more about?";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Disabled API calls for security - using pre-defined responses only
      const fallbackResponse = getFallbackResponse(userMessage);
      setMessages(prev => [...prev, { role: "assistant", content: fallbackResponse }]);
      setIsLoading(false);
      return;
      
      /* API code disabled for security
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are an AI assistant for App Suite by Jaydus Inc, specializing in AI-powered business solutions.

Key Information:

1. Product Categories:
   - Finance Apps:
     * AI Invoice Generator - Automated invoice creation and processing
     * Budget Analyzer - AI-driven budget optimization
     * Financial Forecaster - Predictive financial analysis
   
   - Customer Management:
     * AI CRM Manager - Intelligent customer relationship management
     * Customer Insights - Deep customer behavior analysis
     * Feedback Analyzer - Automated feedback processing
   
   - Operations Tools:
     * Workflow Optimizer - AI-powered process improvement
     * Resource Allocator - Smart resource management
     * Supply Chain Manager - Intelligent supply chain optimization
   
   - Marketing Solutions:
     * Content Generator - AI-driven content creation
     * Campaign Analyzer - Marketing campaign optimization
     * Market Researcher - Automated market analysis

2. Pricing Structure:
   - Full Applications: $5,000 each with customization
   - Mini Tools: $2,500 each
   - All prices include implementation and support

3. Implementation:
   - 2-week delivery timeframe
   - Includes customization and setup
   - Data migration support
   - Team training included

4. Support Services:
   - 24/7 customer support
   - Dedicated implementation team
   - Ongoing technical assistance
   - Regular updates and improvements

Your role is to:
- Help users find the right solution based on their business needs
- Explain features and capabilities clearly
- Provide accurate pricing information
- Answer implementation and support questions
- Be friendly and professional while maintaining accuracy

Always aim to understand the user's specific business needs before recommending solutions.`
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      setMessages(prev => [...prev, { role: "assistant", content: aiResponse }]);
      */
    } catch (error) {
      console.error("Error calling AI API:", error);
      
      const fallbackResponse = getFallbackResponse(userMessage);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: fallbackResponse
      }]);
      
      toast.error("AI Assistant Unavailable", {
        description: "Falling back to pre-defined responses."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionClick = (option: string) => {
    // Add the selected option as a user message
    setMessages(prev => [...prev, { role: "user", content: option }]);
    
    // Generate a response based on the option
    setIsLoading(true);
    
    setTimeout(() => {
      let response = "";
      
      // Enhanced responses with proper links
      if (option.toLowerCase().includes("documentation")) {
        response = "You can find our detailed documentation at [Documentation](/documentation). Is there a specific topic you'd like to learn more about?";
      } else if (option.toLowerCase().includes("ai") || option.toLowerCase().includes("solutions")) {
        response = "Our AI-powered business solutions include:\n\n1. [Finance Apps](/finance-apps): Automated invoicing, budget analysis, and financial forecasting\n2. [Customer Management](/customer-management): Intelligent CRM and customer insights\n3. [Operations Tools](/operations-tools): Workflow optimization and resource management\n4. [Marketing Solutions](/marketing-solutions): AI content generation and campaign analysis\n\nWhich solution area interests you the most?";
      } else if (option.toLowerCase().includes("demo")) {
        setShowContactForm(true);
        response = "I'd be happy to schedule a demo for you! Please fill out this quick form, and our team will contact you to arrange a personalized demonstration.";
      } else if (option.toLowerCase().includes("pricing")) {
        response = "Our AI-powered business applications start at $5,000 per application with full customization included. We also offer mini tools starting at $2,500. You can use our [Financing Calculator](/financing-calculator) or I can help you [schedule a consultation](/contact).";
      } else {
        response = getFallbackResponse(option);
      }
      
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
      
      // Show contact form if demo is requested
      if (option.toLowerCase().includes("demo") || 
          option.toLowerCase().includes("schedule")) {
        setShowContactForm(true);
      }
    }, 500);
  };

  return {
    messages,
    setMessages,
    input,
    isLoading,
    showContactForm,
    setShowContactForm,
    handleInputChange,
    handleSubmit,
    handleOptionClick,
  };
};
