import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calculator, ArrowRight, Download, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import ProposalButton from "@/components/ProposalButton";
import SEO from "@/components/SEO";

const PriceCalculator = () => {
  const [selectedApp, setSelectedApp] = useState("");
  const [selectedDeployment, setSelectedDeployment] = useState("");
  const [email, setEmail] = useState("");

  const appTypes = [
    { id: "crm", name: "CRM System", price: 5000, description: "Customer relationship management" },
    { id: "invoice", name: "Invoice & Billing", price: 5000, description: "Billing and payment processing" },
    { id: "ecommerce", name: "E-commerce", price: 7500, description: "Online store platform" },
    { id: "saas", name: "SaaS Product", price: 10000, description: "Multi-tenant application" }
  ];

  const deploymentTypes = [
    { id: "internal", name: "Internal Use", price: 0, description: "For your team only" },
    { id: "saas", name: "SaaS Product", price: 5000, description: "Sell to customers" }
  ];

  const calculateTotal = () => {
    const app = appTypes.find(a => a.id === selectedApp);
    const deployment = deploymentTypes.find(d => d.id === selectedDeployment);
    return (app?.price || 0) + (deployment?.price || 0);
  };

  const calculate6Month = () => Math.round(calculateTotal() * 1.1 / 6);
  const calculate12Month = () => Math.round(calculateTotal() * 1.15 / 12);

  return (
    <div className="py-12 px-4">
      <SEO title="Price Calculator - Custom Software Development Pricing" description="Get an instant quote for your custom software project. Calculate pricing for different app types and deployment options with our transparent pricing calculator." />
      <div className="container mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Calculator className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Price Your App</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get an instant quote for your custom business application
          </p>
        </div>

        <div className="space-y-8">
          
          {/* App Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>What type of application do you need?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {appTypes.map((app) => (
                  <Card 
                    key={app.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedApp === app.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedApp(app.id)}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{app.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{app.description}</p>
                      <Badge variant="secondary">${app.price.toLocaleString()}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Deployment Type */}
          {selectedApp && (
            <Card>
              <CardHeader>
                <CardTitle>How will it be deployed?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {deploymentTypes.map((deployment) => (
                    <Card 
                      key={deployment.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedDeployment === deployment.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedDeployment(deployment.id)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{deployment.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{deployment.description}</p>
                        <Badge variant={deployment.price === 0 ? "secondary" : "default"}>
                          {deployment.price === 0 ? "Included" : `+$${deployment.price.toLocaleString()}`}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pricing Summary */}
          {selectedApp && selectedDeployment && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  Your Quote
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      ${calculateTotal().toLocaleString()}
                    </div>
                    <p className="text-muted-foreground">One-time investment</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-xl font-bold">${calculate6Month()}/month</div>
                      <div className="text-sm text-muted-foreground">6-month financing</div>
                      <div className="text-xs text-muted-foreground">+10% total</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-xl font-bold">${calculate12Month()}/month</div>
                      <div className="text-sm text-muted-foreground">12-month financing</div>
                      <div className="text-xs text-muted-foreground">+15% total</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Want a custom proposal with timeline, features, and case studies?
                      </p>
                      <ProposalButton className="w-full" size="lg">
                        Generate Full Custom Proposal
                      </ProposalButton>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or</span>
                      </div>
                    </div>
                    <Input
                      type="email"
                      placeholder="Enter email for quick PDF quote"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button className="w-full" size="lg" disabled={!email} variant="outline">
                      <Download className="h-5 w-5 mr-2" />
                      Email Basic Quote
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* CTA */}
          <div className="text-center">
            <Button size="lg" asChild>
              <Link to="/contact">
                Schedule Discovery Call
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;