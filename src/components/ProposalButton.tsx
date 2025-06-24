import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import ProposalGenerator from "./ProposalGenerator";

interface ProposalButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

const ProposalButton = ({ 
  variant = "default", 
  size = "lg", 
  className = "",
  children 
}: ProposalButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        variant={variant}
        size={size}
        className={`${className}`}
        onClick={() => setIsModalOpen(true)}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {children || "Generate Custom Proposal"}
      </Button>
      
      <ProposalGenerator 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default ProposalButton;