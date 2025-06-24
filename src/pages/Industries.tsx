import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { 
  Building2, 
  ShoppingCart, 
  Heart, 
  GraduationCap, 
  Hammer, 
  Home,
  Car,
  Utensils,
  Briefcase,
  Users,
  Factory,
  Truck,
  Plane,
  Shield,
  Landmark,
  Palette,
  Music,
  Gamepad,
  Dumbbell,
  Leaf,
  Cpu,
  ArrowRight
} from "lucide-react";

const Industries = () => {
  const navigate = useNavigate();

  const industries = [
    {
      name: "Finance & Banking",
      icon: Landmark,
      description: "Automated invoicing, budget analysis, and financial forecasting",
      examples: ["Banks", "Credit Unions", "Investment Firms", "Insurance Companies"],
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      name: "Healthcare & Medical",
      icon: Heart,
      description: "Patient management, appointment scheduling, and medical records",
      examples: ["Hospitals", "Clinics", "Dental Practices", "Pharmacies"],
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      name: "Retail & E-commerce",
      icon: ShoppingCart,
      description: "Inventory management, customer analytics, and sales automation",
      examples: ["Online Stores", "Retail Chains", "Boutiques", "Marketplaces"],
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      name: "Education & Training",
      icon: GraduationCap,
      description: "Student management, course delivery, and learning analytics",
      examples: ["Schools", "Universities", "Training Centers", "Online Courses"],
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      name: "Construction & Real Estate",
      icon: Hammer,
      description: "Project management, contractor coordination, and property tracking",
      examples: ["Builders", "Contractors", "Real Estate Agencies", "Property Management"],
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    {
      name: "Manufacturing & Supply Chain",
      icon: Factory,
      description: "Production planning, inventory control, and supply chain optimization",
      examples: ["Factories", "Warehouses", "Distribution Centers", "Suppliers"],
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    },
    {
      name: "Professional Services",
      icon: Briefcase,
      description: "Client management, project tracking, and billing automation",
      examples: ["Law Firms", "Accounting Firms", "Consultancies", "Marketing Agencies"],
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      name: "Hospitality & Tourism",
      icon: Home,
      description: "Booking management, guest services, and revenue optimization",
      examples: ["Hotels", "Restaurants", "Travel Agencies", "Event Venues"],
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      name: "Transportation & Logistics",
      icon: Truck,
      description: "Fleet management, route optimization, and delivery tracking",
      examples: ["Shipping Companies", "Trucking Firms", "Courier Services", "Logistics Providers"],
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    },
    {
      name: "Technology & Software",
      icon: Cpu,
      description: "Development tracking, customer support, and product analytics",
      examples: ["SaaS Companies", "IT Services", "Software Developers", "Tech Startups"],
      color: "text-cyan-600",
      bgColor: "bg-cyan-50"
    },
    {
      name: "Non-Profit & NGO",
      icon: Users,
      description: "Donor management, volunteer coordination, and impact tracking",
      examples: ["Charities", "Foundations", "Community Organizations", "Religious Groups"],
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      name: "Entertainment & Media",
      icon: Music,
      description: "Content management, audience analytics, and revenue tracking",
      examples: ["Media Companies", "Production Houses", "Gaming Studios", "Publishers"],
      color: "text-violet-600",
      bgColor: "bg-violet-50"
    },
    {
      name: "Automotive",
      icon: Car,
      description: "Service scheduling, parts inventory, and customer management",
      examples: ["Dealerships", "Service Centers", "Parts Suppliers", "Fleet Managers"],
      color: "text-slate-600",
      bgColor: "bg-slate-50"
    },
    {
      name: "Agriculture & Farming",
      icon: Leaf,
      description: "Crop management, supply tracking, and distribution planning",
      examples: ["Farms", "Agricultural Suppliers", "Food Processors", "Distributors"],
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      name: "Sports & Fitness",
      icon: Dumbbell,
      description: "Member management, class scheduling, and performance tracking",
      examples: ["Gyms", "Sports Clubs", "Fitness Studios", "Athletic Teams"],
      color: "text-rose-600",
      bgColor: "bg-rose-50"
    },
  ];

  return (
    <div className="py-12 px-4">
      <SEO title="Industries - Custom Software for Every Business Sector" description="Discover how App Suite builds custom software solutions for various industries including healthcare, education, manufacturing, retail, finance, and professional services." />
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Solutions for Every <span className="text-primary">Industry</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Custom AI-powered applications tailored to your industry's unique needs. 
            No matter your sector, we build solutions that drive efficiency and growth.
          </p>
          <Button size="lg" onClick={() => navigate('/get-started')} className="font-semibold">
            Get Industry-Specific Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Industries Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {industries.map((industry, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => navigate('/contact')}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${industry.bgColor} group-hover:scale-110 transition-transform`}>
                    <industry.icon className={`h-6 w-6 ${industry.color}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{industry.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{industry.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Common Use Cases:</p>
                  <div className="flex flex-wrap gap-2">
                    {industry.examples.map((example, i) => (
                      <span key={i} className="text-xs bg-muted px-2 py-1 rounded-md">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Don't See Your Industry?
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            No problem! We build custom solutions for any business type. 
            Our AI-powered development process adapts to your unique requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/contact')}>
              Discuss Your Industry
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/apps')}>
              Browse All Applications
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">15+</div>
            <div className="text-sm text-muted-foreground">Industries Served</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Applications Built</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-muted-foreground">Custom Solutions</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">14</div>
            <div className="text-sm text-muted-foreground">Days to Deploy</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Industries;