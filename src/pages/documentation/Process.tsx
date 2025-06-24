import { ArrowRight, CheckCircle, Clock, Users, MessageSquare, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Process = () => {
  const phases = [
    {
      id: 1,
      title: "Discovery & Planning",
      duration: "Week 1",
      icon: <MessageSquare className="h-6 w-6 text-blue-600" />,
      description: "We dive deep into understanding your business needs, current processes, and desired outcomes.",
      activities: [
        "Stakeholder interviews and requirements gathering",
        "Business process analysis and mapping",
        "Technical requirements and constraints assessment",
        "Project scope definition and resource planning"
      ],
      deliverables: [
        "Detailed project requirements document",
        "Technical architecture proposal",
        "Project timeline with key milestones"
      ]
    },
    {
      id: 2,
      title: "Design & Architecture",
      duration: "Week 2",
      icon: <Users className="h-6 w-6 text-purple-600" />,
      description: "Our team creates detailed designs and system architecture tailored to your specific needs.",
      activities: [
        "User experience (UX) design and wireframing",
        "User interface (UI) design and prototyping",
        "Database design and data modeling",
        "System architecture planning"
      ],
      deliverables: [
        "Interactive prototypes and mockups",
        "Technical architecture documentation",
        "Database schema and data flow diagrams"
      ]
    },
    {
      id: 3,
      title: "AI-Powered Development",
      duration: "Weeks 3-5",
      icon: <Rocket className="h-6 w-6 text-green-600" />,
      description: "Using advanced AI tools and methodologies, we rapidly develop your custom application.",
      activities: [
        "AI-accelerated code generation and development",
        "Automated testing and quality assurance",
        "Real-time progress tracking and updates",
        "Performance optimization and security implementation"
      ],
      deliverables: [
        "Fully functional application with core features",
        "Automated test suites and documentation",
        "Performance and security audit reports"
      ]
    },
    {
      id: 4,
      title: "Testing & Refinement",
      duration: "Week 6",
      icon: <CheckCircle className="h-6 w-6 text-orange-600" />,
      description: "Comprehensive testing and refinement to ensure your application meets all requirements.",
      activities: [
        "User acceptance testing (UAT)",
        "Performance and load testing",
        "Security vulnerability assessment",
        "Bug fixes and performance optimizations"
      ],
      deliverables: [
        "Test results and quality assurance reports",
        "Performance benchmarks and optimization report",
        "Final application ready for deployment"
      ]
    },
    {
      id: 5,
      title: "Deployment & Launch",
      duration: "Week 7-8",
      icon: <Clock className="h-6 w-6 text-red-600" />,
      description: "Seamless deployment to production with comprehensive support and monitoring.",
      activities: [
        "Production environment setup and configuration",
        "Data migration and system integration",
        "User training and documentation delivery",
        "Go-live support and monitoring"
      ],
      deliverables: [
        "Live application in production environment",
        "User training materials and documentation",
        "Monitoring and analytics dashboard"
      ]
    }
  ];

  const projectTypes = [
    {
      type: "Simple Application",
      duration: "4-6 weeks",
      description: "Basic workflows, minimal integrations",
      examples: ["Task management", "Simple CRM", "Basic inventory"]
    },
    {
      type: "Standard Application", 
      duration: "6-8 weeks",
      description: "Complex workflows, multiple integrations, AI features",
      examples: ["Full CRM system", "E-commerce platform", "HR management"]
    },
    {
      type: "Enterprise Application",
      duration: "8-12 weeks", 
      description: "Complex business logic, enterprise integrations",
      examples: ["ERP system", "Financial platform", "Supply chain management"]
    }
  ];

  const communicationMethods = [
    {
      title: "Daily Updates",
      description: "Progress reports via email or Slack",
      icon: <MessageSquare className="h-5 w-5 text-blue-600" />
    },
    {
      title: "Weekly Demos",
      description: "Live demonstrations of progress",
      icon: <Users className="h-5 w-5 text-green-600" />
    },
    {
      title: "Real-time Access",
      description: "View development environment anytime",
      icon: <Clock className="h-5 w-5 text-purple-600" />
    },
    {
      title: "Direct Communication",
      description: "Direct line to your development team",
      icon: <Rocket className="h-5 w-5 text-orange-600" />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-6">Development Process & Timeline</h1>
        <p className="text-lg text-muted-foreground">
          A proven 5-phase methodology that delivers exceptional custom applications in 6-8 weeks.
        </p>
      </div>

      {/* Process Phases */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Our 5-Phase Process</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From initial discovery to live deployment, every step is designed for transparency and rapid delivery.
          </p>
        </div>

        <div className="space-y-6">
          {phases.map((phase, index) => (
            <Card key={phase.id} className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      {phase.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">Phase {phase.id}</h3>
                        <Badge variant="outline">{phase.duration}</Badge>
                      </div>
                      <h4 className="font-medium text-primary">{phase.title}</h4>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">{phase.description}</p>
                </div>

                <div className="lg:w-2/3 grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2 text-blue-700">Key Activities</h5>
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
                    <h5 className="font-medium mb-2 text-green-700">Deliverables</h5>
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

              {index < phases.length - 1 && (
                <div className="flex justify-center mt-6">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Timeline by Project Type */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Timeline by Project Complexity</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Project duration varies based on complexity and requirements.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {projectTypes.map((project, index) => (
            <Card key={index} className="p-6">
              <h3 className="font-semibold mb-2">{project.type}</h3>
              <div className="text-lg font-medium text-primary mb-3">{project.duration}</div>
              <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
              <div>
                <h4 className="font-medium mb-2 text-sm">Examples:</h4>
                <ul className="space-y-1 text-sm">
                  {project.examples.map((example, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Communication & Updates */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Communication & Updates</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay informed throughout the entire development process.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {communicationMethods.map((method, index) => (
            <Card key={index} className="p-4 text-center">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                {method.icon}
              </div>
              <h3 className="font-medium mb-2">{method.title}</h3>
              <p className="text-sm text-muted-foreground">{method.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Acceleration Benefits */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Why We're 10x Faster</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">80%</div>
            <div className="text-sm text-muted-foreground">Faster Development</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">90%</div>
            <div className="text-sm text-muted-foreground">Automated Testing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">6-8</div>
            <div className="text-sm text-muted-foreground">Weeks vs 6+ Months</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">100%</div>
            <div className="text-sm text-muted-foreground">Code Ownership</div>
          </div>
        </div>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Your Project?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Let's discuss your requirements and see how our proven process can bring your vision to life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/contact">Schedule Consultation</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/documentation/delivery">Learn About Delivery</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Process;