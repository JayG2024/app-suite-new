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

    pages.forEach(page => {
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
}

generateSEOPages();