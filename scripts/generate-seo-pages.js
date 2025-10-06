import fs from 'fs';
import path from 'path';

function getBuiltAssets() {
    const distIndexPath = path.join('dist', 'index.html');

    if (!fs.existsSync(distIndexPath)) {
        console.error('❌ Built index.html not found. Run build first.');
        return { jsPath: '/src/main.tsx', cssPath: '' };
    }

    const builtHtml = fs.readFileSync(distIndexPath, 'utf-8');

    // Extract JS and CSS paths from built HTML
    const jsMatch = builtHtml.match(/<script[^>]*src="([^"]*\.js)"[^>]*>/);
    const cssMatch = builtHtml.match(/<link[^>]*href="([^"]*\.css)"[^>]*>/);

    return {
        jsPath: jsMatch ? jsMatch[1] : '/src/main.tsx',
        cssPath: cssMatch ? cssMatch[1] : ''
    };
}

function createBaseTemplate(assets) {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{TITLE}}</title>
    <meta name="description" content="{{DESCRIPTION}}" />
    <meta name="keywords" content="{{KEYWORDS}}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:title" content="{{TITLE}}" />
    <meta property="og:description" content="{{DESCRIPTION}}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://app-suite.io{{PATH}}" />
    <meta property="og:image" content="https://app-suite.io/images/og-image.jpg" />
    <meta property="og:site_name" content="App Suite" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{{TITLE}}" />
    <meta name="twitter:description" content="{{DESCRIPTION}}" />
    <meta name="twitter:image" content="https://app-suite.io/images/og-image.jpg" />
    
    <!-- Additional SEO -->
    <meta name="robots" content="index, follow" />
    <meta name="author" content="App Suite" />
    <link rel="canonical" href="https://app-suite.io{{PATH}}" />
    
    <link rel="icon" href="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='10' fill='%23000000'/%3E%3Ctext x='50' y='65' font-family='Arial' font-size='50' font-weight='bold' text-anchor='middle' fill='white'%3EAS%3C/text%3E%3C/svg%3E" type="image/svg+xml">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {{STRUCTURED_DATA}}
    </script>
    ${assets.cssPath ? `
    <link rel="stylesheet" crossorigin href="${assets.cssPath}">` : ''}
  </head>
  <body>
    <div id="root">
      <!-- Static content for search engines -->
      <noscript>
        <header>
          <h1>App Suite</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/apps">Applications</a>
            <a href="/blog">Blog</a>
          </nav>
        </header>
        <main>
          {{STATIC_CONTENT}}
        </main>
      </noscript>
    </div>
    <script>
      // Redirect to SPA after initial load for SEO
      if (window.location.pathname !== '/' && !window.location.search.includes('_escaped_fragment_')) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    </script>
    <script type="module" crossorigin src="${assets.jsPath}"></script>
  </body>
