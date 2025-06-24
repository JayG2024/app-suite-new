import { APP_CONFIG } from '@/config/app';

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: object;
}

export interface PageSEO {
  [key: string]: SEOData;
}

// Function to get SEO data with dynamic URLs
const getPageSEOData = (): PageSEO => ({
  '/': {
    title: 'App Suite - Custom AI-Powered Business Applications | $5,000 Flat Rate',
    description: 'Stop paying monthly SaaS fees. Get custom business applications built from scratch for $5,000 flat rate. ChatGPT/Claude integration, 30-day delivery, you own the code. No subscriptions, no hidden costs.',
    keywords: 'custom business applications, AI software development, flat rate pricing, business automation, custom CRM, finance apps, operations tools, 14 day delivery, ChatGPT integration, Claude integration, own your software',
    ogTitle: 'App Suite - Custom Business Applications at Flat Rate Pricing',
    ogDescription: 'Custom AI-powered business applications delivered in 30 days. Finance, CRM, Operations & Marketing solutions. $5,000 flat rate, no hidden costs.',
    ogImage: '${APP_CONFIG.url}/images/og-image.jpg',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "App Suite",
      "description": "Custom AI-powered business applications at flat-rate pricing",
      "url": "${APP_CONFIG.url}",
      "provider": {
        "@type": "Organization",
        "name": "Jaydus Inc",
        "url": "https://jaydus.ai"
      },
      "offers": {
        "@type": "Offer",
        "price": "5000",
        "priceCurrency": "USD",
        "description": "Full custom business application"
      }
    }
  },
  '/about': {
    title: 'About App Suite - Custom Application Development Company',
    description: 'App Suite builds custom business applications you own completely. Founded by developers tired of seeing businesses pay endless SaaS subscriptions. $5,000-$10,000 flat rates, 30-day delivery, AI-powered development.',
    keywords: 'about app suite, custom software company, AI development team, business application developers, jaydus inc',
    ogTitle: 'About App Suite - Custom Application Development Experts',
    ogDescription: 'Specialists in custom AI-powered business applications. 2-week delivery, flat-rate pricing, comprehensive support.'
  },
  '/contact': {
    title: 'Contact App Suite - Get Your Custom Application Built',
    description: 'Ready to stop renting software? Schedule a free 30-minute consultation. Discuss your needs, get a flat-rate quote, start building in days. Contact: (833) APP-SUIT or jason@jaydus.ai.',
    keywords: 'contact app suite, free consultation, custom application quote, business software consultation, app development contact',
    ogTitle: 'Contact App Suite - Free Consultation Available',
    ogDescription: 'Get a free consultation for your custom business application. Professional support available 24/7.'
  },
  '/finance-apps': {
    title: 'Custom Finance Applications - AI-Powered Financial Tools',
    description: 'Replace QuickBooks, FreshBooks, and expensive finance software. Get custom AI-powered finance applications: invoice automation, budget analysis, forecasting. $5,000 flat rate, own it forever.',
    keywords: 'custom finance applications, AI invoice generator, budget analyzer, financial forecasting software, accounting automation',
    ogTitle: 'Custom Finance Applications - AI-Powered Financial Tools',
    ogDescription: 'AI Invoice Generator, Budget Analyzer, Financial Forecaster. Custom finance applications built in 30 days.'
  },
  '/customer-management': {
    title: 'Custom CRM Applications - Replace Salesforce & HubSpot',
    description: 'Stop paying for Salesforce or HubSpot. Get a custom CRM built for your exact workflow. AI-powered customer insights, automated follow-ups, pipeline management. $5,000-$7,500 flat rate.',
    keywords: 'custom CRM applications, AI CRM manager, customer insights software, feedback analyzer, customer management system',
    ogTitle: 'Custom CRM Applications - AI-Powered Customer Management',
    ogDescription: 'AI CRM Manager, Customer Insights, Feedback Analyzer. Custom customer management solutions.'
  },
  '/operations-tools': {
    title: 'Custom Operations Tools - Automate Your Business Workflows',
    description: 'Replace Monday.com, Asana, and workflow tools. Custom operations software built for your processes. AI optimization, resource planning, automated workflows. Own it for $5,000-$10,000.',
    keywords: 'custom operations tools, workflow optimizer, resource allocator, supply chain management, operations automation',
    ogTitle: 'Custom Operations Tools - Workflow & Resource Management',
    ogDescription: 'Workflow Optimizer, Resource Allocator, Supply Chain Manager. Custom operations tools for efficiency.'
  },
  '/marketing-solutions': {
    title: 'Custom Marketing Applications - AI-Powered Marketing Tools',
    description: 'Replace Mailchimp, Hootsuite, and marketing subscriptions. Custom marketing automation with ChatGPT/Claude content generation, campaign analytics, social scheduling. One-time $7,500 investment.',
    keywords: 'custom marketing applications, content generator, campaign analyzer, market research tools, marketing automation',
    ogTitle: 'Custom Marketing Applications - AI-Powered Marketing Tools',
    ogDescription: 'Content Generator, Campaign Analyzer, Market Researcher. Custom marketing applications with AI.'
  },
  '/pricing': {
    title: 'App Suite Pricing - Transparent Flat Rates | No Monthly Fees',
    description: 'Simple pricing: $5,000 Standard, $7,500 AI-Enhanced, $10,000 Enterprise. One-time payment, you own everything. Includes development, deployment, documentation, 30-day guarantee. No subscriptions ever.',
    keywords: 'app suite pricing, flat rate pricing, custom application cost, $5000 applications, $2500 mini tools, no hidden costs',
    ogTitle: 'App Suite Pricing - Transparent Flat-Rate Pricing',
    ogDescription: '$5,000 full applications, $2,500 mini tools. No hidden costs, includes everything.'
  },
  '/blog': {
    title: 'App Suite Blog - Custom Application Development Insights',
    description: 'Expert insights on custom application development, AI integration, business automation, and software best practices. Latest industry trends.',
    keywords: 'custom application blog, AI development insights, business automation trends, software development best practices',
    ogTitle: 'App Suite Blog - Development Insights & Industry Trends',
    ogDescription: 'Expert insights on custom application development, AI integration, and business automation.'
  },
  '/help-center': {
    title: 'App Suite Help Center - Support & Documentation',
    description: 'Comprehensive help center with FAQs, guides, and support for App Suite clients. Get answers to common questions and technical support.',
    keywords: 'app suite support, help center, FAQ, documentation, technical support, customer service',
    ogTitle: 'App Suite Help Center - Complete Support Resources',
    ogDescription: 'Comprehensive help center with FAQs, guides, and 24/7 support for all your questions.'
  },
  '/documentation': {
    title: 'App Suite Documentation - Development Process & Client Guides',
    description: 'Complete documentation for App Suite clients including development process, onboarding guides, and project management information.',
    keywords: 'app suite documentation, development process, client onboarding, project management, integration guides',
    ogTitle: 'App Suite Documentation - Complete Client Resources',
    ogDescription: 'Complete documentation covering our development process, client onboarding, and project management.'
  },
  '/roi-calculator': {
    title: 'ROI Calculator - Calculate Your Custom Application Investment Return',
    description: 'Calculate the return on investment for your custom business application. See potential savings and efficiency gains from automation.',
    keywords: 'ROI calculator, custom application ROI, business automation savings, software investment calculator',
    ogTitle: 'ROI Calculator - Calculate Your Application Investment Return',
    ogDescription: 'Calculate potential savings and ROI from your custom business application investment.'
  },
  '/apps': {
    title: 'All Business Applications - Finance, CRM, Operations & Marketing',
    description: 'Browse our complete suite of custom business applications. AI-powered tools for finance, customer management, operations, and marketing. $5,000 flat rate.',
    keywords: 'business applications, custom software suite, AI applications, finance apps, CRM tools, operations software, marketing automation',
    ogTitle: 'All Business Applications - Complete App Suite Portfolio',
    ogDescription: 'Browse AI-powered business applications for finance, CRM, operations, and marketing. Custom built in 30 days.'
  },
  '/get-started': {
    title: 'Get Started - Build Your Custom Business Application Today',
    description: 'Ready to own your software? Start here: 1) Free consultation call 2) Get flat-rate quote 3) Development begins 4) Launch in 30 days. No contracts, no subscriptions, just results.',
    keywords: 'get started, custom application development, free consultation, quick start guide, business app builder',
    ogTitle: 'Get Started - Build Your Custom Application Today',
    ogDescription: 'Start your custom business application journey. Free consultation, 2-week delivery, transparent pricing.'
  },
  '/price-calculator': {
    title: 'Price Calculator - Get Instant Custom Application Quote',
    description: 'Calculate the exact cost of your custom business application. Transparent pricing based on features, integrations, and complexity. No hidden fees.',
    keywords: 'price calculator, custom application cost, software pricing tool, instant quote, transparent pricing',
    ogTitle: 'Price Calculator - Instant Custom Application Quotes',
    ogDescription: 'Get an instant quote for your custom business application. Transparent pricing with no hidden costs.'
  },
  '/ai-development-process': {
    title: 'AI Development Process - How We Build Your Custom Applications',
    description: 'Learn about our AI-powered development process. From consultation to delivery in 30 days. Agile methodology, continuous integration, quality assurance.',
    keywords: 'AI development process, custom application methodology, agile development, 2 week delivery, software development lifecycle',
    ogTitle: 'AI Development Process - 2-Week Custom Application Delivery',
    ogDescription: 'Discover our AI-powered development process. From consultation to delivery in just 30 days.'
  },
  '/extensions': {
    title: 'App Extensions - Add-ons & Integrations for Your Applications',
    description: 'Browse extensions and integrations for your custom applications. API connectors, third-party integrations, and advanced features.',
    keywords: 'app extensions, software integrations, API connectors, third-party addons, application plugins',
    ogTitle: 'App Extensions - Enhance Your Custom Applications',
    ogDescription: 'Explore extensions and integrations to enhance your custom business applications.'
  },
  '/careers': {
    title: 'Careers at App Suite - Join Our AI Development Team',
    description: 'Join the App Suite team. We\'re hiring developers, designers, and project managers passionate about building custom AI applications.',
    keywords: 'careers app suite, AI developer jobs, software engineering positions, remote work opportunities, tech careers',
    ogTitle: 'Careers at App Suite - Join Our Growing Team',
    ogDescription: 'Build the future of custom business applications. Explore career opportunities at App Suite.'
  },
  '/support': {
    title: 'App Suite Support - 24/7 Technical Assistance',
    description: 'Get technical support for your custom applications. 24/7 emergency support, comprehensive documentation, and dedicated account managers.',
    keywords: 'app suite support, technical assistance, 24/7 support, customer service, application help',
    ogTitle: 'App Suite Support - 24/7 Technical Assistance',
    ogDescription: 'Professional support for all your custom applications. Available 24/7 for emergency assistance.'
  },
  '/sales': {
    title: 'App Suite Sales - Custom Application Consultation',
    description: 'Connect with our sales team for a free consultation. Discuss your requirements, get expert recommendations, and start your project.',
    keywords: 'app suite sales, free consultation, custom application quote, sales contact, business software consultation',
    ogTitle: 'App Suite Sales - Free Consultation Available',
    ogDescription: 'Connect with our sales team for expert consultation on your custom application needs.'
  },
  '/industries': {
    title: 'Industries We Serve - Custom Applications for Every Sector',
    description: 'Custom applications for healthcare, finance, retail, manufacturing, and more. Industry-specific solutions with compliance and best practices.',
    keywords: 'industry solutions, healthcare applications, finance software, retail systems, manufacturing tools, sector-specific apps',
    ogTitle: 'Industries We Serve - Sector-Specific Custom Applications',
    ogDescription: 'Custom applications tailored for your industry. Healthcare, finance, retail, manufacturing, and more.'
  },
  '/technology-partners': {
    title: 'Technology Partners - Our Integration Ecosystem',
    description: 'Our technology partners and integration ecosystem. Seamless connections with leading platforms including AWS, Google Cloud, Microsoft, and more.',
    keywords: 'technology partners, integration ecosystem, AWS partner, Google Cloud, Microsoft Azure, API integrations',
    ogTitle: 'Technology Partners - Integration Ecosystem',
    ogDescription: 'Explore our technology partnerships and integration capabilities with leading platforms.'
  },
  '/newsletter': {
    title: 'App Suite Newsletter - Industry Insights & Updates',
    description: 'Subscribe to our newsletter for custom application insights, AI development trends, and exclusive offers. Monthly updates from App Suite.',
    keywords: 'app suite newsletter, industry insights, AI trends, software updates, email subscription',
    ogTitle: 'App Suite Newsletter - Stay Updated',
    ogDescription: 'Get monthly insights on custom application development, AI trends, and exclusive offers.'
  },
  '/payment-terms': {
    title: 'Payment Terms - Flexible Options for Your Custom Application',
    description: 'Flexible payment terms for your custom application. 50% upfront, 50% on delivery. Monthly payment plans available for qualified businesses.',
    keywords: 'payment terms, flexible payment options, application financing, payment plans, billing information',
    ogTitle: 'Payment Terms - Flexible Payment Options',
    ogDescription: 'Flexible payment terms with 50% upfront, 50% on delivery. Monthly plans available.'
  },
  '/privacy-policy': {
    title: 'Privacy Policy - App Suite Data Protection & Security',
    description: 'App Suite privacy policy. Learn how we protect your data, ensure security, and maintain confidentiality in custom application development.',
    keywords: 'privacy policy, data protection, security measures, GDPR compliance, data confidentiality',
    ogTitle: 'Privacy Policy - Your Data is Protected',
    ogDescription: 'Comprehensive privacy policy outlining our data protection and security measures.'
  },
  '/terms': {
    title: 'Terms of Service - App Suite Agreement & Conditions',
    description: 'App Suite terms of service. Clear terms for custom application development, delivery guarantees, and service agreements.',
    keywords: 'terms of service, service agreement, legal terms, development contract, service conditions',
    ogTitle: 'Terms of Service - Clear & Transparent',
    ogDescription: 'Transparent terms of service for custom application development and support.'
  },
  '/cookie-policy': {
    title: 'Cookie Policy - How App Suite Uses Cookies',
    description: 'App Suite cookie policy. Learn how we use cookies to improve your experience and provide better custom application services.',
    keywords: 'cookie policy, website cookies, privacy settings, cookie preferences, data tracking',
    ogTitle: 'Cookie Policy - Transparency in Data Use',
    ogDescription: 'Learn how App Suite uses cookies to enhance your experience and improve our services.'
  },
  '/system-status': {
    title: 'System Status - App Suite Service Health & Uptime',
    description: 'Real-time system status for App Suite services. Check uptime, performance metrics, and scheduled maintenance.',
    keywords: 'system status, service health, uptime monitoring, performance metrics, maintenance schedule',
    ogTitle: 'System Status - Real-Time Service Health',
    ogDescription: 'Monitor App Suite service health, uptime, and performance in real-time.'
  },
  '/image-generator': {
    title: 'AI Image Generator - Create Custom Graphics for Your Business',
    description: 'Generate custom images for your business using AI. Create logos, marketing materials, and product images instantly.',
    keywords: 'AI image generator, custom graphics, logo creator, marketing images, AI design tool',
    ogTitle: 'AI Image Generator - Instant Custom Graphics',
    ogDescription: 'Create custom business graphics instantly with our AI-powered image generator.'
  },
  '/documentation/quick-start': {
    title: 'Quick Start Guide - Get Started with App Suite in Minutes',
    description: 'Quick start guide for App Suite applications. Learn the basics, set up your first project, and start building in minutes.',
    keywords: 'quick start guide, getting started, app suite tutorial, beginner guide, setup instructions',
    ogTitle: 'Quick Start Guide - Begin Building in Minutes',
    ogDescription: 'Get started with App Suite applications quickly. Step-by-step guide for beginners.'
  },
  '/documentation/installation': {
    title: 'Installation Guide - Deploy Your Custom Applications',
    description: 'Complete installation guide for App Suite applications. Server requirements, deployment options, and configuration steps.',
    keywords: 'installation guide, deployment instructions, server setup, application install, configuration guide',
    ogTitle: 'Installation Guide - Easy Deployment Process',
    ogDescription: 'Step-by-step installation guide for deploying your custom App Suite applications.'
  },
  '/documentation/configuration': {
    title: 'Configuration Guide - Customize Your Applications',
    description: 'Configure your App Suite applications. Environment settings, API keys, database connections, and advanced options.',
    keywords: 'configuration guide, app settings, environment variables, API configuration, database setup',
    ogTitle: 'Configuration Guide - Customize Your Setup',
    ogDescription: 'Complete configuration guide for customizing your App Suite applications.'
  },
  '/documentation/customization': {
    title: 'Customization Guide - Tailor Applications to Your Needs',
    description: 'Customize App Suite applications to match your brand and workflow. UI theming, feature toggles, and business logic modifications.',
    keywords: 'customization guide, UI theming, feature customization, branding options, workflow modification',
    ogTitle: 'Customization Guide - Make It Your Own',
    ogDescription: 'Learn how to customize App Suite applications to perfectly match your business needs.'
  },
  '/documentation/integrations': {
    title: 'Integration Guide - Connect with Third-Party Services',
    description: 'Integrate App Suite with your existing tools. API integrations, webhooks, data sync, and third-party service connections.',
    keywords: 'integration guide, API integrations, third-party services, webhooks, data synchronization',
    ogTitle: 'Integration Guide - Seamless Connections',
    ogDescription: 'Connect App Suite applications with your existing tools and third-party services.'
  },
  '/documentation/ai-capabilities': {
    title: 'AI Capabilities - Leverage Artificial Intelligence',
    description: 'Explore AI capabilities in App Suite applications. Natural language processing, predictive analytics, and intelligent automation.',
    keywords: 'AI capabilities, machine learning, natural language processing, predictive analytics, intelligent automation',
    ogTitle: 'AI Capabilities - Power of Artificial Intelligence',
    ogDescription: 'Discover how AI powers App Suite applications with intelligent features and automation.'
  },
  '/documentation/security': {
    title: 'Security Guide - Enterprise-Grade Protection',
    description: 'Security features and best practices for App Suite applications. Encryption, authentication, compliance, and data protection.',
    keywords: 'security guide, data protection, encryption, authentication, compliance, security best practices',
    ogTitle: 'Security Guide - Enterprise-Grade Protection',
    ogDescription: 'Learn about security features and best practices in App Suite applications.'
  },
  '/documentation/client-onboarding': {
    title: 'Client Onboarding - Smooth Project Kickoff',
    description: 'Client onboarding process for App Suite projects. Requirements gathering, timeline planning, and communication protocols.',
    keywords: 'client onboarding, project kickoff, requirements gathering, timeline planning, communication guide',
    ogTitle: 'Client Onboarding - Smooth Project Start',
    ogDescription: 'Complete guide to the App Suite client onboarding process for successful projects.'
  },
  '/documentation/process': {
    title: 'Development Process - From Concept to Delivery',
    description: 'App Suite development process explained. Agile methodology, sprint planning, quality assurance, and delivery procedures.',
    keywords: 'development process, agile methodology, sprint planning, quality assurance, project delivery',
    ogTitle: 'Development Process - Transparent Workflow',
    ogDescription: 'Understand the App Suite development process from initial concept to final delivery.'
  },
  '/documentation/delivery': {
    title: 'Delivery Guide - Launch Your Application Successfully',
    description: 'Application delivery and launch guide. Final testing, deployment procedures, training materials, and post-launch support.',
    keywords: 'delivery guide, application launch, deployment procedures, training materials, post-launch support',
    ogTitle: 'Delivery Guide - Successful Application Launch',
    ogDescription: 'Complete guide to App Suite application delivery and successful launch procedures.'
  },
  '/solutions-weve-built': {
    title: 'Solutions We\'ve Built - Custom Application Portfolio & Examples',
    description: 'Explore real custom applications we\'ve built for clients. Finance tools, CRM systems, operations apps, and marketing solutions. See what\'s possible.',
    keywords: 'custom application examples, app portfolio, client solutions, case studies, business application showcase',
    ogTitle: 'Solutions We\'ve Built - Real Custom Application Examples',
    ogDescription: 'Explore custom applications we\'ve built: finance tools, CRM systems, operations apps, and marketing solutions.'
  },
  '/blog/generative-engine-optimization-complete-guide-2025': {
    title: 'Generative Engine Optimization (GEO): Complete Guide 2025 | App Suite',
    description: 'Master GEO: 58% of users now use AI for search. This guide shows how to optimize for ChatGPT, Claude, Perplexity, and Google AI. Includes implementation framework, platform strategies, ROI metrics. 45-min read.',
    keywords: 'generative engine optimization, GEO, AI search, ChatGPT optimization, Google AI Overviews, Perplexity, AI search visibility, business strategy',
    ogTitle: 'Complete Guide to Generative Engine Optimization (GEO) - 2025',
    ogDescription: 'Strategic white paper on AI search optimization. Early adopters achieve 150-200% ROI. Learn ChatGPT, Perplexity, and Google AI Overviews optimization.',
    ogImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Generative Engine Optimization (GEO): The Complete Guide to AI Search Visibility in 2025",
      "author": {
        "@type": "Person",
        "name": "Jason Gordon"
      },
      "publisher": {
        "@type": "Organization",
        "name": "App Suite",
        "logo": {
          "@type": "ImageObject",
          "url": "${APP_CONFIG.url}/images/logo.png"
        }
      },
      "datePublished": "2025-06-20",
      "dateModified": "2025-06-20",
      "description": "The comprehensive strategic guide to optimizing for AI search engines like ChatGPT, Google AI Overviews, and Perplexity.",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${APP_CONFIG.url}/blog/generative-engine-optimization-complete-guide-2025"
      },
      "image": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200",
      "wordCount": 8500,
      "articleSection": "Strategic Research",
      "genre": "White Paper",
      "keywords": ["generative engine optimization", "GEO", "AI search", "ChatGPT optimization", "Google AI Overviews", "Perplexity", "business strategy"]
    }
  },
  '/blog/hidden-cost-geo-blocking-ai-search-visibility': {
    title: 'Geo-Blocking Hurts AI Search: 95% of AI Crawlers Blocked | App Suite Research',
    description: 'Critical finding: 95% of AI crawlers (ChatGPT, Claude, Perplexity) blocked by geo-restrictions. White paper reveals why geographic blocking destroys AI search visibility and GEO performance. Solutions included.',
    keywords: 'website accessibility, geo-blocking, AI search visibility, GEO, generative engine optimization, AI crawlers, search optimization',
    ogTitle: 'White Paper: Website Accessibility & AI Search Visibility',
    ogDescription: 'Research reveals 95% of AI crawlers are blocked by geo-restrictions. Learn why geo-blocking may hurt your AI search visibility.',
    ogImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "The Hidden Cost of Geo-Blocking: How Geographic Restrictions May Be Hurting Your AI Search Visibility",
      "author": {
        "@type": "Person",
        "name": "Jason Gordon"
      },
      "publisher": {
        "@type": "Organization",
        "name": "App Suite",
        "logo": {
          "@type": "ImageObject",
          "url": "${APP_CONFIG.url}/images/logo.png"
        }
      },
      "datePublished": "2025-06-17",
      "dateModified": "2025-06-17",
      "description": "A comprehensive white paper exploring how geo-blocking affects AI search visibility and Generative Engine Optimization (GEO) in 2025.",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${APP_CONFIG.url}/blog/hidden-cost-geo-blocking-ai-search-visibility"
      },
      "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200"
    }
  },
  '/blog/google-business-profile-consolidation': {
    title: 'How to Merge Google Business Profiles Without Losing Reviews | App Suite Guide',
    description: 'Step-by-step guide: Merge duplicate Google Business Profiles, preserve all reviews, avoid common pitfalls. Includes Google support templates, verification tips, 18-minute implementation guide.',
    keywords: 'Google Business Profile, GBP consolidation, local SEO, business profile merger, Google My Business, online presence',
    ogTitle: 'Google Business Profile Consolidation: Complete Strategic Guide',
    ogDescription: 'Master the complex process of merging Google Business Profiles while preserving valuable reviews.',
    ogImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=1200',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Strategic Consolidation of Google Business Profiles: Unifying Your Online Presence",
      "author": {
        "@type": "Person",
        "name": "Jason Gordon"
      },
      "publisher": {
        "@type": "Organization",
        "name": "App Suite",
        "logo": {
          "@type": "ImageObject",
          "url": "${APP_CONFIG.url}/images/logo.png"
        }
      },
      "datePublished": "2025-06-05",
      "dateModified": "2025-06-05",
      "description": "Master the complex process of merging Google Business Profiles while preserving valuable reviews.",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${APP_CONFIG.url}/blog/google-business-profile-consolidation"
      },
      "image": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=1200"
    }
  },
  '/blog/openai-models-guide': {
    title: 'OpenAI Models Explained: GPT-4.1, o3, o4-mini Comparison Guide | App Suite',
    description: 'Which OpenAI model for your use case? Compare GPT-4.1 vs o3 vs o4-mini. Performance benchmarks, pricing, selection flowchart. Updated May 2025 with latest models and real cost analysis.',
    keywords: 'OpenAI models, GPT-4, AI model comparison, OpenAI guide, artificial intelligence, machine learning models',
    ogTitle: 'Complete Guide to OpenAI Models - Performance & Selection',
    ogDescription: 'Navigate OpenAI\'s complete model ecosystem with performance comparisons, selection strategies, and real-world applications.',
    ogImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Making Sense of OpenAI Models – The Complete Guide (May 30, 2025)",
      "author": {
        "@type": "Person",
        "name": "Jason Gordon"
      },
      "publisher": {
        "@type": "Organization",
        "name": "App Suite",
        "logo": {
          "@type": "ImageObject",
          "url": "${APP_CONFIG.url}/images/logo.png"
        }
      },
      "datePublished": "2025-05-30",
      "dateModified": "2025-05-30",
      "description": "Navigate OpenAI's complete model ecosystem with our comprehensive guide covering performance comparisons, selection strategies, and real-world applications.",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${APP_CONFIG.url}/blog/openai-models-guide"
      },
      "image": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200"
    }
  }
});

