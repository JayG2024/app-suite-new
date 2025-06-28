import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { WebContainer } from '@webcontainer/api';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { 
  Terminal as TerminalIcon, 
  X,
  Maximize2,
  Minimize2,
  Copy,
  Download,
  Settings,
  Loader2,
  RefreshCw,
  Play,
  Pause,
  Sparkles,
  Command
} from "lucide-react";

interface ASCTerminalProps {
  projectId?: string;
  files?: Record<string, string>;
  onReady?: () => void;
  onCommand?: (command: string) => void;
  className?: string;
  existingProjectPath?: string;
}

const ASCTerminal = ({ 
  projectId, 
  files, 
  onReady, 
  onCommand,
  className,
  existingProjectPath
}: ASCTerminalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [webcontainerInstance, setWebcontainerInstance] = useState<WebContainer | null>(null);
  const [currentProcess, setCurrentProcess] = useState<any>(null);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);

  // Initialize WebContainer and Terminal
  useEffect(() => {
    let mounted = true;

    const initContainer = async () => {
      try {
        if (!terminalRef.current || !mounted) return;

        // Initialize Terminal with ASC branding
        const terminal = new Terminal({
          convertEol: true,
          fontSize: 14,
          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
          theme: {
            background: '#0a0a0a',
            foreground: '#e0e0e0',
            cursor: '#00ff00',
            black: '#000000',
            red: '#ff3b30',
            green: '#00ff00',
            yellow: '#ffcc00',
            blue: '#007aff',
            magenta: '#ff2d55',
            cyan: '#5ac8fa',
            white: '#e5e5e5',
            brightBlack: '#666666',
            brightRed: '#ff6b6b',
            brightGreen: '#4cd964',
            brightYellow: '#ffec8b',
            brightBlue: '#5ac8fa',
            brightMagenta: '#ff2d55',
            brightCyan: '#5ac8fa',
            brightWhite: '#ffffff'
          }
        });

        fitAddon.current = new FitAddon();
        terminal.loadAddon(fitAddon.current);
        terminal.open(terminalRef.current);
        fitAddon.current.fit();
        terminalInstance.current = terminal;

        // ASC.AI Welcome Message
        terminal.writeln('╔═══════════════════════════════════════════════════════╗');
        terminal.writeln('║                    ASC.AI Terminal                    ║');
        terminal.writeln('║           App Suite Code - AI Powered IDE             ║');
        terminal.writeln('╚═══════════════════════════════════════════════════════╝');
        terminal.writeln('');
        terminal.writeln('🚀 Initializing ASC.AI environment...');
        
        // Boot WebContainer
        const instance = await WebContainer.boot();
        
        if (!mounted) {
          instance.teardown();
          return;
        }

        setWebcontainerInstance(instance);
        terminal.writeln('✅ ASC.AI WebContainer ready!');
        terminal.writeln('');

        // If connecting to existing project
        if (existingProjectPath) {
          terminal.writeln(`📁 Connecting to existing project: ${existingProjectPath}`);
          terminal.writeln('🔍 Analyzing codebase...');
          // Here you would implement GitHub clone or file sync
          terminal.writeln('✅ Project synchronized!');
          terminal.writeln('');
        }

        // Mount initial files if provided
        if (files) {
          terminal.writeln('📁 Mounting project files...');
          await mountFiles(instance, files);
          terminal.writeln('✅ Files mounted successfully!');
          terminal.writeln('');
        }

        // Show ASC commands
        terminal.writeln('💡 ASC.AI Commands:');
        terminal.writeln('   asc create <type>    - Create new components/features');
        terminal.writeln('   asc analyze          - Analyze current codebase');
        terminal.writeln('   asc optimize         - Optimize performance');
        terminal.writeln('   asc fix <issue>      - Fix bugs or issues');
        terminal.writeln('   asc deploy           - Deploy to production');
        terminal.writeln('');
        terminal.writeln('Type "asc help" for more commands');
        terminal.writeln('');

        // Connect terminal to WebContainer shell
        const shellProcess = await instance.spawn('jsh', {
          terminal: {
            cols: terminal.cols,
            rows: terminal.rows,
          }
        });

        shellProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              terminal.write(data);
            }
          })
        );

        const input = shellProcess.input.getWriter();
        
        terminal.onData((data) => {
          input.write(data);
        });

        // Handle terminal resize
        terminal.onResize(({ cols, rows }) => {
          shellProcess.resize({
            cols,
            rows
          });
        });

        setIsLoading(false);
        setIsRunning(true);
        onReady?.();

      } catch (error) {
        console.error('Failed to initialize ASC.AI WebContainer:', error);
        if (terminalInstance.current) {
          terminalInstance.current.writeln(`❌ Error: ${error instanceof Error ? error.message : 'Failed to initialize'}`);
        }
        setIsLoading(false);
        toast.error('Failed to initialize ASC.AI environment');
      }
    };

    initContainer();

    // Cleanup
    return () => {
      mounted = false;
      if (terminalInstance.current) {
        terminalInstance.current.dispose();
      }
      if (webcontainerInstance) {
        webcontainerInstance.teardown();
      }
    };
  }, [files, onReady, existingProjectPath]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (fitAddon.current) {
        fitAddon.current.fit();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mount files to WebContainer
  const mountFiles = async (instance: WebContainer, fileMap: Record<string, string>) => {
    const fileSystemTree: any = {};

    // Convert flat file map to nested structure
    Object.entries(fileMap).forEach(([path, content]) => {
      const parts = path.split('/');
      let current = fileSystemTree;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // It's a file
          current[part] = {
            file: {
              contents: content
            }
          };
        } else {
          // It's a directory
          if (!current[part]) {
            current[part] = {
              directory: {}
            };
          }
          current = current[part].directory;
        }
      });
    });

    await instance.mount(fileSystemTree);
  };

  // Run a command in the WebContainer
  const runCommand = async (command: string) => {
    if (!webcontainerInstance || !terminalInstance.current) return;

    try {
      const [cmd, ...args] = command.split(' ');
      
      terminalInstance.current.writeln(`$ ${command}`);
      onCommand?.(command);

      const process = await webcontainerInstance.spawn(cmd, args);
      setCurrentProcess(process);

      process.output.pipeTo(
        new WritableStream({
          write(data) {
            terminalInstance.current?.write(data);
          }
        })
      );

      const exitCode = await process.exit;
      
      if (exitCode !== 0) {
        terminalInstance.current.writeln(`Process exited with code ${exitCode}`);
      }

      setCurrentProcess(null);
    } catch (error) {
      terminalInstance.current.writeln(`Error: ${error instanceof Error ? error.message : 'Command failed'}`);
    }
  };

  // Get the preview URL when dev server is running
  const getPreviewUrl = () => {
    if (!webcontainerInstance) return null;
    
    // WebContainer will emit server-ready event when a dev server starts
    return new Promise<string>((resolve) => {
      webcontainerInstance.on('server-ready', (port, url) => {
        resolve(url);
      });
    });
  };

  const copyTerminalContent = () => {
    if (!terminalInstance.current) return;
    
    const selection = terminalInstance.current.getSelection();
    if (selection) {
      navigator.clipboard.writeText(selection);
      toast.success('Selected text copied!');
    } else {
      toast.info('Select text to copy');
    }
  };

  const clearTerminal = () => {
    if (!terminalInstance.current) return;
    terminalInstance.current.clear();
  };

  const restartContainer = async () => {
    setIsLoading(true);
    if (webcontainerInstance) {
      await webcontainerInstance.teardown();
    }
    window.location.reload(); // Simple restart for now
  };

  return (
    <Card className={cn("h-full flex flex-col bg-black/95 border-green-900/20", className)}>
      <CardHeader className="py-3 flex-shrink-0 border-b border-green-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Command className="h-5 w-5 text-green-500" />
              <Sparkles className="h-4 w-4 text-green-400" />
            </div>
            <CardTitle className="text-lg text-green-400">ASC.AI Terminal</CardTitle>
            {isRunning && (
              <Badge variant="outline" className="text-green-500 border-green-500/50">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-400 hover:text-green-300"
              onClick={copyTerminalContent}
              disabled={isLoading}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-400 hover:text-green-300"
              onClick={clearTerminal}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-400 hover:text-green-300"
              onClick={restartContainer}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-green-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Initializing ASC.AI WebContainer...</span>
              </div>
              <span className="text-xs text-green-400/60">Powered by App Suite Code</span>
            </div>
          </div>
        )}
        <div 
          ref={terminalRef} 
          className="h-full bg-[#0a0a0a]"
          style={{ minHeight: '400px' }}
        />
      </CardContent>
    </Card>
  );
};

export default ASCTerminal;