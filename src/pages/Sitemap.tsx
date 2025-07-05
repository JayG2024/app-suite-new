import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import SEO from "@/components/SEO";

const Sitemap = () => {
  const sections = [
    {
      title: "Main Pages",
      links: [
        { path: "/", label: "Home" },
        { path: "/about", label: "About Us" },
        { path: "/contact", label: "Contact" },
        { path: "/get-started", label: "Get Started" },
        { path: "/proposal", label: "Proposal Generator" },
      ]
    },
    {
      title: "Solutions",
      links: [
        { path: "/apps", label: "Business Applications" },
        { path: "/customer-management", label: "Customer Management" },
        { path: "/finance-apps", label: "Finance Applications" },
        { path: "/marketing-solutions", label: "Marketing Solutions" },
        { path: "/operations-tools", label: "Operations Tools" },
        { path: "/sales", label: "Sales Solutions" },
      ]
    },
    {
      title: "AI & Technology",
      links: [
        { path: "/ai-development-process", label: "AI Development Process" },
        { path: "/technology-partners", label: "Technology Partners" },
        { path: "/image-generator", label: "AI Image Generator" },
        { path: "/extensions", label: "Extensions" },
      ]
    },
    {
      title: "Resources",
      links: [
        { path: "/blog", label: "Blog" },
        { path: "/documentation", label: "Documentation" },
        { path: "/examples", label: "Examples" },
        { path: "/solutions-weve-built", label: "Portfolio" },
        { path: "/industries", label: "Industries We Serve" },
      ]
    },
    {
      title: "Company",
      links: [
        { path: "/careers", label: "Careers" },
        { path: "/support", label: "Support" },
        { path: "/help-center", label: "Help Center" },
        { path: "/system-status", label: "System Status" },
        { path: "/newsletter", label: "Newsletter" },
      ]
    },
    {
      title: "Legal",
      links: [
        { path: "/terms", label: "Terms of Service" },
        { path: "/privacy-policy", label: "Privacy Policy" },
        { path: "/cookie-policy", label: "Cookie Policy" },
        { path: "/payment-terms", label: "Payment Terms" },
      ]
    },
    {
      title: "Tools & Calculators",
      links: [
        { path: "/roi-calculator", label: "ROI Calculator" },
        { path: "/price-calculator", label: "Price Calculator" },
        { path: "/financing-calculator", label: "Financing Calculator" },
      ]
    }
  ];

  return (
    <>
      <SEO 
        title="Sitemap - App Suite | All Pages Directory"
        description="Complete sitemap of App Suite. Find all pages including custom business applications, AI solutions, pricing calculators, documentation, and company resources."
        keywords="app suite sitemap, site map, page directory, website structure, navigation guide, all pages, app suite resources"
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Sitemap</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Complete directory of all pages on App Suite. Find custom business applications, 
            AI solutions, resources, and tools to transform your business.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section) => (
              <Card key={section.title} className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-primary">
                  {section.title}
                </h2>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.path}>
                      <Link 
                        to={link.path}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                      >
                        <span className="text-primary">→</span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sitemap;