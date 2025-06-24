
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Parses text containing markdown-style links [label](url) and converts them to React elements
 * @param text The text containing markdown links
 * @param className Optional CSS class to apply to links
 * @returns Array of text and link elements
 */
export const parseLinks = (text: string, className?: string): React.ReactNode[] => {
  if (!text) return [text];

  // Regular expression to match markdown-style links: [label](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  let lastIndex = 0;
  const result: React.ReactNode[] = [];
  let match;
  
  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      result.push(text.substring(lastIndex, match.index));
    }
    
    const [fullMatch, label, url] = match;
    const isExternal = url.startsWith('http');
    const linkClass = cn(
      "text-primary hover:underline inline-flex items-center",
      className
    );
    
    // Add the link component
    if (isExternal) {
      result.push(
        <a 
          key={match.index} 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className={linkClass}
        >
          {label}
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      );
    } else {
      result.push(
        <Link key={match.index} to={url} className={linkClass}>
          {label}
        </Link>
      );
    }
    
    lastIndex = match.index + fullMatch.length;
  }
  
  // Add any remaining text
  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }
  
  return result;
};
