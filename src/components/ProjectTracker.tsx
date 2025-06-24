import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  GitBranch
} from "lucide-react";

interface Project {
  id: string;
  clientName: string;
  projectName: string;
  type: "standard" | "ai-enhanced" | "enterprise";
  price: number;
  actualPrice?: number;
  status: "planning" | "discovery" | "design" | "development" | "testing" | "deployed";
  progress: number;
  startDate: string;
  deadline: string;
  completionDate?: string;
  developer: string;
  assignedTo?: number;
  lastUpdate: string;
  notes: string;
  leadId?: number;
  createdBy?: number;
  createdByName?: string;
  tasks: {
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

const ProjectTracker = () => {
  const { socket, connected, joinProject, emitProjectUpdate, emitActivityCreated } = useSocket();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds default
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [newProject, setNewProject] = useState({
    projectName: "",
    clientName: "",
    type: "standard" as Project["type"],
    estimatedValue: 5000,
    startDate: "",
    deadline: "",
    assignedTo: "",
    notes: ""
  });

  // Load data from database
  useEffect(() => {
    // Get current user
    const authUser = localStorage.getItem("commandCenterUser");
    setCurrentUser(authUser);

    // Load users and projects
    loadUsers();
    loadProjects();
    
    // Join all project rooms for real-time updates
    if (connected && projects.length > 0) {
      projects.forEach(project => {
        joinProject(project.id);
      });
    }
    
    // Listen for real-time updates
    const handleProjectUpdate = (event: CustomEvent) => {
      loadProjects(); // Reload projects when update received
    };
    
    const handleNewActivity = (event: CustomEvent) => {
      const { projectId } = event.detail;
      if (selectedProject && selectedProject.id === projectId) {
        loadProjectActivities(projectId);
      }
    };
    
    window.addEventListener('project-updated', handleProjectUpdate as EventListener);
    window.addEventListener('new-activity', handleNewActivity as EventListener);
    
    // Fallback polling for offline mode
    const interval = connected ? null : setInterval(() => {
      loadProjects();
      if (selectedProject) {
        loadProjectActivities(selectedProject.id);
      }
    }, refreshInterval);

    return () => {
      window.removeEventListener('project-updated', handleProjectUpdate as EventListener);
      window.removeEventListener('new-activity', handleNewActivity as EventListener);
      if (interval) clearInterval(interval);
    };
  }, [refreshInterval, selectedProject, connected, projects.length]);

  const loadUsers = async () => {
    try {
      const data = await apiCall(API_ENDPOINTS.users);
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await apiCall(API_ENDPOINTS.projects);
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserId = () => {
    const user = users.find(u => u.email === currentUser);
    return user?.id || null;
  };

  const addProject = async () => {
    if (!newProject.projectName || !newProject.clientName) {
      alert("Please fill in project name and client name");
      return;
    }

    try {
      await apiCall(API_ENDPOINTS.projects, {
        method: 'POST',
        body: JSON.stringify({
          ...newProject,
          assigned_to: newProject.assignedTo ? parseInt(newProject.assignedTo) : null,
          created_by: getCurrentUserId()
        })
      });

      await loadProjects(); // Refresh data
      setNewProject({
        projectName: "",
        clientName: "",
        type: "standard",
        estimatedValue: 5000,
        startDate: "",
        deadline: "",
        assignedTo: "",
        notes: ""
      });
      setShowAddProject(false);
      toast.success('Project created successfully');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project. Please try again.');
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    
    try {
      await apiCall(`${API_ENDPOINTS.projects}?id=${projectId}`, {
        method: 'DELETE'
      });

      await loadProjects(); // Refresh data
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project. Please try again.');
    }
  };

  const loadProjectActivities = async (projectId: string) => {
    try {
      const data = await apiCall(`${API_ENDPOINTS.activityLog}?entity_type=project&entity_id=${projectId}`);
      // Update the selected project with activities
      setProjects(prevProjects => 
        prevProjects.map(p => 
          p.id === projectId ? { ...p, activities: data.activities } : p
        )
      );
      if (selectedProject?.id === projectId) {
        setSelectedProject(prev => prev ? { ...prev, activities: data.activities } : null);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const addProjectNote = async () => {
    if (!selectedProject || !newNote.trim()) return;

    setAddingNote(true);
    try {
      // Add note as an activity
      await apiCall(API_ENDPOINTS.activityLog, {
        method: 'POST',
        body: JSON.stringify({
          action: 'note_added',
          entity_type: 'project',
          entity_id: selectedProject.id,
          details: { note_content: newNote },
          user_id: getCurrentUserId()
        })
      });

      // Also update project notes in database
      await apiCall(API_ENDPOINTS.projects, {
        method: 'PUT',
        body: JSON.stringify({ 
          id: selectedProject.id,
          notes: selectedProject.notes + '\n\n' + new Date().toLocaleString() + ': ' + newNote 
        })
      });

        // Refresh activities
        await loadProjectActivities(selectedProject.id);
        setNewNote('');
        toast.success('Note added successfully');
        
        // Emit WebSocket event for real-time sync
        emitActivityCreated(selectedProject.id, {
          activity_type: 'note_added',
          activity_description: newNote
        });
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const updateProjectStatus = async (projectId: string, newStatus: Project["status"]) => {
    try {
      await apiCall(API_ENDPOINTS.projects, {
        method: 'PUT',
        body: JSON.stringify({ 
          id: projectId,
          status: newStatus 
        })
      });

      // Log status change activity
      await apiCall(API_ENDPOINTS.activityLog, {
        method: 'POST',
        body: JSON.stringify({
          action: 'status_changed',
          entity_type: 'project',
          entity_id: projectId,
          details: { 
            old_status: projects.find(p => p.id === projectId)?.status, 
            new_status: newStatus,
            description: `Project status changed to ${newStatus}`
          },
          user_id: getCurrentUserId()
        })
      });
      
      await loadProjects(); // Refresh data
      
      // Emit WebSocket event for real-time sync
      emitProjectUpdate(projectId, { status: newStatus });
      
      toast.success('Project status updated');
    } catch (error) {
      console.error('Error updating project status:', error);
      toast.error('Failed to update project status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "planning": return "bg-slate-500";
      case "discovery": return "bg-gray-500";
      case "design": return "bg-blue-500";
      case "development": return "bg-purple-500";
      case "testing": return "bg-orange-500";
      case "deployed": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeInfo = (type: string) => {
    switch(type) {
      case "standard": return { label: "$5K Standard", color: "default" };
      case "ai-enhanced": return { label: "$7.5K AI-Enhanced", color: "secondary" };
      case "enterprise": return { label: "$10K Enterprise", color: "destructive" };
      default: return { label: "Unknown", color: "outline" };
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const due = new Date(deadline);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
            <p className="text-xs text-blue-600 mt-1">
              ${projects.reduce((sum, p) => sum + p.price, 0).toLocaleString()} total value
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivered Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {projects.filter(p => p.status === 'deployed').length}
            </div>
            <p className="text-xs text-green-600 mt-1">
              ${projects.filter(p => p.status === 'deployed').reduce((sum, p) => sum + p.price, 0).toLocaleString()} revenue
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0}%
            </div>
            <p className="text-xs text-purple-600 mt-1">
              {projects.filter(p => p.progress >= 80).length} near completion
            </p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Team Workload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {projects.filter(p => !['deployed', 'planning'].includes(p.status)).length}
            </div>
            <p className="text-xs text-orange-600 mt-1">active development</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Projects */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Projects</h3>
        {projects.map((project) => {
          const daysRemaining = getDaysRemaining(project.deadline);
          const typeInfo = getTypeInfo(project.type);
          
          return (
            <Card key={project.id} className="overflow-hidden">
              <div className={`h-1 ${getStatusColor(project.status)}`} />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{project.clientName}</CardTitle>
                    <CardDescription>{project.projectName}</CardDescription>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant={typeInfo.color as "default" | "secondary" | "destructive" | "outline"}>{typeInfo.label}</Badge>
                      <Badge variant="outline" className="capitalize">{project.status}</Badge>
                      {daysRemaining < 5 && daysRemaining > 0 && (
                        <Badge variant="destructive" className="animate-pulse">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {daysRemaining} days left
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{project.developer[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Start Date
                    </p>
                    <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Deadline
                    </p>
                    <p className="font-medium">{new Date(project.deadline).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Tasks
                    </p>
                    <p className="font-medium">{project.tasks.completed}/{project.tasks.total}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> Last Update
                    </p>
                    <p className="font-medium">{project.lastUpdate}</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-2 flex-wrap">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setSelectedProject(project);
                      loadProjectActivities(project.id);
                      setShowActivityDialog(true);
                    }}
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Activity
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${project.clientName}`)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Select value={project.status} onValueChange={(value) => updateProjectStatus(project.id, value as Project["status"])}>
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="discovery">Discovery</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="deployed">Deployed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => deleteProject(project.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Project Dialog */}
      <Dialog open={showAddProject} onOpenChange={setShowAddProject}>
        <DialogTrigger asChild>
          <Card className="border-dashed cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="flex items-center justify-center py-6">
              <Button variant="outline" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Add New Project
              </Button>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>Create a new project for tracking and management</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Project Name</Label>
              <Input 
                placeholder="CRM System" 
                value={newProject.projectName}
                onChange={(e) => setNewProject({...newProject, projectName: e.target.value})}
              />
            </div>
            <div>
              <Label>Client Name</Label>
              <Input 
                placeholder="Acme Corp" 
                value={newProject.clientName}
                onChange={(e) => setNewProject({...newProject, clientName: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Project Type</Label>
                <Select value={newProject.type} onValueChange={(value) => setNewProject({...newProject, type: value as Project["type"]})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">$5K Standard</SelectItem>
                    <SelectItem value="ai-enhanced">$7.5K AI-Enhanced</SelectItem>
                    <SelectItem value="enterprise">$10K Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Estimated Value</Label>
                <Input 
                  type="number" 
                  placeholder="5000" 
                  value={newProject.estimatedValue}
                  onChange={(e) => setNewProject({...newProject, estimatedValue: parseInt(e.target.value) || 5000})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input 
                  type="date" 
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                />
              </div>
              <div>
                <Label>Deadline</Label>
                <Input 
                  type="date" 
                  value={newProject.deadline}
                  onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label>Assign To</Label>
              <Select value={newProject.assignedTo} onValueChange={(value) => setNewProject({...newProject, assignedTo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea 
                placeholder="Project description and requirements..." 
                value={newProject.notes}
                onChange={(e) => setNewProject({...newProject, notes: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddProject(false)}>Cancel</Button>
              <Button onClick={addProject}>Create Project</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project Activity Dialog */}
      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Project Activity Timeline
              </div>
              {selectedProject && (
                <Badge variant="outline">
                  {selectedProject.projectName}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              View all activities and updates for this project
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4 overflow-y-auto max-h-[50vh]">
            {selectedProject?.activities && selectedProject.activities.length > 0 ? (
              <div className="space-y-3">
                {selectedProject.activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.activity_type)}
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">{activity.activity_description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{activity.user_name || 'System'}</span>
                        <span>•</span>
                        <span>{new Date(activity.created_at).toLocaleString()}</span>
                      </div>
                      {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                        <div className="mt-2 text-sm">
                          {activity.metadata.email_type && (
                            <Badge variant="secondary" className="mr-2">
                              {activity.metadata.email_type.replace(/-/g, ' ')}
                            </Badge>
                          )}
                          {activity.metadata.recipient && (
                            <span className="text-muted-foreground">
                              Sent to: {activity.metadata.recipient}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No activities recorded yet</p>
                <p className="text-sm mt-1">Activities will appear here as the project progresses</p>
              </div>
            )}
          </div>

          {/* Add Note Section */}
          <div className="mt-4 pt-4 border-t">
            <div className="space-y-3">
              <Label>Add a Note</Label>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Enter your note here..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-grow"
                  rows={2}
                />
                <Button 
                  onClick={addProjectNote}
                  disabled={addingNote || !newNote.trim()}
                  className="self-start"
                >
                  {addingNote ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Note
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                Auto-refreshing every {refreshInterval / 1000} seconds
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowActivityDialog(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function to get icon for activity type
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'email_sent':
      return <Mail className="h-4 w-4 text-blue-500" />;
    case 'status_changed':
      return <GitBranch className="h-4 w-4 text-purple-500" />;
    case 'task_completed':
      return <CheckSquare className="h-4 w-4 text-green-500" />;
    case 'project_created':
      return <Rocket className="h-4 w-4 text-orange-500" />;
    case 'note_added':
      return <FileText className="h-4 w-4 text-gray-500" />;
    default:
      return <Activity className="h-4 w-4 text-gray-500" />;
  }
};

export default ProjectTracker;