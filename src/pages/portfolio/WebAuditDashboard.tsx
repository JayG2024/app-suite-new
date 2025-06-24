import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  Users, 
  Globe, 
  BarChart3, 
  Search, 
  Shield, 
  Zap,
  ChevronLeft,
  ChevronRight,
  Play,
  Download,
  Star,
  CheckCircle,
  TrendingUp,
  Eye,
  Code,
  Database,
  Smartphone,
  Lock
} from "lucide-react";
import SEO from "@/components/SEO";

const WebAuditDashboard = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Screenshots of the WebAudit application
  const screenshots = [
    {
      url: "/WebAuditDash - Page1.png",
      title: "Dashboard Overview",
      description: "Main dashboard with site performance metrics and audit summary"
    },
    {
      url: "/WebAuditDash - 2.png", 
      title: "SEO Analysis",
      description: "Comprehensive SEO audit with actionable recommendations"
    },
    {
      url: "/WebAudit Dash - 3.png",
      title: "Performance Metrics", 
      description: "Page speed analysis and Core Web Vitals tracking"
    },
    {
      url: "/WebAuditDash - 4.png",
      title: "Technical SEO",
      description: "Technical SEO issues detection and solutions"
    },
    {
      url: "/WebAuditDash- 5.png",
      title: "Competitor Analysis",
      description: "Competitive landscape analysis and benchmarking" 
    },
    {
      url: "/WebAudit - 6.png",
      title: "Report Generation",
      description: "Automated PDF report generation with branding"
    },
    {
      url: "/WebAudit - 7.png",
      title: "Client Portal",
      description: "White-label client portal for agencies"
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % screenshots.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  const appFeatures = [
    {
      icon: <Search className="h-5 w-5" />,
      title: "Comprehensive SEO Audit",
      description: "Deep analysis of on-page, technical, and off-page SEO factors"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Performance Monitoring", 
      description: "Real-time Core Web Vitals and page speed tracking"
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Advanced Analytics",
      description: "Custom dashboards with actionable insights and trends"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Security Scanning",
      description: "Vulnerability detection and security best practices"
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: "Mobile Optimization",
      description: "Mobile-first audit with responsive design analysis"
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Multi-Site Management",
      description: "Manage audits for multiple websites from one dashboard"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Team Collaboration",
      description: "Role-based access with team sharing and commenting"
    },
    {
      icon: <Download className="h-5 w-5" />,
      title: "White-Label Reports",
      description: "Branded PDF reports for client presentations"
    }
  ];

  const techStack = [
    { name: "React", category: "Frontend" },
    { name: "TypeScript", category: "Language" },
    { name: "Node.js", category: "Backend" },
    { name: "PostgreSQL", category: "Database" },
    { name: "Redis", category: "Caching" },
    { name: "Puppeteer", category: "Web Scraping" },
    { name: "Lighthouse", category: "Performance" },
    { name: "AWS", category: "Cloud" },
    { name: "Docker", category: "DevOps" },
    { name: "Chart.js", category: "Visualization" }
  ];

  const projectStats = [
    { label: "Development Time", value: "8 weeks", icon: <Calendar className="h-4 w-4" /> },
    { label: "Team Size", value: "25+ users", icon: <Users className="h-4 w-4" /> },
    { label: "Client Type", value: "SEO Agency", icon: <Globe className="h-4 w-4" /> },
    { label: "Package", value: "AI-Enhanced", icon: <Zap className="h-4 w-4" /> }
  ];

  return (
    <div>
      <SEO 
        title="WebAudit Dashboard - Portfolio Case Study | App Suite"
        description="Comprehensive SEO audit and web performance application built for digital agencies. Features automated auditing, white-label reports, and multi-site management."
        keywords="SEO audit tool, web performance dashboard, digital agency software, white-label SEO reports, technical SEO analysis"
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/solutions-weve-built" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Solutions
              </Link>
            </Button>
            <Badge className="bg-purple-100 text-purple-800">AI-Enhanced Package</Badge>
            <Badge variant="outline">Case Study</Badge>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">WebAudit Dashboard</h1>
              <p className="text-xl text-muted-foreground mb-6">
                Comprehensive SEO audit and web performance analysis platform built for digital marketing agencies. 
                Features automated auditing, competitor analysis, and white-label client reporting.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                {projectStats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                    {stat.icon}
                    <span className="text-sm font-medium">{stat.label}:</span>
                    <span className="text-sm text-primary font-semibold">{stat.value}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4">
                <Button size="lg" asChild>
                  <Link to="/get-started">Build Similar App</Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Play className="h-4 w-4 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-lg font-semibold">Live Application Preview</p>
                  <p className="text-sm text-muted-foreground">Protected for client privacy</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Available for Sale
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Screenshot Gallery */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Application Screenshots</h2>
          
          {/* Main Image Display */}
          <div className="relative mb-6">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative group">
              <img 
                src={screenshots[currentImageIndex].url}
                alt={screenshots[currentImageIndex].title}
                className="w-full h-full object-contain bg-white"
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              
              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {screenshots.length}
              </div>
            </div>
            
            {/* Image Description */}
            <div className="text-center mt-4">
              <h3 className="text-xl font-semibold mb-2">{screenshots[currentImageIndex].title}</h3>
              <p className="text-muted-foreground">{screenshots[currentImageIndex].description}</p>
            </div>
          </div>
          
          {/* Thumbnail Navigation */}
          <div className="grid grid-cols-7 gap-2">
            {screenshots.map((screenshot, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  currentImageIndex === index 
                    ? 'border-primary shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img 
                  src={screenshot.url}
                  alt={screenshot.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Project Overview */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Project Overview</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                The WebAudit Dashboard was built for a digital marketing agency that needed to streamline their SEO audit process 
                and provide professional reports to their 100+ clients. The previous manual process was taking their team 
                8+ hours per audit, and they wanted to reduce this to under 30 minutes while improving accuracy.
              </p>
              <p>
                Our solution combines automated web crawling, performance analysis, and AI-powered recommendations to deliver 
                comprehensive SEO audits instantly. The white-label design allows the agency to maintain their branding 
                throughout the client experience.
              </p>
              <p>
                <strong>Key Challenge Solved:</strong> Reducing manual audit time from 8 hours to 15 minutes while increasing 
                audit depth and accuracy. The application now processes over 500 audits monthly, saving the agency 4,000+ hours.
              </p>
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Project Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Time Savings</span>
                  <span className="font-semibold">95% reduction</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Monthly Audits</span>
                  <span className="font-semibold">500+ reports</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Client Satisfaction</span>
                  <span className="font-semibold">98% positive</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">ROI Timeline</span>
                  <span className="font-semibold">2 months</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Key Features & Capabilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {appFeatures.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Technology Stack</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {techStack.map((tech, index) => (
              <div key={index} className="text-center">
                <div className="bg-muted rounded-lg p-4 mb-2">
                  <div className="font-semibold">{tech.name}</div>
                  <div className="text-xs text-muted-foreground">{tech.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Projects CTA */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Need a Similar Application?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We can build a custom audit dashboard, analytics platform, or automated reporting system 
              tailored to your specific industry and workflow in 6-8 weeks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/get-started">Get Free Proposal</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">Schedule Consultation</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebAuditDashboard;