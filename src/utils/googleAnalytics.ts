// Google Analytics 4 Integration for App Suite
// This file handles GA4 data fetching and tracking

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsData {
  pageViews: number;
  sessions: number;
  users: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{
    page: string;
    views: number;
    uniqueViews: number;
  }>;
  trafficSources: Array<{
    source: string;
    users: number;
    sessions: number;
    percentage: number;
  }>;
  realTimeUsers: number;
}

// Initialize Google Analytics
export const initGA = (measurementId: string) => {
  // Create gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  // Configure GA4
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    // Enhanced ecommerce for tracking proposals and conversions
    custom_map: {
      custom_parameter_1: 'proposal_generated',
      custom_parameter_2: 'demo_booked',
      custom_parameter_3: 'client_signed'
    }
  });

  console.log('✅ Google Analytics 4 initialized');
};

// Track custom events
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      timestamp: new Date().toISOString()
    });
  }
};

// Track proposal generation
export const trackProposalGenerated = (proposalData: {
  company: string;
  value: number;
  type: string;
}) => {
  trackEvent('proposal_generated', {
    event_category: 'Sales',
    event_label: proposalData.company,
    value: proposalData.value,
    custom_parameter_1: proposalData.type
  });
};

// Track demo booking
export const trackDemoBooked = (demoData: {
  company: string;
  source: string;
}) => {
  trackEvent('demo_booked', {
    event_category: 'Sales',
    event_label: demoData.company,
    custom_parameter_2: demoData.source
  });
};

// Track client conversion
export const trackClientConverted = (clientData: {
  company: string;
  value: number;
  package: string;
}) => {
  trackEvent('client_converted', {
    event_category: 'Sales',
    event_label: clientData.company,
    value: clientData.value,
    custom_parameter_3: clientData.package
  });
};

// Track page views
export const trackPageView = (page: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID || '', {
      page_title: title,
      page_location: window.location.href,
      page_path: page
    });
  }
};

// Mock data for development (when GA is not connected)
export const getMockAnalyticsData = (): AnalyticsData => ({
  pageViews: 12540,
  sessions: 8420,
  users: 6180,
  bounceRate: 45.2,
  avgSessionDuration: 185, // seconds
  topPages: [
    { page: '/', views: 3420, uniqueViews: 2180 },
    { page: '/get-started', views: 1840, uniqueViews: 1520 },
    { page: '/pricing', views: 1620, uniqueViews: 1380 },
    { page: '/about', views: 980, uniqueViews: 820 },
    { page: '/contact', views: 760, uniqueViews: 640 }
  ],
  trafficSources: [
    { source: 'Direct', users: 2470, sessions: 3680, percentage: 43.7 },
    { source: 'Google Organic', users: 1850, sessions: 2520, percentage: 29.9 },
    { source: 'Social Media', users: 920, sessions: 1240, percentage: 14.7 },
    { source: 'Referral', users: 610, sessions: 740, percentage: 8.8 },
    { source: 'Email', users: 230, sessions: 240, percentage: 2.9 }
  ],
  realTimeUsers: 23
});

// Fetch real GA4 data (requires Google Analytics Reporting API)
export const fetchGoogleAnalyticsData = async (
  startDate = '30daysAgo',
  endDate = 'today'
): Promise<AnalyticsData> => {
  try {
    // In production, this would call Google Analytics Reporting API
    // For now, return mock data
    console.log('📊 Fetching Google Analytics data...');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return getMockAnalyticsData();
  } catch (error) {
    console.error('❌ Failed to fetch Google Analytics data:', error);
    return getMockAnalyticsData();
  }
};

// Social Media Tracking Integration
export interface SocialMediaData {
  platforms: Array<{
    platform: string;
    followers: number;
    engagement: number;
    posts: number;
    reach: number;
  }>;
  totalFollowers: number;
  avgEngagement: number;
}

export const getMockSocialMediaData = (): SocialMediaData => ({
  platforms: [
    { platform: 'LinkedIn', followers: 2450, engagement: 4.2, posts: 15, reach: 8420 },
    { platform: 'Twitter', followers: 1820, engagement: 2.8, posts: 28, reach: 5680 },
    { platform: 'Instagram', followers: 980, engagement: 5.6, posts: 12, reach: 3240 },
    { platform: 'Facebook', followers: 1240, engagement: 3.1, posts: 8, reach: 2180 }
  ],
  totalFollowers: 6490,
  avgEngagement: 3.9
});

// Email Marketing Data
export interface EmailMarketingData {
  campaigns: Array<{
    name: string;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    openRate: number;
    clickRate: number;
    date: string;
  }>;
  totalSent: number;
  avgOpenRate: number;
  avgClickRate: number;
  subscribers: number;
}

export const getMockEmailMarketingData = (): EmailMarketingData => ({
  campaigns: [
    {
      name: 'Custom App Development Newsletter',
      sent: 2840,
      delivered: 2785,
      opened: 982,
      clicked: 156,
      openRate: 35.2,
      clickRate: 5.9,
      date: '2025-06-20'
    },
    {
      name: 'AI-Powered Business Solutions',
      sent: 3120,
      delivered: 3065,
      opened: 1240,
      clicked: 248,
      openRate: 40.4,
      clickRate: 8.1,
      date: '2025-06-15'
    },
    {
      name: 'June Feature Updates',
      sent: 2680,
      delivered: 2642,
      opened: 890,
      clicked: 142,
      openRate: 33.7,
      clickRate: 5.4,
      date: '2025-06-10'
    }
  ],
  totalSent: 8640,
  avgOpenRate: 36.4,
  avgClickRate: 6.5,
  subscribers: 3420
});

// Content Performance Data
export interface ContentData {
  posts: Array<{
    title: string;
    type: 'blog' | 'social' | 'email';
    views: number;
    engagement: number;
    shares: number;
    date: string;
  }>;
  totalViews: number;
  avgEngagement: number;
}

export const getMockContentData = (): ContentData => ({
  posts: [
    {
      title: 'Why Custom Software Beats SaaS for Growing Businesses',
      type: 'blog',
      views: 2840,
      engagement: 8.2,
      shares: 156,
      date: '2025-06-22'
    },
    {
      title: 'AI Integration Success Story - 300% ROI',
      type: 'blog',
      views: 1920,
      engagement: 12.4,
      shares: 89,
      date: '2025-06-20'
    },
    {
      title: 'Stop Paying Monthly Fees - Own Your Software',
      type: 'social',
      views: 4580,
      engagement: 6.8,
      shares: 234,
      date: '2025-06-18'
    },
    {
      title: 'From Idea to Launch in 30 Days',
      type: 'email',
      views: 3240,
      engagement: 15.6,
      shares: 67,
      date: '2025-06-15'
    }
  ],
  totalViews: 12580,
  avgEngagement: 10.8
});