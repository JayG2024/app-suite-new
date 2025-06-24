import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSEOData, updatePageSEO, generateGEOOptimizedSchemas } from '@/utils/seo';
import { APP_CONFIG } from '@/config/app';

// Helper function to determine page type for GEO optimization
function getPageType(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname === '/pricing') return 'pricing';
  if (pathname === '/about') return 'about';
  if (pathname.includes('/finance-apps') || pathname.includes('/customer-management') || 
      pathname.includes('/operations-tools') || pathname.includes('/marketing-solutions')) {
    return 'service';
  }
  return 'website';
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  noIndex?: boolean;
  canonical?: string;
  structuredData?: object;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  noIndex = false,
  canonical,
  structuredData
}) => {
  const location = useLocation();

  useEffect(() => {
    // Get default SEO data for current page
    const defaultSEOData = getSEOData(location.pathname);
    
    // Merge with custom props
    const seoData = {
      title: title || defaultSEOData.title,
      description: description || defaultSEOData.description,
      keywords: keywords || defaultSEOData.keywords,
      ogImage: image || defaultSEOData.ogImage,
      canonical: canonical || `${APP_CONFIG.url}${location.pathname}`,
      structuredData: structuredData || defaultSEOData.structuredData,
      ...defaultSEOData
    };

    // Update page SEO
    updatePageSEO(seoData);

    // Add noindex if specified
    if (noIndex) {
      const robotsTag = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
      if (robotsTag) {
        robotsTag.setAttribute('content', 'noindex, nofollow');
      } else {
        const newRobotsTag = document.createElement('meta');
        newRobotsTag.setAttribute('name', 'robots');
        newRobotsTag.setAttribute('content', 'noindex, nofollow');
        document.head.appendChild(newRobotsTag);
      }
    } else {
      // Ensure indexing is allowed
      const robotsTag = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
      if (robotsTag) {
        robotsTag.setAttribute('content', 'index, follow');
      }
    }

    // Add GEO-optimized schemas based on page type
    const pageType = getPageType(location.pathname);
    const geoSchemas = generateGEOOptimizedSchemas(pageType);
    
    // Remove any existing schema scripts
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach(script => script.remove());
    
    // Add all GEO schemas
    geoSchemas.forEach(schema => {
      const schemaScript = document.createElement('script');
      schemaScript.setAttribute('type', 'application/ld+json');
      schemaScript.textContent = JSON.stringify(schema);
      document.head.appendChild(schemaScript);
    });

  }, [location.pathname, title, description, keywords, image, noIndex, canonical, structuredData]);

  return null; // This component doesn't render anything
};

export default SEO;