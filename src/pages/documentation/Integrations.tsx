import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Link as LinkIcon, Database, Cloud, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const IntegrationServices = () => {
  const integrationCategories = [
    {
      title: "Business & Finance",
      icon: <Database className="h-6 w-6 text-primary" />,
      integrations: ["QuickBooks", "Salesforce", "HubSpot", "Stripe", "PayPal", "Square", "Xero", "FreshBooks"]
    },
    {
      title: "Communication & Productivity", 
      icon: <LinkIcon className="h-6 w-6 text-primary" />,
      integrations: ["Slack", "Microsoft Teams", "Gmail", "Outlook", "Zoom", "Calendly", "Trello", "Asana"]
    },
    {
      title: "Cloud & Data",
      icon: <Cloud className="h-6 w-6 text-primary" />,
      integrations: ["Google Drive", "Dropbox", "AWS S3", "Azure", "Google Sheets", "Airtable", "MongoDB", "PostgreSQL"]
    },
    {
      title: "Marketing & Analytics",
      icon: <Zap className="h-6 w-6 text-primary" />,
      integrations: ["Google Analytics", "Facebook Ads", "Mailchimp", "Constant Contact", "Zapier", "Google Ads", "Shopify", "WooCommerce"]
    }
  ];

  return (
    <div className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Link to="/documentation" className="text-primary hover:underline flex items-center mb-4">
              <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
              <span>Back to Documentation</span>
            </Link>
            <h1 className="text-4xl font-bold mb-4">Integration Services</h1>
            <p className="text-muted-foreground text-lg">
              How App Suite builds seamless integrations into your custom application to connect with your existing tools.
            </p>
          </div>

          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Custom Integration Development</h2>
              <p className="text-muted-foreground mb-6">
                We don't provide a platform you integrate with - instead, we build custom integrations directly into your application 
                during development. Your app works seamlessly with all your existing tools from day one.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <LinkIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Built-In Integrations</h3>
                  <p className="text-sm text-muted-foreground">
                    Integrations are coded directly into your custom application
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Real-Time Sync</h3>
                  <p className="text-sm text-muted-foreground">
                    Data flows automatically between your app and existing tools
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">No Setup Required</h3>
                  <p className="text-sm text-muted-foreground">
                    Everything works out of the box - no configuration needed
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Integrations We Build For You</h2>
              <p className="text-muted-foreground mb-6">
                We can integrate your custom application with virtually any service that has an API. Here are some popular integrations we commonly build:
              </p>
              
              <div className="space-y-6">
                {integrationCategories.map((category, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      {category.icon}
                      <h3 className="text-lg font-semibold">{category.title}</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {category.integrations.map((integration, idx) => (
                        <div key={idx} className="text-sm bg-primary/5 px-3 py-2 rounded-md text-center">
                          {integration}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">How We Build Integrations</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Requirements Analysis</h3>
                    <p className="text-muted-foreground">
                      We identify which tools you currently use and how data should flow between your custom app and existing systems.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">API Development</h3>
                    <p className="text-muted-foreground">
                      We build secure, reliable API connections directly into your application's codebase during development.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Data Mapping & Sync</h3>
                    <p className="text-muted-foreground">
                      We ensure data is properly formatted and synchronized between systems, with automatic error handling.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Testing & Validation</h3>
                    <p className="text-muted-foreground">
                      We thoroughly test all integrations to ensure reliable data flow and handle edge cases gracefully.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Integration Benefits</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Seamless Workflow</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">No manual data entry between systems</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Real-time data synchronization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Unified dashboard for all your data</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Business Benefits</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Eliminate duplicate data entry</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Reduce errors and inconsistencies</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Save hours of manual work daily</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <h2 className="text-2xl font-semibold mb-4">Need Custom Integrations?</h2>
              <p className="text-muted-foreground mb-6">
                Let's discuss what tools you're currently using and build seamless integrations into your custom application.
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <Link to="/contact">Discuss Integrations</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/solutions-weve-built">See Integration Examples</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default IntegrationServices;