// Comprehensive structured data for AI crawlers and search engines
// Following GEO best practices from the whitepaper

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.app-suite.io/#organization",
  "name": "App Suite",
  "legalName": "App Suite by Jaydus Inc.",
  "url": "https://www.app-suite.io",
  "logo": "https://www.app-suite.io/logo.png",
  "description": "App Suite builds custom business applications at transparent flat rates. Stop renting software - own it.",
  "foundingDate": "2024",
  "founder": {
    "@type": "Person",
    "name": "Jason Gordon",
    "jobTitle": "CEO & Lead Developer",
    "email": "jason@jaydus.ai"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "651 N. Broad St.",
    "addressLocality": "Middletown",
    "addressRegion": "DE",
    "postalCode": "19709",
    "addressCountry": "US"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-833-APP-SUIT",
    "contactType": "sales",
    "email": "jason@jaydus.ai",
    "availableLanguage": "English"
  },
  "sameAs": [
    "https://www.linkedin.com/company/app-suite",
    "https://twitter.com/appsuite"
  ],
  "knowsAbout": [
    "Custom Software Development",
    "Business Applications",
    "AI Integration",
    "Enterprise Solutions",
    "SaaS Alternative",
    "No-Code Platforms"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Custom Application Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "Standard Application",
        "price": "5000",
        "priceCurrency": "USD",
        "description": "Custom business application with core features"
      },
      {
        "@type": "Offer",
        "name": "AI-Enhanced Application",
        "price": "7500",
        "priceCurrency": "USD",
        "description": "Includes AI capabilities and advanced automation"
      },
      {
        "@type": "Offer",
        "name": "Enterprise Application",
        "price": "10000",
        "priceCurrency": "USD",
        "description": "Complex systems with multiple integrations"
      }
    ]
  }
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.app-suite.io/#website",
  "url": "https://www.app-suite.io",
  "name": "App Suite",
  "description": "Custom business applications at flat rates",
  "publisher": {
    "@id": "https://www.app-suite.io/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.app-suite.io/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Custom Software Development",
  "provider": {
    "@id": "https://www.app-suite.io/#organization"
  },
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Development Services",
    "itemListElement": [
      {
        "@type": "OfferCatalog",
        "name": "Business Applications",
        "itemListElement": [
          "CRM Systems",
          "Project Management Tools",
          "Financial Management Software",
          "Marketing Automation",
          "Team Collaboration Platforms"
        ]
      }
    ]
  }
};

// FAQ Schema for common AI queries
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is App Suite?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "App Suite is a custom software development company that builds business applications at transparent flat rates. Unlike traditional agencies that charge hourly or SaaS companies that charge monthly, we build custom applications for a one-time fee starting at $5,000."
      }
    },
    {
      "@type": "Question",
      "name": "How much does a custom business application cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "App Suite offers three pricing tiers: Standard Application ($5,000) for core business features, AI-Enhanced Application ($7,500) with AI capabilities like ChatGPT integration, and Enterprise Application ($10,000) for complex systems with multiple integrations. All prices are flat-rate with no hidden fees."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to build a custom application?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "App Suite delivers custom applications in 30 days from payment to launch. This timeline ensures thorough development and testing while leveraging AI-powered development tools."
      }
    },
    {
      "@type": "Question",
      "name": "Do I own the code and application?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, you own 100% of the code, data, and intellectual property. Unlike SaaS subscriptions where you're renting software, App Suite builds applications that you own completely with no vendor lock-in."
      }
    },
    {
      "@type": "Question",
      "name": "What's included in the flat-rate price?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The flat-rate price includes: complete custom development, source code ownership, deployment and setup, 30-day bug fix guarantee, technical documentation, initial training session, and the first 2 API integrations free. There are no monthly fees or hidden costs."
      }
    }
  ]
};

// How-to Schema for AI to understand our process
export const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Get a Custom Business Application Built",
  "description": "The process for getting a custom business application built by App Suite",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Schedule Consultation",
      "text": "Book a 30-minute discovery call to discuss your specific business needs and workflows",
      "url": "https://www.app-suite.io/contact"
    },
    {
      "@type": "HowToStep",
      "name": "Receive Proposal",
      "text": "Get a detailed proposal with flat-rate pricing and timeline within 24 hours"
    },
    {
      "@type": "HowToStep",
      "name": "Make Initial Payment",
      "text": "Pay 50% upfront to secure your development slot and begin work"
    },
    {
      "@type": "HowToStep",
      "name": "Development Phase",
      "text": "Your custom application is built over 30 days with regular updates"
    },
    {
      "@type": "HowToStep",
      "name": "Launch & Final Payment",
      "text": "Application is deployed and you pay the remaining 50% upon delivery"
    }
  ],
  "totalTime": "P14D",
  "supply": ["Business requirements", "50% initial payment"],
  "tool": ["AI-powered development tools", "Modern web technologies"],
  "yield": "Complete custom business application with full ownership"
};

// Expertise and authority signals for AI
export const expertiseSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Organization",
    "@id": "https://www.app-suite.io/#organization",
    "knowsAbout": [
      {
        "@type": "Thing",
        "name": "AI Integration",
        "description": "Expert integration of OpenAI GPT-4, Anthropic Claude, Google Gemini, and other AI models"
      },
      {
        "@type": "Thing",
        "name": "Custom CRM Development",
        "description": "Building tailored customer relationship management systems for specific business needs"
      },
      {
        "@type": "Thing",
        "name": "Business Process Automation",
        "description": "Automating workflows and repetitive tasks with custom software solutions"
      },
      {
        "@type": "Thing",
        "name": "SaaS Alternative Solutions",
        "description": "Creating owned alternatives to expensive subscription software"
      }
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "10+ Years Software Development Experience",
        "credentialCategory": "Professional Experience"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "name": "500+ Custom Applications Delivered",
        "credentialCategory": "Portfolio"
      }
    ]
  }
};

// Function to combine all schemas for a page
export function getCombinedSchema(pageType: string = 'website') {
  const schemas = [organizationSchema, websiteSchema];
  
  if (pageType === 'home') {
    schemas.push(faqSchema, howToSchema, serviceSchema);
  } else if (pageType === 'service') {
    schemas.push(serviceSchema, faqSchema);
  } else if (pageType === 'about') {
    schemas.push(expertiseSchema);
  }
  
  return schemas;
}

// Function to generate JSON-LD script tags
export function generateSchemaScripts(pageType: string = 'website'): string {
  const schemas = getCombinedSchema(pageType);
  return schemas.map(schema => 
    `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`
  ).join('\n');
}