import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, CheckCircle, Clock, Users, FileText, Settings, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const ClientOnboarding = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <Link to="/documentation" className="text-primary hover:underline flex items-center mb-4">
            <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
            <span>Back to Documentation</span>
          </Link>
          <h1 className="text-4xl font-bold mb-4">Client Onboarding Guide</h1>
          <p className="text-muted-foreground text-lg">
            A comprehensive guide to our client onboarding process and what to expect when working with App Suite.
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="discovery">Discovery</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Your Journey with App Suite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">What We Do</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Build custom AI-powered business applications
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Deliver complete solutions in 30 days
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Provide flat-rate pricing with no hidden costs
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Include full customization and integration
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Offer ongoing support and maintenance
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Timeline Overview</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Days 1-3</Badge>
                        <span className="text-sm">Discovery & Planning</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Days 4-15</Badge>
                        <span className="text-sm">Development & Integration</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Days 16-30</Badge>
                        <span className="text-sm">Testing & Delivery</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Ongoing</Badge>
                        <span className="text-sm">Support & Maintenance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Full Applications</CardTitle>
                  <div className="text-2xl font-bold text-primary">$5,000</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Complete business application</li>
                    <li>• Multiple integrated features</li>
                    <li>• Custom workflows</li>
                    <li>• Full user management</li>
                    <li>• Advanced reporting</li>
                    <li>• API integrations</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mini Tools</CardTitle>
                  <div className="text-2xl font-bold text-primary">$2,500</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Focused single-purpose tool</li>
                    <li>• Specific business process</li>
                    <li>• Streamlined interface</li>
                    <li>• Essential integrations</li>
                    <li>• Core reporting features</li>
                    <li>• Quick deployment</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Custom development</li>
                    <li>• Testing & QA</li>
                    <li>• Deployment & setup</li>
                    <li>• Team training</li>
                    <li>• Documentation</li>
                    <li>• 30-day support</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Discovery Tab */}
          <TabsContent value="discovery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Discovery Phase (Days 1-3)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Initial Consultation</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">What We'll Discuss:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Your current business processes</li>
                        <li>• Pain points and inefficiencies</li>
                        <li>• Desired outcomes and goals</li>
                        <li>• Existing software ecosystem</li>
                        <li>• Team size and user requirements</li>
                        <li>• Budget and timeline expectations</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">What You'll Need:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Key stakeholders present</li>
                        <li>• Current process documentation</li>
                        <li>• List of existing software tools</li>
                        <li>• Examples of current workflows</li>
                        <li>• Access to relevant team members</li>
                        <li>• Decision-making authority</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Requirements Gathering</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Functional Requirements</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll document what your application needs to do: user workflows, data processing, 
                        reporting needs, automation requirements, and integration points.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Technical Requirements</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll assess your technical environment: hosting preferences, security requirements, 
                        performance needs, mobile access, and integration capabilities.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">User Experience Requirements</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll understand your users: roles, permissions, interface preferences, 
                        training needs, and accessibility requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Planning Tab */}
          <TabsContent value="planning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Planning & Architecture (Days 4-7)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Solution Architecture</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Technical Design</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Database schema design</li>
                        <li>• API architecture planning</li>
                        <li>• Integration point mapping</li>
                        <li>• Security framework design</li>
                        <li>• Performance optimization plan</li>
                        <li>• Scalability considerations</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">User Experience Design</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• User interface mockups</li>
                        <li>• User journey mapping</li>
                        <li>• Role-based access design</li>
                        <li>• Mobile responsiveness plan</li>
                        <li>• Accessibility compliance</li>
                        <li>• Branding integration</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Project Plan</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Development Milestones</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        We break down development into clear milestones with specific deliverables:
                      </p>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li>• Core functionality development (Days 8-10)</li>
                        <li>• Integration implementation (Days 11-12)</li>
                        <li>• User interface completion (Days 13-14)</li>
                        <li>• Testing and quality assurance (Days 15-16)</li>
                        <li>• Final deployment and training (Days 17-18)</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Communication Plan</h4>
                      <p className="text-sm text-muted-foreground">
                        Regular check-ins, progress updates, and feedback sessions to ensure we stay 
                        aligned with your expectations throughout development.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Development Tab */}
          <TabsContent value="development" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Development Phase (Days 8-16)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Development Process</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Days 4-15: Core Development</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs">Day 8-9</Badge>
                          <span className="text-muted-foreground">Database setup and core models</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs">Day 10-11</Badge>
                          <span className="text-muted-foreground">Business logic implementation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs">Day 12</Badge>
                          <span className="text-muted-foreground">First demo and feedback</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Days 16-30: Integration & Polish</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs">Day 13-14</Badge>
                          <span className="text-muted-foreground">Third-party integrations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs">Day 15-16</Badge>
                          <span className="text-muted-foreground">UI/UX completion and testing</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs">Day 16</Badge>
                          <span className="text-muted-foreground">Final demo and approval</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Quality Assurance</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Automated Testing</h4>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li>• Unit tests for core functions</li>
                        <li>• Integration tests for APIs</li>
                        <li>• UI automated testing</li>
                        <li>• Performance testing</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Manual Testing</h4>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li>• User experience testing</li>
                        <li>• Cross-browser compatibility</li>
                        <li>• Mobile responsiveness</li>
                        <li>• Accessibility compliance</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Security Testing</h4>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li>• Authentication & authorization</li>
                        <li>• Data encryption verification</li>
                        <li>• SQL injection protection</li>
                        <li>• HTTPS implementation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Client Involvement</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Regular Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Daily progress updates via email and weekly video calls with live demos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-4 w-4 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Feedback Sessions</p>
                        <p className="text-sm text-muted-foreground">
                          Scheduled feedback sessions to review progress and make adjustments
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Approval Checkpoints</p>
                        <p className="text-sm text-muted-foreground">
                          Key milestone approvals before proceeding to the next phase
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery Tab */}
          <TabsContent value="delivery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Delivery & Launch (Days 17-18)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Deployment Process</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Technical Deployment</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Production environment setup</li>
                        <li>• Database migration and setup</li>
                        <li>• SSL certificate installation</li>
                        <li>• Domain configuration</li>
                        <li>• Performance optimization</li>
                        <li>• Backup system configuration</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Data Migration</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Existing data analysis</li>
                        <li>• Data cleanup and validation</li>
                        <li>• Migration script development</li>
                        <li>• Test migration execution</li>
                        <li>• Final data import</li>
                        <li>• Data integrity verification</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Training & Documentation</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Team Training</h4>
                      <div className="space-y-3">
                        <div className="border rounded-lg p-3">
                          <h5 className="font-medium text-sm mb-1">Admin Training (2 hours)</h5>
                          <p className="text-xs text-muted-foreground">
                            System configuration, user management, data import/export, reporting
                          </p>
                        </div>
                        <div className="border rounded-lg p-3">
                          <h5 className="font-medium text-sm mb-1">User Training (1 hour)</h5>
                          <p className="text-xs text-muted-foreground">
                            Daily workflows, feature overview, best practices, tips & tricks
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Documentation Package</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• User manual with screenshots</li>
                        <li>• Administrator guide</li>
                        <li>• API documentation (if applicable)</li>
                        <li>• Troubleshooting guide</li>
                        <li>• Video tutorials</li>
                        <li>• Support contact information</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Ongoing Support</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">30-Day Support</h4>
                      <p className="text-sm text-muted-foreground mb-2">Included with every project:</p>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li>• Bug fixes and minor adjustments</li>
                        <li>• User support and questions</li>
                        <li>• Performance monitoring</li>
                        <li>• Security updates</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Extended Support</h4>
                      <p className="text-sm text-muted-foreground mb-2">Optional ongoing plans:</p>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li>• Monthly maintenance</li>
                        <li>• Feature enhancements</li>
                        <li>• Priority support</li>
                        <li>• Regular updates</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Emergency Support</h4>
                      <p className="text-sm text-muted-foreground mb-2">Available 24/7:</p>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li>• Critical issue resolution</li>
                        <li>• System downtime recovery</li>
                        <li>• Security incident response</li>
                        <li>• Data recovery assistance</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-6">
                  <h3 className="text-lg font-semibold mb-3">Ready to Start Your Project?</h3>
                  <p className="text-muted-foreground mb-4">
                    Schedule a discovery call to discuss your requirements and get started.
                  </p>
                  <Link to="/contact">
                    <Button size="lg" className="gap-2">
                      <span>Schedule Discovery Call</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientOnboarding;