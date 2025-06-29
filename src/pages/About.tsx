import { Building2, Zap, Code, Rocket, Users, Target, CheckCircle, TrendingUp } from "lucide-react";
import FinancingCTA from "@/components/FinancingCTA";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Target,
      title: "Own, Don't Rent",
      description: "Stop paying monthly subscriptions. Get custom software built once, own it forever."
    },
    {
      icon: Code,
      title: "Built for You",
      description: "Every feature tailored to your business. No bloat, no compromise, just solutions."
    },
    {
      icon: CheckCircle,
      title: "Flat Rate Promise",
      description: "$5,000 per application. Complete solution. No hourly rates, no scope creep."
    }
  ];

  const stats = [
    { value: "15+", label: "Years of Experience" },
    { value: "500+", label: "Apps Delivered" },
    { value: "100%", label: "Custom Built" },
    { value: "$5k", label: "Flat Rate" }
  ];

  return (
    <div>
      <SEO 
        title="About App Suite | Custom AI Application Experts Since 2023"
        description="App Suite builds custom business applications you own completely. Founded by developers tired of SaaS subscriptions. $5K-$10K flat rates, 30-day delivery."
        keywords="about app suite, custom software company, AI development team, flat rate development, business application experts"
      />
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Custom Business Software at <span className="text-primary">Flat Rates</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              We build AI-powered applications that fit your business perfectly. 
              No monthly fees. No feature limitations. Just the software you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/apps')} className="font-semibold">
                Browse Applications
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/get-started')} className="font-semibold">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The App Suite Difference</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're revolutionizing how businesses approach software
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section - Condensed */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Built from <span className="text-primary">Real Experience</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    After 15 years in digital marketing, we saw businesses bleeding money on software subscriptions 
                    that only delivered 70% of what they needed.
                  </p>
                  <p>
                    When AI technology matured in 2022, we realized we could build custom solutions faster 
                    and more affordably than ever before.
                  </p>
                  <p>
                    Today, App Suite delivers enterprise-quality software at SMB-friendly prices. 
                    One flat rate, complete ownership, perfect fit.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <Building2 className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">Enterprise Grade</h4>
                  <p className="text-sm text-muted-foreground">Professional quality without enterprise costs</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <Zap className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">AI Powered</h4>
                  <p className="text-sm text-muted-foreground">Latest AI technology integrated throughout</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <Users className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">SMB Focused</h4>
                  <p className="text-sm text-muted-foreground">Designed for growing businesses</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <TrendingUp className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">ROI Driven</h4>
                  <p className="text-sm text-muted-foreground">Solutions that pay for themselves</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Work</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent process from consultation to deployment
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4 mx-auto">
                  1
                </div>
                <h3 className="font-semibold mb-2">Consultation</h3>
                <p className="text-sm text-muted-foreground">Understand your needs and workflow</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4 mx-auto">
                  2
                </div>
                <h3 className="font-semibold mb-2">Design</h3>
                <p className="text-sm text-muted-foreground">Create custom solution blueprint</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4 mx-auto">
                  3
                </div>
                <h3 className="font-semibold mb-2">Build</h3>
                <p className="text-sm text-muted-foreground">Develop your application in 2 weeks</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4 mx-auto">
                  4
                </div>
                <h3 className="font-semibold mb-2">Deploy</h3>
                <p className="text-sm text-muted-foreground">Launch and train your team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by Leading AI & Technology</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We integrate the latest AI models from OpenAI, Anthropic, Google, Microsoft, and more with enterprise-grade development tools
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">AI Models & Capabilities</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• OpenAI GPT-4, DALL-E 3, Whisper</li>
                <li>• Anthropic Claude for advanced reasoning</li>
                <li>• Google Gemini & Cloud AI services</li>
                <li>• Microsoft Azure AI & Cognitive Services</li>
                <li>• Eleven Labs voice synthesis</li>
                <li>• Cohere, Llama, Grok integration</li>
                <li>• Fal.ai for fast model deployment</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Development Stack</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• React & TypeScript frontend</li>
                <li>• Firebase backend infrastructure</li>
                <li>• Progressive Web App capabilities</li>
                <li>• Real-time database synchronization</li>
                <li>• Enterprise security & authentication</li>
                <li>• Cloud deployment & scaling</li>
                <li>• API integration frameworks</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <img src="/logos/openai.svg" alt="OpenAI" className="h-8 md:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity" />
            <img src="/logos/anthropic.svg" alt="Anthropic" className="h-8 md:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity" />
            <img src="/logos/google.svg" alt="Google AI" className="h-8 md:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity" />
            <img src="/logos/microsoft.svg" alt="Microsoft Azure" className="h-8 md:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity" />
            <img src="/logos/react.svg" alt="React" className="h-8 md:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity" />
            <img src="/logos/firebase.svg" alt="Firebase" className="h-8 md:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity" />
            <img src="/logos/typescript.svg" alt="TypeScript" className="h-8 md:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Stop Renting Software?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of businesses that own their software instead of renting it.
              Custom solutions, flat rates, no compromises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" onClick={() => navigate('/get-started')} className="font-semibold">
                Get Started Today
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/financing-calculator')} className="font-semibold">
                Calculate Your Price
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Or call us at <a href="tel:3022003330" className="text-primary hover:underline">(302) 200-3330</a>
            </p>
          </div>
        </div>
      </section>

      <FinancingCTA variant="card" className="container mx-auto max-w-4xl mb-16" />
    </div>
  );
};

export default About;