import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import SlideInSidebar from "./SlideInSidebar";
import { cn } from "@/lib/utils";
import { 
  Cloud, 
  Rocket, 
  Globe, 
  Database, 
  GitBranch,
  Terminal,
  Loader2,
  Check,
  AlertCircle,
  ExternalLink,
  Copy,
  PlayCircle,
  Settings,
  CreditCard,
  Zap,
  Server,
  Shield,
  Clock,
  DollarSign,
  Package,
  ArrowRight,
  CheckCircle,
  XCircle,
  RefreshCw,
  Link,
  Key,
  FileCode,
  BarChart3
} from "lucide-react";

interface Platform {
  id: string;
  name: string;
  logo: string;
  description: string;
  bestFor: string[];
  pricing: string;
  features: string[];
  limitations: string[];
  color: string;
}

interface Deployment {
  id: string;
  projectName: string;
  clientName: string;
  platform: string;
  status: 'deploying' | 'active' | 'failed' | 'paused';
  url?: string;
  createdAt: string;
  lastDeployed?: string;
  environment: 'production' | 'staging' | 'development';
  framework: string;
  database?: string;
  monthlyCoset?: number;
}

interface DeploymentConfig {
  projectName: string;
  clientName: string;
  platform: string;
  framework: string;
  database: string;
  githubRepo: string;
  envVars: Record<string, string>;
  domain?: string;
}

const platforms: Platform[] = [
  {
    id: 'netlify',
    name: 'Netlify',
    logo: '🔷',
    description: 'Best for static sites, JAMstack apps, and serverless functions',
    bestFor: ['CRM Apps', 'Business Dashboards', 'Marketing Sites', 'Documentation'],
    pricing: '$19/user/month',
    features: [
      'One-click deploys',
      'Serverless functions',
      'Form handling',
      'Identity/Auth',
      'Neon DB integration',
      'Split testing'
    ],
    limitations: [
      'No Docker support',
      'Limited to static/JAMstack',
      '125k function requests/month'
    ],
    color: 'bg-teal-500'
  },
  {
    id: 'vercel',
    name: 'Vercel',
    logo: '▲',
    description: 'Optimized for Next.js, edge functions, and AI applications',
    bestFor: ['AI Apps', 'GEO Analytics', 'Real-time Apps', 'API Routes'],
    pricing: '$20/user/month + usage',
    features: [
      'Edge Functions globally',
      'Streaming responses',
      'Built-in analytics',
      'Preview deployments',
      'KV Storage',
      'Postgres/Blob storage'
    ],
    limitations: [
      'More expensive at scale',
      'Vendor lock-in for some features',
      'Complex pricing'
    ],
    color: 'bg-black'
  },
  {
    id: 'railway',
    name: 'Railway',
    logo: '🚂',
    description: 'Full-stack platform for containerized apps and databases',
    bestFor: ['Backend APIs', 'Microservices', 'Cron Jobs', 'Complex Apps'],
    pricing: '$5/month + usage',
    features: [
      'Any Docker container',
      'Multiple databases',
      'Background workers',
      'Private networking',
      'Cron jobs',
      'CLI deployment'
    ],
    limitations: [
      'Not for static sites',
      'Can get expensive',
      'Less CDN coverage'
    ],
    color: 'bg-purple-600'
  }
];

const frameworks = [
  { id: 'react', name: 'React', icon: '⚛️' },
  { id: 'nextjs', name: 'Next.js', icon: '▲' },
  { id: 'vue', name: 'Vue.js', icon: '💚' },
  { id: 'angular', name: 'Angular', icon: '🅰️' },
  { id: 'svelte', name: 'Svelte', icon: '🔥' },
  { id: 'static', name: 'Static HTML', icon: '📄' },
];

const databases = [
  { id: 'neon', name: 'Neon PostgreSQL', icon: '🐘' },
  { id: 'supabase', name: 'Supabase', icon: '⚡' },
  { id: 'planetscale', name: 'PlanetScale', icon: '🪐' },
  { id: 'mongodb', name: 'MongoDB Atlas', icon: '🍃' },
  { id: 'redis', name: 'Redis', icon: '♦️' },
  { id: 'none', name: 'No Database', icon: '❌' },
];

