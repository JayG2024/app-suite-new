/**
 * Partner Branding Configuration Component
 * 
 * Allows partners to configure custom branding including logos, colors, and company information.
 * Supports different white-label levels: co-branded, partner-primary, and full white-label.
 */

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Palette, 
  Upload, 
  Eye, 
  Save, 
  AlertTriangle, 
  CheckCircle,
  Image as ImageIcon,
  Type,
  Mail,
  Phone,
  Globe,
  Building
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  getBrandingConfig,
  updateBrandingConfig,
  uploadLogo,
  type BrandingConfig,
  type BrandingLevel
} from '@/services/partnerBrandingService'

interface PartnerBrandingConfigProps {
  partnerId: string
}

export default function PartnerBrandingConfig({ partnerId }: PartnerBrandingConfigProps) {
  const [config, setConfig] = useState<BrandingConfig>({
    companyName: '',
    logo: null,
    favicon: null,
    primaryColor: '#1e40af',
    secondaryColor: '#3b82f6',
    accentColor: '#60a5fa',
    fontFamily: 'Inter',
    contactEmail: '',
    contactPhone: '',
    website: '',
    address: '',
    socialMedia: {
      linkedin: '',
      twitter: '',
      facebook: ''
    },
    brandingLevel: 'co-branded'
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [faviconFile, setFaviconFile] = useState<File | null>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadBrandingConfig()
  }, [partnerId])

  const loadBrandingConfig = async () => {
    try {
      setLoading(true)
      const data = await getBrandingConfig(partnerId)
      if (data) {
        setConfig(data)
      }
    } catch (error) {
      console.error('Error loading branding config:', error)
      toast.error('Failed to load branding configuration')
    } finally {
      setLoading(false)
    }
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo file size must be less than 2MB')
      return
    }

    setLogoFile(file)
    setUploadingLogo(true)

    try {
      const logoUrl = await uploadLogo(partnerId, file, 'logo')
      setConfig({ ...config, logo: logoUrl })
      setHasChanges(true)
      toast.success('Logo uploaded successfully')
    } catch (error) {
      console.error('Error uploading logo:', error)
      toast.error('Failed to upload logo')
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size (max 500KB)
    if (file.size > 500 * 1024) {
      toast.error('Favicon file size must be less than 500KB')
      return
    }

    setFaviconFile(file)
    setUploadingFavicon(true)

    try {
      const faviconUrl = await uploadLogo(partnerId, file, 'favicon')
      setConfig({ ...config, favicon: faviconUrl })
      setHasChanges(true)
      toast.success('Favicon uploaded successfully')
    } catch (error) {
      console.error('Error uploading favicon:', error)
      toast.error('Failed to upload favicon')
    } finally {
      setUploadingFavicon(false)
    }
  }

  const handleSave = async () => {
    // Validate required fields
    if (!config.companyName.trim()) {
      toast.error('Company name is required')
      return
    }

    if (!config.contactEmail.trim()) {
      toast.error('Contact email is required')
      return
    }

    setSaving(true)

    try {
      await updateBrandingConfig(partnerId, config)
      setHasChanges(false)
      toast.success('Branding configuration saved successfully')
    } catch (error) {
      console.error('Error saving branding config:', error)
      toast.error('Failed to save branding configuration')
    } finally {
      setSaving(false)
    }
  }

  const handleFieldChange = (field: keyof BrandingConfig, value: any) => {
    setConfig({ ...config, [field]: value })
    setHasChanges(true)
  }

  const handleSocialMediaChange = (platform: string, value: string) => {
    setConfig({
      ...config,
      socialMedia: {
        ...config.socialMedia,
        [platform]: value
      }
    })
    setHasChanges(true)
  }

  const getBrandingLevelDescription = (level: BrandingLevel): string => {
    const descriptions = {
      'co-branded': 'Your branding appears alongside our company branding. Best for partnerships where both brands are visible.',
      'partner-primary': 'Your branding is primary with minimal reference to our company. Ideal for resellers who want their brand front and center.',
      'full-white-label': 'Complete brand replacement. No reference to our company. Perfect for agencies offering services under their own brand.'
    }
    return descriptions[level]
  }

  const getBrandingLevelBadge = (level: BrandingLevel) => {
    const variants = {
      'co-branded': { color: 'bg-blue-500', text: 'Co-Branded' },
      'partner-primary': { color: 'bg-purple-500', text: 'Partner Primary' },
      'full-white-label': { color: 'bg-green-500', text: 'Full White-Label' }
    }
    const variant = variants[level]
    return (
      <Badge className={`${variant.color} text-white`}>
        {variant.text}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">Loading branding configuration...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Branding Configuration
              </CardTitle>
              <CardDescription>
                Customize your portal branding and white-label settings
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Badge variant="outline" className="text-yellow-600">
                  Unsaved Changes
                </Badge>
              )}
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !hasChanges}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="visual">Visual Identity</TabsTrigger>
              <TabsTrigger value="contact">Contact Info</TabsTrigger>
              <TabsTrigger value="white-label">White-Label Level</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    value={config.companyName}
                    onChange={(e) => handleFieldChange('companyName', e.target.value)}
                    placeholder="Your Company Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      type="url"
                      value={config.website}
                      onChange={(e) => handleFieldChange('website', e.target.value)}
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea
                    id="address"
                    value={config.address}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    placeholder="123 Main St, City, State, ZIP"
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="visual" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Company Logo</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      {config.logo ? (
                        <div className="space-y-2">
                          <img
                            src={config.logo}
                            alt="Company Logo"
                            className="max-h-24 mx-auto"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('logo-upload')?.click()}
                            disabled={uploadingLogo}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingLogo ? 'Uploading...' : 'Change Logo'}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById('logo-upload')?.click()}
                            disabled={uploadingLogo}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, SVG (max 2MB)
                          </p>
                        </div>
                      )}
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Favicon</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      {config.favicon ? (
                        <div className="space-y-2">
                          <img
                            src={config.favicon}
                            alt="Favicon"
                            className="h-8 w-8 mx-auto"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('favicon-upload')?.click()}
                            disabled={uploadingFavicon}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingFavicon ? 'Uploading...' : 'Change Favicon'}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('favicon-upload')?.click()}
                            disabled={uploadingFavicon}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingFavicon ? 'Uploading...' : 'Upload Favicon'}
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            ICO, PNG (max 500KB, 32x32px recommended)
                          </p>
                        </div>
                      )}
                      <input
                        id="favicon-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFaviconUpload}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={config.primaryColor}
                        onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                        placeholder="#1e40af"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={config.secondaryColor}
                        onChange={(e) => handleFieldChange('secondaryColor', e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={config.secondaryColor}
                        onChange={(e) => handleFieldChange('secondaryColor', e.target.value)}
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={config.accentColor}
                        onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={config.accentColor}
                        onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                        placeholder="#60a5fa"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <Select
                      value={config.fontFamily}
                      onValueChange={(value) => handleFieldChange('fontFamily', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">
                    Contact Email <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactEmail"
                      type="email"
                      value={config.contactEmail}
                      onChange={(e) => handleFieldChange('contactEmail', e.target.value)}
                      placeholder="contact@yourcompany.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={config.contactPhone}
                      onChange={(e) => handleFieldChange('contactPhone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Social Media Links</Label>
                  <div className="space-y-2">
                    <Input
                      value={config.socialMedia.linkedin}
                      onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                      placeholder="LinkedIn URL"
                    />
                    <Input
                      value={config.socialMedia.twitter}
                      onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                      placeholder="Twitter/X URL"
                    />
                    <Input
                      value={config.socialMedia.facebook}
                      onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                      placeholder="Facebook URL"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="white-label" className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  White-label level determines how your branding appears throughout the portal and in generated documents.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>White-Label Level</Label>
                  <div className="space-y-3">
                    {(['co-branded', 'partner-primary', 'full-white-label'] as BrandingLevel[]).map((level) => (
                      <div
                        key={level}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          config.brandingLevel === level
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleFieldChange('brandingLevel', level)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getBrandingLevelBadge(level)}
                            {config.brandingLevel === level && (
                              <CheckCircle className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getBrandingLevelDescription(level)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert>
                  <AlertDescription>
                    <strong>Current Selection:</strong> {getBrandingLevelBadge(config.brandingLevel)}
                    <br />
                    {getBrandingLevelDescription(config.brandingLevel)}
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Branding Preview</CardTitle>
            <CardDescription>
              See how your branding will appear in the portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="border rounded-lg p-6 space-y-4"
              style={{
                backgroundColor: '#ffffff',
                fontFamily: config.fontFamily
              }}
            >
              {/* Header Preview */}
              <div 
                className="flex items-center justify-between p-4 rounded-lg"
                style={{ backgroundColor: config.primaryColor }}
              >
                {config.logo ? (
                  <img src={config.logo} alt="Logo" className="h-8" />
                ) : (
                  <div className="text-white font-bold">{config.companyName || 'Your Company'}</div>
                )}
                <div className="flex items-center gap-2">
                  <div 
                    className="px-3 py-1 rounded text-sm"
                    style={{ backgroundColor: config.secondaryColor, color: '#ffffff' }}
                  >
                    Dashboard
                  </div>
                  <div 
                    className="px-3 py-1 rounded text-sm"
                    style={{ backgroundColor: config.accentColor, color: '#ffffff' }}
                  >
                    Resources
                  </div>
                </div>
              </div>

              {/* Content Preview */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold" style={{ color: config.primaryColor }}>
                  Welcome to {config.companyName || 'Your Company'} Portal
                </h3>
                <p className="text-sm text-muted-foreground">
                  This is how your branding will appear throughout the partner portal.
                </p>
              </div>

              {/* Button Preview */}
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded text-white font-medium"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded text-white font-medium"
                  style={{ backgroundColor: config.secondaryColor }}
                >
                  Secondary Button
                </button>
              </div>

              {/* Contact Info Preview */}
              {config.contactEmail && (
                <div className="border-t pt-4 mt-4">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" style={{ color: config.primaryColor }} />
                      <span>{config.contactEmail}</span>
                    </div>
                    {config.contactPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" style={{ color: config.primaryColor }} />
                        <span>{config.contactPhone}</span>
                      </div>
                    )}
                    {config.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" style={{ color: config.primaryColor }} />
                        <span>{config.website}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
