import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { 
  FileText, 
  FileImage, 
  Download, 
  Headphones, 
  BookOpen, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Star,
  Clock
} from "lucide-react";

const Resources = () => {
  const resources = {
    whitepapers: [
      {
        title: "The Hidden Cost of Geo-Blocking",
        subtitle: "How Geographic Restrictions May Be Hurting Your AI Search Visibility",
        description: "Research reveals 95% of AI crawlers are blocked by geographic restrictions. Learn why geo-blocking may hurt your AI search visibility.",
        readTime: "15 min",
        formats: ["article", "pdf", "audio", "infographic"],
        featured: true,
        link: "/blog/the-hidden-cost-of-geo-blocking-and-ai-search-visibility",
        infographicLink: "/resources/infographics/geo-blocking-impact",
        date: "June 2025"
      }
    ],
    guides: [
      {
        title: "Generative Engine Optimization (GEO) Guide 2025",
        description: "The complete guide to optimizing your content for AI-powered search engines like ChatGPT, Claude, and Perplexity.",
        readTime: "25 min",
        formats: ["article", "pdf"],
        link: "/blog/generative-engine-optimization-geo-guide-2025",
        date: "May 2025"
      }
    ],
    infographics: [
      {
        title: "Geo-Blocking Impact on AI Search",
        description: "Visual summary of our research findings on how geographic restrictions affect AI crawler access.",
        type: "Interactive",
        link: "/resources/infographics/geo-blocking-impact",
        featured: true
      },
      {
        title: "Custom vs SaaS: True Cost Comparison",
        description: "See the real numbers behind owning your software versus endless subscriptions.",
        type: "Downloadable",
        link: "/resources/infographics/custom-vs-saas-cost",
        comingSoon: true
      }
    ],
    podcasts: [
      {
        title: "AI Search & The Future of SEO",
        episode: "Episode 1",
        description: "Discussing our geo-blocking research findings and what they mean for businesses.",
        duration: "22 min",
        link: "/podcast/ai-search-future-of-seo",
        comingSoon: true
      }
    ]
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'article':
        return <BookOpen className="w-4 h-4" />;
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'audio':
        return <Headphones className="w-4 h-4" />;
      case 'infographic':
        return <FileImage className="w-4 h-4" />;
      default:
        return <Download className="w-4 h-4" />;
    }
  };

  return (
    <>
      <SEO 
        title="Resources & Downloads - App Suite"
        description="Access whitepapers, guides, infographics, and podcasts about custom software development, AI search optimization, and business technology."
        keywords="resources, whitepapers, guides, infographics, podcasts, GEO, AI search, custom software"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-700"></div>
          <div className="absolute inset-0 bg-grid-white/10"></div>
          
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4 bg-white/20 text-white">
                Resources & Downloads
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Insights That Drive Business Growth
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                Whitepapers, guides, infographics, and podcasts from our research and experience building custom business applications.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Resource */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-yellow-500" />
              <h2 className="text-2xl font-bold">Featured Research</h2>
            </div>
            
            {resources.whitepapers.filter(wp => wp.featured).map((whitepaper, idx) => (
              <Card key={idx} className="overflow-hidden border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{whitepaper.title}</CardTitle>
                      <CardDescription className="text-base">
                        {whitepaper.subtitle}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100">
                      New Research
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 mb-6">{whitepaper.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-6 mb-6">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      {whitepaper.readTime} read
                    </div>
                    <div className="flex items-center gap-2">
                      {whitepaper.formats.map((format, i) => (
                        <div key={i} className="flex items-center gap-1 text-sm text-slate-600">
                          {getFormatIcon(format)}
                          <span className="capitalize">{format}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <Link to={whitepaper.link}>
                      <Button variant="default">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Read Full Article
                      </Button>
                    </Link>
                    {whitepaper.infographicLink && (
                      <Link to={whitepaper.infographicLink}>
                        <Button variant="outline">
                          <FileImage className="w-4 h-4 mr-2" />
                          View Infographic
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Resources Grid */}
        <section className="py-12 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            {/* Whitepapers & Guides */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-purple-600" />
                Whitepapers & Guides
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[...resources.whitepapers.filter(wp => !wp.featured), ...resources.guides].map((item, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <Badge variant="outline">{item.date}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 mb-4">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="w-4 h-4" />
                          {item.readTime}
                        </div>
                        <Link to={item.link}>
                          <Button variant="ghost" size="sm">
                            Read More
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Infographics */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Infographics
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {resources.infographics.map((item, idx) => (
                  <Card key={idx} className={`hover:shadow-lg transition-shadow ${item.comingSoon ? 'opacity-75' : ''}`}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-start justify-between">
                        {item.title}
                        {item.featured && <Star className="w-4 h-4 text-yellow-500" />}
                      </CardTitle>
                      <Badge variant="secondary" className="w-fit">
                        {item.type}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 mb-4">{item.description}</p>
                      {item.comingSoon ? (
                        <Badge variant="outline">Coming Soon</Badge>
                      ) : (
                        <Link to={item.link}>
                          <Button variant="outline" size="sm" className="w-full">
                            <FileImage className="w-4 h-4 mr-2" />
                            View Infographic
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Podcasts */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Headphones className="w-6 h-6 text-green-600" />
                App Suite Insights Podcast
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {resources.podcasts.map((item, idx) => (
                  <Card key={idx} className={`hover:shadow-lg transition-shadow ${item.comingSoon ? 'opacity-75' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="outline" className="mb-2">{item.episode}</Badge>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                        </div>
                        <Headphones className="w-8 h-8 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 mb-4">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">{item.duration}</span>
                        {item.comingSoon ? (
                          <Badge variant="outline">Coming Soon</Badge>
                        ) : (
                          <Button variant="outline" size="sm">
                            Listen Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-indigo-700">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Want More Insights Delivered to Your Inbox?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Subscribe to our newsletter for the latest research, guides, and podcast episodes about custom software and business technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Subscribe to Newsletter
              </Button>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                  Schedule a Consultation
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Resources;