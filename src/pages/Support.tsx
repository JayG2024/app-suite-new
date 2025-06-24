import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { 
  MessageCircle, 
  Clock, 
  Mail, 
  Phone, 
  Search, 
  BookOpen, 
  Settings, 
  Zap,
  HelpCircle,
  CheckCircle,
  ArrowRight,
  Users,
  Target,
  Lightbulb
} from "lucide-react";

const Support = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const quickActions = [
    {
      title: "Schedule Consultation",
      description: "Book a free 30-minute discovery call to discuss your project",
      icon: <MessageCircle className="h-6 w-6" />,
      link: "/contact",
      primary: true
    },
    {
      title: "ROI Calculator", 
      description: "Calculate potential savings from custom software",
      icon: <Target className="h-6 w-6" />,
      link: "/roi-calculator",
      primary: false
    },
    {
      title: "AI Development Process",
      description: "Learn how we build software in days, not months",
      icon: <Zap className="h-6 w-6" />,
      link: "/ai-development-process", 
      primary: false
    },
    {
      title: "Free Image Generator",
      description: "Try our AI-powered image generation tool",
      icon: <Lightbulb className="h-6 w-6" />,
      link: "/image-generator",
      primary: false
    }
  ];

  const faqs = [
    {
      question: "How long does custom software development take?",
      answer: "Using AI-powered development, we typically deliver custom software in 6-8 weeks instead of traditional 6-12 months. Simple applications can be completed in 4-6 weeks, while complex enterprise solutions may take 8-12 weeks. Our process includes weekly demos so you can see progress in real-time.",
      category: "timeline"
    },
    {
      question: "What's the cost of custom software vs SaaS?",
      answer: "Custom software typically costs $20,000-$100,000 upfront but eliminates monthly SaaS fees forever. Most businesses break even in 8-18 months and save $50,000+ annually thereafter. Use our ROI calculator for specific estimates based on your current SaaS spending.",
      category: "pricing"
    },
    {
      question: "Do you provide ongoing support and maintenance?",
      answer: "Yes, we offer three support tiers: Essential ($500/month), Professional ($1,200/month), and Enterprise (custom pricing). However, since you own the software and source code, you're never locked into any subscription and can use any developer for maintenance.",
      category: "support"
    },
    {
      question: "What technologies do you use?",
      answer: "We use modern, enterprise-grade technologies including React, Node.js, TypeScript, PostgreSQL, AWS/Google Cloud, and various AI APIs. All code follows industry best practices and includes comprehensive documentation. You receive full source code ownership.",
      category: "technical"
    },
    {
      question: "Can you integrate with our existing systems?",
      answer: "Absolutely. We specialize in creating software that seamlessly integrates with popular tools like Salesforce, QuickBooks, Stripe, Slack, Microsoft 365, Google Workspace, and custom APIs. Integration planning is included in our discovery phase.",
      category: "integration"
    },
    {
      question: "What if we need changes after delivery?",
      answer: "Since you own the complete source code, you can make changes anytime using any developer. We also offer enhancement services at $150/hour or through our support packages. All initial requirements are included in the fixed project price.",
      category: "support"
    },
    {
      question: "How do you ensure security and compliance?",
      answer: "We implement enterprise-grade security including encryption, secure authentication, role-based permissions, and regular security audits. We can ensure compliance with GDPR, HIPAA, SOC 2, and other standards based on your industry requirements.",
      category: "security"
    },
    {
      question: "What's included in the project delivery?",
      answer: "Every project includes: fully functional application, complete source code, technical documentation, user training materials, deployment setup, initial hosting configuration, and 30 days of post-launch support. No hidden costs or additional fees.",
      category: "delivery"
    },
    {
      question: "Can you migrate data from our current systems?",
      answer: "Yes, data migration is included in most projects. We can migrate data from spreadsheets, databases, SaaS platforms, and legacy systems. We ensure data integrity and provide validation reports throughout the migration process.",
      category: "migration"
    },
    {
      question: "What if our requirements change during development?",
      answer: "Minor adjustments are included in the project scope. For significant changes, we provide transparent change order pricing. Our weekly demos help identify any needed adjustments early in the process to minimize scope changes.",
      category: "process"
    },
    {
      question: "Do you provide training for our team?",
      answer: "Yes, every project includes comprehensive training: administrator training (2-3 hours), end-user training (1-2 hours), and power user training (2-3 hours). We also provide video tutorials, user manuals, and ongoing training support.",
      category: "training"
    },
    {
      question: "What happens if you go out of business?",
      answer: "Since you own the complete source code and documentation, you're never dependent on us. You can continue using, modifying, and maintaining the software with any developer. We also provide code escrow services for enterprise clients.",
      category: "business"
    },
    {
      question: "Can you build mobile apps?",
      answer: "Yes, we build responsive web applications that work perfectly on mobile devices, and native iOS/Android apps when needed. Most business applications work better as responsive web apps since they're easier to maintain and update.",
      category: "mobile"
    },
    {
      question: "How do you handle project communication?",
      answer: "We provide daily email updates, weekly live demos, real-time access to development environment, and direct communication with your development team. You'll never wonder about project status or progress.",
      category: "communication"
    },
    {
      question: "What's your refund policy?",
      answer: "We offer a 100% satisfaction guarantee. If you're not completely satisfied with the delivered software, we'll work to fix any issues at no charge. In the rare case we can't meet your requirements, we provide a full refund.",
      category: "guarantee"
    }
  ];

  const supportChannels = [
    {
      title: "Schedule Discovery Call",
      description: "Best for: Project discussions, requirements planning",
      response: "Within 24 hours",
      icon: <MessageCircle className="h-5 w-5" />,
      action: "Schedule Call",
      link: "/contact"
    },
    {
      title: "Email Support", 
      description: "Best for: General questions, technical inquiries",
      response: "Within 4 hours",
      icon: <Mail className="h-5 w-5" />,
      action: "Send Email",
      link: "mailto:hello@app-suite.io"
    },
    {
      title: "Documentation",
      description: "Best for: Self-service help and guides", 
      response: "Immediate",
      icon: <BookOpen className="h-5 w-5" />,
      action: "Browse Docs",
      link: "/documentation"
    }
  ];

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "timeline", label: "Timeline & Process" },
    { id: "pricing", label: "Pricing & Cost" },
    { id: "technical", label: "Technical" },
    { id: "support", label: "Support & Maintenance" },
    { id: "security", label: "Security & Compliance" },
    { id: "integration", label: "Integrations" },
    { id: "delivery", label: "Delivery & Training" }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <SEO title="Support Center - Get Help with Your Custom Software" description="Find support for your App Suite custom software project. Access documentation, contact our support team, and get help with development, deployment, and maintenance." />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <HelpCircle className="h-6 w-6 text-primary mr-2" />
            <span className="text-primary font-medium">Support Center</span>
          </div>
          <h1 className="text-4xl font-bold mb-6">How Can We Help You?</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get answers to your questions about custom software development, our process, pricing, and more.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {quickActions.map((action, index) => (
            <Card key={index} className={`text-center hover:shadow-lg transition-all duration-200 ${action.primary ? 'border-primary/50 bg-primary/5' : ''}`}>
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${action.primary ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                  {action.icon}
                </div>
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                <Button asChild variant={action.primary ? "default" : "outline"} size="sm" className="w-full">
                  <Link to={action.link}>
                    {action.primary ? "Get Started" : "Learn More"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Support Channels */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Get in Touch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {supportChannels.map((channel, index) => (
                <div key={index} className="text-center p-4 rounded-lg border hover:border-primary/50 transition-colors">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    {channel.icon}
                  </div>
                  <h4 className="font-semibold mb-2">{channel.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{channel.description}</p>
                  <Badge variant="secondary" className="mb-4">
                    <Clock className="h-3 w-3 mr-1" />
                    {channel.response}
                  </Badge>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to={channel.link}>{channel.action}</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Frequently Asked Questions
            </CardTitle>
            <div className="flex flex-col lg:flex-row gap-4 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="text-xs"
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="border-b border-border pb-6 last:border-b-0">
                  <h4 className="font-semibold mb-3 flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    {faq.question}
                  </h4>
                  <p className="text-muted-foreground ml-7">{faq.answer}</p>
                </div>
              ))}
              
              {filteredFaqs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No FAQs found matching your search.</p>
                  <Button 
                    variant="link" 
                    onClick={() => setSearchQuery("")}
                    className="mt-2"
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Still Need Help */}
        <div className="mt-16 text-center p-8 bg-gradient-to-r from-primary/10 to-blue/10 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our team is here to help you explore how custom software can transform your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/contact">Schedule Free Consultation</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="mailto:hello@app-suite.io">Email Us Directly</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;