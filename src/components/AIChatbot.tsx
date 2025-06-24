import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  X,
  Bot,
  User,
  Sparkles,
  ArrowRight,
  Zap
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Smart suggestions generator for local responses
  const generateSmartSuggestions = (userMessage: string, botResponse: string): string[] => {
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
    
    return ["Generate proposal", "See pricing", "Book consultation", "View examples"];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<{ content: string; suggestions?: string[] }> => {
    setIsTyping(true);
    setStreamingMessage("");
    
    try {
      // Use the actual API endpoint
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        setIsTyping(false);
        
        if (data.response && data.response.message) {
          await streamResponse(data.response.message);
          return {
            content: data.response.message,
            suggestions: data.response.suggestions || generateSmartSuggestions(userMessage, data.response.message)
          };
        }
      } else {
        console.log('API returned error, using fallback');
      }
    } catch (error) {
      console.log('API unavailable, using local responses:', error);
    }
    
    // Fallback to local responses with minimal delay
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsTyping(false);
    
    const responseData = getResponseContent(userMessage.toLowerCase());
    await streamResponse(responseData.content);
    return responseData;
  };

  const streamResponse = async (content: string) => {
    const words = content.split(' ');
    let currentMessage = '';
    
    for (let i = 0; i < words.length; i++) {
      currentMessage += (i === 0 ? '' : ' ') + words[i];
      setStreamingMessage(currentMessage);
      await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay between words
    }
    
    setStreamingMessage("");
  };

  const getResponseContent = (message: string): { content: string; suggestions?: string[] } => {
    // Business model questions
    if (message.includes('price') || message.includes('cost') || message.includes('pricing')) {
      return {
        content: "**CRM Pricing Based on Complexity:**\n\n💰 **$5,000 Standard CRM:** Contact management, pipeline tracking, basic reporting\n\n🤖 **$7,500 AI-Enhanced CRM:** + Smart lead scoring, automated follow-ups, predictive analytics\n\n🚀 **$10,000 Enterprise CRM:** + Advanced integrations, custom workflows, compliance features\n\nA real estate team saw 60% faster lead conversion with our AI-powered CRM that automatically scores leads and suggests optimal follow-up timing.\n\n**Key CRM Features We Build:**\n• Lead capture and scoring\n• Pipeline management and forecasting\n• Automated email sequences\n• Integration with existing tools\n• Custom reporting dashboards\n• Mobile-responsive design",
        suggestions: ["What type of business is this CRM for?", "Are you looking to replace an existing system?"]
      };
    }

    if (message.includes('ai') || message.includes('artificial intelligence')) {
      return {
        content: "App Suite specializes in AI-powered business solutions! 🤖\n\n**Our AI capabilities include:**\n• Intelligent Analytics - AI-powered insights and reporting\n• Content Generation - Automated writing, emails, and marketing content\n• Smart Automation - Workflow optimization and process automation\n• AI Chatbots - Customer service and lead qualification\n• Predictive Analytics - Forecasting and trend analysis\n\nWe integrate with the latest AI technologies to give you the most advanced capabilities available.",
        suggestions: ["What type of business is this CRM for?", "Are you looking to replace an existing system?"]
      };
    }

    if (message.includes('timeline') || message.includes('how long') || message.includes('when')) {
      return {
        content: "App Suite delivers fast! ⚡\n\n**Typical Timeline:**\n• Week 1: Discovery & Planning\n• Week 2: Design & Architecture\n• Week 3: Development & Features\n• Week 4: Testing & Deployment\n\nMost projects are completed in 3-4 weeks from start to finish. Enterprise applications may take 4-6 weeks for complex integrations.\n\nWe use AI-powered development tools to build 10x faster than traditional agencies while maintaining the highest quality standards.",
        suggestions: ["What type of business is this CRM for?", "Are you looking to replace an existing system?"]
      };
    }

    if (message.includes('proposal') || message.includes('quote') || message.includes('estimate')) {
      return {
        content: "I can help you generate a custom proposal right now! 📋\n\n**Our intelligent proposal generator will ask about:**\n• Your business and industry\n• What type of application you need\n• Specific features and functionality\n• Budget and timeline preferences\n\nBased on your answers, you'll get an instant, detailed proposal with exact pricing and project timeline. Ready to get started?",
        suggestions: ["What type of business is this CRM for?", "Are you looking to replace an existing system?"]
      };
    }

    if (message.includes('example') || message.includes('portfolio') || message.includes('cases')) {
      return {
        content: "Here are some recent App Suite success stories! 🎉\n\n**Recent Success Stories:**\n• Elite Care IV - AI-powered patient management system ($7,500)\n• TechStart Inc - Smart inventory tracking with analytics ($5,000)\n• Global Logistics - Fleet management and optimization ($10,000)\n• PharmaCorp - HIPAA-compliant prescription system ($8,500)\n\nEach solution increased efficiency by 40-60% and provided ROI within 3 months. Our clients typically see $50,000+ in annual savings from process automation alone.",
        suggestions: ["See our solutions", "Generate my proposal", "Industries we serve", "ROI calculator"]
      };
    }

    if (message.includes('industry') || message.includes('healthcare') || message.includes('ecommerce') || message.includes('logistics')) {
      return {
        content: "App Suite serves businesses across many industries! 🏭\n\n🏥 Healthcare - HIPAA-compliant patient portals, practice management\n🛒 E-commerce - Custom stores, inventory management, analytics\n🚛 Logistics - Fleet tracking, route optimization, warehouse management\n💼 Professional Services - Client portals, billing automation, CRM\n🏭 Manufacturing - Production tracking, quality control, supply chain\n📚 Education - Learning management, student portals, administration\n\nEvery solution is custom-built for your specific industry requirements and compliance needs.",
        suggestions: ["My industry needs", "Compliance requirements", "Generate proposal", "Industry case studies"]
      };
    }

    if (message.includes('start') || message.includes('begin') || message.includes('next steps')) {
      return {
        content: "Let's get your project started! 🚀\n\nNext Steps:\n1️⃣ Generate Proposal - Get instant pricing and timeline\n2️⃣ Schedule Consultation - 30-min discovery call\n3️⃣ Review & Approve - Finalize requirements and contract\n4️⃣ Begin Development - Your app in 3-4 weeks!\n\nWhich would you prefer to do first? I recommend starting with a proposal so you can see exactly what's possible within your budget.",
        suggestions: ["Generate my proposal", "Schedule consultation", "See our process", "Talk to founder"]
      };
    }

    if (message.includes('team') || message.includes('who') || message.includes('founder')) {
      return {
        content: "Meet the App Suite team! 👥\n\n🎯 Jason Gordon - Founder & Lead Developer\nExpert in AI integration and business automation with 10+ years building custom solutions.\n\n👩‍💻 Expert Development Team - Full-stack developers specializing in React, TypeScript, Python, and modern cloud architecture.\n\n🤖 AI Specialists - Certified in OpenAI, Claude, and enterprise AI implementations.\n\nWe're a lean, efficient team that delivers enterprise-quality results at startup speed. Want to meet us?",
        suggestions: ["Schedule consultation", "See team credentials", "Client testimonials", "Contact Jason directly"]
      };
    }

    if (message.includes('demo') || message.includes('see') || message.includes('show')) {
      return {
        content: "I'd love to show you what App Suite can do! 🎬\n\nWhile I can't provide a live demo right now, I can:\n📋 Generate a custom proposal - See exactly what we'd build for you\n💰 Show pricing options - Transparent costs with no surprises\n🏭 View our solutions - See what we've built and what's available\n📞 Schedule a consultation - 30-minute call with our founder\n\nWhat would be most helpful for you to see first?",
        suggestions: ["Generate my proposal", "Show pricing", "View our solutions", "Schedule consultation"]
      };
    }

    if (message.includes('roi') || message.includes('return') || message.includes('savings') || message.includes('value')) {
      return {
        content: "Great question! App Suite clients typically see incredible ROI 📈\n\nAverage Results:\n💰 $50,000+ annual savings from automation\n⚡ 40-60% efficiency improvements\n📊 3-month payback period\n🎯 200-500% ROI in first year\n\nHow we deliver value:\n🤖 Automate repetitive tasks\n📈 Improve decision-making with data\n⏱️ Save hours per day per employee\n🔧 Eliminate expensive software subscriptions\n\nWant to calculate your specific ROI potential?",
        suggestions: ["Calculate my ROI", "See cost breakdown", "Generate proposal", "Success stories"]
      };
    }

    if (message.includes('competitor') || message.includes('compare') || message.includes('vs') || message.includes('better')) {
      return {
        content: "Here's what makes App Suite different from other development companies: 🏆\n\nApp Suite Advantages:\n💰 Fixed pricing (others charge $150-300/hour)\n⚡ 3-4 week delivery (others take 3-6 months)\n🤖 AI-powered development (10x faster than traditional)\n🏆 100% custom (no templates or generic solutions)\n📞 Direct founder access (not passed between teams)\n\nTraditional Agencies:\n❌ $50,000-200,000+ projects\n❌ 6-12 month timelines\n❌ Hourly billing (costs spiral)\n❌ Junior developers\n\nReady to experience the difference?",
        suggestions: ["Generate my proposal", "See pricing", "Schedule consultation", "Client testimonials"]
      };
    }

    if (message.includes('maintenance') || message.includes('support') || message.includes('after') || message.includes('ongoing')) {
      return {
        content: "Excellent question! App Suite provides comprehensive ongoing support 🛠️\n\nIncluded FREE:\n✅ 30-day post-launch support\n✅ Bug fixes and minor adjustments\n✅ Technical guidance and training\n✅ Deployment assistance\n\nOptional Ongoing Services:\n🔧 Monthly maintenance ($200/month)\n🚀 Feature additions (quoted separately)\n📊 Analytics and optimization\n🔒 Security updates and monitoring\n\nMost clients find the 30-day support period covers everything they need to get running smoothly!",
        suggestions: ["See support details", "Generate proposal", "Monthly maintenance info", "Contact support"]
      };
    }

    if (message.includes('technology') || message.includes('tech stack') || message.includes('built with')) {
      return {
        content: "App Suite uses cutting-edge technology for maximum performance and scalability! 🚀\n\nFrontend:\n⚛️ React with TypeScript\n🎨 Tailwind CSS for beautiful design\n📱 Mobile-responsive architecture\n\nBackend:\n🟢 Node.js for lightning-fast APIs\n🐍 Python for AI and data processing\n🗄️ PostgreSQL & MongoDB databases\n\nCloud & AI:\n☁️ Vercel, Firebase, AWS hosting\n🤖 OpenAI, Claude, Google Gemini AI\n🔒 Enterprise-grade security\n\nThis modern stack ensures your app is fast, secure, and future-proof!",
        suggestions: ["See AI capabilities", "Generate proposal", "Security features", "Performance benefits"]
      };
    }

    // Navigation help
    if (message.includes('proposal generator') || message.includes('calculator')) {
      return {
        content: "You can find our Proposal Generator in the main navigation! 📊\n\nIt's an interactive tool that will ask about your business needs and generate a custom proposal with exact pricing. Just click on 'Get Started' in the top menu or the main call-to-action button.\n\nWould you like me to guide you there?",
        suggestions: ["Go to proposal generator", "See sample proposal", "Pricing information", "Schedule call instead"]
      };
    }

    // Handle questions about Jaydus
    if (message.includes('who are you') || message.includes('what are you') || message.includes('your name') || message.includes('jaydus') || message.includes('ai assistant') || message.includes('chatbot') || message.includes('created') || message.includes('trained')) {
      return {
        content: "I'm Jaydus! 🤖 I'm an AI business consultant created by the founders of App Suite specifically to help SMBs like yours.\n\nI was trained on hundreds of successful App Suite projects and have deep expertise in:\n• Business process automation\n• Custom software solutions\n• AI implementation strategies\n• ROI optimization\n\nThink of me as your personal software consultant - I'm here to understand your business challenges and show you exactly how custom software can transform your operations.\n\nWhat business problem are you looking to solve?",
        suggestions: ["Help me automate my business", "I need a custom solution", "Tell me about App Suite", "What makes you different?"]
      };
    }

    // Enhanced contextual responses based on keywords
    if (message.includes('custom') || message.includes('software') || message.includes('app')) {
      return {
        content: "Perfect! App Suite specializes in building 100% custom business applications from scratch - no templates! 🎯\n\nWe create:\n🖥️ Web Applications - Custom dashboards, portals, and business tools\n📱 Mobile-Responsive - Works perfectly on all devices\n🤖 AI-Powered Features - Intelligent automation and analytics\n⚡ Lightning Fast - Built with modern React and TypeScript\n\nWhat type of custom application do you have in mind?",
        suggestions: ["See pricing options", "AI features available", "Generate my proposal", "View development process"]
      };
    }

    if (message.includes('help') || message.includes('support') || message.includes('question')) {
      return {
        content: "I'm here to help! 😊 I'm App Suite's AI assistant and I know everything about our custom software development services.\n\nI can help you with:\n💰 Pricing - Get exact costs for your project\n🤖 AI Features - See what's possible with modern AI\n⏱️ Timelines - When your app can be ready\n🏭 Industries - Solutions for your specific business\n📋 Proposals - Get a custom quote right now\n\nWhat would you like to know more about?",
        suggestions: ["Show me pricing", "AI capabilities", "Generate proposal", "Industry solutions"]
      };
    }

    if (message.includes('feature') || message.includes('functionality') || message.includes('capabilities')) {
      return {
        content: "App Suite builds applications with incredible functionality! ⚡\n\nCore Features:\n👤 User management & authentication\n📊 Advanced analytics & reporting\n🔌 API integrations (any service!)\n📱 Mobile-responsive design\n🔒 Enterprise security\n\nAI Features:\n🤖 Intelligent chatbots\n📝 Content generation\n📈 Predictive analytics\n🎯 Smart recommendations\n\nWhat specific features does your business need?",
        suggestions: ["See AI features", "Get pricing", "Generate proposal", "Schedule demo"]
      };
    }

    if (message.includes('business') || message.includes('company') || message.includes('enterprise')) {
      return {
        content: "App Suite transforms businesses with custom software that actually fits how you work! 💼\n\nBusiness Benefits:\n📈 Average 40-60% efficiency increase\n💰 $50,000+ annual savings typical\n⚡ 10x faster than traditional development\n🎯 Built exactly for your processes\n📊 Real-time business insights\n\nWe've helped companies in healthcare, logistics, e-commerce, manufacturing, and professional services streamline their operations.\n\nWhat's your biggest business challenge right now?",
        suggestions: ["Calculate my ROI", "See case studies", "Generate proposal", "Industry solutions"]
      };
    }

    // Default response from Jaydus
    return {
      content: "I'm Jaydus, and I'm here to help! 👋\n\nAs App Suite's AI business consultant, I help SMBs transform their operations with custom software. Tell me:\n\n• What type of business do you run?\n• What's your biggest operational challenge?\n• Are you currently using any software that's not quite right?\n\nI'll show you exactly how we can build a solution that fits your business perfectly - at a transparent, flat rate.\n\nLet's start with understanding your needs!",
      suggestions: ["I run a healthcare business", "We need better automation", "Our current software doesn't fit", "Tell me about pricing first"]
    };
  };

  // Simple markdown renderer for basic formatting
  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\n• /g, '\n• ') // Keep bullet points as is
      .replace(/\n/g, '<br/>'); // Line breaks
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Generate AI response with streaming
    const response = await generateAIResponse(inputValue);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Initial welcome message - always start fresh
  useEffect(() => {
    if (isOpen) {
      const welcomeMessage: Message = {
        id: "welcome",
        type: "bot",
        content: "Hi! I'm Jaydus, your AI business consultant from App Suite! 👋\n\nI was created by our founders to help SMBs like yours find the perfect software solutions. I specialize in:\n\n💡 Custom Business Applications\n🤖 AI-Powered Automation\n📈 ROI-Focused Solutions\n🚀 Rapid Development (3-4 weeks)\n\nOur transparent pricing: $5K standard, $7.5K AI-enhanced, $10K enterprise.\n\nWhat's your biggest business challenge right now? I'd love to help!",
        timestamp: new Date(),
        suggestions: ["I need a custom CRM", "Tell me about AI features", "What's your process?", "Calculate my ROI"]
      };
      setMessages([welcomeMessage]);
    } else {
      // Clear messages when chat is closed
      setMessages([]);
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 md:w-20 md:h-20 shadow-2xl bg-primary hover:bg-primary/90 animate-pulse hover:animate-none"
          size="lg"
        >
          <MessageCircle className="h-6 w-6 md:h-8 md:w-8" />
        </Button>
        {/* Attention badge */}
        <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-red-500 rounded-full flex items-center justify-center animate-ping">
          <div className="absolute w-6 h-6 md:w-8 md:h-8 bg-red-500 rounded-full animate-pulse"></div>
          <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-white relative z-10" />
        </div>
        {/* Floating text */}
        <div className="absolute -top-12 -right-2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-lg shadow-lg animate-bounce whitespace-nowrap">
          Ask me anything!
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Dark overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Centered modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="
          w-full max-w-4xl 
          h-[90vh] max-h-[800px] 
          shadow-2xl border-primary/20 
          flex flex-col
        ">
          <CardHeader className="p-4 md:p-6 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground flex flex-row items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Bot className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div>
                <CardTitle className="text-base md:text-lg font-bold">Jaydus - AI Business Consultant</CardTitle>
                <Badge variant="secondary" className="text-xs md:text-sm bg-white/20 mt-1">
                  <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  Expert SMB Advisor
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-primary-foreground hover:bg-white/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="p-0 flex flex-col flex-1 overflow-hidden">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4 md:p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] md:max-w-[85%] ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'bg-gradient-to-br from-muted to-muted/70 border border-border/50 shadow-md'
                    } rounded-xl p-3 md:p-4`}>
                      <div className="flex items-start gap-2 md:gap-3">
                        {message.type === 'bot' && (
                          <div className="p-1.5 md:p-2 bg-primary/10 rounded-full shrink-0">
                            <Bot className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                          </div>
                        )}
                        {message.type === 'user' && (
                          <div className="p-1.5 md:p-2 bg-white/20 rounded-full shrink-0">
                            <User className="h-4 w-4 md:h-5 md:w-5" />
                          </div>
                        )}
                        <div className="space-y-3 flex-1 min-w-0">
                          <div 
                            className="text-sm md:text-base leading-relaxed break-words"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                          />
                          {message.suggestions && (
                            <div className="flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs md:text-sm h-7 md:h-8 px-2 md:px-3 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                >
                                  {suggestion}
                                  <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2" />
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-br from-muted to-muted/70 border border-border/50 shadow-md rounded-xl p-4 max-w-[85%]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Thinking</span>
                          <div className="flex gap-1">
                            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
                            <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-100" />
                            <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {streamingMessage && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-br from-muted to-muted/70 border border-border/50 shadow-md rounded-xl p-4 max-w-[85%]">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-full shrink-0">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-3 flex-1 min-w-0">
                          <div 
                            className="text-sm md:text-base leading-relaxed break-words"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(streamingMessage) }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Removed Quick Actions section */}

            {/* Input */}
            <div className="p-3 md:p-4 border-t bg-background shrink-0">
              <div className="flex gap-2 md:gap-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about pricing, AI features, timeline..."
                  className="flex-1 h-10 md:h-12 text-sm md:text-base px-3 md:px-4 border-2 focus:border-primary"
                />
                <Button 
                  onClick={handleSendMessage} 
                  size="lg"
                  className="h-10 md:h-12 px-4 md:px-6 bg-primary hover:bg-primary/90"
                  disabled={!inputValue.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                💬 Jaydus - Your AI Business Consultant • Expert in SMB Software Solutions
              </p>
            </div>
          </CardContent>
      </Card>
      </div>
    </>
  );
};

export default AIChatbot;