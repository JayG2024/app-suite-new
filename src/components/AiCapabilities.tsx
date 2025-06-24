
import { Sparkles, Clock, DollarSign, Shield, Zap } from "lucide-react";

const AiCapabilities = () => {
  const capabilities = [
    {
      title: "10x Faster Development",
      description: "AI-powered code generation and automated testing accelerates development from months to weeks",
      icon: Clock,
    },
    {
      title: "Lower Costs",
      description: "Automated workflows and intelligent optimization reduce development costs by up to 70%",
      icon: DollarSign,
    },
    {
      title: "Superior Quality",
      description: "AI-assisted code review and testing ensures enterprise-grade quality with fewer bugs",
      icon: Shield,
    },
    {
      title: "Future-Scalable",
      description: "Built with modern architecture patterns that scale seamlessly as your business grows",
      icon: Zap,
    },
  ];

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-transparent">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-primary font-medium text-sm mb-4">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Development Process</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">How We Build Your Apps 10x Better</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We use cutting-edge AI tools from OpenAI, Anthropic, and Google to revolutionize our development process, 
            delivering faster, cheaper, and higher-quality custom applications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((capability, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                <capability.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{capability.title}</h3>
              <p className="text-muted-foreground">{capability.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Our AI-powered development process enables us to deliver better apps at competitive pricing
          </p>
          <div className="inline-flex gap-4 justify-center">
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-6 py-3">
              <p className="font-medium text-gray-700">Standard Apps</p>
              <p className="text-2xl font-bold text-gray-900">$5,000</p>
            </div>
            <div className="bg-primary/5 border border-primary/10 rounded-lg px-6 py-3">
              <p className="font-medium text-primary">AI-Enhanced Apps</p>
              <p className="text-2xl font-bold text-primary">$7,500</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiCapabilities;
