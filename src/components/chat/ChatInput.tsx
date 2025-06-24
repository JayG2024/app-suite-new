
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ChatInput = ({ input, isLoading, onInputChange, onSubmit }: ChatInputProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnimating(true);
    onSubmit(e);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about our AI solutions..."
          className="min-h-[80px]"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading || !input.trim()}
          className="transition-transform"
          style={{ transform: isAnimating ? 'translateX(4px)' : 'none' }}
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