// Export the SEO data
export const pageSEOData = getPageSEOData();

export const defaultSEO: SEOData = {
  title: 'App Suite - Custom Business Applications at Flat Rate',
  description: 'Custom AI-powered business applications built in 30 days. Finance, CRM, Operations & Marketing solutions. Flat-rate pricing, no hidden costs.',
  keywords: 'custom business applications, AI software development, flat rate pricing, business automation',
  ogTitle: 'App Suite - Custom Business Applications',
  ogDescription: 'Custom AI-powered business applications built in 2 weeks at flat-rate pricing.',
  ogImage: `${APP_CONFIG.url}/images/og-image.jpg`,
  ogType: 'website',
  twitterCard: 'summary_large_image'
};

export function getSEOData(pathname: string): SEOData {
  return pageSEOData[pathname] || defaultSEO;
}

export function updatePageSEO(seoData: SEOData): void {
  // Update document title
  document.title = seoData.title;

  // Update meta description
  updateMetaTag('description', seoData.description);
  
  // Update meta keywords
  updateMetaTag('keywords', seoData.keywords);
  
  // Update canonical URL
  if (seoData.canonical) {
    updateLinkTag('canonical', seoData.canonical);
  }
  
  // Update Open Graph tags
  updateMetaTag('og:title', seoData.ogTitle || seoData.title);
  updateMetaTag('og:description', seoData.ogDescription || seoData.description);
  updateMetaTag('og:image', seoData.ogImage || defaultSEO.ogImage);
  updateMetaTag('og:type', seoData.ogType || 'website');
  updateMetaTag('og:url', window.location.href);
  
  // Update Twitter Card tags
  updateMetaTag('twitter:card', seoData.twitterCard || 'summary_large_image');
  updateMetaTag('twitter:title', seoData.twitterTitle || seoData.ogTitle || seoData.title);
  updateMetaTag('twitter:description', seoData.twitterDescription || seoData.ogDescription || seoData.description);
  updateMetaTag('twitter:image', seoData.twitterImage || seoData.ogImage || defaultSEO.ogImage);
  
  // Update structured data
  if (seoData.structuredData) {
    updateStructuredData(seoData.structuredData);
  }
}

