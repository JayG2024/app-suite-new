import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import SlideInSidebar from "./SlideInSidebar";
import { cn } from "@/lib/utils";
import {
  Phone,
  FileText,
  Loader2,
  Send,
  Bot,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  Download,
  User,
  Building,
  Target,
  Zap,
  Sparkles,
  Brain,
  MessageSquare,
  ArrowRight,
  Save as SaveIcon
} from "lucide-react";

interface ProjectScope {
  clientName: string;
  companyName: string;
  projectType: string;
  estimatedBudget: string;
  timeline: string;
  challenges: string[];
  proposedSolutions: string[];
  features: string[];
  benefits: string[];
  nextSteps: string[];
  recommendedPackage: 'starter' | 'professional' | 'enterprise' | 'custom';
  price: number;
}

interface CallAnalysis {
  summary: string;
  keyPoints: string[];
  clientNeeds: string[];
  projectScope: ProjectScope;
  proposal: string;
}

const PACKAGE_DETAILS = {
  starter: {
    name: 'Starter Package',
    price: 5000,
    features: [
      'Custom web application',
      'Up to 5 core features',
      'Mobile responsive design',
      'Basic integrations',
      '30-day delivery',
      '3 months support'
    ],
    ideal: 'Small businesses needing essential functionality'
  },
  professional: {
    name: 'Professional Package',
    price: 7500,
    features: [
      'Advanced custom application',
      'Up to 10 features',
      'AI-powered components',
      'Third-party integrations',
      'Advanced dashboards',
      '45-day delivery',
      '6 months support'
    ],
    ideal: 'Growing businesses needing advanced features'
  },
  enterprise: {
    name: 'Enterprise Package',
    price: 10000,
    features: [
      'Full enterprise solution',
      'Unlimited features',
      'AI automation',
      'Custom integrations',
      'Advanced analytics',
      'Multi-user roles',
      '60-day delivery',
      '12 months support'
    ],
    ideal: 'Established businesses needing comprehensive solutions'
  },
  custom: {
    name: 'Custom Enterprise',
    price: 15000,
    features: [
      'Fully customized solution',
      'Complex workflows',
      'Enterprise integrations',
      'Custom AI models',
      'Dedicated support',
      'Priority development',
      'Ongoing maintenance'
    ],
    ideal: 'Large organizations with specific requirements'
  }
};

