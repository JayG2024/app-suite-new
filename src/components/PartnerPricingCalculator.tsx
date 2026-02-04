import React, { useState, useEffect } from 'react'
import { usePartnerAuth } from '@/contexts/PartnerAuthContext'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { 
  Calculator, 
  DollarSign, 
  Download, 
  Save, 
  Percent,
  Globe,
  Smartphone,
  ShoppingCart,
  Settings,
  Zap,
  Eye
} from 'lucide-react'
import { toast } from 'sonner'
import QuoteTemplate from './QuoteTemplate'

interface ServiceSpecs {
  // Custom Website
  websiteComplexity?: 'simple' | 'business' | 'complex'
  pageCount?: number
  cmsRequired?: boolean
  ecommerceIntegration?: boolean
  customIntegrations?: string[]
  
  // Web Application
  userAuthentication?: boolean
  databaseComplexity?: 'simple' | 'moderate' | 'complex'
  apiIntegrations?: string[]
  customFunctionality?: string[]
  userBase?: 'small' | 'medium' | 'large'
  realTimeFeatures?: boolean
  
  // Mobile App
  platforms?: ('ios' | 'android' | 'cross-platform')[]
  mobileFeatures?: string[]
  backendRequired?: boolean
  appStoreDeployment?: boolean
  pushNotifications?: boolean
  offlineCapability?: boolean
  
  // AI Website
  aiWebsiteType?: 'standard' | 'premium'
  aiPageCount?: number
  
  // E-commerce
  productCatalogSize?: 'small' | 'medium' | 'large'
  paymentProcessing?: string[]
  inventoryManagement?: boolean
  thirdPartyIntegrations?: string[]
  multiCurrency?: boolean
  subscriptionSupport?: boolean
  
  // Maintenance
  hostingTier?: 'basic' | 'professional' | 'enterprise'
  securityUpdates?: boolean
  contentUpdates?: boolean
  technicalSupport?: 'basic' | 'priority' | '24/7'
  performanceMonitoring?: boolean
  backupFrequency?: 'daily' | 'weekly' | 'monthly'
}

interface PriceQuote {
  id?: string
  serviceType: string
  standardPrice: number
  partnerPrice: number
  discount: number
  specifications: ServiceSpecs
  notes?: string
  createdAt?: Date
}

const serviceTypes = [
  {
    id: 'custom-website',
    name: 'Custom Website',
    icon: Globe,
    description: 'Custom-built responsive websites',
    basePrice: 5000
  },
  {
    id: 'web-application',
    name: 'Web Application',
    icon: Settings,
    description: 'Full-stack web applications',
    basePrice: 10000
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    icon: Smartphone,
    description: 'iOS, Android, or cross-platform apps',
    basePrice: 15000
  },
  {
    id: 'ai-website',
    name: 'AI Website',
    icon: Zap,
    description: 'AI-powered website development',
    basePrice: 2500
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Solution',
    icon: ShoppingCart,
    description: 'Online store and payment processing',
    basePrice: 8000
  },
  {
    id: 'maintenance',
    name: 'Maintenance Package',
    icon: Settings,
    description: 'Ongoing support and maintenance',
    basePrice: 500
  }
]

