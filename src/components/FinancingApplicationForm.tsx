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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FinancingApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectDetails: {
    projectType: string;
    basePrice: number;
    apiCost: number;
    totalProjectCost: number;
    downPayment: number;
    amountToFinance: number;
    financingFee: number;
    totalWithFinancing: number;
    monthlyPayment: number;
    financingTerm: number;
    needFinancing: boolean;
  };
}

const FinancingApplicationForm: React.FC<FinancingApplicationFormProps> = ({
  isOpen,
  onClose,
  projectDetails,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectDescription: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/.netlify/functions/financing-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          projectDetails,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setIsSuccess(true);
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you within 24 hours.",
      });

      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({ name: '', email: '', phone: '', company: '', projectDescription: '' });
      }, 3000);
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit Financing Application</DialogTitle>
          <DialogDescription>
            Complete your application for {projectDetails.needFinancing ? 'financing' : 'your project'}. 
            We'll review and respond within 24 hours.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-lg font-semibold">Application Submitted Successfully!</p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              We'll review your application and contact you within 24 hours.
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
              <p className="font-semibold mb-2">What happens next:</p>
              <ul className="space-y-1">
                <li>• Application review (1-2 hours)</li>
                <li>• Approval notification (within 24 hours)</li>
                <li>• Project kickoff meeting scheduled</li>
                <li>• Development begins immediately after</li>
              </ul>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
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
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Acme Corp"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDescription">Project Description</Label>
              <Textarea
                id="projectDescription"
                placeholder="Brief description of your project and business needs..."
                value={formData.projectDescription}
                onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                rows={3}
              />
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
              <h4 className="font-semibold">Application Summary:</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>Project Type:</div>
                <div className="font-medium">{projectDetails.projectType}</div>
                <div>Total Cost:</div>
                <div className="font-medium">${projectDetails.totalProjectCost.toLocaleString()}</div>
                {projectDetails.needFinancing && (
                  <>
                    <div>Down Payment:</div>
                    <div className="font-medium">${projectDetails.downPayment.toLocaleString()}</div>
                    <div>Monthly Payment:</div>
                    <div className="font-medium">${projectDetails.monthlyPayment.toFixed(2)}/mo</div>
                    <div>Term:</div>
                    <div className="font-medium">{projectDetails.financingTerm} months</div>
                  </>
                )}
              </div>
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
                  'Submit Application'
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              By submitting, you agree to our terms and authorize us to contact you 
              regarding your application.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FinancingApplicationForm;