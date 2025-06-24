import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Download, Share2, Clock, Calendar, TrendingUp, CheckCircle, AlertTriangle, BarChart3, Zap, Target, Users, Globe, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

interface MarkdownWhitepaperProps {
  markdownFile: string;
  title: string;
  description: string;
  author?: string;
  publishedTime?: string;
  readTime?: string;
  category?: string;
}

const MarkdownWhitepaper = ({ 
  markdownFile, 
  title, 
  description, 
  author = "Jason Gordon",
  publishedTime = "December 18, 2025",
  readTime = "25 min read",
  category = "Strategic Research"
}: MarkdownWhitepaperProps) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const keyFindings = [
    "ChatGPT serves 400 million weekly users",
    "Google AI Overviews appear in 51% of search results",  
    "Early adopters see 150-200% ROI within 12-18 months",
    "28% of Googlebot traffic now comes from AI crawlers"
  ];

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        const response = await fetch(`/content/${markdownFile}`);
        if (!response.ok) {
          throw new Error(`Failed to load ${markdownFile}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error('Error loading markdown:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
  }, [markdownFile]);

  const handleShare = async () => {
    const shareData = {
      title: title,
      text: description,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.log('Sharing failed:', error);
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Failed to copy to clipboard:', clipboardError);
      }
    }
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            h1, h2, h3 { color: #1e40af; }
            .header { text-align: center; margin-bottom: 40px; }
            .finding { background: #f0f9ff; padding: 15px; margin: 10px 0; border-left: 4px solid #3b82f6; }
            .source { font-size: 12px; color: #666; margin-top: 30px; }
            @media print { body { margin: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <p><strong>A Strategic White Paper by ${author} | App Suite</strong></p>
            <p>Published: ${publishedTime} | ${readTime}</p>
          </div>
          
          <h3>Key Findings</h3>
          ${keyFindings.map(finding => `<div class="finding">${finding}</div>`).join('')}
          
          <div class="source">
            <p><strong>For the complete white paper with interactive features, visit:</strong></p>
            <p>${window.location.href}</p>
            <p>© 2025 App Suite by Jaydus Inc. All rights reserved.</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Link to="/blog" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Research & Insights
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading white paper...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Link to="/blog" className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Research & Insights
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Content Error</h2>
            <p className="text-slate-600 mb-4">{error}</p>
            <Link to="/blog">
              <Button>Return to Blog</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={title}
        description={description}
        keywords="generative engine optimization, GEO, AI search, ChatGPT optimization, Google AI Overviews, Perplexity, AI search visibility, business strategy"
        author={author}
        publishedTime={publishedTime}
        modifiedTime={publishedTime}
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
        <div className="bg-gradient-to-r from-purple-600 to-blue-700 text-white py-12">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                {category}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                White Paper
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              {title}
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              {description}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Published {publishedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>By {author}</span>
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
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong>Research Methodology:</strong> This comprehensive analysis synthesizes data from leading AI platforms, search behavior studies, and early adopter case studies to provide actionable insights for business leaders.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Research
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({children}) => (
                  <h1 className="text-4xl font-bold text-slate-900 mb-8 leading-tight" style={{display: 'none'}}>{children}</h1>
                ),
                h2: ({children}) => {
                  const text = children?.toString() || '';
                  
                  // Skip the first two h2s (Key Findings and Executive Summary) as they're handled above
                  if (text.includes('Key Findings') || text.includes('Executive Summary')) {
                    return null;
                  }
                  
                  return (
                    <section className="mb-12">
                      <h2 className="text-3xl font-bold mb-6 text-slate-900">{children}</h2>
                    </section>
                  );
                },
                h3: ({children}) => (
                  <h3 className="text-2xl font-semibold mb-4 text-slate-800">{children}</h3>
                ),
                p: ({children}) => {
                  const text = children?.toString() || '';
                  
                  // Skip the metadata lines
                  if (text.includes('Strategic White Paper by') || text.includes('Published:')) {
                    return null;
                  }
                  
                  // Executive Summary special formatting
                  if (text.includes('This comprehensive guide explores')) {
                    return (
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-xl border border-purple-200 mb-12">
                        <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
                        <p className="text-lg text-purple-900 leading-relaxed">{children}</p>
                      </div>
                    );
                  }
                  
                  // Market Reality Check box
                  if (text.includes('The numbers paint a clear picture')) {
                    return (
                      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 my-8">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-amber-800 font-medium mb-2">Market Reality Check</p>
                            <p className="text-amber-700">{children}</p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  // Critical insights
                  if (text.includes('window for first-mover advantage') || text.includes('critical')) {
                    return (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 my-8">
                        <p className="text-blue-800 font-medium text-lg">{children}</p>
                      </div>
                    );
                  }
                  
                  return <p className="text-lg text-slate-700 leading-relaxed mb-6">{children}</p>;
                },
                ul: ({children}) => {
                  // Check if this is following "The numbers paint a clear picture"
                  const previousElement = children?.toString() || '';
                  
                  if (previousElement.includes('400 million') || previousElement.includes('51%')) {
                    return (
                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {keyFindings.map((finding, index) => (
                          <Card key={index} className="p-6">
                            <p className="text-2xl font-bold text-blue-600 mb-1">
                              {finding.match(/[\d.]+[%M+]*/)?.[0] || ''}
                            </p>
                            <p className="text-slate-600">{finding.replace(/[\d.]+[%M+]*\s*/, '')}</p>
                          </Card>
                        ))}
                      </div>
                    );
                  }
                  
                  return <ul className="space-y-3 mb-8">{children}</ul>;
                },
                li: ({children}) => (
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                    <span className="text-slate-700 leading-relaxed">{children}</span>
                  </li>
                ),
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-blue-500 pl-6 italic text-slate-600 my-6">
                    {children}
                  </blockquote>
                ),
                strong: ({children}) => {
                  const text = children?.toString() || '';
                  
                  // Section headers in paragraphs
                  if (text.endsWith(':')) {
                    return <span className="font-bold text-slate-900 text-lg block mb-2">{children}</span>;
                  }
                  
                  return <strong className="font-semibold text-slate-900">{children}</strong>;
                },
                em: ({children}) => <em className="italic text-slate-600">{children}</em>,
                code: ({children}) => (
                  <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono text-slate-800">
                    {children}
                  </code>
                ),
                a: ({href, children}) => (
                  <a href={href} className="text-blue-600 hover:text-blue-800 underline font-medium" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                hr: () => <hr className="my-12 border-slate-200" />
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          {/* CTA Section */}
          <Card className="mt-16 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-purple-900 mb-4">
                Ready to Implement GEO for Your Business?
              </h3>
              <p className="text-purple-700 mb-6 max-w-2xl mx-auto">
                Get a custom GEO strategy designed specifically for your industry and goals. Our team will help you optimize for AI search visibility and achieve measurable results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    Schedule a GEO Strategy Session
                  </Button>
                </Link>
                <Link to="/get-started">
                  <Button variant="outline" size="lg">
                    Get Custom Implementation Plan
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default MarkdownWhitepaper;