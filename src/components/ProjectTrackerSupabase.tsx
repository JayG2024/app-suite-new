import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/SupabaseAuthContext";
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
  User,
  Upload
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Project {
  id: string;
  name: string;
  client_id: string | null;
  client_name: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  budget: number;
  actual_price?: number;
  progress: number;
  start_date: string;
  end_date: string;
  completion_date?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  notes?: string;
  description?: string;
  technologies?: string[];
  deliverables?: string[];
  budget_spent?: number;
  hours_tracked?: number;
  estimated_hours?: number;
  created_at: string;
  updated_at: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
}

const ProjectTrackerSupabase = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    name: '',
    client_name: '',
    client_id: '',
    status: 'planning' as const,
    budget: 5000,
    estimated_hours: 40,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assigned_to: '',
    description: '',
    technologies: '',
    deliverables: '',
    notes: ''
  });

  // Load projects from Supabase
  const loadProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load clients from Supabase
  const loadClients = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, company')
        .order('full_name');

      if (error) throw error;
      
      const formattedClients: Client[] = (data || []).map(profile => ({
        id: profile.id,
        name: profile.full_name || profile.email,
        email: profile.email,
        company: profile.company
      }));
      
      setClients(formattedClients);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  }, []);

  // Load users for assignment
  const loadUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .order('full_name');

      if (error) throw error;
      
      const formattedUsers: User[] = (data || []).map(profile => ({
        id: profile.id,
        email: profile.email,
        name: profile.full_name
      }));
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    loadProjects();
    loadClients();
    loadUsers();

    // Subscribe to project changes
    const subscription = supabase
      .channel('projects-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        loadProjects();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [loadProjects, loadClients, loadUsers]);

  // Create new project
  const createProject = async () => {
    try {
      const projectData = {
        name: projectForm.name,
        client_name: projectForm.client_name,
        client_id: projectForm.client_id || null,
        status: projectForm.status,
        budget: projectForm.budget,
        progress: 0,
        start_date: projectForm.start_date,
        end_date: projectForm.end_date,
        assigned_to: projectForm.assigned_to || null,
        description: projectForm.description,
        technologies: projectForm.technologies ? projectForm.technologies.split(',').map(t => t.trim()) : [],
        deliverables: projectForm.deliverables ? projectForm.deliverables.split(',').map(d => d.trim()) : [],
        notes: projectForm.notes,
        estimated_hours: projectForm.estimated_hours,
        hours_tracked: 0,
        budget_spent: 0,
        created_by: user?.id
      };

      const { error } = await supabase
        .from('projects')
        .insert([projectData]);

      if (error) throw error;

      toast.success('Project created successfully!');
      setShowAddProject(false);
      resetForm();
      loadProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  };

  // Update project
  const updateProject = async () => {
    if (!selectedProject) return;

    try {
      const projectData = {
        name: projectForm.name,
        client_name: projectForm.client_name,
        client_id: projectForm.client_id || null,
        status: projectForm.status,
        budget: projectForm.budget,
        start_date: projectForm.start_date,
        end_date: projectForm.end_date,
        assigned_to: projectForm.assigned_to || null,
        description: projectForm.description,
        technologies: projectForm.technologies ? projectForm.technologies.split(',').map(t => t.trim()) : [],
        deliverables: projectForm.deliverables ? projectForm.deliverables.split(',').map(d => d.trim()) : [],
        notes: projectForm.notes,
        estimated_hours: projectForm.estimated_hours,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', selectedProject.id);

      if (error) throw error;

      toast.success('Project updated successfully!');
      setShowEditProject(false);
      resetForm();
      loadProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    }
  };

  // Delete project
  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast.success('Project deleted successfully!');
      loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  // Update project progress
  const updateProgress = async (projectId: string, progress: number) => {
    try {
      const updateData: any = {
        progress,
        updated_at: new Date().toISOString()
      };

      // Mark as completed if progress is 100%
      if (progress === 100) {
        updateData.status = 'completed';
        updateData.completion_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId);

      if (error) throw error;

      toast.success('Progress updated!');
      loadProjects();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  const resetForm = () => {
    setProjectForm({
      name: '',
      client_name: '',
      client_id: '',
      status: 'planning',
      budget: 5000,
      estimated_hours: 40,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assigned_to: '',
      description: '',
      technologies: '',
      deliverables: '',
      notes: ''
    });
    setSelectedProject(null);
  };

  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    setProjectForm({
      name: project.name,
      client_name: project.client_name,
      client_id: project.client_id || '',
      status: project.status,
      budget: project.budget,
      estimated_hours: project.estimated_hours || 40,
      start_date: project.start_date,
      end_date: project.end_date,
      assigned_to: project.assigned_to || '',
      description: project.description || '',
      technologies: project.technologies?.join(', ') || '',
      deliverables: project.deliverables?.join(', ') || '',
      notes: project.notes || ''
    });
    setShowEditProject(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <Rocket className="h-4 w-4" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'on_hold': return <AlertCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const ProjectForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="projectName">Project Name *</Label>
          <Input
            id="projectName"
            type="text"
            value={projectForm.name}
            onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
            placeholder="Website Redesign"
            autoComplete="off"
            style={{ pointerEvents: 'auto', cursor: 'text' }}
          />
        </div>
        <div>
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            type="text"
            value={projectForm.client_name}
            onChange={(e) => setProjectForm({...projectForm, client_name: e.target.value})}
            placeholder="Acme Corp (optional)"
            autoComplete="off"
            style={{ pointerEvents: 'auto', cursor: 'text' }}
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
                setProjectForm({...projectForm, client_id: ''});
              } else {
                const client = clients.find(c => c.id === value);
                if (client) {
                  setProjectForm({ 
                    ...projectForm,
                    client_id: value, 
                    client_name: client.name 
                  });
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
                <SelectItem key={client.id} value={client.id}>
                  {client.name} {client.company ? `(${client.company})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Project Status</Label>
          <Select
            value={projectForm.status}
            onValueChange={(value: any) => setProjectForm({...projectForm, status: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            type="number"
            value={projectForm.budget}
            onChange={(e) => setProjectForm({...projectForm, budget: parseInt(e.target.value) || 0})}
            min="0"
            autoComplete="off"
            style={{ pointerEvents: 'auto', cursor: 'text' }}
          />
        </div>
        <div>
          <Label htmlFor="estimated_hours">Estimated Hours</Label>
          <Input
            id="estimated_hours"
            type="number"
            value={projectForm.estimated_hours}
            onChange={(e) => setProjectForm({...projectForm, estimated_hours: parseInt(e.target.value) || 0})}
            min="0"
            placeholder="160"
            autoComplete="off"
            style={{ pointerEvents: 'auto', cursor: 'text' }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={projectForm.start_date}
            onChange={(e) => setProjectForm({...projectForm, start_date: e.target.value})}
            style={{ pointerEvents: 'auto', cursor: 'text' }}
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={projectForm.end_date}
            onChange={(e) => setProjectForm({...projectForm, end_date: e.target.value})}
            style={{ pointerEvents: 'auto', cursor: 'text' }}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="assignTo">Assign To</Label>
        <Select 
          value={projectForm.assigned_to} 
          onValueChange={(value) => setProjectForm({...projectForm, assigned_to: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select team member" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Unassigned</SelectItem>
            {users.map(user => (
              <SelectItem key={user.id} value={user.id}>
                {user.name || user.email}
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
          onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
          placeholder="Detailed project description..."
          rows={3}
          style={{ pointerEvents: 'auto', cursor: 'text' }}
        />
      </div>

      <div>
        <Label htmlFor="technologies">Technologies (comma separated)</Label>
        <Input
          id="technologies"
          value={projectForm.technologies}
          onChange={(e) => setProjectForm({...projectForm, technologies: e.target.value})}
          placeholder="React, Node.js, PostgreSQL"
          style={{ pointerEvents: 'auto', cursor: 'text' }}
        />
      </div>

      <div>
        <Label htmlFor="deliverables">Deliverables (comma separated)</Label>
        <Textarea
          id="deliverables"
          value={projectForm.deliverables}
          onChange={(e) => setProjectForm({...projectForm, deliverables: e.target.value})}
          placeholder="Website design, API development, Documentation"
          rows={2}
          style={{ pointerEvents: 'auto', cursor: 'text' }}
        />
      </div>

      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea 
          id="notes"
          placeholder="Project notes and requirements..." 
          value={projectForm.notes}
          onChange={(e) => setProjectForm({...projectForm, notes: e.target.value})}
          rows={3}
          style={{ pointerEvents: 'auto', cursor: 'text' }}
        />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={() => {
          setShowAddProject(false);
          setShowEditProject(false);
          resetForm();
        }}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={!projectForm.name}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
            <p className="text-sm text-muted-foreground">{project.client_name}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
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
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => deleteProject(project.id)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(project.status)}>
              {getStatusIcon(project.status)}
              <span className="ml-1">{project.status.replace('_', ' ')}</span>
            </Badge>
            <span className="text-sm font-medium">${project.budget.toLocaleString()}</span>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Start Date</p>
              <p className="font-medium">{format(new Date(project.start_date), 'MMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">End Date</p>
              <p className="font-medium">{format(new Date(project.end_date), 'MMM d, yyyy')}</p>
            </div>
          </div>

          {project.assigned_to && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {project.assigned_to_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{project.assigned_to_name}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              const newProgress = Math.min(100, project.progress + 10);
              updateProgress(project.id, newProgress);
            }}
          >
            +10%
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              setSelectedProject(project);
              setShowProjectDetails(true);
            }}
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Project Tracker</CardTitle>
              <CardDescription>Manage and track all your projects</CardDescription>
            </div>
            <Button onClick={() => setShowAddProject(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </div>
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'in_progress').length}
                </p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
              <Rocket className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'completed').length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  ${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Budget</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Add Project Dialog */}
      <Dialog open={showAddProject} onOpenChange={setShowAddProject}>
        <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto" style={{ pointerEvents: 'auto' }}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Quickly create a project - only the name is required
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4" style={{ pointerEvents: 'auto' }}>
            <ProjectForm onSubmit={createProject} submitLabel="Create Project" />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={showEditProject} onOpenChange={setShowEditProject}>
        <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto" style={{ pointerEvents: 'auto' }}>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update project details
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4" style={{ pointerEvents: 'auto' }}>
            <ProjectForm onSubmit={updateProject} submitLabel="Update Project" />
          </div>
        </DialogContent>
      </Dialog>

      {/* Project Details Dialog */}
      <Dialog open={showProjectDetails} onOpenChange={setShowProjectDetails}>
        <DialogContent className="max-w-[90vw] w-full h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedProject?.name}
            </DialogTitle>
            <DialogDescription>
              Full project details and management
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <div className="mt-6 space-y-6">
              {/* Project Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Client</Label>
                      <p className="font-medium">{selectedProject.client_name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Status</Label>
                      <Badge className={getStatusColor(selectedProject.status)}>
                        {selectedProject.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Budget</Label>
                      <p className="font-medium">${selectedProject.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Progress</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={selectedProject.progress} className="flex-1" />
                        <span className="text-sm font-medium">{selectedProject.progress}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Start Date</Label>
                      <p className="font-medium">{format(new Date(selectedProject.start_date), 'MMMM d, yyyy')}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">End Date</Label>
                      <p className="font-medium">{format(new Date(selectedProject.end_date), 'MMMM d, yyyy')}</p>
                    </div>
                    {selectedProject.completion_date && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Completed</Label>
                        <p className="font-medium">{format(new Date(selectedProject.completion_date), 'MMMM d, yyyy')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Description and Notes */}
              {(selectedProject.description || selectedProject.notes) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedProject.description && (
                      <div>
                        <Label className="text-sm font-medium mb-2">Description</Label>
                        <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                      </div>
                    )}
                    {selectedProject.notes && (
                      <div>
                        <Label className="text-sm font-medium mb-2">Notes</Label>
                        <p className="text-sm text-muted-foreground">{selectedProject.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Technologies and Deliverables */}
              {(selectedProject.technologies?.length || selectedProject.deliverables?.length) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium mb-2">Technologies</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.technologies.map((tech, index) => (
                            <Badge key={index} variant="secondary">{tech}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedProject.deliverables && selectedProject.deliverables.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium mb-2">Deliverables</Label>
                        <ul className="list-disc list-inside space-y-1">
                          {selectedProject.deliverables.map((deliverable, index) => (
                            <li key={index} className="text-sm text-muted-foreground">{deliverable}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectTrackerSupabase;