const path = require('path');
const Prerenderer = require('@prerenderer/prerenderer');
const PuppeteerRenderer = require('@prerenderer/renderer-puppeteer');

const routes = [
  '/',
  '/about',
  '/contact',
  '/blog',
  '/blog/generative-engine-optimization-complete-guide-2025',
  '/blog/hidden-cost-geo-blocking-ai-search-visibility',
  '/finance-apps',
  '/customer-management',
  '/operations-tools',
  '/marketing-solutions',
  '/sales',
  '/price-calculator',
  '/roi-calculator',
  '/get-started',
  '/extensions',
  '/industries',
  '/technology-partners',
  '/solutions-weve-built',
  '/ai-development-process',
  '/documentation',
  '/support',
  '/privacy',
  '/terms',
  '/cookie-policy'
];

async function prerender() {
  const prerenderer = new Prerenderer({
    staticDir: path.join(__dirname, 'dist'),
    routes: routes,
    renderer: new PuppeteerRenderer({
      renderAfterDocumentEvent: 'render-event',
      maxConcurrentRoutes: 4,
      timeout: 30000,
      headless: true,
      navigationOptions: {
        waitUntil: 'networkidle0',
      },
      puppeteerLaunchOptions: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    })
  });

  try {
    await prerenderer.initialize();
    const renderedRoutes = await prerenderer.renderRoutes(routes);
    
    renderedRoutes.forEach(renderedRoute => {
      console.log(`Prerendered: ${renderedRoute.route}`);
    });
    
    await prerenderer.destroy();
    console.log('Prerendering complete!');
  } catch (error) {
    console.error('Prerendering failed:', error);
    await prerenderer.destroy();
    process.exit(1);
  }
}

prerender();