import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { API_ENDPOINTS, apiCall } from "@/utils/api";
import SlideInSidebar from "./SlideInSidebar";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Plus,
  Trash2,
  Edit,
  Search,
  Filter,
  Download,
  Upload,
  UserPlus,
  Mail,
  Phone,
  Shield,
  Activity,
  Target,
  Award,
  BarChart3,
  Briefcase,
  Settings,
  MoreVertical,
  ChevronRight,
  Building,
  MapPin,
  Globe,
  Star,
  UserCheck,
  UserX,
  Lock,
  Unlock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeamMember {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'developer' | 'designer' | 'sales' | 'support';
  department: string;
  title: string;
  phone?: string;
  location?: string;
  timezone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'vacation' | 'busy';
  joinDate: string;
  lastActive?: string;
  permissions: string[];
  skills?: string[];
  bio?: string;
  performance?: {
    tasksCompleted: number;
    projectsLed: number;
    clientRating: number;
    productivity: number;
  };
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  estimatedHours: number;
  actualHours: number;
  projectName: string | null;
  projectId: number | null;
  assignedTo: number | null;
  assignedToName: string;
  createdBy: number | null;
  createdByName: string;
  createdDate: string;
  completedDate: string | null;
  tags: string[];
  notes: string;
}

interface TeamFormData {
  email: string;
  name: string;
  role: TeamMember['role'];
  department: string;
  title: string;
  phone: string;
  location: string;
  timezone: string;
  permissions: string[];
  bio: string;
}

