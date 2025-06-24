import { useState } from "react";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface NewsletterProps {
  className?: string;
  variant?: "default" | "inline";
  onSubscribed?: () => void;
}

const Newsletter = ({
  className,
  variant = "default",
  onSubscribed
}: NewsletterProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Send newsletter subscription via Resend
      const response = await fetch('/.netlify/functions/send-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: variant === "inline" ? "slide_in" : "main_form"
        })
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      toast({
        title: "Subscription successful!",
        description: "Welcome to App Suite Insider! Check your email for a welcome message."
      });
      
      setEmail("");

      // Call the onSubscribed callback if provided
      if (onSubscribed) {
        onSubscribed();
      }
      
    } catch (error: unknown) {
      console.error("Newsletter subscription error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Subscription failed",
        description: "Failed to subscribe. Please try again or email us at jason@jaydus.ai.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === "inline") {
    return <div className={`${className || ""}`}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required className="flex-1" />
          <Button type="submit" disabled={isSubmitting} className="bg-gray-800 hover:bg-gray-700">
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </div>;
  }
  
  return <div className={`bg-muted/50 rounded-lg p-6 ${className || ""}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/10 p-2 rounded-full">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Subscribe to our newsletter</h3>
      </div>
      <p className="text-muted-foreground mb-4">
        Stay updated with the latest insights, product news, and industry trends.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    </div>;
};

export default Newsletter;