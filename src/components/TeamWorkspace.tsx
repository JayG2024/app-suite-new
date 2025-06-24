import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
  Upload
} from "lucide-react";

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

interface Document {
  id: string;
  title: string;
  content: string;
  type: "document" | "template" | "guide" | "specification";
  category: string;
  url: string | null;
  fileSize: number | null;
  projectName: string | null;
  projectId: number | null;
  createdBy: number | null;
  createdByName: string;
  updatedBy: number | null;
  updatedByName: string;
  createdDate: string;
  updatedDate: string;
  tags: string[];
  isPublic: boolean;
  version: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface Project {
  id: string;
  projectName: string;
  clientName: string;
}

const TeamWorkspace = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [taskFilter, setTaskFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    estimatedHours: 0,
    projectId: "",
    assignedTo: "",
    tags: "",
    notes: ""
  });

  const [newDocument, setNewDocument] = useState({
    title: "",
    content: "",
    type: "document",
    category: "general",
    projectId: "",
    tags: "",
    isPublic: false
  });

  useEffect(() => {
    // Get current user
    const authUser = localStorage.getItem("commandCenterUser");
    setCurrentUser(authUser);

    // Load all data
    loadTasks();
    loadDocuments();
    loadUsers();
    loadProjects();
    
    // Refresh data every 30 seconds for real-time collaboration
    const interval = setInterval(() => {
      loadTasks();
      loadDocuments();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects-db');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const getCurrentUserId = () => {
    const user = users.find(u => u.email === currentUser);
    return user?.id || null;
  };

  const addTask = async () => {
    if (!newTask.title) {
      alert("Please fill in task title");
      return;
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          dueDate: newTask.dueDate || null,
          estimatedHours: newTask.estimatedHours,
          projectId: newTask.projectId ? parseInt(newTask.projectId) : null,
          assignedTo: newTask.assignedTo ? parseInt(newTask.assignedTo) : null,
          createdBy: getCurrentUserId(),
          tags: newTask.tags ? newTask.tags.split(',').map(t => t.trim()) : [],
          notes: newTask.notes
        })
      });

      if (response.ok) {
        await loadTasks();
        setNewTask({
          title: "",
          description: "",
          priority: "medium",
          dueDate: "",
          estimatedHours: 0,
          projectId: "",
          assignedTo: "",
          tags: "",
          notes: ""
        });
        setShowTaskDialog(false);
      } else {
        const error = await response.json();
        alert(`Failed to create task: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  const addDocument = async () => {
    if (!newDocument.title) {
      alert("Please fill in document title");
      return;
    }

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newDocument.title,
          content: newDocument.content,
          type: newDocument.type,
          category: newDocument.category,
          projectId: newDocument.projectId ? parseInt(newDocument.projectId) : null,
          createdBy: getCurrentUserId(),
          tags: newDocument.tags ? newDocument.tags.split(',').map(t => t.trim()) : [],
          isPublic: newDocument.isPublic
        })
      });

      if (response.ok) {
        await loadDocuments();
        setNewDocument({
          title: "",
          content: "",
          type: "document",
          category: "general",
          projectId: "",
          tags: "",
          isPublic: false
        });
        setShowDocumentDialog(false);
      } else {
        const error = await response.json();
        alert(`Failed to create document: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Failed to create document. Please try again.');
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        await loadTasks();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const deleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await fetch(`/api/documents?id=${documentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadDocuments();
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'review': return 'bg-purple-500';
      case 'todo': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = taskFilter === "all" || task.status === taskFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.assignedToName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.createdByName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate team metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === 'completed') return false;
    return new Date(t.dueDate) < new Date();
  }).length;
  const totalHours = tasks.reduce((sum, t) => sum + t.actualHours, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading team workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
            <p className="text-xs text-blue-600 mt-1">
              {completedTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
            </div>
            <Progress 
              value={totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalHours}</div>
            <p className="text-xs text-orange-600 mt-1">
              {users.length} team members
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
            <p className="text-xs text-red-600 mt-1">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Select value={taskFilter} onValueChange={setTaskFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-10 w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>Add a new task to the team workspace</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Title</Label>
                    <Input 
                      placeholder="Task title" 
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea 
                      placeholder="Task description" 
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Priority</Label>
                      <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Estimated Hours</Label>
                      <Input 
                        type="number" 
                        placeholder="8" 
                        value={newTask.estimatedHours}
                        onChange={(e) => setNewTask({...newTask, estimatedHours: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input 
                      type="date" 
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Assign To</Label>
                    <Select value={newTask.assignedTo} onValueChange={(value) => setNewTask({...newTask, assignedTo: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Project</Label>
                    <Select value={newTask.projectId} onValueChange={(value) => setNewTask({...newTask, projectId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No project</SelectItem>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.projectName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tags (comma separated)</Label>
                    <Input 
                      placeholder="frontend, ui, urgent" 
                      value={newTask.tags}
                      onChange={(e) => setNewTask({...newTask, tags: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowTaskDialog(false)}>Cancel</Button>
                    <Button onClick={addTask}>Create Task</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                          {task.priority}
                        </Badge>
                        {task.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Assigned to: {task.assignedToName}</span>
                        {task.projectName && <span>Project: {task.projectName}</span>}
                        {task.dueDate && (
                          <span className={new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-600' : ''}>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        <span>{task.estimatedHours}h estimated</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={task.status} onValueChange={(value) => updateTaskStatus(task.id, value)}>
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => deleteTask(task.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredTasks.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No tasks found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-10 w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Document</DialogTitle>
                  <DialogDescription>Add a new document to the knowledge base</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Title</Label>
                    <Input 
                      placeholder="Document title" 
                      value={newDocument.title}
                      onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Content</Label>
                    <Textarea 
                      placeholder="Document content" 
                      value={newDocument.content}
                      onChange={(e) => setNewDocument({...newDocument, content: e.target.value})}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Type</Label>
                      <Select value={newDocument.type} onValueChange={(value) => setNewDocument({...newDocument, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="document">Document</SelectItem>
                          <SelectItem value="template">Template</SelectItem>
                          <SelectItem value="guide">Guide</SelectItem>
                          <SelectItem value="specification">Specification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select value={newDocument.category} onValueChange={(value) => setNewDocument({...newDocument, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="process">Process</SelectItem>
                          <SelectItem value="client">Client</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Project</Label>
                    <Select value={newDocument.projectId} onValueChange={(value) => setNewDocument({...newDocument, projectId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No project</SelectItem>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.projectName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="isPublic"
                      checked={newDocument.isPublic}
                      onChange={(e) => setNewDocument({...newDocument, isPublic: e.target.checked})}
                    />
                    <Label htmlFor="isPublic">Make public</Label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowDocumentDialog(false)}>Cancel</Button>
                    <Button onClick={addDocument}>Create Document</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Documents List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {doc.type}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => deleteDocument(doc.id)}
                      className="text-red-600 h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <CardTitle className="text-base">{doc.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {doc.category} • by {doc.createdByName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {doc.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(doc.updatedDate).toLocaleDateString()}</span>
                    {doc.isPublic && <Badge variant="secondary" className="text-xs">Public</Badge>}
                  </div>
                  {doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {filteredDocuments.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No documents found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Active team members and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => {
                  const userTasks = tasks.filter(t => t.assignedTo === user.id);
                  const completedUserTasks = userTasks.filter(t => t.status === 'completed');
                  const userHours = userTasks.reduce((sum, t) => sum + t.actualHours, 0);
                  
                  return (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{userTasks.length} tasks</p>
                          <p className="text-xs text-muted-foreground">
                            {completedUserTasks.length} completed
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {userHours}h logged
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamWorkspace;