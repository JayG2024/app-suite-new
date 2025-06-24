import { useState } from "react";
import { Briefcase, MapPin, Clock, Users, Zap, Heart, Globe, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEO from "@/components/SEO";

const Careers = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const positions = [
    {
      id: 1,
      title: "Senior AI Software Engineer",
      department: "Engineering",
      location: "Remote (US/Canada)",
      type: "Full-time",
      experience: "5+ years",
      description: "Lead the development of AI-powered business applications using modern frameworks and machine learning technologies.",
      requirements: [
        "5+ years of full-stack development experience",
        "Experience with React, Node.js, and TypeScript",
        "Knowledge of AI/ML frameworks (TensorFlow, PyTorch)",
        "Experience with cloud platforms (AWS, Google Cloud)",
        "Strong understanding of software architecture patterns"
      ],
      responsibilities: [
        "Design and implement AI-powered features for business applications",
        "Collaborate with product team to define technical requirements",
        "Mentor junior developers and conduct code reviews",
        "Optimize application performance and scalability",
        "Stay current with emerging AI and software development trends"
      ],
      skills: ["React", "Node.js", "TypeScript", "AI/ML", "AWS"],
      salary: "$140,000 - $180,000"
    },
    {
      id: 2,
      title: "Product Manager - AI Applications",
      department: "Product",
      location: "Remote or San Francisco, CA",
      type: "Full-time",
      experience: "3-5 years",
      description: "Drive product strategy and roadmap for our suite of AI-powered business applications.",
      requirements: [
        "3-5 years of product management experience",
        "Experience with B2B SaaS products",
        "Understanding of AI/ML capabilities and limitations",
        "Strong analytical and data-driven decision making skills",
        "Excellent communication and stakeholder management"
      ],
      responsibilities: [
        "Define product vision and strategy for AI business applications",
        "Gather and analyze customer feedback and market research",
        "Work with engineering to prioritize features and enhancements",
        "Create product specifications and user stories",
        "Monitor product metrics and drive continuous improvement"
      ],
      skills: ["Product Strategy", "B2B SaaS", "AI/ML", "Analytics", "Agile"],
      salary: "$120,000 - $160,000"
    },
    {
      id: 3,
      title: "Customer Success Engineer",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      experience: "2-4 years",
      description: "Help customers maximize value from our AI-powered business applications through technical guidance and support.",
      requirements: [
        "2-4 years in customer success or technical support",
        "Technical background with ability to understand software",
        "Experience with B2B software implementations",
        "Strong problem-solving and communication skills",
        "Customer-focused mindset with empathy"
      ],
      responsibilities: [
        "Onboard new customers and ensure successful implementations",
        "Provide technical guidance and best practices",
        "Identify expansion opportunities and reduce churn",
        "Collaborate with product team on customer feedback",
        "Create documentation and training materials"
      ],
      skills: ["Customer Success", "Technical Support", "B2B Software", "Training", "Documentation"],
      salary: "$80,000 - $110,000"
    },
    {
      id: 4,
      title: "AI Research Scientist",
      department: "Research",
      location: "Remote or Research Lab",
      type: "Full-time",
      experience: "PhD or 5+ years",
      description: "Research and develop cutting-edge AI technologies to enhance our business application suite.",
      requirements: [
        "PhD in Computer Science, AI, or related field OR 5+ years research experience",
        "Deep expertise in machine learning and neural networks",
        "Experience with research publication and collaboration",
        "Proficiency in Python, TensorFlow/PyTorch",
        "Strong mathematical and statistical background"
      ],
      responsibilities: [
        "Conduct research on advanced AI techniques for business applications",
        "Develop prototypes and proof-of-concepts for new features",
        "Collaborate with engineering team to implement research findings",
        "Publish research papers and represent company at conferences",
        "Stay current with latest AI research and industry trends"
      ],
      skills: ["AI Research", "Machine Learning", "Python", "TensorFlow", "Research"],
      salary: "$160,000 - $220,000"
    },
    {
      id: 5,
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "3-5 years",
      description: "Build and maintain infrastructure for scalable AI-powered applications with high availability.",
      requirements: [
        "3-5 years of DevOps or infrastructure experience",
        "Experience with cloud platforms (AWS, Google Cloud, Azure)",
        "Knowledge of containerization (Docker, Kubernetes)",
        "Infrastructure as Code experience (Terraform, CloudFormation)",
        "Strong understanding of CI/CD pipelines"
      ],
      responsibilities: [
        "Design and maintain scalable cloud infrastructure",
        "Implement monitoring, logging, and alerting systems",
        "Automate deployment and infrastructure management",
        "Ensure security and compliance best practices",
        "Optimize costs and performance of cloud resources"
      ],
      skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD"],
      salary: "$110,000 - $150,000"
    },
    {
      id: 6,
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      experience: "3-5 years",
      description: "Design intuitive user experiences for complex AI-powered business applications.",
      requirements: [
        "3-5 years of UX/UI design experience",
        "Experience designing B2B applications",
        "Proficiency in Figma, Sketch, or similar tools",
        "Understanding of design systems and accessibility",
        "Experience with user research and testing"
      ],
      responsibilities: [
        "Design user-friendly interfaces for complex business applications",
        "Conduct user research and usability testing",
        "Create and maintain design systems and component libraries",
        "Collaborate with product and engineering teams",
        "Advocate for user-centered design principles"
      ],
      skills: ["UX Design", "UI Design", "Figma", "User Research", "Design Systems"],
      salary: "$90,000 - $130,000"
    }
  ];

  const benefits = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision insurance. Mental health support and wellness stipend."
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: "Remote-First Culture",
      description: "Work from anywhere with flexible hours. Annual team retreats and coworking stipends."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-500" />,
      title: "Growth & Learning",
      description: "$2,000 annual learning budget, conference attendance, and mentorship programs."
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Equity & Ownership",
      description: "Competitive equity package and profit-sharing to align with company success."
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-500" />,
      title: "Work-Life Balance",
      description: "Unlimited PTO, parental leave, and sabbatical opportunities after 3 years."
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Cutting-Edge Tech",
      description: "Latest equipment, tools, and technologies. Home office setup stipend."
    }
  ];

  const filteredPositions = selectedDepartment === "all" 
    ? positions 
    : positions.filter(pos => pos.department.toLowerCase() === selectedDepartment);

  const departments = ["all", "engineering", "product", "customer success", "research", "design"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <SEO title="Careers - Join the App Suite Team" description="Explore career opportunities at App Suite. Join our team of AI developers, designers, and business strategists building the future of custom software development." />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Join the Future of Business AI</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Help us revolutionize how businesses operate with intelligent, custom applications. 
            Build the next generation of AI-powered tools that make work more efficient and meaningful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => document.getElementById('positions')?.scrollIntoView({ behavior: 'smooth' })}>
              View Open Positions
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
              Learn About Our Culture
            </Button>
          </div>
        </div>
      </div>

      {/* Company Culture */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Jaydus?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're not just building software – we're crafting the future of how businesses operate. 
              Join a team that values innovation, collaboration, and meaningful impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>

          {/* Company Stats */}
          <div className="bg-gradient-to-r from-primary/10 to-blue/10 rounded-lg p-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Team Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">200+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Employee Satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">$120M</div>
                <div className="text-sm text-muted-foreground">Client Savings Generated</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div id="positions" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
            <p className="text-lg text-muted-foreground">
              Find your next career opportunity with us
            </p>
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {departments.map((dept) => (
              <Button
                key={dept}
                variant={selectedDepartment === dept ? "default" : "outline"}
                onClick={() => setSelectedDepartment(dept)}
                className="capitalize"
              >
                {dept === "all" ? "All Departments" : dept}
              </Button>
            ))}
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {filteredPositions.map((position) => (
              <Card key={position.id} className="p-6 hover:shadow-lg transition-shadow">
                <Tabs defaultValue="overview" className="w-full">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">{position.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary">{position.department}</Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {position.location}
                        </Badge>
                        <Badge variant="outline">{position.type}</Badge>
                        <Badge variant="outline">{position.experience}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-primary mb-2">{position.salary}</div>
                      <Button>Apply Now</Button>
                    </div>
                  </div>

                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="requirements">Requirements</TabsTrigger>
                    <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <p className="text-muted-foreground">{position.description}</p>
                    <div>
                      <h4 className="font-semibold mb-2">Key Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {position.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="requirements">
                    <ul className="space-y-2">
                      {position.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>

                  <TabsContent value="responsibilities">
                    <ul className="space-y-2">
                      {position.responsibilities.map((resp, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Application Process */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Hiring Process</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We believe in a transparent, fair, and efficient hiring process that respects your time while helping us find the best fit.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Application Review</h3>
              <p className="text-sm text-muted-foreground">We review your application within 3-5 business days</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Initial Call</h3>
              <p className="text-sm text-muted-foreground">30-minute call to discuss your background and our role</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Technical Interview</h3>
              <p className="text-sm text-muted-foreground">Role-specific interview with team members</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Final Decision</h3>
              <p className="text-sm text-muted-foreground">Reference check and offer within 2 business days</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't See the Right Position?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            We're always looking for exceptional talent to join our team. 
            Send us your resume and we'll keep you in mind for future opportunities that match your skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Send Us Your Resume
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
              Join Our Talent Network
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;