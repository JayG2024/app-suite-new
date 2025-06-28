import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Command,
  Sparkles,
  FileCode,
  GitBranch,
  FolderOpen,
  Zap,
  Brain,
  Code,
  Database,
  ShoppingCart,
  Users,
  BarChart3,
  Package,
  Loader2,
  Check,
  AlertCircle,
  ArrowRight,
  Terminal,
  History,
  BookOpen,
  Rocket
} from "lucide-react";

interface ASCCommandProps {
  onExecute: (command: string) => Promise<any>;
  currentProject?: any;
  isProcessing?: boolean;
}

// Command templates for quick access
const COMMAND_TEMPLATES = {
  create: {
    icon: Package,
    title: 'Create',
    commands: [
      { cmd: 'asc create crm', desc: 'Complete CRM system with pipeline' },
      { cmd: 'asc create inventory', desc: 'Inventory management system' },
      { cmd: 'asc create dashboard', desc: 'Analytics dashboard with charts' },
      { cmd: 'asc create ecommerce', desc: 'E-commerce platform' },
      { cmd: 'asc create hr-system', desc: 'HR management system' },
      { cmd: 'asc create booking', desc: 'Appointment booking system' }
    ]
  },
  add: {
    icon: Zap,
    title: 'Add Features',
    commands: [
      { cmd: 'asc add authentication', desc: 'User auth with login/signup' },
      { cmd: 'asc add payment stripe', desc: 'Stripe payment integration' },
      { cmd: 'asc add charts', desc: 'Data visualization charts' },
      { cmd: 'asc add search', desc: 'Advanced search functionality' },
      { cmd: 'asc add export-pdf', desc: 'PDF export for reports' },
      { cmd: 'asc add api rest', desc: 'REST API endpoints' }
    ]
  },
  fix: {
    icon: AlertCircle,
    title: 'Fix & Optimize',
    commands: [
      { cmd: 'asc fix performance', desc: 'Optimize slow components' },
      { cmd: 'asc fix mobile-layout', desc: 'Fix responsive issues' },
      { cmd: 'asc fix typescript-errors', desc: 'Resolve TS errors' },
      { cmd: 'asc optimize bundle-size', desc: 'Reduce bundle size' },
      { cmd: 'asc fix accessibility', desc: 'Fix a11y issues' },
      { cmd: 'asc optimize seo', desc: 'Improve SEO' }
    ]
  },
  analyze: {
    icon: Brain,
    title: 'Analyze',
    commands: [
      { cmd: 'asc analyze codebase', desc: 'Full codebase analysis' },
      { cmd: 'asc analyze security', desc: 'Security vulnerability scan' },
      { cmd: 'asc analyze performance', desc: 'Performance bottlenecks' },
      { cmd: 'asc analyze dependencies', desc: 'Outdated dependencies' },
      { cmd: 'asc analyze structure', desc: 'Code structure review' },
      { cmd: 'asc analyze best-practices', desc: 'Best practices check' }
    ]
  }
};

