import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import { USE_MOCK_DATA, mockAuth, getMockPartnerProfile } from '@/lib/mockPartnerData'

interface PartnerProfile {
  id: string
  email: string
  name: string
  role: string
  company_name: string
  contact_email: string
  discount_tier_id: string
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  white_label_settings: any
  markup_preferences: any
  custom_domain?: string
  branding_level: 'co-branded' | 'partner-primary' | 'full-white-label'
  discount_tier?: {
    name: string
    website_discount: number
    webapp_discount: number
    mobile_app_discount: number
    ai_website_base_discount: number
    ecommerce_discount: number
    maintenance_discount: number
    per_page_discount: number
  }
}

interface PartnerAuthContextType {
  user: User | null
  partnerProfile: PartnerProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  isPartner: boolean
  isActivePartner: boolean
}

const PartnerAuthContext = createContext<PartnerAuthContextType | undefined>(undefined)

export function PartnerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch partner profile with discount tier information
  const fetchPartnerProfile = async (userId: string) => {
    try {
      // Use mock data if Supabase is not available
      if (USE_MOCK_DATA) {
        const mockProfile = getMockPartnerProfile(userId)
        setPartnerProfile(mockProfile)
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) throw profileError

      // Check if user is a partner
      const { data: partnerData, error: partnerError } = await supabase
        .from('partner_profiles')
        .select(`
          *,
          discount_tier:discount_tiers(*)
        `)
        .eq('id', userId)
        .single()

      if (partnerError) {
        // User exists but is not a partner
        setPartnerProfile(null)
        return
      }

      // Combine profile and partner data
      const combinedProfile: PartnerProfile = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        company_name: partnerData.company_name,
        contact_email: partnerData.contact_email,
        discount_tier_id: partnerData.discount_tier_id,
        status: partnerData.status,
        white_label_settings: partnerData.white_label_settings,
        markup_preferences: partnerData.markup_preferences,
        custom_domain: partnerData.custom_domain,
        branding_level: partnerData.branding_level,
        discount_tier: partnerData.discount_tier
      }

      setPartnerProfile(combinedProfile)
    } catch (error) {
      console.error('Error fetching partner profile:', error)
      setPartnerProfile(null)
    }
  }

  // Initialize auth state
  useEffect(() => {
    // Use mock data if Supabase is not available
    if (USE_MOCK_DATA) {
      const initMockAuth = async () => {
        const { data } = await mockAuth.getSession()
        if (data.session?.user) {
          setUser(data.session.user)
          await fetchPartnerProfile(data.session.user.id)
        }
        setLoading(false)
      }
      initMockAuth()
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchPartnerProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Partner auth state change:', event)
      
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setPartnerProfile(null)
      } else if (session?.user) {
        setUser(session.user)
        await fetchPartnerProfile(session.user.id)
      } else {
        setUser(null)
        setPartnerProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      // Use mock data if Supabase is not available
      if (USE_MOCK_DATA) {
        const { data, error } = await mockAuth.signIn(email, password)
        if (error) throw error
        
        if (data.user) {
          setUser(data.user)
          await fetchPartnerProfile(data.user.id)
        }
        
        return { error: null }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        await fetchPartnerProfile(data.user.id)
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    try {
      // Use mock data if Supabase is not available
      if (USE_MOCK_DATA) {
        await mockAuth.signOut()
        setUser(null)
        setPartnerProfile(null)
        return
      }

      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setPartnerProfile(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    partnerProfile,
    loading,
    signIn,
    signOut,
    isPartner: partnerProfile !== null,
    isActivePartner: partnerProfile?.status === 'active',
  }

  return <PartnerAuthContext.Provider value={value}>{children}</PartnerAuthContext.Provider>
}

export function usePartnerAuth() {
  const context = useContext(PartnerAuthContext)
  if (context === undefined) {
    throw new Error('usePartnerAuth must be used within a PartnerAuthProvider')
  }
  return context
}