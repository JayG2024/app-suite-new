import { ArrowLeft, Download, Share2, Clock, Calendar, BarChart3, CheckCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { ReactNode } from "react";

/**
 * WhitePaperTemplate - Reusable template for creating professional white papers
 * 
 * This template provides a consistent structure for all white papers including:
 * - SEO optimization
 * - Professional header with badges
 * - Key findings section
 * - Main content area with sections
 * - Sources/references
 * - Author information
 * - Share/download functionality
 * - Call-to-action section
 * 
 * Usage:
 * Import this template and pass in the required props to create a new white paper
 */

export interface WhitePaperSection {
  id: string;
  title: string;
  content: ReactNode;
}

export interface WhitePaperSource {
  title: string;
  url: string;
}

export interface WhitePaperProps {
  // SEO Properties
  seo: {
    title: string;
    description: string;
    keywords: string;
    author: string;
    publishedTime: string;
    modifiedTime?: string;
  };
  
  // Header Properties
  header: {
    title: string;
    subtitle: string;
    badges?: string[]; // e.g., ["Research & Insights", "White Paper"]
    icon?: ReactNode; // Optional icon component
    readTime: number; // in minutes
  };
  
  // Key Findings
  keyFindings: string[];
  researchMethodology?: string; // Optional methodology description
  
  // Main Content
  sections: WhitePaperSection[];
  
  // Sources & References
  sources: WhitePaperSource[];
  additionalSourcesNote?: string; // Optional note about additional sources
  
  // Call to Action
  cta?: {
    title: string;
    description: string;
    primaryButton: {
      text: string;
      link: string;
    };
    secondaryButton?: {
      text: string;
      link: string;
    };
  };
  
  // Optional PDF download path
  pdfDownloadPath?: string;
}

const WhitePaperTemplate = ({
  seo,
  header,
  keyFindings,
  researchMethodology,
  sections,
  sources,
  additionalSourcesNote,
  cta,
  pdfDownloadPath
}: WhitePaperProps) => {
  
  // Share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: header.title,
        url: window.location.href
      });
    }
  };
  
  // Download PDF functionality
  const handleDownload = () => {
    if (pdfDownloadPath) {
      window.open(pdfDownloadPath, '_blank');
    }
  };
  
  return (
    <>
      {/* SEO Component */}
      <SEO 
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        author={seo.author}
        publishedTime={seo.publishedTime}
        modifiedTime={seo.modifiedTime}
        type="article"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        {/* Header Navigation */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Link to="/blog" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Research & Insights
            </Link>
          </div>
        </div>

        {/* Research Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
          <div className="max-w-4xl mx-auto px-6">
            {/* Badges */}
            {header.badges && (
              <div className="flex items-center gap-3 mb-6">
                {header.icon || <BarChart3 className="w-6 h-6" />}
                {header.badges.map((badge, index) => (
                  <Badge 
                    key={index}
                    variant={index === 0 ? "secondary" : "outline"} 
                    className={index === 0 
                      ? "bg-white/20 text-white hover:bg-white/30" 
                      : "border-white/30 text-white"
                    }
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Title */}
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              {header.title}
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              {header.subtitle}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Published {new Date(seo.publishedTime).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{header.readTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <span>By {seo.author}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Key Findings Summary */}
          <Card className="mb-12 border-l-4 border-l-blue-600">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Key Research Findings
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {keyFindings.map((finding, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{finding}</span>
                  </div>
                ))}
              </div>
              {researchMethodology && (
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">
                    <strong>Research Methodology:</strong> {researchMethodology}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Research
            </Button>
            {pdfDownloadPath && (
              <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            )}
          </div>

          {/* Main Content Sections */}
          <div className="prose prose-lg max-w-none">
            {sections.map((section) => (
              <section key={section.id} className="mb-12">
                {section.content}
              </section>
            ))}

            {/* Sources Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-slate-900">Sources & References</h2>
              
              <div className="grid gap-4">
                {sources.map((source, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 font-bold text-sm">{index + 1}.</span>
                    <div>
                      <p className="font-semibold text-slate-900">{source.title}</p>
                      <p className="text-slate-600 text-sm">{source.url}</p>
                    </div>
                  </div>
                ))}
                {additionalSourcesNote && (
                  <div className="mt-4 p-4 border border-slate-200 rounded-lg">
                    <p className="text-sm text-slate-600">
                      <strong>Additional sources:</strong> {additionalSourcesNote}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* CTA Section */}
          {cta && (
            <Card className="border-l-4 border-l-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-slate-900">
                  {cta.title}
                </h3>
                <p className="text-lg text-slate-700 mb-6">
                  {cta.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to={cta.primaryButton.link}>
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      {cta.primaryButton.text}
                    </Button>
                  </Link>
                  {cta.secondaryButton && (
                    <Link to={cta.secondaryButton.link}>
                      <Button variant="outline" size="lg">
                        {cta.secondaryButton.text}
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Back to Blog */}
          <div className="text-center mt-12">
            <Link to="/blog" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Research & Insights
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhitePaperTemplate;

/**
 * Example usage of WhitePaperTemplate:
 * 
 * import WhitePaperTemplate from "@/templates/WhitePaperTemplate";
 * 
 * const MyWhitePaper = () => {
 *   const whitePaperData = {
 *     seo: {
 *       title: "Your White Paper Title | Company Name",
 *       description: "A comprehensive research paper about...",
 *       keywords: "keyword1, keyword2, keyword3",
 *       author: "Author Name",
 *       publishedTime: "2025-06-18",
 *       modifiedTime: "2025-06-18"
 *     },
 *     header: {
 *       title: "Your White Paper Title",
 *       subtitle: "A subtitle or tagline for your white paper",
 *       badges: ["Research & Insights", "White Paper"],
 *       readTime: 15
 *     },
 *     keyFindings: [
 *       "First key finding from your research",
 *       "Second important discovery",
 *       "Third critical insight",
 *       "Fourth major conclusion"
 *     ],
 *     researchMethodology: "Description of how the research was conducted",
 *     sections: [
 *       {
 *         id: "introduction",
 *         title: "Introduction",
 *         content: (
 *           <>
 *             <h2>Introduction Section Title</h2>
 *             <p>Your introduction content here...</p>
 *           </>
 *         )
 *       },
 *       // Add more sections as needed
 *     ],
 *     sources: [
 *       { title: "Source Title", url: "source-url.com" },
 *       // Add more sources
 *     ],
 *     cta: {
 *       title: "Ready to Take Action?",
 *       description: "Learn how we can help you implement these insights.",
 *       primaryButton: {
 *         text: "Get Started",
 *         link: "/contact"
 *       },
 *       secondaryButton: {
 *         text: "Learn More",
 *         link: "/services"
 *       }
 *     },
 *     pdfDownloadPath: "/assets/white-papers/your-white-paper.pdf"
 *   };
 * 
 *   return <WhitePaperTemplate {...whitePaperData} />;
 * };
 */