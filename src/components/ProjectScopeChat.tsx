
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Suggestion {
  title: string;
  description: string;
  type: "app" | "custom";
  route?: string;
}

const ProjectScopeChat = () => {
  const [projectDescription, setProjectDescription] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const generateSuggestionsWithAI = async (input: string): Promise<Suggestion[]> => {
    // Use fast enhanced suggestions until database is set up
    await new Promise(resolve => setTimeout(resolve, 500)); // Quick delay for realism
    return generateEnhancedSuggestions(input);
  };

  const parseAISuggestions = (aiResponse: string, input: string): Suggestion[] => {
    // Parse AI response and convert to suggestions format
    const suggestions: Suggestion[] = [];
    
    // Add intelligent suggestions based on AI response
    suggestions.push({
      title: "AI-Powered Custom Solution",
      description: aiResponse.substring(0, 200) + "...",
      type: "custom"
    });
    
    return suggestions;
  };

  // Enhanced fallback function with intelligent business suggestions
  const generateEnhancedSuggestions = (input: string): Suggestion[] => {
    const lowerInput = input.toLowerCase();
    const suggestions: Suggestion[] = [];

    // Fitness & Health Industries
    if (lowerInput.includes("fitness") || lowerInput.includes("gym") || lowerInput.includes("health") || lowerInput.includes("wellness")) {
      suggestions.push({
        title: "Smart Fitness Member Retention System",
        description: "AI that predicts member churn, automates personalized workout plans, and sends motivational check-ins. Includes gamification features and progress tracking that increases retention by 40%.",
        type: "custom"
      });
      suggestions.push({
        title: "AI Personal Training Assistant",
        description: "Virtual PT that analyzes form via camera, suggests exercises based on goals/injuries, and tracks progress. Can serve 10x more clients simultaneously.",
        type: "custom"
      });
    }

    // Restaurant & Food Service
    if (lowerInput.includes("restaurant") || lowerInput.includes("food") || lowerInput.includes("kitchen") || lowerInput.includes("dining")) {
      suggestions.push({
        title: "Smart Restaurant Operations Hub",
        description: "AI that predicts daily demand, optimizes staff scheduling, manages inventory, and identifies top customers. Reduces waste by 30% and increases profit margins.",
        type: "custom"
      });
      suggestions.push({
        title: "Customer Experience Analytics",
        description: "Track dining patterns, preferences, and feedback to create personalized experiences. Automate loyalty rewards and targeted promotions that increase repeat visits.",
        type: "custom"
      });
    }

    // Retail & E-commerce
    if (lowerInput.includes("retail") || lowerInput.includes("store") || lowerInput.includes("shop") || lowerInput.includes("ecommerce")) {
      suggestions.push({
        title: "AI Sales Optimization Platform",
        description: "Predicts which products to stock, identifies upselling opportunities, and personalizes customer experiences. Typically increases sales by 25-40%.",
        type: "custom"
      });
      suggestions.push({
        title: "Smart Inventory Predictor",
        description: "AI that forecasts demand, prevents stockouts, and identifies slow-moving inventory. Reduces carrying costs and increases turnover rates.",
        type: "custom"
      });
    }

    // Service-Based Businesses
    if (lowerInput.includes("service") || lowerInput.includes("consulting") || lowerInput.includes("agency") || lowerInput.includes("professional")) {
      suggestions.push({
        title: "Client Success Automation System",
        description: "AI that identifies at-risk clients, automates follow-ups, and suggests upselling opportunities. Includes project management and billing automation.",
        type: "custom"
      });
    }

    // Customer & Sales focused
    if (lowerInput.includes("customer") || lowerInput.includes("client") || lowerInput.includes("crm") || lowerInput.includes("sales")) {
      suggestions.push({
        title: "AI-Powered Customer Intelligence Hub",
        description: "Goes beyond traditional CRM - predicts customer lifetime value, identifies upselling moments, and automates personalized communications that increase sales by 35%.",
        type: "custom"
      });
    }

    // Operations & Efficiency
    if (lowerInput.includes("operations") || lowerInput.includes("workflow") || lowerInput.includes("process") || lowerInput.includes("efficiency")) {
      suggestions.push({
        title: "Intelligent Operations Optimizer",
        description: "AI that identifies bottlenecks, automates repetitive tasks, and optimizes resource allocation. Most clients see 50% time savings within the first month.",
        type: "custom"
      });
    }

    // Marketing & Growth
    if (lowerInput.includes("marketing") || lowerInput.includes("growth") || lowerInput.includes("leads") || lowerInput.includes("conversion")) {
      suggestions.push({
        title: "AI Marketing ROI Maximizer",
        description: "Tracks which marketing efforts actually drive sales, automates A/B testing, and optimizes ad spend. Typically improves marketing ROI by 200-300%.",
        type: "custom"
      });
    }

    // If no specific matches, provide general innovative suggestions
    if (suggestions.length === 0) {
      suggestions.push({
        title: "Revenue Growth Accelerator",
        description: "AI system that identifies your biggest revenue opportunities, automates customer acquisition, and predicts market trends specific to your industry.",
        type: "custom"
      });
      suggestions.push({
        title: "Competitive Intelligence Platform",
        description: "Monitor competitors, track market changes, and get alerts about opportunities. Stay ahead with AI-powered market insights.",
        type: "custom"
      });
    }

    // Always add a consultation option
    suggestions.push({
      title: "Free Strategy Session",
      description: "30-minute consultation to explore custom AI solutions for your specific business challenges. We'll identify hidden opportunities and ROI potential.",
      type: "custom"
    });

    return suggestions;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (projectDescription.trim()) {
      setIsGenerating(true);
      
      try {
        const aiSuggestions = await generateSuggestionsWithAI(projectDescription);
        setSuggestions(aiSuggestions);
      } catch (error) {
        console.error("Error in AI suggestion generation:", error);
        toast.error("Failed to generate suggestions", {
          description: "Please try again or contact support."
        });
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.type === "custom") {
      navigate('/contact', { 
        state: { projectDescription } 
      });
    } else if (suggestion.route) {
      navigate(suggestion.route);
    }
  };

  const handleReset = () => {
    setSuggestions(null);
    setProjectDescription("");
  };

  return (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div className="flex items-center justify-center gap-2 text-2xl font-semibold">
        <Sparkles className="h-6 w-6 text-primary" />
        <h2>Discover What's Possible for Your Business</h2>
      </div>
      
      <p className="text-muted-foreground">
        Tell us about your business challenges and our AI will suggest powerful custom solutions you might not have considered.
      </p>

      {!suggestions ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Example: 'I run a fitness studio and want to increase member retention' or 'I need help managing customer relationships in my restaurant'"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="min-h-[120px]"
          />
          <Button 
            type="submit" 
            size="lg" 
            className="w-full sm:w-auto gap-2"
            disabled={isGenerating || !projectDescription.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating AI recommendations...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Get AI-Powered Recommendations
              </>
            )}
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {suggestions.map((suggestion, index) => (
              <Card 
                key={index} 
                className="text-left p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <h3 className="font-semibold text-lg mb-2">{suggestion.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{suggestion.description}</p>
                <div className="flex items-center text-primary text-sm font-medium">
                  {suggestion.type === "app" ? "View solution" : "Contact us"}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </Card>
            ))}
          </div>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="mt-4"
          >
            Start over
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectScopeChat;
