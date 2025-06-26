
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Receipt, Users, BarChart3, Megaphone, Sparkles, Filter } from "lucide-react";
import { businessApps } from "@/data/businessApps";
import SEO from "@/components/SEO";

const Apps = () => {
  const [openAppId, setOpenAppId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Get all unique categories from the apps
  const categories = ["All", ...new Set(businessApps.map(app => app.category))];
  
  // Filter apps based on selected category
  const filteredApps = selectedCategory 
    ? businessApps.filter(app => app.category === selectedCategory)
    : businessApps;
    
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Finance":
        return <Receipt className="h-6 w-6" />;
      case "Customer Management":
        return <Users className="h-6 w-6" />;
      case "Operations":
        return <BarChart3 className="h-6 w-6" />;
      case "Marketing":
        return <Megaphone className="h-6 w-6" />;
      default:
        return <BarChart3 className="h-6 w-6" />;
    }
  };

  return (
      <div className="container mx-auto py-12 px-4 md:px-6 flex-grow">
        <SEO title="Business Apps - Custom AI-Powered Solutions" description="Browse our comprehensive catalog of AI-powered business applications. From finance to marketing, find the perfect custom software solution for your business needs." />
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-primary font-medium text-sm mb-4">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Business Solutions</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Example Applications & Ideas</h1>
          <p className="text-xl text-muted-foreground">
            Browse example applications for inspiration. We can build ANY custom solution you need - these are just ideas to get you started!
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Don't see what you need? No problem! We build 100% custom applications tailored to your exact requirements.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button 
              key={category}
              variant={selectedCategory === category || (category === "All" && !selectedCategory) ? "default" : "outline"} 
              onClick={() => setSelectedCategory(category === "All" ? null : category)}
              className="rounded-full text-xs sm:text-sm px-3 py-1 h-auto flex items-center gap-1"
              size="sm"
            >
              {category !== "All" && getCategoryIcon(category)}
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredApps.map((app) => (
            <Card key={app.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2 p-4 sm:p-6">
                <div className="flex justify-between items-start">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0 mr-2">
                    {getCategoryIcon(app.category)}
                  </div>
                  <div className="flex flex-wrap gap-2 items-center justify-end">
                    <Badge variant="outline" className="capitalize text-xs whitespace-nowrap">
                      {app.category}
                    </Badge>
                    <Badge className="bg-primary/20 text-primary border-none flex items-center gap-1 text-xs whitespace-nowrap">
                      <Sparkles className="h-3 w-3" />
                      <span>AI-Powered</span>
                    </Badge>
                  </div>
                </div>
                <CardTitle className="mt-2 text-lg sm:text-xl md:text-2xl line-clamp-2">{app.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 pb-2">
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {app.description}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between p-4 sm:p-6 pt-2 gap-2">
                <Dialog open={openAppId === app.id} onOpenChange={(open) => setOpenAppId(open ? app.id : null)}>
                  <Button 
                    onClick={() => setOpenAppId(app.id)} 
                    variant="ghost" 
                    size="sm" 
                    className="w-full sm:w-auto"
                  >
                    View Details
                  </Button>
                  <DialogContent className="sm:max-w-[425px] max-w-[90vw]">
                    <DialogHeader>
                      <DialogTitle className="text-lg sm:text-xl break-words">{app.title}</DialogTitle>
                      <DialogDescription className="py-4">{app.description}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Key Features:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {app.features.map((feature, index) => (
                            <li key={index} className="text-sm">{feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-primary/5 p-3 rounded-md border border-primary/10">
                        <h4 className="font-semibold flex items-center gap-2 text-primary">
                          <Sparkles className="h-4 w-4" />
                          AI Capabilities
                        </h4>
                        <p className="text-sm mt-1">
                          This application leverages advanced AI to automate tasks, provide intelligent insights, and enhance productivity for your business.
                        </p>
                      </div>
                      <div className="pt-4">
                        <Button className="w-full" onClick={() => navigate('/contact')}>Request Customization</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button onClick={() => navigate('/contact')} className="w-full sm:w-auto">Get This App</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Custom Solutions CTA */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/10 to-blue/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Need Something Different?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                These are just examples to spark ideas. We specialize in building completely custom applications 
                that match your unique business processes and requirements. If you can imagine it, we can build it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <a href="/contact">Discuss Your Custom Solution</a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="/proposal">Get Instant Proposal</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default Apps;
