import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { API_ENDPOINTS, apiCall } from "@/utils/api";
import { 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  Circle, 
  Timer,
  Hash,
  Filter,
  ListTodo,
  LayoutGrid,
  Search,
  Trash2,
  Edit,
  AlertCircle,
  Target,
  FileText,
  MoreVertical,
  ChevronRight,
  Flag,
  ArrowRight,
  Bot,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface Task {
  id: string | number;
  title: string;
  description: string;
  project_id: number | null;
  project_name?: string;
  assigned_to: number | string | null;
  assignedTo?: number | string | null;
  assigned_to_name?: string;
  assignedToName?: string;
  status: "todo" | "in_progress" | "completed" | "blocked";
  priority: "low" | "medium" | "high" | "urgent";
  estimated_hours: number;
  actual_hours?: number;
  due_date: string | null;
  dueDate?: string | null;
  tags: string[];
  created_at?: string;
  createdDate?: string;
  completed_at?: string | null;
  completedDate?: string | null;
  dependencies?: number[];
  attachments?: string[];
  comments_count?: number;
  checklist?: Array<{id: string; text: string; completed: boolean}>;
}

interface Project {
  id: number;
  name: string;
  project_name?: string;
  client_name?: string;
}

interface User {
  id: number;
  name: string;
  email?: string;
}

const TaskManagerV2 = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'board' | 'list' | 'calendar'>('board');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskMetrics, setTaskMetrics] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    blocked: 0,
    overdue: 0
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    project_id: '',
    assigned_to: '',
    status: 'todo' as const,
    priority: 'medium' as const,
    estimated_hours: 0,
    due_date: '',
    tags: '',
    checklist: [] as Array<{id: string; text: string; completed: boolean}>
  });

  useEffect(() => {
    loadTasks();
    loadProjects();
    loadUsers();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        const tasks = data.tasks || [];
        const normalizedTasks = tasks.map((task: Record<string, unknown>) => ({
          id: task.id?.toString() || '',
          title: task.title || '',
          description: task.description || '',
          project_id: task.projectId || task.project_id,
          project_name: task.projectName || task.project_name,
          assigned_to: task.assignedTo || task.assigned_to,
          assigned_to_name: task.assignedToName || task.assigned_to_name,
          status: task.status || 'todo',
          priority: task.priority || 'medium',
          estimated_hours: parseFloat(task.estimatedHours || task.estimated_hours || 0),
          actual_hours: parseFloat(task.actualHours || task.actual_hours || 0),
          due_date: task.dueDate || task.due_date,
          tags: Array.isArray(task.tags) ? task.tags : [],
          created_at: task.createdDate || task.created_at || task.created_date,
          completed_at: task.completedDate || task.completed_at || task.completed_date,
          checklist: task.checklist || []
        }));
        setTasks(normalizedTasks);
        
        // Calculate metrics
        const now = new Date();
        const metrics = {
          total: normalizedTasks.length,
          completed: normalizedTasks.filter((t: Task) => t.status === 'completed').length,
          inProgress: normalizedTasks.filter((t: Task) => t.status === 'in_progress').length,
          todo: normalizedTasks.filter((t: Task) => t.status === 'todo').length,
          blocked: normalizedTasks.filter((t: Task) => t.status === 'blocked').length,
          overdue: normalizedTasks.filter((t: Task) => 
            t.due_date && new Date(t.due_date) < now && t.status !== 'completed'
          ).length
        };
        setTaskMetrics(metrics);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadUsers = async () => {
    // Hardcode Jason and Almir as team members
    const hardcodedUsers = [
      { id: 1, name: 'Jason Gordon', email: 'jason@jaydus.ai' },
      { id: 2, name: 'Almir', email: 'almir@jaydus.ai' }
    ];
    
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        const apiUsers = data.users || [];
        const allUsers = [...hardcodedUsers];
        
        apiUsers.forEach((apiUser: User) => {
          if (!allUsers.find(u => u.email === apiUser.email)) {
            allUsers.push(apiUser);
          }
        });
        
        setUsers(allUsers);
      } else {
        setUsers(hardcodedUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers(hardcodedUsers);
    }
  };

  const createTask = async () => {
    if (!taskForm.title) {
      toast.error('Task title is required');
      return;
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskForm,
          project_id: taskForm.project_id && taskForm.project_id !== 'none' ? parseInt(taskForm.project_id) : null,
          assigned_to: taskForm.assigned_to && taskForm.assigned_to !== 'unassigned' ? parseInt(taskForm.assigned_to) : null,
          estimated_hours: parseFloat(taskForm.estimated_hours.toString()) || 0,
          tags: taskForm.tags.split(',').map(t => t.trim()).filter(t => t),
          checklist: taskForm.checklist
        })
      });

      if (response.ok) {
        await loadTasks();
        setShowAddTask(false);
        resetForm();
        toast.success('Task created successfully');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  const updateTask = async () => {
    if (!selectedTask || !taskForm.title) {
      toast.error('Task title is required');
      return;
    }

    try {
      const response = await fetch(`/api/tasks?id=${selectedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskForm,
          project_id: taskForm.project_id && taskForm.project_id !== 'none' ? parseInt(taskForm.project_id) : null,
          assigned_to: taskForm.assigned_to && taskForm.assigned_to !== 'unassigned' ? parseInt(taskForm.assigned_to) : null,
          estimated_hours: parseFloat(taskForm.estimated_hours.toString()) || 0,
          tags: taskForm.tags.split(',').map(t => t.trim()).filter(t => t),
          checklist: taskForm.checklist
        })
      });

      if (response.ok) {
        await loadTasks();
        setShowEditTask(false);
        setSelectedTask(null);
        resetForm();
        toast.success('Task updated successfully');
      } else {
        toast.error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const quickUpdateTask = async (taskId: string | number, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        await loadTasks();
        toast.success('Task updated');
      } else {
        toast.error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (taskId: string | number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadTasks();
        toast.success('Task deleted successfully');
      } else {
        toast.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const openEditDialog = (task: Task) => {
    setSelectedTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      project_id: task.project_id?.toString() || '',
      assigned_to: task.assigned_to?.toString() || '',
      status: task.status,
      priority: task.priority,
      estimated_hours: task.estimated_hours || 0,
      due_date: task.due_date || '',
      tags: task.tags?.join(', ') || '',
      checklist: task.checklist || []
    });
    setShowEditTask(true);
  };

  const resetForm = () => {
    setTaskForm({
      title: '',
      description: '',
      project_id: '',
      assigned_to: '',
      status: 'todo',
      priority: 'medium',
      estimated_hours: 0,
      due_date: '',
      tags: '',
      checklist: []
    });
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !task.description?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filterStatus !== 'all' && task.status !== filterStatus) return false;
      if (filterProject !== 'all' && String(task.project_id) !== filterProject) return false;
      if (filterAssignee !== 'all' && String(task.assigned_to) !== filterAssignee) return false;
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
      return true;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Timer className="h-4 w-4 text-blue-500" />;
      case 'blocked':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Flag className="h-4 w-4 text-red-500" />;
      case 'high':
        return <Flag className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Flag className="h-4 w-4 text-yellow-500" />;
      default:
        return <Flag className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { variant: "destructive" | "secondary" | "outline" | "default"; label: string }> = {
      urgent: { variant: "destructive", label: "Urgent" },
      high: { variant: "default", label: "High" },
      medium: { variant: "secondary", label: "Medium" },
      low: { variant: "outline", label: "Low" }
    };
    const config = variants[priority] || variants.medium;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "destructive" | "secondary" | "outline" | "default"; label: string }> = {
      completed: { variant: "default", label: "Completed" },
      in_progress: { variant: "secondary", label: "In Progress" },
      todo: { variant: "outline", label: "To Do" },
      blocked: { variant: "destructive", label: "Blocked" }
    };
    const config = variants[status] || variants.todo;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
    
    return (
      <Card className={`hover:shadow-md transition-all ${isOverdue ? 'border-red-200' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">{task.title}</h4>
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(task.status)}
                {getPriorityBadge(task.priority)}
                {isOverdue && <Badge variant="destructive" className="text-xs">Overdue</Badge>}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openEditDialog(task)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => quickUpdateTask(task.id, { status: 'in_progress' })}
                  disabled={task.status === 'in_progress'}
                >
                  <Timer className="h-4 w-4 mr-2" />
                  Start Progress
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => quickUpdateTask(task.id, { status: 'completed' })}
                  disabled={task.status === 'completed'}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark Complete
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => quickUpdateTask(task.id, { status: 'blocked' })}
                  disabled={task.status === 'blocked'}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Mark Blocked
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => deleteTask(task.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {task.description && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="space-y-2 text-xs">
            {task.project_name && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Hash className="h-3 w-3" />
                <span className="truncate">{task.project_name}</span>
              </div>
            )}
            
            {task.assigned_to_name && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{task.assigned_to_name}</span>
              </div>
            )}
            
            {task.due_date && (
              <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(task.due_date), 'MMM d, yyyy')}</span>
              </div>
            )}

            {task.estimated_hours > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{task.estimated_hours}h estimated</span>
              </div>
            )}

            {task.checklist && task.checklist.length > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <ListTodo className="h-3 w-3" />
                <span>
                  {task.checklist.filter(item => item.completed).length}/{task.checklist.length} completed
                </span>
              </div>
            )}
          </div>

          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {task.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const TaskForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => {
    const [localAiQuery, setLocalAiQuery] = useState('');
    const [localAiLoading, setLocalAiLoading] = useState(false);

    const handleAiGenerate = async () => {
      if (!localAiQuery.trim()) {
        toast.error('Please enter a task description');
        return;
      }

      setLocalAiLoading(true);
      try {
        const prompt = `Generate a detailed task based on this description: "${localAiQuery}". 
        Format the response as JSON with these fields:
        - title: A clear, concise task title (max 60 chars)
        - description: Detailed task description with specific requirements
        - priority: low, medium, or high based on the description
        - estimated_hours: Realistic time estimate in hours
        - tags: Array of relevant tags (max 3)
        
        Make it professional and actionable.`;

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: prompt,
            context: 'task_generation'
          })
        });

        if (!response.ok) throw new Error('Failed to generate task');
        
        const data = await response.json();
        const result = JSON.parse(data.response);
        
        setTaskForm(prev => ({
          ...prev,
          title: result.title || localAiQuery.substring(0, 60),
          description: result.description || localAiQuery,
          priority: result.priority || 'medium',
          estimated_hours: result.estimated_hours || 1,
          tags: (result.tags || []).join(', ')
        }));
        
        setLocalAiQuery('');
        toast.success('Task details generated!');
      } catch (error) {
        console.error('AI generation error:', error);
        toast.error('Failed to generate task details');
      } finally {
        setLocalAiLoading(false);
      }
    };

    return (
      <div className="space-y-4">
        {/* AI Task Generator */}
        <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="h-5 w-5 text-blue-600" />
            <Label className="text-base font-semibold text-blue-700">Generate Task with AI</Label>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Describe what needs to be done and AI will create a detailed task for you.
          </p>
          <div className="flex gap-2">
            <Input
              value={localAiQuery}
              onChange={(e) => setLocalAiQuery(e.target.value)}
              placeholder="e.g., Create landing page for new product launch"
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAiGenerate()}
            />
            <Button
              type="button"
              onClick={handleAiGenerate}
              disabled={localAiLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {localAiLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={taskForm.title}
            onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Task title"
            required
          />
        </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={taskForm.description}
          onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Task description"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="project">Project</Label>
          <Select
            value={taskForm.project_id}
            onValueChange={(value) => setTaskForm(prev => ({ ...prev, project_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Project</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.project_name || project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="assignee">Assignee</Label>
          <Select
            value={taskForm.assigned_to}
            onValueChange={(value) => setTaskForm(prev => ({ ...prev, assigned_to: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={taskForm.status}
            onValueChange={(value) => setTaskForm(prev => ({ ...prev, status: value as any }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={taskForm.priority}
            onValueChange={(value) => setTaskForm(prev => ({ ...prev, priority: value as any }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="due_date">Due Date</Label>
          <Input
            id="due_date"
            type="date"
            value={taskForm.due_date}
            onChange={(e) => setTaskForm(prev => ({ ...prev, due_date: e.target.value }))}
          />
        </div>
        
        <div>
          <Label htmlFor="estimated_hours">Estimated Hours</Label>
          <Input
            id="estimated_hours"
            type="number"
            min="0"
            step="0.5"
            value={taskForm.estimated_hours}
            onChange={(e) => setTaskForm(prev => ({ ...prev, estimated_hours: parseFloat(e.target.value) || 0 }))}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          value={taskForm.tags}
          onChange={(e) => setTaskForm(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="bug, feature, urgent"
        />
      </div>

      <div>
        <Label>Checklist</Label>
        <div className="space-y-2">
          {taskForm.checklist.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <Input
                value={item.text}
                onChange={(e) => {
                  setTaskForm(prev => {
                    const newChecklist = [...prev.checklist];
                    newChecklist[index].text = e.target.value;
                    return { ...prev, checklist: newChecklist };
                  });
                }}
                placeholder="Checklist item"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setTaskForm(prev => ({
                    ...prev,
                    checklist: prev.checklist.filter((_, i) => i !== index)
                  }));
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setTaskForm(prev => ({
                ...prev,
                checklist: [...prev.checklist, {
                  id: Date.now().toString(),
                  text: '',
                  completed: false
                }]
              }));
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Checklist Item
          </Button>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => {
          setShowAddTask(false);
          setShowEditTask(false);
          setSelectedTask(null);
          resetForm();
        }}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Task Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Tasks</CardDescription>
            <CardTitle className="text-2xl">{taskMetrics.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>To Do</CardDescription>
            <CardTitle className="text-2xl">{taskMetrics.todo}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{taskMetrics.inProgress}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-2xl text-green-600">{taskMetrics.completed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Blocked</CardDescription>
            <CardTitle className="text-2xl text-red-600">{taskMetrics.blocked}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Overdue</CardDescription>
            <CardTitle className="text-2xl text-orange-600">{taskMetrics.overdue}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Task Management</CardTitle>
            <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Add a new task to track your work
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <TaskForm onSubmit={createTask} submitLabel="Create Task" />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterProject} onValueChange={setFilterProject}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.project_name || project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
              <TabsList>
                <TabsTrigger value="board">Board</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="calendar" disabled>Calendar</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Task View */}
          {viewMode === 'board' ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* To Do Column */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Circle className="h-4 w-4 text-gray-400" />
                    To Do
                    <Badge variant="secondary">
                      {getFilteredTasks().filter(t => t.status === 'todo').length}
                    </Badge>
                  </h3>
                </div>
                <div className="space-y-3">
                  {getFilteredTasks()
                    .filter(task => task.status === 'todo')
                    .map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                </div>
              </div>

              {/* In Progress Column */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Timer className="h-4 w-4 text-blue-500" />
                    In Progress
                    <Badge variant="secondary">
                      {getFilteredTasks().filter(t => t.status === 'in_progress').length}
                    </Badge>
                  </h3>
                </div>
                <div className="space-y-3">
                  {getFilteredTasks()
                    .filter(task => task.status === 'in_progress')
                    .map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                </div>
              </div>

              {/* Blocked Column */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Blocked
                    <Badge variant="secondary">
                      {getFilteredTasks().filter(t => t.status === 'blocked').length}
                    </Badge>
                  </h3>
                </div>
                <div className="space-y-3">
                  {getFilteredTasks()
                    .filter(task => task.status === 'blocked')
                    .map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                </div>
              </div>

              {/* Completed Column */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Completed
                    <Badge variant="secondary">
                      {getFilteredTasks().filter(t => t.status === 'completed').length}
                    </Badge>
                  </h3>
                </div>
                <div className="space-y-3">
                  {getFilteredTasks()
                    .filter(task => task.status === 'completed')
                    .map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="pb-3">Task</th>
                    <th className="pb-3">Project</th>
                    <th className="pb-3">Assignee</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Priority</th>
                    <th className="pb-3">Due Date</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredTasks().map(task => {
                    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
                    
                    return (
                      <tr key={task.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">
                          <div>
                            <div className="font-medium">{task.title}</div>
                            {task.description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {task.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3">{task.project_name || '-'}</td>
                        <td className="py-3">{task.assigned_to_name || 'Unassigned'}</td>
                        <td className="py-3">{getStatusBadge(task.status)}</td>
                        <td className="py-3">{getPriorityBadge(task.priority)}</td>
                        <td className="py-3">
                          {task.due_date ? (
                            <span className={isOverdue ? 'text-red-600' : ''}>
                              {format(new Date(task.due_date), 'MMM d, yyyy')}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(task)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => deleteTask(task.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {getFilteredTasks().length === 0 && (
            <div className="text-center py-12">
              <ListTodo className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tasks found</p>
              <Button
                className="mt-4"
                onClick={() => setShowAddTask(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Task
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Task Dialog */}
      <Dialog open={showEditTask} onOpenChange={setShowEditTask}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update task details
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <TaskForm onSubmit={updateTask} submitLabel="Update Task" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskManagerV2;