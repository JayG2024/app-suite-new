import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateBlogThumbnail, generateImageVariations, type ImageGenerationOptions, type GeneratedImage } from '@/lib/openai-image';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface ImageGeneratorProps {
  onImageSelected?: (imageUrl: string, prompt: string) => void;
  defaultTitle?: string;
  defaultCategory?: string;
}

export const ImageGenerator = ({ onImageSelected, defaultTitle = '', defaultCategory = 'AI Development' }: ImageGeneratorProps) => {
  const [options, setOptions] = useState<ImageGenerationOptions>({
    title: defaultTitle,
    category: defaultCategory,
    style: 'professional',
    size: '1792x1024',
    quality: 'hd'
  });
  
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  
  // Free usage tracking
  const [usageCount, setUsageCount] = useState(() => {
    const stored = localStorage.getItem('appSuite_imageGenUsage');
    return stored ? parseInt(stored, 10) : 0;
  });
  const FREE_LIMIT = 5;

  const handleGenerate = async (generateMultiple = false) => {
    if (!options.title.trim()) {
      toast.error('Please enter a blog post title');
      return;
    }

    // Check free usage limit
    if (usageCount >= FREE_LIMIT) {
      toast.error(`Free limit reached (${FREE_LIMIT} images). Contact us for unlimited access!`);
      return;
    }

    // Check if API key is available
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      toast.error('OpenAI API key not configured. Please contact support.');
      return;
    }

    setIsGenerating(true);
    setGeneratedImages([]);
    setSelectedImage(null);

    try {
      if (generateMultiple) {
        toast.info('Generating 3 style variations...', { duration: 3000 });
        const images = await generateImageVariations(options, 3);
        setGeneratedImages(images);
        
        // Update usage count for multiple images
        const newCount = usageCount + images.length;
        setUsageCount(newCount);
        localStorage.setItem('appSuite_imageGenUsage', newCount.toString());
        
        toast.success(`Generated ${images.length} image variations! (${FREE_LIMIT - newCount} free images remaining)`);
      } else {
        const image = await generateBlogThumbnail(options);
        setGeneratedImages([image]);
        setSelectedImage(image);
        
        // Update usage count for single image
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem('appSuite_imageGenUsage', newCount.toString());
        
        toast.success(`Image generated successfully! (${FREE_LIMIT - newCount} free images remaining)`);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('API key')) {
        toast.error('API key issue. Please contact support for assistance.');
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to generate image');
      }
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageSelect = (image: GeneratedImage) => {
    setSelectedImage(image);
    if (onImageSelected) {
      onImageSelected(image.url, image.prompt);
    }
    toast.success('Image selected for your blog post!');
  };

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `blog-thumbnail-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  return (
    <div className="space-y-6">
      {/* Usage Counter */}
      <Card className={`${usageCount >= FREE_LIMIT ? 'border-red-200 bg-red-50' : usageCount >= FREE_LIMIT - 1 ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${usageCount >= FREE_LIMIT ? 'bg-red-500' : usageCount >= FREE_LIMIT - 1 ? 'bg-yellow-500' : 'bg-green-500'}`}>
                {FREE_LIMIT - usageCount}
              </div>
              <div>
                <p className="font-medium">
                  {usageCount >= FREE_LIMIT ? 'Free Limit Reached' : 
                   usageCount >= FREE_LIMIT - 1 ? 'Last Free Image!' : 
                   `${FREE_LIMIT - usageCount} Free Images Remaining`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {usageCount >= FREE_LIMIT ? 'Contact us for unlimited access' : 
                   `${usageCount}/${FREE_LIMIT} images used`}
                </p>
              </div>
            </div>
            {usageCount >= FREE_LIMIT - 1 && (
              <div className="flex gap-2">
                <Button size="sm" asChild>
                  <Link to="/contact">Get Unlimited</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Image Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Image Title/Concept</Label>
              <Input
                id="title"
                value={options.title}
                onChange={(e) => setOptions(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., 'AI Dashboard Design', 'Modern App Interface', 'Tech Startup Logo'..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={options.category} onValueChange={(value) => setOptions(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AI Development">AI & Technology</SelectItem>
                  <SelectItem value="Industry Insights">Business & Marketing</SelectItem>
                  <SelectItem value="Case Studies">App & UI Design</SelectItem>
                  <SelectItem value="Tutorials">Social Media</SelectItem>
                  <SelectItem value="News">Blog & Content</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Select value={options.style} onValueChange={(value: string) => setOptions(prev => ({ ...prev, style: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="tech">Tech</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quality">Quality</Label>
              <Select value={options.quality} onValueChange={(value: string) => setOptions(prev => ({ ...prev, quality: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="hd">HD (Premium)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => handleGenerate(false)} 
              disabled={isGenerating || usageCount >= FREE_LIMIT}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Generate Single Image
                </>
              )}
            </Button>
            
            <Button 
              onClick={() => handleGenerate(true)} 
              disabled={isGenerating || usageCount >= FREE_LIMIT}
              variant="outline"
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate 3 Variations
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Images */}
      {generatedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedImages.map((image, index) => (
                <div 
                  key={index} 
                  className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                    selectedImage?.url === image.url ? 'border-primary shadow-lg' : 'border-gray-200 hover:border-primary/50'
                  }`}
                  onClick={() => handleImageSelect(image)}
                >
                  <img
                    src={image.url}
                    alt={`Generated thumbnail ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageSelect(image);
                        }}
                      >
                        Select
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(image);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Selected Badge */}
                  {selectedImage?.url === image.url && (
                    <Badge className="absolute top-2 right-2">
                      Selected
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            
            {/* Image Details */}
            {selectedImage && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Selected Image Details:</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Original Prompt:</strong> {selectedImage.prompt}
                </p>
                {selectedImage.revisedPrompt && (
                  <p className="text-sm text-muted-foreground">
                    <strong>AI-Revised Prompt:</strong> {selectedImage.revisedPrompt}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};