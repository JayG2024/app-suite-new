import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  CheckCircle
} from "lucide-react";

export const SignAIProduct = {
  id: "signai",
  name: "SignAI",
  tagline: "The First AI-Powered E-Signature Platform",
  price: "$18,000",
  status: "available",
  category: "Legal Tech SaaS",
  description: "Complete AI-powered e-signature platform that revolutionizes document signing with intelligent analysis, risk detection, and automated field placement.",
  
  businessOverview: {
    marketOpportunity: "The global e-signature market is valued at $5.5 billion and growing 25% annually. DocuSign dominates with basic features, leaving room for AI-enhanced innovation.",
    targetMarket: "Law firms, real estate companies, financial institutions, and enterprises needing secure, intelligent document workflows",
    revenue: "Subscription SaaS model: $29/month (Starter), $99/month (Professional), $299/month (Enterprise)",
    competition: "DocuSign, Adobe Sign, HelloSign - but none offer AI document analysis and risk detection"
  },

  keyFeatures: [
    {
      icon: Brain,
      title: "AI Document Generation",
      description: "Generate legal documents like NDAs, contracts, and agreements using AI from simple form inputs"
    },
    {
      icon: FileSignature,
      title: "Smart Field Detection", 
      description: "Automatically detect and place signature fields, initials, dates, and form fields using computer vision"
    },
    {
      icon: Shield,
      title: "AI Risk Analysis",
      description: "Analyze documents for legal risks, problematic clauses, and compliance issues before signing"
    },
    {
      icon: Calendar,
      title: "AI Document Assistant",
      description: "Extract important dates, deadlines, and key terms with intelligent calendar integration"
    },
    {
      icon: BarChart3,
      title: "Behavioral Analytics",
      description: "Advanced security through behavioral analysis to prevent fraud and unauthorized access"
    },
    {
      icon: Zap,
      title: "Instant Processing",
      description: "Process documents 10x faster than manual workflows with AI-powered automation"
    }
  ],

  marketAdvantages: [
    "First mover in AI-enhanced e-signatures",
    "Superior technology vs DocuSign's basic offerings", 
    "Built-in legal AI reduces need for separate tools",
    "Behavioral security features prevent fraud",
    "Document generation saves legal costs",
    "Risk analysis prevents costly mistakes"
  ],

  financialProjections: {
    year1: {
      users: "500 paid subscribers",
      revenue: "$180,000 ARR",
      growth: "Growing 15% monthly"
    },
    year2: {
      users: "2,500 paid subscribers", 
      revenue: "$900,000 ARR",
      growth: "Market expansion + enterprise sales"
    },
    year3: {
      users: "8,000 paid subscribers",
      revenue: "$2.4M ARR", 
      growth: "Established market presence"
    }
  },

  techStack: [
    "React/TypeScript frontend",
    "Node.js backend with AI integration",
    "PDF processing and digital signatures",
    "Machine learning for document analysis",
    "Enterprise-grade security and compliance",
    "Cloud infrastructure (AWS/Google Cloud)"
  ],

  goToMarket: [
    "Target law firms and real estate agencies first",
    "Content marketing around AI + legal workflows", 
    "Partner with legal tech consultants",
    "Freemium model to drive adoption",
    "Enterprise sales for large organizations",
    "Integration partnerships with CRM platforms"
  ],

  competitiveEdge: "Only e-signature platform with built-in AI document analysis, generation, and risk detection. While competitors focus on basic signing, SignAI provides complete intelligent document workflows."
};

export const SignAIProductCard = () => {
  const handleRequestInfo = () => {
    // Navigate to contact or open modal
    window.open('/contact?product=signai', '_blank');
  };

  return (
    <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
      <div className="absolute top-4 right-4">
        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Available
        </Badge>
      </div>
      
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileSignature className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">{SignAIProduct.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{SignAIProduct.category}</p>
          </div>
        </div>
        <p className="text-primary text-lg font-semibold">{SignAIProduct.price}</p>
        <p className="text-muted-foreground">{SignAIProduct.tagline}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-sm leading-relaxed">{SignAIProduct.description}</p>

        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Key Features
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SignAIProduct.keyFeatures.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <feature.icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm">{feature.title}</div>
                  <div className="text-xs text-muted-foreground">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Market Opportunity
          </h4>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• $5.5B global e-signature market growing 25% annually</p>
            <p>• First AI-powered alternative to DocuSign's basic platform</p>
            <p>• Built-in legal AI eliminates need for separate tools</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            Revenue Potential
          </h4>
          <div className="text-sm text-muted-foreground">
            <p>Subscription model: $29-299/month per user</p>
            <p className="font-medium text-foreground">Projected: $180K ARR Year 1 → $2.4M ARR Year 3</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground">
              <p>✅ Complete SaaS business ready to launch</p>
              <p>✅ Exclusive ownership with certificate</p>
              <p>✅ Full business plan and go-to-market strategy included</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleRequestInfo} className="flex-1">
            Request Full Business Plan
          </Button>
          <Button variant="outline" onClick={handleRequestInfo}>
            Schedule Demo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};