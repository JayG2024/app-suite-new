import { useEffect } from 'react';

interface CitationData {
  content: string;
  type: string;
  url: string;
  timestamp: string;
}

/**
 * Hook that tracks when content might be cited by AI systems
 * and provides analytics for GEO optimization
 */
export const useAICitation = (content: string, type: string = 'general') => {
  useEffect(() => {
    // Add meta tag for AI systems to identify citable content
    const metaTag = document.createElement('meta');
    metaTag.name = 'ai-citation-content';
    metaTag.content = content.substring(0, 160); // First 160 chars
    metaTag.setAttribute('data-type', type);
    metaTag.setAttribute('data-timestamp', new Date().toISOString());
    document.head.appendChild(metaTag);

    // Track citation opportunity
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ai_citation_opportunity', {
        event_category: 'GEO',
        event_label: type,
        value: content.length
      });
    }

    // Cleanup
    return () => {
      document.head.removeChild(metaTag);
    };
  }, [content, type]);

  // Function to mark content as cited (for future analytics)
  const markAsCited = () => {
    const citationData: CitationData = {
      content,
      type,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    // Store citation data for analytics
    const citations = JSON.parse(localStorage.getItem('ai_citations') || '[]');
    citations.push(citationData);
    localStorage.setItem('ai_citations', JSON.stringify(citations));

    // Track event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ai_content_cited', {
        event_category: 'GEO',
        event_label: type,
        custom_parameter: content.substring(0, 100)
      });
    }
  };

  return { markAsCited };
};