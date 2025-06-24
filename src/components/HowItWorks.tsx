
import { CheckCircle2 } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Browse & Choose",
      description: "Browse our catalog of business applications and choose the one that fits your needs."
    },
    {
      number: 2,
      title: "Customize",
      description: "We'll work with you to customize the application to match your brand and specific business requirements."
    },
    {
      number: 3,
      title: "Deploy",
      description: "We'll set up and deploy your custom application so it's ready to use."
    },
    {
      number: 4,
      title: "Support",
      description: "Receive ongoing support and maintenance for your application."
    }
  ];

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8" id="how-it-works">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our straightforward process takes you from selection to a fully customized business application in just a few simple steps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div 
              key={step.number} 
              className="relative bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-3 mt-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

