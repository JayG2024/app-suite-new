import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Brain, 
  User, 
  Sparkles, 
  FileText, 
  Mail, 
  Share2,
  Copy,
  Download,
  Calendar
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  category?: 'general' | 'content' | 'newsletter' | 'social' | 'proposal';
}

interface ContentSuggestion {
  type: 'newsletter' | 'social' | 'blog' | 'case-study';
  title: string;
  description: string;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `🧠 **AI Brand Brain Activated!**

I'm now the intelligence center of App Suite. I know everything about your business:

• **Services**: AI-powered custom applications ($5K-$10K packages)
• **Target Market**: Businesses needing automation & efficiency
• **Unique Value**: "Own, don't rent" - complete source code ownership
• **Technology**: React, AI APIs, modern web development
• **Brand Voice**: Professional, innovative, results-focused

**What can I help you create today?**

💡 *Try asking me:*
- "Create a newsletter about our new proposal feature"
- "Write 5 LinkedIn posts about AI automation"
- "Generate a case study template"
- "Plan a content series for Q1 product launch"`,
      timestamp: new Date(),
      category: 'general'
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<{ content: string; category: Message['category'] }> => {
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const message = userMessage.toLowerCase();

    // Newsletter requests
    if (message.includes('newsletter')) {
      return {
        content: `📧 **Newsletter Content Generated!**

**Subject**: "New AI-Powered Proposal Feature Launches at App Suite"

**Content**:

---

# Transform Your Business Proposals with AI

Hi [Name],

Exciting news! We've just launched our most requested feature - AI-powered proposal generation with document upload capabilities.

## What's New:
• **Document Upload**: Upload business plans, requirements docs, current system info
• **AI Analysis**: Our AI analyzes your company information for ultra-personalized proposals  
• **5-Step Process**: Streamlined experience from contact info to custom proposal
• **PDF Generation**: Professional proposals delivered instantly

## Real Impact:
*"The new proposal feature saved us 3 hours and resulted in the most detailed proposal we've ever received. We signed the same day!"* - Sarah M., TechCorp

## Ready to Experience It?
[Generate Your Custom Proposal →](https://app-suite-bxuzsgloh-jayg2024s-projects.vercel.app)

Best regards,  
The App Suite Team

---

**📋 Additional Ideas:**
- A/B test subject lines
- Add customer testimonial section
- Include pricing comparison chart
- Create follow-up sequence

**Ready to schedule this newsletter?**`,
        category: 'newsletter'
      };
    }

    // Social media requests
    if (message.includes('social') || message.includes('linkedin') || message.includes('twitter')) {
      return {
        content: `📱 **Social Media Content Created!**

## LinkedIn Posts (5 options):

**Post 1 - Feature Announcement**
🚀 Just launched: AI-powered proposal generation at App Suite! 

Upload your business docs → Get ultra-personalized proposals → Close deals faster

No more generic proposals. Every one is tailored to YOUR specific needs.

#AI #BusinessAutomation #SaaS

**Post 2 - Problem/Solution**  
❌ Generic proposals that don't address specific needs
✅ AI-analyzed custom proposals that speak directly to your challenges

This is why our new proposal feature is a game-changer.

**Post 3 - Social Proof**
"Saved us 3 hours and got the most detailed proposal ever. Signed same day!" 

When AI understands your business, proposals become conversation starters, not paperwork.

**Post 4 - Educational**
💡 The secret to winning proposals? Personalization at scale.

Our AI reads your business docs and creates proposals that feel hand-written for your exact situation.

**Post 5 - Call-to-Action**
Ready for proposals that actually win deals?

Try our new AI proposal generator - upload your info, get custom proposals in minutes.

[Link in comments]

**📋 Want me to adapt these for Twitter or create Instagram content?**`,
        category: 'content'
      };
    }

    // Case study requests
    if (message.includes('case study')) {
      return {
        content: `📊 **Case Study Template Generated!**

# [Client Name] Achieves [Specific Result] with App Suite

## The Challenge
[Client] was struggling with [specific problem]:
- [Pain point 1]
- [Pain point 2]  
- [Pain point 3]

*"[Quote about their challenge]"* - [Contact Name, Title]

## The Solution
App Suite built a custom [application type] that:
- ✅ [Specific feature that solved problem 1]
- ✅ [Specific feature that solved problem 2]
- ✅ [Specific feature that solved problem 3]

**Key Technologies Used:**
- AI-powered [specific AI feature]
- Custom dashboard with [specific functionality]
- [Integration details]

## The Results
📈 **[Timeframe] after launch:**
- [Metric 1]: [Improvement]%
- [Metric 2]: [Improvement]%  
- [Metric 3]: [Improvement]%
- ROI: [X]% in [timeframe]

*"[Quote about results and experience]"* - [Contact Name]

## Ready for Similar Results?
[Call-to-action and contact info]

---

**📋 To complete this case study, I'll need:**
- Client name and industry
- Specific challenges they faced
- Solution details we provided
- Measurable results achieved
- Client quotes/testimonials

**Want me to customize this for a specific client?**`,
        category: 'content'
      };
    }

    // Content planning requests
    if (message.includes('content plan') || message.includes('campaign') || message.includes('launch')) {
      return {
        content: `📅 **Content Campaign Strategy Created!**

# Q1 Product Launch Content Series

## Week 1: Awareness
**Monday**: Blog post - "The Future of Business Proposals is Here"
**Wednesday**: LinkedIn article - "Why Generic Proposals Fail"  
**Friday**: Newsletter - Feature announcement

## Week 2: Education  
**Monday**: Tutorial video - "How to Upload Documents for Better Proposals"
**Wednesday**: Webinar - "AI-Powered Business Solutions Demo"
**Friday**: Case study release

## Week 3: Social Proof
**Monday**: Customer testimonial videos
**Wednesday**: Success metrics infographic
**Friday**: Comparison chart (before/after)

## Week 4: Call-to-Action
**Monday**: Limited-time offer announcement
**Wednesday**: FAQ blog post
**Friday**: Final push newsletter

## Content Distribution:
- 📧 **Email**: 4 newsletters
- 📱 **LinkedIn**: 12 posts
- 📝 **Blog**: 4 articles  
- 🎥 **Video**: 3 tutorials
- 📊 **Graphics**: 6 infographics

**📋 Want me to create specific content for any of these?**`,
        category: 'content'
      };
    }

    // General business questions
    return {
      content: `🧠 **AI Brand Brain Response:**

I understand you're looking for help with App Suite marketing. Here's what I can create for you:

## 📧 **Content Creation:**
- Newsletters about features/updates
- Social media posts (LinkedIn, Twitter, Instagram)
- Blog articles and case studies
- Email campaigns and sequences

## 📊 **Marketing Materials:**
- Proposal templates and follow-ups
- Landing page copy
- Ad copy for campaigns
- Webinar scripts and presentations

## 📈 **Strategy & Planning:**
- Content calendars
- Launch campaigns
- Customer journey mapping
- Competitive analysis

**💡 Try being more specific, like:**
- "Create a newsletter about [specific topic]"
- "Write LinkedIn posts about [feature/benefit]"
- "Plan a campaign for [product launch]"
- "Generate a case study for [industry]"

**What would you like me to help you create today?**`,
      category: 'general'
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const { content, category } = await generateAIResponse(inputValue);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content,
        timestamp: new Date(),
        category
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { label: "Newsletter", prompt: "Create a newsletter about our latest features" },
    { label: "Social Posts", prompt: "Create 5 LinkedIn posts about AI automation" },
    { label: "Case Study", prompt: "Generate a case study template" },
    { label: "Campaign", prompt: "Plan a content campaign for our next product launch" }
  ];

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Brand Brain Chat
            <Badge variant="secondary" className="ml-auto">
              Marketing Intelligence
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'ai' && (
                    <div className="p-2 bg-primary rounded-full">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-primary text-white ml-auto' 
                        : 'bg-gray-100'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      {message.category && (
                        <Badge variant="outline" className="text-xs">
                          {message.category}
                        </Badge>
                      )}
                      {message.type === 'ai' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(message.content)}
                          className="h-6 px-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="p-2 bg-gray-200 rounded-full">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="p-2 bg-primary rounded-full">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="border-t p-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(action.prompt)}
                  className="text-xs"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Ask me to create newsletters, social posts, campaigns, or any marketing content..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIChat;