
import { Button } from "@/components/ui/button";
import { Menu, MessageCircle, X, ChevronDown, Zap, Code, Users, Target, BookOpen, Lightbulb, ArrowRight, Sparkles, DollarSign, Mic } from "lucide-react";
import ProposalButton from "./ProposalButton";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { CacheClearer } from "./CacheClearer";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
  }, [location.pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.getElementById('mobile-menu');
      const megaMenu = document.getElementById('mega-menu');
      const menuButton = document.getElementById('menu-button');
      const megaMenuTrigger = document.getElementById('mega-menu-trigger');
      
      if (mobileMenu && 
          !mobileMenu.contains(event.target as Node) && 
          menuButton && 
          !menuButton.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
      
      if (megaMenu && 
          !megaMenu.contains(event.target as Node) && 
          megaMenuTrigger && 
          !megaMenuTrigger.contains(event.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    };

    if (isMobileMenuOpen || isMegaMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen, isMegaMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left section with logo and chat toggle */}
        <div className="flex items-center gap-3 md:gap-4">
          <SidebarTrigger>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <MessageCircle className="h-5 w-5" />
              <span className="sr-only">Toggle chat</span>
            </Button>
          </SidebarTrigger>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <div className="h-6 w-6 text-primary-foreground flex items-center justify-center font-bold">
                AI
              </div>
            </div>
            <span className="text-lg md:text-xl font-bold">App Suite</span>
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            {/* Top Level Important Links */}
            <Link 
              to="/documentation/process" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              How We Work
            </Link>
            
            <Link 
              to="/payment-terms" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              Payment Terms
            </Link>
            
            <Link 
              to="/roi-calculator" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              ROI Calculator
            </Link>
            
            {/* Resources Mega Menu */}
            <div className="relative">
              <button
                id="mega-menu-trigger"
                className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              >
                Resources
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isMegaMenuOpen ? "rotate-180" : "")} />
              </button>
              
              {/* Mega Menu Dropdown */}
              <div
                id="mega-menu"
                className={cn(
                  "absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[600px] bg-background/95 backdrop-blur border rounded-lg shadow-2xl transition-all duration-300 ease-out",
                  isMegaMenuOpen 
                    ? "opacity-100 translate-y-0 pointer-events-auto" 
                    : "opacity-0 -translate-y-4 pointer-events-none"
                )}
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <div className="p-8">
                  <div className="grid grid-cols-2 gap-8">
                    
                    {/* Resources Column */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-2 border-b">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-foreground">Resources</h3>
                      </div>
                      <div className="space-y-3">
                        <Link 
                          to="/documentation" 
                          className="group flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200"
                        >
                          <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <BookOpen className="h-3 w-3 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Documentation</h4>
                          </div>
                        </Link>
                        
                        <Link 
                          to="/help-center" 
                          className="group flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200"
                        >
                          <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Lightbulb className="h-3 w-3 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Help & Support</h4>
                          </div>
                        </Link>
                        
                        <Link 
                          to="/blog" 
                          className="group flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200"
                        >
                          <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <BookOpen className="h-3 w-3 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Blog & Insights</h4>
                          </div>
                        </Link>
                        
                        <Link 
                          to="/podcast" 
                          className="group flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200"
                        >
                          <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Mic className="h-3 w-3 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Podcast</h4>
                          </div>
                        </Link>
                        
                        <Link 
                          to="/solutions-weve-built" 
                          className="group flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200"
                        >
                          <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Code className="h-3 w-3 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Portfolio</h4>
                          </div>
                        </Link>
                      </div>
                    </div>
                    
                    {/* Company Column */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-2 border-b">
                        <Users className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-foreground">Company</h3>
                      </div>
                      <div className="space-y-3">
                        <Link 
                          to="/about" 
                          className="group flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200"
                        >
                          <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Lightbulb className="h-3 w-3 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">About App Suite</h4>
                          </div>
                        </Link>
                        
                        <Link 
                          to="/documentation/process" 
                          className="group flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200"
                        >
                          <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Code className="h-3 w-3 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Our Process</h4>
                          </div>
                        </Link>
                        
                        <Link 
                          to="/contact" 
                          className="group flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200"
                        >
                          <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <MessageCircle className="h-3 w-3 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Contact Us</h4>
                          </div>
                        </Link>
                        
                        <Link 
                          to="/careers" 
                          className="group flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200"
                        >
                          <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Users className="h-3 w-3 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Careers</h4>
                          </div>
                        </Link>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
            
            {/* Direct Links */}
          </nav>
          
          <div className="flex items-center gap-3">
            <CacheClearer />
            <Button variant="outline" asChild>
              <Link to="/roi-calculator">ROI Calculator</Link>
            </Button>
            <ProposalButton className="group">
              Get Free Proposal
            </ProposalButton>
          </div>
        </div>
        
        {/* Mobile menu button */}
        <Button 
          id="menu-button"
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={cn(
            "fixed inset-x-0 top-16 z-50 w-full overflow-hidden bg-background/95 backdrop-blur pb-6 border-b shadow-2xl transform transition-all duration-300 ease-out md:hidden",
            isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
          )}
        >
          <div className="flex flex-col gap-6 px-4 pt-6">
            {/* Important Quick Links */}
            <div className="space-y-3">
              <Link
                to="/solutions-weve-built"
                className="flex items-center gap-3 py-3 px-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-all duration-200 border border-primary/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold text-primary">Solutions We've Built</div>
                  <div className="text-xs text-muted-foreground">SaaS products and tools we've created</div>
                </div>
              </Link>
              
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/documentation/process"
                  className="flex flex-col items-center gap-2 py-3 px-3 rounded-lg hover:bg-accent transition-all duration-200 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">How We Work</span>
                </Link>
                
                <Link
                  to="/payment-terms"
                  className="flex flex-col items-center gap-2 py-3 px-3 rounded-lg hover:bg-accent transition-all duration-200 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Payment Terms</span>
                </Link>
              </div>
              
              <ProposalButton className="w-full justify-center">
                Get Free Proposal
              </ProposalButton>
            </div>

            {/* ROI Calculator Link */}
            <div className="space-y-2">
              <Link 
                to="/roi-calculator"
                className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-accent transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Target className="h-4 w-4 text-primary" />
                <div>
                  <div className="font-medium">ROI Calculator</div>
                  <div className="text-xs text-muted-foreground">Calculate your savings</div>
                </div>
              </Link>
            </div>
            
            {/* Resources Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <BookOpen className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-foreground">Resources</h3>
              </div>
              <div className="space-y-2 pl-2">
                <Link 
                  to="/documentation"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-accent transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BookOpen className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Documentation</div>
                    <div className="text-xs text-muted-foreground">Guides & resources</div>
                  </div>
                </Link>
                <Link 
                  to="/help-center"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-accent transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Help & Support</div>
                    <div className="text-xs text-muted-foreground">Help center & support</div>
                  </div>
                </Link>
                <Link 
                  to="/blog"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-accent transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BookOpen className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Blog & Insights</div>
                    <div className="text-xs text-muted-foreground">Latest insights & updates</div>
                  </div>
                </Link>
                <Link 
                  to="/podcast"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-accent transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Mic className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Podcast</div>
                    <div className="text-xs text-muted-foreground">AI & business insights</div>
                  </div>
                </Link>
                <Link 
                  to="/solutions-weve-built"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-accent transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Target className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Portfolio</div>
                    <div className="text-xs text-muted-foreground">Solutions we've built</div>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Company Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-foreground">Company</h3>
              </div>
              <div className="space-y-2 pl-2">
                <Link
                  to="/about" 
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-accent transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">About Us</div>
                    <div className="text-xs text-muted-foreground">Our story & mission</div>
                  </div>
                </Link>
                <Link
                  to="/documentation/process" 
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-accent transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Code className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Our Process</div>
                    <div className="text-xs text-muted-foreground">How we work</div>
                  </div>
                </Link>
                <Link 
                  to="/contact"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-accent transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Contact</div>
                    <div className="text-xs text-muted-foreground">Get in touch</div>
                  </div>
                </Link>
                <Link 
                  to="/careers"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-accent transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Careers</div>
                    <div className="text-xs text-muted-foreground">Join our team</div>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <Button 
                variant="outline" 
                className="w-full justify-center"
                onClick={() => navigate('/contact')}
              >
                Contact Us
              </Button>
              <Button 
                className="w-full justify-center group"
                onClick={() => window.open('https://calendly.com/jason-jaydus', '_blank')}
              >
                Schedule Demo
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
