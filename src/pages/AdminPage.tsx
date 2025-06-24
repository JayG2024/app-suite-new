import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import AIChat from "@/components/AIChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Brain,
  MessageSquare,
  FileText,
  BarChart3,
  Users,
  Settings,
  Sparkles,
  TrendingUp,
  Mail,
  Eye,
  Calendar,
  Download
} from "lucide-react";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("chat");

  // Mock data for dashboard
  const stats = {
    totalProposals: 47,
    proposalsThisWeek: 12,
    contentCreated: 23,
    teamMembers: 3
  };

  const recentProposals = [
    { id: 1, company: "TechCorp Solutions", contact: "Sarah Johnson", status: "sent", date: "2024-12-15" },
    { id: 2, company: "GlobalTech Inc", contact: "Mike Brown", status: "viewed", date: "2024-12-14" },
    { id: 3, company: "RetailMax", contact: "Lisa Davis", status: "downloaded", date: "2024-12-13" }
  ];

  const recentContent = [
    { id: 1, type: "Newsletter", title: "Q4 Product Updates", status: "scheduled", date: "2024-12-16" },
    { id: 2, type: "LinkedIn Post", title: "AI Automation Benefits", status: "published", date: "2024-12-15" },
    { id: 3, type: "Case Study", title: "TechCorp Success Story", status: "draft", date: "2024-12-14" }
  ];

  return (
    <AdminLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsContent value="chat" className="h-full mt-0">
          <AIChat />
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Content Hub</h2>
            <Button>
              <Sparkles className="h-4 w-4 mr-2" />
              Create Content
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentContent.map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{content.title}</h4>
                        <p className="text-xs text-muted-foreground">{content.type} • {content.date}</p>
                      </div>
                      <Badge variant={content.status === 'published' ? 'default' : 'secondary'}>
                        {content.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Newsletter
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Social Media
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Blog Post
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Case Study
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Dec 16</span>
                    </div>
                    <p className="text-xs text-blue-700 mt-1">Newsletter: Q4 Updates</p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Dec 18</span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">LinkedIn: Feature Demo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="proposals" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Proposal Dashboard</h2>
            <Badge variant="secondary">{stats.totalProposals} Total Proposals</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProposals}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.proposalsThisWeek}</div>
                <p className="text-xs text-muted-foreground">+25% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">34%</div>
                <p className="text-xs text-muted-foreground">Proposals to clients</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4h</div>
                <p className="text-xs text-muted-foreground">From submission</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProposals.map((proposal) => (
                  <div key={proposal.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{proposal.company}</h4>
                      <p className="text-sm text-muted-foreground">{proposal.contact} • {proposal.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        proposal.status === 'sent' ? 'default' :
                        proposal.status === 'viewed' ? 'secondary' : 'outline'
                      }>
                        {proposal.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Newsletter Open Rate</span>
                    <span className="font-medium">42.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42.3%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Social Engagement</span>
                    <span className="font-medium">8.7%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '8.7%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Proposal Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">View Rate</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Download Rate</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <h2 className="text-2xl font-bold">Team Management</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Jason Gordon</h4>
                      <p className="text-sm text-muted-foreground">Admin • Full Access</p>
                    </div>
                  </div>
                  <Badge>Owner</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Marketing Team</h4>
                      <p className="text-sm text-muted-foreground">Content Creation Access</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Editor</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <h2 className="text-2xl font-bold">Settings</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Brand Voice</label>
                <p className="text-sm text-muted-foreground">Professional, innovative, results-focused</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Target Audience</label>
                <p className="text-sm text-muted-foreground">Businesses needing automation & efficiency</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Key Messages</label>
                <p className="text-sm text-muted-foreground">Own don't rent, AI-powered, custom solutions</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminPage;