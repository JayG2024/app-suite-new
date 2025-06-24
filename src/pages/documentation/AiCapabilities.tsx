
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const AiCapabilities = () => {
  return (
    <div className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Link to="/documentation" className="text-primary hover:underline flex items-center mb-4">
              <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
              <span>Back to Documentation</span>
            </Link>
            <h1 className="text-4xl font-bold mb-4">AI Capabilities</h1>
            <p className="text-muted-foreground text-lg">
              Understand the powerful AI features in App Suite and how to leverage them for your business.
            </p>
          </div>

          <div className="space-y-8">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">AI Overview</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                App Suite leverages advanced artificial intelligence to automate tasks, provide insights, and enhance decision-making across all modules. Our AI capabilities include:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Predictive Analytics</h3>
                  <p className="text-muted-foreground text-sm">
                    Forecast trends and outcomes based on historical data and patterns.
                  </p>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Natural Language Processing</h3>
                  <p className="text-muted-foreground text-sm">
                    Understand and generate human language for automated responses and document analysis.
                  </p>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Machine Learning Automation</h3>
                  <p className="text-muted-foreground text-sm">
                    Automate complex processes with systems that learn and improve over time.
                  </p>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Computer Vision</h3>
                  <p className="text-muted-foreground text-sm">
                    Interpret and categorize visual information for document processing and analysis.
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                <strong>Note:</strong> AI features are available based on your subscription tier. See our <Link to="/pricing" className="text-primary hover:underline">pricing page</Link> for details.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">AI Features by Module</h2>
              </div>
              
              <div className="space-y-6">
                <div className="border rounded-md p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-medium">Finance Module</h3>
                    <Badge className="bg-primary/20 text-primary border-none">
                      AI-Powered
                    </Badge>
                  </div>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start">
                      <Sparkles className="h-4 w-4 mr-2 mt-1 text-primary shrink-0" />
                      <div>
                        <strong className="font-medium text-foreground">Anomaly Detection:</strong>
                        <p>Automatically identify unusual transactions that may indicate errors or fraud.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-4 w-4 mr-2 mt-1 text-primary shrink-0" />
                      <div>
                        <strong className="font-medium text-foreground">Cash Flow Forecasting:</strong>
                        <p>Predict future cash positions based on historical patterns and upcoming obligations.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-4 w-4 mr-2 mt-1 text-primary shrink-0" />
                      <div>
                        <strong className="font-medium text-foreground">Intelligent Categorization:</strong>
                        <p>Automatically categorize expenses and income for accurate reporting.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-medium">Customer Management</h3>
                    <Badge className="bg-primary/20 text-primary border-none">
                      AI-Powered
                    </Badge>
                  </div>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start">
                      <Sparkles className="h-4 w-4 mr-2 mt-1 text-primary shrink-0" />
                      <div>
                        <strong className="font-medium text-foreground">Customer Sentiment Analysis:</strong>
                        <p>Analyze communication to detect customer satisfaction levels and mood.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-4 w-4 mr-2 mt-1 text-primary shrink-0" />
                      <div>
                        <strong className="font-medium text-foreground">Next-Best-Action Recommendations:</strong>
                        <p>Receive AI suggestions for the most effective next steps in customer interactions.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-4 w-4 mr-2 mt-1 text-primary shrink-0" />
                      <div>
                        <strong className="font-medium text-foreground">Churn Prediction:</strong>
                        <p>Identify at-risk customers before they leave with early warning indicators.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-medium">Operations Management</h3>
                    <Badge className="bg-primary/20 text-primary border-none">
                      AI-Powered
                    </Badge>
                  </div>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start">
                      <Sparkles className="h-4 w-4 mr-2 mt-1 text-primary shrink-0" />
                      <div>
                        <strong className="font-medium text-foreground">Process Optimization:</strong>
                        <p>Identify bottlenecks and recommend improvements to workflows.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-4 w-4 mr-2 mt-1 text-primary shrink-0" />
                      <div>
                        <strong className="font-medium text-foreground">Resource Allocation:</strong>
                        <p>Optimize staff and resource scheduling based on historical performance data.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-4 w-4 mr-2 mt-1 text-primary shrink-0" />
                      <div>
                        <strong className="font-medium text-foreground">Predictive Maintenance:</strong>
                        <p>Forecast equipment maintenance needs to prevent unplanned downtime.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Configuring AI Features</h2>
              <p className="text-muted-foreground mb-6">
                Most AI capabilities require minimal setup and begin learning automatically as you use the system. However, you can customize settings to optimize performance for your specific business needs.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Data Training</h3>
                  <p className="text-muted-foreground mb-3">
                    AI models improve with more data. You can accelerate training by:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                    <li>Importing historical data during setup</li>
                    <li>Validating AI suggestions to improve accuracy</li>
                    <li>Providing explicit feedback on predictions</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Confidence Thresholds</h3>
                  <p className="text-muted-foreground mb-3">
                    Adjust how confident the AI must be before taking automated actions:
                  </p>
                  <p className="text-muted-foreground">Navigate to Settings {'>'} AI Configuration {'>'} Confidence Settings to adjust thresholds for different features. Higher thresholds require more human oversight but reduce errors.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Privacy Controls</h3>
                  <p className="text-muted-foreground mb-3">
                    Configure which data can be accessed by AI systems:
                  </p>
                  <p className="text-muted-foreground">Navigate to Settings {'>'} Privacy {'>'} AI Data Access to restrict sensitive information from AI processing if needed for compliance or security reasons.</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4 py-1">
                  <h3 className="font-medium mb-1">Start Small</h3>
                  <p className="text-muted-foreground text-sm">
                    Begin with one AI feature in a controlled area before expanding to more critical processes.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4 py-1">
                  <h3 className="font-medium mb-1">Monitor Results</h3>
                  <p className="text-muted-foreground text-sm">
                    Regularly review AI recommendations and outcomes to ensure they align with business goals.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4 py-1">
                  <h3 className="font-medium mb-1">Provide Feedback</h3>
                  <p className="text-muted-foreground text-sm">
                    Actively correct AI mistakes and validate good suggestions to improve model accuracy.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4 py-1">
                  <h3 className="font-medium mb-1">Train Users</h3>
                  <p className="text-muted-foreground text-sm">
                    Ensure your team understands how to work alongside AI features and when to override suggestions.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Button asChild>
                  <Link to="/documentation">Return to Documentation</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
    </div>
  );
};

export default AiCapabilities;
