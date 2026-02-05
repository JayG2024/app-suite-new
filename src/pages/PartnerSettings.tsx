/**
 * Partner Settings Page
 * 
 * Comprehensive settings page for partners including:
 * - Profile management
 * - Branding configuration
 * - Domain management
 * - Account preferences
 */

import React, { useState } from 'react'
import { usePartnerAuth } from '@/contexts/PartnerAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Palette, Globe, User, Bell } from 'lucide-react'
import PartnerBrandingConfig from '@/components/PartnerBrandingConfig'
import PartnerDomainManager from '@/components/PartnerDomainManager'

export default function PartnerSettings() {
  const { partnerProfile } = usePartnerAuth()
  const [activeTab, setActiveTab] = useState('profile')

  if (!partnerProfile) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              Loading partner profile...
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Partner Settings
        </h1>
        <p className="text-gray-600">
          Manage your partner profile, branding, and portal configuration
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="domains" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Domains
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Partner Profile</CardTitle>
              <CardDescription>
                View and manage your partner account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Company Name</label>
                  <p className="text-lg">{partnerProfile.company_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Contact Email</label>
                  <p className="text-lg">{partnerProfile.contact_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Account Status</label>
                  <p className="text-lg capitalize">{partnerProfile.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Discount Tier</label>
                  <p className="text-lg">{partnerProfile.discount_tier?.name || 'Standard'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Branding Level</label>
                  <p className="text-lg capitalize">{partnerProfile.branding_level?.replace('-', ' ')}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  To update your profile information, please contact support.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <PartnerBrandingConfig partnerId={partnerProfile.id} />
        </TabsContent>

        <TabsContent value="domains">
          <PartnerDomainManager partnerId={partnerProfile.id} />
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive updates and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Notification preferences coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
