import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useASCCodeGen } from "@/hooks/useASCCodeGen";
import { 
  Code, 
  Play, 
  Pause,
  Download,
  Upload,
  FolderOpen,
  FileText,
  Save,
  Plus,
  X,
  Maximize2,
  Minimize2,
  ExternalLink,
  Loader2,
  Cloud,
  Cpu,
  HardDrive,
  Zap,
  GitBranch,
  Send,
  Bot,
  Sparkles,
  FileCode,
  FileJson,
  Terminal as TerminalIcon,
  Globe,
  Package,
  Trash2,
  Command,
  FolderGit2,
  Github,
  Link,
  Settings,
  RefreshCw,
  MessageSquare,
  User,
  CheckCircle,
  AlertCircle,
  Info,
  Coffee,
  Rocket
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'stopped' | 'deploying' | 'building';
  framework: string;
  url?: string;
  files?: Record<string, string>;
  githubRepo?: string;
  isExisting?: boolean;
  deploymentStatus?: string;
  lastActivity?: string;
}

interface FileNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileNode[];
  path: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface DeploymentLog {
  id: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'warning';
  timestamp: Date;
}

const projectTemplates = {
  'react-crm': {
    name: 'React CRM',
    framework: 'react',
    description: 'Customer relationship management system',
    features: ['Contact Management', 'Sales Pipeline', 'Analytics Dashboard']
  },
  'nextjs-ecommerce': {
    name: 'Next.js E-Commerce',
    framework: 'nextjs',
    description: 'Full-featured online store',
    features: ['Product Catalog', 'Shopping Cart', 'Payment Integration']
  },
  'vue-dashboard': {
    name: 'Vue Analytics Dashboard',
    framework: 'vue',
    description: 'Data visualization and analytics',
    features: ['Real-time Charts', 'Data Export', 'Custom Reports']
  }
};

