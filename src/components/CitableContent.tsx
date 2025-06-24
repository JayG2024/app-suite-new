import React from 'react';
import { cn } from '@/lib/utils';

interface CitableContentProps {
  children: React.ReactNode;
  source?: string;
  author?: string;
  date?: string;
  type?: 'statistic' | 'quote' | 'fact' | 'finding' | 'claim';
  citation?: string;
  className?: string;
}

/**
 * CitableContent component wraps content with semantic markup that helps
 * AI systems identify authoritative, citable information.
 * Implements GEO best practices for citation optimization.
 */
const CitableContent: React.FC<CitableContentProps> = ({
  children,
  source = "App Suite",
  author = "Jason Gordon",
  date = new Date().toISOString().split('T')[0],
  type = 'fact',
  citation,
  className
}) => {
  // Generate unique ID for citation
  const citationId = `cite-${type}-${Date.now()}`;
  
  // Create structured data for the citation
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type === 'quote' ? "Quotation" : "Claim",
    "@id": `#${citationId}`,
    "text": typeof children === 'string' ? children : '',
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization", 
      "name": source
    },
    "datePublished": date,
    "citation": citation || `${source}, ${date}`
  };

  // Type-specific styling
  const typeStyles = {
    statistic: "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950",
    quote: "border-l-4 border-gray-400 bg-gray-50 dark:bg-gray-950 italic",
    fact: "border-l-4 border-green-500 bg-green-50 dark:bg-green-950",
    finding: "border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950",
    claim: "border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950"
  };

  return (
    <>
      {/* Structured data for AI crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Visible content with semantic markup */}
      <div
        id={citationId}
        className={cn(
          "citable-content p-4 my-4 rounded-r-lg",
          typeStyles[type],
          className
        )}
        data-citation-type={type}
        data-source={source}
        data-author={author}
        data-date={date}
        itemScope
        itemType={type === 'quote' ? "https://schema.org/Quotation" : "https://schema.org/Claim"}
      >
        <div itemProp="text" className="text-base leading-relaxed">
          {children}
        </div>
        
        {/* Citation footer */}
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <cite itemProp="citation">
            {citation || (
              <>
                <span itemProp="author" itemScope itemType="https://schema.org/Person">
                  <span itemProp="name">{author}</span>
                </span>
                {', '}
                <span itemProp="publisher" itemScope itemType="https://schema.org/Organization">
                  <span itemProp="name">{source}</span>
                </span>
                {', '}
                <time itemProp="datePublished" dateTime={date}>
                  {new Date(date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </time>
              </>
            )}
          </cite>
        </div>
      </div>
    </>
  );
};

// Specialized components for different content types
export const Statistic: React.FC<Omit<CitableContentProps, 'type'>> = (props) => (
  <CitableContent {...props} type="statistic" />
);

export const Quote: React.FC<Omit<CitableContentProps, 'type'>> = (props) => (
  <CitableContent {...props} type="quote" />
);

export const Fact: React.FC<Omit<CitableContentProps, 'type'>> = (props) => (
  <CitableContent {...props} type="fact" />
);

export const Finding: React.FC<Omit<CitableContentProps, 'type'>> = (props) => (
  <CitableContent {...props} type="finding" />
);

export const Claim: React.FC<Omit<CitableContentProps, 'type'>> = (props) => (
  <CitableContent {...props} type="claim" />
);

export default CitableContent;