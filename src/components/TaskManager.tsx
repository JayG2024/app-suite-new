import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  Plus,
  Calendar,
  User,
  Hash,
  Filter,
  Trash2,
  Edit3,
  CheckCircle2,
  Circle,
  Timer,
  Target
} from "lucide-react";

interface Task {
  id: string | number;
  title: string;
  description: string;
  project_id: number | string | null;
  project_name?: string;
  projectName?: string;
  assigned_to: number | string | null;
  assignedTo?: number | string | null;
  assigned_to_name?: string;
  assignedToName?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  estimated_hours: number;
  estimatedHours?: number;
  actual_hours: number;
  actualHours?: number;
  due_date: string | null;
  dueDate?: string | null;
  tags: string | string[];
  created_at?: string;
  createdDate?: string;
  completed_at?: string | null;
  completedDate?: string | null;
}

interface Project {
  id: number;
  name: string;
  project_name?: string;
}

interface User {
  id: number;
  name: string;
}

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskMetrics, setTaskMetrics] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    project_id: '',
    assigned_to: '',
    status: 'todo' as const,
    priority: 'medium' as const,
    estimated_hours: 0,
    due_date: '',
    tags: ''
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
        // Normalize task data from API to match component interface
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
          completed_at: task.completedDate || task.completed_at || task.completed_date
        }));
        setTasks(normalizedTasks);
        
        // Calculate metrics
        const metrics = {
          total: normalizedTasks.length,
          completed: normalizedTasks.filter((t: Task) => t.status === 'completed').length,
          inProgress: normalizedTasks.filter((t: Task) => t.status === 'in_progress').length,
          todo: normalizedTasks.filter((t: Task) => t.status === 'todo').length,
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
      const response = await fetch('/api/projects-db');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const createTask = async () => {
    if (!newTask.title) {
      toast.error('Task title is required');
      return;
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTask,
          project_id: newTask.project_id && newTask.project_id !== 'none' ? parseInt(newTask.project_id) : null,
          assigned_to: newTask.assigned_to && newTask.assigned_to !== 'unassigned' ? parseInt(newTask.assigned_to) : null,
          estimated_hours: parseFloat(newTask.estimated_hours.toString()) || 0,
          tags: newTask.tags.split(',').map(t => t.trim()).filter(t => t)
        })
      });

      if (response.ok) {
        await loadTasks();
        setShowAddTask(false);
        setNewTask({
          title: '',
          description: '',
          project_id: '',
          assigned_to: '',
          status: 'todo',
          priority: 'medium',
          estimated_hours: 0,
          due_date: '',
          tags: ''
        });
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

  const updateTask = async (taskId: string | number, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        await loadTasks();
        toast.success('Task updated successfully');
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

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      if (filterStatus !== 'all' && task.status !== filterStatus) return false;
      if (filterProject !== 'all' && String(task.project_id) !== filterProject) return false;
      if (filterAssignee !== 'all' && String(task.assigned_to) !== filterAssignee) return false;
      return true;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Timer className="h-4 w-4 text-blue-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { variant: "destructive" | "secondary" | "outline"; label: string }> = {
      high: { variant: "destructive", label: "High" },
      medium: { variant: "secondary", label: "Medium" },
      low: { variant: "outline", label: "Low" }
    };
    const config = variants[priority] || variants.medium;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-sm">{task.title}</h4>
          <div className="flex items-center gap-2">
            {getPriorityBadge(task.priority)}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(task.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {task.description && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="space-y-1 text-xs">
          {task.project_name && (
            <div className="flex items-center gap-1">
              <Hash className="h-3 w-3" />
              <span>{task.project_name}</span>
            </div>
          )}
          
          {task.assigned_to_name && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{task.assigned_to_name}</span>
            </div>
          )}
          
          {task.due_date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(task.due_date).toLocaleDateString()}</span>
            </div>
          )}

          {task.estimated_hours > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{task.estimated_hours}h estimated</span>
            </div>
          )}
        </div>

        {Array.isArray(task.tags) && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p>Loading tasks...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Task Management</h2>
          <p className="text-muted-foreground">
            Track and manage all project tasks
          </p>
        </div>
        
        <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task to track your work
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project">Project</Label>
                  <Select
                    value={newTask.project_id}
                    onValueChange={(value) => setNewTask({ ...newTask, project_id: value })}
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
                    value={newTask.assigned_to}
                    onValueChange={(value) => setNewTask({ ...newTask, assigned_to: value })}
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
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setNewTask({ ...newTask, priority: value })
                    }
                  >
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
                  <Label htmlFor="estimated_hours">Estimated Hours</Label>
                  <Input
                    id="estimated_hours"
                    type="number"
                    value={newTask.estimated_hours}
                    onChange={(e) => setNewTask({ 
                      ...newTask, 
                      estimated_hours: parseInt(e.target.value) || 0 
                    })}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={newTask.tags}
                  onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                  placeholder="bug, feature, urgent"
                />
              </div>
              
              <Button onClick={createTask} className="w-full">
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{taskMetrics.total}</p>
              </div>
              <CheckSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">To Do</p>
                <p className="text-2xl font-bold">{taskMetrics.todo}</p>
              </div>
              <Circle className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{taskMetrics.inProgress}</p>
              </div>
              <Timer className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{taskMetrics.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            {taskMetrics.total > 0 && (
              <Progress 
                value={(taskMetrics.completed / taskMetrics.total) * 100} 
                className="mt-2"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
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
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'board' | 'list')}>
              <TabsList>
                <TabsTrigger value="board">Board</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Task View */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <div
                    key={task.id}
                    onClick={() => updateTask(task.id, { status: 'in_progress' })}
                  >
                    <TaskCard task={task} />
                  </div>
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
                  <div
                    key={task.id}
                    onClick={() => updateTask(task.id, { status: 'completed' })}
                  >
                    <TaskCard task={task} />
                  </div>
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
                  <div key={task.id}>
                    <TaskCard task={task} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4">Status</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Project</th>
                  <th className="p-4">Assignee</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredTasks().map(task => (
                  <tr key={task.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">{getStatusIcon(task.status)}</td>
                    <td className="p-4 font-medium">{task.title}</td>
                    <td className="p-4">{task.project_name || '-'}</td>
                    <td className="p-4">{task.assigned_to_name || 'Unassigned'}</td>
                    <td className="p-4">{getPriorityBadge(task.priority)}</td>
                    <td className="p-4">
                      {task.due_date 
                        ? new Date(task.due_date).toLocaleDateString() 
                        : '-'}
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskManager;