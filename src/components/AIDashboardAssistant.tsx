import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Send, 
  Bot,
  User,
  Sparkles,
  Loader2,
  Globe,
  Search,
  X,
  Plus,
  FileText,
  Mail,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
  Target,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import { apiCall, API_ENDPOINTS } from "@/utils/api";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  action?: string;
  data?: any;
}

interface CompetitorAnalysisData {
  urls: string[];
  focusAreas: string[];
}

interface AIDashboardAssistantProps {
  dashboardData?: {
    metrics?: any;
    projects?: any[];
    clients?: any[];
    tasks?: any[];
    leads?: any[];
    invoices?: any[];
  };
  currentTab?: string;
}

const AIDashboardAssistant = ({ dashboardData, currentTab }: AIDashboardAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCompetitorDialog, setShowCompetitorDialog] = useState(false);
  const [competitorUrls, setCompetitorUrls] = useState<string[]>([""]);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      type: "assistant",
      content: `Hi! I'm your AI Dashboard Assistant. I can help you with:

📊 **Data Analysis** - Ask me about your metrics, trends, or insights
📧 **Content Generation** - Email campaigns, proposals, social media posts
🔍 **Competitor Analysis** - Analyze competitor websites and strategies
📈 **Reports** - Generate weekly reports, performance summaries
🎯 **Optimization** - Conversion funnel analysis, pricing strategies

I have access to all your dashboard data. What would you like me to help with today?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Detect intent and handle accordingly
    const intent = detectIntent(inputValue);
    
    if (intent === "competitor-analysis") {
      setShowCompetitorDialog(true);
      setIsLoading(false);
      return;
    }

    try {
      // Call the AI insights API with dashboard context
      const response = await fetch('/.netlify/functions/ai-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputValue,
          dataType: intent === "data-analysis" ? getCurrentTabDataType() : "general",
          includeMetrics: true,
          context: {
            currentTab,
            dashboardData: summarizeDashboardData(dashboardData),
            intent
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.response || "I'll help you with that. Let me process your request...",
        timestamp: new Date(),
        action: intent,
        data: data.data
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Handle specific actions
      if (intent === "generate-proposal") {
        await generateProposal();
      } else if (intent === "email-campaign") {
        await generateEmailCampaign(inputValue);
      } else if (intent === "weekly-report") {
        await generateWeeklyReport();
      }

    } catch (error) {
      console.error('AI Assistant error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I apologize, but I'm having trouble processing your request. Please try again or rephrase your question.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const detectIntent = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('competitor') || lowerQuery.includes('analyze website') || lowerQuery.includes('competition')) {
      return 'competitor-analysis';
    }
    if (lowerQuery.includes('proposal') || lowerQuery.includes('quote')) {
      return 'generate-proposal';
    }
    if (lowerQuery.includes('email') || lowerQuery.includes('campaign')) {
      return 'email-campaign';
    }
    if (lowerQuery.includes('report') || lowerQuery.includes('weekly') || lowerQuery.includes('summary')) {
      return 'weekly-report';
    }
    if (lowerQuery.includes('metric') || lowerQuery.includes('revenue') || lowerQuery.includes('client') || 
        lowerQuery.includes('project') || lowerQuery.includes('task') || lowerQuery.includes('data')) {
      return 'data-analysis';
    }
    if (lowerQuery.includes('social') || lowerQuery.includes('post') || lowerQuery.includes('content')) {
      return 'social-media';
    }
    if (lowerQuery.includes('conversion') || lowerQuery.includes('optimize') || lowerQuery.includes('funnel')) {
      return 'conversion-optimization';
    }
    
    return 'general';
  };

  const getCurrentTabDataType = (): string => {
    switch (currentTab) {
      case 'clients': return 'clients';
      case 'projects': return 'projects';
      case 'tasks': return 'tasks';
      case 'sales': return 'sales';
      case 'finance': return 'financials';
      default: return 'overview';
    }
  };

  const summarizeDashboardData = (data: any) => {
    if (!data) return {};
    
    return {
      totalRevenue: data.metrics?.totalRevenue || 0,
      activeProjects: data.projects?.length || 0,
      totalClients: data.clients?.length || 0,
      pendingTasks: data.tasks?.filter((t: any) => t.status !== 'completed').length || 0,
      recentActivity: data.leads?.slice(0, 5) || []
    };
  };

  const generateProposal = async () => {
    const proposalId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const proposalData = {
      id: proposalId,
      companyName: "AI-Generated Proposal",
      contactName: "Business Owner",
      email: "contact@example.com",
      industry: "Technology",
      appType: "custom",
      currentChallenge: "Need to streamline operations with custom software",
      desiredFeatures: ["ai", "auth", "analytics", "automation"],
      teamSize: "6-20",
      timeline: "asap",
      budget: "7500",
      additionalInfo: "Generated by AI Dashboard Assistant",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      viewCount: 0,
      isProtected: false,
      accessCode: Math.random().toString(36).substr(2, 8).toUpperCase()
    };
    
    localStorage.setItem(`proposal_${proposalId}`, JSON.stringify(proposalData));
    
    // Open in new tab
    window.open(`/proposal/${proposalId}`, '_blank');
    toast.success('Proposal generated and opened in new tab!');
  };

  const generateEmailCampaign = async (query: string) => {
    // The AI response will contain the email campaign
    navigator.clipboard.writeText(messages[messages.length - 1].content);
    toast.success('Email campaign copied to clipboard!');
  };

  const generateWeeklyReport = async () => {
    // Open report in new window with the AI-generated content
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(`
        <html>
          <head>
            <title>Weekly Report - ${new Date().toLocaleDateString()}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
              h1 { color: #333; }
              .section { margin: 20px 0; }
              .metric { display: inline-block; margin: 10px 20px 10px 0; }
              .metric-value { font-size: 24px; font-weight: bold; color: #0066cc; }
              .metric-label { font-size: 14px; color: #666; }
            </style>
          </head>
          <body>
            <h1>Weekly Performance Report</h1>
            <div class="content">
              ${messages[messages.length - 1].content.replace(/\n/g, '<br/>')}
            </div>
          </body>
        </html>
      `);
    }
    toast.success('Weekly report generated!');
  };

  const handleCompetitorAnalysis = async () => {
    const validUrls = competitorUrls.filter(url => url.trim());
    if (validUrls.length === 0) {
      toast.error('Please enter at least one competitor URL');
      return;
    }

    setShowCompetitorDialog(false);
    setIsLoading(true);

    const analysisMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: `Analyze these competitor websites: ${validUrls.join(', ')}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, analysisMessage]);

    try {
      // In a real implementation, this would call an API to analyze the websites
      const mockAnalysis = `## Competitor Analysis Report

**Analyzed Websites:**
${validUrls.map(url => `- ${url}`).join('\n')}

### Key Findings:

**1. Pricing Strategy:**
- Most competitors use monthly subscription models ($99-$499/month)
- Hidden costs and setup fees are common
- Long-term contracts required

**2. Features Comparison:**
- Limited customization options
- Template-based solutions
- No code ownership
- Slow delivery times (3-6 months)

**3. Market Positioning:**
- Focus on enterprise clients only
- Complex onboarding processes
- Poor customer support ratings

### Our Competitive Advantages:
✅ Flat-rate pricing (no hidden costs)
✅ 100% custom-built solutions
✅ Complete code ownership
✅ 30-day delivery
✅ Direct founder access

### Recommendations:
1. Emphasize our transparent pricing model
2. Highlight fast delivery times
3. Focus on code ownership benefits
4. Target SMBs underserved by competitors`;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: mockAnalysis,
        timestamp: new Date(),
        action: "competitor-analysis"
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Reset competitor URLs
      setCompetitorUrls([""]);
      
      toast.success('Competitor analysis complete!');
    } catch (error) {
      console.error('Competitor analysis error:', error);
      toast.error('Failed to analyze competitors');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick action buttons
  const quickActions = [
    { icon: <FileText className="h-4 w-4" />, label: "Generate Proposal", action: "Create a custom proposal for a new client" },
    { icon: <Mail className="h-4 w-4" />, label: "Email Campaign", action: "Create an email campaign for lead nurturing" },
    { icon: <BarChart3 className="h-4 w-4" />, label: "Weekly Report", action: "Generate my weekly performance report" },
    { icon: <Globe className="h-4 w-4" />, label: "Competitor Analysis", action: "Analyze my competitors' websites" },
    { icon: <TrendingUp className="h-4 w-4" />, label: "Revenue Insights", action: "Show me revenue trends and projections" },
    { icon: <Users className="h-4 w-4" />, label: "Client Analysis", action: "Analyze my client portfolio and opportunities" }
  ];

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                AI Dashboard Assistant
              </CardTitle>
              <CardDescription>Ask me anything about your business data</CardDescription>
            </div>
            <Badge variant="outline" className="text-green-600">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  } rounded-lg p-4`}>
                    <div className="flex items-start gap-3">
                      {message.type === 'assistant' && (
                        <div className="p-1.5 bg-primary/10 rounded-full shrink-0">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      {message.type === 'user' && (
                        <div className="p-1.5 bg-white/20 rounded-full shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                      <div className="space-y-2 flex-1">
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        {message.action && message.type === 'assistant' && (
                          <div className="flex items-center gap-2 mt-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-xs text-green-600">Action completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-4 max-w-[85%]">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-primary/10 rounded-full">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="px-6 py-3 border-t">
            <div className="flex gap-2 flex-wrap">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setInputValue(action.action);
                    handleSendMessage();
                  }}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about metrics, generate content, or analyze data..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon"
                disabled={!inputValue.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitor Analysis Dialog */}
      <Dialog open={showCompetitorDialog} onOpenChange={setShowCompetitorDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Competitor Analysis</DialogTitle>
            <DialogDescription>
              Enter competitor websites to analyze or search for competitors in your industry
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for competitors (e.g., 'CRM software', 'project management')"
                  className="pl-9"
                />
              </div>
              <Button variant="outline">Search</Button>
            </div>

            {/* URL Inputs */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Competitor URLs</label>
              {competitorUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => {
                      const newUrls = [...competitorUrls];
                      newUrls[index] = e.target.value;
                      setCompetitorUrls(newUrls);
                    }}
                    placeholder="https://competitor.com"
                  />
                  {competitorUrls.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newUrls = competitorUrls.filter((_, i) => i !== index);
                        setCompetitorUrls(newUrls);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {competitorUrls.length < 5 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCompetitorUrls([...competitorUrls, ""])}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Competitor
                </Button>
              )}
            </div>

            {/* Analysis Options */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Focus Areas</label>
              <div className="grid grid-cols-2 gap-2">
                {['Pricing', 'Features', 'Customer Reviews', 'Market Position', 'Technology Stack', 'Team Size'].map((area) => (
                  <label key={area} className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">{area}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCompetitorDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompetitorAnalysis}>
              <Search className="h-4 w-4 mr-2" />
              Analyze Competitors
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIDashboardAssistant;