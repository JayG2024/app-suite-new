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
  Pause
} from "lucide-react";

interface WebContainerTerminalProps {
  projectId?: string;
  files?: Record<string, string>;
  onReady?: () => void;
  onCommand?: (command: string) => void;
  className?: string;
}

const WebContainerTerminal = ({ 
  projectId, 
  files, 
  onReady, 
  onCommand,
  className 
}: WebContainerTerminalProps) => {
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

        // Initialize Terminal
        const terminal = new Terminal({
          convertEol: true,
          fontSize: 14,
          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
          theme: {
            background: '#1a1a1a',
            foreground: '#d4d4d4',
            cursor: '#d4d4d4',
            black: '#000000',
            red: '#cd3131',
            green: '#0dbc79',
            yellow: '#e5e510',
            blue: '#2472c8',
            magenta: '#bc3fbc',
            cyan: '#11a8cd',
            white: '#e5e5e5',
            brightBlack: '#666666',
            brightRed: '#f14c4c',
            brightGreen: '#23d18b',
            brightYellow: '#f5f543',
            brightBlue: '#3b8eea',
            brightMagenta: '#d670d6',
            brightCyan: '#29b8db',
            brightWhite: '#e5e5e5'
          }
        });

        fitAddon.current = new FitAddon();
        terminal.loadAddon(fitAddon.current);
        terminal.open(terminalRef.current);
        fitAddon.current.fit();
        terminalInstance.current = terminal;

        // Boot WebContainer
        terminal.writeln('🚀 Booting WebContainer...');
        const instance = await WebContainer.boot();
        
        if (!mounted) {
          instance.teardown();
          return;
        }

        setWebcontainerInstance(instance);
        terminal.writeln('✅ WebContainer ready!');
        terminal.writeln('');

        // Mount initial files if provided
        if (files) {
          terminal.writeln('📁 Mounting project files...');
          await mountFiles(instance, files);
          terminal.writeln('✅ Files mounted successfully!');
          terminal.writeln('');
        }

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
        console.error('Failed to initialize WebContainer:', error);
        if (terminalInstance.current) {
          terminalInstance.current.writeln(`❌ Error: ${error instanceof Error ? error.message : 'Failed to initialize'}`);
        }
        setIsLoading(false);
        toast.error('Failed to initialize development environment');
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
  }, [files, onReady]);

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
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TerminalIcon className="h-5 w-5" />
            <CardTitle className="text-lg">Terminal</CardTitle>
            {isRunning && (
              <Badge variant="outline" className="text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Running
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={copyTerminalContent}
              disabled={isLoading}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={clearTerminal}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
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
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Initializing WebContainer...</span>
            </div>
          </div>
        )}
        <div 
          ref={terminalRef} 
          className="h-full bg-[#1a1a1a]"
          style={{ minHeight: '400px' }}
        />
      </CardContent>
    </Card>
  );
};

export default WebContainerTerminal;