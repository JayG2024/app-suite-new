
import { Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ChatMessageList } from "./chat/ChatMessageList";
import { ChatInput } from "./chat/ChatInput";
import { ChatContactForm } from "./chat/ChatContactForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChatMessages } from "@/hooks/useChatMessages";

const ChatSidebar = () => {
  const {
    messages,
    input,
    isLoading,
    showContactForm,
    setShowContactForm,
    handleInputChange,
    handleSubmit,
    handleOptionClick,
  } = useChatMessages();
  const isMobile = useIsMobile();

  return (
    <Sidebar className={`${isMobile ? "w-full max-w-[300px]" : ""} border-r`}>
      <SidebarHeader className="border-b p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
          <div>
            <h2 className="text-base sm:text-lg font-semibold">AI App Assistant</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Get personalized solutions for your business</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="flex h-full flex-col">
          <ChatMessageList 
            messages={messages} 
            isLoading={isLoading} 
            onOptionClick={handleOptionClick}
          />
          <ChatInput
            input={input}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
          <ChatContactForm 
            isOpen={showContactForm} 
            onClose={() => setShowContactForm(false)} 
          />
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default ChatSidebar;