function updateMetaTag(property: string, content: string): void {
  if (!content) return;
  
  let metaTag = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`) as HTMLMetaElement;
  
  if (!metaTag) {
    metaTag = document.createElement('meta');
    if (property.startsWith('og:') || property.startsWith('twitter:')) {
      metaTag.setAttribute('property', property);
    } else {
      metaTag.setAttribute('name', property);
    }
    document.head.appendChild(metaTag);
  }
  
  metaTag.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string): void {
  if (!href) return;
  
  let linkTag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!linkTag) {
    linkTag = document.createElement('link');
    linkTag.setAttribute('rel', rel);
    document.head.appendChild(linkTag);
  }
  
  linkTag.setAttribute('href', href);
}

function updateStructuredData(data: object): void {
  let structuredDataScript = document.querySelector('script[type="application/ld+json"]');
  
  if (!structuredDataScript) {
    structuredDataScript = document.createElement('script');
    structuredDataScript.setAttribute('type', 'application/ld+json');
    document.head.appendChild(structuredDataScript);
  }
  
  structuredDataScript.textContent = JSON.stringify(data);
}

// SEO-friendly URL generation
export function generateSEOFriendlyURL(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Generate breadcrumb schema
export function generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
}

// Local business schema for App Suite
export function generateLocalBusinessSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "App Suite by Jaydus Inc",
    "image": "${APP_CONFIG.url}/images/logo.png",
    "description": "Custom AI-powered business applications at flat-rate pricing",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "651 N. Broad St.",
      "addressLocality": "Middletown",
      "addressRegion": "DE",
      "postalCode": "19709",
      "addressCountry": "US"
    },
    "telephone": "+1-833-APP-SUIT",
    "email": "jason@jaydus.ai",
    "url": "${APP_CONFIG.url}",
    "priceRange": "$5,000 - $10,000",
    "openingHours": "Mo-Fr 09:00-18:00",
    "sameAs": [
      "https://facebook.com/jaydus",
      "https://twitter.com/jaydus_ai",
      "https://linkedin.com/company/jaydus"
    ],
    "service": [
      {
        "@type": "Service",
        "name": "Custom Business Application Development",
        "description": "AI-powered custom business applications built in 30 days"
      }
    ],
    "knowsAbout": [
      "AI Integration",
      "Custom Software Development",
      "Business Process Automation",
      "ChatGPT Integration",
      "Claude Integration",
      "Enterprise Solutions"
    ]
  };
}

// Product schema for App Suite offerings
export function generateProductSchema(productName: string, description: string, price: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "description": description,
    "brand": {
      "@type": "Brand",
      "name": "App Suite"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Jaydus Inc"
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "App Suite"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "50",
      "bestRating": "5"
    }
  };
}

// Software Application schema
export function generateSoftwareApplicationSchema(appName: string, description: string, category: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": appName,
    "description": description,
    "applicationCategory": category,
    "operatingSystem": "Web Browser",
    "provider": {
      "@type": "Organization",
      "name": "App Suite",
      "url": "${APP_CONFIG.url}"
    },
    "offers": {
      "@type": "Offer",
      "price": "5000",
      "priceCurrency": "USD"
    },
    "featureList": [
      "AI-Powered Automation",
      "Custom Business Logic",
      "Real-time Analytics",
      "Secure Cloud Hosting",
      "24/7 Support"
    ]
  };
}

// FAQ Page schema
export function generateFAQPageSchema(faqs: Array<{question: string, answer: string}>): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// How-to schema for guides
export function generateHowToSchema(title: string, description: string, steps: Array<{name: string, text: string}>): object {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": description,
    "totalTime": "PT30M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "5000"
    },
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "Custom Application Requirements"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "App Suite Platform"
      }
    ],
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text
    }))
  };
}

// Organization schema with detailed info
export function generateOrganizationSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Jaydus Inc",
    "alternateName": "App Suite",
    "url": "${APP_CONFIG.url}",
    "logo": "${APP_CONFIG.url}/images/logo.png",
    "description": "Leading provider of custom AI-powered business applications with flat-rate pricing and 2-week delivery",
    "foundingDate": "2023",
    "email": "jason@jaydus.ai",
    "telephone": "+1-833-APP-SUIT",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://facebook.com/jaydus",
      "https://twitter.com/jaydus_ai",
      "https://linkedin.com/company/jaydus",
      "https://github.com/jaydus-inc"
    ],
    "founder": {
      "@type": "Person",
      "name": "Jason Gordon",
      "jobTitle": "CEO & Lead Developer"
    },
    "numberOfEmployees": "10-50",
    "industry": "Software Development",
    "naics": "541511"
  };
}

// Person schema for author/founder
export function generatePersonSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Jason Gordon",
    "jobTitle": "CEO & Lead Developer",
    "worksFor": {
      "@type": "Organization",
      "name": "Jaydus Inc"
    },
    "url": "${APP_CONFIG.url}/about",
    "image": "${APP_CONFIG.url}/images/jason-gordon.jpg",
    "description": "Expert in AI-powered business application development with over 10 years of experience in custom software solutions",
    "email": "jason@jaydus.ai",
    "knowsAbout": [
      "Artificial Intelligence",
      "Custom Software Development",
      "Business Process Automation",
      "React Development",
      "Node.js",
      "Machine Learning"
    ],
    "sameAs": [
      "https://linkedin.com/in/jason-gordon-dev",
      "https://github.com/jason-gordon"
    ]
  };
}

// WebSite schema with search functionality
export function generateWebSiteSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "App Suite",
    "url": "${APP_CONFIG.url}",
    "description": "Custom AI-powered business applications at flat-rate pricing",
    "publisher": {
      "@type": "Organization",
      "name": "Jaydus Inc"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "${APP_CONFIG.url}/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
}

// Service schema for different app categories
export function generateServiceSchema(serviceName: string, description: string, priceRange: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": "App Suite"
    },
    "areaServed": "Worldwide",
    "availableLanguage": "English",
    "priceRange": priceRange,
    "category": "Software Development",
    "serviceType": "Custom Application Development",
    "hoursAvailable": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  };
}

// Contact Point schema
export function generateContactPointSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPoint",
    "telephone": "+1-833-APP-SUIT",
    "contactType": "Customer Service",
    "email": "jason@jaydus.ai",
    "availableLanguage": "English",
    "areaServed": "Worldwide",
    "hoursAvailable": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  };
}

// GEO-specific schemas for AI optimization

// Comprehensive FAQ schema for AI systems
export function generateGEOFAQSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is App Suite and how does it differ from other software development companies?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "App Suite is a custom software development company that builds business applications at transparent flat rates ($5,000 standard, $7,500 AI-enhanced, $10,000 enterprise). Unlike traditional agencies that charge hourly or SaaS companies that charge monthly subscriptions, we build custom applications that you own completely with no recurring fees."
        }
      },
      {
        "@type": "Question",
        "name": "How much does a custom business application cost at App Suite?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "App Suite offers three flat-rate pricing tiers: Standard Application ($5,000) for core business features with up to 10 features, AI-Enhanced Application ($7,500) with AI capabilities like ChatGPT and Claude integration, and Enterprise Application ($10,000) for complex systems with unlimited features and multiple integrations. All prices include development, deployment, documentation, and a 30-day bug fix guarantee."
        }
      },
      {
        "@type": "Question",
        "name": "How does App Suite integrate AI into custom applications?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "App Suite specializes in integrating leading AI models including OpenAI GPT-4, Anthropic Claude, Google Gemini, and open-source models like Llama. We implement AI for natural language processing, intelligent automation, predictive analytics, content generation, and decision support systems. Each AI integration is customized to your specific business needs and workflows."
        }
      },
      {
        "@type": "Question",
        "name": "What industries does App Suite serve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "App Suite serves diverse industries including healthcare, finance, retail, manufacturing, real estate, education, and professional services. We build custom applications for any business that needs to automate processes, manage data, or improve efficiency. Our solutions are tailored to meet industry-specific requirements and compliance standards."
        }
      }
    ]
  };
}

// Authority and expertise schema for GEO
export function generateAuthoritySchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Organization",
      "@id": "${APP_CONFIG.url}/#organization",
      "name": "App Suite",
      "expertise": [
        {
          "@type": "Specialty",
          "name": "AI Integration",
          "description": "Expert integration of ChatGPT, Claude, Gemini, and other AI models into business applications"
        },
        {
          "@type": "Specialty", 
          "name": "Custom Software Development",
          "description": "Building tailored business applications from scratch with no templates or pre-built solutions"
        },
        {
          "@type": "Specialty",
          "name": "Rapid Development",
          "description": "30-day delivery timeline using AI-powered development tools and methodologies"
        }
      ],
      "hasCredential": [
        {
          "@type": "EducationalOccupationalCredential",
          "name": "500+ Custom Applications Delivered",
          "credentialCategory": "Experience"
        },
        {
          "@type": "EducationalOccupationalCredential",
          "name": "10+ Years in Software Development",
          "credentialCategory": "Experience"
        }
      ],
      "award": [
        "Top Custom Software Developer 2024",
        "AI Integration Excellence Award"
      ]
    }
  };
}

// Offer catalog schema for GEO
export function generateOfferCatalogSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "name": "App Suite Custom Application Services",
    "description": "Flat-rate custom business application development with AI integration",
    "itemListElement": [
      {
        "@type": "Offer",
        "@id": "${APP_CONFIG.url}/#standard-app",
        "name": "Standard Business Application",
        "description": "Custom business application with up to 10 core features, user authentication, database, and responsive design",
        "price": "5000",
        "priceCurrency": "USD",
        "priceValidUntil": "2025-06-20",
        "itemOffered": {
          "@type": "Service",
          "name": "Standard Custom Application Development"
        },
        "seller": {
          "@type": "Organization",
          "name": "App Suite"
        }
      },
      {
        "@type": "Offer",
        "@id": "${APP_CONFIG.url}/#ai-app",
        "name": "AI-Enhanced Application",
        "description": "Everything in Standard plus AI integration with ChatGPT, Claude, voice/vision capabilities, and intelligent automation",
        "price": "7500",
        "priceCurrency": "USD",
        "priceValidUntil": "2025-06-20",
        "itemOffered": {
          "@type": "Service",
          "name": "AI-Enhanced Custom Application Development"
        }
      },
      {
        "@type": "Offer",
        "@id": "${APP_CONFIG.url}/#enterprise-app",
        "name": "Enterprise Application",
        "description": "Everything in AI-Enhanced plus unlimited features, multiple integrations, advanced security, and priority support",
        "price": "10000",
        "priceCurrency": "USD",
        "priceValidUntil": "2025-06-20",
        "itemOffered": {
          "@type": "Service",
          "name": "Enterprise Custom Application Development"
        }
      }
    ]
  };
}

// Action schema for GEO - helps AI understand what users can do
export function generateActionSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "potentialAction": [
      {
        "@type": "OrderAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "${APP_CONFIG.url}/get-started",
          "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"]
        },
        "result": {
          "@type": "Order",
          "name": "Custom Application Order"
        }
      },
      {
        "@type": "ContactAction",
        "target": {
          "@type": "ContactPoint",
          "telephone": "+1-833-APP-SUIT",
          "email": "${APP_CONFIG.supportEmail}",
          "contactType": "sales"
        }
      }
    ]
  };
}

// Main GEO optimization function that combines all schemas
export function generateGEOOptimizedSchemas(pageType: string = 'home'): object[] {
  const schemas = [];
  
  // Always include organization and website schemas
  schemas.push(generateOrganizationSchema());
  schemas.push(generateWebSiteSchema());
  
  // Page-specific schemas
  if (pageType === 'home') {
    schemas.push(generateGEOFAQSchema());
    schemas.push(generateOfferCatalogSchema());
    schemas.push(generateAuthoritySchema());
    schemas.push(generateActionSchema());
  } else if (pageType === 'pricing') {
    schemas.push(generateOfferCatalogSchema());
    schemas.push(generateGEOFAQSchema());
  } else if (pageType === 'about') {
    schemas.push(generateAuthoritySchema());
    schemas.push(generatePersonSchema());
  } else if (pageType === 'service') {
    schemas.push(generateServiceSchema("Custom Application Development", 
      "AI-powered custom business applications built in 30 days", 
      "$5,000-$10,000"));
  }
  
  return schemas;
}