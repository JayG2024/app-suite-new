import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Plus, 
  Send, 
  Eye, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  TrendingUp,
  FileText,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface Newsletter {
  id: string;
  title: string;
  subject: string;
  content: string;
  htmlContent: string;
  status: 'draft' | 'scheduled' | 'sent';
  createdAt: string;
  scheduledFor?: string;
  sentAt?: string;
  subscriberCount: number;
  openRate?: number;
  clickRate?: number;
  template: string;
}

interface NewsletterTemplate {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  category: 'product' | 'company' | 'educational' | 'promotional';
}

const NewsletterManager = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([
    {
      id: '1',
      title: 'App Suite Q4 Updates',
      subject: 'New AI Features & Customer Success Stories',
      content: 'Check out our latest AI-powered features...',
      htmlContent: '<h1>App Suite Q4 Updates</h1><p>Check out our latest AI-powered features...</p>',
      status: 'sent',
      createdAt: '2024-12-01',
      sentAt: '2024-12-01',
      subscriberCount: 1250,
      openRate: 45.2,
      clickRate: 12.8,
      template: 'product-update'
    },
    {
      id: '2',
      title: 'Holiday Special Offer',
      subject: '50% Off Enterprise Plans - Limited Time',
      content: 'Special holiday pricing for new clients...',
      htmlContent: '<h1>Holiday Special</h1><p>Special holiday pricing...</p>',
      status: 'scheduled',
      createdAt: '2024-12-10',
      scheduledFor: '2024-12-15',
      subscriberCount: 1250,
      template: 'promotional'
    }
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const templates: NewsletterTemplate[] = [
    {
      id: 'product-update',
      name: 'Product Update',
      description: 'Showcase new features and improvements',
      previewImage: '/api/placeholder/300/200',
      category: 'product'
    },
    {
      id: 'company-news',
      name: 'Company News',
      description: 'Share company milestones and team updates',
      previewImage: '/api/placeholder/300/200',
      category: 'company'
    },
    {
      id: 'educational',
      name: 'Educational Content',
      description: 'Tips, tutorials, and best practices',
      previewImage: '/api/placeholder/300/200',
      category: 'educational'
    },
    {
      id: 'promotional',
      name: 'Promotional',
      description: 'Special offers and announcements',
      previewImage: '/api/placeholder/300/200',
      category: 'promotional'
    }
  ];

  const [newNewsletter, setNewNewsletter] = useState({
    title: '',
    subject: '',
    content: '',
    template: '',
    scheduledFor: ''
  });

  const generateAIContent = async (template: string, topic: string) => {
    // Simulate AI content generation
    const templates = {
      'product-update': `# ${topic}

We're excited to share the latest updates to App Suite! Our AI-powered platform continues to evolve with features designed to streamline your business operations.

## What's New This Month

🚀 **Enhanced AI Proposal Generator**
- Smarter content analysis
- Industry-specific templates
- Improved PDF generation

🎯 **Advanced Analytics Dashboard**
- Real-time performance metrics
- Custom reporting tools
- Predictive insights

💼 **Enterprise Features**
- Enhanced security protocols
- Multi-tenant architecture
- Advanced API integrations

## Customer Success Story

"App Suite's new AI features have reduced our proposal creation time by 75%. The quality and customization are incredible!" - Sarah Johnson, TechCorp Solutions

Ready to experience these new features? [Schedule a demo](https://app-suite-main.web.app/contact) today!

Best regards,
The App Suite Team`,

      'company-news': `# ${topic}

Exciting times at App Suite! We're thrilled to share what we've been working on and where we're headed.

## Team Updates

We've been growing! Welcome to our new team members who are helping us build the future of business automation.

## Milestones Achieved

- 🎯 Reached 500+ satisfied customers
- 📈 99.9% uptime this quarter
- 🏆 Recognized as "Best AI Business Tool" by TechReview

## Community Highlights

Thank you to our amazing customers who continue to inspire us with their innovative use of App Suite.

## Looking Ahead

2025 will bring even more AI capabilities, enhanced integrations, and expanded platform features.

Stay tuned for more updates!

The App Suite Team`,

      'educational': `# ${topic}

## Master Your Business Automation with AI

Ready to transform how your business operates? Here are proven strategies to get the most out of AI-powered applications.

### 1. Start with Clear Objectives

Define what you want to achieve:
- Reduce manual processes
- Improve customer experience
- Increase operational efficiency
- Scale your business

### 2. Choose the Right AI Features

Not all AI features are created equal. Focus on:
- **Process Automation**: Eliminate repetitive tasks
- **Intelligent Analytics**: Get actionable insights
- **Smart Workflows**: Optimize your operations

### 3. Implementation Best Practices

✅ Start small and scale gradually
✅ Train your team on new features
✅ Monitor performance metrics
✅ Gather feedback and iterate

### 4. Measure Success

Track key metrics:
- Time savings per process
- Error reduction rates
- Customer satisfaction scores
- ROI on automation

## Ready to Get Started?

App Suite makes it easy to implement AI in your business. [Contact our team](https://app-suite-main.web.app/contact) for a personalized consultation.

Happy automating!
The App Suite Team`,

      'promotional': `# ${topic}

## Limited Time: 50% Off Enterprise Plans! 🎉

Transform your business with AI-powered applications at an incredible value.

### What's Included

**Enterprise Plan Features:**
- ✨ Custom AI-powered applications
- 🔄 Unlimited integrations
- 📊 Advanced analytics dashboard
- 🛡️ Enterprise-grade security
- 📞 Priority support
- 🚀 White-label options

### Special Offer Details

- **50% OFF** first 6 months
- **FREE** migration from existing systems
- **FREE** team training sessions
- **30-day** money-back guarantee

### Success Stories

"Since implementing App Suite, we've reduced operational costs by 40% and improved customer satisfaction by 60%." - Michael Brown, RetailMax Inc.

### Act Fast - Offer Expires Soon!

This exclusive pricing is only available until [DATE]. Don't miss out on the opportunity to revolutionize your business operations.

[Claim Your Discount Now](https://app-suite-main.web.app/contact)

Questions? Reply to this email or call (833) APP-SUIT.

Best regards,
Jason Gordon & The App Suite Team`
    };

    return templates[template as keyof typeof templates] || 'AI-generated content will appear here...';
  };

  const handleCreateNewsletter = async () => {
    if (newNewsletter.template) {
      const aiContent = await generateAIContent(newNewsletter.template, newNewsletter.title);
      const newsletter: Newsletter = {
        id: Date.now().toString(),
        title: newNewsletter.title,
        subject: newNewsletter.subject,
        content: aiContent,
        htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">${aiContent.replace(/\n/g, '<br>')}</div>`,
        status: 'draft',
        createdAt: new Date().toISOString().split('T')[0],
        subscriberCount: 1250, // This would come from your actual subscriber list
        template: newNewsletter.template
      };

      setNewsletters(prev => [newsletter, ...prev]);
      setNewNewsletter({ title: '', subject: '', content: '', template: '', scheduledFor: '' });
      setIsCreateOpen(false);
    }
  };

  const getStatusColor = (status: Newsletter['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Newsletter['status']) => {
    switch (status) {
      case 'draft': return <FileText className="h-3 w-3" />;
      case 'scheduled': return <Clock className="h-3 w-3" />;
      case 'sent': return <CheckCircle className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Newsletter Manager</h1>
          <p className="text-muted-foreground">Create, schedule, and manage your newsletters</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Newsletter
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Newsletter</DialogTitle>
              <DialogDescription>
                Use AI to generate engaging newsletter content
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newsletter-title">Newsletter Title</Label>
                  <Input
                    id="newsletter-title"
                    value={newNewsletter.title}
                    onChange={(e) => setNewNewsletter(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., App Suite December Updates"
                  />
                </div>
                <div>
                  <Label htmlFor="email-subject">Email Subject Line</Label>
                  <Input
                    id="email-subject"
                    value={newNewsletter.subject}
                    onChange={(e) => setNewNewsletter(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="e.g., New AI Features Just Launched!"
                  />
                </div>
              </div>

              <div>
                <Label>Choose Template</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all border-2 ${
                        newNewsletter.template === template.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setNewNewsletter(prev => ({ ...prev, template: template.id }))}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            newNewsletter.template === template.id ? 'border-primary bg-primary' : 'border-gray-300'
                          }`} />
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateNewsletter} disabled={!newNewsletter.title || !newNewsletter.template}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Newsletter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="newsletters">All Newsletters</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,250</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Newsletters Sent</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">This year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42.3%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Click Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.7%</div>
                <p className="text-xs text-muted-foreground">+1.2% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newsletters.slice(0, 3).map((newsletter) => (
                  <div key={newsletter.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{newsletter.title}</h4>
                        <p className="text-sm text-muted-foreground">{newsletter.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(newsletter.status)} flex items-center gap-1`}>
                        {getStatusIcon(newsletter.status)}
                        {newsletter.status}
                      </Badge>
                      {newsletter.status === 'sent' && (
                        <span className="text-sm text-muted-foreground">
                          {newsletter.openRate}% open rate
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="newsletters" className="space-y-6">
          <div className="grid gap-4">
            {newsletters.map((newsletter) => (
              <Card key={newsletter.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{newsletter.title}</h3>
                        <Badge className={`${getStatusColor(newsletter.status)} flex items-center gap-1`}>
                          {getStatusIcon(newsletter.status)}
                          {newsletter.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{newsletter.subject}</p>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>Created: {newsletter.createdAt}</span>
                        <span>Subscribers: {newsletter.subscriberCount.toLocaleString()}</span>
                        {newsletter.openRate && (
                          <>
                            <span>Open Rate: {newsletter.openRate}%</span>
                            <span>Click Rate: {newsletter.clickRate}%</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      {newsletter.status === 'draft' && (
                        <Button size="sm">
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Newsletter Performance</span>
                    <span className="text-sm text-muted-foreground">Last 6 months</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Open Rate</span>
                      <span className="text-sm font-medium">42.3%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42.3%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Click Rate</span>
                      <span className="text-sm font-medium">8.7%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '8.7%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Unsubscribe Rate</span>
                      <span className="text-sm font-medium">0.8%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '0.8%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Newsletters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {newsletters
                    .filter(n => n.openRate)
                    .sort((a, b) => (b.openRate || 0) - (a.openRate || 0))
                    .slice(0, 3)
                    .map((newsletter) => (
                      <div key={newsletter.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium text-sm">{newsletter.title}</h4>
                          <p className="text-xs text-muted-foreground">{newsletter.sentAt}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{newsletter.openRate}%</div>
                          <div className="text-xs text-muted-foreground">open rate</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsletterManager;