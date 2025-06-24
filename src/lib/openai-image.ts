import OpenAI from 'openai';

// Initialize OpenAI client - API key should be handled server-side
// This is a placeholder that will use the backend API
const openai = new OpenAI({
  apiKey: 'placeholder-key', // Real key should be on server only
  dangerouslyAllowBrowser: true // Only for development - move to backend in production
});

export interface ImageGenerationOptions {
  title: string;
  category: string;
  style?: 'professional' | 'modern' | 'tech' | 'business' | 'creative';
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  revisedPrompt?: string;
}

/**
 * Generate a blog post thumbnail using GPT Image 1
 */
export async function generateBlogThumbnail(options: ImageGenerationOptions): Promise<GeneratedImage> {
  const { title, category, style = 'professional', size = '1792x1024', quality = 'hd' } = options;
  
  // Create optimized prompt based on category and style
  const prompt = createImagePrompt(title, category, style);
  
  try {
    const response = await openai.images.generate({
      model: "gpt-image-1", // Latest premium image generation model
      prompt,
      n: 1,
      size,
      quality,
      style: style === 'creative' ? 'vivid' : 'natural'
    });

    const imageUrl = response.data[0].url;
    const revisedPrompt = response.data[0].revised_prompt;

    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    return {
      url: imageUrl,
      prompt,
      revisedPrompt
    };
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create optimized prompts for different categories and styles
 */
function createImagePrompt(title: string, category: string, style: string): string {
  const basePrompts = {
    'AI Development': 'A sleek, modern illustration featuring artificial intelligence and machine learning concepts',
    'Industry Insights': 'A professional business and technology visualization with clean, corporate aesthetics',
    'Case Studies': 'A data-driven infographic style illustration showing success metrics and business growth',
    'Tutorials': 'A clean, educational diagram style illustration with step-by-step visual elements',
    'News': 'A dynamic, news-style graphic with modern typography and tech elements',
    'default': 'A modern, professional technology illustration'
  };

  const styleModifiers = {
    'professional': 'clean, minimalist design with subtle gradients and corporate colors',
    'modern': 'contemporary design with bold colors and geometric shapes',
    'tech': 'futuristic tech aesthetic with neon accents and digital elements',
    'business': 'corporate style with charts, graphs, and business iconography',
    'creative': 'artistic and creative design with unique visual metaphors'
  };

  const basePrompt = basePrompts[category as keyof typeof basePrompts] || basePrompts.default;
  const styleModifier = styleModifiers[style as keyof typeof styleModifiers];
  
  // Extract key concepts from title for more relevant imagery
  const titleConcepts = extractTitleConcepts(title);
  
  return `${basePrompt} representing "${titleConcepts}". ${styleModifier}. High-quality, blog thumbnail format, no text overlays, suitable for professional blog header. 16:9 aspect ratio, crisp and engaging visual design.`;
}

/**
 * Extract key concepts from blog title for better image generation
 */
function extractTitleConcepts(title: string): string {
  // Remove common words and focus on key terms
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'how', 'what', 'why', 'when', 'where'];
  const words = title.toLowerCase().split(' ').filter(word => 
    !stopWords.includes(word) && word.length > 2
  );
  
  // Take the most important words (first 4-6 words typically contain the main concepts)
  return words.slice(0, 6).join(' ');
}

/**
 * Generate multiple image variations for selection
 */
export async function generateImageVariations(options: ImageGenerationOptions, count: number = 3): Promise<GeneratedImage[]> {
  const variations: GeneratedImage[] = [];
  const styles: Array<'professional' | 'modern' | 'tech'> = ['professional', 'modern', 'tech'];
  
  for (let i = 0; i < Math.min(count, 3); i++) {
    try {
      const styleOption = styles[i] || 'professional';
      const image = await generateBlogThumbnail({
        ...options,
        style: styleOption
      });
      variations.push(image);
      
      // Add small delay to avoid rate limiting
      if (i < count - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Failed to generate variation ${i + 1}:`, error);
    }
  }
  
  return variations;
}

/**
 * Auto-generate image based on blog post content
 */
export async function autoGenerateForPost(
  title: string, 
  excerpt: string, 
  category: string
): Promise<GeneratedImage> {
  // Analyze content to determine best style
  const style = determineOptimalStyle(title, excerpt, category);
  
  return generateBlogThumbnail({
    title,
    category,
    style,
    size: '1792x1024', // Perfect for blog thumbnails
    quality: 'hd'
  });
}

/**
 * Determine optimal image style based on content analysis
 */
function determineOptimalStyle(title: string, excerpt: string, category: string): 'professional' | 'modern' | 'tech' | 'business' | 'creative' {
  const content = (title + ' ' + excerpt).toLowerCase();
  
  if (content.includes('ai') || content.includes('machine learning') || content.includes('neural') || content.includes('algorithm')) {
    return 'tech';
  }
  
  if (content.includes('business') || content.includes('roi') || content.includes('revenue') || content.includes('cost')) {
    return 'business';
  }
  
  if (content.includes('guide') || content.includes('tutorial') || content.includes('step') || content.includes('how to')) {
    return 'modern';
  }
  
  if (content.includes('creative') || content.includes('design') || content.includes('innovation')) {
    return 'creative';
  }
  
  return 'professional'; // Default fallback
}

/**
 * Download and save generated image to local storage or CDN
 */
export async function downloadAndSaveImage(imageUrl: string, filename: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // In a real implementation, you'd upload this to your CDN/storage
    // For now, we'll create a local object URL
    const localUrl = URL.createObjectURL(blob);
    
    // TODO: Implement actual file storage (Firebase Storage, AWS S3, etc.)
    console.log(`Image saved as: ${filename}`);
    
    return localUrl;
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error('Failed to download and save image');
  }
}