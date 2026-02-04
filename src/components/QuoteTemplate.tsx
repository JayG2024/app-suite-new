import React from 'react'
import { usePartnerAuth } from '@/contexts/PartnerAuthContext'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'

interface QuoteTemplateProps {
  quote: {
    id?: string
    serviceType: string
    serviceName?: string
    standardPrice: number
    partnerPrice: number
    discount: number
    specifications: any
    notes?: string
    clientName?: string
    clientEmail?: string
  }
  clientInfo?: {
    name: string
    email: string
    company?: string
    phone?: string
  }
  showPartnerBranding?: boolean
}

export default function QuoteTemplate({ 
  quote, 
  clientInfo, 
  showPartnerBranding = true 
}: QuoteTemplateProps) {
  const { partnerProfile } = usePartnerAuth()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getExpirationDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 30) // 30 days from now
    return date
  }

  const renderSpecifications = () => {
    const specs = quote.specifications
    const items: string[] = []

    switch (quote.serviceType) {
      case 'custom-website':
        if (specs.websiteComplexity) {
          items.push(`Website Type: ${specs.websiteComplexity.charAt(0).toUpperCase() + specs.websiteComplexity.slice(1)}`)
        }
        if (specs.pageCount) {
          items.push(`Number of Pages: ${specs.pageCount}`)
        }
        if (specs.cmsRequired) {
          items.push('Content Management System (CMS)')
        }
        if (specs.ecommerceIntegration) {
          items.push('E-commerce Integration')
        }
        if (specs.customIntegrations?.length) {
          items.push(`Custom Integrations: ${specs.customIntegrations.join(', ')}`)
        }
        break

      case 'ai-website':
        if (specs.aiWebsiteType) {
          items.push(`AI Website Type: ${specs.aiWebsiteType.charAt(0).toUpperCase() + specs.aiWebsiteType.slice(1)}`)
        }
        if (specs.aiPageCount) {
          items.push(`Number of Pages: ${specs.aiPageCount}`)
        }
        break

      case 'maintenance':
        if (specs.hostingTier) {
          items.push(`Hosting Tier: ${specs.hostingTier.charAt(0).toUpperCase() + specs.hostingTier.slice(1)}`)
        }
        if (specs.technicalSupport) {
          items.push(`Support Level: ${specs.technicalSupport}`)
        }
        if (specs.contentUpdates) {
          items.push('Content Updates Included')
        }
        if (specs.performanceMonitoring) {
          items.push('Performance Monitoring')
        }
        break

      default:
        // Generic specification display
        Object.entries(specs).forEach(([key, value]) => {
          if (value && typeof value === 'string') {
            items.push(`${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`)
          } else if (value === true) {
            items.push(key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))
          }
        })
    }

    return items
  }

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Header with Partner Branding */}
      <div className="border-b-2 border-blue-600 pb-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            {showPartnerBranding && partnerProfile ? (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {partnerProfile.company_name}
                </h1>
                <p className="text-gray-600">{partnerProfile.contact_email}</p>
                {partnerProfile.custom_domain && (
                  <p className="text-gray-600">{partnerProfile.custom_domain}</p>
                )}
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  App Suite
                </h1>
                <p className="text-gray-600">Professional Development Services</p>
              </>
            )}
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-blue-600">QUOTE</h2>
            {quote.id && (
              <p className="text-gray-600">Quote #{quote.id}</p>
            )}
            <p className="text-gray-600">Date: {formatDate(new Date())}</p>
            <p className="text-gray-600">Valid Until: {formatDate(getExpirationDate())}</p>
          </div>
        </div>
      </div>

      {/* Client Information */}
      {clientInfo && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Quote For:</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">{clientInfo.name}</p>
            {clientInfo.company && <p>{clientInfo.company}</p>}
            <p>{clientInfo.email}</p>
            {clientInfo.phone && <p>{clientInfo.phone}</p>}
          </div>
        </div>
      )}

      {/* Service Details */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Service Details</h3>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-semibold">{quote.serviceName || quote.serviceType}</h4>
                {partnerProfile?.discount_tier && (
                  <Badge className="mt-2">
                    {partnerProfile.discount_tier.name} Partner - {quote.discount}% Discount
                  </Badge>
                )}
              </div>
            </div>

            {/* Specifications */}
            <div className="mb-6">
              <h5 className="font-medium mb-3">Included Features:</h5>
              <ul className="space-y-2">
                {renderSpecifications().map((spec, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Notes */}
            {quote.notes && (
              <div className="mb-6">
                <h5 className="font-medium mb-2">Additional Notes:</h5>
                <p className="text-gray-700">{quote.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pricing Breakdown */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Pricing</h3>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Standard Price:</span>
                <span className="text-gray-600">${quote.standardPrice.toLocaleString()}</span>
              </div>
              
              {quote.discount > 0 && (
                <>
                  <div className="flex justify-between items-center text-green-600">
                    <span>Partner Discount ({quote.discount}%):</span>
                    <span>-${(quote.standardPrice - quote.partnerPrice).toLocaleString()}</span>
                  </div>
                  <hr />
                </>
              )}
              
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Investment:</span>
                <span className="text-blue-600">${quote.partnerPrice.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Terms and Conditions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Terms & Conditions</h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p>• This quote is valid for 30 days from the date issued.</p>
          <p>• 50% deposit required to begin work, remaining balance due upon completion.</p>
          <p>• Timeline and deliverables will be confirmed in a separate Statement of Work.</p>
          <p>• All work includes standard revisions and testing.</p>
          <p>• Additional features or changes may incur extra costs.</p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Ready to Get Started?</h3>
        <p className="mb-4">
          We're excited to work with you on this project. To proceed:
        </p>
        <ol className="list-decimal list-inside space-y-2 mb-4">
          <li>Review this quote and let us know if you have any questions</li>
          <li>Reply with your approval to move forward</li>
          <li>We'll send a detailed Statement of Work for your signature</li>
          <li>Upon signed agreement and deposit, we'll begin development</li>
        </ol>
        <p className="text-sm text-gray-600">
          Contact us at {showPartnerBranding && partnerProfile ? partnerProfile.contact_email : 'contact@app-suite.io'} 
          {' '}or reply to this quote with any questions.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
        <p>
          {showPartnerBranding && partnerProfile ? (
            `Generated by ${partnerProfile.company_name} • Powered by App Suite Partner Portal`
          ) : (
            'App Suite • Professional Development Services'
          )}
        </p>
      </div>
    </div>
  )
}