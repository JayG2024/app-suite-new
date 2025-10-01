import { 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  MessageSquare, 
  Calendar,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, FormEvent } from "react";
import { toast } from "sonner";
import SEO from "@/components/SEO";

interface FormData {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  projectType: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    projectType: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send contact form via Resend
      const response = await fetch('/api/send-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you within 24 hours.");
      } else {
        throw new Error('Failed to send message');
      }
      
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
        projectType: ""
      });

    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to send message: ${errorMessage}. Please try again or email us directly at support@app-suite.io.`);
      
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
        projectType: ""
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectTypes = [
    "Custom Business Application",
    "API Integration", 
    "Database Solution",
    "Workflow Automation",
    "E-commerce Platform",
    "Enterprise Software",
    "Other"
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      value: "support@app-suite.io",
      action: "Send Email",
      primary: true
    },
    {
      icon: Calendar,
      title: "Schedule Demo",
      description: "Book a personalized demo",
      value: "30-minute consultation",
      action: "Book Now",
      primary: false
    }
  ];

  return (
    <div>
      <SEO 
        title="Contact App Suite | Free Consultation for Custom Apps"
        description="Ready to stop renting software? Schedule a free 30-minute consultation. Get flat-rate quote for your custom AI business application. Contact: support@app-suite.io"
        keywords="contact app suite, free consultation, custom app quote, business software consultation, AI application development"
      />
      {/* Hero Section */}
      <div className="bg-primary/5 py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">
            Let's Build Something Amazing Together
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Get custom business applications and solutions at a flat rate. 
            No surprises, no hidden fees, just results.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          
          {/* Contact Methods */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className={`transition-all duration-300 hover:shadow-md ${method.primary ? 'border-primary/20' : ''}`}>
                <CardHeader className="text-center pb-3">
                  <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${method.primary ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    <method.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{method.title}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="font-medium mb-4 text-sm">{method.value}</p>
                  <Button 
                    variant={method.primary ? "default" : "outline"} 
                    className="w-full"
                    onClick={() => {
                      if (method.title === "Email Support") {
                        window.location.href = "mailto:support@app-suite.io";
                      } else if (method.title === "Schedule Demo") {
                        // Open Calendly in new tab
                        window.open('https://calendly.com/jason-jaydus', '_blank');
                      }
                    }}
                  >
                    {method.action}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Contact Form */}
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Tell Us About Your Project</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24 hours with a detailed proposal.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Full Name *</label>
                        <Input 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email Address *</label>
                        <Input 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          type="email" 
                          placeholder="john@company.com" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Company Name</label>
                        <Input 
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Your Company Inc." 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Project Type</label>
                        <select 
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select project type</option>
                          {projectTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject *</label>
                      <Input 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?" 
                        required 
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Project Details *</label>
                      <Textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="min-h-[120px] resize-none"
                        placeholder="Tell us about your project requirements, timeline, and any specific features you need..."
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-11" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Email</p>
                      <p className="text-sm text-muted-foreground">support@app-suite.io</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Business Hours</p>
                      <p className="text-sm text-muted-foreground">Mon - Fri: 9:00 AM - 6:00 PM EST</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Location</p>
                      <p className="text-sm text-muted-foreground">651 N. Broad St.<br />Middletown, DE, USA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle>Why Choose App Suite?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Transparent flat-rate pricing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Expert development team</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Fast project delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Ongoing support included</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;