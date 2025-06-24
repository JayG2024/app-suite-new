import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_CONFIG } from "@/config/app";
import { Loader2, Sparkles, CheckCircle, Mail, Calendar, Upload, FileText, Paperclip, X } from "lucide-react";
import { generateProposalPDF } from "@/utils/pdfGenerator";

interface ProposalData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  industry: string;
  appType: string;
  currentChallenge: string;
  desiredFeatures: string[];
  teamSize: string;
  timeline: string;
  budget: string;
  additionalInfo: string;
}

// Removed bulk contact interfaces

interface ProposalGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProposalGenerator = ({ isOpen, onClose }: ProposalGeneratorProps) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [companyDocuments, setCompanyDocuments] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<ProposalData>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    industry: "",
    appType: "",
    currentChallenge: "",
    desiredFeatures: [],
    teamSize: "",
    timeline: "",
    budget: "",
    additionalInfo: ""
  });

  const appTypes = [
    { value: "crm", label: "CRM System", description: "Customer relationship management" },
    { value: "dashboard", label: "Analytics Dashboard", description: "Data visualization and reporting" },
    { value: "inventory", label: "Inventory Management", description: "Stock tracking and management" },
    { value: "booking", label: "Booking System", description: "Appointment and reservation management" },
    { value: "ecommerce", label: "E-commerce Platform", description: "Online store and sales" },
    { value: "project", label: "Project Management", description: "Task and project tracking" },
    { value: "finance", label: "Financial Management", description: "Accounting and financial tools" },
    { value: "custom", label: "Custom Application", description: "Unique business solution" }
  ];

  const industries = [
    "Technology/Software", "Healthcare", "Real Estate", "Retail/E-commerce",
    "Manufacturing", "Professional Services", "Education", "Finance/Banking",
    "Food & Beverage", "Construction", "Non-profit", "Other"
  ];

  const features = [
    { id: "ai", label: "AI Integration", description: "GPT-4, Claude, automated insights" },
    { id: "auth", label: "User Management", description: "Roles, permissions, authentication" },
    { id: "mobile", label: "Mobile Responsive", description: "Works on all devices" },
    { id: "api", label: "API Integrations", description: "Connect to existing systems" },
    { id: "analytics", label: "Advanced Analytics", description: "Reports and data visualization" },
    { id: "automation", label: "Workflow Automation", description: "Automated processes and triggers" },
    { id: "notifications", label: "Notifications", description: "Email, SMS, in-app alerts" },
    { id: "search", label: "Advanced Search", description: "AI-powered data search" },
    { id: "export", label: "Data Export", description: "PDF, CSV, API exports" },
    { id: "calendar", label: "Calendar Integration", description: "Scheduling and calendar sync" },
    { id: "files", label: "File Management", description: "Upload, store, organize documents" },
    { id: "realtime", label: "Real-time Updates", description: "Live data synchronization" }
  ];

  const budgetRanges = [
    { value: "5000", label: "$5,000 - Standard Package", description: "Custom dashboard application" },
    { value: "7500", label: "$7,500 - AI-Enhanced Package", description: "AI-powered solution" },
    { value: "10000", label: "$10,000 - Enterprise Package", description: "Advanced multi-AI solution" },
    { value: "custom", label: "Let's Discuss", description: "Custom requirements" }
  ];

  const handleInputChange = (field: keyof ProposalData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      desiredFeatures: prev.desiredFeatures.includes(featureId)
        ? prev.desiredFeatures.filter(f => f !== featureId)
        : [...prev.desiredFeatures, featureId]
    }));
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generateProposal = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Log the collected form data
      console.log("Generating proposal with data:", formData);
      
      // Generate unique proposal ID and access code
      const proposalId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const accessCode = Math.random().toString(36).substr(2, 8).toUpperCase();
      
      // Generate PDF proposal
      const pdfBlob = await generateProposalPDF(formData);
      
      // Create secure proposal object
      const proposalData = {
        id: proposalId,
        companyName: formData.companyName,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        industry: formData.industry,
        appType: formData.appType,
        currentChallenge: formData.currentChallenge,
        desiredFeatures: formData.desiredFeatures,
        teamSize: formData.teamSize,
        timeline: formData.timeline,
        budget: formData.budget,
        additionalInfo: formData.additionalInfo,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        viewCount: 0,
        isProtected: true,
        accessCode: accessCode,
        proposalUrl: `${APP_CONFIG.url}/proposal/${proposalId}`
      };
      
      // Store proposal securely (in production, this would be in database)
      localStorage.setItem(`proposal_${proposalId}`, JSON.stringify(proposalData));
      localStorage.setItem('lastProposal', JSON.stringify(proposalData));
      
      // Create lead for Command Center
      const leadData = {
        id: `LEAD-${Date.now()}`,
        company: formData.companyName,
        contact: formData.contactName,
        email: formData.email,
        phone: formData.phone || '',
        value: parseInt(formData.budget) || 5000,
        type: formData.appType === 'ai-enhanced' ? 'ai-enhanced' : 
              formData.appType === 'enterprise' ? 'enterprise' : 'standard',
        stage: 'proposal',
        probability: 40,
        nextAction: 'Follow up within 24 hours',
        nextActionDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        source: 'website_proposal_generator',
        notes: `Generated proposal for ${formData.appType}. Challenge: ${formData.currentChallenge}`,
        createdDate: new Date().toISOString(),
        industry: formData.industry,
        features: formData.desiredFeatures,
        timeline: formData.timeline,
        budget: formData.budget,
        proposalId: proposalData.id
      };

      // Store lead in localStorage for Command Center
      const existingLeads = JSON.parse(localStorage.getItem('app_suite_leads') || '[]');
      existingLeads.push(leadData);
      localStorage.setItem('app_suite_leads', JSON.stringify(existingLeads));

      // Send to Command Center API
      try {
        const leadResponse = await fetch('/.netlify/functions/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leadData)
        });
        
        if (leadResponse.ok) {
          console.log('Lead successfully created in Command Center');
        }
      } catch (apiError) {
        console.error('Error sending to Command Center:', apiError);
      }

      // Send professional proposal email via Resend
      try {
        const emailResponse = await fetch('/.netlify/functions/send-proposal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientData: formData,
            proposalPDF: proposalData.proposalId, // Reference to PDF
            proposalUrl: proposalData.proposalUrl,
            accessCode: proposalData.accessCode,
            leadData: leadData
          })
        });
        
        if (emailResponse.ok) {
          console.log('Proposal emails sent successfully');
        }
      } catch (emailError) {
        console.error('Error sending proposal emails:', emailError);
      }
      
      setIsGenerating(false);
      setIsComplete(true);
    } catch (error) {
      console.error('Error generating proposal:', error);
      setIsGenerating(false);
      // You might want to show an error state here
    }
  };

  const generateTestProposal = (data: ProposalData) => {
    return `
# Custom AI-Powered Application Proposal

**Prepared for:** ${data.contactName}  
**Company:** ${data.companyName}  
**Date:** ${new Date().toLocaleDateString()}

## Executive Summary

Dear ${data.contactName},

Following our analysis of ${data.companyName}'s needs for a ${data.appType} application, we're excited to present this custom solution to address your challenge: "${data.currentChallenge}".

## Proposed Solution

We'll build a custom ${data.appType} application specifically designed for ${data.companyName} in the ${data.industry} industry.

**Key Features:**
${data.desiredFeatures.map(feature => `• ${feature}`).join('\n')}

**Team Size:** ${data.teamSize}  
**Timeline:** ${data.timeline}  
**Budget:** ${data.budget}

## Investment

Based on your requirements, we recommend our ${data.budget === '7500' ? 'AI-Enhanced' : data.budget === '10000' ? 'Enterprise' : 'Standard'} package.

**Total Investment:** $${data.budget}

## Next Steps

1. Schedule a discovery call to finalize requirements
2. Sign agreement and make 50% deposit  
3. Begin development immediately
4. Launch your application in 30 days

Best regards,  
Jason Gordon  
App Suite  
jason@jaydus.ai
`;
  };

  const resetModal = () => {
    setStep(1);
    setIsGenerating(false);
    setIsComplete(false);
    setCompanyDocuments('');
    setUploadedFiles([]);
    setFormData({
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      industry: "",
      appType: "",
      currentChallenge: "",
      desiredFeatures: [],
      teamSize: "",
      timeline: "",
      budget: "",
      additionalInfo: ""
    });
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetModal, 300); // Reset after modal closes
  };


  if (isComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your Proposal is Ready!</h2>
            <p className="text-muted-foreground mb-6">
              We've created a custom online proposal tailored specifically for {formData.companyName}.
            </p>
            <div className="bg-primary/5 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-primary font-medium">
                <Mail className="h-4 w-4" />
                {formData.email}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-8">
              You'll receive an email in about 2 minutes with your access code for your online proposal.
              The proposal includes pricing, timeline, features, AI technology details, and industry-specific recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1" asChild>
                <a href="https://calendly.com/jason-jaydus/30min" target="_blank" rel="noopener noreferrer">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book a Discovery Call
                </a>
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                Back to Website
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isGenerating) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Sparkles className="h-8 w-8 text-primary animate-spin" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Creating Your Custom Proposal</h2>
            <p className="text-muted-foreground mb-6">
              Our AI is analyzing your requirements and crafting a personalized proposal for {formData.companyName}...
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm">Analyzing your business requirements...</span>
              </div>
              <div className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm">Selecting optimal AI models and features...</span>
              </div>
              <div className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm">Generating custom pricing and timeline...</span>
              </div>
              <div className="flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm">Creating your personalized proposal...</span>
              </div>
            </div>
            <div className="mt-6 bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: "75%" }}></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Get Your Custom AI Proposal
          </DialogTitle>
          <DialogDescription>
            Tell us about your project and get a tailored proposal in under 3 minutes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Step {step} of 5</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className={`w-2 h-2 rounded-full ${
                    num <= step ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>


          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Let's start with your details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <Label htmlFor="contactName">Your Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange("contactName", e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold">What type of application do you need?</h3>
              <div className="grid gap-3">
                {appTypes.map((type) => (
                  <Card
                    key={type.value}
                    className={`cursor-pointer transition-all ${
                      formData.appType === type.value ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => handleInputChange("appType", type.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          formData.appType === type.value ? "border-primary bg-primary" : "border-gray-300"
                        }`} />
                        <div>
                          <h4 className="font-medium">{type.label}</h4>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div>
                <Label htmlFor="currentChallenge">What's your biggest challenge right now? *</Label>
                <Textarea
                  id="currentChallenge"
                  value={formData.currentChallenge}
                  onChange={(e) => handleInputChange("currentChallenge", e.target.value)}
                  placeholder="Describe the main problem you're trying to solve..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold">What features do you need?</h3>
              <p className="text-sm text-muted-foreground">Select all that apply</p>
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={feature.id}
                      checked={formData.desiredFeatures.includes(feature.id)}
                      onCheckedChange={() => handleFeatureToggle(feature.id)}
                    />
                    <div className="space-y-1 leading-none">
                      <Label htmlFor={feature.id} className="text-sm font-medium cursor-pointer">
                        {feature.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Select value={formData.teamSize} onValueChange={(value) => handleInputChange("teamSize", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How many users?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1-5 users</SelectItem>
                      <SelectItem value="6-20">6-20 users</SelectItem>
                      <SelectItem value="21-50">21-50 users</SelectItem>
                      <SelectItem value="50+">50+ users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeline">Timeline</Label>
                  <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="When do you need this?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">ASAP (within 30 days)</SelectItem>
                      <SelectItem value="month">Within 1 month</SelectItem>
                      <SelectItem value="quarter">Within 3 months</SelectItem>
                      <SelectItem value="flexible">Timeline is flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Budget and final details</h3>
              <div className="space-y-3">
                {budgetRanges.map((budget) => (
                  <Card
                    key={budget.value}
                    className={`cursor-pointer transition-all ${
                      formData.budget === budget.value ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => handleInputChange("budget", budget.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          formData.budget === budget.value ? "border-primary bg-primary" : "border-gray-300"
                        }`} />
                        <div>
                          <h4 className="font-medium">{budget.label}</h4>
                          <p className="text-sm text-muted-foreground">{budget.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div>
                <Label htmlFor="additionalInfo">Anything else we should know?</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                  placeholder="Any specific requirements, integrations, or questions..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Company Documents (Optional)</h3>
              <p className="text-sm text-muted-foreground">
                Upload any relevant company documents to help us create a more tailored proposal
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="document-upload" className="text-sm font-medium">
                    Upload Documents
                  </Label>
                  <div className="mt-1">
                    <input
                      id="document-upload"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                      onChange={handleDocumentUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Accepted formats: PDF, DOC, DOCX, TXT, PNG, JPG (Max 10MB each)
                  </p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Uploaded Files</Label>
                    <div className="border rounded-md p-3 bg-gray-50 max-h-32 overflow-y-auto">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="companyDocuments">Additional Context</Label>
                  <Textarea
                    id="companyDocuments"
                    value={companyDocuments}
                    onChange={(e) => setCompanyDocuments(e.target.value)}
                    placeholder="Share any additional context about your company, existing systems, or specific requirements that would help us create a better proposal..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
            
            
            <div className="ml-auto">
              {step < 5 ? (
                <Button 
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && (!formData.companyName || !formData.contactName || !formData.email || !formData.industry)) ||
                    (step === 2 && (!formData.appType || !formData.currentChallenge)) ||
                    (step === 3 && formData.desiredFeatures.length === 0) ||
                    (step === 4 && !formData.budget)
                  }
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={generateProposal}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate My Proposal
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalGenerator;
export type { ProposalData };