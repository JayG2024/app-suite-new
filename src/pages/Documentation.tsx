
import { BookOpen, FileText, ArrowRight, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

const Documentation = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <SEO title="Documentation - App Suite Development Guides" description="Comprehensive documentation for App Suite's custom software development process, including guides for installation, configuration, customization, and AI capabilities." />
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="flex justify-center mb-4">
          <BookOpen className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-6">Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Everything you need to know about working with App Suite for your custom application development
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card className="p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Getting Started</h3>
          </div>
          <p className="text-muted-foreground mb-4 flex-grow">
            Learn how our custom application development process works and how to get started.
          </p>
          <ul className="space-y-2">
            <li>
              <Link to="/documentation/quick-start" className="text-primary hover:underline flex items-center">
                <span>How We Work</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </li>
            <li>
              <Link to="/documentation/client-onboarding" className="text-primary hover:underline flex items-center">
                <span>Client Onboarding</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </li>
            <li>
              <Link to="/documentation/configuration" className="text-primary hover:underline flex items-center">
                <span>Requirements Gathering</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </li>
          </ul>
        </Card>

        <Card className="p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Implementation Guides</h3>
          </div>
          <p className="text-muted-foreground mb-4 flex-grow">
            Step-by-step guides for project implementation and setup.
          </p>
          <ul className="space-y-2">
            <li>
              <Link to="/documentation/installation" className="text-primary hover:underline flex items-center">
                <span>Project Kickoff Process</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </li>
            <li>
              <Link to="/documentation/configuration" className="text-primary hover:underline flex items-center">
                <span>Requirements Gathering</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </li>
            <li>
              <Link to="/documentation/integrations" className="text-primary hover:underline flex items-center">
                <span>Integration Planning</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </li>
            <li>
              <Link to="/documentation/customization" className="text-primary hover:underline flex items-center">
                <span>Customization Options</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </li>
          </ul>
        </Card>

        <Card className="p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Project Process</h3>
          </div>
          <p className="text-muted-foreground mb-4 flex-grow">
            Learn about our custom development process and how we work with you.
          </p>
          <ul className="space-y-2">
            <li>
              <Link to="/documentation/process" className="text-primary hover:underline flex items-center">
                <span>Development Process & Timeline</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </li>
            <li>
              <Link to="/documentation/delivery" className="text-primary hover:underline flex items-center">
                <span>Delivery & Support</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </li>
          </ul>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Popular Documentation Topics</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-3">AI Capabilities</h3>
            <p className="text-muted-foreground mb-4">
              Learn how our AI-powered features can transform your business processes.
            </p>
            <Button asChild>
              <Link to="/documentation/ai-capabilities">Explore AI Features</Link>
            </Button>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-3">Integration Capabilities</h3>
            <p className="text-muted-foreground mb-4">
              Learn how we can integrate your custom applications with existing business tools.
            </p>
            <Button asChild>
              <Link to="/documentation/integrations">View Integration Options</Link>
            </Button>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-3">Customization Options</h3>
            <p className="text-muted-foreground mb-4">
              Discover how we customize applications to match your specific business requirements.
            </p>
            <Button asChild>
              <Link to="/documentation/customization">Customize Your Experience</Link>
            </Button>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-3">Data Security</h3>
            <p className="text-muted-foreground mb-4">
              Understand how we protect your business data and maintain compliance.
            </p>
            <Button asChild>
              <Link to="/documentation/security">Security Information</Link>
            </Button>
          </Card>
        </div>

        <div className="bg-muted p-6 rounded-lg flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-2">Need Technical Support?</h3>
            <p className="text-muted-foreground">
              Our support team is here to help you with any issues or questions.
            </p>
          </div>
          <Button className="mt-4 md:mt-0" asChild>
            <Link to="/help-center">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