export default function PartnerPricingCalculator() {
  const { partnerProfile } = usePartnerAuth()
  const [selectedService, setSelectedService] = useState('')
  const [specs, setSpecs] = useState<ServiceSpecs>({})
  const [notes, setNotes] = useState('')
  const [currentQuote, setCurrentQuote] = useState<PriceQuote | null>(null)
  const [savedQuotes, setSavedQuotes] = useState<PriceQuote[]>([])
  const [showQuotePreview, setShowQuotePreview] = useState(false)

  // Calculate pricing based on service type and specifications
  const calculatePrice = (serviceType: string, specifications: ServiceSpecs): { standard: number, partner: number, discount: number } => {
    const service = serviceTypes.find(s => s.id === serviceType)
    if (!service || !partnerProfile?.discount_tier) {
      return { standard: 0, partner: 0, discount: 0 }
    }

    let standardPrice = service.basePrice
    let discountPercentage = 0

    // Apply service-specific pricing logic
    switch (serviceType) {
      case 'custom-website':
        // Base price varies by complexity
        if (specifications.websiteComplexity === 'simple') standardPrice = 3000
        else if (specifications.websiteComplexity === 'business') standardPrice = 5000
        else if (specifications.websiteComplexity === 'complex') standardPrice = 8000
        
        // Add page count pricing
        if (specifications.pageCount) {
          standardPrice += Math.max(0, (specifications.pageCount - 5) * 200)
        }
        
        // Add feature pricing
        if (specifications.cmsRequired) standardPrice += 1000
        if (specifications.ecommerceIntegration) standardPrice += 2000
        if (specifications.customIntegrations?.length) {
          standardPrice += specifications.customIntegrations.length * 500
        }
        
        discountPercentage = partnerProfile.discount_tier.website_discount
        break

      case 'web-application':
        // Base price varies by complexity
        if (specifications.databaseComplexity === 'simple') standardPrice = 8000
        else if (specifications.databaseComplexity === 'moderate') standardPrice = 12000
        else if (specifications.databaseComplexity === 'complex') standardPrice = 18000
        
        // Add feature pricing
        if (specifications.userAuthentication) standardPrice += 1500
        if (specifications.realTimeFeatures) standardPrice += 3000
        if (specifications.apiIntegrations?.length) {
          standardPrice += specifications.apiIntegrations.length * 800
        }
        if (specifications.userBase === 'medium') standardPrice += 2000
        else if (specifications.userBase === 'large') standardPrice += 5000
        
        discountPercentage = partnerProfile.discount_tier.webapp_discount
        break

      case 'mobile-app':
        // Base price varies by platform
        const platformCount = specifications.platforms?.length || 1
        if (specifications.platforms?.includes('cross-platform')) {
          standardPrice = 12000
        } else {
          standardPrice = 8000 * platformCount
        }
        
        // Add feature pricing
        if (specifications.backendRequired) standardPrice += 5000
        if (specifications.appStoreDeployment) standardPrice += 1000
        if (specifications.pushNotifications) standardPrice += 1500
        if (specifications.offlineCapability) standardPrice += 2000
        
        discountPercentage = partnerProfile.discount_tier.mobile_app_discount
        break

      case 'ai-website':
        // AI website has fixed pricing structure
        if (specifications.aiWebsiteType === 'premium') {
          standardPrice = 3000
        } else {
          standardPrice = 2500
        }
        
        // Add per-page pricing
        if (specifications.aiPageCount) {
          standardPrice += Math.max(0, (specifications.aiPageCount - 1) * 100)
        }
        
        discountPercentage = partnerProfile.discount_tier.ai_website_base_discount
        break

      case 'ecommerce':
        // Base price varies by catalog size
        if (specifications.productCatalogSize === 'small') standardPrice = 6000
        else if (specifications.productCatalogSize === 'medium') standardPrice = 10000
        else if (specifications.productCatalogSize === 'large') standardPrice = 15000
        
        // Add feature pricing
        if (specifications.inventoryManagement) standardPrice += 2000
        if (specifications.multiCurrency) standardPrice += 1500
        if (specifications.subscriptionSupport) standardPrice += 3000
        if (specifications.thirdPartyIntegrations?.length) {
          standardPrice += specifications.thirdPartyIntegrations.length * 1000
        }
        
        discountPercentage = partnerProfile.discount_tier.ecommerce_discount
        break

      case 'maintenance':
        // Monthly maintenance pricing
        if (specifications.hostingTier === 'basic') standardPrice = 200
        else if (specifications.hostingTier === 'professional') standardPrice = 500
        else if (specifications.hostingTier === 'enterprise') standardPrice = 1000
        
        // Add feature pricing
        if (specifications.contentUpdates) standardPrice += 200
        if (specifications.technicalSupport === 'priority') standardPrice += 300
        else if (specifications.technicalSupport === '24/7') standardPrice += 500
        if (specifications.performanceMonitoring) standardPrice += 150
        
        discountPercentage = partnerProfile.discount_tier.maintenance_discount
        break
    }

    const partnerPrice = standardPrice * (1 - discountPercentage / 100)
    
    return {
      standard: Math.round(standardPrice),
      partner: Math.round(partnerPrice),
      discount: discountPercentage
    }
  }

  // Update quote when service or specs change
  useEffect(() => {
    if (selectedService) {
      const pricing = calculatePrice(selectedService, specs)
      setCurrentQuote({
        serviceType: selectedService,
        standardPrice: pricing.standard,
        partnerPrice: pricing.partner,
        discount: pricing.discount,
        specifications: specs,
        notes,
        createdAt: new Date()
      })
    }
  }, [selectedService, specs, notes, partnerProfile])

  const handleSaveQuote = () => {
    if (currentQuote) {
      // In a real implementation, this would save to the database
      const newQuote = { 
        ...currentQuote, 
        id: Date.now().toString(),
        createdAt: new Date(),
        lastModified: new Date()
      }
      setSavedQuotes(prev => [newQuote, ...prev])
      toast.success('Quote saved successfully')
    }
  }

  const handleExportQuote = () => {
    if (currentQuote) {
      // In a real implementation, this would generate a PDF with partner branding
      const quoteData = {
        partner: {
          name: partnerProfile?.name,
          company: partnerProfile?.company_name,
          email: partnerProfile?.contact_email
        },
        service: serviceTypes.find(s => s.id === selectedService)?.name,
        pricing: {
          standard: currentQuote.standardPrice,
          partner: currentQuote.partnerPrice,
          discount: currentQuote.discount,
          savings: currentQuote.standardPrice - currentQuote.partnerPrice
        },
        specifications: specs,
        notes: notes,
        generatedAt: new Date().toISOString()
      }
      
      console.log('Quote data for PDF generation:', quoteData)
      toast.success('Quote exported (PDF generation would happen here)')
    }
  }

  const renderServiceSpecifications = () => {
    switch (selectedService) {
      case 'custom-website':
        return (
          <div className="space-y-4">
            <div>
              <Label>Website Complexity</Label>
              <Select value={specs.websiteComplexity} onValueChange={(value: any) => setSpecs({...specs, websiteComplexity: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple (Brochure site)</SelectItem>
                  <SelectItem value="business">Business (Multi-page)</SelectItem>
                  <SelectItem value="complex">Complex (Advanced features)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Number of Pages</Label>
              <Input
                type="number"
                value={specs.pageCount || ''}
                onChange={(e) => setSpecs({...specs, pageCount: parseInt(e.target.value) || 0})}
                placeholder="5"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={specs.cmsRequired}
                  onCheckedChange={(checked) => setSpecs({...specs, cmsRequired: !!checked})}
                />
                <Label>Content Management System (CMS)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={specs.ecommerceIntegration}
                  onCheckedChange={(checked) => setSpecs({...specs, ecommerceIntegration: !!checked})}
                />
                <Label>E-commerce Integration</Label>
              </div>
            </div>
            
            <div>
              <Label>Custom Integrations</Label>
              <Textarea
                value={specs.customIntegrations?.join(', ') || ''}
                onChange={(e) => setSpecs({...specs, customIntegrations: e.target.value.split(', ').filter(Boolean)})}
                placeholder="List any third-party integrations needed"
              />
            </div>
          </div>
        )

      case 'ai-website':
        return (
          <div className="space-y-4">
            <div>
              <Label>AI Website Type</Label>
              <Select value={specs.aiWebsiteType} onValueChange={(value: any) => setSpecs({...specs, aiWebsiteType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard ($2,500 base)</SelectItem>
                  <SelectItem value="premium">Premium ($3,000 base)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Number of Pages</Label>
              <Input
                type="number"
                value={specs.aiPageCount || ''}
                onChange={(e) => setSpecs({...specs, aiPageCount: parseInt(e.target.value) || 0})}
                placeholder="1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Standard: $100/page after first page, Partner: $50/page after first page
              </p>
            </div>
          </div>
        )

      case 'maintenance':
        return (
          <div className="space-y-4">
            <div>
              <Label>Hosting Tier</Label>
              <Select value={specs.hostingTier} onValueChange={(value: any) => setSpecs({...specs, hostingTier: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select hosting tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic ($200/month)</SelectItem>
                  <SelectItem value="professional">Professional ($500/month)</SelectItem>
                  <SelectItem value="enterprise">Enterprise ($1,000/month)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Technical Support Level</Label>
              <Select value={specs.technicalSupport} onValueChange={(value: any) => setSpecs({...specs, technicalSupport: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select support level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (Business hours)</SelectItem>
                  <SelectItem value="priority">Priority (+$300/month)</SelectItem>
                  <SelectItem value="24/7">24/7 Support (+$500/month)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={specs.securityUpdates}
                  onCheckedChange={(checked) => setSpecs({...specs, securityUpdates: !!checked})}
                />
                <Label>Security Updates (Included)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={specs.contentUpdates}
                  onCheckedChange={(checked) => setSpecs({...specs, contentUpdates: !!checked})}
                />
                <Label>Content Updates (+$200/month)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={specs.performanceMonitoring}
                  onCheckedChange={(checked) => setSpecs({...specs, performanceMonitoring: !!checked})}
                />
                <Label>Performance Monitoring (+$150/month)</Label>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a service type to configure specifications</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Partner Pricing Calculator</h1>
        <p className="text-gray-600">
          Calculate pricing with your {partnerProfile?.discount_tier?.name} tier discounts
        </p>
      </div>

      {/* Service Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Service Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceTypes.map((service) => (
              <Card
                key={service.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedService === service.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedService(service.id)}
              >
                <CardContent className="p-4 text-center">
                  <service.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold mb-1">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  <Badge variant="secondary">From ${service.basePrice.toLocaleString()}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Specifications */}
      {selectedService && (
        <Card>
          <CardHeader>
            <CardTitle>Configure Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            {renderServiceSpecifications()}
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {selectedService && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional requirements or notes..."
              rows={3}
            />
          </CardContent>
        </Card>
      )}

      {/* Pricing Summary */}
      {currentQuote && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              Pricing Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600 mb-1">
                  ${currentQuote.standardPrice.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500">Standard Price</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Percent className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">
                    {currentQuote.discount}%
                  </span>
                </div>
                <p className="text-sm text-gray-500">Partner Discount</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  ${currentQuote.partnerPrice.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500">Your Partner Price</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-green-600 font-semibold mb-4">
                You save ${(currentQuote.standardPrice - currentQuote.partnerPrice).toLocaleString()}!
              </p>
              
              <div className="flex gap-3 justify-center">
                <Button onClick={handleSaveQuote} variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Quote
                </Button>
                <Button onClick={() => setShowQuotePreview(true)} variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={handleExportQuote}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Quotes */}
      {savedQuotes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedQuotes.slice(0, 5).map((quote) => (
                <div key={quote.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-semibold">
                      {serviceTypes.find(s => s.id === quote.serviceType)?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {quote.createdAt?.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">
                      ${quote.partnerPrice.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600">
                      {quote.discount}% off
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quote Preview Modal */}
      {showQuotePreview && currentQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Quote Preview</h2>
              <Button
                variant="outline"
                onClick={() => setShowQuotePreview(false)}
              >
                Close
              </Button>
            </div>
            <div className="p-6">
              <QuoteTemplate
                quote={{
                  ...currentQuote,
                  serviceName: serviceTypes.find(s => s.id === selectedService)?.name || selectedService
                }}
                showPartnerBranding={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}