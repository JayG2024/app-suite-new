
import React from 'react';
import { ArrowRight, Calculator, Code, FileText, ShoppingCart, Zap, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import SEO from "@/components/SEO";

const developmentServices = [
  {
    icon: Calculator,
    title: "Custom Calculator Development",
    description: "Build powerful calculation tools tailored to your specific business logic and client needs",
    tooltip: "From ROI calculators to complex financial modeling tools, built exactly for your workflow"
  },
  {
    icon: Code,
    title: "API Integration Development",
    description: "Connect your custom software with any third-party service or internal system",
    tooltip: "Seamless integrations that work exactly how your business operates"
  },
  {
    icon: FileText,
    title: "Dynamic Form Systems",
    description: "Custom form solutions with intelligent validation, conditional logic, and automated workflows",
    tooltip: "Forms that adapt to your process, not the other way around"
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Functionality",
    description: "Custom shopping experiences, payment processing, and inventory management built for your needs",
    tooltip: "E-commerce that fits your unique selling process and customer journey"
  },
  {
    icon: Zap,
    title: "Automation Development",
    description: "Custom workflow automation, data processing, and business logic tailored to your operations",
    tooltip: "Automate exactly what you need, how you need it"
  }
];

const Extensions = () => {
  const navigate = useNavigate();

  const handleRequestConsultation = (serviceTitle: string) => {
    toast.info(`Let's discuss your ${serviceTitle} requirements in detail.`, {
      duration: 3000,
    });
    setTimeout(() => {
      navigate('/contact');
    }, 1500);
  };

  const handleScheduleConsultation = () => {
    navigate('/contact');
  };

  return (
    <div>
      <SEO title="Extensions & Add-ons - Custom Software Enhancements" description="Extend your existing software with custom extensions and add-ons. Browse our catalog of business tools and request custom integrations for your existing systems." />
      <div className="bg-primary/5 py-16 px-4 text-center w-full">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-primary font-medium text-sm mb-4">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Solutions</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Custom Development Services</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Specialized development capabilities we integrate into your custom software solutions. Built exactly for your business needs.
          </p>
          
          {/* Dashboard-style hero visualization instead of image */}
          <div className="mt-8 mx-auto max-w-4xl">
            <div className="rounded-xl shadow-xl overflow-hidden bg-gradient-to-br from-primary/5 to-background border border-primary/10">
              <div className="p-1">
                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6">
                  <div className="flex flex-col gap-6">
                    {/* Dashboard header */}
                    <div className="flex justify-between items-center border-b pb-4">
                      <h3 className="text-xl font-bold">Custom Business Software</h3>
                      <div className="flex gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-400"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                        <div className="h-3 w-3 rounded-full bg-green-400"></div>
                      </div>
                    </div>
                    
                    {/* Dashboard content */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {/* Cards representing different services */}
                      {developmentServices.slice(0, 3).map((service, index) => (
                        <Card key={index} className="bg-gradient-to-br from-primary/5 to-background border-primary/10">
                          <CardContent className="p-4 flex flex-col items-center">
                            <service.icon className="h-8 w-8 text-primary mb-2" />
                            <div className="h-2 w-16 bg-primary/20 rounded-full mb-1"></div>
                            <div className="h-2 w-12 bg-primary/10 rounded-full"></div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-16 rounded-md bg-primary/5 border border-primary/10 flex items-center justify-center">
                          <div className="w-1/2 h-2 bg-primary/20 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Graph or chart mockup */}
                    <div className="h-24 bg-primary/5 rounded-lg border border-primary/10 p-2 flex items-end gap-1">
                      {[35, 55, 40, 60, 30, 50, 70, 45, 65, 75, 55, 40].map((height, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-primary/40 rounded-t-sm"
                          style={{ height: `${height}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 px-4 flex-grow w-full">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Development Capabilities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Specialized development services we integrate into your custom software. Each capability is built specifically for your business requirements and workflows.
            </p>
            <div className="mt-4 inline-block bg-primary/5 border border-primary/20 rounded-lg px-4 py-2">
              <p className="text-foreground text-sm">
                All development work is included in your custom software project. Let's discuss how these capabilities can enhance your solution.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {developmentServices.map((service) => (
              <div 
                key={service.title} 
                className="bg-white border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4 relative">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="relative">
                          <service.icon className="h-12 w-12 text-primary" aria-hidden="true" />
                          <div className="absolute -top-2 -right-2 bg-primary/20 rounded-full p-1">
                            <Sparkles className="h-3 w-3 text-primary" />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{service.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleRequestConsultation(service.title)}
                  aria-label={`Discuss ${service.title}`}
                >
                  Discuss Requirements <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Need custom functionality beyond these capabilities? Let's discuss your specific requirements.
            </p>
            <Button onClick={handleScheduleConsultation}>
              Schedule Discovery Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Extensions;