</html>`;
}

const pages = [
    {
        path: '/',
        title: 'App Suite - Custom Business Applications at $5K Flat Rate',
        description: 'Stop paying monthly SaaS fees. Get custom AI business applications built in 30 days for $5,000 flat rate. ChatGPT/Claude integration, you own the code.',
        keywords: 'custom business applications, AI software development, flat rate pricing, $5000 apps, business automation, ChatGPT integration, no monthly fees, own your software',
        staticContent: `
      <section>
        <h1>Stop Renting Software. Own Your Business Applications.</h1>
        <p>Get custom AI-powered business applications built from scratch at transparent flat rates. $5,000 standard, $7,500 AI-enhanced. No monthly fees, you own the code.</p>
        <ul>
          <li>Custom Finance Applications</li>
          <li>Customer Management Systems</li>
          <li>Operations Tools</li>
          <li>Marketing Solutions</li>
          <li>AI-Enhanced Features with ChatGPT/Claude</li>
        </ul>
        <a href="/get-started">Get Started Today</a>
      </section>
    `,
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "App Suite",
            "url": "https://app-suite.io",
            "logo": "https://app-suite.io/images/og-image.jpg",
            "description": "Custom business applications at transparent flat rates. No monthly fees.",
            "offers": {
                "@type": "Offer",
                "name": "Custom Business Application Development",
                "description": "Custom AI-powered business applications built from scratch",
                "price": "5000",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
            }
        }
    },
    {
        path: '/about',
        title: 'About App Suite - Custom Business Application Development',
        description: 'Learn about App Suite\'s mission to help businesses own their software instead of renting it. Transparent pricing, no monthly fees.',
        keywords: 'about app suite, custom software development, business applications, flat rate pricing',
        staticContent: `
      <section>
        <h1>About App Suite</h1>
        <p>We believe businesses should own their software, not rent it forever. Our mission is to provide custom business applications at transparent flat rates.</p>
        <h2>Our Approach</h2>
        <ul>
          <li>Transparent flat-rate pricing</li>
          <li>You own the source code</li>
          <li>No monthly subscription fees</li>
          <li>AI-enhanced applications</li>
          <li>30-day delivery timeline</li>
        </ul>
      </section>
    `,
        structuredData: {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About App Suite",
            "description": "Learn about App Suite's mission to help businesses own their software instead of renting it."
        }
    },
    {
        path: '/contact',
        title: 'Contact App Suite - Get Your Custom Business App Quote',
        description: 'Contact App Suite to discuss your custom business application needs. Get a quote for your $5,000 flat-rate custom software solution.',
        keywords: 'contact app suite, custom software quote, business application consultation',
        staticContent: `
      <section>
        <h1>Contact App Suite</h1>
        <p>Ready to discuss your custom business application? Get in touch for a consultation and quote.</p>
        <h2>Get Started</h2>
        <p>Email us or fill out our contact form to begin your custom application project.</p>
        <ul>
          <li>Free consultation</li>
          <li>Transparent pricing</li>
          <li>30-day delivery</li>
          <li>You own the code</li>
        </ul>
      </section>
    `,
        structuredData: {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact App Suite"
        }
    },
    {
        path: '/apps',
        title: 'Custom Business Applications | App Suite Portfolio',
        description: 'Browse our custom business applications: Finance apps, CRM systems, operations tools, and marketing solutions. All built at flat rates with no monthly fees.',
        keywords: 'business applications, custom software, finance apps, CRM, operations tools, marketing software',
        staticContent: `
      <section>
        <h1>Custom Business Applications</h1>
        <p>Explore our portfolio of custom business applications built for companies like yours.</p>
        <div>
          <h2>Application Categories</h2>
          <ul>
            <li><a href="/finance-apps">Finance Applications</a> - Accounting, invoicing, financial reporting</li>
            <li><a href="/customer-management">Customer Management</a> - CRM, support systems, client portals</li>
            <li><a href="/operations-tools">Operations Tools</a> - Inventory, project management, workflows</li>
            <li><a href="/marketing-solutions">Marketing Solutions</a> - Campaign management, analytics, automation</li>
          </ul>
        </div>
      </section>
    `,
        structuredData: {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Custom Business Applications",
            "description": "Portfolio of custom business applications"
        }
    },
    {
        path: '/get-started',
        title: 'Get Started - Custom Business App Development | App Suite',
        description: 'Start your custom business application project today. $5,000 flat rate, 30-day delivery, you own the code. Free consultation available.',
        keywords: 'get started, custom app development, business software quote, flat rate pricing',
        staticContent: `
      <section>
        <h1>Get Started with Your Custom Business Application</h1>
        <p>Ready to stop paying monthly SaaS fees? Let's build your custom business application.</p>
        <div>
          <h2>Simple Process</h2>
          <ol>
            <li>Free consultation call</li>
            <li>Project scope and timeline</li>
            <li>$5,000 flat rate payment</li>
            <li>30-day development</li>
            <li>You own the code forever</li>
          </ol>
          <h2>What You Get</h2>
          <ul>
            <li>Custom-built application</li>
            <li>Full source code ownership</li>
            <li>No monthly subscription fees</li>
            <li>AI integration available</li>
            <li>30-day delivery guarantee</li>
          </ul>
        </div>
      </section>
    `,
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Custom Business Application Development",
            "provider": {
                "@type": "Organization",
                "name": "App Suite"
            },
            "offers": {
                "@type": "Offer",
                "price": "5000",
                "priceCurrency": "USD"
            }
        }
    },
    {
        path: '/blog',
        title: 'Business Software Development Blog | App Suite',
        description: 'Expert insights on custom business applications, AI integration, and software ownership. Learn how to stop renting software and own your business tools.',
        keywords: 'business software blog, custom applications, AI integration, software development, SaaS alternatives',
        staticContent: `
      <section>
        <h1>App Suite Blog</h1>
        <p>Expert insights on custom business applications, AI integration, and software ownership.</p>
        <div>
          <h2>Featured Articles</h2>
          <ul>
            <li><a href="/whitepapers/geo-blocking-ai-search">The Hidden Cost of Geo-Blocking and AI Search Visibility</a></li>
            <li><a href="/blog/generative-engine-optimization-complete-guide-2025">Generative Engine Optimization Complete Guide 2025</a></li>
            <li>Custom vs SaaS: Why Ownership Matters</li>
            <li>AI Integration in Business Applications</li>
          </ul>
        </div>
      </section>
    `,
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "App Suite Blog",
            "description": "Expert insights on custom business applications and AI integration"
        }
    },
    {
        path: '/solutions-weve-built',
        title: 'Solutions We\'ve Built | Custom Business App Examples',
        description: 'See real examples of custom business applications we\'ve built: CRM systems, finance tools, operations dashboards, and more. All delivered at flat rates.',
        keywords: 'custom software examples, business app portfolio, CRM examples, finance app examples',
        staticContent: `
      <section>
        <h1>Solutions We've Built</h1>
        <p>Real examples of custom business applications we've delivered to clients across various industries.</p>
        <div>
          <h2>Featured Solutions</h2>
          <ul>
            <li>Custom CRM with AI Lead Scoring</li>
            <li>Financial Dashboard with Real-time Reporting</li>
            <li>Inventory Management System</li>
            <li>Project Management Tool</li>
            <li>Marketing Campaign Tracker</li>
          </ul>
          <p>Each solution was delivered in 30 days at our flat rate pricing.</p>
        </div>
      </section>
    `,
        structuredData: {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Solutions We've Built",
            "description": "Portfolio of custom business applications we've delivered"
        }
    },
    {
        path: '/price-calculator',
        title: 'Price Calculator - Custom Business App Cost | App Suite',
        description: 'Calculate the cost of your custom business application. Transparent flat-rate pricing: $5,000 standard, $7,500 AI-enhanced. No hidden fees.',
        keywords: 'price calculator, custom app cost, flat rate pricing, business software cost',
        staticContent: `
      <section>
        <h1>Price Calculator</h1>
        <p>Calculate the cost of your custom business application with our transparent flat-rate pricing.</p>
        <div>
          <h2>Pricing Tiers</h2>
          <ul>
            <li><strong>Standard Application:</strong> $5,000 flat rate</li>
            <li><strong>AI-Enhanced Application:</strong> $7,500 flat rate</li>
          </ul>
          <h2>What's Included</h2>
          <ul>
            <li>Custom development</li>
            <li>Full source code</li>
            <li>30-day delivery</li>
            <li>No monthly fees</li>
            <li>Basic support included</li>
          </ul>
        </div>
      </section>
    `,
        structuredData: {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Price Calculator",
            "applicationCategory": "BusinessApplication"
        }
    },
    {
        path: '/roi-calculator',
        title: 'ROI Calculator - Custom Business App Return on Investment',
        description: 'Calculate your ROI from switching to custom business applications. See how much you\'ll save by eliminating monthly SaaS fees and owning your software.',
        keywords: 'ROI calculator, return on investment, SaaS savings, custom software ROI, business app savings',
        staticContent: `
      <section>
        <h1>ROI Calculator</h1>
        <p>Calculate your return on investment from switching to custom business applications.</p>
        <div>
          <h2>Why Calculate ROI?</h2>
          <ul>
            <li>See total savings from eliminating monthly SaaS fees</li>
            <li>Compare one-time cost vs ongoing subscriptions</li>
            <li>Factor in productivity improvements</li>
            <li>Account for data ownership benefits</li>
          </ul>
          <h2>Typical Savings</h2>
          <p>Most businesses save 60-80% over 3 years by switching from SaaS to custom applications.</p>
        </div>
      </section>
    `,
        structuredData: {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "ROI Calculator",
            "applicationCategory": "BusinessApplication"
        }
    },
    {
        path: '/whitepapers/geo-blocking-ai-search',
        title: 'The Hidden Cost of Geo-Blocking and AI Search Visibility',
        description: 'Comprehensive whitepaper on how geo-blocking affects AI search visibility and business discoverability. Essential reading for modern SEO strategy.',
        keywords: 'geo-blocking, AI search, SEO, search visibility, generative engine optimization, GEO',
        staticContent: `
      <section>
        <h1>The Hidden Cost of Geo-Blocking and AI Search Visibility</h1>
        <p>A comprehensive analysis of how geo-blocking affects your business's visibility in AI-powered search engines.</p>
        <div>
          <h2>Key Findings</h2>
          <ul>
            <li>Geo-blocking reduces AI search visibility by up to 70%</li>
            <li>ChatGPT, Claude, and Perplexity are affected differently</li>
            <li>Regional restrictions impact global business discovery</li>
            <li>Simple fixes can restore full visibility</li>
          </ul>
          <h2>What You'll Learn</h2>
          <ul>
            <li>How AI search engines handle geo-restrictions</li>
            <li>Impact on business discoverability</li>
            <li>Technical solutions and workarounds</li>
            <li>Future implications for SEO strategy</li>
          </ul>
        </div>
      </section>
    `,
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "The Hidden Cost of Geo-Blocking and AI Search Visibility",
            "author": {
                "@type": "Organization",
                "name": "App Suite"
            },
            "publisher": {
                "@type": "Organization",
                "name": "App Suite"
            },
            "articleSection": "SEO",
            "keywords": "geo-blocking, AI search, SEO, GEO"
        }
    },
    {
        path: '/finance-apps',
        title: 'Custom Finance Applications | Accounting & Financial Software',
        description: 'Custom finance applications built at flat rates: accounting systems, invoicing tools, financial dashboards, and reporting. No monthly fees, you own the code.',
        keywords: 'custom finance apps, accounting software, invoicing system, financial dashboard, custom financial software',
        staticContent: `
      <section>
        <h1>Custom Finance Applications</h1>
        <p>Stop paying monthly fees for accounting software. Get custom finance applications built specifically for your business.</p>
        <div>
          <h2>Finance Applications We Build</h2>
          <ul>
            <li><strong>Accounting Systems</strong> - Custom chart of accounts, automated bookkeeping</li>
            <li><strong>Invoicing Tools</strong> - Automated billing, payment tracking, client portals</li>
            <li><strong>Financial Dashboards</strong> - Real-time reporting, KPI tracking, forecasting</li>
            <li><strong>Expense Management</strong> - Receipt scanning, approval workflows, reporting</li>
            <li><strong>Payroll Systems</strong> - Employee management, tax calculations, direct deposit</li>
          </ul>
          <h2>Why Choose Custom Finance Apps?</h2>
          <ul>
            <li>No monthly subscription fees</li>
            <li>Tailored to your specific workflows</li>
            <li>Full data ownership and control</li>
            <li>Integration with existing systems</li>
            <li>AI-powered automation available</li>
          </ul>
        </div>
      </section>
    `,
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Custom Finance Applications",
            "provider": {
                "@type": "Organization",
                "name": "App Suite"
            },
            "serviceType": "Software Development",
            "areaServed": "Worldwide"
        }
    },
    {
        path: '/customer-management',
        title: 'Custom CRM & Customer Management Systems | App Suite',
        description: 'Custom CRM and customer management systems built at flat rates. Lead tracking, sales pipelines, customer support, and client portals. Own your customer data.',
        keywords: 'custom CRM, customer management system, sales pipeline, lead tracking, customer support software',
        staticContent: `
      <section>
        <h1>Custom Customer Management Systems</h1>
        <p>Build a CRM system that works exactly how your business operates. No more forcing your processes into generic software.</p>
        <div>
          <h2>CRM Features We Build</h2>
          <ul>
            <li><strong>Lead Management</strong> - Capture, score, and nurture leads automatically</li>
            <li><strong>Sales Pipeline</strong> - Custom stages, forecasting, deal tracking</li>
            <li><strong>Customer Support</strong> - Ticket system, knowledge base, live chat</li>
            <li><strong>Client Portals</strong> - Self-service access, document sharing, communication</li>
            <li><strong>Contact Management</strong> - Detailed profiles, interaction history, segmentation</li>
            <li><strong>Reporting & Analytics</strong> - Sales metrics, customer insights, performance tracking</li>
          </ul>
          <h2>Benefits of Custom CRM</h2>
          <ul>
            <li>Perfect fit for your sales process</li>
            <li>Own your customer data forever</li>
            <li>No per-user monthly fees</li>
            <li>AI-powered lead scoring and insights</li>
            <li>Unlimited customization</li>
          </ul>
        </div>
      </section>
    `,
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Custom CRM Development",
            "provider": {
                "@type": "Organization",
                "name": "App Suite"
            },
            "serviceType": "CRM Software Development"
        }
    },
    {
        path: '/operations-tools',
        title: 'Custom Operations Tools | Project Management & Workflow Software',
        description: 'Custom operations tools and project management software. Inventory systems, workflow automation, task management, and team collaboration tools at flat rates.',
        keywords: 'custom operations tools, project management software, workflow automation, inventory management, task management',
        staticContent: `
      <section>
        <h1>Custom Operations Tools</h1>
        <p>Streamline your operations with custom-built tools designed for your specific workflows and processes.</p>
        <div>
          <h2>Operations Tools We Build</h2>
          <ul>
            <li><strong>Project Management</strong> - Task tracking, team collaboration, timeline management</li>
            <li><strong>Inventory Management</strong> - Stock tracking, automated reordering, supplier management</li>
            <li><strong>Workflow Automation</strong> - Process automation, approval workflows, notifications</li>
            <li><strong>Resource Planning</strong> - Staff scheduling, equipment booking, capacity planning</li>
            <li><strong>Quality Control</strong> - Inspection checklists, compliance tracking, audit trails</li>
            <li><strong>Reporting Dashboards</strong> - KPI tracking, performance metrics, operational insights</li>
          </ul>
          <h2>Why Custom Operations Tools?</h2>
          <ul>
            <li>Built for your specific processes</li>
            <li>Eliminate manual work with automation</li>
            <li>Real-time visibility into operations</li>
            <li>Scale with your business growth</li>
            <li>No monthly software subscriptions</li>
          </ul>
        </div>
      </section>
    `,
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Custom Operations Tools",
            "provider": {
                "@type": "Organization",
                "name": "App Suite"
            },
            "serviceType": "Operations Software Development"
        }
    },
    {
        path: '/marketing-solutions',
        title: 'Custom Marketing Software | Campaign Management & Analytics',
        description: 'Custom marketing software and automation tools. Campaign management, lead generation, email marketing, and analytics dashboards built at flat rates.',
        keywords: 'custom marketing software, campaign management, marketing automation, lead generation, email marketing, marketing analytics',
        staticContent: `
      <section>
        <h1>Custom Marketing Solutions</h1>
        <p>Build marketing tools that work exactly how you want them to. Stop paying monthly fees for marketing software that doesn't fit your needs.</p>
        <div>
          <h2>Marketing Tools We Build</h2>
          <ul>
            <li><strong>Campaign Management</strong> - Multi-channel campaigns, A/B testing, performance tracking</li>
            <li><strong>Lead Generation</strong> - Landing pages, forms, lead scoring, nurture sequences</li>
            <li><strong>Email Marketing</strong> - Automated sequences, segmentation, deliverability optimization</li>
            <li><strong>Social Media Management</strong> - Post scheduling, engagement tracking, content planning</li>
            <li><strong>Analytics Dashboards</strong> - ROI tracking, attribution modeling, performance insights</li>
            <li><strong>Customer Journey Mapping</strong> - Touchpoint tracking, conversion optimization</li>
          </ul>
          <h2>Benefits of Custom Marketing Tools</h2>
          <ul>
            <li>Perfect integration with your sales process</li>
            <li>Own your marketing data and insights</li>
            <li>No monthly per-contact fees</li>
            <li>AI-powered optimization and insights</li>
            <li>Unlimited customization and scaling</li>
          </ul>
        </div>
      </section>
    `,
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Custom Marketing Solutions",
            "provider": {
                "@type": "Organization",
                "name": "App Suite"
            },
            "serviceType": "Marketing Software Development"
        }
    },
    {
        path: '/documentation',
        title: 'Documentation | App Suite Custom Business Applications',
        description: 'Complete documentation for App Suite custom business applications. Learn about our development process, AI capabilities, security, and client onboarding.',
        keywords: 'app suite documentation, custom software development, AI capabilities, security, client onboarding',
        staticContent: `
      <section>
        <h1>App Suite Documentation</h1>
        <p>Everything you need to know about our custom business application development process.</p>
        <div>
          <h2>Documentation Sections</h2>
          <ul>
            <li><a href="/documentation/quick-start">Quick Start Guide</a> - Get started with your project</li>
            <li><a href="/documentation/process">Development Process</a> - How we build your application</li>
            <li><a href="/documentation/ai-capabilities">AI Capabilities</a> - ChatGPT and Claude integration</li>
            <li><a href="/documentation/security">Security</a> - How we protect your data</li>
            <li><a href="/documentation/client-onboarding">Client Onboarding</a> - What to expect</li>
            <li><a href="/documentation/delivery">Delivery</a> - How we deliver your application</li>
          </ul>
          <h2>Key Information</h2>
          <ul>
            <li>30-day delivery timeline</li>
            <li>$5,000 flat rate pricing</li>
            <li>Full source code ownership</li>
            <li>No monthly subscription fees</li>
            <li>AI integration available</li>
          </ul>
        </div>
      </section>
    `,
        structuredData: {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "name": "App Suite Documentation",
            "description": "Complete documentation for custom business application development"
        }
    },
    {
        path: '/blog/generative-engine-optimization-complete-guide-2025',
        title: 'Generative Engine Optimization Complete Guide 2025 | App Suite',
        description: 'Complete guide to Generative Engine Optimization (GEO) for 2025. Learn how to optimize for AI search engines like ChatGPT, Claude, and Perplexity.',
        keywords: 'generative engine optimization, GEO, AI search, ChatGPT optimization, Claude search, AI SEO',
        staticContent: `
      <section>
        <h1>Generative Engine Optimization Complete Guide 2025</h1>
        <p>The definitive guide to optimizing your content for AI-powered search engines and generative AI tools.</p>
        <div>
          <h2>What is Generative Engine Optimization?</h2>
          <p>Generative Engine Optimization (GEO) is the practice of optimizing content to appear in AI-generated responses from tools like ChatGPT, Claude, and Perplexity.</p>
          
          <h2>Key GEO Strategies</h2>
          <ul>
            <li>Structured data implementation</li>
            <li>Clear, authoritative content</li>
            <li>FAQ-style formatting</li>
            <li>Citation-friendly sources</li>
            <li>Technical accuracy</li>
          </ul>
          
          <h2>Why GEO Matters for Business</h2>
          <p>As AI search becomes mainstream, businesses need to ensure their content is discoverable and citable by AI systems.</p>
        </div>
      </section>
    `,
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Generative Engine Optimization Complete Guide 2025",
            "description": "Complete guide to optimizing for AI search engines",
            "author": {
                "@type": "Organization",
                "name": "App Suite"
            },
            "publisher": {
                "@type": "Organization",
                "name": "App Suite"
            }
        }
    },
    {
        path: '/blog/google-business-profile-consolidation',
        title: 'Google Business Profile Consolidation Guide | App Suite',
        description: 'Learn how to consolidate duplicate Google Business Profiles and improve your local SEO presence. Step-by-step guide for business owners.',
        keywords: 'google business profile, local SEO, duplicate listings, business profile consolidation',
        staticContent: `
      <section>
        <h1>Google Business Profile Consolidation Guide</h1>
        <p>Step-by-step guide to consolidating duplicate Google Business Profiles and improving your local search presence.</p>
        <div>
          <h2>Why Consolidate Business Profiles?</h2>
          <ul>
            <li>Avoid confusing customers</li>
            <li>Improve local search rankings</li>
            <li>Centralize reviews and ratings</li>
            <li>Better analytics and insights</li>
          </ul>
          
          <h2>Consolidation Process</h2>
          <ol>
            <li>Identify duplicate profiles</li>
            <li>Verify ownership of all profiles</li>
            <li>Choose the primary profile</li>
            <li>Request consolidation through Google</li>
            <li>Monitor the process</li>
          </ol>
        </div>
      </section>
    `,
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Google Business Profile Consolidation Guide",
            "description": "Guide to consolidating duplicate Google Business Profiles",
            "author": {
                "@type": "Organization",
                "name": "App Suite"
            }
        }
    }
];

function generatePage(pageData, baseTemplate) {
    let html = baseTemplate;
    html = html.replace(/{{TITLE}}/g, pageData.title);
    html = html.replace(/{{DESCRIPTION}}/g, pageData.description);
    html = html.replace(/{{KEYWORDS}}/g, pageData.keywords);
    html = html.replace(/{{PATH}}/g, pageData.path);
    html = html.replace(/{{STATIC_CONTENT}}/g, pageData.staticContent);
    html = html.replace(/{{STRUCTURED_DATA}}/g, JSON.stringify(pageData.structuredData, null, 2));

    return html;
}

function generateSEOPages() {
    const distDir = 'dist';

    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    // Get the actual built asset paths
    const assets = getBuiltAssets();
    const baseTemplate = createBaseTemplate(assets);

    console.log(`📦 Using assets: JS=${assets.jsPath}, CSS=${assets.cssPath}`);
    console.log(`📄 Generating ${pages.length} SEO pages...`);

    // Debug: List all page paths
    console.log('📋 Pages to generate:');
    pages.forEach((page, index) => {
        console.log(`  ${index + 1}. ${page.path} - ${page.title}`);
    });

    pages.forEach((page, index) => {
        console.log(`[${index + 1}/${pages.length}] Processing: ${page.path}`);
        const html = generatePage(page, baseTemplate);
        const filePath = page.path === '/' ?
            path.join(distDir, 'index.html') :
            path.join(distDir, page.path.slice(1), 'index.html');

        // Create directory if it doesn't exist
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filePath, html);
        console.log(`Generated SEO page: ${filePath}`);
    });

    console.log('✅ SEO pages generated successfully!');
    console.log(`📊 Total pages generated: ${pages.length}`);

    // List all generated files
    const generatedFiles = pages.map(page => {
        const filePath = page.path === '/' ?
            path.join('dist', 'index.html') :
            path.join('dist', page.path.slice(1), 'index.html');
        return filePath;
    });

    console.log('📁 Generated files:');
    generatedFiles.forEach(file => console.log(`  - ${file}`));
}

generateSEOPages();