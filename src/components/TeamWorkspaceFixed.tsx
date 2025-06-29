import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  FileText,
  Plus,
  Clock,
  CheckCircle
} from "lucide-react";

const TeamWorkspaceFixed = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data
  const mockTeamMembers = [
    {
      id: "1",
      name: "Jason Gordon",
      email: "jason@jaydus.ai",
      role: "Admin",
      status: "active",
      tasksCompleted: 45,
      projectsActive: 3
    },
    {
      id: "2",
      name: "Almir",
      email: "almir@jaydus.ai",
      role: "Admin",
      status: "active",
      tasksCompleted: 38,
      projectsActive: 2
    }
  ];

  const mockRecentActivity = [
    {
      id: "1",
      user: "Jason Gordon",
      action: "completed task",
      target: "Update landing page",
      time: "2 hours ago"
    },
    {
      id: "2",
      user: "Almir",
      action: "created project",
      target: "New client onboarding",
      time: "5 hours ago"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Team Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTeamMembers.length}</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">83</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">To client messages</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Team Workspace</CardTitle>
            <Button size="sm" disabled>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">Team Overview</h3>
                <p className="text-muted-foreground">
                  Team collaboration features are being enhanced. Check back soon!
                </p>
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-4 mt-4">
              <div className="space-y-4">
                {mockTeamMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="default">{member.role}</Badge>
                      <div className="text-sm text-right">
                        <p className="font-medium">{member.tasksCompleted} tasks</p>
                        <p className="text-muted-foreground">{member.projectsActive} projects</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 mt-4">
              <div className="space-y-4">
                {mockRecentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        {' '}{activity.action}{' '}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4 mt-4">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Team Calendar</h3>
                <p className="text-muted-foreground">
                  Calendar integration coming soon!
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamWorkspaceFixed;