import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  Terminal as TerminalIcon, 
  Code, 
  Play, 
  Pause,
  RotateCw,
  Download,
  Upload,
  FolderOpen,
  FileText,
  Save,
  Plus,
  X,
  Maximize2,
  Minimize2,
  Copy,
  ExternalLink,
  Loader2,
  Cloud,
  Cpu,
  HardDrive,
  Zap,
  GitBranch,
  Send,
  Bot,
  Sparkles
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'stopped';
  framework: string;
  url?: string;
}

interface FileNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileNode[];
}

const CloudDevelopment = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'PPOK CRM',
      client: 'PPOK Pharmacy',
      status: 'stopped',
      framework: 'react',
      url: 'https://ppok-crm.stackblitz.io'
    }
  ]);
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '$ Welcome to App Suite Cloud Development',
    '$ Type "help" for available commands',
    '$ '
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // File tree structure
  const [fileTree, setFileTree] = useState<FileNode>({
    name: 'root',
    type: 'directory',
    children: [
      {
        name: 'src',
        type: 'directory',
        children: [
          { name: 'App.tsx', type: 'file', content: 'import React from "react";\n\nfunction App() {\n  return <div>Hello World</div>;\n}\n\nexport default App;' },
          { name: 'index.css', type: 'file', content: '/* Your styles here */' },
          { name: 'main.tsx', type: 'file', content: 'import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App";\nimport "./index.css";\n\nReactDOM.createRoot(document.getElementById("root")!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);' }
        ]
      },
      { name: 'package.json', type: 'file', content: '{\n  "name": "client-app",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  }\n}' },
      { name: 'vite.config.ts', type: 'file', content: 'import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\n\nexport default defineConfig({\n  plugins: [react()],\n});' }
    ]
  });

  // WebContainer initialization script
  const initWebContainer = `
// Initialize WebContainer
import { WebContainer } from '@webcontainer/api';

let webcontainerInstance;

async function initializeContainer() {
  // Boot the WebContainer
  webcontainerInstance = await WebContainer.boot();
  
  // Mount project files
  await webcontainerInstance.mount(fileSystemTree);
  
  // Install dependencies
  const installProcess = await webcontainerInstance.spawn('npm', ['install']);
  
  installProcess.output.pipeTo(new WritableStream({
    write(data) {
      console.log(data);
    }
  }));
  
  // Start dev server
  const serverProcess = await webcontainerInstance.spawn('npm', ['run', 'dev']);
  
  // Get the URL
  webcontainerInstance.on('server-ready', (port, url) => {
    console.log('Server running at:', url);
  });
}`;

  // Simulate terminal commands
  const executeCommand = async (command: string) => {
    const args = command.trim().split(' ');
    const cmd = args[0];
    
    switch (cmd) {
      case 'help':
        setTerminalOutput(prev => [...prev,
          '📚 Available Commands:',
          '  create <project-name>  - Create new project',
          '  deploy                - Deploy current project',
          '  install <package>     - Install npm package',
          '  run <script>          - Run npm script',
          '  git <command>         - Git operations',
          '  claude <prompt>       - Ask Claude for help',
          '  clear                 - Clear terminal',
          ''
        ]);
        break;
        
      case 'create':
        if (args[1]) {
          setTerminalOutput(prev => [...prev,
            `Creating project: ${args[1]}...`,
            '📦 Installing dependencies...',
            '✅ Project created successfully!',
            ''
          ]);
        }
        break;
        
      case 'deploy':
        setTerminalOutput(prev => [...prev,
          '🚀 Building project...',
          '📤 Uploading to Netlify...',
          '✅ Deployed to: https://amazing-app.netlify.app',
          ''
        ]);
        break;
        
      case 'claude':
        if (args.length > 1) {
          const prompt = args.slice(1).join(' ');
          setTerminalOutput(prev => [...prev,
            `🤖 Claude: Processing "${prompt}"...`,
            '💡 I can help you with that! Here\'s what I suggest:',
            '   1. First, let\'s understand your requirements',
            '   2. I\'ll generate the code for you',
            '   3. We can test it together',
            ''
          ]);
        }
        break;
        
      case 'clear':
        setTerminalOutput(['$ ']);
        break;
        
      default:
        setTerminalOutput(prev => [...prev,
          `Command not found: ${cmd}`,
          'Type "help" for available commands',
          ''
        ]);
    }
    
    setTerminalOutput(prev => [...prev, '$ ']);
  };

  const handleCommandSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentCommand.trim()) {
      setTerminalOutput(prev => [...prev.slice(0, -1), `$ ${currentCommand}`]);
      executeCommand(currentCommand);
      setCurrentCommand('');
    }
  };

  const startProject = async (project: Project) => {
    setIsLoading(true);
    setSelectedProject(project);
    
    // Simulate starting WebContainer
    setTimeout(() => {
      setTerminalOutput(prev => [...prev,
        `🚀 Starting ${project.name}...`,
        '📦 Loading WebContainer...',
        '⚡ Installing dependencies...',
        '✅ Development server started!',
        `🌐 Preview: http://localhost:3000`,
        ''
      ]);
      setProjects(projects.map(p => 
        p.id === project.id ? { ...p, status: 'active' } : p
      ));
      setIsLoading(false);
    }, 2000);
  };

  const stopProject = (project: Project) => {
    setTerminalOutput(prev => [...prev,
      `⏹️ Stopping ${project.name}...`,
      '✅ Project stopped',
      ''
    ]);
    setProjects(projects.map(p => 
      p.id === project.id ? { ...p, status: 'stopped' } : p
    ));
    setSelectedProject(null);
  };

  const renderFileTree = (node: FileNode, path: string = ''): JSX.Element => {
    const fullPath = path ? `${path}/${node.name}` : node.name;
    
    if (node.type === 'directory') {
      return (
        <div key={fullPath} className="space-y-1">
          <div className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 rounded cursor-pointer">
            <FolderOpen className="h-4 w-4 text-blue-600" />
            <span className="text-sm">{node.name}</span>
          </div>
          <div className="ml-4">
            {node.children?.map(child => renderFileTree(child, fullPath))}
          </div>
        </div>
      );
    }
    
    return (
      <div
        key={fullPath}
        className={cn(
          "flex items-center gap-2 py-1 px-2 hover:bg-gray-100 rounded cursor-pointer",
          activeFile === fullPath && "bg-blue-100"
        )}
        onClick={() => {
          setActiveFile(fullPath);
          setFileContent(node.content || '');
        }}
      >
        <FileText className="h-4 w-4 text-gray-600" />
        <span className="text-sm">{node.name}</span>
      </div>
    );
  };

  const handleAiCommand = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsAiThinking(true);
    setTerminalOutput(prev => [...prev,
      `🤖 Claude: "${aiPrompt}"`,
      '💭 Thinking...'
    ]);
    
    // Simulate AI response
    setTimeout(() => {
      setTerminalOutput(prev => [...prev,
        '💡 Here\'s what I\'ll do:',
        '1. Create a new component for your requirement',
        '2. Add necessary imports and types',
        '3. Implement the functionality',
        '',
        '📝 Generated code:',
        '```typescript',
        'import React from "react";',
        '',
        'const YourComponent = () => {',
        '  return <div>AI Generated Component</div>;',
        '};',
        '',
        'export default YourComponent;',
        '```',
        '',
        '✅ Code has been added to your project!',
        ''
      ]);
      setIsAiThinking(false);
      setAiPrompt('');
    }, 2000);
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

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
            <Button>
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(project.url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Preview
                        </Button>
                      </>
                    )}
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
                    {renderFileTree(fileTree)}
                  </div>
                  
                  {/* Code Editor */}
                  <div className="col-span-3 border rounded-lg">
                    {activeFile ? (
                      <div className="h-full flex flex-col">
                        <div className="border-b px-4 py-2 flex items-center justify-between">
                          <span className="text-sm font-medium">{activeFile}</span>
                          <Button size="sm" variant="outline">
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                        <Textarea
                          value={fileContent}
                          onChange={(e) => setFileContent(e.target.value)}
                          className="flex-1 font-mono text-sm border-0 focus:ring-0"
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
                <div className="h-full bg-black text-green-400 rounded-lg p-4 font-mono text-sm">
                  <div
                    ref={terminalRef}
                    className="h-[500px] overflow-y-auto"
                  >
                    {terminalOutput.map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span>$</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={currentCommand}
                      onChange={(e) => setCurrentCommand(e.target.value)}
                      onKeyDown={handleCommandSubmit}
                      className="flex-1 bg-transparent border-none outline-none text-green-400"
                      placeholder="Enter command..."
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="h-full">
                <div className="h-full border rounded-lg">
                  <div className="border-b px-4 py-2 flex items-center justify-between">
                    <span className="text-sm">Preview - http://localhost:3000</span>
                    <Button size="sm" variant="outline">
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="h-[500px] bg-white flex items-center justify-center">
                    <div className="text-center">
                      <Cloud className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Preview will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Your app is running in a secure WebContainer
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
                      
                      {isAiThinking && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Claude is thinking...</span>
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
                    <Button onClick={handleAiCommand} disabled={isAiThinking}>
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
    </div>
  );
};

export default CloudDevelopment;