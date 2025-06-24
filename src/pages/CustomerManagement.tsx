
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import SEO from "@/components/SEO";
import { triggerChatbot } from "@/components/ChatbotTrigger";

const CustomerManagement = () => {
  return (
      <div className="container mx-auto py-12 px-4 md:px-6 flex-grow">
        <SEO title="Customer Management Solutions - AI-Powered CRM Tools" description="Explore comprehensive customer management solutions including CRM systems, lead tracking, communication tools, and automated customer service applications." />
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-primary font-medium text-sm mb-4">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Solutions</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Customer Management Solutions by AI App Suite</h1>
          <p className="text-xl text-muted-foreground">
            Powerful AI tools to manage customer relationships and drive business growth
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>CRM Platform</CardTitle>
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none px-2 py-1 h-6 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>AI-Powered</span>
                </Badge>
              </div>
              <CardDescription>
                Comprehensive customer relationship management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  AI-powered contact management
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Intelligent lead scoring
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Predictive sales pipeline
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Automated activity tracking
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  AI-generated reporting
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => triggerChatbot('CRM Platform', 'Customer Management')}
              >
                Get This App
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Support Desk</CardTitle>
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none px-2 py-1 h-6 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>AI-Powered</span>
                </Badge>
              </div>
              <CardDescription>
                Streamlined customer support management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Smart ticket routing
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  AI-powered knowledge base
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Conversational AI chat support
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Sentiment analysis tracking
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Predictive SLA management
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => triggerChatbot('Support Desk', 'Customer Management')}
              >
                Get This App
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Customer Analytics</CardTitle>
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none px-2 py-1 h-6 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>AI-Powered</span>
                </Badge>
              </div>
              <CardDescription>
                Data-driven insights for customer behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  AI customer segmentation
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Predictive behavior analysis
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Advanced predictive modeling
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  AI churn prevention
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Intelligent lifetime value analysis
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => triggerChatbot('Customer Analytics', 'Customer Management')}
              >
                Get This App
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Tailored AI Solutions for Your Business</h2>
          <p className="text-muted-foreground mb-6">
            Our AI-powered customer management tools can be customized to meet the specific needs of your business, 
            regardless of size or industry.
          </p>
          <Button size="lg">Schedule a Consultation</Button>
        </div>
      </div>
  );
};

export default CustomerManagement;
