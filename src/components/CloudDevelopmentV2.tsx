import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import WebContainerTerminal from "./WebContainerTerminal";
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
  Trash2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useClaudeCodeGen, codeTemplates } from "@/hooks/useClaudeCodeGen";

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'stopped';
  framework: string;
  url?: string;
  files?: Record<string, string>;
}

interface FileNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileNode[];
  path: string;
}

const projectTemplates = {
  'react-crm': {
    name: 'React CRM',
    framework: 'react',
    files: {
      'package.json': JSON.stringify({
        "name": "react-crm",
        "version": "1.0.0",
        "type": "module",
        "scripts": {
          "dev": "vite",
          "build": "vite build",
          "preview": "vite preview"
        },
        "dependencies": {
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "react-router-dom": "^6.22.0",
          "axios": "^1.6.7"
        },
        "devDependencies": {
          "@types/react": "^18.2.56",
          "@types/react-dom": "^18.2.19",
          "@vitejs/plugin-react": "^4.2.1",
          "vite": "^5.1.0"
        }
      }, null, 2),
      'vite.config.js': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
});`,
      'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React CRM</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,
      'src/main.jsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      'src/App.jsx': `import React, { useState } from 'react';
import './App.css';

function App() {
  const [customers, setCustomers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Pending' }
  ]);

  return (
    <div className="app">
      <header className="header">
        <h1>CRM Dashboard</h1>
      </header>
      <main className="main">
        <div className="card">
          <h2>Customers</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>
                    <span className={\`status \${customer.status.toLowerCase()}\`}>
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;`,
      'src/index.css': `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
  color: #333;
}

.app {
  min-height: 100vh;
}

.header {
  background: #2563eb;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
  font-weight: 600;
}

td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status.active {
  background: #10b981;
  color: white;
}

.status.pending {
  background: #f59e0b;
  color: white;
}`,
      'src/App.css': `/* Component-specific styles */`
    }
  },
  'nextjs-analytics': {
    name: 'Next.js Analytics',
    framework: 'nextjs',
    files: {
      'package.json': JSON.stringify({
        "name": "nextjs-analytics",
        "version": "1.0.0",
        "scripts": {
          "dev": "next dev",
          "build": "next build",
          "start": "next start"
        },
        "dependencies": {
          "next": "14.1.0",
          "react": "^18.2.0",
          "react-dom": "^18.2.0"
        }
      }, null, 2),
      'app/page.tsx': `export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
      <p className="mt-4">AI-powered analytics for your business</p>
    </main>
  );
}`,
      'app/layout.tsx': `export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`
    }
  }
};

