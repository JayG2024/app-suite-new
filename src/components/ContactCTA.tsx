
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ContactCTA = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-primary/10 to-primary/5">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Custom Software Apps, One Simple Price</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Enterprise-grade business applications customized for your needs without the enterprise complexity or pricing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8 border border-border">
            <h3 className="text-2xl font-bold mb-4">Why Choose App Suite</h3>
            <ul className="space-y-4">
              {[
                "Choose from 20+ business applications",
                "Fully customized to your brand and needs",
                "No per-user fees or hidden costs",
                "Fast deployment and implementation",
                "Ongoing support and maintenance",
                "Try before you buy with interactive demos"
              ].map((point, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8 border border-border">
            <h3 className="text-2xl font-bold mb-4">Simple, Transparent Pricing</h3>
            <div className="mb-6">
              <div className="text-center mb-2">
                <span className="text-4xl font-bold">$5,000</span>
                <span className="text-muted-foreground ml-2">starting price</span>
              </div>
              <p className="text-center text-muted-foreground">
                Standard applications start at $5,000. AI features and integrations available at additional tiers.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between pb-2 border-b">
                <span>Standard Application</span>
                <span className="font-medium">$5,000</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span>AI-Powered Features</span>
                <span className="font-medium">$7,500</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span>Enterprise Solution</span>
                <span className="font-medium">$10,000</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span>Mini Tools (each)</span>
                <span className="font-medium">$2,500</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Additional API Integration</span>
                <span>$2,500 each</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-lg mb-6">
            Ready to transform your business with powerful, customized tools without breaking the bank?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="font-semibold group" onClick={() => navigate('/')}>
              Browse Applications
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="font-semibold" onClick={() => navigate('/extensions')}>
              View Mini Tools
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
