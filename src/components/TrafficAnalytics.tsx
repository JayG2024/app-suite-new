import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Globe,
  Share2,
  Mail,
  Eye,
  MousePointer,
  Clock,
  Settings,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw
} from "lucide-react";

import {
  initGA,
  trackPageView,
  fetchGoogleAnalyticsData,
  getMockAnalyticsData,
  getMockSocialMediaData,
  getMockEmailMarketingData,
  getMockContentData,
  type AnalyticsData,
  type SocialMediaData,
  type EmailMarketingData,
  type ContentData
} from "@/utils/googleAnalytics";

const TrafficAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [socialData, setSocialData] = useState<SocialMediaData | null>(null);
  const [emailData, setEmailData] = useState<EmailMarketingData | null>(null);
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [gaConnected, setGaConnected] = useState(false);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [measurementId, setMeasurementId] = useState('');

  // Check if Google Analytics is already configured
  useEffect(() => {
    const storedMeasurementId = localStorage.getItem('ga_measurement_id');
    if (storedMeasurementId) {
      setMeasurementId(storedMeasurementId);
      setGaConnected(true);
    }
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load analytics data (will use mock data if GA not connected)
      const analytics = await fetchGoogleAnalyticsData();
      setAnalyticsData(analytics);

      // Load social media data
      setSocialData(getMockSocialMediaData());

      // Load email marketing data
      setEmailData(getMockEmailMarketingData());

      // Load content performance data
      setContentData(getMockContentData());

    } catch (error) {
      console.error('Failed to load analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const setupGoogleAnalytics = () => {
    if (!measurementId.trim()) {
      toast.error('Please enter your Google Analytics Measurement ID');
      return;
    }

    try {
      // Initialize Google Analytics
      initGA(measurementId);
      
      // Store the measurement ID
      localStorage.setItem('ga_measurement_id', measurementId);
      setGaConnected(true);
      setShowSetupDialog(false);
      
      toast.success('Google Analytics connected successfully!');
      loadAllData();
    } catch (error) {
      console.error('Failed to setup Google Analytics:', error);
      toast.error('Failed to setup Google Analytics');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
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
      {/* Header with Setup */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Traffic & Marketing Analytics</h2>
          <p className="text-muted-foreground">Monitor your website traffic and marketing performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadAllData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
            <DialogTrigger asChild>
              <Button variant={gaConnected ? "outline" : "default"} size="sm">
                <Settings className="h-4 w-4 mr-2" />
                {gaConnected ? 'Analytics Settings' : 'Connect Analytics'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect Google Analytics</DialogTitle>
                <DialogDescription>
                  Connect your Google Analytics 4 to see real traffic data
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>How to find your Measurement ID</AlertTitle>
                  <AlertDescription>
                    1. Go to Google Analytics → Admin → Data Streams<br/>
                    2. Select your website<br/>
                    3. Copy the Measurement ID (starts with G-)<br/>
                    4. Paste it below
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <Label htmlFor="measurement-id">Google Analytics 4 Measurement ID</Label>
                  <Input
                    id="measurement-id"
                    placeholder="G-XXXXXXXXXX"
                    value={measurementId}
                    onChange={(e) => setMeasurementId(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowSetupDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={setupGoogleAnalytics}>
                    Connect Analytics
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Connection Status */}
      {!gaConnected && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Using Demo Data</AlertTitle>
          <AlertDescription>
            Connect Google Analytics to see real traffic data. Currently showing sample data for demonstration.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="traffic">Website Traffic</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="email">Email Marketing</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-4">
          {analyticsData && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(analyticsData.pageViews)}</div>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(analyticsData.users)}</div>
                    <p className="text-xs text-muted-foreground">{analyticsData.realTimeUsers} online now</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatDuration(analyticsData.avgSessionDuration)}</div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.bounceRate}%</div>
                    <p className="text-xs text-muted-foreground">Lower is better</p>
                  </CardContent>
                </Card>
              </div>

              {/* Traffic Sources and Top Pages */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Traffic Sources</CardTitle>
                    <CardDescription>Where your visitors come from</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.trafficSources.map((source) => (
                        <div key={source.source} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{source.source}</span>
                            <span className="text-sm text-muted-foreground">
                              {formatNumber(source.users)} users
                            </span>
                          </div>
                          <Progress value={source.percentage} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {source.percentage}% of total traffic
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Pages</CardTitle>
                    <CardDescription>Most visited pages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analyticsData.topPages.map((page, index) => (
                        <div key={page.page} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{index + 1}</Badge>
                            <div>
                              <p className="font-medium">{page.page === '/' ? 'Homepage' : page.page}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatNumber(page.uniqueViews)} unique views
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatNumber(page.views)}</p>
                            <p className="text-xs text-muted-foreground">views</p>
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

        <TabsContent value="social" className="space-y-4">
          {socialData && (
            <>
              {/* Social Media Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(socialData.totalFollowers)}</div>
                    <p className="text-xs text-muted-foreground">Across all platforms</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{socialData.avgEngagement}%</div>
                    <p className="text-xs text-muted-foreground">Engagement rate</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Best Platform</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">LinkedIn</div>
                    <p className="text-xs text-muted-foreground">Highest engagement</p>
                  </CardContent>
                </Card>
              </div>

              {/* Platform Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance</CardTitle>
                  <CardDescription>Followers and engagement by platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {socialData.platforms.map((platform) => (
                      <div key={platform.platform} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{platform.platform}</h4>
                          <Badge variant="secondary">{platform.engagement}% engagement</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Followers</span>
                            <span className="font-medium">{formatNumber(platform.followers)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Posts</span>
                            <span className="font-medium">{platform.posts}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Reach</span>
                            <span className="font-medium">{formatNumber(platform.reach)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          {emailData && (
            <>
              {/* Email Marketing Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(emailData.subscribers)}</div>
                    <p className="text-xs text-muted-foreground">Active subscribers</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{emailData.avgOpenRate}%</div>
                    <p className="text-xs text-muted-foreground">Average open rate</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
                    <MousePointer className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{emailData.avgClickRate}%</div>
                    <p className="text-xs text-muted-foreground">Average click rate</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Campaigns Sent</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{emailData.campaigns.length}</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Campaign Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Campaigns</CardTitle>
                  <CardDescription>Email campaign performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {emailData.campaigns.map((campaign, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{campaign.name}</h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(campaign.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Sent</p>
                            <p className="font-medium">{formatNumber(campaign.sent)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Delivered</p>
                            <p className="font-medium">{formatNumber(campaign.delivered)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Open Rate</p>
                            <p className="font-medium">{campaign.openRate}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Click Rate</p>
                            <p className="font-medium">{campaign.clickRate}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          {contentData && (
            <>
              {/* Content Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(contentData.totalViews)}</div>
                    <p className="text-xs text-muted-foreground">Across all content</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{contentData.avgEngagement}%</div>
                    <p className="text-xs text-muted-foreground">Engagement rate</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Published</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{contentData.posts.length}</div>
                    <p className="text-xs text-muted-foreground">Posts this month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Performing Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Content</CardTitle>
                  <CardDescription>This month's best posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contentData.posts.map((post, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <div>
                              <h4 className="font-semibold">{post.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {post.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(post.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Views</p>
                            <p className="font-medium">{formatNumber(post.views)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Engagement</p>
                            <p className="font-medium">{post.engagement}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Shares</p>
                            <p className="font-medium">{post.shares}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrafficAnalytics;