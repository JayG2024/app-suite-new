import React from 'react';
import { Brain, Zap, Code, Users, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import SEO from "@/components/SEO";

const AiDevelopmentProcess = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12">
      <SEO title="AI Development Process - How We Build Custom Software" description="Learn about App Suite's revolutionary AI-powered development process. Discover how we use AI to orchestrate development, creating custom software solutions in days instead of months." />
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="flex justify-center mb-4">
          <Brain className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-6">AI Development Process</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          How we use AI to orchestrate AI - creating custom software in days, not months, 
          with the precision and quality that used to take traditional development teams years to achieve.
        </p>
      </div>

      {/* The Revolution Section */}
      <section className="max-w-4xl mx-auto mb-16">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              The AI-to-AI Revolution
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Most developers use AI as a coding assistant. We've built something revolutionary: 
                <strong className="text-foreground"> AI systems that orchestrate other AI systems</strong> to deliver 
                complete, enterprise-grade software solutions.
              </p>
              <p>
                This isn't about generating code snippets. This is about AI understanding your business requirements, 
                architecting solutions, coordinating development tasks, ensuring quality, and delivering software 
                that works exactly as you need it.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Process Steps */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our AI Development Pipeline</h2>
        
        <div className="space-y-8">
          {/* Step 1 */}
          <Card className="relative">
            <div className="absolute -left-4 top-6 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
              1
            </div>
            <CardContent className="pl-12 py-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Requirements Analysis AI
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-muted-foreground mb-4">
                    Our first AI system analyzes your business requirements, understands your workflow, 
                    and maps out the optimal software architecture. It considers integration points, 
                    user experience patterns, and scalability requirements.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Business process mapping</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Technical architecture planning</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Integration requirements analysis</span>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-2">Example Output:</div>
                  <div className="font-mono text-xs bg-background p-3 rounded border">
                    Customer needs inventory management with:<br/>
                    • Real-time stock tracking<br/>
                    • Automated reorder points<br/>
                    • Integration with existing POS<br/>
                    • Mobile accessibility for warehouse staff
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="relative">
            <div className="absolute -left-4 top-6 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
              2
            </div>
            <CardContent className="pl-12 py-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Development Orchestration AI
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-muted-foreground mb-4">
                    The orchestration AI coordinates multiple specialized AI agents: one for frontend development, 
                    one for backend logic, another for database design, and others for testing and optimization. 
                    Each agent is expert-level in its domain.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Multi-agent coordination</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Specialized domain expertise</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Real-time quality assurance</span>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-2">AI Agent Coordination:</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Frontend AI: Building React components</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Backend AI: Creating API endpoints</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Database AI: Optimizing queries</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Testing AI: Automated QA checks</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="relative">
            <div className="absolute -left-4 top-6 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
              3
            </div>
            <CardContent className="pl-12 py-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Human-AI Collaboration
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-muted-foreground mb-4">
                    While AI handles the heavy lifting, our expert developers provide strategic oversight, 
                    creative problem-solving, and ensure the final product exceeds expectations. 
                    This human-AI partnership delivers both speed and perfection.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Strategic oversight by experts</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Creative problem-solving</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Quality validation and enhancement</span>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-2">Human Expertise Areas:</div>
                  <div className="space-y-1 text-xs">
                    <div>• Business logic validation</div>
                    <div>• User experience optimization</div>
                    <div>• Security implementation review</div>
                    <div>• Performance optimization</div>
                    <div>• Integration testing oversight</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Timeline Comparison */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Development Timeline Comparison</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="text-red-700">Traditional Development</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Requirements gathering: 2-4 weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Architecture planning: 2-3 weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Development: 12-24 weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Testing & debugging: 4-8 weeks</span>
                </div>
                <div className="pt-2 border-t border-red-200">
                  <div className="font-semibold text-red-700">Total: 20-39 weeks</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="text-green-700">AI-Powered Development</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">AI requirements analysis: 1-2 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">AI architecture generation: 1 day</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Multi-agent development: 1-3 weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">AI testing & human QA: 3-5 days</span>
                </div>
                <div className="pt-2 border-t border-green-200">
                  <div className="font-semibold text-green-700">Total: 2-4 weeks</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The Result */}
      <section className="max-w-4xl mx-auto mb-16">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">The Result</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Enterprise-grade custom software delivered in weeks instead of months, 
              at a fraction of traditional development costs, with quality that exceeds 
              what most development teams can achieve manually.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">10x</div>
                <div className="text-sm text-muted-foreground">Faster Development</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50%</div>
                <div className="text-sm text-muted-foreground">Lower Cost</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">99%</div>
                <div className="text-sm text-muted-foreground">Fewer Bugs</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Experience AI-Powered Development</h2>
        <p className="text-muted-foreground mb-6">
          Ready to see how our AI development process can build your custom software 
          faster and better than traditional methods?
        </p>
        <Button 
          size="lg" 
          onClick={() => navigate('/contact')}
          className="group"
        >
          Schedule Discovery Call
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </section>
    </div>
  );
};

export default AiDevelopmentProcess;