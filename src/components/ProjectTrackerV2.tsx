import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSocket } from "@/contexts/SocketContext";
import { API_ENDPOINTS, apiCall } from "@/utils/api";
import { 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  MessageSquare,
  FileText,
  Code,
  Rocket,
  Users,
  Plus,
  Trash2,
  Edit,
  Activity,
  Mail,
  CheckSquare,
  GitBranch,
  Building,
  Target,
  TrendingUp,
  Eye,
  MoreVertical,
  Briefcase,
  Hash,
  User
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Project {
  id: string;
  clientName: string;
  projectName: string;
  type: "standard" | "ai-enhanced" | "enterprise";
  price: number;
  actualPrice?: number;
  status: "planning" | "discovery" | "design" | "development" | "testing" | "deployed" | "on-hold" | "cancelled";
  progress: number;
  startDate: string;
  deadline: string;
  completionDate?: string;
  developer: string;
  assignedTo?: number;
  assignedToName?: string;
  lastUpdate: string;
  notes: string;
  description?: string;
  technologies?: string[];
  deliverables?: string[];
  client_id?: number;
  budget_spent?: number;
  hours_tracked?: number;
  estimated_hours?: number;
  team_members?: string[];
  milestones?: Array<{
    id: string;
    name: string;
    date: string;
    completed: boolean;
  }>;
  risks?: Array<{
    id: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  tasks?: {
    total: number;
    completed: number;
  };
  activities?: ProjectActivity[];
}

interface ProjectActivity {
  id: number;
  activity_type: string;
  activity_description: string;
  metadata: Record<string, unknown>;
  user_name?: string;
  created_at: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface Client {
  id: number;
  name: string;
  company?: string;
  email: string;
}

const ProjectTrackerV2 = () => {
  const { connected } = useSocket();
  const currentUser = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')!).email : '';
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  
  const [projectForm, setProjectForm] = useState({
    projectName: '',
    clientName: '',
    client_id: '',
    type: 'standard' as const,
    price: 5000,
    startDate: new Date().toISOString().split('T')[0],
    deadline: '',
    assignedTo: '',
    notes: '',
    description: '',
    estimated_hours: 0,
    technologies: '',
    deliverables: ''
  });

  const projectMetrics = {
    total: projects.length,
    active: projects.filter(p => ['development', 'design', 'testing'].includes(p.status)).length,
    completed: projects.filter(p => p.status === 'deployed').length,
    planning: projects.filter(p => ['planning', 'discovery'].includes(p.status)).length,
    revenue: projects.reduce((sum, p) => sum + (p.actualPrice || p.price), 0),
    avgProgress: projects.length > 0 ? 
      Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0
  };

  useEffect(() => {
    loadProjects();
    loadClients();
    loadUsers();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadProjects();
    }, 30000);
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const loadProjects = async () => {
    try {
      const data = await apiCall(API_ENDPOINTS.projects);
      const projectsData = (data.projects || []).map((p: any) => ({
        ...p,
        id: p.id.toString(),
        clientName: p.client_name || p.clientName || 'Unknown Client',
        projectName: p.name || p.projectName || 'Untitled Project',
        assignedToName: p.assigned_to_name || p.assignedToName,
        tasks: p.tasks || { total: p.total_tasks || 0, completed: p.completed_tasks || 0 }
      }));
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const data = await apiCall(API_ENDPOINTS.clients || API_ENDPOINTS.leads);
      setClients((data.clients || data.leads || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        company: c.company,
        email: c.email
      })));
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const loadUsers = async () => {
    // Hardcode Jason and Almir as team members
    const hardcodedUsers = [
      { id: 1, name: 'Jason Gordon', email: 'jason@jaydus.ai', role: 'admin' },
      { id: 2, name: 'Almir', email: 'almir@jaydus.ai', role: 'admin' }
    ];
    
    try {
      const data = await apiCall(API_ENDPOINTS.users);
      const apiUsers = data.users || [];
      const allUsers = [...hardcodedUsers];
      
      apiUsers.forEach((apiUser: User) => {
        if (!allUsers.find(u => u.email === apiUser.email)) {
          allUsers.push(apiUser);
        }
      });
      
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers(hardcodedUsers);
    }
  };

  const getCurrentUserId = () => {
    const user = users.find(u => u.email === currentUser);
    return user?.id || null;
  };

  const createProject = async () => {
    if (!projectForm.projectName) {
      toast.error("Please enter a project name");
      return;
    }

    try {
      const response = await apiCall(API_ENDPOINTS.projects, {
        method: 'POST',
        body: JSON.stringify({
          name: projectForm.projectName,
          client_id: projectForm.client_id && projectForm.client_id !== 'new' ? 
                     parseInt(projectForm.client_id) : null,
          client_name: projectForm.clientName,
          type: projectForm.type,
          status: 'planning',
          budget: projectForm.price,
          start_date: projectForm.startDate,
          end_date: projectForm.deadline,
          assigned_to: projectForm.assignedTo && projectForm.assignedTo !== 'unassigned' ? 
                       parseInt(projectForm.assignedTo) : null,
          created_by: getCurrentUserId(),
          notes: projectForm.notes,
          description: projectForm.description,
          estimated_hours: projectForm.estimated_hours,
          technologies: projectForm.technologies.split(',').map(t => t.trim()).filter(t => t),
          deliverables: projectForm.deliverables.split(',').map(t => t.trim()).filter(t => t)
        })
      });

      if (response.project) {
        toast.success('Project created successfully!');
        loadProjects();
        setShowAddProject(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  };

  const updateProject = async () => {
    if (!selectedProject || !projectForm.projectName) {
      toast.error("Project name is required");
      return;
    }

    try {
      const response = await apiCall(`${API_ENDPOINTS.projects}?id=${selectedProject.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: projectForm.projectName,
          client_id: projectForm.client_id && projectForm.client_id !== 'new' ? 
                     parseInt(projectForm.client_id) : null,
          client_name: projectForm.clientName,
          type: projectForm.type,
          budget: projectForm.price,
          start_date: projectForm.startDate,
          end_date: projectForm.deadline,
          assigned_to: projectForm.assignedTo && projectForm.assignedTo !== 'unassigned' ? 
                       parseInt(projectForm.assignedTo) : null,
          notes: projectForm.notes,
          description: projectForm.description,
          estimated_hours: projectForm.estimated_hours,
          technologies: projectForm.technologies.split(',').map(t => t.trim()).filter(t => t),
          deliverables: projectForm.deliverables.split(',').map(t => t.trim()).filter(t => t)
        })
      });

      if (response.project) {
        toast.success('Project updated successfully!');
        loadProjects();
        setShowEditProject(false);
        setSelectedProject(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    }
  };

  const updateProjectStatus = async (projectId: string, newStatus: string) => {
    try {
      await apiCall(`${API_ENDPOINTS.projects}?id=${projectId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      
      toast.success('Project status updated');
      loadProjects();
    } catch (error) {
      console.error('Error updating project status:', error);
      toast.error('Failed to update project status');
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

    try {
      await apiCall(`${API_ENDPOINTS.projects}?id=${projectId}`, {
        method: 'DELETE'
      });
      
      toast.success('Project deleted successfully');
      loadProjects();
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
        setShowProjectDetails(false);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleImportSampleProjects = async () => {
    if (!confirm('This will create 5 sample projects with different statuses. Continue?')) {
      return;
    }

    setImportLoading(true);

    try {
      // Make sure we have some clients first
      if (clients.length === 0) {
        toast.error('Please import clients first before creating projects');
        setImportLoading(false);
        return;
      }

      // Sample projects data
      const sampleProjects = [
        {
          projectName: 'E-Commerce Platform Redesign',
          client_id: clients[0]?.id || 1,
          clientName: clients[0]?.name || 'Sample Client',
          type: 'ai-enhanced' as const,
          price: 7500,
          description: 'Complete redesign of existing e-commerce platform with AI-powered product recommendations',
          status: 'development' as const,
          progress: 65,
          startDate: '2025-06-15',
          deadline: '2025-07-15',
          technologies: ['React', 'Node.js', 'PostgreSQL', 'OpenAI API'],
          deliverables: ['Frontend redesign', 'AI recommendation engine', 'Admin dashboard', 'API documentation']
        },
        {
          projectName: 'Customer Support AI Bot',
          client_id: clients[1]?.id || 2,
          clientName: clients[1]?.name || 'Another Client',
          type: 'standard' as const,
          price: 5000,
          description: 'AI-powered customer support chatbot for automated responses',
          status: 'testing' as const,
          progress: 85,
          startDate: '2025-06-01',
          deadline: '2025-06-30',
          technologies: ['Python', 'FastAPI', 'Claude API', 'React'],
          deliverables: ['Chat interface', 'Admin panel', 'Training documentation']
        },
        {
          projectName: 'Enterprise Resource Planning System',
          client_id: clients[2]?.id || 3,
          clientName: clients[2]?.name || 'Enterprise Client',
          type: 'enterprise' as const,
          price: 15000,
          description: 'Custom ERP system for manufacturing company with inventory management',
          status: 'planning' as const,
          progress: 20,
          startDate: '2025-06-25',
          deadline: '2025-08-30',
          technologies: ['Angular', 'Java Spring', 'Oracle DB', 'Docker'],
          deliverables: ['Inventory module', 'HR module', 'Finance module', 'Reporting dashboard']
        },
        {
          projectName: 'Mobile App Development',
          client_id: clients[3]?.id || 4,
          clientName: clients[3]?.name || 'Mobile Client',
          type: 'ai-enhanced' as const,
          price: 7500,
          description: 'Cross-platform mobile app with AI-powered features',
          status: 'deployed' as const,
          progress: 100,
          startDate: '2025-05-01',
          deadline: '2025-06-15',
          completionDate: '2025-06-10',
          technologies: ['React Native', 'Firebase', 'TensorFlow Lite'],
          deliverables: ['iOS app', 'Android app', 'Backend API', 'User manual']
        },
        {
          projectName: 'Data Analytics Dashboard',
          client_id: clients[4]?.id || 5,
          clientName: clients[4]?.name || 'Analytics Client',
          type: 'standard' as const,
          price: 5000,
          description: 'Real-time analytics dashboard for business metrics',
          status: 'design' as const,
          progress: 35,
          startDate: '2025-06-20',
          deadline: '2025-07-20',
          technologies: ['Vue.js', 'D3.js', 'Python', 'MongoDB'],
          deliverables: ['Interactive dashboard', 'Data pipeline', 'API endpoints']
        }
      ];

      // Create projects one by one
      for (const projectData of sampleProjects) {
        try {
          await apiCall(API_ENDPOINTS.projects, {
            method: 'POST',
            body: JSON.stringify({
              ...projectData,
              assignedTo: users[0]?.id || null,
              notes: 'Sample project created for demonstration purposes'
            })
          });
        } catch (error) {
          console.error('Failed to create project:', projectData.projectName, error);
        }
      }

      // Reload projects
      await loadProjects();
      
      toast.success('Sample projects created successfully!');
    } catch (error) {
      console.error('Error importing sample projects:', error);
      toast.error('Failed to import sample projects');
    } finally {
      setImportLoading(false);
    }
  };

  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    setProjectForm({
      projectName: project.projectName,
      clientName: project.clientName,
      client_id: project.client_id?.toString() || '',
      type: project.type,
      price: project.actualPrice || project.price,
      startDate: project.startDate,
      deadline: project.deadline,
      assignedTo: project.assignedTo?.toString() || '',
      notes: project.notes || '',
      description: project.description || '',
      estimated_hours: project.estimated_hours || 0,
      technologies: project.technologies?.join(', ') || '',
      deliverables: project.deliverables?.join(', ') || ''
    });
    setShowEditProject(true);
  };

  const resetForm = () => {
    setProjectForm({
      projectName: '',
      clientName: '',
      client_id: '',
      type: 'standard',
      price: 5000,
      startDate: new Date().toISOString().split('T')[0],
      deadline: '',
      assignedTo: '',
      notes: '',
      description: '',
      estimated_hours: 0,
      technologies: '',
      deliverables: ''
    });
  };

  // Optimized form field update functions
  const updateProjectForm = useCallback((field: string, value: any) => {
    setProjectForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const updateProjectFormMultiple = useCallback((updates: Record<string, any>) => {
    setProjectForm(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: "bg-gray-100 text-gray-800",
      discovery: "bg-purple-100 text-purple-800",
      design: "bg-blue-100 text-blue-800",
      development: "bg-yellow-100 text-yellow-800",
      testing: "bg-orange-100 text-orange-800",
      deployed: "bg-green-100 text-green-800",
      'on-hold': "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ai-enhanced':
        return <Rocket className="h-4 w-4 text-purple-500" />;
      case 'enterprise':
        return <Building className="h-4 w-4 text-blue-500" />;
      default:
        return <Code className="h-4 w-4 text-gray-500" />;
    }
  };

  const getFilteredProjects = () => {
    return projects.filter(project => {
      if (searchTerm && !project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !project.clientName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filterStatus !== 'all' && project.status !== filterStatus) return false;
      if (filterType !== 'all' && project.type !== filterType) return false;
      return true;
    });
  };

  const ProjectCard = ({ project }: { project: Project }) => {
    const isOverdue = new Date(project.deadline) < new Date() && project.status !== 'deployed';
    
    return (
      <Card className={`hover:shadow-lg transition-all cursor-pointer ${isOverdue ? 'border-red-200' : ''}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {getTypeIcon(project.type)}
                {project.projectName}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Building className="h-3 w-3" />
                {project.clientName}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                  setSelectedProject(project);
                  setShowProjectDetails(true);
                }}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openEditDialog(project)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => updateProjectStatus(project.id, 'development')}>
                  <Code className="h-4 w-4 mr-2" />
                  Start Development
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateProjectStatus(project.id, 'testing')}>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Move to Testing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateProjectStatus(project.id, 'deployed')}>
                  <Rocket className="h-4 w-4 mr-2" />
                  Mark as Deployed
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => deleteProject(project.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
            {isOverdue && <Badge variant="destructive">Overdue</Badge>}
            <Badge variant="outline">${(project.actualPrice || project.price).toLocaleString()}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Start: {format(new Date(project.startDate), 'MMM d')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Due: {format(new Date(project.deadline), 'MMM d')}</span>
              </div>
            </div>

            {project.assignedToName && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {project.assignedToName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{project.assignedToName}</span>
              </div>
            )}

            {project.tasks && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tasks</span>
                <span className="font-medium">
                  {project.tasks.completed}/{project.tasks.total} completed
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const ProjectForm = useCallback(({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="projectName">Project Name *</Label>
          <Input
            id="projectName"
            value={projectForm.projectName}
            onChange={(e) => updateProjectForm('projectName', e.target.value)}
            placeholder="Website Redesign"
          />
        </div>
        <div>
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            value={projectForm.clientName}
            onChange={(e) => updateProjectForm('clientName', e.target.value)}
            placeholder="Acme Corp (optional)"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="client">Select Existing Client</Label>
          <Select
            value={projectForm.client_id}
            onValueChange={(value) => {
              if (value === 'new') {
                updateProjectForm('client_id', value);
              } else {
                const client = clients.find(c => c.id.toString() === value);
                if (client) {
                  updateProjectFormMultiple({ 
                    client_id: value, 
                    clientName: client.name 
                  });
                } else {
                  updateProjectForm('client_id', value);
                }
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select client or create new" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Create New Client</SelectItem>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id.toString()}>
                  {client.name} {client.company ? `(${client.company})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="type">Project Type</Label>
          <Select
            value={projectForm.type}
            onValueChange={(value) => {
              updateProjectFormMultiple({
                type: value as any,
                price: value === 'standard' ? 5000 : value === 'ai-enhanced' ? 7500 : 10000
              });
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard ($5,000)</SelectItem>
              <SelectItem value="ai-enhanced">AI-Enhanced ($7,500)</SelectItem>
              <SelectItem value="enterprise">Enterprise ($10,000+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Budget</Label>
          <Input
            id="price"
            type="number"
            value={projectForm.price}
            onChange={(e) => updateProjectForm('price', parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>
        <div>
          <Label htmlFor="estimated_hours">Estimated Hours</Label>
          <Input
            id="estimated_hours"
            type="number"
            value={projectForm.estimated_hours}
            onChange={(e) => updateProjectForm('estimated_hours', parseInt(e.target.value) || 0)}
            min="0"
            placeholder="160"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date (optional)</Label>
          <Input
            id="startDate"
            type="date"
            value={projectForm.startDate}
            onChange={(e) => updateProjectForm('startDate', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="deadline">Deadline (optional)</Label>
          <Input
            id="deadline"
            type="date"
            value={projectForm.deadline}
            onChange={(e) => updateProjectForm('deadline', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="assignTo">Assign To</Label>
        <Select 
          value={projectForm.assignedTo} 
          onValueChange={(value) => updateProjectForm('assignedTo', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select team member" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {users.map(user => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name} ({user.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Project Description</Label>
        <Textarea
          id="description"
          value={projectForm.description}
          onChange={(e) => updateProjectForm('description', e.target.value)}
          placeholder="Detailed project description..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="technologies">Technologies (comma separated)</Label>
        <Input
          id="technologies"
          value={projectForm.technologies}
          onChange={(e) => updateProjectForm('technologies', e.target.value)}
          placeholder="React, Node.js, PostgreSQL"
        />
      </div>

      <div>
        <Label htmlFor="deliverables">Deliverables (comma separated)</Label>
        <Textarea
          id="deliverables"
          value={projectForm.deliverables}
          onChange={(e) => updateProjectForm('deliverables', e.target.value)}
          placeholder="Website design, API development, Documentation"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea 
          id="notes"
          placeholder="Project notes and requirements..." 
          value={projectForm.notes}
          onChange={(e) => updateProjectForm('notes', e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => {
          setShowAddProject(false);
          setShowEditProject(false);
          setSelectedProject(null);
          resetForm();
        }}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>{submitLabel}</Button>
      </div>
    </div>
  ), [projectForm, clients, users, updateProjectForm, updateProjectFormMultiple]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Projects</CardDescription>
            <CardTitle className="text-2xl">{projectMetrics.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{projectMetrics.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Planning</CardDescription>
            <CardTitle className="text-2xl text-purple-600">{projectMetrics.planning}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-2xl text-green-600">{projectMetrics.completed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl">${projectMetrics.revenue.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Avg Progress</CardDescription>
            <CardTitle className="text-2xl">{projectMetrics.avgProgress}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Project Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Project Management</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleImportSampleProjects}
                disabled={importLoading}
              >
                {importLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                ) : (
                  <Activity className="h-4 w-4 mr-2" />
                )}
                Import Sample Projects
              </Button>
              <Sheet open={showAddProject} onOpenChange={setShowAddProject}>
                <SheetTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </SheetTrigger>
              <SheetContent side="right" className="w-[600px] sm:w-[700px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Create New Project</SheetTitle>
                  <SheetDescription>
                    Quickly create a project - only the name is required
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4">
                  <ProjectForm onSubmit={createProject} submitLabel="Create Project" />
                </div>
              </SheetContent>
            </Sheet>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="deployed">Deployed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="ai-enhanced">AI-Enhanced</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Project View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredProjects().map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : viewMode === 'list' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="pb-3">Project</th>
                    <th className="pb-3">Client</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Progress</th>
                    <th className="pb-3">Budget</th>
                    <th className="pb-3">Deadline</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredProjects().map(project => (
                    <tr key={project.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(project.type)}
                          <span className="font-medium">{project.projectName}</span>
                        </div>
                      </td>
                      <td className="py-3">{project.clientName}</td>
                      <td className="py-3">
                        <Badge variant="outline">{project.type}</Badge>
                      </td>
                      <td className="py-3">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress} className="w-20 h-2" />
                          <span className="text-sm">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3">${(project.actualPrice || project.price).toLocaleString()}</td>
                      <td className="py-3">{format(new Date(project.deadline), 'MMM d, yyyy')}</td>
                      <td className="py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(project)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteProject(project.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {['planning', 'development', 'testing', 'deployed'].map(status => (
                <div key={status} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-4 capitalize">{status}</h3>
                  <div className="space-y-3">
                    {getFilteredProjects()
                      .filter(p => p.status === status)
                      .map(project => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {getFilteredProjects().length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No projects found</p>
              <Button
                className="mt-4"
                onClick={() => setShowAddProject(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Project Sheet */}
      <Sheet open={showEditProject} onOpenChange={setShowEditProject}>
        <SheetContent side="right" className="w-[600px] sm:w-[700px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Project</SheetTitle>
            <SheetDescription>
              Update project details - only the name is required
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <ProjectForm onSubmit={updateProject} submitLabel="Update Project" />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProjectTrackerV2;