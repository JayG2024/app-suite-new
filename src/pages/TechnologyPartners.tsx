import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { 
  Brain, 
  Cloud, 
  Database, 
  Shield, 
  Zap, 
  Code, 
  Globe,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { 
  SiOpenai, 
  SiGoogle, 
  SiMicrosoftazure, 
  SiFirebase, 
  SiVercel, 
  SiTypescript, 
  SiReact, 
  SiTailwindcss,
  SiAmazon,
  SiGooglecloud,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiNodedotjs,
  SiStripe,
  SiPaypal,
  SiSalesforce,
  SiMailchimp,
  SiTwilio,
  SiSlack,
  SiGoogleworkspace,
  SiZapier,
  SiQuickbooks,
  SiAmazons3,
  SiDropbox,
  SiZoom
} from 'react-icons/si';

const TechnologyPartners = () => {
  
  const aiProviders = [
    {
      name: "OpenAI",
      logo: <SiOpenai className="text-3xl text-black" />,
      description: "GPT-4, ChatGPT, DALL-E integration",
      capabilities: ["Natural Language Processing", "Content Generation", "Image Creation", "Code Assistance"],
      tier: "primary"
    },
    {
      name: "Google AI",
      logo: <SiGoogle className="text-3xl text-blue-500" />, 
      description: "Gemini, Vertex AI, and Google Cloud AI",
      capabilities: ["Advanced Reasoning", "Multimodal AI", "Translation", "Vision AI"],
      tier: "primary"
    },
    {
      name: "Anthropic Claude",
      logo: <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-sm font-bold">A</div>,
      description: "Claude AI for advanced reasoning and analysis",
      capabilities: ["Complex Analysis", "Code Review", "Document Processing", "Ethical AI"],
      tier: "primary"
    },
    {
      name: "Grok (X.AI)",
      logo: <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white text-sm font-bold">X</div>,
      description: "Real-time AI with internet access",
      capabilities: ["Real-time Data", "Social Media Integration", "Current Events", "Dynamic Responses"],
      tier: "secondary"
    },
    {
      name: "Mistral AI",
      logo: <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-white text-sm font-bold">M</div>,
      description: "European AI with privacy focus",
      capabilities: ["Privacy-First AI", "Multilingual", "Code Generation", "Reasoning"],
      tier: "secondary"
    },
    {
      name: "Meta LLaMA",
      logo: <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-sm font-bold">M</div>,
      description: "Open-source AI models",
      capabilities: ["Open Source", "Custom Training", "Cost Effective", "On-Premise Options"],
      tier: "secondary"
    }
  ];

  const cloudProviders = [
    {
      name: "Firebase",
      logo: <SiFirebase className="text-3xl text-orange-500" />,
      description: "Google's app development platform",
      capabilities: ["Real-time Database", "Authentication", "Hosting", "Cloud Functions"],
      tier: "primary"
    },
    {
      name: "Supabase",
      logo: <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-sm font-bold">S</div>,
      description: "Open source Firebase alternative",
      capabilities: ["PostgreSQL", "Real-time APIs", "Authentication", "Edge Functions"],
      tier: "primary"
    },
    {
      name: "Netlify",
      logo: <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center text-white text-sm font-bold">N</div>,
      description: "Modern web development platform", 
      capabilities: ["Static Hosting", "Serverless Functions", "CI/CD", "Edge Computing"],
      tier: "primary"
    },
    {
      name: "Cloudflare",
      logo: <div className="w-8 h-8 bg-orange-400 rounded flex items-center justify-center text-white text-sm font-bold">CF</div>,
      description: "Security and performance network",
      capabilities: ["CDN", "DDoS Protection", "Edge Computing", "DNS Management"],
      tier: "secondary"
    }
  ];

  const developmentTech = [
    {
      name: "React",
      logo: <SiReact className="text-3xl text-blue-400" />,
      description: "Modern frontend framework",
      capabilities: ["Component-Based", "Virtual DOM", "Rich Ecosystem", "Mobile Ready"],
      tier: "primary"
    },
    {
      name: "TypeScript", 
      logo: <SiTypescript className="text-3xl text-blue-600" />,
      description: "Typed JavaScript for reliability",
      capabilities: ["Type Safety", "Better IDE Support", "Fewer Bugs", "Team Collaboration"],
      tier: "primary"
    },
    {
      name: "Node.js",
      logo: <SiNodedotjs className="text-3xl text-green-600" />,
      description: "JavaScript runtime for backends",
      capabilities: ["Fast Performance", "NPM Ecosystem", "Scalable", "Real-time Apps"],
      tier: "primary"
    },
    {
      name: "Python",
      logo: <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center text-white text-sm font-bold">Py</div>,
      description: "AI and data processing powerhouse",
      capabilities: ["AI/ML Libraries", "Data Analysis", "API Development", "Automation"],
      tier: "primary"
    },
    {
      name: "PostgreSQL",
      logo: <SiPostgresql className="text-3xl text-blue-700" />,
      description: "Advanced open source database",
      capabilities: ["ACID Compliance", "JSON Support", "Full Text Search", "Extensible"],
      tier: "secondary"
    },
    {
      name: "MongoDB",
      logo: <SiMongodb className="text-3xl text-green-500" />,
      description: "Flexible document database",
      capabilities: ["Schema Flexibility", "Horizontal Scaling", "Rich Queries", "Cloud Native"],
      tier: "secondary"
    }
  ];

  const integrationApis = [
    { name: "Stripe", category: "Payments", logo: <SiStripe className="text-2xl text-blue-600" /> },
    { name: "PayPal", category: "Payments", logo: <SiPaypal className="text-2xl text-blue-500" /> },
    { name: "Salesforce", category: "CRM", logo: <SiSalesforce className="text-2xl text-blue-400" /> },
    { name: "HubSpot", category: "CRM", logo: <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">H</div> },
    { name: "Mailchimp", category: "Email", logo: <SiMailchimp className="text-2xl text-yellow-500" /> },
    { name: "SendGrid", category: "Email", logo: <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">SG</div> },
    { name: "Twilio", category: "Communication", logo: <SiTwilio className="text-2xl text-red-500" /> },
    { name: "Slack", category: "Communication", logo: <SiSlack className="text-2xl text-purple-500" /> },
    { name: "Microsoft 365", category: "Productivity", logo: <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">M</div> },
    { name: "Google Workspace", category: "Productivity", logo: <SiGoogle className="text-2xl text-blue-500" /> },
    { name: "Zapier", category: "Automation", logo: <SiZapier className="text-2xl text-orange-500" /> },
    { name: "Make", category: "Automation", logo: <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center text-white text-xs font-bold">M</div> },
    { name: "QuickBooks", category: "Accounting", logo: <SiQuickbooks className="text-2xl text-blue-600" /> },
    { name: "Xero", category: "Accounting", logo: <div className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">X</div> },
    { name: "DocuSign", category: "E-Signature", logo: <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center text-white text-xs font-bold">DS</div> },
    { name: "HelloSign", category: "E-Signature", logo: <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center text-white text-xs font-bold">HS</div> },
    { name: "AWS S3", category: "Storage", logo: <SiAmazon className="text-2xl text-orange-500" /> },
    { name: "Dropbox", category: "Storage", logo: <SiDropbox className="text-2xl text-blue-500" /> },
    { name: "Zoom", category: "Video", logo: <SiZoom className="text-2xl text-blue-600" /> },
    { name: "Calendar APIs", category: "Scheduling", logo: <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">📅</div> },
  ];

  const categories = ["All", "Payments", "CRM", "Email", "Communication", "Productivity", "Automation", "Accounting", "E-Signature", "Storage", "Video", "Scheduling"];

  return (
    <div className="py-12 px-4">
      <SEO title="Technology Partners - Integrations & API Connections" description="Explore App Suite's technology partners and integrations. Connect your custom software with popular platforms like Stripe, HubSpot, Mailchimp, and hundreds of other services." />
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Technology Partners</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We work with the world's leading technology providers to build enterprise-grade solutions 
            with cutting-edge AI, cloud infrastructure, and seamless integrations.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary">100+ API Integrations</Badge>
            <Badge variant="secondary">6 AI Providers</Badge>
            <Badge variant="secondary">Enterprise Security</Badge>
            <Badge variant="secondary">HIPAA Compliant</Badge>
          </div>
        </div>

        {/* AI Providers */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Brain className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Artificial Intelligence Partners</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            We integrate with multiple AI providers to give your applications the most advanced capabilities 
            available, from natural language processing to computer vision and automated reasoning.
          </p>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {aiProviders.map((provider, index) => (
              <Card key={index} className={`${provider.tier === 'primary' ? 'border-primary/50 bg-primary/5' : ''}`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">{provider.logo}</div>
                    <div>
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                      {provider.tier === 'primary' && <Badge variant="default" className="text-xs">Primary Partner</Badge>}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {provider.capabilities.map((capability, i) => (
                      <div key={i} className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                        {capability}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Cloud Infrastructure */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Cloud className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Cloud Infrastructure Partners</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Reliable, scalable, and secure hosting solutions that grow with your business. 
            We deploy on enterprise-grade infrastructure with 99.9% uptime guarantees.
          </p>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {cloudProviders.map((provider, index) => (
              <Card key={index} className={`${provider.tier === 'primary' ? 'border-primary/50 bg-primary/5' : ''}`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">{provider.logo}</div>
                    <div>
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                      {provider.tier === 'primary' && <Badge variant="default" className="text-xs">Preferred</Badge>}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {provider.capabilities.map((capability, i) => (
                      <div key={i} className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                        {capability}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Development Technologies */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Code className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Development Technologies</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            We use modern, proven technologies that ensure your application is fast, reliable, 
            maintainable, and ready for the future.
          </p>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {developmentTech.map((tech, index) => (
              <Card key={index} className={`${tech.tier === 'primary' ? 'border-primary/50 bg-primary/5' : ''}`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">{tech.logo}</div>
                    <CardTitle className="text-lg">{tech.name}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{tech.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tech.capabilities.map((capability, i) => (
                      <div key={i} className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                        {capability}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* API Integrations */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Globe className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">API Integrations</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Connect your application to any service or platform. We've integrated with hundreds of APIs 
            and can connect to virtually any system that offers an API or webhook.
          </p>

          <Tabs defaultValue="All" className="mb-8">
            <TabsList className="grid grid-cols-6 lg:grid-cols-12 gap-1">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {integrationApis
                    .filter(api => category === "All" || api.category === category)
                    .map((api, index) => (
                      <Card key={index} className="text-center p-4 hover:shadow-md transition-shadow">
                        <div className="text-2xl mb-2">{api.logo}</div>
                        <div className="font-medium text-sm">{api.name}</div>
                        <Badge variant="outline" className="text-xs mt-1">{api.category}</Badge>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="bg-muted/30 rounded-lg p-6 text-center">
            <h3 className="font-semibold mb-2">Don't see your integration?</h3>
            <p className="text-muted-foreground mb-4">
              We can integrate with virtually any API or service. Custom integrations start at $1,000.
            </p>
            <Button variant="outline">
              Request Custom Integration
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </section>

        {/* Security & Compliance */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Security & Compliance</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Security Standards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span className="text-sm">SSL/TLS Encryption</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span className="text-sm">Data Encryption at Rest</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span className="text-sm">Regular Security Audits</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span className="text-sm">Penetration Testing</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span className="text-sm">Multi-Factor Authentication</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span className="text-sm">HIPAA Compliance Available</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span className="text-sm">GDPR Data Protection</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span className="text-sm">SOX Financial Controls</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span className="text-sm">PCI DSS for Payments</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span className="text-sm">Custom Compliance Requirements</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Build with Modern Technology?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Let's discuss how we can leverage these cutting-edge technologies to build 
                exactly what your business needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/contact">
                    Start Your Project
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/get-started">
                    View Our Process
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default TechnologyPartners;