const CallTranscriptAnalyzer = () => {
  const [transcript, setTranscript] = useState('');
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CallAnalysis | null>(null);
  const [showProposal, setShowProposal] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState<any[]>([]);

  const analyzeTranscript = async () => {
    if (!transcript.trim()) {
      toast.error('Please paste a call transcript');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch('/.netlify/functions/analyze-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          clientName,
          projectName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze transcript');
      }

      const result = await response.json();
      setAnalysis(result);
      
      // Save to history
      const newAnalysis = {
        id: Date.now().toString(),
        clientName: result.projectScope.clientName,
        companyName: result.projectScope.companyName,
        date: new Date().toISOString(),
        package: result.projectScope.recommendedPackage,
        price: result.projectScope.price
      };
      
      setSavedAnalyses([newAnalysis, ...savedAnalyses]);
      localStorage.setItem('call_analyses', JSON.stringify([newAnalysis, ...savedAnalyses]));
      
      toast.success('Call transcript analyzed successfully!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze transcript');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateProposal = () => {
    if (!analysis) return;
    setShowProposal(true);
  };

  const copyProposal = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis.proposal);
    toast.success('Proposal copied to clipboard!');
  };

  const downloadProposal = () => {
    if (!analysis) return;
    
    const blob = new Blob([analysis.proposal], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${analysis.projectScope.clientName}-proposal.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Proposal downloaded!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Call Transcript Analyzer</CardTitle>
                <CardDescription>
                  Analyze client calls and generate project scopes automatically
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-purple-600 border-purple-300">
              <Brain className="h-4 w-4 mr-1" />
              ASC.AI Powered
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Call Information</CardTitle>
              <CardDescription>
                Paste your call transcript and add client details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Client Name</Label>
                  <Input
                    placeholder="John Smith"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Project Name (Optional)</Label>
                  <Input
                    placeholder="CRM System"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Call Transcript</Label>
                <Textarea
                  placeholder="Paste your call transcript here..."
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Supports transcripts from any meeting platform (Zoom, Teams, Google Meet, etc.)
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setTranscript('');
                    setClientName('');
                    setProjectName('');
                    setAnalysis(null);
                  }}
                >
                  Clear
                </Button>
                <Button
                  onClick={analyzeTranscript}
                  disabled={isAnalyzing || !transcript.trim()}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Analyze Call
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analysis && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Analysis Results</CardTitle>
                  <Badge className={cn(
                    analysis.projectScope.recommendedPackage === 'starter' && 'bg-green-100 text-green-800',
                    analysis.projectScope.recommendedPackage === 'professional' && 'bg-blue-100 text-blue-800',
                    analysis.projectScope.recommendedPackage === 'enterprise' && 'bg-purple-100 text-purple-800',
                    analysis.projectScope.recommendedPackage === 'custom' && 'bg-orange-100 text-orange-800'
                  )}>
                    {PACKAGE_DETAILS[analysis.projectScope.recommendedPackage].name}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="summary">
                  <TabsList>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="scope">Project Scope</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Call Summary</h4>
                      <p className="text-sm text-muted-foreground">
                        {analysis.summary}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Key Points</h4>
                      <ul className="space-y-1">
                        {analysis.keyPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Client Needs</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.clientNeeds.map((need, i) => (
                          <Badge key={i} variant="secondary">
                            {need}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="scope" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Client</Label>
                        <p className="font-medium">{analysis.projectScope.clientName}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Company</Label>
                        <p className="font-medium">{analysis.projectScope.companyName}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Project Type</Label>
                        <p className="font-medium">{analysis.projectScope.projectType}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Timeline</Label>
                        <p className="font-medium">{analysis.projectScope.timeline}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Current Challenges</h4>
                      <ul className="space-y-1">
                        {analysis.projectScope.challenges.map((challenge, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Proposed Solutions</h4>
                      <ul className="space-y-1">
                        {analysis.projectScope.proposedSolutions.map((solution, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                            <span>{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="features" className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Recommended Features</h4>
                      <div className="space-y-2">
                        {analysis.projectScope.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                            <Sparkles className="h-4 w-4 text-purple-600" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Business Benefits</h4>
                      <div className="space-y-2">
                        {analysis.projectScope.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                            <Target className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="pricing" className="space-y-4">
                    <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          {PACKAGE_DETAILS[analysis.projectScope.recommendedPackage].name}
                        </h3>
                        <div className="text-right">
                          <p className="text-3xl font-bold">
                            ${analysis.projectScope.price.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">One-time payment</p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">
                        {PACKAGE_DETAILS[analysis.projectScope.recommendedPackage].ideal}
                      </p>

                      <div className="space-y-2">
                        {PACKAGE_DETAILS[analysis.projectScope.recommendedPackage].features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={generateProposal}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Proposal
                      </Button>
                      <Button onClick={generateProposal}>
                        <Send className="h-4 w-4 mr-2" />
                        Generate Proposal
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Package Guide */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>App Suite Packages</CardTitle>
              <CardDescription>
                Our standard offerings for custom business applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(PACKAGE_DETAILS).map(([key, pkg]) => (
                <div
                  key={key}
                  className={cn(
                    "p-3 rounded-lg border transition-colors",
                    analysis?.projectScope.recommendedPackage === key
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{pkg.name}</h4>
                    <Badge variant="secondary">
                      ${pkg.price.toLocaleString()}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {pkg.ideal}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Analyses */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Analyses</CardTitle>
              <CardDescription>
                Previously analyzed calls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {savedAnalyses.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No analyses yet
                    </p>
                  ) : (
                    savedAnalyses.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{item.clientName}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.companyName}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            ${item.price.toLocaleString()}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Proposal Sidebar */}
      <SlideInSidebar
        isOpen={showProposal}
        onClose={() => setShowProposal(false)}
        title="Generated Proposal"
        width="w-1/2"
      >
        {analysis && (
          <div className="p-6">
            <div className="flex justify-end gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={copyProposal}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={downloadProposal}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {analysis.proposal}
              </pre>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Next Steps</h4>
              <ul className="space-y-1">
                {analysis.projectScope.nextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </SlideInSidebar>
    </div>
  );
};

export default CallTranscriptAnalyzer;