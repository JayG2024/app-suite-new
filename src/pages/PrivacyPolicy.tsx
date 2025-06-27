
import { Shield, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

const PrivacyPolicy = () => {
  return (
      
      <div className="container mx-auto px-4 py-12">
        <SEO title="Privacy Policy - App Suite Data Protection" description="App Suite's privacy policy detailing how we collect, use, and protect your personal information during our custom software development services." />
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <Shield className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground text-center mb-12">
              Last updated: June 1, 2025
            </p>

            <div className="bg-muted/30 rounded-lg p-6 mb-8">
              <p className="text-sm text-muted-foreground">
                This Privacy Policy describes how App Suite ("we," "us," or "our") collects, uses, and shares your personal information when you visit our website, use our applications, or engage with our services. By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>

            <Accordion type="single" collapsible className="mb-8">
              <AccordionItem value="summary">
                <AccordionTrigger className="text-xl font-semibold">
                  Summary of Key Points
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-2">
                  <p>• We collect personal information that you provide directly to us.</p>
                  <p>• We use cookies and similar tracking technologies to enhance your experience.</p>
                  <p>• Your data is secured using industry-standard encryption and security practices.</p>
                  <p>• We share your information only with your consent or as required by law.</p>
                  <p>• You have rights to access, correct, or delete your personal information.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                We collect information you provide directly to us when you use our services, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
                <li><span className="font-medium">Account information:</span> Name, email address, password, company details, and other information you provide when creating an account.</li>
                <li><span className="font-medium">Usage data:</span> Information about how you use our services, including log data, device information, and analytics.</li>
                <li><span className="font-medium">Communication preferences:</span> Your preferences for receiving communications from us.</li>
                <li><span className="font-medium">Payment information:</span> Credit card details, billing address, and other payment information (processed securely through our payment processors).</li>
                <li><span className="font-medium">Content you provide:</span> Any content you upload, create, or share through our services.</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">Information Collected Automatically</h3>
              <p className="text-muted-foreground mb-4">
                When you access or use our services, we automatically collect certain information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><span className="font-medium">Log information:</span> IP address, browser type, operating system, referring URLs, access times, and pages viewed.</li>
                <li><span className="font-medium">Device information:</span> Hardware model, operating system and version, unique device identifiers, and mobile network information.</li>
                <li><span className="font-medium">Location information:</span> Your approximate location as derived from your IP address.</li>
                <li><span className="font-medium">Cookie data:</span> Information collected through cookies and similar technologies. For more information, please see our <Link to="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>.</li>
              </ul>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices, updates, security alerts, and support messages</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Communicate with you about products, services, offers, and events</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
                <li>Detect, prevent, and address technical issues, fraud, or illegal activity</li>
                <li>Personalize and improve your experience with our services</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">Legal Basis for Processing</h3>
              <p className="text-muted-foreground">
                We process your information based on one or more of the following legal grounds:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><span className="font-medium">Performance of a contract:</span> Processing necessary to fulfill our contractual obligations to you.</li>
                <li><span className="font-medium">Legitimate interests:</span> Processing necessary for our legitimate business interests.</li>
                <li><span className="font-medium">Compliance with legal obligations:</span> Processing necessary to comply with applicable laws.</li>
                <li><span className="font-medium">Consent:</span> Processing based on your explicit consent.</li>
              </ul>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Encryption of sensitive data both in transit and at rest</li>
                <li>Regular security assessments and penetration testing</li>
                <li>Access controls and authentication procedures</li>
                <li>Regular backup procedures to prevent data loss</li>
                <li>Employee training on data protection and security practices</li>
              </ul>
              <p className="text-muted-foreground">
                However, no security system is impenetrable, and we cannot guarantee the absolute security of our systems. If you have reason to believe that your interaction with us is no longer secure, please contact us immediately.
              </p>
            </Card>
            
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Your Rights and Choices</h2>
              <p className="text-muted-foreground mb-4">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
                <li><span className="font-medium">Access:</span> Request access to your personal information.</li>
                <li><span className="font-medium">Correction:</span> Request that we correct inaccurate or incomplete information.</li>
                <li><span className="font-medium">Deletion:</span> Request that we delete your personal information.</li>
                <li><span className="font-medium">Restriction:</span> Request that we restrict the processing of your information.</li>
                <li><span className="font-medium">Data portability:</span> Request a copy of your personal information in a structured, machine-readable format.</li>
                <li><span className="font-medium">Objection:</span> Object to our processing of your personal information.</li>
              </ul>
              <p className="text-muted-foreground">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
              </p>
            </Card>
            
            <div className="bg-primary/5 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="space-y-2 mb-6">
                <p className="font-medium">App Suite Privacy Team</p>
                <p className="text-muted-foreground">651 N. Broad St.</p>
                <p className="text-muted-foreground">Middletown, DE, USA</p>
                <p className="text-muted-foreground">Email: support@jaydus.ai</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/cookie-policy">Cookie Policy</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link to="/terms">Terms of Service</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
  );
};

export default PrivacyPolicy;
