import WhitePaperTemplate from "@/templates/WhitePaperTemplate";
import { BarChart3, AlertTriangle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

/**
 * Example White Paper Implementation
 * 
 * This is a complete example showing how to use the WhitePaperTemplate
 * to create a professional white paper. Copy this structure and modify
 * the content for your specific white paper needs.
 */

const ExampleWhitePaper = () => {
  const whitePaperData = {
    // SEO Configuration
    seo: {
      title: "The Future of Web Development: A Comprehensive Analysis | App Suite",
      description: "Research white paper exploring emerging trends in web development, AI integration, and the future of digital experiences in 2025.",
      keywords: "web development, AI integration, future technology, digital transformation, developer tools",
      author: "Jason Gordon",
      publishedTime: "2025-06-18",
      modifiedTime: "2025-06-18"
    },
    
    // Header Configuration
    header: {
      title: "The Future of Web Development: A Comprehensive Analysis",
      subtitle: "A 2025 White Paper on Emerging Technologies and Industry Trends",
      badges: ["Research & Insights", "White Paper", "Technology"],
      icon: <BarChart3 className="w-6 h-6" />,
      readTime: 12
    },
    
    // Key Research Findings
    keyFindings: [
      "85% of developers now use AI-assisted coding tools",
      "React and Next.js dominate 65% of new projects",
      "Performance optimization tools reduce load times by 40%",
      "Component-driven development increases productivity by 60%"
    ],
    
    // Research Methodology
    researchMethodology: "This study was conducted over 8 weeks, surveying 1,200+ developers across 15 countries and analyzing data from 300+ production applications. We collaborated with leading development teams and technology vendors to gather comprehensive insights.",
    
    // Main Content Sections
    sections: [
      {
        id: "introduction",
        title: "Introduction",
        content: (
          <>
            <h2 className="text-3xl font-bold mb-6 text-slate-900">The Changing Landscape of Web Development</h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              The web development landscape has undergone unprecedented transformation in recent years. What started as simple HTML pages has evolved into complex, interactive applications that power modern business operations across every industry.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              This white paper examines the current state of web development, emerging technologies, and the trends that will shape the industry through 2025 and beyond. Our research reveals significant shifts in how developers approach building web applications, the tools they use, and the expectations of users in an increasingly digital world.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 my-8">
              <p className="text-blue-800 text-lg">
                <strong>Key Insight:</strong> The integration of AI-powered development tools has fundamentally changed how developers write, test, and deploy code, with productivity gains exceeding all previous technological advances.
              </p>
            </div>
          </>
        )
      },
      {
        id: "current-trends",
        title: "Current Development Trends",
        content: (
          <>
            <h2 className="text-3xl font-bold mb-6 text-slate-900">Current Development Trends</h2>
            
            <h3 className="text-2xl font-semibold mb-4 text-slate-800">AI-Assisted Development</h3>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Artificial Intelligence has become an integral part of the development workflow. Tools like GitHub Copilot, Tabnine, and ChatGPT are not just experimental curiosities—they're production tools that developers rely on daily.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <h4 className="font-semibold text-slate-900 mb-2">Code Generation</h4>
                <p className="text-2xl font-bold text-blue-600 mb-1">85%</p>
                <p className="text-slate-600">of developers use AI for code completion</p>
              </Card>
              <Card className="p-6">
                <h4 className="font-semibold text-slate-900 mb-2">Bug Detection</h4>
                <p className="text-2xl font-bold text-blue-600 mb-1">70%</p>
                <p className="text-slate-600">faster bug identification with AI tools</p>
              </Card>
            </div>

            <h3 className="text-2xl font-semibold mb-4 text-slate-800">Framework Dominance</h3>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              React continues to lead the frontend development space, with Next.js emerging as the preferred full-stack solution for modern applications. This combination provides developers with the tools needed for both client-side interactivity and server-side optimization.
            </p>
          </>
        )
      },
      {
        id: "challenges",
        title: "Industry Challenges",
        content: (
          <>
            <h2 className="text-3xl font-bold mb-6 text-slate-900">Current Industry Challenges</h2>
            
            <div className="space-y-6 mb-8">
              {[
                { 
                  title: "Performance Expectations", 
                  desc: "Users expect sub-second load times while applications become increasingly complex" 
                },
                { 
                  title: "Security Concerns", 
                  desc: "Rising cybersecurity threats require constant vigilance and updated security practices" 
                },
                { 
                  title: "Talent Shortage", 
                  desc: "High demand for skilled developers outpaces supply, driving up costs and project timelines" 
                },
                { 
                  title: "Technology Fragmentation", 
                  desc: "Rapid evolution of tools and frameworks creates decision paralysis and technical debt" 
                }
              ].map((challenge, index) => (
                <div key={index} className="flex gap-4 p-6 bg-red-50 rounded-lg border border-red-200">
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">{challenge.title}</h4>
                    <p className="text-slate-700">{challenge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )
      },
      {
        id: "solutions",
        title: "Recommended Solutions",
        content: (
          <>
            <h2 className="text-3xl font-bold mb-6 text-slate-900">Strategic Solutions for Modern Development</h2>
            
            <div className="space-y-6 mb-8">
              {[
                { 
                  title: "Adopt Component-Driven Development", 
                  desc: "Build reusable components that can be shared across projects and teams" 
                },
                { 
                  title: "Implement Continuous Integration", 
                  desc: "Automate testing and deployment to catch issues early and maintain code quality" 
                },
                { 
                  title: "Invest in Developer Experience", 
                  desc: "Provide teams with modern tools and workflows that increase productivity and satisfaction" 
                },
                { 
                  title: "Focus on Performance from Day One", 
                  desc: "Build performance monitoring and optimization into the development process" 
                }
              ].map((solution, index) => (
                <div key={index} className="flex gap-4 p-6 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">{solution.title}</h4>
                    <p className="text-slate-700">{solution.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )
      },
      {
        id: "conclusion",
        title: "Conclusion",
        content: (
          <>
            <h2 className="text-3xl font-bold mb-6 text-slate-900">The Path Forward</h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              The future of web development is both exciting and challenging. Organizations that embrace AI-assisted development, invest in modern tooling, and prioritize performance will be best positioned to succeed in the evolving digital landscape.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              The key is not to adopt every new technology that emerges, but to carefully evaluate tools and frameworks based on their ability to solve real problems and improve developer productivity. The winners will be those who can balance innovation with stability, performance with features, and complexity with maintainability.
            </p>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-lg my-8">
              <h3 className="text-2xl font-bold mb-4">The future belongs to developers who adapt quickly while building thoughtfully.</h3>
              <p className="text-blue-100 text-lg leading-relaxed">
                Success in 2025 and beyond will require continuous learning, strategic tool adoption, and a focus on delivering exceptional user experiences.
              </p>
            </div>
          </>
        )
      }
    ],
    
    // Sources and References
    sources: [
      { title: "Stack Overflow Developer Survey 2025", url: "stackoverflow.com/insights/survey/2025" },
      { title: "GitHub State of Development Report", url: "github.com/features/developer-insights" },
      { title: "React Usage Statistics", url: "npmjs.com/package/react" },
      { title: "Web Performance Best Practices", url: "web.dev/performance" },
      { title: "AI in Software Development Study", url: "developer.ai/research/coding-assistant-impact" }
    ],
    
    // Additional sources note
    additionalSourcesNote: "This research also incorporates data from developer surveys, industry reports, and interviews with leading development teams. Full methodology and additional citations available upon request.",
    
    // Call to Action
    cta: {
      title: "Ready to Modernize Your Development Process?",
      description: "Our team specializes in helping organizations adopt modern development practices and tools. Let us help you navigate the changing landscape and build better applications faster.",
      primaryButton: {
        text: "Schedule a Consultation",
        link: "/contact"
      },
      secondaryButton: {
        text: "View Our Services",
        link: "/services"
      }
    },
    
    // Optional PDF download
    pdfDownloadPath: "/assets/white-papers/future-of-web-development-2025.pdf"
  };

  return <WhitePaperTemplate {...whitePaperData} />;
};

export default ExampleWhitePaper;

/**
 * Usage Notes:
 * 
 * 1. Copy this file and rename it for your specific white paper
 * 2. Update all the content in the whitePaperData object
 * 3. Modify the sections array to include your specific content
 * 4. Update SEO information for your topic
 * 5. Ensure all sources are accurate and accessible
 * 6. Test the component before publishing
 * 
 * Content Structure Tips:
 * - Keep sections focused and well-organized
 * - Use cards, callouts, and visual elements to break up text
 * - Include data visualizations where appropriate
 * - Make sure all links and references are valid
 * - Test responsive design on different screen sizes
 */