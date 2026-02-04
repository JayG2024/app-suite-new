import React, { useState } from 'react'
import { usePartnerAuth } from '@/contexts/PartnerAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { Badge } from './ui/badge'
import { 
  Globe, 
  Search, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Code,
  Image as ImageIcon,
  Video,
  Database,
  Zap,
  DollarSign,
  Lightbulb,
  TrendingUp,
  ArrowRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface WebsiteAnalysis {
  url: string
  pageCount: number
  technologies: string[]
  contentTypes: {
    text: number
    images: number
    videos: number
    forms: number
  }
  performanceMetrics?: {
    loadTime: number
    pageSize: number
  }
  seoAnalysis?: {
    hasMetaTags: boolean
    hasStructuredData: boolean
    mobileResponsive: boolean
  }
  accessibility?: {
    score: number
    issues: string[]
  }
}

interface AnalysisError {
  message: string
  details?: string
}

interface RebuildSuggestion {
  recommendedApproach: 'full-rebuild' | 'migration' | 'enhancement'
  estimatedComplexity: 'simple' | 'business' | 'complex'
  estimatedPages: number
  suggestedFeatures: string[]
  bestPractices: string[]
  timelineEstimate: string
  pricing: {
    standardPrice: number
    partnerPrice: number
    discount: number
  }
}

export default function WebsiteAnalyzer() {
  const { partnerProfile } = usePartnerAuth()
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null)
  const [rebuildSuggestion, setRebuildSuggestion] = useState<RebuildSuggestion | null>(null)
  const [error, setError] = useState<AnalysisError | null>(null)
  const [validationError, setValidationError] = useState<string>('')

  const validateUrl = (inputUrl: string): boolean => {
    setValidationError('')
    
    if (!inputUrl.trim()) {
      setValidationError('Please enter a website URL')
      return false
    }

    // Add protocol if missing
    let urlToValidate = inputUrl.trim()
    if (!urlToValidate.startsWith('http://') && !urlToValidate.startsWith('https://')) {
      urlToValidate = 'https://' + urlToValidate
    }

    try {
      const urlObj = new URL(urlToValidate)
      
      // Check for valid protocol
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        setValidationError('URL must use HTTP or HTTPS protocol')
        return false
      }

      // Check for valid hostname
      if (!urlObj.hostname || urlObj.hostname.length < 3) {
        setValidationError('Please enter a valid domain name')
        return false
      }

      // Update the URL with protocol if it was added
      if (inputUrl !== urlToValidate) {
        setUrl(urlToValidate)
      }

      return true
    } catch (err) {
      setValidationError('Please enter a valid URL (e.g., example.com or https://example.com)')
      return false
    }
  }

  const analyzeWebsite = async () => {
    if (!validateUrl(url)) {
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setAnalysis(null)

    try {
      // Check if Fire Crawl API key is configured
      const apiKey = import.meta.env.VITE_FIRECRAWL_API_KEY
      
      if (!apiKey) {
        // For now, provide mock data for development/testing
        console.warn('Fire Crawl API key not configured, using mock data')
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Generate mock analysis data
        const mockAnalysis: WebsiteAnalysis = {
          url: url,
          pageCount: Math.floor(Math.random() * 50) + 5,
          technologies: [
            'React',
            'WordPress',
            'jQuery',
            'Google Analytics',
            'Bootstrap'
          ].slice(0, Math.floor(Math.random() * 3) + 2),
          contentTypes: {
            text: Math.floor(Math.random() * 100) + 20,
            images: Math.floor(Math.random() * 50) + 10,
            videos: Math.floor(Math.random() * 10),
            forms: Math.floor(Math.random() * 5) + 1
          },
          performanceMetrics: {
            loadTime: Math.random() * 3 + 1,
            pageSize: Math.random() * 5 + 1
          },
          seoAnalysis: {
            hasMetaTags: Math.random() > 0.3,
            hasStructuredData: Math.random() > 0.5,
            mobileResponsive: Math.random() > 0.2
          },
          accessibility: {
            score: Math.floor(Math.random() * 40) + 60,
            issues: [
              'Missing alt text on images',
              'Low contrast text',
              'Missing ARIA labels'
            ].slice(0, Math.floor(Math.random() * 3))
          }
        }
        
        setAnalysis(mockAnalysis)
        
        // Generate rebuild suggestions
        const suggestions = generateRebuildSuggestions(mockAnalysis)
        setRebuildSuggestion(suggestions)
        
        return
      }

      // Real Fire Crawl API integration
      const response = await fetch('https://api.firecrawl.dev/v0/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          url: url,
          crawlerOptions: {
            maxDepth: 3,
            limit: 100
          },
          pageOptions: {
            onlyMainContent: false,
            includeHtml: true
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `API request failed with status ${response.status}`)
      }

      const data = await response.json()
      
      // Process Fire Crawl response into our analysis format
      const processedAnalysis: WebsiteAnalysis = {
        url: url,
        pageCount: data.data?.length || 0,
        technologies: extractTechnologies(data),
        contentTypes: analyzeContentTypes(data),
        performanceMetrics: {
          loadTime: 0, // Would need additional API calls
          pageSize: 0
        },
        seoAnalysis: analyzeSEO(data),
        accessibility: {
          score: 0, // Would need additional analysis
          issues: []
        }
      }

      setAnalysis(processedAnalysis)
      
      // Generate rebuild suggestions
      const suggestions = generateRebuildSuggestions(processedAnalysis)
      setRebuildSuggestion(suggestions)
    } catch (err) {
      console.error('Website analysis error:', err)
      setError({
        message: 'Failed to analyze website',
        details: err instanceof Error ? err.message : 'Unknown error occurred'
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Helper functions to process Fire Crawl data
  const extractTechnologies = (data: any): string[] => {
    // This would analyze the HTML/headers to detect technologies
    // For now, return empty array - would be enhanced with actual detection
    return []
  }

  const analyzeContentTypes = (data: any): WebsiteAnalysis['contentTypes'] => {
    // This would analyze the crawled pages for content types
    return {
      text: 0,
      images: 0,
      videos: 0,
      forms: 0
    }
  }

  const analyzeSEO = (data: any): WebsiteAnalysis['seoAnalysis'] => {
    // This would analyze SEO elements from crawled pages
    return {
      hasMetaTags: false,
      hasStructuredData: false,
      mobileResponsive: false
    }
  }

  // Generate rebuild suggestions based on analysis
  const generateRebuildSuggestions = (analysisData: WebsiteAnalysis): RebuildSuggestion => {
    // Determine complexity based on page count, technologies, and content
    let complexity: 'simple' | 'business' | 'complex' = 'simple'
    if (analysisData.pageCount > 20 || analysisData.contentTypes.forms > 3) {
      complexity = 'complex'
    } else if (analysisData.pageCount > 10 || analysisData.contentTypes.forms > 1) {
      complexity = 'business'
    }

    // Determine recommended approach
    let approach: 'full-rebuild' | 'migration' | 'enhancement' = 'full-rebuild'
    const hasModernTech = analysisData.technologies.some(tech => 
      ['React', 'Vue', 'Angular', 'Next.js'].includes(tech)
    )
    if (hasModernTech && analysisData.seoAnalysis?.mobileResponsive) {
      approach = 'enhancement'
    } else if (analysisData.pageCount < 15 && !hasModernTech) {
      approach = 'full-rebuild'
    } else {
      approach = 'migration'
    }

    // Generate suggested features based on analysis
    const suggestedFeatures: string[] = []
    if (analysisData.contentTypes.forms > 0) {
      suggestedFeatures.push('Contact forms with validation')
    }
    if (!analysisData.seoAnalysis?.hasMetaTags) {
      suggestedFeatures.push('SEO optimization with meta tags')
    }
    if (!analysisData.seoAnalysis?.mobileResponsive) {
      suggestedFeatures.push('Mobile-responsive design')
    }
    if (!analysisData.seoAnalysis?.hasStructuredData) {
      suggestedFeatures.push('Structured data for better SEO')
    }
    if (analysisData.contentTypes.images > 20) {
      suggestedFeatures.push('Image optimization and lazy loading')
    }
    if (analysisData.performanceMetrics && analysisData.performanceMetrics.loadTime > 3) {
      suggestedFeatures.push('Performance optimization')
    }

    // Generate best practices recommendations
    const bestPractices: string[] = [
      'Modern React-based architecture for better performance',
      'TypeScript for type safety and better maintainability',
      'Responsive design that works on all devices',
      'SEO optimization with proper meta tags and structured data',
      'Fast loading times with optimized assets',
      'Secure hosting with SSL certificate',
      'Regular security updates and maintenance'
    ]

    // Add specific recommendations based on issues found
    if (analysisData.accessibility && analysisData.accessibility.score < 80) {
      bestPractices.push('Improve accessibility for better user experience and compliance')
    }
    if (analysisData.technologies.some(tech => ['jQuery', 'WordPress'].includes(tech))) {
      bestPractices.push('Migrate from legacy technologies to modern framework')
    }

    // Calculate timeline estimate
    let timelineWeeks = 4
    if (complexity === 'business') timelineWeeks = 6
    if (complexity === 'complex') timelineWeeks = 10
    if (approach === 'migration') timelineWeeks += 2
    const timelineEstimate = `${timelineWeeks} weeks`

    // Calculate pricing
    const pricing = calculateRebuildPricing(analysisData.pageCount, complexity)

    return {
      recommendedApproach: approach,
      estimatedComplexity: complexity,
      estimatedPages: analysisData.pageCount,
      suggestedFeatures,
      bestPractices,
      timelineEstimate,
      pricing
    }
  }

  // Calculate rebuild pricing based on page count and complexity
  const calculateRebuildPricing = (
    pageCount: number, 
    complexity: 'simple' | 'business' | 'complex'
  ): { standardPrice: number, partnerPrice: number, discount: number } => {
    // Base pricing by complexity
    let standardPrice = 3000 // simple
    if (complexity === 'business') standardPrice = 5000
    if (complexity === 'complex') standardPrice = 8000

    // Add per-page pricing (after first 5 pages)
    const additionalPages = Math.max(0, pageCount - 5)
    standardPrice += additionalPages * 200

    // Add typical features for rebuild
    standardPrice += 1000 // CMS for content management
    standardPrice += 500 // SEO optimization

    // Get partner discount
    let discount = 0
    let partnerPrice = standardPrice

    if (partnerProfile?.discount_tier) {
      discount = partnerProfile.discount_tier.website_discount || 0
      partnerPrice = Math.round(standardPrice * (1 - discount / 100))
    }

    return {
      standardPrice: Math.round(standardPrice),
      partnerPrice,
      discount
    }
  }

  const handleGenerateQuote = () => {
    if (!rebuildSuggestion || !analysis) {
      toast.error('No analysis data available')
      return
    }

    // Navigate to pricing calculator with pre-filled data
    // Store the analysis data in sessionStorage to pass to calculator
    sessionStorage.setItem('websiteAnalysis', JSON.stringify({
      url: analysis.url,
      pageCount: analysis.pageCount,
      complexity: rebuildSuggestion.estimatedComplexity,
      suggestedFeatures: rebuildSuggestion.suggestedFeatures,
      notes: `Website rebuild analysis for ${analysis.url}\n\nRecommended approach: ${rebuildSuggestion.recommendedApproach}\nEstimated timeline: ${rebuildSuggestion.timelineEstimate}\n\nSuggested improvements:\n${rebuildSuggestion.bestPractices.slice(0, 3).map(bp => `- ${bp}`).join('\n')}`
    }))

    toast.success('Navigating to pricing calculator...')
    navigate('/partner/pricing')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isAnalyzing) {
      analyzeWebsite()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Analyzer</h1>
        <p className="text-gray-600">
          Analyze existing websites to generate rebuild pricing and recommendations
        </p>
      </div>

      {/* URL Input Card */}
      <Card>
        <CardHeader>
          <CardTitle>Enter Website URL</CardTitle>
          <CardDescription>
            Enter the URL of the website you want to analyze for rebuild pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="website-url">Website URL</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    id="website-url"
                    type="text"
                    placeholder="example.com or https://example.com"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value)
                      setValidationError('')
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={isAnalyzing}
                    className={validationError ? 'border-red-500' : ''}
                  />
                  {validationError && (
                    <p className="text-sm text-red-500 mt-1">{validationError}</p>
                  )}
                </div>
                <Button 
                  onClick={analyzeWebsite} 
                  disabled={isAnalyzing || !url.trim()}
                  className="min-w-[120px]"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>

            {isAnalyzing && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Crawling website and analyzing content... This may take a minute.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold">{error.message}</div>
                  {error.details && (
                    <div className="text-sm mt-1">{error.details}</div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Success Alert */}
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Analysis complete! Found {analysis.pageCount} pages on {analysis.url}
            </AlertDescription>
          </Alert>

          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Website Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Total Pages</p>
                  <p className="text-2xl font-bold">{analysis.pageCount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Text Sections</p>
                  <p className="text-2xl font-bold">{analysis.contentTypes.text}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Images</p>
                  <p className="text-2xl font-bold">{analysis.contentTypes.images}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Forms</p>
                  <p className="text-2xl font-bold">{analysis.contentTypes.forms}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technologies Card */}
          {analysis.technologies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Technologies Detected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Content Assessment Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>Text Content</span>
                  </div>
                  <span className="font-semibold">{analysis.contentTypes.text} sections</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-gray-500" />
                    <span>Images</span>
                  </div>
                  <span className="font-semibold">{analysis.contentTypes.images} images</span>
                </div>
                {analysis.contentTypes.videos > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-gray-500" />
                      <span>Videos</span>
                    </div>
                    <span className="font-semibold">{analysis.contentTypes.videos} videos</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-gray-500" />
                    <span>Forms</span>
                  </div>
                  <span className="font-semibold">{analysis.contentTypes.forms} forms</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO & Performance Card */}
          {analysis.seoAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  SEO & Technical Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Meta Tags</span>
                    {analysis.seoAnalysis.hasMetaTags ? (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Present
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Missing
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Structured Data</span>
                    {analysis.seoAnalysis.hasStructuredData ? (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Present
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Missing
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Mobile Responsive</span>
                    {analysis.seoAnalysis.mobileResponsive ? (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        No
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Accessibility Card */}
          {analysis.accessibility && analysis.accessibility.score > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Accessibility Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Score</span>
                      <span className="text-2xl font-bold">{analysis.accessibility.score}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          analysis.accessibility.score >= 80 ? 'bg-green-500' :
                          analysis.accessibility.score >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${analysis.accessibility.score}%` }}
                      />
                    </div>
                  </div>
                  {analysis.accessibility.issues.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Common Issues:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {analysis.accessibility.issues.map((issue, index) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rebuild Suggestions */}
          {rebuildSuggestion && (
            <>
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    Rebuild Recommendations
                  </CardTitle>
                  <CardDescription>
                    Based on our analysis, here's what we recommend for rebuilding this website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Recommended Approach</p>
                        <p className="font-semibold capitalize">{rebuildSuggestion.recommendedApproach.replace('-', ' ')}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Complexity Level</p>
                        <p className="font-semibold capitalize">{rebuildSuggestion.estimatedComplexity}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Timeline Estimate</p>
                        <p className="font-semibold">{rebuildSuggestion.timelineEstimate}</p>
                      </div>
                    </div>

                    {rebuildSuggestion.suggestedFeatures.length > 0 && (
                      <div className="bg-white p-4 rounded-lg">
                        <p className="font-semibold mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          Suggested Features
                        </p>
                        <ul className="space-y-1">
                          {rebuildSuggestion.suggestedFeatures.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Best Practices */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Best Practices & Improvements
                  </CardTitle>
                  <CardDescription>
                    Modern web development standards we'll implement in the rebuild
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {rebuildSuggestion.bestPractices.map((practice, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{practice}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Pricing Estimate */}
              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Rebuild Pricing Estimate
                  </CardTitle>
                  <CardDescription>
                    Estimated pricing for rebuilding this website with modern technology
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center bg-white p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600 mb-1">
                        ${rebuildSuggestion.pricing.standardPrice.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-500">Standard Price</p>
                    </div>
                    
                    {partnerProfile && (
                      <>
                        <div className="text-center bg-white p-4 rounded-lg">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <span className="text-2xl font-bold text-green-600">
                              {rebuildSuggestion.pricing.discount}%
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">Partner Discount</p>
                        </div>
                        
                        <div className="text-center bg-white p-4 rounded-lg">
                          <div className="text-3xl font-bold text-blue-600 mb-1">
                            ${rebuildSuggestion.pricing.partnerPrice.toLocaleString()}
                          </div>
                          <p className="text-sm text-gray-500">Your Partner Price</p>
                        </div>
                      </>
                    )}
                  </div>

                  {partnerProfile && (
                    <div className="text-center mb-4">
                      <p className="text-green-600 font-semibold">
                        You save ${(rebuildSuggestion.pricing.standardPrice - rebuildSuggestion.pricing.partnerPrice).toLocaleString()} with your partner discount!
                      </p>
                    </div>
                  )}

                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Pricing includes:</strong>
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• {rebuildSuggestion.estimatedPages} pages with responsive design</li>
                      <li>• Content Management System (CMS)</li>
                      <li>• SEO optimization</li>
                      <li>• Modern React-based architecture</li>
                      <li>• Mobile-responsive design</li>
                      <li>• Performance optimization</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>
                Generate a detailed quote based on this analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleGenerateQuote}
                  disabled={!rebuildSuggestion}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Generate Rebuild Quote
                </Button>
                <Button variant="outline" className="w-full">
                  Save Analysis
                </Button>
                <p className="text-sm text-gray-500 text-center">
                  The quote will be pre-filled with the analysis data and recommendations
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
