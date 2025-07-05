import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { API_ENDPOINTS, apiCall } from "@/utils/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Activity,
  Target,
  Calendar,
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Mail,
  CheckSquare,
  Briefcase
} from "lucide-react";

interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    byMonth: Array<{ month: string; amount: number }>;
    byProjectType: Array<{ type: string; amount: number; count: number }>;
  };
  clients: {
    total: number;
    active: number;
    new: number;
    retention: number;
    byIndustry: Array<{ industry: string; count: number }>;
    bySource: Array<{ source: string; count: number }>;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    onTime: number;
    byStatus: Array<{ status: string; count: number }>;
    avgDuration: number;
    avgValue: number;
  };
  sales: {
    pipelineValue: number;
    conversionRate: number;
    avgDealSize: number;
    byStage: Array<{ stage: string; count: number; value: number }>;
    winRate: number;
    lostReasons: Array<{ reason: string; count: number }>;
  };
  team: {
    totalMembers: number;
    utilization: number;
    byRole: Array<{ role: string; count: number }>;
    performance: Array<{ member: string; completedTasks: number; revenue: number }>;
  };
  communications: {
    emailsSent: number;
    emailOpenRate: number;
    emailClickRate: number;
    proposalsSent: number;
    proposalAcceptRate: number;
  };
}

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    revenue: {
      total: 125000,
      growth: 23.5,
      byMonth: [
        { month: "Jan", amount: 15000 },
        { month: "Feb", amount: 18000 },
        { month: "Mar", amount: 22000 },
        { month: "Apr", amount: 20000 },
        { month: "May", amount: 25000 },
        { month: "Jun", amount: 28000 }
      ],
      byProjectType: [
        { type: "Standard", amount: 40000, count: 8 },
        { type: "AI-Enhanced", amount: 52500, count: 7 },
        { type: "Enterprise", amount: 40000, count: 4 }
      ]
    },
    clients: {
      total: 48,
      active: 32,
      new: 12,
      retention: 85,
      byIndustry: [
        { industry: "Technology", count: 15 },
        { industry: "Healthcare", count: 8 },
        { industry: "Finance", count: 7 },
        { industry: "Retail", count: 6 },
        { industry: "Other", count: 12 }
      ],
      bySource: [
        { source: "Website", count: 18 },
        { source: "Referral", count: 15 },
        { source: "LinkedIn", count: 8 },
        { source: "Cold Outreach", count: 7 }
      ]
    },
    projects: {
      total: 24,
      active: 8,
      completed: 12,
      onTime: 85,
      byStatus: [
        { status: "Planning", count: 3 },
        { status: "Development", count: 5 },
        { status: "Review", count: 2 },
        { status: "Completed", count: 12 },
        { status: "On Hold", count: 2 }
      ],
      avgDuration: 28,
      avgValue: 7250
    },
    sales: {
      pipelineValue: 185000,
      conversionRate: 32,
      avgDealSize: 7500,
      byStage: [
        { stage: "Lead", count: 15, value: 45000 },
        { stage: "Qualified", count: 10, value: 50000 },
        { stage: "Proposal", count: 8, value: 60000 },
        { stage: "Negotiation", count: 4, value: 30000 }
      ],
      winRate: 68,
      lostReasons: [
        { reason: "Budget", count: 5 },
        { reason: "Timeline", count: 3 },
        { reason: "Competitor", count: 2 },
        { reason: "No Response", count: 2 }
      ]
    },
    team: {
      totalMembers: 7,
      utilization: 78,
      byRole: [
        { role: "Developer", count: 4 },
        { role: "Designer", count: 1 },
        { role: "PM", count: 1 },
        { role: "Sales", count: 1 }
      ],
      performance: [
        { member: "Sarah Chen", completedTasks: 45, revenue: 35000 },
        { member: "Mike Johnson", completedTasks: 38, revenue: 28000 },
        { member: "Alex Rivera", completedTasks: 42, revenue: 32000 },
        { member: "Emma Watson", completedTasks: 35, revenue: 25000 }
      ]
    },
    communications: {
      emailsSent: 342,
      emailOpenRate: 68,
      emailClickRate: 24,
      proposalsSent: 28,
      proposalAcceptRate: 43
    }
  });

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Using mock data - API endpoint not implemented yet
      // const data = await apiCall(`${API_ENDPOINTS.analytics}?range=${timeRange}`);
      // if (data.analytics) {
      //   setAnalyticsData(data.analytics);
      // }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
    setLoading(false);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const MetricCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription>{title}</CardDescription>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            <span>{Math.abs(change)}% {trend || 'vs last period'}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(analyticsData.revenue.total)}
          change={analyticsData.revenue.growth}
          icon={DollarSign}
        />
        <MetricCard
          title="Active Clients"
          value={analyticsData.clients.active}
          change={12}
          icon={Users}
        />
        <MetricCard
          title="Active Projects"
          value={analyticsData.projects.active}
          change={-8}
          icon={Briefcase}
        />
        <MetricCard
          title="Pipeline Value"
          value={formatCurrency(analyticsData.sales.pipelineValue)}
          change={15}
          icon={Target}
        />
        <MetricCard
          title="Team Utilization"
          value={`${analyticsData.team.utilization}%`}
          change={5}
          icon={Activity}
        />
        <MetricCard
          title="Email Open Rate"
          value={`${analyticsData.communications.emailOpenRate}%`}
          change={3}
          icon={Mail}
        />
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="communications">Comms</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.revenue.byMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Project Type</CardTitle>
                <CardDescription>Distribution of revenue sources</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.revenue.byProjectType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {analyticsData.revenue.byProjectType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.revenue.byProjectType.map((type, index) => (
                  <div key={type.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium">{type.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(type.amount)}</div>
                      <div className="text-sm text-muted-foreground">{type.count} projects</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Clients by Industry</CardTitle>
                <CardDescription>Distribution across industries</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.clients.byIndustry}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="industry" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Acquisition Sources</CardTitle>
                <CardDescription>Where clients come from</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.clients.bySource}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyticsData.clients.bySource.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Client Retention Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.clients.retention}%</div>
                <Progress value={analyticsData.clients.retention} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>New Clients (30d)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.clients.new}</div>
                <div className="text-sm text-muted-foreground">
                  {((analyticsData.clients.new / analyticsData.clients.total) * 100).toFixed(0)}% of total
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active vs Total</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.clients.active}/{analyticsData.clients.total}
                </div>
                <Progress
                  value={(analyticsData.clients.active / analyticsData.clients.total) * 100}
                  className="mt-2"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
                <CardDescription>Current project pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.projects.byStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>On-Time Delivery Rate</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{analyticsData.projects.onTime}%</span>
                    <Progress value={analyticsData.projects.onTime} className="w-24" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Average Duration</span>
                  <span className="font-semibold">{analyticsData.projects.avgDuration} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Average Value</span>
                  <span className="font-semibold">{formatCurrency(analyticsData.projects.avgValue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Completion Rate</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {((analyticsData.projects.completed / analyticsData.projects.total) * 100).toFixed(0)}%
                    </span>
                    <Progress
                      value={(analyticsData.projects.completed / analyticsData.projects.total) * 100}
                      className="w-24"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales Pipeline</CardTitle>
                <CardDescription>Value by stage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.sales.byStage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="value" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lost Deal Reasons</CardTitle>
                <CardDescription>Why we lose deals</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.sales.lostReasons}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ reason, percent }) => `${reason} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyticsData.sales.lostReasons.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Win Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.sales.winRate}%</div>
                <Progress value={analyticsData.sales.winRate} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Conversion Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.sales.conversionRate}%</div>
                <Progress value={analyticsData.sales.conversionRate} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Avg Deal Size</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analyticsData.sales.avgDealSize)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pipeline Value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analyticsData.sales.pipelineValue)}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Team Composition</CardTitle>
                <CardDescription>Members by role</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.team.byRole}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ role, count }) => `${role} (${count})`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyticsData.team.byRole.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Top performers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.team.performance.map((member, index) => (
                    <div key={member.member} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{member.member}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.completedTasks} tasks completed
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(member.revenue)}</div>
                        <div className="text-sm text-muted-foreground">revenue generated</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Team Utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.team.utilization}%</div>
              <Progress value={analyticsData.team.utilization} className="mt-2" />
              <p className="text-sm text-muted-foreground mt-2">
                Average across all team members
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Emails Sent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.communications.emailsSent}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Open Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.communications.emailOpenRate}%</div>
                <Progress value={analyticsData.communications.emailOpenRate} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Click Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.communications.emailClickRate}%</div>
                <Progress value={analyticsData.communications.emailClickRate} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Proposals Sent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.communications.proposalsSent}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Proposal Accept Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.communications.proposalAcceptRate}%</div>
                <Progress value={analyticsData.communications.proposalAcceptRate} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;