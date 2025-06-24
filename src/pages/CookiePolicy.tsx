import { Cookie } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SEO from "@/components/SEO";

const CookiePolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <SEO title="Cookie Policy - App Suite Website Cookies" description="Learn about how App Suite uses cookies on our website to improve user experience, track analytics, and provide personalized content for our software development services." />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <Cookie className="h-12 w-12 text-primary mr-4" />
          <h1 className="text-4xl font-bold">Cookie Policy</h1>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-muted-foreground text-center mb-12">
            Last updated: April 25, 2025
          </p>

          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
            <p className="text-muted-foreground mb-6">
              Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide a better user experience.
            </p>
            <p className="text-muted-foreground">
              Cookies contain information that is transferred to your computer's hard drive. They help us to improve our site and to deliver a better and more personalized service by enabling us to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>Estimate our audience size and usage pattern</li>
              <li>Store information about your preferences, allowing us to customize our site according to your individual interests</li>
              <li>Speed up your searches</li>
              <li>Recognize you when you return to our site</li>
            </ul>
          </Card>

          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
            <div className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="text-xl font-medium mb-2">Essential Cookies</h3>
                <p>
                  These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access. You may disable these by changing your browser settings, but this may affect how the website functions.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-xl font-medium mb-2">Analytics Cookies</h3>
                <p>
                  These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.
                </p>
                <p className="mt-2">
                  We use Google Analytics for this purpose. All information these cookies collect is aggregated and therefore anonymous. If you do not allow these cookies we will not know when you have visited our site, and will not be able to monitor its performance.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-xl font-medium mb-2">Functionality Cookies</h3>
                <p>
                  These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
                </p>
                <p className="mt-2">
                  If you do not allow these cookies then some or all of these services may not function properly.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-xl font-medium mb-2">Targeting Cookies</h3>
                <p>
                  These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites.
                </p>
                <p className="mt-2">
                  They do not store directly personal information, but are based on uniquely identifying your browser and internet device. If you do not allow these cookies, you will experience less targeted advertising.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We use cookies for various purposes including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Authentication and security: To identify you when you login to our site and help ensure the security of your account</li>
                <li>Performance and analytics: To analyze how visitors use our website and to monitor website performance</li>
                <li>Functionality: To remember choices you make (such as your language or region)</li>
                <li>Personalization: To recognize you when you return to our website and personalize content</li>
                <li>Advertising: To deliver advertisements more relevant to you and your interests</li>
              </ul>
              <p className="mt-4">
                We also use cookies set by third parties (third-party cookies). These enable third-party features or functionality to be provided on or through the website, such as advertising, interactive content, and analytics.
              </p>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
            <p className="text-muted-foreground mb-4">
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>View cookies stored on your computer</li>
              <li>Delete all or specific cookies</li>
              <li>Block all or specific types of cookies</li>
              <li>Configure cookie settings for different websites</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.allaboutcookies.org" className="text-primary hover:underline">www.allaboutcookies.org</a>.
            </p>
            <div className="mt-6">
              <h3 className="text-xl font-medium mb-2">Browser-Specific Instructions</h3>
              <p className="text-muted-foreground mb-2">
                To manage cookies on different browsers, please refer to the following links:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li><a href="#" className="text-primary hover:underline">Google Chrome</a></li>
                <li><a href="#" className="text-primary hover:underline">Mozilla Firefox</a></li>
                <li><a href="#" className="text-primary hover:underline">Safari</a></li>
                <li><a href="#" className="text-primary hover:underline">Microsoft Edge</a></li>
              </ul>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to Our Cookie Policy</h2>
            <p className="text-muted-foreground mb-4">
              We may update our Cookie Policy from time to time. Any changes we make to our Cookie Policy in the future will be posted on this page and, where appropriate, notified to you by email.
            </p>
            <p className="text-muted-foreground">
              Please check back frequently to see any updates or changes to our Cookie Policy. This Cookie Policy was last updated on April 25, 2025.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
