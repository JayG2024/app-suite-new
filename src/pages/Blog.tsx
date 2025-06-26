import { useState } from "react";
import { Book, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SlideInNewsletter from "@/components/SlideInNewsletter";
import SEO from "@/components/SEO";

// Sample blog posts data - Only showing posts with actual content
const allPosts = [
  {
    id: "generative-engine-optimization-complete-guide-2025",
    title: "Generative Engine Optimization (GEO): The Complete Guide to AI Search Visibility in 2025",
    date: "December 18, 2025",
    excerpt: "The comprehensive strategic guide to optimizing for AI search engines like ChatGPT, Google AI Overviews, and Perplexity. Learn how early adopters achieve 150-200% ROI within 12-18 months.",
    category: "Strategic Research",
    author: "Jason Gordon", 
    readTime: "25 min read",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000",
    isWhitePaper: true,
    featured: true
  },
  {
    id: "hidden-cost-geo-blocking-ai-search-visibility",
    title: "The Hidden Cost of Geo-Blocking: How Geographic Restrictions May Be Hurting Your AI Search Visibility",
    date: "June 17, 2025",
    excerpt: "A comprehensive white paper exploring how geo-blocking affects AI search visibility and Generative Engine Optimization (GEO) in 2025. Research reveals 95% of AI crawlers are blocked by geographic restrictions.",
    category: "Research & Insights",
    author: "Jason Gordon",
    readTime: "15 min read",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
    isWhitePaper: true,
    featured: true
  },
  {
    id: "google-business-profile-consolidation",
    title: "Strategic Consolidation of Google Business Profiles: Unifying Your Online Presence",
    date: "June 5, 2025",
    excerpt: "Master the complex process of merging Google Business Profiles while preserving valuable reviews. Complete strategic guide for business owners and digital marketers.",
    category: "Business Strategy",
    author: "Jason Gordon",
    readTime: "18 min read",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "openai-models-guide",
    title: "Making Sense of OpenAI Models – The Complete Guide (May 30, 2025)",
    date: "May 30, 2025",
    excerpt: "Navigate OpenAI's complete model ecosystem with our comprehensive guide covering performance comparisons, selection strategies, and real-world applications.",
    category: "AI Development",
    author: "Jason Gordon",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: "modern-vs-traditional-hosting-infrastructure",
    title: "Modern vs Traditional Hosting Infrastructure for AI Applications: The Complete Implementation Guide",
    date: "June 26, 2025",
    excerpt: "Transform your infrastructure approach from server management to platform leverage for 5x cost reduction and deployment acceleration. A comprehensive guide for technical leaders.",
    category: "Strategic Research",
    author: "Jason Gordon",
    readTime: "27 min read",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000",
    isWhitePaper: true,
    featured: true
  }
];

// Get all unique categories from posts
const allCategories = ["All", ...new Set(allPosts.map(post => post.category))];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Filter posts based on search term and category
  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
      <main className="flex-1 bg-gradient-to-b from-primary/5 to-background">
        <SEO title="Blog - Custom Software Development Insights" description="Expert insights on custom software development, AI solutions, and business automation from App Suite's experienced team." />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
              <Book className="h-6 w-6 text-primary mr-2" />
              <span className="text-primary font-medium">App Suite Blog</span>
            </div>
            <h1 className="text-4xl font-bold mb-6">Latest Insights & Updates</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Expert advice, industry trends, and product updates to help your business thrive
            </p>
            
            {/* Search and filter */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 rounded-md border border-input bg-background"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {allCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

{/* Featured Research Section */}
          {filteredPosts.some(post => post.featured) && selectedCategory === "All" && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">Featured Research</h2>
              <div className="grid gap-8">
                {filteredPosts.filter(post => post.featured).map((post) => (
                  <Link key={post.id} to={`/blog/${post.id}`}>
                    <Card className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-600">
                      <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-1/3 relative h-64 lg:h-auto overflow-hidden">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        </div>
                        <div className="lg:w-2/3 p-8">
                          <div className="flex items-center gap-3 mb-4">
                            <Badge variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700">
                              {post.category}
                            </Badge>
                            {post.isWhitePaper && (
                              <Badge variant="outline" className="border-blue-600 text-blue-600">
                                White Paper
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{post.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{post.author}</span>
                              <span>·</span>
                              <span>{post.date}</span>
                              <span>·</span>
                              <span>{post.readTime}</span>
                            </div>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              Read Research →
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Regular Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredPosts.filter(post => !post.featured || selectedCategory !== "All").map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`}>
                  <Card className="group overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary" className={post.category === "Research & Insights" ? "bg-blue-600 text-white" : ""}>
                          {post.category}
                        </Badge>
                        {post.isWhitePaper && (
                          <Badge variant="outline" className="border-blue-600 text-blue-600 text-xs">
                            White Paper
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{post.author}</span>
                        <span>·</span>
                        <span>{post.date}</span>
                        <span>·</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <div className="px-6 pb-6 pt-2">
                      <Button variant="ghost" className="w-full justify-start hover:text-primary p-0">
                        {post.isWhitePaper ? "Read Research" : "Read more"} →
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No articles found matching your criteria.</p>
              <Button 
                variant="link" 
                onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}
              >
                Clear filters
              </Button>
            </div>
          )}
          
          {/* Add the SlideInNewsletter component */}
          <SlideInNewsletter scrollThreshold={40} dismissDays={7} />
        </div>
      </main>
  );
};

export default Blog;