const ASCDashboardV2 = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);
  const [showConnectProject, setShowConnectProject] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to ASC.AI! I\'m here to help you build amazing applications. What would you like to create today?',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [deploymentLogs, setDeploymentLogs] = useState<DeploymentLog[]>([]);
  const [buildProgress, setBuildProgress] = useState(0);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const terminalScrollRef = useRef<HTMLDivElement>(null);
  
  const { generateCode, isGenerating } = useASCCodeGen({
    projectType: selectedProject?.framework as any,
    context: fileContent
  });

  const [newProjectForm, setNewProjectForm] = useState({
    name: '',
    client: '',
    template: 'react-crm'
  });

  const [connectProjectForm, setConnectProjectForm] = useState({
    githubUrl: '',
    projectName: '',
    client: ''
  });

  // Mock file tree for demo
  const [fileTree, setFileTree] = useState<FileNode>({
    name: 'src',
    type: 'directory',
    path: 'src',
    children: [
      {
        name: 'components',
        type: 'directory',
        path: 'src/components',
        children: [
          { name: 'App.tsx', type: 'file', path: 'src/components/App.tsx', content: '// App component' },
          { name: 'Header.tsx', type: 'file', path: 'src/components/Header.tsx', content: '// Header component' }
        ]
      },
      { name: 'index.tsx', type: 'file', path: 'src/index.tsx', content: '// Entry point' },
      { name: 'styles.css', type: 'file', path: 'src/styles.css', content: '/* Global styles */' }
    ]
  });

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const addTerminalOutput = (output: string, type: 'command' | 'output' | 'error' = 'output') => {
    const prefix = type === 'command' ? '$ ' : type === 'error' ? '❌ ' : '';
    setTerminalOutput(prev => [...prev, `${prefix}${output}`]);
  };

  const addDeploymentLog = (message: string, type: DeploymentLog['type'] = 'info') => {
    setDeploymentLogs(prev => [...prev, {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date()
    }]);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Add loading message
    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'Thinking...',
      timestamp: new Date(),
      isLoading: true
    };
    setChatMessages(prev => [...prev, loadingMessage]);

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(chatInput);
      setChatMessages(prev => 
        prev.map(msg => msg.id === loadingMessage.id 
          ? { ...msg, content: response, isLoading: false }
          : msg
        )
      );
    }, 1500);
  };

  const generateAIResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('create') || lowerInput.includes('build')) {
      return "I'll help you create that! Let me set up the project structure. Use the 'Create New Project' button above to get started, or I can guide you through the process.";
    } else if (lowerInput.includes('deploy')) {
      return "To deploy your project, click the 'Deploy' button in the terminal tab. I'll handle the build process and deploy it to Netlify for you.";
    } else if (lowerInput.includes('help')) {
      return "I can help you with:\n• Creating new projects\n• Writing code for specific features\n• Debugging issues\n• Deploying to production\n• Setting up integrations\n\nWhat would you like to work on?";
    } else {
      return "I understand you want to work on that. Let me help you implement it. Can you provide more details about what specific functionality you need?";
    }
  };

  const startProject = async (project: Project) => {
    setIsLoading(true);
    setSelectedProject(project);
    setBuildProgress(0);
    setIsBuilding(true);
    
    // Simulate build process
    addTerminalOutput('npm install', 'command');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setBuildProgress(progress);
      
      if (progress === 30) {
        addTerminalOutput('Installing dependencies...');
      } else if (progress === 60) {
        addTerminalOutput('Building project...');
      } else if (progress === 90) {
        addTerminalOutput('Starting development server...');
      } else if (progress >= 100) {
        clearInterval(interval);
        setIsBuilding(false);
        addTerminalOutput('✅ Development server running at http://localhost:3000');
        setProjects(projects.map(p => 
          p.id === project.id ? { ...p, status: 'active' } : p
        ));
        setPreviewUrl('http://localhost:3000');
        toast.success(`${project.name} is now running!`);
        setIsLoading(false);
      }
    }, 500);
  };

  const deployProject = async () => {
    if (!selectedProject) return;
    
    setIsDeploying(true);
    addDeploymentLog('Starting deployment process...', 'info');
    addTerminalOutput('npm run build', 'command');
    
    // Simulate deployment
    setTimeout(() => {
      addDeploymentLog('Building production bundle...', 'info');
      addTerminalOutput('Creating optimized production build...');
    }, 1000);
    
    setTimeout(() => {
      addDeploymentLog('Uploading to Netlify...', 'info');
      addTerminalOutput('Deploying to Netlify...');
    }, 3000);
    
    setTimeout(() => {
      addDeploymentLog('Deployment successful! 🎉', 'success');
      addTerminalOutput('✅ Deployed to https://amazing-app.netlify.app');
      setIsDeploying(false);
      toast.success('Project deployed successfully!');
    }, 5000);
  };

  const createNewProject = () => {
    const template = projectTemplates[newProjectForm.template as keyof typeof projectTemplates];
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectForm.name,
      client: newProjectForm.client,
      status: 'stopped',
      framework: template.framework,
      lastActivity: new Date().toISOString()
    };
    
    setProjects([...projects, newProject]);
    setShowNewProject(false);
    setNewProjectForm({ name: '', client: '', template: 'react-crm' });
    toast.success('Project created successfully!');
    
    // Add to chat
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Great! I've created the ${newProject.name} project for ${newProject.client}. Click "Start" to begin development.`,
      timestamp: new Date()
    }]);
  };

  const renderFileTree = (node: FileNode, level = 0): JSX.Element => {
    const isDirectory = node.type === 'directory';
    const Icon = isDirectory ? FolderOpen : FileCode;
    
    return (
      <div key={node.path} style={{ paddingLeft: `${level * 16}px` }}>
        <div
          className={cn(
            "flex items-center gap-2 py-1 px-2 hover:bg-muted rounded cursor-pointer",
            activeFile === node.path && "bg-primary/10"
          )}
          onClick={() => {
            if (!isDirectory) {
              setActiveFile(node.path);
              setFileContent(node.content || '');
            }
          }}
        >
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{node.name}</span>
        </div>
        {isDirectory && node.children?.map(child => renderFileTree(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Command className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">ASC.AI Development Platform</CardTitle>
                <CardDescription>
                  Build, test, and deploy applications with AI assistance
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowConnectProject(true)} variant="outline">
                <Link className="h-4 w-4 mr-2" />
                Connect Existing
              </Button>
              <Button onClick={() => setShowNewProject(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Projects Grid */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map(project => (
            <Card key={project.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                  </div>
                  <Badge className={cn(
                    project.status === 'active' && 'bg-green-100 text-green-800',
                    project.status === 'building' && 'bg-blue-100 text-blue-800',
                    project.status === 'deploying' && 'bg-purple-100 text-purple-800',
                    project.status === 'stopped' && 'bg-gray-100 text-gray-800'
                  )}>
                    {project.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Package className="h-3 w-3" />
                  {project.framework}
                  {project.isExisting && (
                    <>
                      <span>•</span>
                      <Github className="h-3 w-3" />
                      Connected
                    </>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {project.status === 'stopped' ? (
                    <Button
                      size="sm"
                      onClick={() => startProject(project)}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedProject(project)}
                        className="flex-1"
                      >
                        <Code className="h-4 w-4 mr-1" />
                        Open
                      </Button>
                      {project.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(previewUrl || '#', '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Main Development Environment */}
      {selectedProject && (
        <Card className={cn(
          "transition-all",
          isFullscreen && "fixed inset-4 z-50"
        )}>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CardTitle>{selectedProject.name}</CardTitle>
                <Badge variant="outline" className="text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  {selectedProject.status}
                </Badge>
                {isBuilding && (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm text-muted-foreground">Building... {buildProgress}%</span>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
            {isBuilding && (
              <Progress value={buildProgress} className="mt-2" />
            )}
          </CardHeader>
          
          <CardContent className="p-0">
            <Tabs defaultValue="editor" className="h-[600px]">
              <TabsList className="w-full justify-start rounded-none border-b px-4">
                <TabsTrigger value="editor">
                  <Code className="h-4 w-4 mr-2" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="terminal">
                  <TerminalIcon className="h-4 w-4 mr-2" />
                  Terminal
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <Globe className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="ai-chat">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  AI Assistant
                </TabsTrigger>
                <TabsTrigger value="deploy">
                  <Rocket className="h-4 w-4 mr-2" />
                  Deploy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="h-full p-0">
                <div className="grid grid-cols-4 h-full">
                  {/* File Explorer */}
                  <div className="col-span-1 border-r p-4 overflow-y-auto bg-muted/30">
                    <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <FolderGit2 className="h-4 w-4" />
                      Files
                    </h3>
                    {renderFileTree(fileTree)}
                  </div>
                  
                  {/* Code Editor */}
                  <div className="col-span-3">
                    {activeFile ? (
                      <div className="h-full flex flex-col">
                        <div className="border-b px-4 py-2 flex items-center justify-between bg-muted/30">
                          <span className="text-sm font-medium flex items-center gap-2">
                            <FileCode className="h-4 w-4" />
                            {activeFile}
                          </span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Save className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Textarea
                          value={fileContent}
                          onChange={(e) => setFileContent(e.target.value)}
                          className="flex-1 font-mono text-sm border-0 focus:ring-0 resize-none p-4"
                          placeholder="// Start coding..."
                        />
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Select a file to edit</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="terminal" className="h-full p-0">
                <div className="h-full flex flex-col bg-gray-900">
                  <div className="border-b border-gray-800 px-4 py-2 flex items-center justify-between">
                    <span className="text-sm text-gray-300 font-medium">Terminal</span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-gray-300 hover:text-white"
                        onClick={() => setTerminalOutput([])}
                      >
                        Clear
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-gray-300 hover:text-white"
                        onClick={deployProject}
                        disabled={isDeploying}
                      >
                        {isDeploying ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Rocket className="h-4 w-4" />
                        )}
                        Deploy
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="flex-1 p-4" ref={terminalScrollRef}>
                    <div className="font-mono text-sm text-gray-300">
                      {terminalOutput.map((line, i) => (
                        <div key={i} className="mb-1">{line}</div>
                      ))}
                      {terminalOutput.length === 0 && (
                        <div className="text-gray-500">
                          $ Type 'asc help' to see available commands
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  <div className="border-t border-gray-800 p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 font-mono">$</span>
                      <Input
                        className="flex-1 bg-transparent border-0 text-gray-300 font-mono text-sm focus:ring-0"
                        placeholder="Enter command..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const command = e.currentTarget.value;
                            addTerminalOutput(command, 'command');
                            addTerminalOutput('Command executed successfully');
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="h-full p-0">
                <div className="h-full">
                  <div className="border-b px-4 py-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Preview</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        <Globe className="h-3 w-3 mr-1" />
                        localhost:3000
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(previewUrl || '#', '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {selectedProject.status === 'active' ? (
                    <iframe
                      src={previewUrl || ''}
                      className="w-full h-full"
                      title="Preview"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-muted/30">
                      <div className="text-center">
                        <Coffee className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Start the project to see preview</p>
                        <Button
                          className="mt-4"
                          onClick={() => startProject(selectedProject)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Development Server
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="ai-chat" className="h-full p-0">
                <div className="h-full flex flex-col">
                  <div className="border-b px-4 py-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Bot className="h-4 w-4 text-primary" />
                      ASC.AI Assistant
                    </h3>
                  </div>
                  
                  <ScrollArea className="flex-1 p-4" ref={chatScrollRef}>
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex gap-3",
                            message.role === 'user' && "justify-end"
                          )}
                        >
                          {message.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Bot className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          <div
                            className={cn(
                              "max-w-[80%] rounded-lg px-4 py-2",
                              message.role === 'user' 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-muted"
                            )}
                          >
                            {message.isLoading ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Thinking...</span>
                              </div>
                            ) : (
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            )}
                          </div>
                          {message.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <User className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <form onSubmit={handleChatSubmit} className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask ASC.AI anything..."
                        className="flex-1"
                      />
                      <Button type="submit" disabled={!chatInput.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="deploy" className="h-full p-0">
                <div className="p-6">
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="text-center">
                      <Rocket className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Deploy to Production</h3>
                      <p className="text-sm text-muted-foreground">
                        Deploy your application to Netlify with one click
                      </p>
                    </div>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Deployment Target</span>
                            <Badge>Netlify</Badge>
                          </div>
                          <Separator />
                          <div className="space-y-2">
                            <Label>Production URL</Label>
                            <Input 
                              value={`${selectedProject.name.toLowerCase().replace(/\s+/g, '-')}.netlify.app`}
                              readOnly
                            />
                          </div>
                          
                          <Button 
                            className="w-full" 
                            size="lg"
                            onClick={deployProject}
                            disabled={isDeploying}
                          >
                            {isDeploying ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deploying...
                              </>
                            ) : (
                              <>
                                <Rocket className="h-4 w-4 mr-2" />
                                Deploy Now
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {deploymentLogs.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Deployment Logs</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-48">
                            <div className="space-y-2">
                              {deploymentLogs.map((log) => (
                                <div key={log.id} className="flex items-start gap-2 text-sm">
                                  {log.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />}
                                  {log.type === 'error' && <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />}
                                  {log.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />}
                                  {log.type === 'info' && <Info className="h-4 w-4 text-blue-600 mt-0.5" />}
                                  <span className="flex-1">{log.message}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {log.timestamp.toLocaleTimeString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {projects.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Welcome to ASC.AI</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
              Start building amazing applications with AI assistance. Create a new project or connect an existing repository to get started.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowConnectProject(true)}>
                <Link className="h-4 w-4 mr-2" />
                Connect Repository
              </Button>
              <Button onClick={() => setShowNewProject(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Project
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Project Dialog */}
      <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Set up a new AI-powered development project
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Project Name</Label>
              <Input
                value={newProjectForm.name}
                onChange={(e) => setNewProjectForm({ ...newProjectForm, name: e.target.value })}
                placeholder="My Awesome App"
              />
            </div>
            <div>
              <Label>Client Name</Label>
              <Input
                value={newProjectForm.client}
                onChange={(e) => setNewProjectForm({ ...newProjectForm, client: e.target.value })}
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <Label>Template</Label>
              <Select 
                value={newProjectForm.template} 
                onValueChange={(value) => setNewProjectForm({ ...newProjectForm, template: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(projectTemplates).map(([key, template]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex flex-col">
                        <span>{template.name}</span>
                        <span className="text-xs text-muted-foreground">{template.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewProject(false)}>
                Cancel
              </Button>
              <Button onClick={createNewProject}>
                Create Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Connect Project Dialog */}
      <Dialog open={showConnectProject} onOpenChange={setShowConnectProject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Existing Project</DialogTitle>
            <DialogDescription>
              Connect a GitHub repository to ASC.AI
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>GitHub Repository URL</Label>
              <Input
                value={connectProjectForm.githubUrl}
                onChange={(e) => setConnectProjectForm({ ...connectProjectForm, githubUrl: e.target.value })}
                placeholder="https://github.com/username/repo"
              />
            </div>
            <div>
              <Label>Project Name</Label>
              <Input
                value={connectProjectForm.projectName}
                onChange={(e) => setConnectProjectForm({ ...connectProjectForm, projectName: e.target.value })}
                placeholder="My Project"
              />
            </div>
            <div>
              <Label>Client Name</Label>
              <Input
                value={connectProjectForm.client}
                onChange={(e) => setConnectProjectForm({ ...connectProjectForm, client: e.target.value })}
                placeholder="Client Name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowConnectProject(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast.success('Repository connected successfully!');
                setShowConnectProject(false);
              }}>
                <Github className="h-4 w-4 mr-2" />
                Connect Repository
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ASCDashboardV2;