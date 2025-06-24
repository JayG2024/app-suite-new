import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import SEO from "@/components/SEO";
import { toast } from "sonner";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";
import { API_ENDPOINTS, apiCall } from "@/utils/api";
import ProjectTracker from "@/components/ProjectTracker";
import ClientCommunication from "@/components/ClientCommunication";
import SalesPipeline from "@/components/SalesPipeline";
import MarketingHub from "@/components/MarketingHub";
import FinancialDashboard from "@/components/FinancialDashboard";
import TeamWorkspace from "@/components/TeamWorkspace";
import EmailTemplates from "@/components/EmailTemplates";
import TaskManager from "@/components/TaskManager";
import { 
  Brain, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  MessageSquare,
  BarChart3,
  Sparkles,
  Lock,
  LogOut,
  Building,
  Target,
  Zap,
  FileText,
  Mail,
  Globe,
  Code,
  Rocket,
  Loader2,
  CheckCircle,
  Clock,
  CheckSquare
} from "lucide-react";


interface DashboardMetrics {
  totalRevenue: number;
  activeProjects: number;
  totalClients: number;
  monthlyGrowth: number;
  pipelineValue: number;
  proposalsSent: number;
  conversionRate: number;
  averageProjectValue: number;
  totalTasks: number;
  completedTasks: number;
  taskCompletionRate: number;
}

interface RecentActivity {
  id: string;
  type: 'sale' | 'proposal' | 'project' | 'client';
  title: string;
  description: string;
  value?: number;
  timestamp: string;
}