const ASCCommand = ({ onExecute, currentProject, isProcessing = false }: ASCCommandProps) => {
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Load command history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('asc_command_history');
    if (history) {
      setCommandHistory(JSON.parse(history));
    }
  }, []);

  // Auto-suggest commands as user types
  useEffect(() => {
    if (command.startsWith('asc ')) {
      const allCommands = Object.values(COMMAND_TEMPLATES)
        .flatMap(cat => cat.commands.map(c => c.cmd));
      
      const filtered = allCommands.filter(cmd => 
        cmd.toLowerCase().includes(command.toLowerCase())
      );
      
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [command]);

  const executeCommand = async (cmd: string) => {
    if (!cmd.trim()) return;

    // Add to history
    const newHistory = [cmd, ...commandHistory.filter(h => h !== cmd)].slice(0, 50);
    setCommandHistory(newHistory);
    localStorage.setItem('asc_command_history', JSON.stringify(newHistory));

    try {
      await onExecute(cmd);
      setCommand('');
      toast.success('ASC command executed successfully');
    } catch (error) {
      toast.error(`ASC Error: ${error instanceof Error ? error.message : 'Command failed'}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      executeCommand(command);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  return (
    <Card className="h-full bg-black/95 border-green-900/20">
      <CardHeader className="border-b border-green-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Command className="h-5 w-5 text-green-500" />
            <Sparkles className="h-4 w-4 text-green-400" />
            <CardTitle className="text-green-400">ASC.AI Command Center</CardTitle>
          </div>
          <Badge variant="outline" className="text-green-500 border-green-500/50">
            Internal Tool
          </Badge>
        </div>
        <CardDescription className="text-green-400/60">
          AI-powered code generation for App Suite projects
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="command" className="h-full">
          <TabsList className="bg-green-950/20 border border-green-900/20">
            <TabsTrigger value="command" className="data-[state=active]:bg-green-900/20">
              <Terminal className="h-4 w-4 mr-2" />
              Command
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-green-900/20">
              <BookOpen className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-green-900/20">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="command" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label className="text-green-400">ASC Command</Label>
              <div className="relative">
                <Input
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="asc create crm --with-analytics"
                  className="bg-black/50 border-green-900/30 text-green-300 placeholder:text-green-900/50 pr-20"
                  disabled={isProcessing}
                />
                <Button
                  size="sm"
                  className="absolute right-1 top-1 h-7 bg-green-900/20 text-green-400 hover:bg-green-900/30"
                  onClick={() => executeCommand(command)}
                  disabled={isProcessing || !command.trim()}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>Run <ArrowRight className="h-3 w-3 ml-1" /></>
                  )}
                </Button>
              </div>
              
              {showSuggestions && (
                <div className="absolute z-10 w-full bg-black/95 border border-green-900/20 rounded-md mt-1 max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 hover:bg-green-900/20 cursor-pointer text-green-400 text-sm"
                      onClick={() => {
                        setCommand(suggestion);
                        setShowSuggestions(false);
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-green-400/80">Quick Commands</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start border-green-900/30 text-green-400 hover:bg-green-900/20"
                  onClick={() => setCommand('asc create crm')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Create CRM
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start border-green-900/30 text-green-400 hover:bg-green-900/20"
                  onClick={() => setCommand('asc add authentication')}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Add Auth
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start border-green-900/30 text-green-400 hover:bg-green-900/20"
                  onClick={() => setCommand('asc create dashboard')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start border-green-900/30 text-green-400 hover:bg-green-900/20"
                  onClick={() => setCommand('asc analyze codebase')}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze
                </Button>
              </div>
            </div>

            {currentProject && (
              <div className="rounded-lg bg-green-950/20 border border-green-900/20 p-4">
                <div className="flex items-center gap-2 text-sm text-green-400/80">
                  <FolderOpen className="h-4 w-4" />
                  <span>Current Project:</span>
                  <span className="font-medium text-green-400">{currentProject.name}</span>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <ScrollArea className="h-[400px]">
              <div className="space-y-6">
                {Object.entries(COMMAND_TEMPLATES).map(([key, category]) => (
                  <div key={key} className="space-y-3">
                    <div className="flex items-center gap-2 text-green-400">
                      <category.icon className="h-5 w-5" />
                      <h3 className="font-medium">{category.title}</h3>
                    </div>
                    <div className="grid gap-2">
                      {category.commands.map((cmd, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          className="justify-between border-green-900/30 text-green-400 hover:bg-green-900/20"
                          onClick={() => {
                            setCommand(cmd.cmd);
                            executeCommand(cmd.cmd);
                          }}
                          disabled={isProcessing}
                        >
                          <span className="text-sm font-mono">{cmd.cmd}</span>
                          <span className="text-xs text-green-400/60">{cmd.desc}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {commandHistory.length === 0 ? (
                  <p className="text-center text-green-400/60 py-8">No command history yet</p>
                ) : (
                  commandHistory.map((cmd, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      className="w-full justify-start font-mono text-sm text-green-400 hover:bg-green-900/20"
                      onClick={() => {
                        setCommand(cmd);
                        executeCommand(cmd);
                      }}
                      disabled={isProcessing}
                    >
                      <History className="h-4 w-4 mr-2 text-green-400/60" />
                      {cmd}
                    </Button>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ASCCommand;