const TeamWorkspaceV2 = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("team");
  const [showAddMember, setShowAddMember] = useState(false);
  const [showMemberDetail, setShowMemberDetail] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const [formData, setFormData] = useState<TeamFormData>({
    email: '',
    name: '',
    role: 'developer',
    department: 'Engineering',
    title: '',
    phone: '',
    location: '',
    timezone: 'America/New_York',
    permissions: ['read_projects', 'write_tasks'],
    bio: ''
  });

  // Hardcoded team members + dynamic loading
  const defaultTeamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Jason Gordon',
      email: 'jason@jaydus.ai',
      role: 'admin',
      department: 'Executive',
      title: 'CEO & Founder',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      timezone: 'America/New_York',
      status: 'active',
      joinDate: '2023-01-01',
      lastActive: new Date().toISOString(),
      permissions: ['*'],
      skills: ['Leadership', 'Strategy', 'Sales', 'Product Vision'],
      bio: 'Founder and CEO of App Suite. Passionate about building custom solutions that help businesses grow.',
      performance: {
        tasksCompleted: 156,
        projectsLed: 45,
        clientRating: 4.9,
        productivity: 95
      }
    },
    {
      id: 2,
      name: 'Almir',
      email: 'almir@jaydus.ai',
      role: 'admin',
      department: 'Engineering',
      title: 'CTO & Lead Developer',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      timezone: 'America/Los_Angeles',
      status: 'active',
      joinDate: '2023-01-15',
      lastActive: new Date().toISOString(),
      permissions: ['*'],
      skills: ['Full Stack', 'AI/ML', 'System Architecture', 'DevOps'],
      bio: 'Technical co-founder focused on delivering cutting-edge AI-powered solutions.',
      performance: {
        tasksCompleted: 234,
        projectsLed: 38,
        clientRating: 5.0,
        productivity: 98
      }
    }
  ];

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    setLoading(true);
    try {
      // Load team members from API
      const { data: apiMembers } = await apiCall(API_ENDPOINTS.users);
      
      // Merge with default members
      const allMembers = [...defaultTeamMembers];
      if (apiMembers?.users) {
        apiMembers.users.forEach((member: any) => {
          if (!allMembers.find(m => m.email === member.email)) {
            allMembers.push({
              ...member,
              role: member.role || 'developer',
              department: member.department || 'Engineering',
              title: member.title || 'Team Member',
              status: 'active',
              joinDate: member.created_at || new Date().toISOString(),
              permissions: ['read_projects', 'write_tasks'],
              performance: {
                tasksCompleted: 0,
                projectsLed: 0,
                clientRating: 0,
                productivity: 0
              }
            });
          }
        });
      }
      
      setTeamMembers(allMembers);
      
      // Load tasks
      const storedTasks = localStorage.getItem('team_tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading team data:', error);
      setTeamMembers(defaultTeamMembers);
    } finally {
      setLoading(false);
    }
  };

  const addTeamMember = async () => {
    if (!formData.email || !formData.name) {
      toast.error('Email and name are required');
      return;
    }

    try {
      const newMember: TeamMember = {
        id: teamMembers.length + 1,
        ...formData,
        status: 'active',
        joinDate: new Date().toISOString(),
        performance: {
          tasksCompleted: 0,
          projectsLed: 0,
          clientRating: 0,
          productivity: 0
        }
      };

      // In production, save to database
      await apiCall(API_ENDPOINTS.users, {
        method: 'POST',
        body: JSON.stringify(newMember)
      });

      setTeamMembers([...teamMembers, newMember]);
      setShowAddMember(false);
      resetForm();
      toast.success(`${newMember.name} added to the team!`);
    } catch (error) {
      console.error('Error adding team member:', error);
      toast.error('Failed to add team member');
    }
  };

  const updateTeamMember = async (updates: Partial<TeamMember>) => {
    if (!selectedMember) return;

    try {
      await apiCall(`${API_ENDPOINTS.users}?id=${selectedMember.id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      setTeamMembers(teamMembers.map(member => 
        member.id === selectedMember.id ? { ...member, ...updates } : member
      ));
      
      setSelectedMember({ ...selectedMember, ...updates });
      toast.success('Team member updated');
    } catch (error) {
      console.error('Error updating team member:', error);
      toast.error('Failed to update team member');
    }
  };

  const removeTeamMember = async (memberId: number) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;

    try {
      await apiCall(`${API_ENDPOINTS.users}?id=${memberId}`, {
        method: 'DELETE'
      });

      setTeamMembers(teamMembers.filter(m => m.id !== memberId));
      setShowMemberDetail(false);
      setSelectedMember(null);
      toast.success('Team member removed');
    } catch (error) {
      console.error('Error removing team member:', error);
      toast.error('Failed to remove team member');
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      role: 'developer',
      department: 'Engineering',
      title: '',
      phone: '',
      location: '',
      timezone: 'America/New_York',
      permissions: ['read_projects', 'write_tasks'],
      bio: ''
    });
  };

  const openMemberDetail = (member: TeamMember) => {
    setSelectedMember(member);
    setShowMemberDetail(true);
  };

  const closeMemberDetail = () => {
    setShowMemberDetail(false);
    setTimeout(() => setSelectedMember(null), 300);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'vacation': return 'bg-blue-100 text-blue-800';
      case 'busy': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'developer': return 'bg-green-100 text-green-800';
      case 'designer': return 'bg-pink-100 text-pink-800';
      case 'sales': return 'bg-yellow-100 text-yellow-800';
      case 'support': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = !searchQuery || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === "all" || member.role === filterRole;
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const permissions = [
    { value: 'read_projects', label: 'View Projects' },
    { value: 'write_projects', label: 'Edit Projects' },
    { value: 'delete_projects', label: 'Delete Projects' },
    { value: 'read_clients', label: 'View Clients' },
    { value: 'write_clients', label: 'Edit Clients' },
    { value: 'manage_team', label: 'Manage Team' },
    { value: 'view_finances', label: 'View Finances' },
    { value: 'manage_finances', label: 'Manage Finances' },
    { value: 'admin', label: 'Admin Access' }
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="tasks">Team Tasks</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Team Members</CardTitle>
                  <CardDescription>
                    Manage your team, roles, and permissions
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddMember(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search team members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="vacation">Vacation</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Team Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMembers.map((member) => (
                  <Card 
                    key={member.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => openMemberDetail(member)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            {member.avatar && <AvatarImage src={member.avatar} />}
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.title}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <Badge className={getRoleColor(member.role)}>
                            {member.role}
                          </Badge>
                          <span className="text-muted-foreground">{member.department}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{member.email}</span>
                        </div>
                        
                        {member.location && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{member.location}</span>
                          </div>
                        )}
                      </div>

                      {member.performance && (
                        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{member.performance.tasksCompleted}</p>
                            <p className="text-xs text-muted-foreground">Tasks</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">{member.performance.productivity}%</p>
                            <p className="text-xs text-muted-foreground">Productivity</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Tasks</CardTitle>
              <CardDescription>Track and manage team assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Task management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Team productivity and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {teamMembers.map(member => (
                  <Card key={member.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.title}</p>
                        </div>
                      </div>
                      {member.performance && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Productivity</span>
                            <span className="font-medium">{member.performance.productivity}%</span>
                          </div>
                          <Progress value={member.performance.productivity} className="h-2" />
                          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                            <div>
                              <p className="font-medium">{member.performance.tasksCompleted}</p>
                              <p className="text-muted-foreground">Tasks</p>
                            </div>
                            <div>
                              <p className="font-medium">{member.performance.projectsLed}</p>
                              <p className="text-muted-foreground">Projects</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Team Member Sidebar */}
      <SlideInSidebar 
        isOpen={showAddMember} 
        onClose={() => setShowAddMember(false)}
        title="Add Team Member"
      >
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Add a new team member and configure their access permissions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Full Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john@company.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value as TeamMember['role']})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Department</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Executive">Executive</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Job Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Senior Developer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Phone</Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="New York, NY"
              />
            </div>
          </div>

          <div>
            <Label>Timezone</Label>
            <Select value={formData.timezone} onValueChange={(value) => setFormData({...formData, timezone: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="America/Chicago">Central Time</SelectItem>
                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                <SelectItem value="Europe/London">London</SelectItem>
                <SelectItem value="Europe/Paris">Paris</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                <SelectItem value="Australia/Sydney">Sydney</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Permissions</Label>
            <div className="space-y-2 mt-2">
              {permissions.map(perm => (
                <label key={perm.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(perm.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({...formData, permissions: [...formData.permissions, perm.value]});
                      } else {
                        setFormData({...formData, permissions: formData.permissions.filter(p => p !== perm.value)});
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label>Bio</Label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Brief bio or description..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddMember(false)}>
              Cancel
            </Button>
            <Button onClick={addTeamMember}>
              Add Team Member
            </Button>
          </div>
        </div>
      </SlideInSidebar>

      {/* Team Member Detail Sidebar */}
      <SlideInSidebar 
        isOpen={showMemberDetail} 
        onClose={closeMemberDetail}
        title={selectedMember?.name}
      >
        {selectedMember && (
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {selectedMember.avatar && <AvatarImage src={selectedMember.avatar} />}
                <AvatarFallback>
                  {selectedMember.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{selectedMember.name}</h3>
                <p className="text-muted-foreground">{selectedMember.title}</p>
                <div className="flex gap-2 mt-2">
                  <Badge className={getRoleColor(selectedMember.role)}>
                    {selectedMember.role}
                  </Badge>
                  <Badge className={getStatusColor(selectedMember.status)}>
                    {selectedMember.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${selectedMember.email}`} className="text-blue-600 hover:underline">
                    {selectedMember.email}
                  </a>
                </div>
                {selectedMember.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${selectedMember.phone}`} className="text-blue-600 hover:underline">
                      {selectedMember.phone}
                    </a>
                  </div>
                )}
                {selectedMember.location && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedMember.location}</span>
                  </div>
                )}
                {selectedMember.timezone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedMember.timezone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Work Info */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Work Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Department</span>
                  <span className="font-medium">{selectedMember.department}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Join Date</span>
                  <span className="font-medium">{new Date(selectedMember.joinDate).toLocaleDateString()}</span>
                </div>
                {selectedMember.lastActive && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Active</span>
                    <span className="font-medium">
                      {new Date(selectedMember.lastActive).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Performance */}
            {selectedMember.performance && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Performance</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">Tasks</span>
                      </div>
                      <p className="text-2xl font-bold mt-1">{selectedMember.performance.tasksCompleted}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-muted-foreground">Projects</span>
                      </div>
                      <p className="text-2xl font-bold mt-1">{selectedMember.performance.projectsLed}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-muted-foreground">Rating</span>
                      </div>
                      <p className="text-2xl font-bold mt-1">{selectedMember.performance.clientRating}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-muted-foreground">Productivity</span>
                      </div>
                      <p className="text-2xl font-bold mt-1">{selectedMember.performance.productivity}%</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Skills */}
            {selectedMember.skills && selectedMember.skills.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            {selectedMember.bio && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Bio</h4>
                <p className="text-sm text-muted-foreground">{selectedMember.bio}</p>
              </div>
            )}

            {/* Permissions */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Permissions</h4>
              <div className="space-y-2">
                {selectedMember.permissions.includes('*') ? (
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Full Admin Access</span>
                  </div>
                ) : (
                  selectedMember.permissions.map((perm, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      {perm.includes('write') || perm.includes('manage') ? (
                        <Unlock className="h-4 w-4 text-green-600" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                      <span>{permissions.find(p => p.value === perm)?.label || perm}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => window.open(`mailto:${selectedMember.email}`)}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              {selectedMember.phone && (
                <Button variant="outline" className="flex-1" onClick={() => window.open(`tel:${selectedMember.phone}`)}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              )}
              {selectedMember.id > 2 && ( // Don't allow removing default members
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => removeTeamMember(selectedMember.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </SlideInSidebar>
    </div>
  );
};

export default TeamWorkspaceV2;