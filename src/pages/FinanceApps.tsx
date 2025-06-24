
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import SEO from "@/components/SEO";
import { triggerChatbot } from "@/components/ChatbotTrigger";

const FinanceApps = () => {
  return (
      <div className="container mx-auto py-12 px-4 md:px-6 flex-grow">
        <SEO title="Finance Apps - Custom Financial Management Solutions" description="Comprehensive financial management applications including accounting, budgeting, expense tracking, and financial analytics tools built specifically for your business." />
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-primary font-medium text-sm mb-4">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Solutions</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Finance Applications by AI App Suite</h1>
          <p className="text-xl text-muted-foreground">
            Powerful financial tools designed to streamline your business operations
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Accounting Suite</CardTitle>
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none px-2 py-1 h-6 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>AI-Powered</span>
                </Badge>
              </div>
              <CardDescription>
                Comprehensive accounting automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  AI transaction categorization
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Predictive cash flow analysis
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Automated reconciliation
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Smart financial reports
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Tax preparation assistance
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => triggerChatbot('Accounting Suite', 'Finance Apps')}
              >
                Get This App
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Invoice Manager</CardTitle>
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none px-2 py-1 h-6 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>AI-Powered</span>
                </Badge>
              </div>
              <CardDescription>
                Streamlined invoice processing system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Automated invoice generation
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  AI payment prediction
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Intelligent payment reminders
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Revenue forecasting
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Client payment portal
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => triggerChatbot('Invoice Manager', 'Finance Apps')}
              >
                Get This App
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Budget Planner</CardTitle>
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none px-2 py-1 h-6 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>AI-Powered</span>
                </Badge>
              </div>
              <CardDescription>
                Data-driven budget optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  AI-driven budget creation
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Spending pattern analysis
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Cost-saving recommendations
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Investment opportunity detection
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Real-time budget adjustments
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => triggerChatbot('Budget Planner', 'Finance Apps')}
              >
                Get This App
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Tailored Financial Solutions for Your Business</h2>
          <p className="text-muted-foreground mb-6">
            Our AI-powered financial tools can be customized to meet the specific needs of your business, 
            regardless of size or industry.
          </p>
          <Button size="lg">Schedule a Consultation</Button>
        </div>
      </div>
  );
};

export default FinanceApps;
