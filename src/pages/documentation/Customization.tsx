import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Zap, Code, Users } from "lucide-react";
import { Link } from "react-router-dom";

const CustomDevelopment = () => {
  return (
    <div className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Link to="/documentation" className="text-primary hover:underline flex items-center mb-4">
              <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
              <span>Back to Documentation</span>
            </Link>
            <h1 className="text-4xl font-bold mb-4">Custom Development Process</h1>
            <p className="text-muted-foreground text-lg">
              How App Suite builds 100% custom applications from scratch specifically for your business.
            </p>
          </div>

          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Our Custom Development Approach</h2>
              <p className="text-muted-foreground mb-6">
                App Suite doesn't provide a platform you customize. Instead, we build completely custom applications from scratch, 
                tailored specifically to your business needs, workflows, and requirements.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">100% Custom Built</h3>
                  <p className="text-sm text-muted-foreground">
                    Every line of code written specifically for your business
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Your Workflows</h3>
                  <p className="text-sm text-muted-foreground">
                    Built around your exact business processes and requirements
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">You Own It</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete ownership of code, data, and application
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Development Process</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Discovery & Requirements</h3>
                    <p className="text-muted-foreground">
                      We analyze your business processes, pain points, and goals to understand exactly what you need.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Custom Architecture Design</h3>
                    <p className="text-muted-foreground">
                      We design the application architecture, user interface, and database structure specifically for your needs.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Custom Development</h3>
                    <p className="text-muted-foreground">
                      We build your application from scratch using modern technologies, writing every feature specifically for you.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Delivery & Training</h3>
                    <p className="text-muted-foreground">
                      We deploy your custom application and train your team on how to use it effectively.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">What We Build For You</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Business Applications</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">CRM systems tailored to your sales process</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Inventory management for your products</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Project management workflows</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Financial tracking and reporting</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Custom Features</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">AI-powered automation and insights</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Custom reporting dashboards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Integrations with your existing tools</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Mobile-responsive design</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6">
                Let's discuss your business needs and create a custom application that perfectly fits your workflows.
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <Link to="/contact">Start Your Project</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/solutions-weve-built">See Our Solutions</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default CustomDevelopment;