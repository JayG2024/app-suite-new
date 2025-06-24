import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Lock, 
  Calendar, 
  Users, 
  DollarSign, 
  Clock,
  CheckCircle,
  Download,
  Phone,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  Share2,
  Shield,
  Sparkles,
  Building2,
  Target,
  TrendingUp,
  Award,
  Zap,
  MessageSquare,
  FileText,
  Code2,
  Rocket,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  Star,
  BarChart3,
  Brain,
  Layers,
  Settings
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ProposalData {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  industry: string;
  appType: string;
  currentChallenge: string;
  desiredFeatures: string[];
  teamSize: string;
  timeline: string;
  budget: string;
  additionalInfo?: string;
  createdAt: string;
  expiresAt: string;
  viewCount: number;
  lastViewedAt?: string;
  isProtected: boolean;
  accessCode?: string;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isMonthly?: boolean;
}

const Proposal = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  useEffect(() => {
    // Fetch proposal data
    const fetchProposal = async () => {
      try {
        // In production, this would be an API call
        // For now, we'll simulate with localStorage
        const storedProposal = localStorage.getItem(`proposal_${proposalId}`);
        
        
        if (!storedProposal) {
          setError("Proposal not found");
          setLoading(false);
          return;
        }

        const proposalData = JSON.parse(storedProposal);
        
        // Check if proposal is expired
        if (new Date(proposalData.expiresAt) < new Date()) {
          setError("This proposal has expired");
          setLoading(false);
          return;
        }

        // Update view count
        proposalData.viewCount = (proposalData.viewCount || 0) + 1;
        proposalData.lastViewedAt = new Date().toISOString();
        localStorage.setItem(`proposal_${proposalId}`, JSON.stringify(proposalData));

        setProposal(proposalData);
        setIsUnlocked(!proposalData.isProtected);
        setLoading(false);
      } catch (err) {
        setError("Error loading proposal");
        setLoading(false);
      }
    };

    if (proposalId) {
      fetchProposal();
    }
  }, [proposalId]);

  const handleAccessCode = () => {
    if (proposal && accessCode === proposal.accessCode) {
      setIsUnlocked(true);
      toast.success("Proposal unlocked successfully");
    } else {
      toast.error("Invalid access code");
    }
  };

  const copyShareLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    toast.success("Share link copied to clipboard");
  };

  const downloadPDF = async () => {
    // This would trigger PDF generation
    toast.success("Downloading proposal PDF...");
  };

  const getAvailableAddOns = (): AddOn[] => {
    return [
      {
        id: "additional-api",
        name: "Additional API Integration",
        description: "Connect to one additional third-party service beyond the 2 included integrations",
        price: 1500,
        category: "Integration"
      },
      {
        id: "data-migration",
        name: "Data Migration Service",
        description: "Import your existing data from spreadsheets, databases, or other systems",
        price: 750,
        category: "Migration"
      },
      {
        id: "emergency-support",
        name: "Emergency Support Button",
        description: "One-time setup of emergency button that routes directly to our human support team",
        price: 500,
        category: "Support"
      },
      {
        id: "automated-backups",
        name: "Automated Backup System",
        description: "Daily automated backups with one-click restore functionality",
        price: 500,
        category: "Data Protection"
      },
      {
        id: "training-package",
        name: "Advanced Training & Onboarding",
        description: "Comprehensive training program with videos, course modules, and new hire onboarding materials",
        price: 850,
        category: "Training"
      },
      {
        id: "hosting-standard",
        name: "Standard Business Hosting",
        description: "Professional hosting for all business applications with monitoring and maintenance",
        price: 199,
        category: "Hosting",
        isMonthly: true
      },
      {
        id: "hosting-premium",
        name: "Premium Enterprise Support",
        description: "Private support channel, app dashboard monitoring, and emergency phone access to founders",
        price: 500,
        category: "Premium Support",
        isMonthly: true
      }
    ];
  };

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const calculateTotalPrice = () => {
    const basePrice = parseInt(proposal?.budget || "0");
    const oneTimeAddOnsPrice = selectedAddOns.reduce((total, addOnId) => {
      const addOn = getAvailableAddOns().find(a => a.id === addOnId);
      return total + (!addOn?.isMonthly ? (addOn?.price || 0) : 0);
    }, 0);
    return basePrice + oneTimeAddOnsPrice;
  };

  const getMonthlySubscriptions = () => {
    return selectedAddOns
      .map(addOnId => getAvailableAddOns().find(a => a.id === addOnId))
      .filter(addOn => addOn?.isMonthly)
      .filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading proposal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Proposal Not Available</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => navigate("/")}>Return to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!proposal) return null;

  // Protected proposal - show access code form
  if (proposal.isProtected && !isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Protected Proposal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              This proposal for <strong>{proposal.companyName}</strong> is protected. 
              Please enter the access code provided in your email.
            </p>
            
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showAccessCode ? "text" : "password"}
                  placeholder="Enter access code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAccessCode()}
                />
                <button
                  type="button"
                  onClick={() => setShowAccessCode(!showAccessCode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showAccessCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button 
                onClick={handleAccessCode} 
                className="w-full"
                disabled={!accessCode}
              >
                Unlock Proposal
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Don't have the access code?</p>
              <Button variant="link" asChild>
                <a href={`mailto:jason@jaydus.ai?subject=Access Code Request - Proposal ${proposalId}`}>
                  Request Access Code
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate days until expiration
  const daysUntilExpiration = Math.ceil(
    (new Date(proposal.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  // Render the full proposal
  return (
    <div className="min-h-screen bg-background">
      {/* Security Notice Bar */}
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-muted-foreground">
                This proposal is private and expires in <strong>{daysUntilExpiration} days</strong>
              </span>
              <Badge variant="outline" className="text-xs">
                Viewed {proposal.viewCount} time{proposal.viewCount !== 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={copyShareLink}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button size="sm" onClick={downloadPDF}>
                <Download className="h-4 w-4 mr-1" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline" className="text-sm">Proposal ID: {proposal.id}</Badge>
            <Badge className="text-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              Personalized for {proposal.industry}
            </Badge>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Custom {getAppTypeLabel(proposal.appType)} Proposal
          </h1>
          <p className="text-2xl text-muted-foreground mb-2">
            Prepared exclusively for <span className="text-foreground font-semibold">{proposal.companyName}</span>
          </p>
          <p className="text-muted-foreground">
            {new Date(proposal.createdAt).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Executive Summary */}
        <Card className="mb-8 border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-lg">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Executive Summary</CardTitle>
                <CardDescription>Your custom solution overview</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-lg leading-relaxed">
              Dear {proposal.contactName},
            </p>
            <p className="leading-relaxed">
              Thank you for considering App Suite for your {proposal.appType} needs. After analyzing your requirements, 
              we're excited to present a comprehensive solution that will transform how {proposal.companyName} operates 
              in the {proposal.industry} industry.
            </p>
            <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Our Understanding of Your Challenge:
              </h4>
              <p className="text-lg italic text-muted-foreground">
                "{proposal.currentChallenge}"
              </p>
            </div>
            <p className="leading-relaxed">
              Our proposed {getAppTypeLabel(proposal.appType)} solution is specifically designed to address this challenge 
              while providing scalability for your future growth. With our AI-powered development approach, you'll receive 
              an enterprise-grade application that typically takes months to build, delivered in just {getDeliveryTimeframe(proposal.timeline)}.
            </p>
          </CardContent>
        </Card>

        {/* AI-Powered Development - The Ultimate Differentiator */}
        <Card className="mb-8 overflow-hidden border-2 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-lg">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">AI-Powered Development: The Ultimate Differentiator</CardTitle>
                <CardDescription>Why AI changes everything in custom software development</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                Traditional custom development agencies take 3-6 months and charge $50,000-$200,000 for what we deliver in 4 weeks at a fraction of the cost. 
                The secret? AI isn't just a tool for us—it's a fundamental transformation of how software gets built.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-red-500" />
                    Traditional Development
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <Clock className="h-4 w-4 text-red-500" />
                      <span className="text-red-700">3-6 months development time</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <DollarSign className="h-4 w-4 text-red-500" />
                      <span className="text-red-700">$50,000-$200,000+ costs</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <Users className="h-4 w-4 text-red-500" />
                      <span className="text-red-700">Large team requirements</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-red-700">High risk of scope creep</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-green-500" />
                    AI-Powered Development
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <Rocket className="h-4 w-4 text-green-500" />
                      <span className="text-green-700">4 weeks delivery timeline</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-700">Fixed pricing: ${parseInt(proposal.budget).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <Brain className="h-4 w-4 text-green-500" />
                      <span className="text-green-700">AI-augmented expert team</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-green-700">Guaranteed scope & timeline</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  How AI Transforms Our Process
                </h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-2">Intelligent Code Generation</p>
                    <p className="text-muted-foreground">AI writes 70% of boilerplate code, letting our experts focus on complex business logic</p>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Automated Testing & QA</p>
                    <p className="text-muted-foreground">AI generates comprehensive test suites and catches bugs before they reach production</p>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Real-time Optimization</p>
                    <p className="text-muted-foreground">AI continuously optimizes performance and suggests improvements during development</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About App Suite */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-lg">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">About App Suite</CardTitle>
                <CardDescription>Your trusted partner in AI-powered development</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-primary" />
                    Our Mission
                  </h4>
                  <p className="text-muted-foreground">
                    We believe every business deserves enterprise-grade software without enterprise costs or timelines. 
                    Our mission is to democratize custom software development through AI innovation.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    AI-First Approach
                  </h4>
                  <p className="text-muted-foreground">
                    We leverage Claude Sonnet 4, GPT-4, and Gemini as core development partners, 
                    enabling us to deliver enterprise-quality applications in weeks, not months.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Our Track Record
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="text-center p-3 bg-primary/5 rounded-lg">
                      <p className="text-2xl font-bold text-primary">100+</p>
                      <p className="text-sm text-muted-foreground">Apps Built</p>
                    </div>
                    <div className="text-center p-3 bg-primary/5 rounded-lg">
                      <p className="text-2xl font-bold text-primary">98%</p>
                      <p className="text-sm text-muted-foreground">Client Satisfaction</p>
                    </div>
                    <div className="text-center p-3 bg-primary/5 rounded-lg">
                      <p className="text-2xl font-bold text-primary">4 Weeks</p>
                      <p className="text-sm text-muted-foreground">Avg. Delivery</p>
                    </div>
                    <div className="text-center p-3 bg-primary/5 rounded-lg">
                      <p className="text-2xl font-bold text-primary">80%</p>
                      <p className="text-sm text-muted-foreground">Time Savings</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Overview Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Users className="h-8 w-8 text-primary" />
                <Badge variant="secondary">Primary Contact</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-lg">{proposal.contactName}</p>
              <p className="text-sm text-muted-foreground">{proposal.email}</p>
              {proposal.phone && <p className="text-sm text-muted-foreground">{proposal.phone}</p>}
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <DollarSign className="h-8 w-8 text-green-600" />
                <Badge variant="secondary">Investment</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-bold text-2xl text-primary">
                ${parseInt(proposal.budget).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">One-time payment</p>
              <p className="text-xs text-green-600 mt-1">Financing available</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Clock className="h-8 w-8 text-blue-600" />
                <Badge variant="secondary">Timeline</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-lg">{getTimelineLabel(proposal.timeline)}</p>
              <p className="text-sm text-muted-foreground">Fast-track delivery</p>
              <Progress value={25} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Calendar className="h-8 w-8 text-orange-600" />
                <Badge variant="secondary">Valid Until</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-lg">
                {new Date(proposal.expiresAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">{daysUntilExpiration} days remaining</p>
              <p className="text-xs text-orange-600 mt-1">Limited time offer</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Solution */}
        <Card className="mb-8 border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-lg">
                <Layers className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Your Custom {getAppTypeLabel(proposal.appType)} Solution</CardTitle>
                <CardDescription>Tailored specifically for {proposal.companyName}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h4 className="font-semibold mb-3 text-lg">Solution Overview</h4>
              <p className="text-muted-foreground leading-relaxed">
                We'll develop a comprehensive {getAppTypeLabel(proposal.appType)} that seamlessly integrates with your 
                existing workflow in the {proposal.industry} industry. This isn't a one-size-fits-all template – it's 
                a custom-built solution designed from the ground up to solve your specific challenges and scale with your business.
              </p>
            </div>

            {proposal.desiredFeatures.length > 0 && (
              <div>
                <h4 className="font-semibold mb-4 text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Core Features & Capabilities
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {proposal.desiredFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">{getFeatureLabel(feature)}</p>
                        <p className="text-sm text-muted-foreground mt-1">{getFeatureDescription(feature)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI-Powered Enhancements
              </h4>
              <p className="text-muted-foreground mb-4">
                Your application will leverage cutting-edge AI to provide intelligent automation and insights:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Smart Automation</p>
                    <p className="text-sm text-muted-foreground">Automate repetitive tasks and workflows</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Predictive Analytics</p>
                    <p className="text-sm text-muted-foreground">AI-driven insights and forecasting</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Natural Language Processing</p>
                    <p className="text-sm text-muted-foreground">Intelligent search and data extraction</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Real-time Reporting</p>
                    <p className="text-sm text-muted-foreground">Dynamic dashboards and insights</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Specifications */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-lg">
                <Settings className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Technical Specifications</CardTitle>
                <CardDescription>Enterprise-grade technology stack</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  Frontend Technology
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Framework:</span>
                    <span className="font-medium">React 18 with TypeScript</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">UI Library:</span>
                    <span className="font-medium">Tailwind CSS + shadcn/ui</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">State Management:</span>
                    <span className="font-medium">Zustand</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Build Tool:</span>
                    <span className="font-medium">Vite</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Backend Technology
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Runtime:</span>
                    <span className="font-medium">Node.js 20+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Database:</span>
                    <span className="font-medium">PostgreSQL with Prisma ORM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Authentication:</span>
                    <span className="font-medium">NextAuth.js</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hosting:</span>
                    <span className="font-medium">Vercel + Supabase</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security & Compliance
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>End-to-end encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>GDPR compliant data handling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>SOC 2 Type II certified hosting</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Role-based access control</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Regular security audits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>99.9% uptime SLA</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-600 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Investment Breakdown</CardTitle>
                <CardDescription>Transparent pricing with no hidden costs</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-2xl font-bold text-green-800">
                  Total Investment: ${parseInt(proposal.budget).toLocaleString()}
                </h4>
                <Badge className="bg-green-600 text-white px-3 py-1">
                  One-Time Payment
                </Badge>
              </div>
              <p className="text-green-700 text-sm">
                No monthly fees, no hidden costs, no ongoing subscription charges. 
                You own the application forever.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-4">What's Included:</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Complete Custom Development</p>
                      <p className="text-sm text-muted-foreground">Built from scratch for your needs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Full Source Code Ownership</p>
                      <p className="text-sm text-muted-foreground">Complete rights to your application</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">1 Year of Hosting & Support</p>
                      <p className="text-sm text-muted-foreground">Production hosting and maintenance included</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Team Training & Documentation</p>
                      <p className="text-sm text-muted-foreground">Complete training for your team</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Payment Options:</h4>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h5 className="font-medium text-green-600 mb-2">Option 1: Full Payment</h5>
                    <p className="text-2xl font-bold mb-1">${parseInt(proposal.budget).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Save 5% with upfront payment</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h5 className="font-medium mb-2">Option 2: Split Payment</h5>
                    <p className="text-lg font-semibold mb-1">
                      50% now, 50% at completion
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${Math.round(parseInt(proposal.budget) * 0.5).toLocaleString()} upfront, 
                      ${Math.round(parseInt(proposal.budget) * 0.5).toLocaleString()} on delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Choose App Suite */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-lg">
                <HeartHandshake className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Why Choose App Suite?</CardTitle>
                <CardDescription>The advantages that set us apart</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    True Ownership
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Unlike SaaS subscriptions, you own your application completely. No vendor lock-in, 
                    no monthly fees, no restrictions on usage or data export.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-primary" />
                    Lightning Fast Delivery
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Our AI-powered development process delivers enterprise-grade applications 
                    10x faster than traditional agencies, without compromising quality.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Transparent Pricing
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    No hourly billing surprises or scope creep charges. Our flat-rate pricing 
                    includes everything you need for a complete solution.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Future-Proof Technology
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Built with modern, scalable technologies that grow with your business. 
                    No outdated tech stack or migration headaches.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-3 text-center">Our Commitment to Excellence</h4>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary mb-1">100%</p>
                  <p className="text-sm text-muted-foreground">Client Satisfaction</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary mb-1">14 Days</p>
                  <p className="text-sm text-muted-foreground">Average Delivery</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary mb-1">∞</p>
                  <p className="text-sm text-muted-foreground">Ownership Duration</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Full Scope of Work */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-600 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Full Scope of Work</CardTitle>
                <CardDescription>Everything included in your custom application</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                What's Included in Your Project
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Complete Custom {getAppTypeLabel(proposal.appType)}</p>
                      <p className="text-sm text-muted-foreground">Built from scratch for your specific needs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">2 API Integrations Included</p>
                      <p className="text-sm text-muted-foreground">Connect your application to external services</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Mobile-Responsive Design</p>
                      <p className="text-sm text-muted-foreground">Works perfectly on all devices</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">User Authentication & Security</p>
                      <p className="text-sm text-muted-foreground">Secure login system with role-based access</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Database Design & Setup</p>
                      <p className="text-sm text-muted-foreground">Optimized data structure for your business</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Admin Dashboard</p>
                      <p className="text-sm text-muted-foreground">Full control panel for managing your application</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Data Export & Reporting</p>
                      <p className="text-sm text-muted-foreground">Export your data in multiple formats</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">1 Year Hosting & Support</p>
                      <p className="text-sm text-muted-foreground">Complete peace of mind for the first year</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Flexibility & Adaptability
              </h4>
              <p className="text-blue-700 leading-relaxed">
                We understand that requirements can evolve during development. Our agile, AI-powered approach allows us to 
                be flexible and adapt to changes without derailing the timeline or budget. The full scope of work will be 
                mapped out in detail during our discovery phase, ensuring we capture all your needs and expectations upfront.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-primary mb-1">2</p>
                <p className="text-sm font-medium mb-1">API Integrations</p>
                <p className="text-xs text-muted-foreground">Included in base price</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-primary mb-1">∞</p>
                <p className="text-sm font-medium mb-1">Revisions</p>
                <p className="text-xs text-muted-foreground">Until you're satisfied</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-primary mb-1">100%</p>
                <p className="text-sm font-medium mb-1">Source Code</p>
                <p className="text-xs text-muted-foreground">You own everything</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Development Timeline</CardTitle>
                <CardDescription>Your journey from concept to launch</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {getTimelinePhases().map((phase, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{phase.title}</h4>
                    <p className="text-muted-foreground mb-2">{phase.description}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">{phase.deliverable}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-primary/5 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-600" />
                Launch Guarantee
              </h4>
              <p className="text-sm text-muted-foreground">
                We guarantee your application will be delivered on time and to your specifications. 
                If we miss our deadline, you receive a full refund plus 20% compensation for the inconvenience.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-600 rounded-lg">
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Next Steps</CardTitle>
                <CardDescription>Ready to get started? Here's what happens next</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <Badge className="w-8 h-8 rounded-full flex items-center justify-center text-sm">1</Badge>
                <div>
                  <h4 className="font-semibold">Discovery Call</h4>
                  <p className="text-sm text-muted-foreground">
                    Schedule a 30-minute call to discuss your requirements in detail and answer any questions.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Badge className="w-8 h-8 rounded-full flex items-center justify-center text-sm">2</Badge>
                <div>
                  <h4 className="font-semibold">Contract & Payment</h4>
                  <p className="text-sm text-muted-foreground">
                    Sign the development agreement and submit initial payment to secure your project slot.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Badge className="w-8 h-8 rounded-full flex items-center justify-center text-sm">3</Badge>
                <div>
                  <h4 className="font-semibold">Project Kickoff</h4>
                  <p className="text-sm text-muted-foreground">
                    Begin development with daily progress updates and regular check-ins to ensure alignment.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add-Ons and Upgrades */}
        <Card className="mb-8 border-2 border-dashed border-primary/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Optional Add-Ons & Upgrades</CardTitle>
                <CardDescription>Enhance your application with additional features</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-green-800">
                    One-Time Investment: ${calculateTotalPrice().toLocaleString()}
                  </h4>
                  <p className="text-green-700 text-sm">
                    Base Price: ${parseInt(proposal.budget).toLocaleString()} 
                    {selectedAddOns.length > 0 && (
                      <span> + Add-ons: ${(calculateTotalPrice() - parseInt(proposal.budget)).toLocaleString()}</span>
                    )}
                  </p>
                  {getMonthlySubscriptions().length > 0 && (
                    <p className="text-blue-700 text-sm mt-1">
                      + Monthly: ${getMonthlySubscriptions().reduce((total, sub) => total + sub.price, 0)}/month
                    </p>
                  )}
                </div>
                {selectedAddOns.length > 0 && (
                  <Badge className="bg-green-600 text-white px-3 py-1">
                    {selectedAddOns.length} Add-on{selectedAddOns.length !== 1 ? 's' : ''} Selected
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {getAvailableAddOns().map((addOn) => (
                <div
                  key={addOn.id}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedAddOns.includes(addOn.id)
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-gray-200 hover:border-primary/50 hover:shadow-sm'
                  }`}
                  onClick={() => toggleAddOn(addOn.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedAddOns.includes(addOn.id)
                          ? 'border-primary bg-primary'
                          : 'border-gray-300'
                      }`}>
                        {selectedAddOns.includes(addOn.id) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">{addOn.category}</Badge>
                    </div>
                    <p className="font-bold text-lg text-primary">
                      {addOn.isMonthly ? `$${addOn.price}/mo` : `+$${addOn.price.toLocaleString()}`}
                    </p>
                  </div>
                  
                  <h4 className="font-semibold mb-2">{addOn.name}</h4>
                  <p className="text-sm text-muted-foreground">{addOn.description}</p>
                  
                  {selectedAddOns.includes(addOn.id) && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedAddOns.length > 0 && (
              <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-3">Selected Add-Ons Summary:</h4>
                <div className="space-y-2">
                  {selectedAddOns.map(addOnId => {
                    const addOn = getAvailableAddOns().find(a => a.id === addOnId);
                    return addOn ? (
                      <div key={addOnId} className="flex justify-between items-center">
                        <span className="text-sm">{addOn.name}</span>
                        <span className="font-medium">
                          {addOn.isMonthly ? `$${addOn.price}/mo` : `+$${addOn.price.toLocaleString()}`}
                        </span>
                      </div>
                    ) : null;
                  })}
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>One-Time Investment:</span>
                    <span className="text-primary">${calculateTotalPrice().toLocaleString()}</span>
                  </div>
                  {getMonthlySubscriptions().length > 0 && (
                    <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm font-semibold text-blue-800 mb-2">Monthly Subscriptions:</p>
                      {getMonthlySubscriptions().map(sub => (
                        <div key={sub.id} className="flex justify-between text-sm text-blue-700">
                          <span>{sub.name}</span>
                          <span>${sub.price}/month</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-700 text-sm">
                💡 <strong>Note:</strong> Add-ons can be added to your project at any time during development. 
                Prices shown are current rates and may be subject to change based on complexity and integration requirements.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="mb-6 opacity-90">
              Let's schedule a discovery call to finalize your requirements
            </p>
            {selectedAddOns.length > 0 && (
              <div className="mb-6 p-4 bg-white/10 rounded-lg">
                <p className="text-lg font-semibold mb-2">
                  Your Customized Investment: ${calculateTotalPrice().toLocaleString()}
                </p>
                <p className="text-sm opacity-80">
                  Base Application + {selectedAddOns.length} Selected Add-on{selectedAddOns.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <a href={`mailto:jason@jaydus.ai?subject=Proposal ${proposal.id} - ${proposal.companyName}${selectedAddOns.length > 0 ? ` (Total: $${calculateTotalPrice().toLocaleString()})` : ''}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email Us
                </a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <a href="tel:+1833277784">
                  <Phone className="h-4 w-4 mr-2" />
                  Call (833) APP-SUIT
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper functions
function getAppTypeLabel(appType: string): string {
  const types: Record<string, string> = {
    crm: 'CRM System',
    dashboard: 'Analytics Dashboard',
    inventory: 'Inventory Management',
    booking: 'Booking System',
    ecommerce: 'E-commerce Platform',
    project: 'Project Management',
    finance: 'Financial Management',
    custom: 'Custom Application'
  };
  return types[appType] || 'Custom Application';
}

function getFeatureLabel(feature: string): string {
  const features: Record<string, string> = {
    ai: 'AI Integration',
    auth: 'User Management',
    mobile: 'Mobile Responsive',
    api: 'API Integrations',
    analytics: 'Advanced Analytics',
    automation: 'Workflow Automation',
    notifications: 'Notifications',
    search: 'Advanced Search',
    export: 'Data Export',
    calendar: 'Calendar Integration',
    files: 'File Management',
    realtime: 'Real-time Updates'
  };
  return features[feature] || feature;
}

function getTimelinePhases() {
  return [
    {
      title: "Discovery & Planning - Week 1",
      description: "Requirements gathering, business analysis, and detailed project specification",
      deliverable: "Complete project specification & design mockups"
    },
    {
      title: "AI-Powered Development - Week 2",
      description: "Rapid development using AI code generation and automated architecture setup",
      deliverable: "Core application framework with database structure"
    },
    {
      title: "Feature Implementation - Week 3",
      description: "Complete feature development, API integrations, and user interface implementation",
      deliverable: "Fully functional application with all requested features"
    },
    {
      title: "Testing & Launch - Week 4",
      description: "Comprehensive testing, deployment, team training, and go-live support",
      deliverable: "Production-ready application with full documentation"
    }
  ];
}

export default Proposal;