const CommandCenter = () => {
  const navigate = useNavigate();
  const { socket, connected } = useSocket();
  const { user, logout } = useAuth();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenue: 0,
    activeProjects: 0,
    totalClients: 0,
    monthlyGrowth: 0,
    pipelineValue: 0,
    proposalsSent: 0,
    conversionRate: 0,
    averageProjectValue: 0,
    totalTasks: 0,
    completedTasks: 0,
    taskCompletionRate: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);


  // Calculate metrics from database
  useEffect(() => {
    const calculateMetrics = async () => {
      try {
        // Fetch metrics from dashboard endpoint
        const metricsData = await apiCall(API_ENDPOINTS.dashboard.metrics);
        setMetrics(metricsData);
        
        // Fetch leads for recent activity
        const leadsData = await apiCall(API_ENDPOINTS.leads);
        const leads = leadsData.leads || [];
          
          // Generate recent activity from leads
          const activities: RecentActivity[] = leads
            .slice(0, 5)
            .map((lead: any) => ({
              id: `lead-${lead.id}`,
              type: lead.status === 'closed-won' ? 'sale' : 'client',
              title: lead.status === 'closed-won' ? 'New Sale Closed' : 'New Lead',
              description: `${lead.name} - ${lead.company || 'Direct'}`,
              value: lead.value,
              timestamp: lead.created_at || new Date().toISOString()
            }));
          
          setRecentActivity(activities);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        // Fallback to localStorage
        const leads = JSON.parse(localStorage.getItem('app_suite_leads') || '[]');
        const proposals = Object.keys(localStorage).filter(key => key.startsWith('proposal_'));
        
        const totalRevenue = leads
          .filter((lead: any) => lead.stage === 'closed-won')
          .reduce((sum: number, lead: any) => sum + (lead.value || 0), 0);
        
        const activeProjects = leads.filter((lead: any) => 
          ['qualified', 'proposal', 'negotiation'].includes(lead.stage)
        ).length;
        
        const totalClients = leads.filter((lead: any) => lead.stage === 'closed-won').length;
        
        const pipelineValue = leads
          .filter((lead: any) => ['qualified', 'proposal', 'negotiation'].includes(lead.stage))
          .reduce((sum: number, lead: any) => sum + (lead.value || 0), 0);
        
        const proposalsSent = proposals.length;
        
        const wonDeals = leads.filter((lead: any) => lead.stage === 'closed-won').length;
        const lostDeals = leads.filter((lead: any) => lead.stage === 'closed-lost').length;
        const conversionRate = (wonDeals + lostDeals) > 0 ? Math.round((wonDeals / (wonDeals + lostDeals)) * 100) : 0;
        
        const averageProjectValue = totalClients > 0 ? Math.round(totalRevenue / totalClients) : 0;
        
        setMetrics({
          totalRevenue,
          activeProjects,
          totalClients,
          monthlyGrowth: 0,
          pipelineValue,
          proposalsSent,
          conversionRate,
          averageProjectValue,
          totalTasks: 0,
          completedTasks: 0,
          taskCompletionRate: 0
        });

        // Generate recent activity from localStorage fallback
        const activity: RecentActivity[] = [];
        
        // Recent closed deals
        const recentDeals = leads
          .filter((lead: any) => lead.stage === 'closed-won')
          .sort((a: any, b: any) => new Date(b.created_at || b.createdAt || Date.now()).getTime() - new Date(a.created_at || a.createdAt || Date.now()).getTime())
          .slice(0, 2);
        
        recentDeals.forEach((deal: any) => {
          activity.push({
            id: `deal-${deal.id}`,
            type: 'sale',
            title: `New project signed: ${deal.company || deal.name}`,
            description: `$${(deal.value || 0).toLocaleString()} ${deal.description || 'custom application'}`,
            value: deal.value,
            timestamp: new Date(deal.created_at || deal.createdAt || Date.now()).toISOString()
          });
        });

        // Recent proposals
        const recentProposals = leads
          .filter((lead: any) => lead.stage === 'proposal')
          .sort((a: any, b: any) => new Date(b.created_at || b.createdAt || Date.now()).getTime() - new Date(a.created_at || a.createdAt || Date.now()).getTime())
          .slice(0, 2);
        
        recentProposals.forEach((proposal: any) => {
          activity.push({
            id: `proposal-${proposal.id}`,
            type: 'proposal',
            title: `Proposal sent to ${proposal.company || proposal.name}`,
            description: `$${(proposal.value || 0).toLocaleString()} ${proposal.description || 'custom application'}`,
            value: proposal.value,
            timestamp: new Date(proposal.created_at || proposal.createdAt || Date.now()).toISOString()
          });
        });

        // Sort by timestamp and limit to 5 most recent
        activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setRecentActivity(activity.slice(0, 5));
      }
    };

    if (user) {
      calculateMetrics();
      
      // Recalculate metrics every 30 seconds for real-time collaboration
      const interval = setInterval(calculateMetrics, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  // AI Action Handlers
  const handleAIAction = async (action: string, data?: any) => {
    setLoadingAction(action);
    
    try {
      const result = await apiCall(API_ENDPOINTS.ai.generateContent, {
        method: 'POST',
        body: JSON.stringify({
          action,
          data: data || getActionData(action),
          userId: user?.email
        })
      });
      
      // Handle the generated content based on action type
      switch (action) {
        case 'weekly-report':
          // Open in new tab with generated report
          const reportWindow = window.open('', '_blank');
          if (reportWindow) {
            reportWindow.document.write(result.content);
            reportWindow.document.title = 'Weekly Client Report';
          }
          toast.success('Weekly report generated successfully!');
          break;
          
        case 'email-campaign':
          // Copy to clipboard
          navigator.clipboard.writeText(result.content);
          toast.success('Email campaign created and copied to clipboard!');
          break;
          
        case 'proposal':
          // Navigate to proposal page with generated content
          localStorage.setItem('generated_proposal', result.content);
          navigate('/proposal/new');
          break;
          
        case 'competitor-analysis':
          // Display in modal or new page
          const analysisWindow = window.open('', '_blank');
          if (analysisWindow) {
            analysisWindow.document.write(`<pre>${result.content}</pre>`);
            analysisWindow.document.title = 'Competitor Analysis';
          }
          toast.success('Competitor analysis complete!');
          break;
          
        case 'social-media':
          navigator.clipboard.writeText(result.content);
          toast.success('Social media content created and copied!');
          break;
          
        case 'conversion-optimization':
          const optimizationWindow = window.open('', '_blank');
          if (optimizationWindow) {
            optimizationWindow.document.write(`<pre>${result.content}</pre>`);
            optimizationWindow.document.title = 'Conversion Optimization Report';
          }
          toast.success('Optimization recommendations generated!');
          break;
      }
    } catch (error) {
      console.error('AI action error:', error);
      toast.error(`Failed to ${action.replace('-', ' ')}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const getActionData = (action: string) => {
    // Gather relevant data based on action type
    switch (action) {
      case 'weekly-report':
        return {
          projectData: [], // Would fetch from projects API
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString()
        };
        
      case 'email-campaign':
        return {
          campaignType: 'lead-nurture',
          targetAudience: 'small-business-owners',
          product: 'Custom Business Applications',
          goals: 'Convert leads to customers'
        };
        
      case 'proposal':
        return {
          clientName: 'Prospective Client',
          projectType: 'Custom Business Application',
          requirements: 'CRM, Inventory Management, Reporting',
          budget: '$5,000-$10,000',
          timeline: '14-30 days'
        };
        
      case 'competitor-analysis':
        return {
          competitors: ['Bubble.io', 'OutSystems', 'Mendix', 'PowerApps'],
          focusAreas: ['Pricing', 'Features', 'Customer Support', 'Delivery Time']
        };
        
      case 'social-media':
        return {
          platform: 'LinkedIn',
          topic: 'Benefits of owning your software vs renting SaaS',
          tone: 'professional',
          includeHashtags: true
        };
        
      case 'conversion-optimization':
        return {
          pageType: 'Landing Page',
          currentConversion: 2.5,
          targetConversion: 5.0,
          issues: 'High bounce rate, unclear value proposition'
        };
        
      default:
        return {};
    }
  };

  // This component is now protected by the AdminRoute wrapper
  // No need for login form here

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Command Center - App Suite" 
        description="App Suite internal command center for business operations"
        noindex={true}
      />
      
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">App Suite Operations</h1>
                <p className="text-sm text-muted-foreground">Internal Business Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-1" />
                All Systems Operational
              </Badge>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {user?.name || user?.email}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="container mx-auto px-4 py-8">
        {/* KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{metrics.monthlyGrowth}% from last month
              </div>
              <Progress value={metrics.totalRevenue / 1000000 * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">${(1000000 - metrics.totalRevenue).toLocaleString()} to $1M goal</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Code className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeProjects}</div>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="secondary" className="text-xs">3 Standard</Badge>
                <Badge variant="default" className="text-xs">5 AI-Enhanced</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Avg completion: 3.2 weeks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.pipelineValue.toLocaleString()}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">{metrics.proposalsSent} proposals</Badge>
                <Badge variant="outline" className="text-xs">{metrics.conversionRate}% win rate</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Expected close: 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalClients} Clients</div>
              <div className="flex items-center gap-1 mt-2">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i} className="text-yellow-500">{star}</span>
                ))}
                <span className="text-xs text-muted-foreground ml-1">4.9/5.0</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">100% retention rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-9 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trajectory to $100M</CardTitle>
                  <CardDescription>Monthly recurring revenue growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/10 rounded">
                    <BarChart3 className="h-12 w-12 text-muted-foreground" />
                    <span className="ml-4 text-muted-foreground">Revenue chart visualization</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Current MRR</span>
                      <span className="text-sm font-bold">$42,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Target MRR (2025)</span>
                      <span className="text-sm font-bold">$833,333</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Growth Required</span>
                      <span className="text-sm font-bold text-green-600">+1,860%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>AI-Powered Actions</CardTitle>
                  <CardDescription>Let AI help you scale faster</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleAIAction('weekly-report')}
                    disabled={loadingAction === 'weekly-report'}
                  >
                    {loadingAction === 'weekly-report' ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Generate Weekly Client Report
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleAIAction('email-campaign')}
                    disabled={loadingAction === 'email-campaign'}
                  >
                    {loadingAction === 'email-campaign' ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4 mr-2" />
                    )}
                    Create Email Campaign
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleAIAction('proposal')}
                    disabled={loadingAction === 'proposal'}
                  >
                    {loadingAction === 'proposal' ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                    Generate Proposal from Template
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleAIAction('competitor-analysis')}
                    disabled={loadingAction === 'competitor-analysis'}
                  >
                    {loadingAction === 'competitor-analysis' ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Globe className="h-4 w-4 mr-2" />
                    )}
                    Analyze Competitor Websites
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleAIAction('social-media')}
                    disabled={loadingAction === 'social-media'}
                  >
                    {loadingAction === 'social-media' ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <MessageSquare className="h-4 w-4 mr-2" />
                    )}
                    Draft Social Media Content
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleAIAction('conversion-optimization')}
                    disabled={loadingAction === 'conversion-optimization'}
                  >
                    {loadingAction === 'conversion-optimization' ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Rocket className="h-4 w-4 mr-2" />
                    )}
                    Optimize Conversion Funnel
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Real-time business updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => {
                      const getActivityIcon = (type: string) => {
                        switch (type) {
                          case 'sale':
                            return <DollarSign className="h-4 w-4 text-green-600" />;
                          case 'proposal':
                            return <Users className="h-4 w-4 text-blue-600" />;
                          case 'project':
                            return <Code className="h-4 w-4 text-purple-600" />;
                          case 'client':
                            return <Building className="h-4 w-4 text-orange-600" />;
                          default:
                            return <Zap className="h-4 w-4 text-gray-600" />;
                        }
                      };

                      const getActivityBgColor = (type: string) => {
                        switch (type) {
                          case 'sale':
                            return 'bg-green-100';
                          case 'proposal':
                            return 'bg-blue-100';
                          case 'project':
                            return 'bg-purple-100';
                          case 'client':
                            return 'bg-orange-100';
                          default:
                            return 'bg-gray-100';
                        }
                      };

                      const getTimeAgo = (timestamp: string) => {
                        const now = new Date();
                        const activityTime = new Date(timestamp);
                        const diffMs = now.getTime() - activityTime.getTime();
                        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                        const diffDays = Math.floor(diffHours / 24);

                        if (diffDays > 0) {
                          return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
                        } else if (diffHours > 0) {
                          return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
                        } else {
                          return 'Just now';
                        }
                      };

                      return (
                        <div key={activity.id} className="flex items-center gap-4">
                          <div className={`p-2 ${getActivityBgColor(activity.type)} rounded-full`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.description}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(activity.timestamp)}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No recent activity</p>
                      <p className="text-xs text-muted-foreground">Activity will appear here as you work with leads and projects</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients">
            <ClientCommunication />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectTracker />
          </TabsContent>

          <TabsContent value="tasks">
            <TaskManager />
          </TabsContent>

          <TabsContent value="sales">
            <SalesPipeline />
          </TabsContent>

          <TabsContent value="marketing">
            <MarketingHub />
          </TabsContent>

          <TabsContent value="finance">
            <FinancialDashboard />
          </TabsContent>

          <TabsContent value="team">
            <TeamWorkspace />
          </TabsContent>

          <TabsContent value="templates">
            <EmailTemplates />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommandCenter;