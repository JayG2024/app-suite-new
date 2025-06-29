import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  Mail, 
  Globe,
  Target,
  BarChart3,
  Plus
} from "lucide-react";

const MarketingHubFixed = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data
  const mockMetrics = {
    totalCampaigns: 12,
    activeCampaigns: 3,
    totalLeads: 156,
    conversionRate: 23.5,
    emailsSent: 1250,
    openRate: 42.3
  };

  const mockCampaigns = [
    {
      id: "1",
      name: "Summer Product Launch",
      status: "active",
      leads: 45,
      conversion: 18.5
    },
    {
      id: "2",
      name: "Email Newsletter Q2",
      status: "active", 
      leads: 28,
      conversion: 25.0
    }
  ];

  return (
    <div className="space-y-6">
      {/* Marketing Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.totalLeads}</div>
            <p className="text-xs text-muted-foreground">All campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Average rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Marketing Hub</CardTitle>
            <Button size="sm" disabled>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">Marketing Overview</h3>
                <p className="text-muted-foreground">
                  Marketing features are being enhanced. Check back soon!
                </p>
              </div>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-4 mt-4">
              <div className="space-y-4">
                {mockCampaigns.map(campaign => (
                  <div key={campaign.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{campaign.name}</h4>
                      <Badge variant="default">
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Leads: </span>
                        <span className="font-medium">{campaign.leads}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Conversion: </span>
                        <span className="font-medium">{campaign.conversion}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-4 mt-4">
              <div className="text-center py-8">
                <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Email Marketing</h3>
                <p className="text-muted-foreground">
                  Email campaign features coming soon!
                </p>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4 mt-4">
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Marketing Analytics</h3>
                <p className="text-muted-foreground">
                  Detailed analytics will be available in the next update.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingHubFixed;