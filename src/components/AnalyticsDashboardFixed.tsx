import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  Globe,
  MousePointer,
  Eye,
  Target
} from "lucide-react";

const AnalyticsDashboardFixed = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");

  // Mock analytics data
  const mockData = {
    overview: {
      totalVisits: 12543,
      uniqueVisitors: 8921,
      avgSessionDuration: "3:42",
      bounceRate: 42.3,
      pageViews: 45678,
      conversionRate: 3.2
    },
    topPages: [
      { path: "/", title: "Home", views: 5432, avgTime: "2:15" },
      { path: "/get-started", title: "Get Started", views: 3211, avgTime: "4:32" },
      { path: "/solutions-weve-built", title: "Portfolio", views: 2876, avgTime: "3:45" },
      { path: "/documentation", title: "Documentation", views: 2104, avgTime: "5:21" }
    ],
    traffic: {
      organic: 45,
      direct: 28,
      referral: 15,
      social: 12
    },
    devices: {
      desktop: 68,
      mobile: 28,
      tablet: 4
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.overview.totalVisits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12.5% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.overview.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8.2% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.overview.avgSessionDuration}</div>
            <p className="text-xs text-muted-foreground">
              Per visitor session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.overview.bounceRate}%</div>
            <p className="text-xs text-muted-foreground">
              Single page sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.overview.pageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total page views
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.overview.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Visitor to lead
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
          <CardDescription>Deep dive into your website performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pages">Top Pages</TabsTrigger>
              <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Analytics Overview</h3>
                <p className="text-muted-foreground">
                  Real-time analytics integration coming soon!
                </p>
              </div>
            </TabsContent>

            <TabsContent value="pages" className="space-y-4 mt-4">
              <div className="space-y-4">
                {mockData.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{page.title}</h4>
                      <p className="text-sm text-muted-foreground">{page.path}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{page.views.toLocaleString()} views</p>
                      <p className="text-sm text-muted-foreground">Avg: {page.avgTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="traffic" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Organic Search</span>
                    <span>{mockData.traffic.organic}%</span>
                  </div>
                  <Progress value={mockData.traffic.organic} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Direct</span>
                    <span>{mockData.traffic.direct}%</span>
                  </div>
                  <Progress value={mockData.traffic.direct} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Referral</span>
                    <span>{mockData.traffic.referral}%</span>
                  </div>
                  <Progress value={mockData.traffic.referral} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Social Media</span>
                    <span>{mockData.traffic.social}%</span>
                  </div>
                  <Progress value={mockData.traffic.social} className="h-2" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="devices" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Desktop</span>
                    <span>{mockData.devices.desktop}%</span>
                  </div>
                  <Progress value={mockData.devices.desktop} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Mobile</span>
                    <span>{mockData.devices.mobile}%</span>
                  </div>
                  <Progress value={mockData.devices.mobile} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tablet</span>
                    <span>{mockData.devices.tablet}%</span>
                  </div>
                  <Progress value={mockData.devices.tablet} className="h-2" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboardFixed;