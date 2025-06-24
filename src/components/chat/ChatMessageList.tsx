
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import type { Message } from "@/hooks/useChatMessages";

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
  onOptionClick?: (option: string) => void;
}

export const ChatMessageList = ({ messages, isLoading, onOptionClick }: ChatMessageListProps) => {
  return (
    <ScrollArea className="flex-1 p-2 sm:p-3 md:p-4 w-full max-h-[calc(100vh-120px)]">
      <div className="space-y-4 w-full pr-1">
        {messages.map((message, i) => (
          <ChatMessage
            key={i}
            role={message.role}
            content={message.content}
            isFirst={message.role === "assistant" && i === 0}
            onOptionClick={onOptionClick}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-lg px-4 py-2 bg-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
