
import { ArrowRight, Check, CheckCircle, Clock, DollarSign, Rocket, Shield, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

const Sales = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-background/80 backdrop-blur-sm text-sm font-medium">
                <Rocket className="w-4 h-4 text-primary" /> 
                <span>Enterprise apps, SMB prices</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Enterprise Apps at
                <span className="text-primary"> 1/10th the Cost</span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Custom business applications designed, built and deployed in one week for a flat rate of <span className="font-bold text-foreground">$5,000</span>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild>
                  <Link to="/contact">
                    Schedule Demo <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/apps">
                    Browse Applications
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative rounded-lg overflow-hidden shadow-xl border bg-background">
              <div className="p-6">
                <div className="text-xl font-semibold mb-4 flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-primary" />
                  Revolutionary AI Development
                </div>
                <p className="text-muted-foreground mb-6">
                  "What if I told you we could build and deploy your custom business application in just one week instead of months, at just $5,000 instead of $50,000+?"
                </p>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <p>Enterprise-grade applications at SMB prices</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <p>Fully customized to your business needs</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <p>Deployed in just one week</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <p>Advanced AI capabilities built-in</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Offerings Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              What Makes AI App Suite Revolutionary
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              This isn't about cutting corners—it's about cutting out the inefficiency, bloat, and legacy development processes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 transition-all hover:shadow-md border-2 hover:border-primary flex flex-col">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Rapid Development</h3>
              <p className="text-muted-foreground flex-grow">
                Our AI engines generate custom applications in days instead of months, with consistent, bug-free code.
              </p>
            </Card>
            
            <Card className="p-6 transition-all hover:shadow-md border-2 hover:border-primary flex flex-col">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Predictable Pricing</h3>
              <p className="text-muted-foreground flex-grow">
                One flat rate of $5,000 with no hidden costs, no per-user fees, and no surprise charges.
              </p>
            </Card>
            
            <Card className="p-6 transition-all hover:shadow-md border-2 hover:border-primary flex flex-col">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Features</h3>
              <p className="text-muted-foreground flex-grow">
                Advanced AI capabilities come standard in every application, automating workflows and providing insights.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Chart */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              The AI Advantage: Cost & Time Comparison
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how AI App Suite revolutionizes the economics of custom software development.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-background">Factor</th>
                  <th className="p-4 bg-background">Traditional Development</th>
                  <th className="p-4 bg-primary/10">AI App Suite</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="text-left p-4 font-medium">Initial Cost</td>
                  <td className="p-4">$30,000-$100,000+</td>
                  <td className="p-4 bg-primary/5 font-bold">$5,000 flat rate</td>
                </tr>
                <tr className="border-b">
                  <td className="text-left p-4 font-medium">Development Time</td>
                  <td className="p-4">3-6 months</td>
                  <td className="p-4 bg-primary/5 font-bold">1 week</td>
                </tr>
                <tr className="border-b">
                  <td className="text-left p-4 font-medium">Per-User Fees</td>
                  <td className="p-4">Often $50-100/user/month</td>
                  <td className="p-4 bg-primary/5 font-bold">$0 - No per-user fees</td>
                </tr>
                <tr className="border-b">
                  <td className="text-left p-4 font-medium">Implementation Fee</td>
                  <td className="p-4">$5,000-$15,000</td>
                  <td className="p-4 bg-primary/5 font-bold">Included</td>
                </tr>
                <tr className="border-b">
                  <td className="text-left p-4 font-medium">Annual Maintenance</td>
                  <td className="p-4">15-20% of initial cost</td>
                  <td className="p-4 bg-primary/5 font-bold">Included for first year</td>
                </tr>
                <tr className="border-b">
                  <td className="text-left p-4 font-medium">AI Capabilities</td>
                  <td className="p-4">Extra cost add-on</td>
                  <td className="p-4 bg-primary/5 font-bold">Included standard</td>
                </tr>
                <tr className="border-b font-bold">
                  <td className="text-left p-4">Total Year 1 Cost</td>
                  <td className="p-4">$50,000-$150,000+</td>
                  <td className="p-4 bg-primary/5 text-primary">$5,000-$10,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Client Onboarding Process */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              From Concept to Launch in 8 Days
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process gets your custom application up and running in record time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="relative pl-12 pb-8 border-l-2 border-primary/30">
                <div className="absolute -left-[10px] top-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">1</div>
                <h3 className="text-xl font-bold mb-2">Discovery Call (Day 1)</h3>
                <p className="text-muted-foreground">
                  We discuss your business requirements, review existing workflows, and select the ideal application type.
                </p>
              </div>
              
              <div className="relative pl-12 pb-8 border-l-2 border-primary/30">
                <div className="absolute -left-[10px] top-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">2</div>
                <h3 className="text-xl font-bold mb-2">Customization Workshop (Day 2)</h3>
                <p className="text-muted-foreground">
                  We define specific customizations, outline integration requirements, and finalize application features.
                </p>
              </div>
              
              <div className="relative pl-12 border-l-2 border-primary/30 pb-8">
                <div className="absolute -left-[10px] top-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">3</div>
                <h3 className="text-xl font-bold mb-2">AI Development Phase (Days 3-7)</h3>
                <p className="text-muted-foreground">
                  Our AI engines generate your custom application with continuous refinement based on your requirements.
                </p>
              </div>
              
              <div className="relative pl-12">
                <div className="absolute -left-[10px] top-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">4</div>
                <h3 className="text-xl font-bold mb-2">Deployment & Training (Day 8)</h3>
                <p className="text-muted-foreground">
                  We deploy your application, provide user training, and hand over comprehensive documentation.
                </p>
              </div>
            </div>
            
            <Card className="p-6 flex flex-col justify-center bg-gradient-to-br from-primary/10 to-background border-none">
              <div className="mb-8">
                <div className="text-xl font-semibold mb-2">Why This Matters:</div>
                <p className="text-muted-foreground mb-4">
                  Traditional development cycles last months, delaying your ROI and business impact. Our accelerated timeline means you start seeing benefits in days, not months.
                </p>
                <div className="flex items-start mb-3">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <p>From concept to deployment in just 8 days</p>
                </div>
                <div className="flex items-start mb-3">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <p>No complex project management overhead</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <p>Start seeing ROI immediately</p>
                </div>
              </div>
              
              <div className="mt-auto">
                <Button size="lg" className="w-full" asChild>
                  <Link to="/contact">
                    Start Your Project
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how AI App Suite is transforming businesses across industries.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-primary fill-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">
                "We had quotes from traditional development shops ranging from $45,000 to $75,000 for our customer management system. AI App Suite delivered a better solution in just 6 days for $5,000. The ROI was immediate."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-3">SJ</div>
                <div>
                  <div className="font-semibold">Sarah J.</div>
                  <div className="text-sm text-muted-foreground">Marketing Agency Owner</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-primary fill-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">
                "What impressed me most wasn't just the cost savings—it was the speed. Having our inventory management system up and running in a week changed everything for our operation."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-3">MT</div>
                <div>
                  <div className="font-semibold">Michael T.</div>
                  <div className="text-sm text-muted-foreground">Manufacturing CEO</div>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="mt-12 bg-white rounded-lg border p-6">
            <h3 className="text-xl font-bold mb-4">Before & After Metrics</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Business Process</th>
                    <th className="text-left p-3">Before AI App Suite</th>
                    <th className="text-left p-3">After AI App Suite</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="text-left p-3 font-medium">Invoice Processing</td>
                    <td className="text-left p-3">45 min/invoice, 12% error rate</td>
                    <td className="text-left p-3 text-primary font-medium">5 min/invoice, &lt;1% error rate</td>
                  </tr>
                  <tr className="border-b">
                    <td className="text-left p-3 font-medium">Customer Onboarding</td>
                    <td className="text-left p-3">3 days average</td>
                    <td className="text-left p-3 text-primary font-medium">Same day (4 hours)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="text-left p-3 font-medium">Reporting</td>
                    <td className="text-left p-3">2 days/month manual work</td>
                    <td className="text-left p-3 text-primary font-medium">Automated, real-time</td>
                  </tr>
                  <tr>
                    <td className="text-left p-3 font-medium">Data Entry</td>
                    <td className="text-left p-3">15 hours/week</td>
                    <td className="text-left p-3 text-primary font-medium">Eliminated (AI automation)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Application-Specific Value Props */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Solutions for Every Industry
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful, custom applications tailored to your specific business needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">For Service Businesses</h3>
              <ul className="space-y-3">
                <li className="flex">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Streamline client communication and scheduling</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Automate follow-ups and routine client interactions</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Provide real-time project status visibility</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Optimize resource allocation with AI-powered insights</span>
                </li>
              </ul>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">For Agencies</h3>
              <ul className="space-y-3">
                <li className="flex">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Manage multiple client projects simultaneously</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Track campaign performance with AI-enhanced analytics</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Automate reporting and client updates</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Centralize client assets and communications</span>
                </li>
              </ul>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">For Retail/E-commerce</h3>
              <ul className="space-y-3">
                <li className="flex">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Intelligent inventory management</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Customer behavior analytics</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Automated marketing campaign optimization</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Streamlined order fulfillment</span>
                </li>
              </ul>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">For Professional Services</h3>
              <ul className="space-y-3">
                <li className="flex">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Automated document generation</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Intelligent time tracking and billing</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Client portal with secure document sharing</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Predictive analysis for project scoping</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-primary/10">
        <div className="container mx-auto max-w-5xl">
          <div className="rounded-lg bg-gradient-to-br from-primary to-primary/80 p-8 md:p-12 text-primary-foreground shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-primary-foreground/90 mb-6">
                  Get started with your custom AI-powered application today. Schedule a discovery call to discuss your business needs and see how we can help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" variant="secondary" asChild>
                    <Link to="/contact">
                      Schedule Demo
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                    <Link to="/apps">
                      Browse Applications
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-start">
                  <div className="rounded-full bg-white/20 p-2 mr-3 mt-1">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Risk-Free Guarantee</h3>
                    <p className="text-sm text-primary-foreground/90">
                      If you're not satisfied with your application, we'll refund your investment.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-start">
                  <div className="rounded-full bg-white/20 p-2 mr-3 mt-1">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">8-Day Delivery</h3>
                    <p className="text-sm text-primary-foreground/90">
                      From initial call to deployment in just 8 business days, guaranteed.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-start">
                  <div className="rounded-full bg-white/20 p-2 mr-3 mt-1">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Flat Rate Pricing</h3>
                    <p className="text-sm text-primary-foreground/90">
                      $5,000 flat rate. No surprises, no hidden fees, no per-user charges.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sales;
