import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEO from "@/components/SEO";
import BusinessPlanRequestForm from "@/components/BusinessPlanRequestForm";
import ProposalButton from "@/components/ProposalButton";
import { 
  FileSignature, 
  Brain, 
  Shield, 
  BarChart3, 
  FileText, 
  AlertTriangle,
  Calendar,
  Zap,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle,
  Crown,
  Star,
  Sparkles,
  Code,
  Target,
  ArrowRight,
  ExternalLink
} from "lucide-react";

const SolutionsWeveBuilt = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState('products');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  // Our own SaaS products that we keep and operate
  const ownProducts = [
    {
      id: "jaydus-ai",
      name: "Jaydus AI",
      tagline: "Advanced AI Assistant Platform",
      description: "Comprehensive AI platform providing intelligent assistance, automation, and insights for businesses and individuals.",
      status: "live",
      category: "ai",
      revenue: "Growing",
      users: "1000+ users",
      features: ["AI Chat Assistant", "Document Processing", "Workflow Automation", "Enterprise Integration"],
      icon: Brain,
      color: "bg-purple-500",
      link: "https://jaydus.ai"
    },
    {
      id: "signai",
      name: "SignAI",
      tagline: "AI-Powered E-Signature Platform",
      description: "The first AI-powered e-signature platform with intelligent document analysis, risk detection, and automated field placement.",
      status: "coming-soon",
      category: "productivity",
      revenue: "In Development",
      users: "Pre-launch",
      features: ["AI Document Generation", "Smart Field Detection", "Risk Analysis", "Behavioral Analytics"],
      icon: FileSignature,
      color: "bg-blue-500",
      link: "#"
    }
  ];

  // Solutions available for purchase (business ideas + customization)
  const availableForPurchase = [
    {
      id: "signai",
      name: "SignAI",
      tagline: "AI-Powered E-Signature Platform",
      description: "Complete AI-powered e-signature platform with intelligent document analysis, risk detection, and automated field placement. Business concept with core functionality built - will be fully customized for your brand and requirements.",
      price: "$18,000",
      category: "productivity",
      features: ["AI Document Generation", "Smart Field Detection", "Risk Analysis", "Behavioral Analytics"],
      icon: FileSignature,
      color: "bg-blue-500",
      marketSize: "$5.5B E-signature Market (25% growth)",
      revenueModel: "$29-299/month per user",
      // images: ["/Screen Shots/SignAI - 1.png", "/Screen Shots/SignAI -2.png", "/Screen Shots/SignAI -3.png", "/Screen Shots/SignAI - 4.png"] // Temporarily disabled
    },
    {
      id: "analytics-suite",
      name: "Business Analytics Suite",
      tagline: "Complete Business Intelligence Platform",
      description: "Advanced analytics dashboard with AI-powered insights, custom reporting, and real-time data visualization. Core framework built - will be tailored to your specific business metrics and branding.",
      price: "$22,000",
      category: "analytics",
      features: ["Custom Dashboards", "AI Insights", "Real-time Analytics", "White-label Ready"],
      icon: BarChart3,
      color: "bg-purple-500",
      marketSize: "$25B Business Intelligence Market",
      revenueModel: "$49-199/month SaaS",
      // images: ["/WebAuditDash - Page1.png", "/WebAudit Dash - 3.png", "/WebAuditDash - 2.png"] // Temporarily disabled
    },
    {
      id: "project-hub",
      name: "ProjectHub Pro",
      tagline: "AI-Enhanced Project Management",
      description: "Next-generation project management with AI task automation, smart scheduling, and predictive delivery dates. Foundation built - will be customized for your workflow and team structure.",
      price: "$25,000",
      category: "productivity", 
      features: ["AI Task Management", "Smart Scheduling", "Team Collaboration", "Predictive Analytics"],
      icon: Target,
      color: "bg-green-500",
      marketSize: "$6.1B Project Management Market",
      revenueModel: "$19-99/month per user",
      // images: ["/placeholder.svg", "/placeholder.svg"] // Temporarily disabled
    },
    {
      id: "content-engine",
      name: "ContentEngine AI",
      tagline: "Automated Content Creation Platform", 
      description: "AI-powered content creation suite for blogs, social media, marketing copy, and SEO-optimized articles. Core AI engine built - will be branded and customized for your content strategy.",
      price: "$20,000",
      category: "marketing",
      features: ["AI Content Generation", "SEO Optimization", "Multi-platform Publishing", "Brand Voice Training"],
      icon: Brain,
      color: "bg-orange-500",
      marketSize: "$16.6B Content Marketing Market",
      revenueModel: "$29-199/month SaaS",
      // images: ["/placeholder.svg", "/placeholder.svg"] // Temporarily disabled
    }
  ];


  const categories = [
    { id: "all", label: "All Solutions" },
    { id: "productivity", label: "Productivity" },
    { id: "analytics", label: "Analytics" },
    { id: "marketing", label: "Marketing" },
    { id: "finance", label: "Finance" }
  ];

  const handleContactAboutPurchase = (productName: string) => {
    window.open(`/contact?subject=Purchase ${productName}&type=purchase`, '_blank');
  };

  const handleRequestBusinessPlan = (productName: string) => {
    setSelectedProduct(productName);
    setIsFormOpen(true);
  };

  const handlePurchaseBusinessConcept = () => {
    setSelectedProduct('');
    setIsFormOpen(true);
  };


  return (
    <div className="container mx-auto px-4 py-16">
      <SEO 
        title="Solutions We've Built - App Suite Portfolio" 
        description="Explore App Suite's portfolio of SaaS products, available solutions for purchase, and custom application case studies. See what we can build for your business." 
      />
      
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
          <Target className="h-6 w-6 text-primary mr-2" />
          <span className="text-primary font-medium">Solutions We've Built</span>
        </div>
        <h1 className="text-4xl font-bold mb-6">Our Portfolio of Innovation</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          From our own SaaS products to complete business solutions available for purchase, see the range of applications we've built and the problems we solve.
        </p>
      </div>

      {/* Category Filter - Hidden for now until more products are added */}

      <Tabs defaultValue="our-products" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="our-products" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Our Products
          </TabsTrigger>
          <TabsTrigger value="available-purchase" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Available for Purchase
          </TabsTrigger>
        </TabsList>

        {/* Our Products Tab */}
        <TabsContent value="our-products" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">SaaS Products We Own & Operate</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These are our flagship products that we've built, launched, and continue to operate. They demonstrate our capability to build enterprise-grade SaaS applications.
            </p>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
            {ownProducts.map((product) => (
              <Card key={product.id} className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className={
                    product.status === "live" 
                      ? "bg-green-100 text-green-700 border-green-300"
                      : "bg-orange-100 text-orange-700 border-orange-300"
                  }>
                    {product.status === "live" ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Live Product
                      </>
                    ) : (
                      <>
                        <Calendar className="h-3 w-3 mr-1" />
                        Coming Soon
                      </>
                    )}
                  </Badge>
                </div>
                
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-3 ${product.color} rounded-lg text-white`}>
                      <product.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{product.tagline}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <p className="text-sm leading-relaxed">{product.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Status</div>
                      <div className="font-medium text-green-600">{product.revenue}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Users</div>
                      <div className="font-medium">{product.users}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      Key Features
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button asChild className="flex-1">
                      <a href={product.link} target="_blank" rel="noopener noreferrer">
                        Try {product.name}
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                    <Button variant="outline" onClick={() => handleContactAboutPurchase(`${product.name} Enterprise`)}>
                      Enterprise Sales
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Available for Purchase Tab */}
        <TabsContent value="available-purchase" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Business Ideas Available for Purchase</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Proven SaaS business concepts with core functionality built. Each includes the foundational code, business plan, and market research - then we fully customize it for your brand, requirements, and market.
            </p>
            <div className="mt-4 inline-block bg-primary/5 border border-primary/20 rounded-lg px-4 py-2">
              <p className="text-foreground text-sm">
                💡 <strong>Business Concept + Custom Development:</strong> You get the proven idea, market research, and foundation - we build it exactly how you want it.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {availableForPurchase
              .filter(product => selectedCategory === "all" || product.category === selectedCategory)
              .map((product) => (
              <Card key={product.id} className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-300">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Available
                  </Badge>
                </div>
                
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 ${product.color} rounded-lg text-white`}>
                      <product.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{product.tagline}</p>
                    </div>
                  </div>
                  <p className="text-primary text-xl font-semibold">{product.price}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed">{product.description}</p>

                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Market Opportunity</h4>
                    <p className="text-xs text-muted-foreground">{product.marketSize}</p>
                    <p className="text-xs text-primary font-medium">{product.revenueModel}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-primary" />
                      Features Included
                    </h4>
                    <div className="space-y-1">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Screenshot Gallery - Temporarily removed until images are fixed */}

                  <div className="border-t pt-4">
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>✅ Proven business concept & market research</p>
                      <p>✅ Complete customization for your brand</p>
                      <p>✅ Full source code & exclusive ownership</p>
                      <p>✅ Business plan & go-to-market strategy</p>
                      <p>✅ 8-week custom development & launch</p>
                    </div>
                  </div>

                  <Button onClick={() => handleRequestBusinessPlan(product.name)} className="w-full">
                    Request Full Business Plan
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

      </Tabs>

      {/* Call to Action */}
      <div className="mt-16 text-center p-8 bg-gradient-to-r from-primary/10 to-blue/10 rounded-lg">
        <h3 className="text-2xl font-bold mb-4">Ready to Build Your Custom Solution?</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Whether you want to purchase a proven business concept that we'll customize for you, or need a completely custom application built from scratch, we have the expertise to deliver.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ProposalButton size="lg">
            Build My Custom App
          </ProposalButton>
          <Button variant="outline" size="lg" onClick={handlePurchaseBusinessConcept}>
            Purchase a Business Concept
          </Button>
        </div>
      </div>

      {/* Business Plan Request Form */}
      <BusinessPlanRequestForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedProduct('');
        }}
        productName={selectedProduct}
        availableProducts={availableForPurchase.map(p => ({ id: p.id, name: p.name }))}
      />
    </div>
  );
};

export default SolutionsWeveBuilt;