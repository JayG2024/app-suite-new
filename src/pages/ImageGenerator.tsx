import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageGenerator as ImageGeneratorComponent } from '@/components/ImageGenerator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Image as ImageIcon, Download, Clock, Target } from 'lucide-react';
import { autoGenerateForPost } from '@/lib/openai-image';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

const ImageGeneratorPage = () => {
  const [recentPosts] = useState([
    {
      id: 'openai-models-guide',
      title: 'Making Sense of OpenAI Models – The Complete Guide',
      category: 'AI Development',
      excerpt: 'Navigate OpenAI\'s complete model ecosystem with our comprehensive guide covering performance comparisons, selection strategies, and real-world applications.',
      hasImage: true
    },
    // Add more recent posts here as they're created
  ]);

  const [isAutoGenerating, setIsAutoGenerating] = useState<string | null>(null);

  const handleAutoGenerate = async (post: typeof recentPosts[0]) => {
    setIsAutoGenerating(post.id);
    try {
      const image = await autoGenerateForPost(post.title, post.excerpt, post.category);
      toast.success(`Auto-generated image for "${post.title}"`);
      console.log('Generated image:', image);
      // Here you would typically update the post with the new image
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to auto-generate image: ${errorMessage}`);
      console.error('Image generation error:', error);
    } finally {
      setIsAutoGenerating(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <SEO title="AI Image Generator - Create Custom Images" description="Generate custom images using AI for your business content, marketing materials, and blog posts. Powered by advanced AI image generation technology." />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Sparkles className="h-6 w-6 text-primary mr-2" />
            <span className="text-primary font-medium">AI Image Generation</span>
          </div>
          <h1 className="text-4xl font-bold mb-6">Free AI Image Generator</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Create stunning, professional images for your blog posts, social media, or applications using GPT Image 1. 
            <span className="font-semibold text-primary">Completely free to use</span> - no signup required.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Generate professional images in under 30 seconds - perfect for blogs, social media, or app mockups
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Smart & Relevant</h3>
              <p className="text-sm text-muted-foreground">
                AI analyzes your content to create perfectly relevant visuals
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Multiple Styles</h3>
              <p className="text-sm text-muted-foreground">
                Professional, modern, tech, business, or creative styles - perfect for any application or brand
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Usage Examples */}
        <Card className="mb-12 bg-gradient-to-r from-primary/5 to-blue/5">
          <CardHeader>
            <CardTitle>Popular Use Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📱</span>
                </div>
                <h4 className="font-medium mb-1">App Mockups</h4>
                <p className="text-xs text-muted-foreground">UI designs, dashboards, mobile interfaces</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📝</span>
                </div>
                <h4 className="font-medium mb-1">Blog Headers</h4>
                <p className="text-xs text-muted-foreground">Professional thumbnails, article covers</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="font-medium mb-1">Social Media</h4>
                <p className="text-xs text-muted-foreground">Instagram posts, LinkedIn graphics</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎨</span>
                </div>
                <h4 className="font-medium mb-1">Brand Assets</h4>
                <p className="text-xs text-muted-foreground">Logos, brand concepts, presentations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Image Generator */}
        <ImageGeneratorComponent />

        {/* Auto-Generate for Recent Posts */}
        {recentPosts.length > 0 && (
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Auto-Generate for Recent Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{post.title}</h4>
                        <Badge variant="secondary">{post.category}</Badge>
                        {post.hasImage && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Has Image
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleAutoGenerate(post)}
                      disabled={isAutoGenerating === post.id}
                      variant={post.hasImage ? "outline" : "default"}
                      className="ml-4"
                    >
                      {isAutoGenerating === post.id ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          {post.hasImage ? 'Regenerate' : 'Generate'}
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Limit Reached CTA */}
        <Card className="mt-12 border-yellow-500/50 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <span className="text-4xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Love the Free Image Generator?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              You've experienced the power of AI-driven image generation. Imagine what we can build for your entire business workflow.
              <strong> Get unlimited image generation + custom AI tools built specifically for your needs.</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/contact">Get Unlimited Access</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/ai-development-process">See Our AI Process</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              🚀 Free tool = tiny preview. Custom AI solutions = game changer.
            </p>
          </CardContent>
        </Card>

        {/* Strategic CTA */}
        <Card className="mt-12 border-primary/20 bg-gradient-to-r from-primary/10 to-blue/10">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Need a Custom AI Solution for Your Business?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              This free image generator is just a taste of what's possible with AI integration. 
              We build custom software solutions that automate your entire workflow - not just image generation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/contact">Schedule Free Consultation</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/roi-calculator">Calculate Your ROI</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              🚀 Like this tool? Imagine what we can build for your specific business needs.
            </p>
          </CardContent>
        </Card>

        {/* API Status Notice */}
        {!import.meta.env.VITE_OPENAI_API_KEY ? (
          <Card className="mt-12 border-yellow-500/50 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-700 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                Demo Mode - API Key Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-yellow-800">
                  This free image generator requires an OpenAI API key to function. 
                  <strong> Contact us for a live demo or to discuss custom AI integration for your business.</strong>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild>
                    <Link to="/contact">Schedule Live Demo</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/ai-development-process">Learn About Our AI Process</Link>
                  </Button>
                </div>
                
                <div className="pt-4 border-t border-yellow-200">
                  <h4 className="font-semibold mb-2 text-yellow-800">For Developers:</h4>
                  <p className="text-sm text-yellow-700 mb-2">
                    To enable this tool, add your OpenAI API key:
                  </p>
                  <code className="block bg-yellow-100 p-3 rounded text-sm text-yellow-800">
                    VITE_OPENAI_API_KEY=your_api_key_here
                  </code>
                  <p className="text-xs text-yellow-600 mt-2">
                    Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Platform</a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mt-12 border-green-500/50 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                <span className="text-2xl">✅</span>
                AI Generator Ready
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800">
                GPT Image 1 is configured and ready to generate professional images. 
                Each HD image costs approximately $0.120, standard quality costs $0.060.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ImageGeneratorPage;