
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { businessApps } from "@/data/businessApps";
import { Receipt, Users, BarChart3, Megaphone, Sparkles } from "lucide-react";
import ProjectScopeChat from "./ProjectScopeChat";

interface AppShowcaseProps {
  selectedCategory: string | null;
}

const ITEMS_PER_PAGE = 9; // Show 9 items initially for better mobile performance

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

const AppShowcase = ({ selectedCategory }: AppShowcaseProps) => {
  const [openAppId, setOpenAppId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  
  const filteredApps = selectedCategory 
    ? businessApps.filter(app => app.category === selectedCategory)
    : businessApps;

  const displayedApps = showAll ? filteredApps : filteredApps.slice(0, ITEMS_PER_PAGE);

  return (
    <div id="browse-apps" className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {displayedApps.map((app) => (
          <Card key={app.id} className="overflow-hidden hover:shadow-lg transition-shadow p-4 sm:p-6">
            <div className="flex items-start gap-3 mb-3">
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                {getCategoryIcon(app.category)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-semibold line-clamp-2 mb-1">{app.title}</h3>
                <div className="flex gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {app.category}
                  </Badge>
                  <Badge className="bg-primary/20 text-primary text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
              {app.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
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
            </div>
          </Card>
        ))}
      </div>

      {filteredApps.length > ITEMS_PER_PAGE && !showAll && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowAll(true)}
            className="mx-auto"
          >
            See More Apps
          </Button>
        </div>
      )}

      <div className="mt-16 bg-muted/50 rounded-lg p-4 sm:p-8">
        <ProjectScopeChat />
      </div>
    </div>
  );
};

export default AppShowcase;
