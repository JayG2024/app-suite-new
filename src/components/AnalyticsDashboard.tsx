import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { apiCall, API_ENDPOINTS } from "@/utils/api";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign,
  Target,
  Calendar,
  RefreshCw,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";

interface AnalyticsData {
  revenue?: {
    daily_data: Array<{
      date: string;
      daily_revenue: number;
      deals_closed: number;
    }>;
    total_revenue: number;
    total_deals: number;
  };
  leads?: {
    source_breakdown: Array<{
      source: string;
      count: number;
      conversions: number;
      conversion_rate: number;
    }>;
    total_leads: number;
  };
  conversion?: {
    funnel_data: Array<{
      status: string;
      count: number;
      avg_value: number;
    }>;
  };
  trends?: {
    growth: {
      leads: number;
      deals: number;
      revenue: number;
    };
  };
}

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({});
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Load analytics data
  const loadAnalytics = async (selectedPeriod = period) => {
    setLoading(true);
    try {
      console.log('🔄 Loading analytics data...');
      
      // Call the analytics API
      const response = await fetch(`${API_ENDPOINTS.dashboard.analytics}?period=${selectedPeriod}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Analytics data loaded:', data);
      
      setAnalytics(data.analytics);
      setLastUpdated(new Date(data.generated_at).toLocaleString());
      
      if (data.source === 'mock_data') {
        toast.info('Using demo data - connect your database to see real analytics');
      } else {
        toast.success('Analytics data updated successfully');
      }
    } catch (error) {
      console.error('❌ Analytics loading error:', error);
      toast.error('Failed to load analytics data');
      
      // Fallback to demo data
      setAnalytics({
        revenue: {
          daily_data: [
            { date: '2025-06-20', daily_revenue: 7500, deals_closed: 1 },
            { date: '2025-06-21', daily_revenue: 5000, deals_closed: 1 },
            { date: '2025-06-22', daily_revenue: 10000, deals_closed: 1 },
            { date: '2025-06-23', daily_revenue: 0, deals_closed: 0 },
            { date: '2025-06-24', daily_revenue: 7500, deals_closed: 1 }
          ],
          total_revenue: 30000,
          total_deals: 4
        },
        leads: {
          source_breakdown: [
            { source: 'website', count: 15, conversions: 3, conversion_rate: 20 },
            { source: 'referral', count: 8, conversions: 2, conversion_rate: 25 },
            { source: 'social', count: 12, conversions: 1, conversion_rate: 8.33 },
            { source: 'cold', count: 5, conversions: 1, conversion_rate: 20 }
          ],
          total_leads: 40
        },
        trends: {
          growth: {
            leads: 25,
            deals: 40,
            revenue: 35
          }
        }
      });
      setLastUpdated(new Date().toLocaleString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadAnalytics();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    loadAnalytics(newPeriod);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    if (growth < 0) return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading && !Object.keys(analytics).length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => loadAnalytics()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Growth Metrics */}
      {analytics.trends && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Lead Growth</CardTitle>
              {getGrowthIcon(analytics.trends.growth.leads)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <span className={getGrowthColor(analytics.trends.growth.leads)}>
                  {analytics.trends.growth.leads > 0 ? '+' : ''}{analytics.trends.growth.leads}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">vs previous period</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Deal Growth</CardTitle>
              {getGrowthIcon(analytics.trends.growth.deals)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <span className={getGrowthColor(analytics.trends.growth.deals)}>
                  {analytics.trends.growth.deals > 0 ? '+' : ''}{analytics.trends.growth.deals}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">vs previous period</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
              {getGrowthIcon(analytics.trends.growth.revenue)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <span className={getGrowthColor(analytics.trends.growth.revenue)}>
                  {analytics.trends.growth.revenue > 0 ? '+' : ''}{analytics.trends.growth.revenue}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">vs previous period</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Analytics */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="leads">Lead Sources</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          {analytics.revenue && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Revenue</CardTitle>
                    <CardDescription>Revenue for selected period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(analytics.revenue.total_revenue)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {analytics.revenue.total_deals} deals closed
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Revenue Chart</CardTitle>
                    <CardDescription>Revenue breakdown by day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analytics.revenue.daily_data.slice(-5).map((day, index) => (
                        <div key={day.date} className="flex items-center justify-between">
                          <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{
                                  width: `${(day.daily_revenue / Math.max(...analytics.revenue.daily_data.map(d => d.daily_revenue))) * 100}%`
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium w-16 text-right">
                              {formatCurrency(day.daily_revenue)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          {analytics.leads && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Sources</CardTitle>
                  <CardDescription>Where your leads are coming from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.leads.source_breakdown.map((source) => (
                      <div key={source.source} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="capitalize font-medium">{source.source}</span>
                          <Badge variant="secondary">{source.count} leads</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={source.conversion_rate} className="flex-1" />
                          <span className="text-sm text-muted-foreground w-12">
                            {source.conversion_rate}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {source.conversions} conversions
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Source Performance</CardTitle>
                  <CardDescription>Conversion rates by source</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.leads.source_breakdown
                      .sort((a, b) => b.conversion_rate - a.conversion_rate)
                      .map((source) => (
                        <div key={source.source} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium capitalize">{source.source}</p>
                            <p className="text-sm text-muted-foreground">
                              {source.conversions}/{source.count} converted
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{source.conversion_rate}%</p>
                            <Badge variant={source.conversion_rate > 20 ? "default" : "secondary"}>
                              {source.conversion_rate > 20 ? "High" : "Normal"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          {analytics.conversion && (
            <Card>
              <CardHeader>
                <CardTitle>Sales Funnel</CardTitle>
                <CardDescription>Lead progression through your sales process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.conversion.funnel_data.map((stage, index) => {
                    const isLast = index === analytics.conversion.funnel_data.length - 1;
                    const nextStage = isLast ? null : analytics.conversion.funnel_data[index + 1];
                    const dropoff = nextStage ? stage.count - nextStage.count : 0;
                    const dropoffRate = nextStage ? ((dropoff / stage.count) * 100).toFixed(1) : 0;
                    
                    return (
                      <div key={stage.status} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="capitalize font-medium">{stage.status.replace('-', ' ')}</span>
                            {!isLast && dropoff > 0 && (
                              <Badge variant="outline" className="text-xs">
                                -{dropoffRate}%
                              </Badge>
                            )}
                          </div>
                          <span className="text-lg font-bold">{stage.count}</span>
                        </div>
                        <Progress 
                          value={(stage.count / analytics.conversion.funnel_data[0].count) * 100} 
                          className="h-3"
                        />
                        {stage.avg_value > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Avg value: {formatCurrency(stage.avg_value)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>Let AI analyze your data and provide recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Ask the AI Dashboard Assistant for insights about your analytics data
                </p>
                <p className="text-sm text-muted-foreground">
                  Try: "What's my best performing lead source?" or "Analyze my conversion funnel"
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;