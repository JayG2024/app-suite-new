import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Calculator, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FinancingCTAProps {
  variant?: "banner" | "card" | "compact";
  className?: string;
}

const FinancingCTA = ({ variant = "banner", className = "" }: FinancingCTAProps) => {
  const navigate = useNavigate();

  if (variant === "compact") {
    return (
      <div className={`fixed bottom-6 left-6 z-50 ${className}`}>
        <Card className="bg-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5" />
              <div>
                <div className="font-bold text-sm">Need Financing?</div>
                <div className="text-xs opacity-90">6-12 month plans available</div>
              </div>
              <Button 
                size="sm" 
                variant="secondary"
                onClick={() => navigate('/price-calculator')}
              >
                Get Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <Card className={`bg-gradient-to-r from-green-50 to-blue-50 border-green-200 ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CreditCard className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-bold">Financing Available</h3>
          </div>
          <p className="text-muted-foreground mb-6">
            Finance your custom app over 6 or 12 months. No large upfront investment required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => navigate('/price-calculator')}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Price Your App
            </Button>
            <Button 
              variant="outline" 
              className="border-green-600 text-green-600"
              onClick={() => navigate('/payment-terms')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Financing Terms
            </Button>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-green-600">6 Months</div>
              <div className="text-muted-foreground">+10% total</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-600">12 Months</div>
              <div className="text-muted-foreground">+15% total</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default banner variant
  return (
    <section className={`py-12 bg-gradient-to-r from-green-50 to-blue-50 border-y border-green-200 ${className}`}>
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <CreditCard className="h-8 w-8 text-green-600" />
          <h2 className="text-2xl font-bold">Need Financing? We've Got You Covered!</h2>
        </div>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Finance your custom app over 6 or 12 months with competitive rates. 
          Get enterprise software without the enterprise upfront cost.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button 
            size="lg" 
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => navigate('/price-calculator')}
          >
            💳 Price Your App with Financing
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
            onClick={() => navigate('/payment-terms')}
          >
            📋 View Financing Terms
          </Button>
        </div>
        <div className="flex justify-center gap-8 text-sm">
          <div className="text-center">
            <div className="font-bold text-green-600">6 Months</div>
            <div className="text-muted-foreground">+10% total</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-green-600">12 Months</div>
            <div className="text-muted-foreground">+15% total</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinancingCTA;