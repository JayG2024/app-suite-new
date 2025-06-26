import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BusinessPlanRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  availableProducts: Array<{ id: string; name: string }>;
}

const BusinessPlanRequestForm: React.FC<BusinessPlanRequestFormProps> = ({
  isOpen,
  onClose,
  productName,
  availableProducts,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    businessPlan: productName || '',
    name: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.businessPlan || !formData.name || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/.netlify/functions/business-plan-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessPlan: formData.businessPlan,
          name: formData.name,
          phone: formData.phone,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      setIsSuccess(true);
      toast({
        title: "Request Submitted!",
        description: "We'll send you the business plan details within 24 hours.",
      });

      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({ businessPlan: '', name: '', phone: '' });
      }, 2000);
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly at jason@jaydus.ai",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Business Plan</DialogTitle>
          <DialogDescription>
            Get the full business plan, market analysis, and implementation strategy for your chosen solution.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-lg font-semibold">Request Submitted Successfully!</p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Check your email for the business plan details.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessPlan">Which business plan are you interested in?</Label>
              <Select
                value={formData.businessPlan}
                onValueChange={(value) => handleInputChange('businessPlan', value)}
              >
                <SelectTrigger id="businessPlan">
                  <SelectValue placeholder="Select a business plan" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map((product) => (
                    <SelectItem key={product.id} value={product.name}>
                      {product.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="Custom Solution">
                    Custom Solution (Tell us your idea)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>

            <div className="pt-4 flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Request Business Plan'
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              We'll email you the complete business plan within 24 hours.
              All inquiries go to jason@jaydus.ai
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BusinessPlanRequestForm;