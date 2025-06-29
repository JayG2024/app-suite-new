
import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import Hero from "@/components/Hero";
import SEO from "@/components/SEO";
import ProposalButton from "@/components/ProposalButton";

// Lazy load heavy components
const AppShowcase = lazy(() => import("@/components/AppShowcase"));
const HowItWorks = lazy(() => import("@/components/HowItWorks"));
const ContactCTA = lazy(() => import("@/components/ContactCTA"));
const AiCapabilities = lazy(() => import("@/components/AiCapabilities"));
const Newsletter = lazy(() => import("@/components/Newsletter"));
const SlideInNewsletter = lazy(() => import("@/components/SlideInNewsletter"));

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const categories = [
    "All",
    "Finance",
    "Customer Management",
    "Operations",
    "Marketing"
  ];

  return (
    <div className="w-full">
        <SEO 
          title="Custom Business Apps $5K Flat Rate | AI-Powered Solutions"
          description="Stop paying monthly SaaS fees. Get custom AI business applications built in 30 days for $5,000 flat rate. ChatGPT/Claude integration, you own the code."
          keywords="custom business applications, AI software development, flat rate pricing, $5000 apps, business automation, ChatGPT integration, no monthly fees, own your software"
        />
        <Hero />
        
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading AI capabilities...</div></div>}>
          <AiCapabilities />
        </Suspense>
        
        <section id="browse-apps" className="py-8 sm:py-10 md:py-12 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Browse Our Business Applications</h2>
            
            <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8">
              {categories.map((category) => (
                <Button 
                  key={category}
                  variant={selectedCategory === category || (category === "All" && !selectedCategory) ? "default" : "outline"} 
                  onClick={() => setSelectedCategory(category === "All" ? null : category)}
                  className="rounded-full text-xs sm:text-sm px-3 py-1 h-auto"
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading applications...</div></div>}>
              <AppShowcase selectedCategory={selectedCategory} />
            </Suspense>
          </div>
        </section>
        
        <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>}>
          <HowItWorks />
        </Suspense>

        {/* Technology Partners Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Powered by Leading AI & Technology Partners</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built with enterprise-grade AI models and development technologies from industry leaders
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              <img src="/logos/openai.svg" alt="OpenAI" className="h-8 md:h-10 opacity-60 hover:opacity-100 transition-opacity" width="120" height="40" loading="lazy" />
              <img src="/logos/anthropic.svg" alt="Anthropic Claude" className="h-8 md:h-10 opacity-60 hover:opacity-100 transition-opacity" width="120" height="40" loading="lazy" />
              <img src="/logos/google.svg" alt="Google AI" className="h-8 md:h-10 opacity-60 hover:opacity-100 transition-opacity" width="100" height="40" loading="lazy" />
              <img src="/logos/microsoft.svg" alt="Microsoft Azure" className="h-8 md:h-10 opacity-60 hover:opacity-100 transition-opacity" width="120" height="40" loading="lazy" />
              <img src="/logos/react.svg" alt="React" className="h-8 md:h-10 opacity-60 hover:opacity-100 transition-opacity" width="40" height="40" loading="lazy" />
              <img src="/logos/firebase.svg" alt="Firebase" className="h-8 md:h-10 opacity-60 hover:opacity-100 transition-opacity" width="40" height="40" loading="lazy" />
              <img src="/logos/typescript.svg" alt="TypeScript" className="h-8 md:h-10 opacity-60 hover:opacity-100 transition-opacity" width="40" height="40" loading="lazy" />
            </div>
          </div>
        </section>

        <Suspense fallback={null}>
          <SlideInNewsletter scrollThreshold={50} dismissDays={7} />
        </Suspense>

        {/* Financing CTA Section */}
        <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50 border-y border-green-200">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Need Financing? We've Got You Covered!</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Finance your custom app over 6 or 12 months with competitive rates. 
              Get enterprise software without the enterprise upfront cost.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => navigate('/price-calculator')}
              >
                💳 Price Your App with Financing
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
                onClick={() => navigate('/payment-terms')}
              >
                📋 View Financing Terms
              </Button>
            </div>
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="font-bold text-green-600">6 Months</div>
                <div className="text-muted-foreground">+10% total</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600">12 Months</div>
                <div className="text-muted-foreground">+15% total</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-12 md:py-16 px-4 md:px-6 lg:px-8 bg-muted/30">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
              Get your custom AI-powered proposal in under 3 minutes. See exactly what we'll build for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ProposalButton 
                size="lg" 
                className="w-full sm:w-auto sm:min-w-[220px] text-white"
              >
                🤖 Get Custom Proposal
              </ProposalButton>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/price-calculator')}
                className="w-full sm:w-auto sm:min-w-[200px]"
              >
                💰 Price Calculator
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/contact')}
                className="w-full sm:w-auto sm:min-w-[200px]"
              >
                📞 Schedule Demo
              </Button>
            </div>
          </div>
        </section>

        <ContactCTA />
    </div>
  );
};

export default Index;
