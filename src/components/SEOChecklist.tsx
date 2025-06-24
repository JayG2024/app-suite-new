import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Search, 
  Image, 
  FileText, 
  Link as LinkIcon,
  Globe,
  Target,
  Activity,
  RefreshCw
} from "lucide-react";

/**
 * SEOChecklist Component
 * 
 * A comprehensive SEO checklist component that validates various SEO factors
 * for content publishing. This component can be used to ensure proper SEO
 * optimization before publishing any content.
 * 
 * Features:
 * - Automated SEO checks
 * - Manual checklist items
 * - Real-time validation
 * - Visual feedback with icons and colors
 * - Progress tracking
 * - Export functionality
 * 
 * Usage:
 * <SEOChecklist pageUrl="/blog/my-article" />
 */

interface SEOCheckItem {
  id: string;
  category: 'technical' | 'content' | 'social' | 'indexing';
  title: string;
  description: string;
  status: 'pass' | 'warning' | 'fail' | 'pending';
  automated: boolean;
  priority: 'high' | 'medium' | 'low';
  checkFunction?: () => Promise<'pass' | 'warning' | 'fail'>;
}

interface SEOChecklistProps {
  pageUrl?: string;
  onComplete?: (results: { [key: string]: string }) => void;
}

const SEOChecklist: React.FC<SEOChecklistProps> = ({ pageUrl, onComplete }) => {
  const [checks, setChecks] = useState<SEOCheckItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [completedChecks, setCompletedChecks] = useState<Set<string>>(new Set());

  // Initialize SEO checks
  useEffect(() => {
    const initialChecks: SEOCheckItem[] = [
      // Technical SEO
      {
        id: 'page-title',
        category: 'technical',
        title: 'Page Title Set',
        description: 'Page has a unique, descriptive title tag (50-60 characters)',
        status: 'pending',
        automated: true,
        priority: 'high',
        checkFunction: async () => {
          const title = document.title;
          if (!title) return 'fail';
          if (title.length < 30 || title.length > 60) return 'warning';
          return 'pass';
        }
      },
      {
        id: 'meta-description',
        category: 'technical',
        title: 'Meta Description',
        description: 'Meta description exists and is 150-160 characters',
        status: 'pending',
        automated: true,
        priority: 'high',
        checkFunction: async () => {
          const metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) return 'fail';
          const content = metaDesc.getAttribute('content') || '';
          if (content.length < 120 || content.length > 160) return 'warning';
          return 'pass';
        }
      },
      {
        id: 'meta-keywords',
        category: 'technical',
        title: 'Meta Keywords',
        description: 'Meta keywords are defined and relevant',
        status: 'pending',
        automated: true,
        priority: 'medium',
        checkFunction: async () => {
          const metaKeywords = document.querySelector('meta[name="keywords"]');
          if (!metaKeywords) return 'fail';
          const content = metaKeywords.getAttribute('content') || '';
          if (content.length < 10) return 'warning';
          return 'pass';
        }
      },
      {
        id: 'heading-structure',
        category: 'content',
        title: 'Heading Structure',
        description: 'Proper H1-H6 hierarchy is used',
        status: 'pending',
        automated: true,
        priority: 'high',
        checkFunction: async () => {
          const h1s = document.querySelectorAll('h1');
          if (h1s.length !== 1) return 'fail';
          const h2s = document.querySelectorAll('h2');
          if (h2s.length === 0) return 'warning';
          return 'pass';
        }
      },
      {
        id: 'alt-text',
        category: 'content',
        title: 'Image Alt Text',
        description: 'All images have descriptive alt text',
        status: 'pending',
        automated: true,
        priority: 'high',
        checkFunction: async () => {
          const images = document.querySelectorAll('img');
          let missingAlt = 0;
          images.forEach(img => {
            if (!img.getAttribute('alt')) missingAlt++;
          });
          if (missingAlt === 0) return 'pass';
          if (missingAlt / images.length < 0.2) return 'warning';
          return 'fail';
        }
      },
      {
        id: 'canonical-url',
        category: 'technical',
        title: 'Canonical URL',
        description: 'Canonical URL is set correctly',
        status: 'pending',
        automated: true,
        priority: 'medium',
        checkFunction: async () => {
          const canonical = document.querySelector('link[rel="canonical"]');
          if (!canonical) return 'warning';
          const href = canonical.getAttribute('href');
          if (!href || !href.startsWith('http')) return 'fail';
          return 'pass';
        }
      },
      {
        id: 'og-tags',
        category: 'social',
        title: 'Open Graph Tags',
        description: 'Essential Open Graph tags are present',
        status: 'pending',
        automated: true,
        priority: 'high',
        checkFunction: async () => {
          const ogTitle = document.querySelector('meta[property="og:title"]');
          const ogDesc = document.querySelector('meta[property="og:description"]');
          const ogImage = document.querySelector('meta[property="og:image"]');
          const ogUrl = document.querySelector('meta[property="og:url"]');
          
          if (!ogTitle || !ogDesc) return 'fail';
          if (!ogImage || !ogUrl) return 'warning';
          return 'pass';
        }
      },
      {
        id: 'twitter-cards',
        category: 'social',
        title: 'Twitter Cards',
        description: 'Twitter Card meta tags are configured',
        status: 'pending',
        automated: true,
        priority: 'medium',
        checkFunction: async () => {
          const twitterCard = document.querySelector('meta[name="twitter:card"]');
          const twitterTitle = document.querySelector('meta[name="twitter:title"]');
          
          if (!twitterCard) return 'fail';
          if (!twitterTitle) return 'warning';
          return 'pass';
        }
      },
      {
        id: 'structured-data',
        category: 'technical',
        title: 'Structured Data',
        description: 'JSON-LD structured data is present',
        status: 'pending',
        automated: true,
        priority: 'medium',
        checkFunction: async () => {
          const jsonLd = document.querySelector('script[type="application/ld+json"]');
          if (!jsonLd) return 'fail';
          try {
            JSON.parse(jsonLd.textContent || '');
            return 'pass';
          } catch {
            return 'warning';
          }
        }
      },
      {
        id: 'robots-meta',
        category: 'technical',
        title: 'Robots Meta Tag',
        description: 'Robots meta tag is properly configured',
        status: 'pending',
        automated: true,
        priority: 'medium',
        checkFunction: async () => {
          const robots = document.querySelector('meta[name="robots"]');
          if (!robots) return 'warning';
          const content = robots.getAttribute('content') || '';
          if (content.includes('noindex')) return 'fail';
          return 'pass';
        }
      },
      // Manual checks
      {
        id: 'sitemap-updated',
        category: 'indexing',
        title: 'Sitemap Updated',
        description: 'XML sitemap has been updated with new content',
        status: 'pending',
        automated: false,
        priority: 'high'
      },
      {
        id: 'gsc-submitted',
        category: 'indexing',
        title: 'Google Search Console',
        description: 'URL submitted to Google Search Console for indexing',
        status: 'pending',
        automated: false,
        priority: 'high'
      },
      {
        id: 'internal-links',
        category: 'content',
        title: 'Internal Linking',
        description: 'Content includes relevant internal links',
        status: 'pending',
        automated: false,
        priority: 'medium'
      },
      {
        id: 'keyword-density',
        category: 'content',
        title: 'Keyword Density',
        description: 'Target keywords are naturally integrated (1-3% density)',
        status: 'pending',
        automated: false,
        priority: 'medium'
      },
      {
        id: 'readability',
        category: 'content',
        title: 'Content Readability',
        description: 'Content is well-structured and easy to read',
        status: 'pending',
        automated: false,
        priority: 'medium'
      },
      {
        id: 'ai-crawler-access',
        category: 'indexing',
        title: 'AI Crawler Access',
        description: 'AI crawlers (GPTBot, ClaudeBot, etc.) have access',
        status: 'pending',
        automated: false,
        priority: 'high'
      }
    ];

    setChecks(initialChecks);
  }, []);

  // Run automated checks
  const runAutomatedChecks = async () => {
    setIsRunning(true);
    
    const updatedChecks = [...checks];
    
    for (let i = 0; i < updatedChecks.length; i++) {
      const check = updatedChecks[i];
      if (check.automated && check.checkFunction) {
        try {
          const result = await check.checkFunction();
          updatedChecks[i] = { ...check, status: result };
        } catch (error) {
          updatedChecks[i] = { ...check, status: 'fail' };
        }
      }
    }
    
    setChecks(updatedChecks);
    setIsRunning(false);
  };

  // Toggle manual check
  const toggleManualCheck = (checkId: string, completed: boolean) => {
    const updatedChecks = checks.map(check => 
      check.id === checkId 
        ? { ...check, status: completed ? 'pass' : 'pending' }
        : check
    );
    setChecks(updatedChecks);
    
    if (completed) {
      setCompletedChecks(prev => new Set([...prev, checkId]));
    } else {
      setCompletedChecks(prev => {
        const newSet = new Set(prev);
        newSet.delete(checkId);
        return newSet;
      });
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />;
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return <Search className="w-4 h-4" />;
      case 'content':
        return <FileText className="w-4 h-4" />;
      case 'social':
        return <LinkIcon className="w-4 h-4" />;
      case 'indexing':
        return <Globe className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  // Calculate progress
  const passedChecks = checks.filter(check => check.status === 'pass').length;
  const totalChecks = checks.length;
  const progress = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;

  // Group checks by category
  const checksByCategory = checks.reduce((acc, check) => {
    if (!acc[check.category]) {
      acc[check.category] = [];
    }
    acc[check.category].push(check);
    return acc;
  }, {} as { [key: string]: SEOCheckItem[] });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                SEO Checklist
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Ensure your content is optimized for search engines and AI crawlers
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{progress}%</div>
              <div className="text-sm text-muted-foreground">
                {passedChecks}/{totalChecks} checks passed
              </div>
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 mt-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button 
              onClick={runAutomatedChecks} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Running Checks...' : 'Run Automated Checks'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Checks by Category */}
      {Object.entries(checksByCategory).map(([category, categoryChecks]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 capitalize">
              {getCategoryIcon(category)}
              {category === 'technical' ? 'Technical SEO' : 
               category === 'content' ? 'Content SEO' :
               category === 'social' ? 'Social Media' :
               'Indexing & Crawling'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryChecks.map((check) => (
                <div key={check.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(check.status)}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{check.title}</h4>
                      <Badge 
                        variant={check.priority === 'high' ? 'destructive' : 
                               check.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {check.priority}
                      </Badge>
                      {check.automated && (
                        <Badge variant="outline" className="text-xs">
                          Auto
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {check.description}
                    </p>
                  </div>
                  
                  {!check.automated && (
                    <div className="flex-shrink-0">
                      <Checkbox
                        checked={check.status === 'pass'}
                        onCheckedChange={(checked) => 
                          toggleManualCheck(check.id, checked as boolean)
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Optimization Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {checks.filter(c => c.status === 'pass').length}
              </div>
              <div className="text-sm text-green-700">Passed</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {checks.filter(c => c.status === 'warning').length}
              </div>
              <div className="text-sm text-yellow-700">Warnings</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {checks.filter(c => c.status === 'fail').length}
              </div>
              <div className="text-sm text-red-700">Failed</div>
            </div>
          </div>
          
          {progress === 100 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">
                  All SEO checks passed! Your content is ready for publication.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOChecklist;

/**
 * Usage Examples:
 * 
 * Basic usage:
 * <SEOChecklist />
 * 
 * With specific page URL:
 * <SEOChecklist pageUrl="/blog/my-article" />
 * 
 * With completion callback:
 * <SEOChecklist 
 *   pageUrl="/blog/my-article"
 *   onComplete={(results) => console.log('SEO check results:', results)}
 * />
 */