import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { 
  FileText, 
  CreditCard, 
  Shield, 
  Clock, 
  AlertCircle,
  Download,
  CheckCircle,
  ArrowRight,
  Zap,
  Calculator
} from "lucide-react";
import SEO from "@/components/SEO";
import { CALENDLY_DISCOVERY_CALL_URL } from "@/utils/constants";

const PaymentTerms = () => {
  const handleDownloadPDF = () => {
    // For now, we'll use the HTML document that's generated
    window.open('/documents/payment-terms.html', '_blank');
  };

  return (
    <>
      <SEO 
        title="Payment Terms & Conditions - App Suite"
        description="Clear, transparent payment terms for App Suite custom software development. 50% upfront, 50% on delivery. 14-day development timeline."
        keywords="payment terms, software development pricing, custom app costs, payment schedule, app suite terms"
      />
      <div className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Payment Terms & Conditions</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Clear, transparent terms for App Suite custom software development services.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary">Effective Date: June 1, 2025</Badge>
            <Badge variant="outline">Version 1.0</Badge>
          </div>
        </div>

        {/* Table of Contents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-2">
              <a href="#pricing" className="text-primary hover:underline flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Service Pricing
              </a>
              <a href="#payment-schedules" className="text-primary hover:underline flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Payment Options
              </a>
              <a href="#whats-included" className="text-primary hover:underline flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                What's Included
              </a>
              <a href="#payment-methods" className="text-primary hover:underline flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Payment Methods
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Quick Summary */}
        <Card className="bg-primary/5 border-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">50%</div>
                <div className="text-sm text-muted-foreground">Upfront Payment</div>
                <div className="text-xs mt-1">Due at contract signing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">30 Days</div>
                <div className="text-sm text-muted-foreground">Development Time</div>
                <div className="text-xs mt-1">From payment to delivery</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">50%</div>
                <div className="text-sm text-muted-foreground">Final Payment</div>
                <div className="text-xs mt-1">Due upon delivery</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">

          {/* 1. Service Packages & Pricing */}
          <Card id="pricing">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                1. Service Packages & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Standard Application</h4>
                  <div className="text-2xl font-bold text-primary mb-2">$5,000</div>
                  <ul className="text-base space-y-2">
                    <li className="text-sm">• Custom dashboard</li>
                    <li className="text-sm">• User auth & roles</li>
                    <li className="text-sm">• Database setup</li>
                    <li className="text-sm">• Responsive design</li>
                    <li className="text-sm">• 2 API connections</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4 border-primary bg-primary/5">
                  <h4 className="font-semibold mb-2">AI-Powered Solution</h4>
                  <div className="text-2xl font-bold text-primary mb-2">$7,500</div>
                  <ul className="text-base space-y-2">
                    <li className="text-sm">• Everything in Standard</li>
                    <li className="text-sm">• AI model integration</li>
                    <li className="text-sm">• Voice & vision AI</li>
                    <li className="text-sm">• Custom workflows</li>
                    <li className="text-sm">• 3 API connections</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Enterprise Solution</h4>
                  <div className="text-2xl font-bold text-primary mb-2">$10,000</div>
                  <ul className="text-base space-y-2">
                    <li className="text-sm">• Everything in AI-Powered</li>
                    <li className="text-sm">• Multi-AI orchestration</li>
                    <li className="text-sm">• Enterprise security</li>
                    <li className="text-sm">• Multi-tenant ready</li>
                    <li className="text-sm">• 3 API connections</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Available Add-Ons</h4>
                <div className="grid md:grid-cols-4 gap-3">
                  <div className="bg-muted/30 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-primary">$1,000</div>
                    <div className="text-sm">Feature Add-ons</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-primary">$1,000</div>
                    <div className="text-sm">Basic API Sync</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-primary">$2,500</div>
                    <div className="text-sm">Full API Integration</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-primary">$2,500</div>
                    <div className="text-sm">Advanced Modules</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Payment Schedules */}
          <Card id="payment-schedules">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                2. Payment Schedules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Projects Under $10,000</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Split Payment</span>
                        <Badge variant="default">Recommended</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="font-medium">50% at signing</div>
                        <div className="font-medium">50% on delivery</div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Financing Available</span>
                        <Badge variant="secondary">Popular</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="font-medium">50% down payment</div>
                        <div className="text-muted-foreground">6 months: +10% fee</div>
                        <div className="text-muted-foreground">12 months: +15% fee</div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Full Payment</span>
                        <Badge variant="outline">5% Discount</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="font-medium">Pay 100% upfront</div>
                        <div className="text-green-600 font-medium">Save 5%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Enterprise Solutions ($10,000+)</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Split Payment</span>
                        <Badge variant="default">Standard</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="font-medium">50% upfront</div>
                        <div className="font-medium">50% on delivery</div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Enterprise Financing</span>
                        <Badge variant="secondary">Flexible</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="font-medium">$5,000 minimum down</div>
                        <div className="text-muted-foreground">6-24 month terms</div>
                        <div className="text-muted-foreground">Custom terms available</div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Full Payment</span>
                        <Badge variant="outline">5% Discount</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="font-medium">Pay 100% upfront</div>
                        <div className="text-green-600 font-medium">Save 5%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">Payment Terms</h4>
                    <ul className="text-base text-amber-700 space-y-2">
                      <li>• All payments due within 5 business days of invoice</li>
                      <li>• Late payments subject to 1.5% monthly fee</li>
                      <li>• Development begins upon receipt of initial payment</li>
                      <li>• Full code ownership granted upon final payment completion</li>
                      <li>• Financing available with qualifying down payment</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. What's Included */}
          <Card id="whats-included">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                3. What's Included in Every Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Development & Delivery</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm"><CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />Complete source code ownership</li>
                    <li className="flex items-center text-sm"><CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />Responsive web application</li>
                    <li className="flex items-center text-sm"><CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />Database design & implementation</li>
                    <li className="flex items-center text-sm"><CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />User authentication system</li>
                    <li className="flex items-center text-sm"><CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />Deployment & hosting setup</li>
                    <li className="flex items-center text-sm"><CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />SSL certificate & security</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Support & Documentation</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm"><CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />30-day post-launch support</li>
                    <li className="flex items-center text-sm"><CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />User training & documentation</li>
                    <li className="flex items-center text-sm"><CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />Technical documentation</li>
                    <li className="flex items-center text-sm"><CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />Admin panel access</li>
                    <li className="flex items-center text-sm"><CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />Email support during development</li>
                    <li className="flex items-center text-sm"><CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />No recurring fees or user limits</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Development Process & Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                4. Development Process & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
                    <div className="font-medium text-sm">Discovery</div>
                    <div className="text-xs text-muted-foreground">Days 1-5</div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
                    <div className="font-medium text-sm">Design</div>
                    <div className="text-xs text-muted-foreground">Days 6-10</div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
                    <div className="font-medium text-sm">Development</div>
                    <div className="text-xs text-muted-foreground">Days 11-25</div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-2 text-sm font-bold">4</div>
                    <div className="font-medium text-sm">Testing</div>
                    <div className="text-xs text-muted-foreground">Days 26-28</div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-2 text-sm font-bold">✓</div>
                    <div className="font-medium text-sm">Delivery</div>
                    <div className="text-xs text-muted-foreground">Day 30</div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold mb-2">Development Timeline:</h4>
                  <div className="text-sm space-y-1">
                    <div>• <strong>Standard Apps:</strong> 30 days from contract signing</div>
                    <div>• <strong>Small Business Tools:</strong> 14 days delivery</div>
                    <div>• <strong>Enterprise Solutions:</strong> 30-45 days based on complexity</div>
                    <div>• <strong>Add-on Features:</strong> 7-14 days</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. Hosting & Ongoing Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                5. Hosting & Ongoing Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Managed Hosting Plans (Required First Year)</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium mb-2">Standard Apps</h5>
                      <div className="text-2xl font-bold text-primary mb-2">$199/month</div>
                      <ul className="text-base space-y-2">
                        <li>• Professional hosting & monitoring</li>
                        <li>• SSL certificate & security updates</li>
                        <li>• Daily backups & disaster recovery</li>
                        <li>• Email support & bug fixes</li>
                        <li>• Performance optimization</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4 border-primary bg-primary/5">
                      <h5 className="font-medium mb-2">SaaS Applications</h5>
                      <div className="text-2xl font-bold text-primary mb-2">$499/month</div>
                      <ul className="text-base space-y-2">
                        <li>• Everything in Standard</li>
                        <li>• Multi-tenant infrastructure</li>
                        <li>• Auto-scaling & load balancing</li>
                        <li>• Priority phone & email support</li>
                        <li>• Advanced monitoring & analytics</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">After First Year:</h4>
                  <ul className="text-base space-y-2">
                    <li>• Continue with our hosting at same rates</li>
                    <li>• Migrate to your own hosting ($2,500 migration assistance)</li>
                    <li>• Full technical documentation provided for migration</li>
                    <li>• Your choice - no long-term lock-in</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 6. Future Add-Ons & Development */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                6. Future Enhancements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">$1,000 Features</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <div>• Email tracking</div>
                    <div>• Calendar sync</div>
                    <div>• Advanced search</div>
                    <div>• Notifications</div>
                    <div>• Basic API sync</div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">$2,500 Modules</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <div>• Full API integration</div>
                    <div>• Custom AI training</div>
                    <div>• White-label setup</div>
                    <div>• Advanced modules</div>
                    <div>• Business tool suites</div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm bg-amber-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Important</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <div>• App Suite apps only</div>
                    <div>• Fixed pricing always</div>
                    <div>• No hourly billing</div>
                    <div>• No third-party mods</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* 7. Payment Methods */}
          <Card id="payment-methods">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                7. Accepted Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <CreditCard className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold mb-2">Credit Card</h4>
                  <p className="text-sm text-muted-foreground">Visa, MasterCard, Amex</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <Shield className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold mb-2">ACH Transfer</h4>
                  <p className="text-sm text-muted-foreground">Direct bank transfer</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold mb-2">Wire Transfer</h4>
                  <p className="text-sm text-muted-foreground">International payments</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold mb-2">Business Check</h4>
                  <p className="text-sm text-muted-foreground">Traditional payment</p>
                </div>
              </div>
              
              <div className="mt-6 bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Payment Processing:</h4>
                <ul className="text-base space-y-2">
                  <li>• Invoices sent via email with payment instructions</li>
                  <li>• Payment confirmation within 24 hours</li>
                  <li>• All transactions processed securely</li>
                  <li>• Receipts provided for all payments</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 8. Terms & Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                8. Terms & Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div>
                <h4 className="font-semibold mb-2">Refund Policy:</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Full refund within 48 hours</li>
                  <li>• Partial refunds after 48 hours</li>
                  <li>• No refund after delivery</li>
                  <li>• 10 business day processing</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Project Changes:</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Minor changes included</li>
                  <li>• Major changes need approval</li>
                  <li>• Extra features priced separately</li>
                  <li>• Timeline may adjust</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Intellectual Property:</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• You own all code after payment</li>
                  <li>• Third-party licenses separate</li>
                  <li>• We keep our methodologies</li>
                  <li>• Source code delivered</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Support & Warranty:</h4>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• 30-day bug fix warranty</li>
                  <li>• Extended support available</li>
                  <li>• Training included</li>
                  <li>• Business hour support</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Agreement */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Start Your Project?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Contact us to discuss your requirements and receive a detailed proposal with these terms.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <a href={CALENDLY_DISCOVERY_CALL_URL} target="_blank" rel="noopener noreferrer">
                      Schedule Discovery Call
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </a>
                  </Button>
                  <Button size="lg" variant="secondary" asChild>
                    <Link to="/financing-calculator">
                      <Calculator className="h-5 w-5 mr-2" />
                      Calculate Financing
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" onClick={handleDownloadPDF}>
                    <Download className="h-5 w-5 mr-2" />
                    Download PDF Terms
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>App Suite - Custom Business Software Development</p>
          <p>651 N. Broad St., Middletown, DE, USA | jason@jaydus.ai</p>
          <p className="mt-2">These terms are effective as of June 1, 2025 and supersede all previous agreements.</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default PaymentTerms;