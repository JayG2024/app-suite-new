import { Truck, Shield, Users, Headphones, Settings, CheckCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const Delivery = () => {
  const deliveryPhases = [
    {
      phase: "Pre-Deployment",
      timeline: "1-2 days before launch",
      icon: <Settings className="h-6 w-6 text-blue-600" />,
      activities: [
        "Final system testing and validation",
        "Production environment setup",
        "Data migration and validation",
        "Security and performance checks"
      ],
      deliverables: [
        "Production-ready application",
        "Security audit report",
        "Performance baseline metrics"
      ]
    },
    {
      phase: "Go-Live",
      timeline: "Launch day",
      icon: <Truck className="h-6 w-6 text-green-600" />,
      activities: [
        "Application deployment to production",
        "DNS and domain configuration",
        "Real-time monitoring activation",
        "User access provisioning"
      ],
      deliverables: [
        "Live application accessible to users",
        "Monitoring dashboards active",
        "User accounts and permissions set"
      ]
    },
    {
      phase: "Post-Launch",
      timeline: "First 30 days",
      icon: <Headphones className="h-6 w-6 text-purple-600" />,
      activities: [
        "User training and onboarding",
        "Performance monitoring and optimization",
        "Bug fixes and minor adjustments",
        "User feedback collection"
      ],
      deliverables: [
        "Trained user base",
        "Optimized application performance",
        "Comprehensive documentation"
      ]
    }
  ];

  const supportPlans = [
    {
      name: "Essential Support",
      price: "$199/month",
      description: "Basic support for standard applications",
      features: [
        "Email support (24-48 hour response)",
        "Bug fixes and patches",
        "Monthly performance reports",
        "Basic monitoring and alerts"
      ]
    },
    {
      name: "Professional Support",
      price: "$499/month",
      description: "Advanced support for SaaS applications and enterprise projects over $10K",
      features: [
        "Priority email and phone support (4-8 hour response)",
        "Bug fixes, patches, and minor enhancements",
        "Weekly performance reports",
        "Advanced monitoring and analytics",
        "Quarterly system health checks"
      ],
      recommended: true
    },
    {
      name: "Enterprise Support",
      price: "Custom pricing",
      description: "Full-service support for mission-critical applications",
      features: [
        "24/7 phone and email support (1-2 hour response)",
        "Dedicated support manager",
        "Proactive monitoring and maintenance",
        "Monthly feature updates and enhancements",
        "Custom reporting and analytics"
      ]
    }
  ];

  const trainingSessions = [
    {
      title: "Administrator Training",
      duration: "2-3 hours",
      audience: "System administrators and IT staff",
      topics: [
        "User management and permissions",
        "System configuration and settings",
        "Data backup and recovery procedures",
        "Security best practices"
      ]
    },
    {
      title: "End-User Training",
      duration: "1-2 hours",
      audience: "Daily application users",
      topics: [
        "Application navigation and core features",
        "Common workflows and processes",
        "Tips and best practices",
        "Troubleshooting common issues"
      ]
    },
    {
      title: "Power User Training",
      duration: "2-3 hours", 
      audience: "Advanced users and team leads",
      topics: [
        "Advanced features and functionality",
        "Customization options",
        "Reporting and analytics",
        "Training other team members"
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-6">Delivery & Ongoing Support</h1>
        <p className="text-lg text-muted-foreground">
          Seamless deployment, comprehensive training, and ongoing support to ensure your success 
          long after your application goes live.
        </p>
      </div>

      {/* Delivery Process */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Deployment Process</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our proven deployment process ensures your application goes live smoothly with minimal disruption.
          </p>
        </div>

        <div className="space-y-6">
          {deliveryPhases.map((phase, index) => (
            <Card key={index} className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      {phase.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{phase.phase}</h3>
                      <Badge variant="outline">{phase.timeline}</Badge>
                    </div>
                  </div>
                </div>

                <div className="lg:w-2/3 grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-blue-700">Key Activities</h4>
                    <ul className="space-y-1 text-sm">
                      {phase.activities.map((activity, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-green-700">Deliverables</h4>
                    <ul className="space-y-1 text-sm">
                      {phase.deliverables.map((deliverable, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Training & Documentation */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Training & Documentation</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive training and documentation to ensure your team can effectively use your application.
          </p>
        </div>

        <Tabs defaultValue="training" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="training">Training Programs</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="training">
            <div className="grid md:grid-cols-3 gap-6">
              {trainingSessions.map((session, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-semibold">{session.title}</h3>
                  </div>
                  <div className="mb-3">
                    <Badge variant="outline" className="mb-2">{session.duration}</Badge>
                    <p className="text-sm text-muted-foreground">{session.audience}</p>
                  </div>
                  <h4 className="font-medium mb-2">Topics Covered:</h4>
                  <ul className="space-y-1 text-sm">
                    {session.topics.map((topic, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documentation">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-3">User Manual</h3>
                <p className="text-muted-foreground mb-4">Comprehensive guide for end users with step-by-step walkthroughs and visual guides.</p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Feature walkthroughs with screenshots</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Common workflows and use cases</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Troubleshooting and FAQ section</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-3">Technical Documentation</h3>
                <p className="text-muted-foreground mb-4">Complete technical reference for administrators and developers.</p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>API documentation and integration guides</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Security configuration and best practices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Backup and maintenance procedures</span>
                  </li>
                </ul>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Support Plans */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Ongoing Support Plans</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the level of support that best fits your needs and ensures your application continues to perform optimally.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {supportPlans.map((plan, index) => (
            <Card key={index} className={`p-6 flex flex-col h-full ${plan.recommended ? 'ring-2 ring-primary shadow-lg' : ''}`}>
              {plan.recommended && (
                <Badge className="mb-4 w-fit">Recommended</Badge>
              )}
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="text-2xl font-bold text-primary mb-3">{plan.price}</div>
              <p className="text-muted-foreground mb-6">{plan.description}</p>
              
              <ul className="space-y-2 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="mt-6 w-full" variant={plan.recommended ? "default" : "outline"}>
                {plan.price === "Custom pricing" ? "Contact Sales" : "Choose Plan"}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Success Metrics */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Our Delivery Success Metrics</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">99.5%</div>
            <div className="text-sm text-muted-foreground">On-time Delivery Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">24hrs</div>
            <div className="text-sm text-muted-foreground">Average Support Response</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">95%</div>
            <div className="text-sm text-muted-foreground">Client Satisfaction Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">99.9%</div>
            <div className="text-sm text-muted-foreground">Application Uptime</div>
          </div>
        </div>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready for a Successful Launch?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Let's plan your deployment and ongoing support strategy to ensure your application's success.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/contact">Discuss Your Launch</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/help-center">View Support Options</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Delivery;