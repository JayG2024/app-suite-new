import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ASCTerminal from "./ASCTerminal";
import ASCCommand from "./ASCCommand";
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
  RefreshCw
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'stopped';
  framework: string;
  url?: string;
  files?: Record<string, string>;
  githubRepo?: string;
  isExisting?: boolean;
}

interface FileNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileNode[];
  path: string;
}

const ASCDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);
  const [showConnectProject, setShowConnectProject] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<FileNode>({ 
    name: 'root', 
    type: 'directory', 
    children: [], 
    path: '' 
  });
  
  const { generateCode, isGenerating } = useASCCodeGen({
    projectType: selectedProject?.framework as any,
    context: fileContent
  });

  const [newProjectForm, setNewProjectForm] = useState({
    name: '',
    client: '',
    type: 'new'
  });

  const [connectProjectForm, setConnectProjectForm] = useState({
    name: '',
    client: '',
    githubUrl: '',
    localPath: ''
  });

  // Load saved projects
  useEffect(() => {
    const savedProjects = localStorage.getItem('asc_projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // Save projects to localStorage
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('asc_projects', JSON.stringify(projects));
    }
  }, [projects]);

  // Build file tree from project files
  useEffect(() => {
    if (selectedProject?.files) {
      const tree = buildFileTree(selectedProject.files);
      setFileTree(tree);
    }
  }, [selectedProject]);

  const buildFileTree = (files: Record<string, string>): FileNode => {
    const root: FileNode = { name: 'root', type: 'directory', children: [], path: '' };
    
    Object.entries(files).forEach(([path, content]) => {
      const parts = path.split('/');
      let current = root;
      
      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        const currentPath = parts.slice(0, index + 1).join('/');
        
        if (isFile) {
          if (!current.children) current.children = [];
          current.children.push({
            name: part,
            type: 'file',
            content,
            path: currentPath
          });
        } else {
          if (!current.children) current.children = [];
          let dir = current.children.find(child => child.name === part && child.type === 'directory');
          if (!dir) {
            dir = { name: part, type: 'directory', children: [], path: currentPath };
            current.children.push(dir);
          }
          current = dir;
        }
      });
    });
    
    return root;
  };

  const startProject = async (project: Project) => {
    setIsLoading(true);
    setSelectedProject(project);
    
    // Update project status
    setProjects(projects.map(p => 
      p.id === project.id ? { ...p, status: 'active' } : p
    ));
    
    setIsLoading(false);
    toast.success(`${project.name} is now running in ASC.AI!`);
  };

  const stopProject = (project: Project) => {
    setProjects(projects.map(p => 
      p.id === project.id ? { ...p, status: 'stopped' } : p
    ));
    setSelectedProject(null);
    setPreviewUrl(null);
    toast.info(`${project.name} stopped`);
  };

  const createNewProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectForm.name,
      client: newProjectForm.client,
      status: 'stopped',
      framework: 'react',
      files: {
        'package.json': JSON.stringify({
          name: newProjectForm.name.toLowerCase().replace(/\s+/g, '-'),
          version: '1.0.0',
          scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview'
          }
        }, null, 2)
      }
    };
    
    setProjects([...projects, newProject]);
    setShowNewProject(false);
    setNewProjectForm({ name: '', client: '', type: 'new' });
    toast.success('New project created in ASC.AI!');
  };

  const connectExistingProject = () => {
    const connectedProject: Project = {
      id: Date.now().toString(),
      name: connectProjectForm.name,
      client: connectProjectForm.client,
      status: 'stopped',
      framework: 'react', // Will be detected from package.json
      githubRepo: connectProjectForm.githubUrl,
      isExisting: true
    };
    
    setProjects([...projects, connectedProject]);
    setShowConnectProject(false);
    setConnectProjectForm({ name: '', client: '', githubUrl: '', localPath: '' });
    toast.success('Existing project connected to ASC.AI!');
  };

  const deleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
    toast.success('Project removed from ASC.AI');
  };

  const handleASCCommand = async (command: string) => {
    if (!command.trim()) return;
    
    // Process ASC commands
    if (command.startsWith('asc ')) {
      const result = await generateCode(command);
      
      if (result && selectedProject && activeFile) {
        setFileContent(result.code);
        toast.success('ASC.AI generated code! Review and save when ready.');
      }
    }
    
    return command;
  };

  const renderFileTree = (node: FileNode): JSX.Element => {
    if (node.type === 'directory') {
      return (
        <div key={node.path} className="space-y-1">
          <div className="flex items-center gap-2 py-1 px-2 hover:bg-green-900/20 rounded cursor-pointer">
            <FolderOpen className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-400">{node.name}</span>
          </div>
          <div className="ml-4">
            {node.children?.map(child => renderFileTree(child))}
          </div>
        </div>
      );
    }
    
    const getFileIcon = (filename: string) => {
      if (filename.endsWith('.json')) return <FileJson className="h-4 w-4 text-yellow-500" />;
      if (filename.endsWith('.jsx') || filename.endsWith('.tsx')) return <Code className="h-4 w-4 text-blue-500" />;
      if (filename.endsWith('.css')) return <FileCode className="h-4 w-4 text-pink-500" />;
      return <FileText className="h-4 w-4 text-gray-500" />;
    };
    
    return (
      <div
        key={node.path}
        className={cn(
          "flex items-center gap-2 py-1 px-2 hover:bg-green-900/20 rounded cursor-pointer",
          activeFile === node.path && "bg-green-900/30"
        )}
        onClick={() => {
          setActiveFile(node.path);
          setFileContent(node.content || '');
        }}
      >
        {getFileIcon(node.name)}
        <span className="text-sm text-green-400">{node.name}</span>
      </div>
    );
  };

  const saveFile = () => {
    if (!selectedProject || !activeFile) return;
    
    const updatedFiles = { ...selectedProject.files, [activeFile]: fileContent };
    const updatedProject = { ...selectedProject, files: updatedFiles };
    
    setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
    
    toast.success('File saved in ASC.AI!');
  };

  return (
    <div className="space-y-6 bg-black/5">
      {/* Header */}
      <Card className="bg-black/95 border-green-900/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <Command className="h-8 w-8 text-green-500" />
                <Sparkles className="h-5 w-5 text-green-400 -ml-2" />
              </div>
              <div>
                <CardTitle className="text-2xl text-green-400">ASC.AI Development Environment</CardTitle>
                <CardDescription className="text-green-400/60">
                  App Suite Code - AI-Powered Development Platform (Internal Tool)
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="border-green-900/30 text-green-400 hover:bg-green-900/20"
                onClick={() => setShowConnectProject(true)}
              >
                <FolderGit2 className="h-4 w-4 mr-2" />
                Connect Existing
              </Button>
              <Button 
                className="bg-green-900/20 text-green-400 hover:bg-green-900/30"
                onClick={() => setShowNewProject(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map(project => (
          <Card key={project.id} className="bg-black/95 border-green-900/20">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-green-400">{project.name}</h3>
                  <p className="text-sm text-green-400/60">{project.client}</p>
                  {project.isExisting && (
                    <Badge variant="outline" className="mt-2 text-green-500 border-green-500/50">
                      <FolderGit2 className="h-3 w-3 mr-1" />
                      Existing Project
                    </Badge>
                  )}
                </div>
                <Badge className={project.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-gray-900/50 text-gray-400'}>
                  {project.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                {project.status === 'stopped' ? (
                  <Button
                    size="sm"
                    className="bg-green-900/20 text-green-400 hover:bg-green-900/30"
                    onClick={() => startProject(project)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    Start
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-900/30 text-green-400"
                      onClick={() => stopProject(project)}
                    >
                      <Pause className="h-4 w-4" />
                      Stop
                    </Button>
                    {previewUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-900/30 text-green-400"
                        onClick={() => window.open(previewUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Preview
                      </Button>
                    )}
                  </>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300"
                  onClick={() => deleteProject(project.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Development Environment */}
      {selectedProject && (
        <Card className={cn(
          "bg-black/95 border-green-900/20 transition-all",
          isFullscreen && "fixed inset-4 z-50"
        )}>
          <CardHeader className="border-b border-green-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CardTitle className="text-green-400">ASC.AI Editor</CardTitle>
                <Badge className="bg-green-900/30 text-green-400">{selectedProject.name}</Badge>
                <Badge variant="outline" className="text-green-500 border-green-500/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  Active
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-green-900/30 text-green-400"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="editor" className="h-[600px]">
              <TabsList className="bg-green-950/20 border-b border-green-900/20 rounded-none">
                <TabsTrigger value="editor" className="data-[state=active]:bg-green-900/20">
                  <Code className="h-4 w-4 mr-2" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="terminal" className="data-[state=active]:bg-green-900/20">
                  <TerminalIcon className="h-4 w-4 mr-2" />
                  Terminal
                </TabsTrigger>
                <TabsTrigger value="asc" className="data-[state=active]:bg-green-900/20">
                  <Command className="h-4 w-4 mr-2" />
                  ASC Commands
                </TabsTrigger>
                <TabsTrigger value="preview" className="data-[state=active]:bg-green-900/20">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="h-full p-0">
                <div className="grid grid-cols-4 gap-0 h-full">
                  {/* File Explorer */}
                  <div className="col-span-1 border-r border-green-900/20 p-4 overflow-y-auto bg-black/50">
                    <h3 className="font-medium text-sm mb-3 text-green-400">File Explorer</h3>
                    {fileTree.children?.map(child => renderFileTree(child))}
                  </div>
                  
                  {/* Code Editor */}
                  <div className="col-span-3 bg-black/30">
                    {activeFile ? (
                      <div className="h-full flex flex-col">
                        <div className="border-b border-green-900/20 px-4 py-2 flex items-center justify-between bg-black/50">
                          <span className="text-sm font-medium text-green-400">{activeFile}</span>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-green-900/30 text-green-400"
                            onClick={saveFile}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                        <Textarea
                          value={fileContent}
                          onChange={(e) => setFileContent(e.target.value)}
                          className="flex-1 font-mono text-sm border-0 focus:ring-0 resize-none bg-black/50 text-green-300"
                          placeholder="Start coding..."
                        />
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-green-400/60">
                        Select a file to edit
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="terminal" className="h-full p-0">
                <ASCTerminal
                  projectId={selectedProject.id}
                  files={selectedProject.files}
                  existingProjectPath={selectedProject.githubRepo}
                  onReady={() => {
                    console.log('ASC.AI Terminal ready for:', selectedProject.name);
                  }}
                  className="h-full"
                />
              </TabsContent>

              <TabsContent value="asc" className="h-full p-0">
                <ASCCommand
                  onExecute={handleASCCommand}
                  currentProject={selectedProject}
                  isProcessing={isGenerating}
                />
              </TabsContent>

              <TabsContent value="preview" className="h-full p-0">
                <div className="h-full bg-black/50">
                  <div className="border-b border-green-900/20 px-4 py-2 flex items-center justify-between">
                    <span className="text-sm text-green-400">Preview - Development Server</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-500 border-green-500/50">
                        <Globe className="h-3 w-3 mr-1" />
                        Port 3000
                      </Badge>
                    </div>
                  </div>
                  <div className="h-[500px] bg-black/30 flex items-center justify-center">
                    <div className="text-center">
                      <Cloud className="h-12 w-12 text-green-900/50 mx-auto mb-4" />
                      <p className="text-green-400/80">Run `npm run dev` in terminal to start preview</p>
                      <p className="text-sm text-green-400/60 mt-2">
                        Your app will appear here once the dev server starts
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/95 border-green-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Cpu className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium text-green-400">ASC.AI Powered</p>
                <p className="text-sm text-green-400/60">
                  AI code generation engine
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/95 border-green-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="font-medium text-green-400">Instant Deploy</p>
                <p className="text-sm text-green-400/60">
                  Deploy to Netlify/Vercel
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/95 border-green-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <GitBranch className="h-8 w-8 text-purple-500" />
              <div>
                <p className="font-medium text-green-400">Git Integrated</p>
                <p className="text-sm text-green-400/60">
                  Connect existing projects
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Project Dialog */}
      <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
        <DialogContent className="bg-black/95 border-green-900/20">
          <DialogHeader>
            <DialogTitle className="text-green-400">Create New ASC.AI Project</DialogTitle>
            <DialogDescription className="text-green-400/60">
              Start a new project from scratch
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-green-400">Project Name</Label>
              <Input
                value={newProjectForm.name}
                onChange={(e) => setNewProjectForm({ ...newProjectForm, name: e.target.value })}
                placeholder="My Awesome App"
                className="bg-black/50 border-green-900/30 text-green-300"
              />
            </div>
            <div>
              <Label className="text-green-400">Client Name</Label>
              <Input
                value={newProjectForm.client}
                onChange={(e) => setNewProjectForm({ ...newProjectForm, client: e.target.value })}
                placeholder="Acme Corp"
                className="bg-black/50 border-green-900/30 text-green-300"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowNewProject(false)}
                className="border-green-900/30 text-green-400"
              >
                Cancel
              </Button>
              <Button 
                onClick={createNewProject}
                className="bg-green-900/20 text-green-400 hover:bg-green-900/30"
              >
                Create Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Connect Existing Project Dialog */}
      <Dialog open={showConnectProject} onOpenChange={setShowConnectProject}>
        <DialogContent className="bg-black/95 border-green-900/20">
          <DialogHeader>
            <DialogTitle className="text-green-400">Connect Existing Project</DialogTitle>
            <DialogDescription className="text-green-400/60">
              Connect a GitHub repository or local project to ASC.AI
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-green-400">Project Name</Label>
              <Input
                value={connectProjectForm.name}
                onChange={(e) => setConnectProjectForm({ ...connectProjectForm, name: e.target.value })}
                placeholder="Existing Project"
                className="bg-black/50 border-green-900/30 text-green-300"
              />
            </div>
            <div>
              <Label className="text-green-400">Client Name</Label>
              <Input
                value={connectProjectForm.client}
                onChange={(e) => setConnectProjectForm({ ...connectProjectForm, client: e.target.value })}
                placeholder="Client Name"
                className="bg-black/50 border-green-900/30 text-green-300"
              />
            </div>
            <div>
              <Label className="text-green-400">GitHub Repository URL</Label>
              <Input
                value={connectProjectForm.githubUrl}
                onChange={(e) => setConnectProjectForm({ ...connectProjectForm, githubUrl: e.target.value })}
                placeholder="https://github.com/username/repo"
                className="bg-black/50 border-green-900/30 text-green-300"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowConnectProject(false)}
                className="border-green-900/30 text-green-400"
              >
                Cancel
              </Button>
              <Button 
                onClick={connectExistingProject}
                className="bg-green-900/20 text-green-400 hover:bg-green-900/30"
              >
                Connect Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ASCDashboard;