
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const QuickStart = () => {
  return (
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Link to="/documentation" className="text-primary hover:underline flex items-center mb-4">
              <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
              <span>Back to Documentation</span>
            </Link>
            <h1 className="text-4xl font-bold mb-4">Getting Started Guide</h1>
            <p className="text-muted-foreground text-lg">
              How we work together to build your custom software solution.
            </p>
          </div>

          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Step 1: Discovery Call</h2>
              <ol className="space-y-4 list-decimal list-inside text-muted-foreground">
                <li>Schedule a <Link to="/contact" className="text-primary hover:underline">discovery call</Link> with our team</li>
                <li>Discuss your current business processes and pain points</li>
                <li>Define your specific software requirements</li>
                <li>Review similar solutions we've built for other clients</li>
              </ol>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Step 2: Project Proposal</h2>
              <ol className="space-y-4 list-decimal list-inside text-muted-foreground">
                <li>Receive a detailed project proposal with scope and timeline</li>
                <li>Review the custom solution architecture designed for your needs</li>
                <li>Discuss any adjustments or additional requirements</li>
                <li>Finalize the flat-rate pricing and project agreement</li>
              </ol>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Step 3: Development Phase</h2>
              <p className="text-muted-foreground mb-4">
                Our AI-powered development process begins, with regular communication and updates:
              </p>
              <ol className="space-y-4 list-decimal list-inside text-muted-foreground">
                <li>Weekly progress updates with screenshots and demos</li>
                <li>Feedback sessions to ensure the solution meets your expectations</li>
                <li>Integration testing with your existing systems</li>
                <li>User acceptance testing before final delivery</li>
              </ol>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Step 4: Delivery & Launch</h2>
              <p className="text-muted-foreground mb-4">
                Final delivery of your custom software solution:
              </p>
              <ol className="space-y-4 list-decimal list-inside text-muted-foreground">
                <li>Complete deployment to your hosting environment</li>
                <li>Training session for your team on how to use the software</li>
                <li>Documentation and user guides specific to your solution</li>
                <li>Ongoing support and maintenance plan discussion</li>
              </ol>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-4">
                Ready to build your custom software solution? Let's discuss your requirements:
              </p>
              <ul className="space-y-4">
                <li>
                  <Link to="/contact" className="text-primary hover:underline flex items-center">
                    <span>Schedule a discovery call</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </li>
                <li>
                  <Link to="/documentation/process" className="text-primary hover:underline flex items-center">
                    <span>Learn about our detailed process</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </li>
                <li>
                  <Link to="/apps" className="text-primary hover:underline flex items-center">
                    <span>Browse our application showcase</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
  );
};

export default QuickStart;
