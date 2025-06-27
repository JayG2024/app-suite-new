
import { ScrollText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SEO from "@/components/SEO";

const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <SEO title="Terms of Service - App Suite Legal Terms" description="App Suite's terms of service outlining the legal agreement for our custom software development services, including project terms, payments, and intellectual property." />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <ScrollText className="h-12 w-12 text-primary mr-4" />
          <h1 className="text-4xl font-bold">Terms of Service</h1>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-muted-foreground text-center mb-12">
            Last updated: June 1, 2025
          </p>

          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-6">
              By accessing and using App Suite's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
            </p>
            <Separator className="my-6" />
            <h3 className="text-xl font-semibold mb-4">License Grant</h3>
            <p className="text-muted-foreground">
              Subject to these Terms, App Suite grants you a limited, non-exclusive, non-transferable license to use our services for your business purposes. This license is for the sole purpose of enabling you to use and enjoy the benefit of the services as provided by App Suite, in the manner permitted by these Terms.
            </p>
          </Card>

          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Service Usage</h2>
            <p className="text-muted-foreground mb-4">
              You agree to use the services only for lawful purposes and in accordance with these Terms. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Maintaining the security of your account</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring your use complies with all applicable laws</li>
              <li>Obtaining and maintaining all necessary hardware, software, and other equipment needed for access to and use of the services</li>
              <li>Ensuring all persons who access the services through your account are aware of these Terms and comply with them</li>
            </ul>
            <Separator className="my-6" />
            <h3 className="text-xl font-semibold mb-4">Prohibited Uses</h3>
            <p className="text-muted-foreground mb-4">
              You may not use our services for any illegal or unauthorized purpose. You must not, in the use of the services, violate any laws in your jurisdiction (including but not limited to copyright laws). You are prohibited from:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the services</li>
              <li>Using the services in any manner that could disable, overburden, damage, or impair the site or interfere with any other party's use of the services</li>
              <li>Using any robot, spider, or other automatic device, process, or means to access the services for any purpose</li>
              <li>Introducing any viruses, trojan horses, worms, logic bombs, or other material that is malicious or technologically harmful</li>
            </ul>
          </Card>

          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              All rights, title, and interest in and to the services, including all intellectual property rights, are and will remain the exclusive property of App Suite and its licensors. The services are protected by copyright, trademark, and other laws of both the United States and foreign countries.
            </p>
            <Separator className="my-6" />
            <h3 className="text-xl font-semibold mb-4">Your Content</h3>
            <p className="text-muted-foreground">
              You retain all your ownership rights in your content. By uploading content to our services, you grant App Suite a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your content in connection with the services. This license exists only for the purpose of operating, promoting, and improving our services.
            </p>
          </Card>

          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Subscription and Payments</h2>
            <p className="text-muted-foreground mb-4">
              Some of our services require payment of fees. You shall pay all applicable fees, as described on our website in connection with the services selected by you. We reserve the right to change our prices at any time. If we change our prices, we will provide notice of the change on the website or by email, at our option.
            </p>
            <Separator className="my-6" />
            <h3 className="text-xl font-semibold mb-4">Billing and Renewal</h3>
            <p className="text-muted-foreground mb-4">
              By selecting a subscription plan, you agree to pay App Suite the monthly or annual subscription fees indicated. Subscription payments will be charged on a pre-pay basis on the day you sign up and will cover the use of that service for the subscription period as indicated.
            </p>
            <p className="text-muted-foreground">
              Unless you notify App Suite before the end of the applicable subscription period that you want to cancel, your subscription will automatically renew and you authorize us to collect the then-applicable annual or monthly subscription fee using any credit card or other payment mechanism we have on record for you.
            </p>
          </Card>

          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Termination</h2>
            <p className="text-muted-foreground mb-4">
              We may terminate or suspend your account and bar access to the services immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
            <p className="text-muted-foreground mb-4">
              If you wish to terminate your account, you may simply discontinue using the services, or notify us that you wish to terminate your account. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </Card>

          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              In no event shall App Suite, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Your access to or use of or inability to access or use the services</li>
              <li>Any conduct or content of any third party on the services</li>
              <li>Any content obtained from the services</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
          </Card>

          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
            <p className="text-muted-foreground mb-4">
              These Terms shall be governed and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="text-muted-foreground">
              By continuing to access or use our services after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the services.
            </p>
          </Card>

          <div className="bg-primary/5 rounded-lg p-8 my-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-muted-foreground mb-6">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="space-y-2">
              <p className="font-medium">App Suite</p>
              <p className="text-muted-foreground">651 N. Broad St.</p>
              <p className="text-muted-foreground">Middletown, DE, USA</p>
              <p className="text-muted-foreground">Email: support@jaydus.ai</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
