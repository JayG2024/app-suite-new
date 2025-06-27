import React from 'react';
import { ArrowLeft, Download, Share2, Clock, Calendar, User, Headphones, FileImage, FileText, BarChart3, TrendingUp, CheckCircle, AlertTriangle, Lightbulb, Target, Zap, Shield, Users, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SEO from "@/components/SEO";
import { toast } from "sonner";

// Types for different content blocks
export interface BlogPostTemplateProps {
  title: string;
  subtitle?: string;
  author: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags?: string[];
  description: string;
  keywords?: string;
  keyFindings?: string[];
  researchMethodology?: string;
  sections: BlogSection[];
  sources?: BlogSource[];
  ctaTitle?: string;
  ctaDescription?: string;
  isWhitePaper?: boolean;
}

export interface BlogSection {
  type: 'heading' | 'paragraph' | 'alert' | 'finding' | 'stats' | 'comparison' | 'list' | 'quote' | 'image' | 'cta' | 'separator';
  content?: any;
}

export interface BlogSource {
  title: string;
  url: string;
}

// Reusable block components
const AlertBlock: React.FC<{ type: 'warning' | 'info' | 'success' | 'critical'; title: string; content: string }> = ({ type, title, content }) => {
  const styles = {
    warning: { bg: 'bg-amber-50', border: 'border-amber-400', icon: AlertTriangle, iconColor: 'text-amber-600', textColor: 'text-amber-800' },
    info: { bg: 'bg-blue-50', border: 'border-blue-400', icon: Lightbulb, iconColor: 'text-blue-600', textColor: 'text-blue-800' },
    success: { bg: 'bg-green-50', border: 'border-green-400', icon: CheckCircle, iconColor: 'text-green-600', textColor: 'text-green-800' },
    critical: { bg: 'bg-red-50', border: 'border-red-400', icon: Shield, iconColor: 'text-red-600', textColor: 'text-red-800' }
  };
  
  const style = styles[type];
  const Icon = style.icon;
  
  return (
    <div className={`${style.bg} border-l-4 ${style.border} p-6 my-8 rounded-r-lg`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-6 h-6 ${style.iconColor} mt-1 flex-shrink-0`} />
        <div>
          <p className={`${style.textColor} font-semibold mb-2`}>{title}</p>
          <p className={style.textColor}>{content}</p>
        </div>
      </div>
    </div>
  );
};

const FindingCard: React.FC<{ number: string; label: string; description?: string }> = ({ number, label, description }) => (
  <Card className="border-2 hover:border-primary/50 transition-colors">
    <CardContent className="p-6 text-center">
      <div className="text-3xl font-bold text-primary mb-2">{number}</div>
      <p className="font-medium text-gray-900">{label}</p>
      {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
    </CardContent>
  </Card>
);

const StatsGrid: React.FC<{ stats: Array<{ value: string; label: string; trend?: 'up' | 'down' }> }> = ({ stats }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
    {stats.map((stat, index) => (
      <div key={index} className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 text-center">
        <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
        <p className="text-sm text-muted-foreground">{stat.label}</p>
        {stat.trend && (
          <TrendingUp className={`w-4 h-4 mx-auto mt-2 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600 rotate-180'}`} />
        )}
      </div>
    ))}
  </div>
);

const ComparisonTable: React.FC<{ headers: string[]; rows: Array<{ label: string; values: string[] }> }> = ({ headers, rows }) => (
  <div className="overflow-x-auto my-8">
    <table className="w-full border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
      <thead className="bg-gray-50">
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="border border-gray-200 p-3 text-left font-semibold">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-gray-50">
            <td className="border border-gray-200 p-3 font-medium">{row.label}</td>
            {row.values.map((value, valueIndex) => (
              <td key={valueIndex} className="border border-gray-200 p-3">{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BlogPostTemplate: React.FC<BlogPostTemplateProps> = ({
  title,
  subtitle,
  author,
  publishDate,
  readTime,
  category,
  tags = [],
  description,
  keywords,
  keyFindings,
  researchMethodology,
  sections,
  sources,
  ctaTitle = "Ready to Build Your Custom Solution?",
  ctaDescription = "Let's discuss how AI-powered custom development can transform your business.",
  isWhitePaper = false
}) => {
  
  const handleShare = async () => {
    try {
      await navigator.share({
        title,
        text: description,
        url: window.location.href
      });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleDownloadPDF = () => {
    toast.info("PDF download coming soon!");
  };

  const renderSection = (section: BlogSection, index: number) => {
    switch (section.type) {
      case 'heading':
        return <h2 key={index} className="text-3xl font-bold mb-6 text-slate-900 mt-12">{section.content}</h2>;
      
      case 'paragraph':
        return <p key={index} className="text-lg text-slate-700 leading-relaxed mb-6">{section.content}</p>;
      
      case 'alert':
        return <AlertBlock key={index} {...section.content} />;
      
      case 'finding':
        return <FindingCard key={index} {...section.content} />;
      
      case 'stats':
        return <StatsGrid key={index} stats={section.content} />;
      
      case 'comparison':
        return <ComparisonTable key={index} {...section.content} />;
      
      case 'list':
        return (
          <ul key={index} className="space-y-3 my-6">
            {section.content.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        );
      
      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-primary pl-6 my-8 italic text-slate-600">
            <p className="text-lg">{section.content.text}</p>
            {section.content.author && (
              <cite className="block mt-2 text-sm not-italic text-slate-500">— {section.content.author}</cite>
            )}
          </blockquote>
        );
      
      case 'separator':
        return <Separator key={index} className="my-12" />;
      
      case 'cta':
        return (
          <Card key={index} className="bg-primary/5 border-primary/20 my-12">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">{section.content.title || ctaTitle}</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                {section.content.description || ctaDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/roi-calculator">Calculate Your ROI</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">Schedule Discovery Call</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <SEO 
        title={title}
        description={description}
        keywords={keywords}
      />

      <article className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        {/* Header Navigation */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Link to="/blog" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Article Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6" />
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                {category}
              </Badge>
              {isWhitePaper && (
                <Badge variant="outline" className="border-white/30 text-white">
                  White Paper
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {title}
            </h1>
            
            {subtitle && (
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                {subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{publishDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{author}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Key Findings */}
          {keyFindings && keyFindings.length > 0 && (
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
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF} className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Download PDF
            </Button>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            {sections.map((section, index) => renderSection(section, index))}
          </div>

          {/* Sources */}
          {sources && sources.length > 0 && (
            <div className="mt-16 p-6 bg-slate-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Sources & References</h3>
              <ul className="space-y-2">
                {sources.map((source, index) => (
                  <li key={index} className="text-sm text-slate-600">
                    <a href={`https://${source.url}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                      {source.title} - {source.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>
    </>
  );
};

export default BlogPostTemplate;