const DeploymentManager = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([
    {
      id: '1',
      projectName: 'PPOK Pharmacy CRM',
      clientName: 'PPOK',
      platform: 'netlify',
      status: 'active',
      url: 'https://ppok-crm.netlify.app',
      createdAt: '2024-01-15',
      lastDeployed: '2024-02-20',
      environment: 'production',
      framework: 'react',
      database: 'neon',
      monthlyCoset: 19
    },
    {
      id: '2',
      projectName: 'GEO Analytics Platform',
      clientName: 'Internal',
      platform: 'vercel',
      status: 'deploying',
      createdAt: '2024-02-25',
      environment: 'staging',
      framework: 'nextjs',
      database: 'neon',
      monthlyCoset: 20
    }
  ]);

  const [showNewDeployment, setShowNewDeployment] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('netlify');
  const [deploymentStep, setDeploymentStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  
  const [config, setConfig] = useState<DeploymentConfig>({
    projectName: '',
    clientName: '',
    platform: 'netlify',
    framework: 'react',
    database: 'neon',
    githubRepo: '',
    envVars: {
      'VITE_API_URL': '',
      'DATABASE_URL': '',
    },
    domain: ''
  });

  const deploymentScript = `#!/bin/bash
# Auto-deployment script for ${config.platform}
# Generated by App Suite Deployment Manager

PROJECT_NAME="${config.projectName.toLowerCase().replace(/\s+/g, '-')}"
CLIENT_NAME="${config.clientName}"
PLATFORM="${config.platform}"
FRAMEWORK="${config.framework}"
DATABASE="${config.database}"
GITHUB_REPO="${config.githubRepo}"

echo "🚀 Starting deployment for $CLIENT_NAME - $PROJECT_NAME"

# Platform-specific deployment
case $PLATFORM in
  "netlify")
    echo "📦 Deploying to Netlify..."
    
    # Install Netlify CLI if not exists
    if ! command -v netlify &> /dev/null; then
      npm install -g netlify-cli
    fi
    
    # Create new site
    netlify init --manual
    
    # Link to GitHub
    netlify link --git-url=$GITHUB_REPO
    
    # Set environment variables
    ${Object.entries(config.envVars).map(([key, value]) => 
      `netlify env:set ${key} "${value}"`
    ).join('\n    ')}
    
    # Deploy
    netlify deploy --prod
    
    # Set up Neon database if selected
    ${config.database === 'neon' ? `
    # Connect Neon database
    echo "🐘 Setting up Neon PostgreSQL..."
    netlify addons:create neon
    netlify env:set DATABASE_URL $(netlify env:get NEON_DATABASE_URL)
    ` : ''}
    ;;
    
  "vercel")
    echo "▲ Deploying to Vercel..."
    
    # Install Vercel CLI
    if ! command -v vercel &> /dev/null; then
      npm install -g vercel
    fi
    
    # Deploy with environment variables
    vercel --yes \\
      ${Object.entries(config.envVars).map(([key, value]) => 
        `--env ${key}="${value}" \\`
      ).join('\n      ')}
      --name=$PROJECT_NAME
    
    # Link to GitHub for auto-deployments
    vercel git connect
    ;;
    
  "railway")
    echo "🚂 Deploying to Railway..."
    
    # Install Railway CLI
    if ! command -v railway &> /dev/null; then
      npm install -g @railway/cli
    fi
    
    # Login and create project
    railway login
    railway init -n "$PROJECT_NAME"
    
    # Add services
    ${config.database !== 'none' ? `railway add -p postgresql` : ''}
    
    # Deploy
    railway up
    ;;
esac

echo "✅ Deployment complete!"
echo "📋 Next steps:"
echo "   1. Configure custom domain"
echo "   2. Set up SSL certificate"
echo "   3. Enable auto-deployments"
echo "   4. Configure monitoring"
`;

  const handleDeploy = async () => {
    setIsDeploying(true);
    
    // Simulate deployment process
    const steps = [
      'Creating project...',
      'Configuring environment...',
      'Connecting database...',
      'Building application...',
      'Deploying to platform...',
      'Configuring domain...'
    ];
    
    for (let i = 0; i < steps.length; i++) {
      toast.loading(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Add to deployments
    const newDeployment: Deployment = {
      id: Date.now().toString(),
      projectName: config.projectName,
      clientName: config.clientName,
      platform: config.platform,
      status: 'active',
      url: `https://${config.projectName.toLowerCase().replace(/\s+/g, '-')}.${config.platform}.app`,
      createdAt: new Date().toISOString(),
      lastDeployed: new Date().toISOString(),
      environment: 'production',
      framework: config.framework,
      database: config.database,
      monthlyCoset: config.platform === 'netlify' ? 19 : config.platform === 'vercel' ? 20 : 5
    };
    
    setDeployments([...deployments, newDeployment]);
    setIsDeploying(false);
    setShowNewDeployment(false);
    toast.success('Deployment successful! 🎉');
    
    // Reset form
    setConfig({
      projectName: '',
      clientName: '',
      platform: 'netlify',
      framework: 'react',
      database: 'neon',
      githubRepo: '',
      envVars: {
        'VITE_API_URL': '',
        'DATABASE_URL': '',
      },
      domain: ''
    });
    setDeploymentStep(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'deploying': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const copyScript = () => {
    navigator.clipboard.writeText(deploymentScript);
    toast.success('Deployment script copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Deployment Manager</CardTitle>
              <CardDescription>
                Deploy and manage client applications across platforms
              </CardDescription>
            </div>
            <Button onClick={() => setShowNewDeployment(true)}>
              <Rocket className="h-4 w-4 mr-2" />
              New Deployment
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="deployments">
            <TabsList>
              <TabsTrigger value="deployments">Active Deployments</TabsTrigger>
              <TabsTrigger value="platforms">Platform Guide</TabsTrigger>
              <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="deployments" className="space-y-4">
              {deployments.map((deployment) => (
                <Card key={deployment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">
                          {platforms.find(p => p.id === deployment.platform)?.logo}
                        </div>
                        <div>
                          <h3 className="font-semibold">{deployment.projectName}</h3>
                          <p className="text-sm text-muted-foreground">{deployment.clientName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(deployment.status)}>
                          {deployment.status}
                        </Badge>
                        <Badge variant="outline">{deployment.environment}</Badge>
                        {deployment.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(deployment.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Framework:</span>
                        <p className="font-medium">{deployment.framework}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Database:</span>
                        <p className="font-medium">{deployment.database || 'None'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Monthly Cost:</span>
                        <p className="font-medium">${deployment.monthlyCoset || 0}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Deploy:</span>
                        <p className="font-medium">
                          {deployment.lastDeployed ? new Date(deployment.lastDeployed).toLocaleDateString() : 'Never'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="platforms" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {platforms.map((platform) => (
                  <Card key={platform.id} className="relative overflow-hidden">
                    <div className={cn("absolute top-0 left-0 right-0 h-1", platform.color)} />
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <span className="text-2xl">{platform.logo}</span>
                          {platform.name}
                        </CardTitle>
                        <Badge variant="secondary">{platform.pricing}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{platform.description}</p>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-2">Best For:</h4>
                        <div className="flex flex-wrap gap-1">
                          {platform.bestFor.map((use, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {use}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-2">Features:</h4>
                        <ul className="text-xs space-y-1">
                          {platform.features.slice(0, 4).map((feature, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle>Platform Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-teal-500">CRM/Business Apps</Badge>
                    <div>
                      <p className="font-medium">Use Netlify + Neon</p>
                      <p className="text-sm text-muted-foreground">
                        One-click setup, predictable costs, perfect for $5K-$10K projects
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Badge className="bg-black text-white">AI/Analytics Apps</Badge>
                    <div>
                      <p className="font-medium">Use Vercel</p>
                      <p className="text-sm text-muted-foreground">
                        Edge functions, streaming responses, built-in analytics for GEO platform
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Badge className="bg-purple-600">Complex Backend</Badge>
                    <div>
                      <p className="font-medium">Use Railway</p>
                      <p className="text-sm text-muted-foreground">
                        Docker support, background jobs, multiple databases
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="costs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Platform Costs</CardTitle>
                  <CardDescription>Current spending across all deployments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🔷</span>
                        <span>Netlify</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$57/month</p>
                        <p className="text-xs text-muted-foreground">3 projects</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">▲</span>
                        <span>Vercel</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$20/month</p>
                        <p className="text-xs text-muted-foreground">1 project</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🚂</span>
                        <span>Railway</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$0/month</p>
                        <p className="text-xs text-muted-foreground">0 projects</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Total Monthly Cost</span>
                        <span className="text-xl font-bold">$77/month</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* New Deployment Sidebar */}
      <SlideInSidebar
        isOpen={showNewDeployment}
        onClose={() => setShowNewDeployment(false)}
        title="New Deployment"
        width="w-1/2"
      >
        <div className="p-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  deploymentStep >= step 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={cn(
                    "w-full h-1 mx-2",
                    deploymentStep > step ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Platform Selection */}
          {deploymentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Choose Platform</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select the best platform for your project type
                </p>
              </div>
              
              <div className="space-y-3">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-colors",
                      selectedPlatform === platform.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => {
                      setSelectedPlatform(platform.id);
                      setConfig({ ...config, platform: platform.id });
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{platform.logo}</span>
                      <div className="flex-1">
                        <h4 className="font-medium">{platform.name}</h4>
                        <p className="text-sm text-muted-foreground">{platform.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <span className="font-medium">{platform.pricing}</span>
                          <span className="text-muted-foreground">
                            Best for: {platform.bestFor[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => setDeploymentStep(2)}>
                  Next: Project Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Project Configuration */}
          {deploymentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Project Configuration</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure your project details and technology stack
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Project Name</Label>
                    <Input
                      value={config.projectName}
                      onChange={(e) => setConfig({ ...config, projectName: e.target.value })}
                      placeholder="My Awesome CRM"
                    />
                  </div>
                  <div>
                    <Label>Client Name</Label>
                    <Input
                      value={config.clientName}
                      onChange={(e) => setConfig({ ...config, clientName: e.target.value })}
                      placeholder="Acme Corp"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>GitHub Repository</Label>
                  <Input
                    value={config.githubRepo}
                    onChange={(e) => setConfig({ ...config, githubRepo: e.target.value })}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Framework</Label>
                    <Select 
                      value={config.framework} 
                      onValueChange={(value) => setConfig({ ...config, framework: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {frameworks.map((framework) => (
                          <SelectItem key={framework.id} value={framework.id}>
                            <span className="flex items-center gap-2">
                              <span>{framework.icon}</span>
                              {framework.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Database</Label>
                    <Select 
                      value={config.database} 
                      onValueChange={(value) => setConfig({ ...config, database: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {databases.map((database) => (
                          <SelectItem key={database.id} value={database.id}>
                            <span className="flex items-center gap-2">
                              <span>{database.icon}</span>
                              {database.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>Custom Domain (optional)</Label>
                  <Input
                    value={config.domain}
                    onChange={(e) => setConfig({ ...config, domain: e.target.value })}
                    placeholder="app.example.com"
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setDeploymentStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setDeploymentStep(3)}>
                  Next: Environment
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Environment Variables */}
          {deploymentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Environment Variables</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure environment variables for your deployment
                </p>
              </div>
              
              <div className="space-y-4">
                {Object.entries(config.envVars).map(([key, value]) => (
                  <div key={key}>
                    <Label>{key}</Label>
                    <Input
                      value={value}
                      onChange={(e) => setConfig({
                        ...config,
                        envVars: { ...config.envVars, [key]: e.target.value }
                      })}
                      placeholder={`Enter ${key}`}
                    />
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => {
                    const newKey = prompt('Environment variable name:');
                    if (newKey) {
                      setConfig({
                        ...config,
                        envVars: { ...config.envVars, [newKey]: '' }
                      });
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variable
                </Button>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setDeploymentStep(2)}>
                  Back
                </Button>
                <Button onClick={() => setDeploymentStep(4)}>
                  Next: Review
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Deploy */}
          {deploymentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Review & Deploy</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Review your configuration and deploy
                </p>
              </div>
              
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Platform:</span>
                      <p className="font-medium">{platforms.find(p => p.id === config.platform)?.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Framework:</span>
                      <p className="font-medium">{frameworks.find(f => f.id === config.framework)?.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Database:</span>
                      <p className="font-medium">{databases.find(d => d.id === config.database)?.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Monthly Cost:</span>
                      <p className="font-medium">
                        ${config.platform === 'netlify' ? 19 : config.platform === 'vercel' ? 20 : 5}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-900 text-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Deployment Script</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-white border-white hover:bg-white hover:text-black"
                      onClick={copyScript}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs overflow-x-auto">
                    <code>{deploymentScript}</code>
                  </pre>
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setDeploymentStep(3)}>
                  Back
                </Button>
                <Button onClick={handleDeploy} disabled={isDeploying}>
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
            </div>
          )}
        </div>
      </SlideInSidebar>
    </div>
  );
};

export default DeploymentManager;