const CloudDevelopmentV2 = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'PPOK CRM',
      client: 'PPOK Pharmacy',
      status: 'stopped',
      framework: 'react',
      files: projectTemplates['react-crm'].files
    }
  ]);
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const { generateCode, isGenerating, lastResult } = useClaudeCodeGen({
    projectType: selectedProject?.framework as any,
    context: fileContent
  });
  const [showNewProject, setShowNewProject] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<FileNode>({ 
    name: 'root', 
    type: 'directory', 
    children: [], 
    path: '' 
  });
  
  const [newProjectForm, setNewProjectForm] = useState({
    name: '',
    client: '',
    template: 'react-crm'
  });

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
    toast.success(`${project.name} is now running!`);
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
    const template = projectTemplates[newProjectForm.template as keyof typeof projectTemplates];
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectForm.name,
      client: newProjectForm.client,
      status: 'stopped',
      framework: template.framework,
      files: template.files
    };
    
    setProjects([...projects, newProject]);
    setShowNewProject(false);
    setNewProjectForm({ name: '', client: '', template: 'react-crm' });
    toast.success('Project created successfully!');
  };

  const deleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
    toast.success('Project deleted');
  };

  const renderFileTree = (node: FileNode): JSX.Element => {
    if (node.type === 'directory') {
      return (
        <div key={node.path} className="space-y-1">
          <div className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 rounded cursor-pointer">
            <FolderOpen className="h-4 w-4 text-blue-600" />
            <span className="text-sm">{node.name}</span>
          </div>
          <div className="ml-4">
            {node.children?.map(child => renderFileTree(child))}
          </div>
        </div>
      );
    }
    
    const getFileIcon = (filename: string) => {
      if (filename.endsWith('.json')) return <FileJson className="h-4 w-4 text-yellow-600" />;
      if (filename.endsWith('.jsx') || filename.endsWith('.tsx')) return <Code className="h-4 w-4 text-blue-600" />;
      if (filename.endsWith('.css')) return <FileCode className="h-4 w-4 text-pink-600" />;
      return <FileText className="h-4 w-4 text-gray-600" />;
    };
    
    return (
      <div
        key={node.path}
        className={cn(
          "flex items-center gap-2 py-1 px-2 hover:bg-gray-100 rounded cursor-pointer",
          activeFile === node.path && "bg-blue-100"
        )}
        onClick={() => {
          setActiveFile(node.path);
          setFileContent(node.content || '');
        }}
      >
        {getFileIcon(node.name)}
        <span className="text-sm">{node.name}</span>
      </div>
    );
  };

  const saveFile = () => {
    if (!selectedProject || !activeFile) return;
    
    const updatedFiles = { ...selectedProject.files, [activeFile]: fileContent };
    const updatedProject = { ...selectedProject, files: updatedFiles };
    
    setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
    
    toast.success('File saved!');
  };

  const handleAiCommand = async () => {
    if (!aiPrompt.trim()) return;
    
    const result = await generateCode(aiPrompt);
    
    if (result && selectedProject && activeFile) {
      setFileContent(result.code);
      toast.success('AI generated code! Review and save when ready.');
    }
    
    setAiPrompt('');
  };

  return (
    <div className="space-y-6">
      {/* Project Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Cloud Development Environment</CardTitle>
              <CardDescription>
                Build and deploy client projects directly from your browser
              </CardDescription>
            </div>
            <Button onClick={() => setShowNewProject(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map(project => (
              <Card key={project.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.client}</p>
                    </div>
                    <Badge className={project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4">
                    {project.status === 'stopped' ? (
                      <Button
                        size="sm"
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
                          onClick={() => stopProject(project)}
                        >
                          <Pause className="h-4 w-4" />
                          Stop
                        </Button>
                        {previewUrl && (
                          <Button
                            size="sm"
                            variant="outline"
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
                      onClick={() => deleteProject(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Development Environment */}
      {selectedProject && (
        <Card className={cn(
          "transition-all",
          isFullscreen && "fixed inset-4 z-50"
        )}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CardTitle>Development Environment</CardTitle>
                <Badge>{selectedProject.name}</Badge>
                <Badge variant="outline" className="text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  Running
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="editor" className="h-[600px]">
              <TabsList>
                <TabsTrigger value="editor">
                  <Code className="h-4 w-4 mr-2" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="terminal">
                  <TerminalIcon className="h-4 w-4 mr-2" />
                  Terminal
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="ai">
                  <Bot className="h-4 w-4 mr-2" />
                  AI Assistant
                </TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="h-full">
                <div className="grid grid-cols-4 gap-4 h-full">
                  {/* File Explorer */}
                  <div className="col-span-1 border rounded-lg p-4 overflow-y-auto">
                    <h3 className="font-medium text-sm mb-3">File Explorer</h3>
                    {fileTree.children?.map(child => renderFileTree(child))}
                  </div>
                  
                  {/* Code Editor */}
                  <div className="col-span-3 border rounded-lg">
                    {activeFile ? (
                      <div className="h-full flex flex-col">
                        <div className="border-b px-4 py-2 flex items-center justify-between">
                          <span className="text-sm font-medium">{activeFile}</span>
                          <Button size="sm" variant="outline" onClick={saveFile}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                        <Textarea
                          value={fileContent}
                          onChange={(e) => setFileContent(e.target.value)}
                          className="flex-1 font-mono text-sm border-0 focus:ring-0 resize-none"
                          placeholder="Start coding..."
                        />
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        Select a file to edit
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="terminal" className="h-full">
                <WebContainerTerminal
                  projectId={selectedProject.id}
                  files={selectedProject.files}
                  onReady={() => {
                    console.log('WebContainer ready for project:', selectedProject.name);
                  }}
                  className="h-full"
                />
              </TabsContent>

              <TabsContent value="preview" className="h-full">
                <div className="h-full border rounded-lg">
                  <div className="border-b px-4 py-2 flex items-center justify-between">
                    <span className="text-sm">Preview - Development Server</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        <Globe className="h-3 w-3 mr-1" />
                        Port 3000
                      </Badge>
                    </div>
                  </div>
                  <div className="h-[500px] bg-white flex items-center justify-center">
                    <div className="text-center">
                      <Cloud className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Run `npm run dev` in terminal to start preview</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Your app will appear here once the dev server starts
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai" className="h-full">
                <div className="h-full flex flex-col">
                  <div className="flex-1 border rounded-lg p-4 mb-4 overflow-y-auto">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Bot className="h-6 w-6 text-blue-600 mt-1" />
                        <div>
                          <p className="font-medium">Claude Assistant</p>
                          <p className="text-sm text-muted-foreground">
                            I can help you write code, fix bugs, and implement features. Just describe what you need!
                          </p>
                        </div>
                      </div>
                      
                      {isGenerating && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Claude is generating code...</span>
                        </div>
                      )}
                      
                      {lastResult && (
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h4 className="font-medium mb-2">Generated Code:</h4>
                          <pre className="text-xs overflow-x-auto bg-gray-900 text-gray-100 p-4 rounded">
                            <code>{lastResult.code}</code>
                          </pre>
                          {lastResult.explanation && (
                            <p className="text-sm text-muted-foreground mt-4">
                              {lastResult.explanation}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Ask Claude to help with your code..."
                      onKeyDown={(e) => e.key === 'Enter' && handleAiCommand()}
                    />
                    <Button onClick={handleAiCommand} disabled={isGenerating}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Cpu className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium">WebContainers</p>
                <p className="text-sm text-muted-foreground">
                  Full Node.js environment in browser
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="font-medium">Instant Deploy</p>
                <p className="text-sm text-muted-foreground">
                  Deploy to production in seconds
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-600" />
              <div>
                <p className="font-medium">AI-Powered</p>
                <p className="text-sm text-muted-foreground">
                  Claude helps you code faster
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Project Dialog */}
      <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Set up a new development project from a template
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
                  <SelectItem value="react-crm">React CRM Template</SelectItem>
                  <SelectItem value="nextjs-analytics">Next.js Analytics Dashboard</SelectItem>
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
    </div>
  );
};

export default CloudDevelopmentV2;