import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Download, 
  Eye, 
  Save, 
  ArrowLeft, 
  FileText, 
  Palette,
  Building2,
  Mail,
  Phone,
  Globe,
  Image as ImageIcon
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  validateBrandingConfig, 
  generateCustomizedDocument as generateDoc,
  prepareBrandingForDocument,
  type BrandingConfig
} from '@/utils/documentCustomization';

interface Resource {
  id: string;
  title: string;
  category_id: string;
  content_type: string;
  file_path?: string;
  customizable: boolean;
  white_labelable: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  category?: {
    name: string;
  };
}

interface ResourceCustomizerProps {
  resource: Resource;
  partnerId: string;
  onBack: () => void;
}

export const ResourceCustomizer: React.FC<ResourceCustomizerProps> = ({ 
  resource, 
  partnerId, 
  onBack 
}) => {
  const [branding, setBranding] = useState<BrandingConfig>({
    companyName: '',
    tagline: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#10b981',
    socialMedia: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    },
    whiteLabelLevel: 'co-branded'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  useEffect(() => {
    loadExistingCustomization();
  }, [resource.id, partnerId]);

  const loadExistingCustomization = async () => {
    try {
      setLoading(true);

      // Check if there's an existing customization
      // Partner portal tables not in generated types yet, using any cast
      const { data: existingCustomization, error } = await (supabase as any)
        .from('custom_resources')
        .select('*')
        .eq('partner_id', partnerId)
        .eq('base_resource_id', resource.id)
        .single();

      if (existingCustomization && !error) {
        const brandingData = existingCustomization.branding_data as BrandingConfig;
        setBranding(brandingData);
        if (brandingData.logo) {
          setLogoPreview(brandingData.logo);
        }
      }
    } catch (error) {
      console.error('Error loading customization:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Logo file must be smaller than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return logoPreview || null;

    try {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${partnerId}/${resource.id}/logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('partner-assets')
        .upload(fileName, logoFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('partner-assets')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
      return null;
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Upload logo if there's a new one
      const logoUrl = await uploadLogo();
      
      const brandingData: BrandingConfig = {
        ...branding,
        logo: logoUrl || undefined
      };

      // Save or update customization
      // Partner portal tables not in generated types yet, using any cast
      const { error } = await (supabase as any)
        .from('custom_resources')
        .upsert({
          partner_id: partnerId,
          base_resource_id: resource.id,
          branding_data: brandingData,
          white_label_level: branding.whiteLabelLevel,
          customized_content: {} // For future use
        });

      if (error) throw error;

      // Track customization analytics
      await (supabase as any)
        .from('partner_analytics')
        .insert({
          partner_id: partnerId,
          metric_type: 'resource_customization',
          metric_value: 1,
          metadata: {
            resource_id: resource.id,
            resource_title: resource.title,
            white_label_level: branding.whiteLabelLevel
          }
        });

      toast.success('Customization saved successfully!');
    } catch (error) {
      console.error('Error saving customization:', error);
      toast.error('Failed to save customization');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    // In a real implementation, this would generate a preview of the customized document
    toast.info('Preview functionality coming soon!');
  };

  const handleDownloadCustomized = async () => {
    try {
      setLoading(true);
      
      // Validate branding configuration
      const validation = validateBrandingConfig(branding);
      if (!validation.valid) {
        toast.error(validation.errors[0]);
        return;
      }
      
      // Generate customized document with branding applied
      const result = await generateDoc(
        {
          id: resource.id,
          title: resource.title,
          contentType: resource.content_type,
          customizable: resource.customizable,
          whiteLabelable: resource.white_labelable
        },
        branding,
        partnerId
      );
      
      if (!result.success) {
        toast.error(result.error || 'Failed to generate customized document');
        return;
      }
      
      toast.success('Document customization complete!');
      
      // Track download analytics
      await (supabase as any)
        .from('partner_analytics')
        .insert({
          partner_id: partnerId,
          metric_type: 'custom_resource_download',
          metric_value: 1,
          metadata: {
            resource_id: resource.id,
            resource_title: resource.title,
            white_label_level: branding.whiteLabelLevel
          }
        });
      
      // In a real implementation, this would trigger actual document download
      toast.info('Download starting...');
    } catch (error) {
      console.error('Error downloading customized resource:', error);
      toast.error('Failed to download customized resource');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Customize Resource</h2>
            <p className="text-muted-foreground">{resource.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{resource.content_type.toUpperCase()}</Badge>
          {resource.white_labelable && (
            <Badge variant="secondary">White-Label Available</Badge>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Customization Form */}
        <div className="space-y-6">
          {/* White-Label Level */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Branding Level
              </CardTitle>
              <CardDescription>
                Choose how much of your branding to apply
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select 
                value={branding.whiteLabelLevel} 
                onValueChange={(value: 'co-branded' | 'partner-primary' | 'full-white-label') => 
                  setBranding(prev => ({ ...prev, whiteLabelLevel: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="co-branded">
                    Co-Branded (Your logo + App Suite branding)
                  </SelectItem>
                  <SelectItem value="partner-primary">
                    Partner Primary (Your branding prominent)
                  </SelectItem>
                  {resource.white_labelable && (
                    <SelectItem value="full-white-label">
                      Full White-Label (Your branding only)
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>
                Enter your company details for document customization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={branding.companyName}
                  onChange={(e) => setBranding(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <Label htmlFor="tagline">Company Tagline</Label>
                <Input
                  id="tagline"
                  value={branding.tagline || ''}
                  onChange={(e) => setBranding(prev => ({ ...prev, tagline: e.target.value }))}
                  placeholder="Your company's tagline or slogan"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={branding.contactEmail}
                    onChange={(e) => setBranding(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="contact@yourcompany.com"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">Phone Number</Label>
                  <Input
                    id="contactPhone"
                    value={branding.contactPhone || ''}
                    onChange={(e) => setBranding(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={branding.website || ''}
                  onChange={(e) => setBranding(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://yourcompany.com"
                />
              </div>

              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={branding.address || ''}
                  onChange={(e) => setBranding(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Business Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={branding.city || ''}
                    onChange={(e) => setBranding(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="San Francisco"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={branding.state || ''}
                    onChange={(e) => setBranding(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="CA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                  <Input
                    id="zipCode"
                    value={branding.zipCode || ''}
                    onChange={(e) => setBranding(prev => ({ ...prev, zipCode: e.target.value }))}
                    placeholder="94102"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={branding.country || ''}
                    onChange={(e) => setBranding(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="United States"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logo Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Company Logo
              </CardTitle>
              <CardDescription>
                Upload your logo (PNG, JPG, SVG - Max 5MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="cursor-pointer"
                  />
                </div>
                {logoPreview && (
                  <div className="w-16 h-16 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Brand Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Brand Colors
              </CardTitle>
              <CardDescription>
                Define your brand color palette for document styling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={branding.primaryColor}
                      onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={branding.secondaryColor}
                      onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={branding.secondaryColor}
                      onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      placeholder="#64748b"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={branding.accentColor}
                      onChange={(e) => setBranding(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={branding.accentColor}
                      onChange={(e) => setBranding(prev => ({ ...prev, accentColor: e.target.value }))}
                      placeholder="#10b981"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Social Media Links
              </CardTitle>
              <CardDescription>
                Add your social media profiles (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={branding.socialMedia?.linkedin || ''}
                  onChange={(e) => setBranding(prev => ({ 
                    ...prev, 
                    socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
                  }))}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>

              <div>
                <Label htmlFor="twitter">Twitter/X</Label>
                <Input
                  id="twitter"
                  value={branding.socialMedia?.twitter || ''}
                  onChange={(e) => setBranding(prev => ({ 
                    ...prev, 
                    socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                  }))}
                  placeholder="https://twitter.com/yourcompany"
                />
              </div>

              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={branding.socialMedia?.facebook || ''}
                  onChange={(e) => setBranding(prev => ({ 
                    ...prev, 
                    socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                  }))}
                  placeholder="https://facebook.com/yourcompany"
                />
              </div>

              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={branding.socialMedia?.instagram || ''}
                  onChange={(e) => setBranding(prev => ({ 
                    ...prev, 
                    socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                  }))}
                  placeholder="https://instagram.com/yourcompany"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview and Actions */}
        <div className="space-y-6">
          {/* Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview
              </CardTitle>
              <CardDescription>
                See how your customized document will look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50">
                {/* Logo Preview */}
                {logoPreview && (
                  <div className="flex justify-center mb-4">
                    <div className="w-32 h-16 flex items-center justify-center bg-white rounded border">
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                )}
                
                {/* Company Info */}
                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg" style={{ color: branding.primaryColor }}>
                    {branding.companyName || 'Your Company'}
                  </h3>
                  {branding.tagline && (
                    <p className="text-sm text-gray-600 italic mt-1">
                      {branding.tagline}
                    </p>
                  )}
                </div>
                
                {/* Document Title */}
                <div className="text-center mb-4 pb-4 border-b">
                  <p className="text-sm font-medium text-gray-900">
                    {resource.title}
                  </p>
                </div>
                
                {/* Contact Details */}
                <div className="space-y-2 text-xs text-gray-600">
                  {branding.contactEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span>{branding.contactEmail}</span>
                    </div>
                  )}
                  {branding.contactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>{branding.contactPhone}</span>
                    </div>
                  )}
                  {branding.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-3 w-3" />
                      <span>{branding.website}</span>
                    </div>
                  )}
                  {(branding.address || branding.city) && (
                    <div className="flex items-start gap-2">
                      <Building2 className="h-3 w-3 mt-0.5" />
                      <span>
                        {branding.address && `${branding.address}, `}
                        {branding.city && branding.city}
                        {branding.state && `, ${branding.state}`}
                        {branding.zipCode && ` ${branding.zipCode}`}
                        {branding.country && (branding.city || branding.state) && `, ${branding.country}`}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Branding Level Indicator */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <Badge 
                      variant={branding.whiteLabelLevel === 'full-white-label' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {branding.whiteLabelLevel === 'co-branded' && 'Co-branded'}
                      {branding.whiteLabelLevel === 'partner-primary' && 'Partner Primary'}
                      {branding.whiteLabelLevel === 'full-white-label' && 'Full White-Label'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={handlePreview}
              >
                <Eye className="h-4 w-4 mr-2" />
                Full Preview
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleSave}
                disabled={saving || !branding.companyName || !branding.contactEmail}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Customization'}
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleDownloadCustomized}
                disabled={!branding.companyName || !branding.contactEmail}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Customized
              </Button>
            </CardContent>
          </Card>

          {/* Help */}
          <Card>
            <CardHeader>
              <CardTitle>Customization Help</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <div>
                <p className="font-semibold text-foreground mb-1">Co-branded:</p>
                <p>Your logo and company information appear alongside App Suite branding. Best for partners who want to show they're working with a trusted provider.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Partner Primary:</p>
                <p>Your branding is prominent throughout the document with minimal App Suite presence. Ideal for established partners with strong brand recognition.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Full White-Label:</p>
                <p>Only your branding appears - complete brand replacement. Available for white-labelable resources. Perfect for partners who want to present services as their own.</p>
              </div>
              <div className="pt-3 border-t">
                <p className="font-semibold text-foreground mb-1">What gets customized:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Logo replacement in headers/footers</li>
                  <li>Company name and tagline</li>
                  <li>Contact information (email, phone, address)</li>
                  <li>Brand colors for styling</li>
                  <li>Social media links</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};