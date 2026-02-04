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

interface BrandingData {
  logo?: string;
  companyName: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  address?: string;
  primaryColor?: string;
  secondaryColor?: string;
  whiteLabelLevel: 'co-branded' | 'partner-primary' | 'full-white-label';
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
  const [branding, setBranding] = useState<BrandingData>({
    companyName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    address: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
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
      const { data: existingCustomization, error } = await supabase
        .from('custom_resources')
        .select('*')
        .eq('partner_id', partnerId)
        .eq('base_resource_id', resource.id)
        .single();

      if (existingCustomization && !error) {
        const brandingData = existingCustomization.branding_data as BrandingData;
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
      
      const brandingData: BrandingData = {
        ...branding,
        logo: logoUrl || undefined
      };

      // Save or update customization
      const { error } = await supabase
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
      await supabase
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
      // In a real implementation, this would generate and download the customized document
      toast.success('Generating customized document...');
      
      // Track download analytics
      await supabase
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
    } catch (error) {
      console.error('Error downloading customized resource:', error);
      toast.error('Failed to download customized resource');
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
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={branding.address || ''}
                  onChange={(e) => setBranding(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Business St, City, State 12345"
                  rows={3}
                />
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
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center bg-gray-50">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  {branding.companyName || 'Your Company'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {resource.title}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  {branding.whiteLabelLevel === 'co-branded' && (
                    <span>Co-branded with App Suite</span>
                  )}
                  {branding.whiteLabelLevel === 'partner-primary' && (
                    <span>Partner branding primary</span>
                  )}
                  {branding.whiteLabelLevel === 'full-white-label' && (
                    <span>Full white-label</span>
                  )}
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
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>Co-branded:</strong> Your logo appears alongside App Suite branding</p>
              <p><strong>Partner Primary:</strong> Your branding is prominent with minimal App Suite presence</p>
              <p><strong>Full White-Label:</strong> Only your branding appears (available for white-labelable resources)</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};