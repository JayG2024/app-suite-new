import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Calendar as CalendarIcon,
  Mail,
  Globe,
  Twitter,
  Linkedin,
  Instagram,
  FileText,
  Sparkles,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Crosshair as Target,
  Zap,
  Clock,
  CheckCircle,
  Plus,
  Edit,
  BarChart3,
  Trash2
} from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  content: string;
  contentType: "blog" | "social" | "email" | "newsletter";
  status: "draft" | "scheduled" | "published";
  platform: string;
  scheduledDate: string | null;
  publishedDate: string | null;
  campaignId: number | null;
  campaignName: string | null;
  keywords: string[];
  metrics: {
    views: number;
    clicks: number;
    shares: number;
    engagement: number;
  };
  createdBy: number;
  createdByName: string;
  createdDate: string;
  notes: string;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: "planning" | "active" | "completed";
  campaignType: string;
  platform: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  leads: number;
  conversions: number;
  clicks: number;
  impressions: number;
  createdBy: number;
  createdByName: string;
  createdDate: string;
  notes: string;
}

interface Analytics {
  websiteTraffic: {
    totalViews: number;
    totalVisitors: number;
    avgBounceRate: number;
    sources: { [key: string]: number };
  };
  socialMedia: {
    [platform: string]: {
      followers: number;
      engagement: number;
      posts: number;
    };
  };
  email: {
    subscribers: number;
    openRate: number;
    clickRate: number;
    campaignsSent: number;
  };
  content: ContentItem[];
  leads: {
    total: number;
    qualified: number;
    conversionRate: number;
  };
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

const MarketingHub = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showContentCreator, setShowContentCreator] = useState(false);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [contentType, setContentType] = useState<string>("blog");
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    campaignType: "general",
    platform: "",
    startDate: "",
    endDate: "",
    budget: 0,
    notes: ""
  });
  
  const [newContent, setNewContent] = useState({
    title: "",
    content: "",
    contentType: "blog",
    platform: "",
    scheduledDate: "",
    campaignId: "",
    keywords: "",
    notes: ""
  });

  useEffect(() => {
    // Get current user
    const authUser = localStorage.getItem("commandCenterUser");
    setCurrentUser(authUser);

    // Load all data
    loadCampaigns();
    loadContent();
    loadAnalytics();
    loadUsers();
    
    // Refresh data every 30 seconds for real-time collaboration
    const interval = setInterval(() => {
      loadCampaigns();
      loadContent();
      loadAnalytics();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadCampaigns = async () => {
    try {
      const response = await fetch('/api/marketing-campaigns');
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContent = async () => {
    try {
      const response = await fetch('/api/marketing-content');
      if (response.ok) {
        const data = await response.json();
        setContent(data.content);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const getCurrentUserId = () => {
    const user = users.find(u => u.email === currentUser);
    return user?.id || null;
  };

  const addCampaign = async () => {
    if (!newCampaign.name) {
      alert("Please fill in campaign name");
      return;
    }

    try {
      const response = await fetch('/api/marketing-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCampaign,
          createdBy: getCurrentUserId()
        })
      });

      if (response.ok) {
        await loadCampaigns();
        setNewCampaign({
          name: "",
          description: "",
          campaignType: "general",
          platform: "",
          startDate: "",
          endDate: "",
          budget: 0,
          notes: ""
        });
        setShowCampaignDialog(false);
      } else {
        const error = await response.json();
        alert(`Failed to create campaign: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    }
  };

  const addContent = async () => {
    if (!newContent.title) {
      alert("Please fill in content title");
      return;
    }

    try {
      const response = await fetch('/api/marketing-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newContent,
          campaignId: newContent.campaignId ? parseInt(newContent.campaignId) : null,
          keywords: newContent.keywords ? newContent.keywords.split(',').map(k => k.trim()) : [],
          createdBy: getCurrentUserId()
        })
      });

      if (response.ok) {
        await loadContent();
        setNewContent({
          title: "",
          content: "",
          contentType: "blog",
          platform: "",
          scheduledDate: "",
          campaignId: "",
          keywords: "",
          notes: ""
        });
        setShowContentCreator(false);
      } else {
        const error = await response.json();
        alert(`Failed to create content: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating content:', error);
      alert('Failed to create content. Please try again.');
    }
  };

  const updateCampaignStatus = async (campaignId: string, status: string) => {
    try {
      const response = await fetch(`/api/marketing-campaigns?id=${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        await loadCampaigns();
      }
    } catch (error) {
      console.error('Error updating campaign status:', error);
    }
  };

  const updateContentStatus = async (contentId: string, status: string) => {
    try {
      const response = await fetch(`/api/marketing-content?id=${contentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        await loadContent();
      }
    } catch (error) {
      console.error('Error updating content status:', error);
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const response = await fetch(`/api/marketing-campaigns?id=${campaignId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadCampaigns();
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const deleteContent = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const response = await fetch(`/api/marketing-content?id=${contentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadContent();
      }
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  // Filter content for upcoming items
  const upcomingContent = content.filter(item => {
    if (item.status === 'scheduled') return true;
    if (item.status === 'draft') return true;
    return false;
  }).slice(0, 5);

  // Calculate totals for overview
  const totalReach = analytics?.socialMedia ? 
    Object.values(analytics.socialMedia).reduce((sum, platform) => sum + platform.followers, 0) : 0;

  const totalLeads = campaigns.reduce((sum, campaign) => sum + campaign.leads, 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "draft": return "default";
      case "scheduled": return "secondary";
      case "published": return "outline";
      case "planning": return "default";
      case "active": return "secondary";
      case "completed": return "outline";
      default: return "default";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading marketing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Marketing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Website Traffic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.websiteTraffic.totalViews.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{analytics?.websiteTraffic.totalVisitors.toLocaleString() || 0} visitors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Reach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalReach.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.email.subscribers.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{analytics?.email.openRate.toFixed(1) || 0}% open rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Lead Generation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">This month ({totalConversions} converted)</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="content">Content Calendar</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="automation">AI Automation</TabsTrigger>
        </TabsList>

        {/* Content Calendar */}
        <TabsContent value="content" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Content Calendar</h3>
            <Dialog open={showContentCreator} onOpenChange={setShowContentCreator}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Content
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Marketing Content</DialogTitle>
                  <DialogDescription>Add new content to your marketing calendar</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Title</Label>
                    <Input 
                      placeholder="Content title" 
                      value={newContent.title}
                      onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label>Content Type</Label>
                    <Select value={newContent.contentType} onValueChange={(value) => setNewContent({...newContent, contentType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">Blog Post</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="email">Email Campaign</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Platform</Label>
                    <Input 
                      placeholder="LinkedIn, Twitter, etc." 
                      value={newContent.platform}
                      onChange={(e) => setNewContent({...newContent, platform: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label>Campaign</Label>
                    <Select value={newContent.campaignId} onValueChange={(value) => setNewContent({...newContent, campaignId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No campaign</SelectItem>
                        {campaigns.map(campaign => (
                          <SelectItem key={campaign.id} value={campaign.id}>
                            {campaign.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Scheduled Date</Label>
                    <Input 
                      type="date" 
                      value={newContent.scheduledDate}
                      onChange={(e) => setNewContent({...newContent, scheduledDate: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label>Keywords (comma separated)</Label>
                    <Input 
                      placeholder="AI apps, business automation" 
                      value={newContent.keywords}
                      onChange={(e) => setNewContent({...newContent, keywords: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label>Content</Label>
                    <Textarea 
                      placeholder="Content details..." 
                      value={newContent.content}
                      onChange={(e) => setNewContent({...newContent, content: e.target.value})}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowContentCreator(false)}>Cancel</Button>
                    <Button onClick={addContent}>Create Content</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar View */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>December 2024</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Upcoming Content */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Content</CardTitle>
                <CardDescription>Next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingContent.map(item => (
                    <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="p-2 bg-background rounded">
                        {item.contentType === "blog" && <FileText className="h-4 w-4" />}
                        {item.contentType === "social" && <Twitter className="h-4 w-4" />}
                        {item.contentType === "email" && <Mail className="h-4 w-4" />}
                        {item.contentType === "newsletter" && <Mail className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getStatusColor(item.status)} className="text-xs">
                            {item.status}
                          </Badge>
                          {item.platform && (
                            <Badge variant="outline" className="text-xs">
                              {item.platform}
                            </Badge>
                          )}
                          {item.scheduledDate && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.scheduledDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.metrics.views} views • {item.metrics.clicks} clicks
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Select value={item.status} onValueChange={(value) => updateContentStatus(item.id, value)}>
                          <SelectTrigger className="w-[80px] h-6 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button size="sm" variant="ghost" onClick={() => deleteContent(item.id)} className="text-red-600 h-6 w-6 p-0">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {upcomingContent.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No upcoming content</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Campaigns */}
        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active Campaigns</h3>
            <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                  <DialogDescription>Create a new marketing campaign</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Campaign Name</Label>
                    <Input 
                      placeholder="Q1 2025 Growth Campaign" 
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label>Description</Label>
                    <Textarea 
                      placeholder="Campaign description..." 
                      value={newCampaign.description}
                      onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Type</Label>
                      <Select value={newCampaign.campaignType} onValueChange={(value) => setNewCampaign({...newCampaign, campaignType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="product-launch">Product Launch</SelectItem>
                          <SelectItem value="lead-generation">Lead Generation</SelectItem>
                          <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Platform</Label>
                      <Input 
                        placeholder="LinkedIn, Google, etc." 
                        value={newCampaign.platform}
                        onChange={(e) => setNewCampaign({...newCampaign, platform: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input 
                        type="date" 
                        value={newCampaign.startDate}
                        onChange={(e) => setNewCampaign({...newCampaign, startDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input 
                        type="date" 
                        value={newCampaign.endDate}
                        onChange={(e) => setNewCampaign({...newCampaign, endDate: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Budget</Label>
                    <Input 
                      type="number" 
                      placeholder="5000" 
                      value={newCampaign.budget}
                      onChange={(e) => setNewCampaign({...newCampaign, budget: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowCampaignDialog(false)}>Cancel</Button>
                    <Button onClick={addCampaign}>Create Campaign</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {campaigns.map(campaign => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <CardDescription>
                        {campaign.startDate && campaign.endDate ? (
                          `${new Date(campaign.startDate).toLocaleDateString()} - ${new Date(campaign.endDate).toLocaleDateString()}`
                        ) : (
                          campaign.description || 'No description'
                        )}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="text-lg font-semibold">${campaign.budget.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">${campaign.spent} spent</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Leads Generated</p>
                      <p className="text-lg font-semibold">{campaign.leads}</p>
                      <p className="text-xs text-green-600">↑ 23% vs last campaign</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Conversions</p>
                      <p className="text-lg font-semibold">{campaign.conversions}</p>
                      <p className="text-xs text-muted-foreground">{campaign.leads > 0 ? ((campaign.conversions / campaign.leads) * 100).toFixed(1) : 0}% rate</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ROI</p>
                      <p className="text-lg font-semibold text-green-600">
                        {campaign.conversions > 0 ? `${((campaign.conversions * 6250 - campaign.spent) / campaign.spent * 100).toFixed(0)}%` : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Select value={campaign.status} onValueChange={(value) => updateCampaignStatus(campaign.id, value)}>
                      <SelectTrigger className="w-[120px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" onClick={() => deleteCampaign(campaign.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {campaigns.length === 0 && (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No campaigns found</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors come from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.websiteTraffic.sources ? Object.entries(analytics.websiteTraffic.sources).map(([source, percentage]) => (
                    <div key={source} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{source}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${percentage}%` }} 
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{percentage}%</span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No traffic data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Social Media Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media Performance</CardTitle>
                <CardDescription>Followers and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.socialMedia && Object.keys(analytics.socialMedia).length > 0 ? (
                    <>
                      {Object.entries(analytics.socialMedia).map(([platform, data]) => (
                        <div key={platform} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {platform === 'linkedin' && <Linkedin className="h-4 w-4 text-blue-600" />}
                            {platform === 'twitter' && <Twitter className="h-4 w-4 text-blue-400" />}
                            {platform === 'instagram' && <Instagram className="h-4 w-4 text-pink-600" />}
                            <span className="text-sm capitalize">{platform}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{data.followers?.toLocaleString() || 0}</p>
                            <p className="text-xs text-muted-foreground">{data.engagement?.toFixed(1) || 0}% engagement</p>
                          </div>
                        </div>
                      ))}
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Reach</span>
                          <span className="font-semibold">{totalReach.toLocaleString()}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No social media data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Email Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Email Marketing</CardTitle>
                <CardDescription>Newsletter performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{analytics?.email.openRate?.toFixed(1) || 0}%</p>
                    <p className="text-xs text-muted-foreground">Open Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{analytics?.email.clickRate?.toFixed(1) || 0}%</p>
                    <p className="text-xs text-muted-foreground">Click Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{analytics?.email.campaignsSent || 0}</p>
                    <p className="text-xs text-muted-foreground">Campaigns Sent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Content */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
                <CardDescription>This month's best posts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.content && analytics.content.length > 0 ? (
                    analytics.content.slice(0, 3).map((item, index) => (
                      <div key={index} className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm font-medium">{item.title}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {item.metrics.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <MousePointer className="h-3 w-3" /> {item.metrics.clicks} clicks
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {item.contentType}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No published content yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Automation */}
        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Marketing Automation</CardTitle>
              <CardDescription>Let AI handle your marketing tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-auto p-4 flex-col items-start justify-start" variant="outline">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="font-semibold">AI Blog Writer</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    Generate SEO-optimized blog posts about your services
                  </p>
                </Button>

                <Button className="h-auto p-4 flex-col items-start justify-start" variant="outline">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Email Campaigns</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    Create personalized email sequences automatically
                  </p>
                </Button>

                <Button className="h-auto p-4 flex-col items-start justify-start" variant="outline">
                  <div className="flex items-center gap-2 mb-2">
                    <Twitter className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Social Media Posts</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    Schedule a month of social content in minutes
                  </p>
                </Button>

                <Button className="h-auto p-4 flex-col items-start justify-start" variant="outline">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Performance Reports</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    AI-generated insights and recommendations
                  </p>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketingHub;