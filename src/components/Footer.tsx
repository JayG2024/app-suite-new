
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return <footer className="bg-muted py-12 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-md bg-primary p-1">
                <div className="h-6 w-6 text-primary-foreground flex items-center justify-center font-bold">AI</div>
              </div>
              <span className="text-xl font-bold">App Suite</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Custom business applications at a flat rate. No surprises, just powerful tools.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com/jaydus" aria-label="Facebook" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/jaydus_ai" aria-label="Twitter" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/jaydus.ai" aria-label="Instagram" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/jaydus" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Solutions</h3>
            <ul className="space-y-2">
              <li><Link to="/apps?type=small-business" className="text-sm text-muted-foreground hover:text-foreground">Small Business Tools</Link></li>
              <li><Link to="/apps?type=business" className="text-sm text-muted-foreground hover:text-foreground">Business Applications</Link></li>
              <li><Link to="/apps?type=enterprise" className="text-sm text-muted-foreground hover:text-foreground">Enterprise Applications</Link></li>
              <li><Link to="/roi-calculator" className="text-sm text-muted-foreground hover:text-foreground">ROI Calculator</Link></li>
              <li><Link to="/apps" className="text-sm text-muted-foreground hover:text-foreground">View All Examples</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Most Viewed Pages</h3>
            <ul className="space-y-2">
              <li><Link to="/solutions-weve-built" className="text-sm text-muted-foreground hover:text-foreground">Solutions We've Built</Link></li>
              <li><Link to="/documentation/process" className="text-sm text-muted-foreground hover:text-foreground">How We Work</Link></li>
              <li><Link to="/get-started" className="text-sm text-muted-foreground hover:text-foreground">Get Free Proposal</Link></li>
              <li><Link to="/roi-calculator" className="text-sm text-muted-foreground hover:text-foreground">ROI Calculator</Link></li>
              <li><Link to="/documentation/ai-capabilities" className="text-sm text-muted-foreground hover:text-foreground">AI Capabilities</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support & Company</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link to="/documentation" className="text-sm text-muted-foreground hover:text-foreground">Documentation</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog & Updates</Link></li>
              <li><a href="mailto:jason@jaydus.ai" className="text-sm text-muted-foreground hover:text-foreground">Email Support</a></li>
            </ul>
          </div>
        </div>
        
        {/* Powered by section */}
        <div className="border-t mt-12 pt-8">
          <div className="text-center mb-6">
            <p className="text-xs text-muted-foreground mb-3">Powered by enterprise-grade technology</p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <img src="/logos/openai.svg" alt="OpenAI" className="h-6 opacity-60 hover:opacity-100 transition-opacity" width="90" height="24" loading="lazy" />
              <img src="/logos/react.svg" alt="React" className="h-6 opacity-60 hover:opacity-100 transition-opacity" width="24" height="24" loading="lazy" />
              <img src="/logos/firebase.svg" alt="Firebase" className="h-6 opacity-60 hover:opacity-100 transition-opacity" width="24" height="24" loading="lazy" />
              <img src="/logos/tailwind.svg" alt="Tailwind CSS" className="h-6 opacity-60 hover:opacity-100 transition-opacity" width="120" height="24" loading="lazy" />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2025 AI App Suite. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
              <Link to="/cookie-policy" className="text-sm text-muted-foreground hover:text-foreground">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;
