import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Calendar, 
  Users, 
  Zap, 
  Shield, 
  Database, 
  BarChart3,
  ShoppingCart,
  FileText,
  MessageSquare,
  Briefcase,
  Home,
  Building2,
  Stethoscope,
  GraduationCap,
  Car,
  Utensils,
  Palette,
  Code2,
  DollarSign,
  Truck
} from "lucide-react";
import SEO from "@/components/SEO";

interface Application {
  id: string;
  title: string;
  category: string;
  industry: string;
  description: string;
  features: string[];
  technologies: string[];
  timeline: string;
  teamSize: string;
  image: string;
  liveDemo?: string;
  caseStudy?: string;
  package: "standard" | "ai-enhanced" | "enterprise";
  year: number;
}

const Examples = () => {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample applications portfolio
  const applications: Application[] = [
    {
      id: "webaudit-dashboard",
      title: "WebAudit Dashboard - SEO Analytics",
      category: "Analytics",
      industry: "Digital Marketing",
      description: "Comprehensive SEO audit and web performance analysis platform with automated reporting, competitor analysis, and white-label client dashboards.",
      features: ["SEO Audit Engine", "Performance Monitoring", "Competitor Analysis", "White-Label Reports", "Multi-Site Management", "Team Collaboration"],
      technologies: ["React", "Node.js", "PostgreSQL", "Puppeteer", "Lighthouse", "Redis", "AWS", "Chart.js"],
      timeline: "8 weeks",
      teamSize: "25+ users",
      image: "/WebAuditDash - Page1.png",
      liveDemo: "/portfolio/webaudit-dashboard",
      caseStudy: "/portfolio/webaudit-dashboard",
      package: "ai-enhanced",
      year: 2024
    },
    {
      id: "crm-suite",
      title: "SalesForce Pro - Custom CRM",
      category: "CRM",
      industry: "Professional Services",
      description: "Complete customer relationship management system with AI-powered lead scoring, automated follow-ups, and advanced analytics.",
      features: ["Lead Management", "AI Lead Scoring", "Email Automation", "Sales Pipeline", "Custom Reports", "Mobile App"],
      technologies: ["React", "Node.js", "PostgreSQL", "OpenAI GPT-4", "Redis", "AWS"],
      timeline: "6 weeks",
      teamSize: "15 users",
      image: "/api/placeholder/600/400",
      package: "ai-enhanced",
      year: 2024
    },
    {
      id: "inventory-ai",
      title: "SmartStock - AI Inventory Manager",
      category: "Inventory",
      industry: "Retail",
      description: "Intelligent inventory management with predictive analytics, automated reordering, and real-time stock tracking.",
      features: ["Predictive Analytics", "Auto-Reordering", "Barcode Scanning", "Multi-Location", "Supplier Integration", "Mobile Warehouse"],
      technologies: ["Next.js", "Python", "TensorFlow", "PostgreSQL", "Stripe API", "Vercel"],
      timeline: "8 weeks",
      teamSize: "25 users",
      image: "/api/placeholder/600/400",
      package: "enterprise",
      year: 2024
    },
    {
      id: "booking-system",
      title: "BookEasy - Appointment Scheduler",
      category: "Booking",
      industry: "Healthcare",
      description: "Advanced appointment booking system with patient management, automated reminders, and telehealth integration.",
      features: ["Online Booking", "Patient Portal", "SMS Reminders", "Telehealth", "Insurance Integration", "Analytics"],
      technologies: ["React", "Node.js", "MongoDB", "Twilio", "Zoom API", "Stripe"],
      timeline: "5 weeks",
      teamSize: "8 users",
      image: "/api/placeholder/600/400",
      package: "standard",
      year: 2024
    },
    {
      id: "ecommerce-platform",
      title: "ShopSmart - E-commerce Suite",
      category: "E-commerce",
      industry: "Retail",
      description: "Custom e-commerce platform with AI-powered product recommendations, advanced analytics, and multi-vendor support.",
      features: ["Product Catalog", "AI Recommendations", "Multi-Vendor", "Payment Gateway", "Order Management", "Analytics Dashboard"],
      technologies: ["Next.js", "Stripe", "PostgreSQL", "Redis", "Claude AI", "AWS S3"],
      timeline: "10 weeks",
      teamSize: "50+ users",
      image: "/api/placeholder/600/400",
      package: "enterprise",
      year: 2023
    },
    {
      id: "project-dashboard",
      title: "TaskFlow - Project Management",
      category: "Project Management",
      industry: "Technology",
      description: "Comprehensive project management dashboard with team collaboration, time tracking, and AI-powered insights.",
      features: ["Task Management", "Time Tracking", "Team Chat", "File Sharing", "Gantt Charts", "AI Insights"],
      technologies: ["React", "Node.js", "Socket.io", "PostgreSQL", "OpenAI", "Docker"],
      timeline: "7 weeks",
      teamSize: "30 users",
      image: "/api/placeholder/600/400",
      package: "ai-enhanced",
      year: 2024
    },
    {
      id: "finance-tracker",
      title: "MoneyWise - Financial Dashboard",
      category: "Finance",
      industry: "Finance",
      description: "Personal and business financial management with AI-powered insights, budgeting, and investment tracking.",
      features: ["Expense Tracking", "Budget Planning", "Investment Monitor", "AI Insights", "Tax Preparation", "Reports"],
      technologies: ["React", "Python", "FastAPI", "PostgreSQL", "Plaid API", "TensorFlow"],
      timeline: "6 weeks",
      teamSize: "12 users",
      image: "/api/placeholder/600/400",
      package: "ai-enhanced",
      year: 2024
    },
    {
      id: "learning-platform",
      title: "EduSmart - Learning Management",
      category: "Education",
      industry: "Education",
      description: "AI-powered learning management system with personalized learning paths, progress tracking, and interactive content.",
      features: ["Course Management", "AI Tutoring", "Progress Tracking", "Interactive Content", "Assessments", "Student Portal"],
      technologies: ["Vue.js", "Django", "PostgreSQL", "OpenAI", "Redis", "AWS"],
      timeline: "12 weeks",
      teamSize: "100+ users",
      image: "/api/placeholder/600/400",
      package: "enterprise",
      year: 2023
    },
    {
      id: "real-estate-crm",
      title: "PropManager - Real Estate CRM",
      category: "CRM",
      industry: "Real Estate",
      description: "Specialized CRM for real estate with property management, client tracking, and automated marketing campaigns.",
      features: ["Property Listings", "Client Management", "Marketing Automation", "Document Storage", "Commission Tracking", "Mobile App"],
      technologies: ["React Native", "Node.js", "MongoDB", "AWS", "Mailgun", "Stripe"],
      timeline: "8 weeks",
      teamSize: "20 users",
      image: "/api/placeholder/600/400",
      package: "ai-enhanced",
      year: 2024
    },
    {
      id: "restaurant-pos",
      title: "DineEasy - Restaurant POS",
      category: "POS",
      industry: "Food & Beverage",
      description: "Complete restaurant management system with POS, inventory, staff scheduling, and customer loyalty programs.",
      features: ["POS System", "Inventory Management", "Staff Scheduling", "Loyalty Program", "Online Ordering", "Analytics"],
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "Square API", "PWA"],
      timeline: "9 weeks",
      teamSize: "35 users",
      image: "/api/placeholder/600/400",
      package: "standard",
      year: 2023
    },
    {
      id: "hr-management",
      title: "PeopleFirst - HR Suite",
      category: "HR",
      industry: "Professional Services",
      description: "Complete HR management system with employee onboarding, performance tracking, and AI-powered recruitment.",
      features: ["Employee Portal", "Performance Reviews", "AI Recruitment", "Payroll Integration", "Time Tracking", "Document Management"],
      technologies: ["Angular", "C#", ".NET Core", "SQL Server", "Azure", "OpenAI"],
      timeline: "11 weeks",
      teamSize: "75 users",
      image: "/api/placeholder/600/400",
      package: "enterprise",
      year: 2023
    }
  ];

  const categories = [
    { id: "all", label: "All Applications", icon: BarChart3 },
    { id: "Analytics", label: "Analytics & SEO", icon: BarChart3 },
    { id: "CRM", label: "CRM Systems", icon: Users },
    { id: "Inventory", label: "Inventory Management", icon: Database },
    { id: "Booking", label: "Booking Systems", icon: Calendar },
    { id: "E-commerce", label: "E-commerce", icon: ShoppingCart },
    { id: "Project Management", label: "Project Management", icon: Briefcase },
    { id: "Finance", label: "Financial Apps", icon: DollarSign },
    { id: "Education", label: "Education Platforms", icon: GraduationCap },
    { id: "POS", label: "Point of Sale", icon: Truck },
    { id: "HR", label: "HR Management", icon: Building2 }
  ];

  const industries = [
    { id: "all", label: "All Industries", icon: Building2 },
    { id: "Digital Marketing", label: "Digital Marketing", icon: BarChart3 },
    { id: "Professional Services", label: "Professional Services", icon: Briefcase },
    { id: "Retail", label: "Retail", icon: ShoppingCart },
    { id: "Healthcare", label: "Healthcare", icon: Stethoscope },
    { id: "Technology", label: "Technology", icon: Code2 },
    { id: "Finance", label: "Finance", icon: DollarSign },
    { id: "Education", label: "Education", icon: GraduationCap },
    { id: "Real Estate", label: "Real Estate", icon: Home },
    { id: "Food & Beverage", label: "Food & Beverage", icon: Utensils }
  ];

  const packageColors = {
    standard: "bg-blue-100 text-blue-800",
    "ai-enhanced": "bg-purple-100 text-purple-800",
    enterprise: "bg-green-100 text-green-800"
  };

  const packageLabels = {
    standard: "Standard Package",
    "ai-enhanced": "AI-Enhanced Package",
    enterprise: "Enterprise Package"
  };

  // Filter applications
  const filteredApps = applications.filter(app => {
    const matchesCategory = selectedCategory === "all" || app.category === selectedCategory;
    const matchesIndustry = selectedIndustry === "all" || app.industry === selectedIndustry;
    const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesIndustry && matchesSearch;
  });

  const CategoryIcon = ({ category }: { category: string }) => {
    const categoryData = categories.find(cat => cat.id === category);
    const Icon = categoryData?.icon || BarChart3;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div>
      <SEO 
        title="Examples & Portfolio - App Suite"
        description="Explore our portfolio of 100+ custom applications. See real examples of CRM systems, inventory management, e-commerce platforms, and more built for businesses like yours."
        keywords="custom software examples, application portfolio, CRM examples, inventory management software, e-commerce platforms, project management tools"
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Our Application Portfolio</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore 100+ custom applications we've built for businesses across industries. 
            Each application is uniquely designed, fully owned by the client, and built to solve specific business challenges.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
              <Shield className="h-4 w-4 text-green-600" />
              <span>100% Code Ownership</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
              <Zap className="h-4 w-4 text-blue-600" />
              <span>6-8 Week Delivery</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
              <Users className="h-4 w-4 text-purple-600" />
              <span>98% Client Satisfaction</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications, features, or technologies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-background"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-background"
              >
                {industries.map(industry => (
                  <option key={industry.id} value={industry.id}>
                    {industry.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 6).map(category => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-3 w-3" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredApps.length} of {applications.length} applications
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Applications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <Card key={app.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg overflow-hidden relative">
                {app.image.startsWith('/') ? (
                  <img 
                    src={app.image} 
                    alt={app.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <CategoryIcon category={app.category} />
                      <p className="text-xs text-muted-foreground mt-2">Screenshot Coming Soon</p>
                    </div>
                  </div>
                )}
                {app.caseStudy && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Available
                  </div>
                )}
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {app.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{app.industry}</p>
                  </div>
                  <Badge className={`text-xs ${packageColors[app.package]}`}>
                    {packageLabels[app.package]}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {app.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {app.timeline}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {app.teamSize}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {app.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {app.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{app.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  {app.caseStudy ? (
                    <div className="space-y-2">
                      <Button className="w-full" size="sm" asChild>
                        <Link to={app.caseStudy}>
                          View Case Study
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        size="sm"
                        onClick={() => setSelectedApp(app)}
                      >
                        Quick View
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => setSelectedApp(app)}
                    >
                      View Details
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No applications found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedIndustry("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-muted/50 rounded-lg p-8 mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Build Your Custom Application?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Every application in our portfolio started with a business challenge just like yours. 
            Let's discuss how we can build a custom solution that you'll own completely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/get-started">Get Free Proposal</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">Schedule Consultation</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedApp.title}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* App Image */}
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <CategoryIcon category={selectedApp.category} />
                  <p className="text-sm text-muted-foreground mt-2">Application Screenshot</p>
                </div>
              </div>
              
              {/* App Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Project Overview</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Industry:</span>
                      <span>{selectedApp.industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{selectedApp.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Timeline:</span>
                      <span>{selectedApp.timeline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Team Size:</span>
                      <span>{selectedApp.teamSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Package:</span>
                      <Badge className={packageColors[selectedApp.package]}>
                        {packageLabels[selectedApp.package]}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedApp.description}
                  </p>
                </div>
              </div>
              
              {/* Features */}
              <div>
                <h3 className="font-semibold mb-3">Key Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedApp.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Technologies */}
              <div>
                <h3 className="font-semibold mb-3">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* CTA */}
              <div className="bg-muted/50 rounded-lg p-6 text-center">
                <h4 className="font-semibold mb-2">Interested in a similar solution?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  We can build a custom application like this for your business in 6-8 weeks.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button asChild>
                    <Link to="/get-started">Get Free Proposal</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/contact">Schedule Call</Link>
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Examples;