import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, MessageSquare, FileText, BarChart3, Settings, Users, Sparkles } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // Simple authentication for now - in production, use proper auth
  const handleLogin = () => {
    if (loginForm.username === 'admin' && loginForm.password === 'appsuite2024') {
      setIsAuthenticated(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl">AI Brand Brain</CardTitle>
            <p className="text-muted-foreground">Admin Access Portal</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Username"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              <Brain className="h-4 w-4 mr-2" />
              Access AI Brain
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Demo: admin / appsuite2024
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI Brand Brain</h1>
                <p className="text-sm text-muted-foreground">App Suite Marketing Command Center</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="flex">
        <nav className="w-64 bg-white border-r min-h-screen">
          <div className="p-4">
            <Tabs defaultValue="chat" orientation="vertical" className="w-full">
              <TabsList className="grid w-full grid-cols-1 h-auto">
                <TabsTrigger value="chat" className="justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  AI Chat
                </TabsTrigger>
                <TabsTrigger value="content" className="justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Content Hub
                </TabsTrigger>
                <TabsTrigger value="proposals" className="justify-start">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Proposals
                </TabsTrigger>
                <TabsTrigger value="analytics" className="justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="team" className="justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Team
                </TabsTrigger>
                <TabsTrigger value="settings" className="justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;