import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  Terminal as TerminalIcon, 
  X,
  Maximize2,
  Minimize2,
  Copy,
  Download,
  Settings,
  Loader2
} from "lucide-react";

interface TerminalProps {
  projectId?: string;
  onCommand?: (command: string) => void;
}

const BrowserTerminal = ({ projectId, onCommand }: TerminalProps) => {
  const [history, setHistory] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize terminal
  useEffect(() => {
    setHistory([
      '🚀 App Suite Terminal v1.0.0',
      'Type "help" for available commands',
      ''
    ]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Command processing
  const processCommand = async (command: string) => {
    const trimmedCmd = command.trim();
    if (!trimmedCmd) return;

    // Add command to history
    setHistory(prev => [...prev, `$ ${trimmedCmd}`]);
    setCommandHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);
    setIsProcessing(true);

    // Parse command
    const [cmd, ...args] = trimmedCmd.split(' ');

    try {
      switch (cmd.toLowerCase()) {
        case 'help':
          showHelp();
          break;
          
        case 'clear':
          setHistory([]);
          break;
          
        case 'create':
          await createProject(args);
          break;
          
        case 'deploy':
          await deployProject(args);
          break;
          
        case 'install':
        case 'npm':
        case 'yarn':
          await handlePackageManager(cmd, args);
          break;
          
        case 'git':
          await handleGit(args);
          break;
          
        case 'claude':
          await handleClaude(args.join(' '));
          break;
          
        case 'ls':
          listFiles();
          break;
          
        case 'cd':
          changeDirectory(args[0]);
          break;
          
        case 'pwd':
          showWorkingDirectory();
          break;
          
        case 'echo':
          echo(args.join(' '));
          break;
          
        case 'netlify':
          await handleNetlify(args);
          break;
          
        case 'vercel':
          await handleVercel(args);
          break;
          
        default:
          setHistory(prev => [...prev, 
            `Command not found: ${cmd}`,
            'Type "help" for available commands'
          ]);
      }
    } catch (error) {
      setHistory(prev => [...prev, 
        `Error: ${error instanceof Error ? error.message : 'Command failed'}`
      ]);
    }

    setIsProcessing(false);
    setHistory(prev => [...prev, '']);
    
    // Call parent handler if provided
    if (onCommand) {
      onCommand(trimmedCmd);
    }
  };

  const showHelp = () => {
    setHistory(prev => [...prev,
      '',
      '📚 Available Commands:',
      '',
      '  Project Management:',
      '    create <name>        Create new project',
      '    deploy [platform]    Deploy current project',
      '    build               Build for production',
      '',
      '  Package Management:',
      '    npm install <pkg>    Install npm package',
      '    yarn add <pkg>       Add package with yarn',
      '    npm run <script>     Run package.json script',
      '',
      '  Git Commands:',
      '    git init            Initialize repository',
      '    git add .           Stage all changes',
      '    git commit -m ""    Commit changes',
      '    git push            Push to remote',
      '',
      '  Platform Commands:',
      '    netlify init        Initialize Netlify',
      '    netlify deploy      Deploy to Netlify',
      '    vercel              Deploy to Vercel',
      '',
      '  AI Assistant:',
      '    claude <prompt>     Ask Claude for help',
      '',
      '  System Commands:',
      '    ls                  List files',
      '    cd <dir>           Change directory',
      '    pwd                Show current directory',
      '    clear              Clear terminal',
      '    help               Show this help',
      ''
    ]);
  };

  const createProject = async (args: string[]) => {
    const projectName = args[0] || 'my-app';
    
    setHistory(prev => [...prev, 
      `Creating project: ${projectName}...`,
      ''
    ]);

    // Simulate project creation
    const steps = [
      '📁 Creating project structure...',
      '📦 Installing dependencies...',
      '⚙️  Configuring build tools...',
      '🎨 Setting up styling...',
      '✅ Project created successfully!'
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setHistory(prev => [...prev, step]);
    }

    setHistory(prev => [...prev, 
      '',
      `Project "${projectName}" is ready!`,
      'Run "npm run dev" to start development server'
    ]);
  };

  const deployProject = async (args: string[]) => {
    const platform = args[0] || 'netlify';
    
    setHistory(prev => [...prev, 
      `🚀 Deploying to ${platform}...`,
      ''
    ]);

    const steps = [
      '📦 Building project...',
      '🔍 Analyzing bundle size...',
      '📤 Uploading files...',
      '🌐 Configuring CDN...',
      '✅ Deployment complete!'
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setHistory(prev => [...prev, step]);
    }

    const deployUrl = `https://amazing-app-${Date.now()}.${platform}.app`;
    setHistory(prev => [...prev, 
      '',
      `🎉 Your app is live at: ${deployUrl}`,
      'Run "netlify open" to view in browser'
    ]);
  };

  const handlePackageManager = async (cmd: string, args: string[]) => {
    const action = args[0];
    const packageName = args[1];

    if (action === 'install' || action === 'add') {
      if (!packageName) {
        setHistory(prev => [...prev, 'Installing dependencies from package.json...']);
      } else {
        setHistory(prev => [...prev, `Installing ${packageName}...`]);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setHistory(prev => [...prev, 
        '✅ Installation complete!',
        packageName ? `Added ${packageName} to dependencies` : 'All dependencies installed'
      ]);
    } else if (action === 'run') {
      const script = args[1];
      setHistory(prev => [...prev, `Running script: ${script}...`]);
      
      if (script === 'dev') {
        setHistory(prev => [...prev, 
          '',
          '  VITE v5.0.0  ready in 320 ms',
          '',
          '  ➜  Local:   http://localhost:5173/',
          '  ➜  Network: use --host to expose',
          '  ➜  press h to show help'
        ]);
      } else if (script === 'build') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setHistory(prev => [...prev, 
          '✓ Built in 2.34s',
          'dist/index.html                  1.45 kB',
          'dist/assets/index-5a2b1c3d.js   143.58 kB'
        ]);
      }
    }
  };

  const handleGit = async (args: string[]) => {
    const subCommand = args[0];
    
    switch (subCommand) {
      case 'init':
        setHistory(prev => [...prev, 'Initialized empty Git repository in .git/']);
        break;
        
      case 'add':
        setHistory(prev => [...prev, 'Changes staged for commit']);
        break;
        
      case 'commit':
        const message = args.slice(2).join(' ');
        setHistory(prev => [...prev, 
          `[main abc1234] ${message}`,
          ' 3 files changed, 42 insertions(+), 5 deletions(-)'
        ]);
        break;
        
      case 'push':
        setHistory(prev => [...prev, 'Pushing to origin...']);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setHistory(prev => [...prev, 
          'To https://github.com/user/repo.git',
          '   abc1234..def5678  main -> main'
        ]);
        break;
        
      default:
        setHistory(prev => [...prev, `git: '${subCommand}' is not a git command`]);
    }
  };

  const handleClaude = async (prompt: string) => {
    if (!prompt) {
      setHistory(prev => [...prev, 'Please provide a prompt for Claude']);
      return;
    }

    setHistory(prev => [...prev, 
      '',
      `🤖 Claude: Processing "${prompt}"...`,
      ''
    ]);

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate Claude response based on prompt
    if (prompt.includes('component')) {
      setHistory(prev => [...prev,
        '💡 I\'ll create a React component for you:',
        '',
        '```tsx',
        'import React from "react";',
        '',
        'interface ComponentProps {',
        '  title: string;',
        '  onClick?: () => void;',
        '}',
        '',
        'const MyComponent: React.FC<ComponentProps> = ({ title, onClick }) => {',
        '  return (',
        '    <div className="component">',
        '      <h2>{title}</h2>',
        '      <button onClick={onClick}>Click me</button>',
        '    </div>',
        '  );',
        '};',
        '',
        'export default MyComponent;',
        '```',
        '',
        '✅ Component created! Save this to src/components/MyComponent.tsx'
      ]);
    } else if (prompt.includes('api')) {
      setHistory(prev => [...prev,
        '💡 Here\'s an API endpoint example:',
        '',
        '```js',
        '// netlify/functions/api.js',
        'exports.handler = async (event, context) => {',
        '  const { httpMethod, body } = event;',
        '  ',
        '  if (httpMethod === "POST") {',
        '    const data = JSON.parse(body);',
        '    // Process data here',
        '    ',
        '    return {',
        '      statusCode: 200,',
        '      body: JSON.stringify({ success: true, data })',
        '    };',
        '  }',
        '  ',
        '  return {',
        '    statusCode: 405,',
        '    body: JSON.stringify({ error: "Method not allowed" })',
        '  };',
        '};',
        '```'
      ]);
    } else {
      setHistory(prev => [...prev,
        '💡 I understand you need help with: ' + prompt,
        'Let me analyze your requirements...',
        '',
        '1. First, let\'s understand what you\'re trying to achieve',
        '2. I\'ll suggest the best approach',
        '3. Then I\'ll provide code examples',
        '',
        'What specific functionality do you need?'
      ]);
    }
  };

  const handleNetlify = async (args: string[]) => {
    const subCommand = args[0];
    
    switch (subCommand) {
      case 'init':
        setHistory(prev => [...prev, 
          'Netlify CLI initialized!',
          'Linked to: amazing-app',
          'Site ID: 12345-abcde-67890'
        ]);
        break;
        
      case 'deploy':
        await deployProject(['netlify']);
        break;
        
      case 'open':
        setHistory(prev => [...prev, 'Opening site in browser...']);
        break;
        
      default:
        setHistory(prev => [...prev, `netlify ${subCommand}: command not found`]);
    }
  };

  const handleVercel = async (args: string[]) => {
    if (args.length === 0) {
      await deployProject(['vercel']);
    } else {
      setHistory(prev => [...prev, `vercel ${args[0]}: command not found`]);
    }
  };

  const listFiles = () => {
    setHistory(prev => [...prev,
      'src/          package.json    README.md',
      'public/       vite.config.ts  .gitignore',
      'node_modules/ tsconfig.json   .env'
    ]);
  };

  const changeDirectory = (dir: string) => {
    if (!dir) {
      setHistory(prev => [...prev, 'cd: missing directory']);
    } else {
      setHistory(prev => [...prev, `Changed to: ${dir}`]);
    }
  };

  const showWorkingDirectory = () => {
    setHistory(prev => [...prev, '/home/project/my-app']);
  };

  const echo = (text: string) => {
    setHistory(prev => [...prev, text]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand(currentCommand);
      setCurrentCommand('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  };

  const copyTerminalContent = () => {
    const content = history.join('\n');
    navigator.clipboard.writeText(content);
    toast.success('Terminal content copied!');
  };

  return (
    <Card className="h-full">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TerminalIcon className="h-5 w-5" />
            <CardTitle className="text-lg">Terminal</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={copyTerminalContent}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setHistory([])}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-gray-900 text-gray-100 font-mono text-sm h-[500px] flex flex-col">
          <div
            ref={terminalRef}
            className="flex-1 overflow-y-auto p-4 space-y-1"
          >
            {history.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap">
                {line.startsWith('$') ? (
                  <span className="text-green-400">{line}</span>
                ) : line.startsWith('Error:') ? (
                  <span className="text-red-400">{line}</span>
                ) : line.startsWith('✅') || line.startsWith('✓') ? (
                  <span className="text-green-400">{line}</span>
                ) : line.startsWith('⚠') ? (
                  <span className="text-yellow-400">{line}</span>
                ) : line.includes('```') ? (
                  <span className="text-blue-400">{line}</span>
                ) : (
                  line
                )}
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-center gap-2 text-blue-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-700 p-4">
            <div className="flex items-center gap-2">
              <span className="text-green-400">$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none"
                placeholder="Enter command..."
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrowserTerminal;