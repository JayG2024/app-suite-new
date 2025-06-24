
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Installation = () => {
  return (
    <div className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Link to="/documentation" className="text-primary hover:underline flex items-center mb-4">
              <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
              <span>Back to Documentation</span>
            </Link>
            <h1 className="text-4xl font-bold mb-4">Installation Guide</h1>
            <p className="text-muted-foreground text-lg">
              Learn how to install and deploy App Suite for your organization.
            </p>
          </div>

          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Deployment Options</h2>
              <p className="text-muted-foreground mb-6">
                App Suite offers flexible deployment options to suit your organization's needs and IT infrastructure.
              </p>

              <Tabs defaultValue="cloud">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="cloud">Cloud Hosted</TabsTrigger>
                  <TabsTrigger value="hybrid">Hybrid</TabsTrigger>
                  <TabsTrigger value="onpremise">On-Premise</TabsTrigger>
                </TabsList>
                
                <TabsContent value="cloud" className="mt-6">
                  <h3 className="text-xl font-medium mb-3">Cloud Hosted Solution</h3>
                  <p className="text-muted-foreground mb-3">
                    Our cloud-hosted solution offers the fastest deployment with minimal IT involvement.
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-muted-foreground mb-4">
                    <li>No hardware requirements</li>
                    <li>Automatic updates and maintenance</li>
                    <li>99.9% uptime SLA</li>
                    <li>Enterprise-grade security</li>
                    <li>Scalable resources</li>
                  </ul>
                  <p className="text-muted-foreground">
                    <strong>Recommended for:</strong> Small to medium businesses, startups, and organizations with limited IT resources.
                  </p>
                </TabsContent>
                
                <TabsContent value="hybrid" className="mt-6">
                  <h3 className="text-xl font-medium mb-3">Hybrid Deployment</h3>
                  <p className="text-muted-foreground mb-3">
                    Hybrid deployment keeps your data on-premise while the application runs in our secure cloud.
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-muted-foreground mb-4">
                    <li>Data remains within your network</li>
                    <li>Application updates handled automatically</li>
                    <li>Reduced hardware requirements</li>
                    <li>Secure VPN connection between your data and our application</li>
                  </ul>
                  <p className="text-muted-foreground">
                    <strong>Recommended for:</strong> Organizations with strict data governance requirements but limited IT resources for application maintenance.
                  </p>
                </TabsContent>
                
                <TabsContent value="onpremise" className="mt-6">
                  <h3 className="text-xl font-medium mb-3">On-Premise Installation</h3>
                  <p className="text-muted-foreground mb-3">
                    Full control with complete on-premise deployment within your own infrastructure.
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-muted-foreground mb-4">
                    <li>Complete data and application control</li>
                    <li>Air-gapped installation available</li>
                    <li>Custom security integration with existing systems</li>
                    <li>Manual or automated update options</li>
                  </ul>
                  <p className="text-muted-foreground">
                    <strong>Recommended for:</strong> Large enterprises, government organizations, and businesses in highly regulated industries.
                  </p>
                </TabsContent>
              </Tabs>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">System Requirements</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium mb-3">Cloud Installation</h3>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                  <li>Internet connection (minimum 2 Mbps)</li>
                  <li>No additional hardware or software required</li>
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium mb-3">On-Premise Server Requirements</h3>
                <div className="border rounded-md p-4 mb-4">
                  <h4 className="font-medium mb-2">Minimum Specifications</h4>
                  <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                    <li>CPU: 4 cores (8 recommended)</li>
                    <li>RAM: 16GB (32GB recommended)</li>
                    <li>Storage: 100GB SSD</li>
                    <li>Operating System: Linux (Ubuntu 20.04+, RHEL 8+), Windows Server 2019+</li>
                    <li>Database: PostgreSQL 13+, MySQL 8+, or Microsoft SQL Server 2019+</li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Enterprise Deployment</h4>
                  <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                    <li>CPU: 8+ cores</li>
                    <li>RAM: 64GB+</li>
                    <li>Storage: 500GB+ SSD with redundancy</li>
                    <li>Load balancer for high availability</li>
                    <li>Separate database server recommended</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Installation Process</h2>
              <ol className="space-y-6 list-decimal list-outside ml-6">
                <li>
                  <h3 className="text-xl font-medium">Preparation</h3>
                  <p className="text-muted-foreground">
                    Contact your account representative to determine the best deployment option for your organization.
                  </p>
                </li>
                <li>
                  <h3 className="text-xl font-medium">Environment Setup</h3>
                  <p className="text-muted-foreground">
                    Our implementation team will work with your IT department to prepare the environment.
                  </p>
                </li>
                <li>
                  <h3 className="text-xl font-medium">Installation</h3>
                  <p className="text-muted-foreground">
                    Installation can be performed by our team or your IT staff with guidance from our documentation.
                  </p>
                </li>
                <li>
                  <h3 className="text-xl font-medium">Configuration</h3>
                  <p className="text-muted-foreground">
                    Configure the system to match your business requirements. See our <Link to="/documentation/configuration" className="text-primary hover:underline">Configuration Guide</Link> for details.
                  </p>
                </li>
                <li>
                  <h3 className="text-xl font-medium">Testing</h3>
                  <p className="text-muted-foreground">
                    Verify installation with our comprehensive testing protocol before go-live.
                  </p>
                </li>
              </ol>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
              <div className="space-y-3">
                <Link to="/documentation/configuration" className="block p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <div className="font-medium">Configuration Guide</div>
                  <p className="text-muted-foreground text-sm">Learn how to configure App Suite for your specific business needs.</p>
                </Link>
                <Link to="/documentation/integrations" className="block p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <div className="font-medium">Integration Guide</div>
                  <p className="text-muted-foreground text-sm">Connect App Suite with your existing software ecosystem.</p>
                </Link>
                <Link to="/help-center" className="block p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <div className="font-medium">Support Resources</div>
                  <p className="text-muted-foreground text-sm">Get help from our technical support team during installation.</p>
                </Link>
              </div>
            </Card>
          </div>
        </div>
    </div>
  );
};

export default Installation;
