
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Message } from "@/hooks/useChatMessages";
import { parseLinks } from "@/utils/linkUtils";

interface ChatMessageProps {
  role: Message["role"];
  content: string;
  isFirst?: boolean;
  onOptionClick?: (option: string) => void;
}

export const ChatMessage = ({ 
  role, 
  content, 
  isFirst,
  onOptionClick
}: ChatMessageProps) => {
  // Check if this is the welcome message from the assistant
  const isWelcomeMessage = role === "assistant" && isFirst;
  
  // Handle the welcome message differently
  if (isWelcomeMessage) {
    const options = [
      "Learn about our AI-powered business solutions",
      "Schedule a demo",
      "Get pricing information",
      "Find technical documentation"
    ];
    
    return (
      <div className="flex justify-start w-full">
        <div className="rounded-lg px-3 py-2 max-w-full bg-muted">
          <div className="flex items-center gap-1 font-semibold mb-2">
            <Sparkles className="h-3 w-3" />
            <span>AI App Assistant</span>
          </div>
          
          <p className="mb-3">Hi there! I'm your AI Assistant. I can help you:</p>
          
          <div className="flex flex-col gap-2 mt-2 w-full">
            {options.map((option, index) => (
              <Button 
                key={index}
                variant="outline"
                size="sm"
                className="justify-start text-left hover:bg-primary hover:text-primary-foreground text-xs md:text-sm w-full whitespace-normal h-auto py-2"
                onClick={() => onOptionClick && onOptionClick(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Parse any markdown links in the message content
  const parsedContent = parseLinks(content);
  
  // Handle regular messages with parsed links
  return (
    <div className={`flex ${role === "assistant" ? "justify-start" : "justify-end"} w-full`}>
      <div
        className={`rounded-lg px-4 py-2 max-w-[90%] ${
          role === "assistant"
            ? "bg-muted"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {role === "assistant" && isFirst && (
          <div className="flex items-center gap-1 font-semibold mb-1">
            <Sparkles className="h-3 w-3" />
            <span>AI App Assistant</span>
          </div>
        )}
        {parsedContent}
      </div>
    </div>
  );
};
