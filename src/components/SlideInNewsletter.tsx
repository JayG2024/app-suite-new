
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Newsletter from "@/components/Newsletter";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface SlideInNewsletterProps {
  scrollThreshold?: number; // Percentage of page height to trigger (0-100)
  dismissDays?: number; // Number of days to wait before showing again after dismissal
}

const SlideInNewsletter = ({
  scrollThreshold = 50, // Default to 50% scroll
  dismissDays = 7 // Default to 7 days
}: SlideInNewsletterProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useLocalStorage("newsletter-dismissed", false);
  const [dismissedDate, setDismissedDate] = useLocalStorage("newsletter-dismissed-date", "");
  const newsletterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if we should show based on dismissal status
    const shouldShowAgain = () => {
      if (!isDismissed) return true;
      if (!dismissedDate) return false;
      
      const lastDismissed = new Date(dismissedDate);
      const currentDate = new Date();
      const daysSinceDismissed = Math.floor((currentDate.getTime() - lastDismissed.getTime()) / (1000 * 60 * 60 * 24));
      
      return daysSinceDismissed >= dismissDays;
    };

    if (!shouldShowAgain()) {
      return;
    }

    const handleScroll = () => {
      if (isDismissed && !shouldShowAgain()) return;
      
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Calculate scroll percentage (0-100)
      const scrollPercentage = scrollPosition / (documentHeight - windowHeight) * 100;
      
      if (scrollPercentage >= scrollThreshold && !isVisible) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed, dismissedDate, dismissDays, isVisible, scrollThreshold]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    setDismissedDate(new Date().toISOString());
  };

  const handleSubscribed = () => {
    // Hide for a longer period after successful subscription
    setIsVisible(false);
    setIsDismissed(true);
    setDismissedDate(new Date().toISOString());
  };

  if (!isVisible) return null;

  return (
    <div 
      ref={newsletterRef}
      className="fixed bottom-6 right-6 z-50 max-w-md w-full transform transition-all duration-500 ease-in-out translate-y-0 opacity-100 shadow-xl"
      style={{
        animation: "slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both"
      }}
    >
      <div className="rounded-lg border border-border p-6 relative bg-gray-950">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors" 
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2 text-slate-50">Stay Updated</h3>
          <p className="text-gray-400">
            Subscribe to our newsletter for the latest product updates, industry insights, and AI trends.
          </p>
        </div>
        
        <Newsletter variant="inline" className="mt-4" onSubscribed={handleSubscribed} />
      </div>

      <style>{`
        @keyframes slide-in-bottom {
          0% {
            transform: translateY(1000px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default SlideInNewsletter;
