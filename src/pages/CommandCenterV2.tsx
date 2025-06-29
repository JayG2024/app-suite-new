import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import SEO from "@/components/SEO";
import { toast } from "sonner";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";
import { API_ENDPOINTS, apiCall } from "@/utils/api";
import ProjectTrackerV2 from "@/components/ProjectTrackerV2";
import ClientManager from "@/components/ClientManager";
import SalesPipeline from "@/components/SalesPipeline";
import TeamWorkspaceFixed from "@/components/TeamWorkspaceFixed";
import EmailTemplates from "@/components/EmailTemplates";
import TaskManagerV2 from "@/components/TaskManagerV2";
// import GmailInbox from "@/components/GmailInbox";
// import DeploymentManager from "@/components/DeploymentManager";
// import ASCDashboardV2 from "@/components/ASCDashboardV2";
import CallTranscriptAnalyzer from "@/components/CallTranscriptAnalyzer";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  MessageSquare,
  BarChart3,
  Target,
  Mail,
  Globe,
  Code,
  CheckSquare,
  LogOut,
  Building,
  Settings,
  Menu,
  X,
  ChevronRight,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Phone
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

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  color?: string;
}

const menuItems: MenuItem[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-600' },
  { id: 'clients', label: 'Clients', icon: Users, color: 'text-green-600' },
  { id: 'projects', label: 'Projects', icon: Code, color: 'text-purple-600' },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, color: 'text-orange-600' },
  { id: 'sales', label: 'Sales Pipeline', icon: Target, color: 'text-yellow-600' },
  { id: 'team', label: 'Team', icon: Users, color: 'text-cyan-600' },
  { id: 'templates', label: 'Email Templates', icon: FileText, color: 'text-gray-600' },
  { id: 'call-analyzer', label: 'Call Analyzer', icon: Phone, color: 'text-rose-600' },
  { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600' },
];

interface CommandCenterV2Props {
  initialSection?: string;
}

const CommandCenterV2 = ({ initialSection }: CommandCenterV2Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { socket, connected } = useSocket();
  const { user, logout } = useAuth();
  const [currentSection, setCurrentSection] = useState(initialSection || "overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Sync current section with URL
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const section = pathSegments[2];
    
    if (section) {
      // Handle special cases
      if (section === 'asc-ai') {
        setCurrentSection('cloud-dev');
      } else {
        setCurrentSection(section);
      }
    } else if (location.pathname === '/admin' || location.pathname === '/admin/') {
      setCurrentSection('overview');
    }
  }, [location.pathname]);

  // Calculate metrics from database
  useEffect(() => {
    const calculateMetrics = async () => {
      try {
        // Fetch metrics from dashboard endpoint
        const metricsData = await apiCall(API_ENDPOINTS.dashboard.metrics);
        setMetrics(metricsData);
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
          monthlyGrowth: 15, // Mock data
          pipelineValue,
          proposalsSent,
          conversionRate,
          averageProjectValue,
          totalTasks: 24, // Mock data
          completedTasks: 18, // Mock data
          taskCompletionRate: 75 // Mock data
        });
      }
    };

    if (user) {
      calculateMetrics();
      const interval = setInterval(calculateMetrics, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderContent = () => {
    switch(currentSection) {
      case 'overview':
        return <OverviewSection metrics={metrics} />;
      case 'clients':
        return <ClientManager />;
      case 'projects':
        return <ProjectTrackerV2 />;
      case 'tasks':
        return <TaskManagerV2 />;
      case 'sales':
        return <SalesPipeline />;
      case 'team':
        return <TeamWorkspaceFixed />;
      case 'templates':
        return <EmailTemplates />;
      case 'call-analyzer':
        return <CallTranscriptAnalyzer />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <OverviewSection metrics={metrics} />;
    }
  };

  const OverviewSection = ({ metrics }: { metrics: DashboardMetrics }) => (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          change="+12.5%"
          trend="up"
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Active Projects"
          value={metrics.activeProjects.toString()}
          change="+3"
          trend="up"
          icon={Code}
          color="blue"
        />
        <StatCard
          title="Pipeline Value"
          value={`$${metrics.pipelineValue.toLocaleString()}`}
          change="+8.2%"
          trend="up"
          icon={Target}
          color="purple"
        />
        <StatCard
          title="Total Clients"
          value={metrics.totalClients.toString()}
          change="+5"
          trend="up"
          icon={Users}
          color="orange"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly recurring revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
              <BarChart3 className="h-12 w-12 text-muted-foreground/50" />
              <span className="ml-4 text-muted-foreground">Chart visualization</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setCurrentSection('projects')}
            >
              <Code className="h-4 w-4 mr-2" />
              Create New Project
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setCurrentSection('clients')}
            >
              <Users className="h-4 w-4 mr-2" />
              Add New Client
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setCurrentSection('sales')}
            >
              <Target className="h-4 w-4 mr-2" />
              Create Lead
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/proposal/new')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Proposal
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setCurrentSection('call-analyzer')}
            >
              <Phone className="h-4 w-4 mr-2" />
              Analyze Call Transcript
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates across your business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New project started</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const StatCard = ({ 
    title, 
    value, 
    change, 
    trend, 
    icon: Icon, 
    color 
  }: { 
    title: string; 
    value: string; 
    change: string; 
    trend: 'up' | 'down'; 
    icon: React.ElementType; 
    color: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-2 rounded-lg",
            color === 'green' && "bg-green-100",
            color === 'blue' && "bg-blue-100",
            color === 'purple' && "bg-purple-100",
            color === 'orange' && "bg-orange-100",
          )}>
            <Icon className={cn(
              "h-5 w-5",
              color === 'green' && "text-green-600",
              color === 'blue' && "text-blue-600",
              color === 'purple' && "text-purple-600",
              color === 'orange' && "text-orange-600",
            )} />
          </div>
          <div className={cn(
            "flex items-center gap-1 text-sm",
            trend === 'up' ? "text-green-600" : "text-red-600"
          )}>
            {trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {change}
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Command Center - App Suite" 
        description="App Suite internal command center for business operations"
        noindex={true}
      />
      
      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-background border-b z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">AI</span>
              </div>
              <span className="font-bold text-lg">Command Center</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="hidden md:flex">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Connected
            </Badge>
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <Globe className="h-4 w-4 mr-2" />
              View Site
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-16 bottom-0 w-64 bg-card border-r transform transition-transform duration-200 z-40",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={currentSection === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  currentSection === item.id && "bg-secondary"
                )}
                onClick={() => {
                  const path = item.id === 'overview' ? '/admin' : `/admin/${item.id === 'cloud-dev' ? 'asc-ai' : item.id}`;
                  navigate(path);
                  setCurrentSection(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                <item.icon className={cn("h-4 w-4 mr-3", item.color)} />
                {item.label}
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
            
            <div className="pt-4 mt-4 border-t">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <HelpCircle className="h-4 w-4 mr-3" />
                Help & Support
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className={cn(
        "pt-16 transition-all duration-200",
        "lg:pl-64"
      )}>
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <span>Dashboard</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">
              {menuItems.find(item => item.id === currentSection)?.label || 'Overview'}
            </span>
          </div>

          {/* Dynamic Content */}
          {renderContent()}
        </div>
      </div>

      {/* Floating AI Assistant - Temporarily disabled */}
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

// Simple Settings Section Component
const SettingsSection = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-muted-foreground">{user?.email || 'Not logged in'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <p className="text-muted-foreground">{user?.role || 'User'}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your dashboard experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates about your projects</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                </div>
                <Button variant="outline" size="sm">System</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommandCenterV2;