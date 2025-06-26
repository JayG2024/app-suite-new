import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { CALENDLY_DISCOVERY_CALL_URL } from "@/utils/constants";
import { 
  MessageCircle, 
  FileText, 
  Code, 
  Rocket, 
  CheckCircle, 
  ArrowRight,
  Download,
  CreditCard,
  Calendar,
  Users,
  Zap
} from "lucide-react";

const GetStarted = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const packages = [
    {
      id: "standard",
      name: "Standard Application",
      price: "$5,000",
      description: "Perfect for custom dashboard applications",
      features: [
        "Custom dashboard application",
        "User authentication & role management",
        "Database design & implementation",
        "Responsive web design",
        "First 2 API connections FREE",
        "30-day support included"
      ],
      timeline: "30 days",
      paymentOptions: [
        { name: "Split Payment", amount: "$2,500 upfront + $2,500 on delivery", popular: true },
        { name: "Full Payment", amount: "$4,750 (5% discount)", discount: true }
      ]
    },
    {
      id: "ai-powered",
      name: "AI-Powered Solution",
      price: "$7,500",
      description: "Advanced applications with multiple AI model integration",
      features: [
        "Everything in Standard",
        "GPT-4, Claude, Llama integration",
        "Voice & vision AI capabilities (Whisper, DALL-E)",
        "Custom AI workflows & automation",
        "Advanced analytics with AI insights",
        "First 2 API connections FREE"
      ],
      timeline: "30 days",
      paymentOptions: [
        { name: "Split Payment", amount: "$3,750 upfront + $3,750 on delivery", popular: true },
        { name: "Full Payment", amount: "$7,125 (5% discount)", discount: true }
      ]
    },
    {
      id: "enterprise",
      name: "Enterprise Solution",
      price: "$10,000",
      description: "Complex systems with multi-AI orchestration",
      features: [
        "Everything in AI-Powered",
        "Multiple AI model orchestration",
        "Advanced security & compliance features",
        "Multi-tenant architecture capabilities",
        "Custom reporting & business intelligence",
        "First 3 API connections FREE"
      ],
      timeline: "30 days",
      paymentOptions: [
        { name: "Three Payments", amount: "$3,333 upfront + $3,333 milestone + $3,334 delivery", popular: true },
        { name: "Split Payment", amount: "$5,000 upfront + $5,000 on delivery" },
        { name: "Full Payment", amount: "$9,500 (5% discount)", discount: true }
      ]
    }
  ];

  const processSteps = [
    {
      phase: "Discovery Call",
      duration: "30-60 minutes",
      description: "We discuss your needs and show you examples",
      icon: MessageCircle,
      activities: [
        "Requirements gathering",
        "Feature discussion",
        "Timeline planning",
        "Pricing confirmation"
      ]
    },
    {
      phase: "Prototype Demo",
      duration: "3-5 days",
      description: "We build a frontend demo to show the look and feel",
      icon: Code,
      activities: [
        "UI/UX design mockup",
        "Frontend prototype",
        "Visual demonstration",
        "Feedback collection"
      ]
    },
    {
      phase: "Contract & Payment",
      duration: "1-2 days",
      description: "Sign agreement and make initial payment",
      icon: FileText,
      activities: [
        "Project agreement signing",
        "Payment processing",
        "Project kickoff",
        "Communication setup"
      ]
    },
    {
      phase: "Development",
      duration: "10-12 days",
      description: "We build your complete application",
      icon: Zap,
      activities: [
        "Backend development",
        "Database implementation",
        "Feature integration",
        "Testing & QA"
      ]
    },
    {
      phase: "Delivery & Launch",
      duration: "1-2 days",
      description: "Final testing, training, and go-live",
      icon: Rocket,
      activities: [
        "Final testing",
        "User training",
        "Deployment",
        "30-day support begins"
      ]
    }
  ];

  return (
    <div className="py-12 px-4">
      <SEO title="Get Started - Custom Software Development Process" description="Start your custom software project today. Learn about our development process, pricing options, and how to begin building your AI-powered business solution." />
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">How to Get Started</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From initial consultation to deployed application in just 30 days. 
            Here's exactly how our process works.
          </p>
        </div>

        {/* Process Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our 5-Step Process</h2>
          <div className="grid md:grid-cols-5 gap-6">
            {processSteps.map((step, index) => (
              <Card key={index} className="relative">
                <CardHeader className="text-center pb-3">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-3">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="mb-2">{step.duration}</Badge>
                  <CardTitle className="text-lg">{step.phase}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                  <ul className="space-y-1">
                    {step.activities.map((activity, i) => (
                      <li key={i} className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        {activity}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                {index < processSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Package Selection */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Package</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`cursor-pointer transition-all duration-200 ${
                  selectedPackage === pkg.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <Badge variant={pkg.id === 'ai-powered' ? 'default' : 'secondary'}>
                      {pkg.timeline}
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{pkg.price}</div>
                  <p className="text-muted-foreground">{pkg.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {selectedPackage === pkg.id && (
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4">Payment Options:</h4>
                      <div className="space-y-3">
                        {pkg.paymentOptions.map((option, index) => (
                          <div 
                            key={index} 
                            className={`p-3 rounded-lg border ${
                              option.popular ? 'border-primary bg-primary/5' : 'border-muted'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-sm">{option.name}</span>
                              {option.popular && <Badge variant="default" className="text-xs">Popular</Badge>}
                              {option.discount && <Badge variant="secondary" className="text-xs">Save 5%</Badge>}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">{option.amount}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Payment Terms Summary */}
        <section className="mb-16">
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Terms Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-3">What's Included in Every Package:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Complete source code ownership</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />30-day post-launch support</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />User training & documentation</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Deployment & hosting setup</li>
                    <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />No recurring fees or user limits</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Payment Schedule:</h4>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Initial Payment:</strong> Due upon contract signing</li>
                    <li><strong>Milestone Payment:</strong> Due at development completion (Enterprise only)</li>
                    <li><strong>Final Payment:</strong> Due upon delivery and approval</li>
                    <li><strong>Accepted Methods:</strong> ACH, Wire Transfer, Check</li>
                    <li><strong>Payment Terms:</strong> Net 5 business days</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Documentation Downloads */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Project Documentation
              </CardTitle>
              <p className="text-muted-foreground">
                Download our detailed terms and proposal templates to review before starting your project.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <a 
                  href="/documents/payment-terms.html" 
                  download="App-Suite-Payment-Terms.html"
                  className="no-underline"
                >
                  <Button variant="outline" className="h-auto p-4 flex-col items-start w-full text-left">
                    <div className="flex items-center w-full mb-2">
                      <FileText className="h-5 w-5 mr-2" />
                      <span className="font-semibold">Payment Terms & Conditions</span>
                      <Download className="h-4 w-4 ml-auto" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Complete terms, payment schedules, and project agreements
                    </span>
                  </Button>
                </a>
                <a 
                  href="/documents/project-proposal-template.html" 
                  download="App-Suite-Project-Proposal-Template.html"
                  className="no-underline"
                >
                  <Button variant="outline" className="h-auto p-4 flex-col items-start w-full text-left">
                    <div className="flex items-center w-full mb-2">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span className="font-semibold">Project Proposal Template</span>
                      <Download className="h-4 w-4 ml-auto" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Standard proposal format with scope and timeline details
                    </span>
                  </Button>
                </a>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Click to download documents. You can save as PDF using your browser's print function.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Important Note */}
        <section className="mb-8">
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-amber-800">Important Note</h3>
              <p className="text-amber-700">
                We specialize in building NEW custom applications from scratch. We do not modify or enhance existing third-party software unless it was originally built by App Suite. All module pricing applies only to applications we've developed.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Ready to Start */}
        <section className="text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Schedule your discovery call today and see how we can build exactly what your business needs 
                in just 30 days for one flat rate.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href={CALENDLY_DISCOVERY_CALL_URL} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Schedule Discovery Call
                  </a>
                </Button>
                <Button size="lg" variant="outline">
                  <Users className="h-5 w-5 mr-2" />
                  View Example Projects
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default GetStarted;