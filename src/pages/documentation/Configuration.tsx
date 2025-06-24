import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Settings, Users, Palette, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const RequirementsGathering = () => {
  return (
    <div className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Link to="/documentation" className="text-primary hover:underline flex items-center mb-4">
              <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
              <span>Back to Documentation</span>
            </Link>
            <h1 className="text-4xl font-bold mb-4">Requirements & Planning</h1>
            <p className="text-muted-foreground text-lg">
              How App Suite gathers your requirements to build the perfect custom application for your business.
            </p>
          </div>

          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Discovery Process</h2>
              <p className="text-muted-foreground mb-6">
                We start every project with an in-depth discovery process to understand your business, workflows, and requirements. 
                This ensures we build exactly what you need.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Business Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        We analyze your current processes, pain points, and goals to design the perfect solution.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Settings className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Technical Requirements</h3>
                      <p className="text-sm text-muted-foreground">
                        We identify integrations, security needs, and technical specifications.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Palette className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Design Preferences</h3>
                      <p className="text-sm text-muted-foreground">
                        We capture your branding, design preferences, and user experience needs.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Future Growth</h3>
                      <p className="text-sm text-muted-foreground">
                        We plan for scalability and future feature additions from day one.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">What We'll Configure For You</h2>
              <p className="text-muted-foreground mb-6">
                Based on your requirements, we configure every aspect of your custom application during development.
              </p>
              
              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Brand & Design Configuration
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Your company logo, colors, and branding throughout the application</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Custom color schemes and design elements that match your brand</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">User interface designed for your team's workflows</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Business Logic Configuration
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Custom workflows that match your business processes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">User roles and permissions based on your team structure</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Data validation rules specific to your industry</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Automated notifications and alerts tailored to your needs</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Regional & Technical Configuration
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Time zones, date formats, and currency settings for your location</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Security configurations and compliance requirements</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Integration with your existing tools and systems</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Backup and disaster recovery procedures</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Planning Your Custom Application</h2>
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold mb-2">Step 1: Requirements Discovery Call</h3>
                  <p className="text-sm text-muted-foreground">
                    We schedule a detailed consultation to understand your business needs, current challenges, and goals.
                  </p>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold mb-2">Step 2: Technical Specification</h3>
                  <p className="text-sm text-muted-foreground">
                    We create a detailed technical specification document outlining all features, integrations, and configurations.
                  </p>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold mb-2">Step 3: Custom Proposal</h3>
                  <p className="text-sm text-muted-foreground">
                    You receive a detailed proposal with exact pricing, timeline, and deliverables based on your requirements.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <h2 className="text-2xl font-semibold mb-4">Ready to Start Planning?</h2>
              <p className="text-muted-foreground mb-6">
                Let's discuss your business requirements and plan your custom application together.
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <Link to="/contact">Schedule Discovery Call</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/documentation/process">See Our Process</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default RequirementsGathering;