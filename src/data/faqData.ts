export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
}

export const faqData: FAQ[] = [
  // Getting Started
  {
    id: "getting-started-1",
    category: "Getting Started",
    question: "What is App Suite and what do you offer?",
    answer: "App Suite by Jaydus Inc specializes in building custom AI-powered business applications at flat-rate pricing. We create tailored solutions for Finance, Customer Management, Operations, and Marketing - delivered in just 30 days with full customization included.",
    tags: ["overview", "services", "custom apps"]
  },
  {
    id: "getting-started-2",
    category: "Getting Started",
    question: "How do I get started with App Suite?",
    answer: "Getting started is simple: 1) Schedule a free consultation to discuss your needs, 2) We'll recommend the best applications for your business, 3) Choose your package and sign the agreement, 4) Our team builds your custom application in 30 days, 5) We handle setup, training, and ongoing support.",
    tags: ["onboarding", "process", "consultation"]
  },
  {
    id: "getting-started-3",
    category: "Getting Started",
    question: "Do you offer demos of your applications?",
    answer: "Yes! We provide personalized demos tailored to your business needs. During the demo, we'll show you relevant applications from our suite and discuss how they can be customized for your specific requirements. Schedule a demo through our contact form or chat.",
    tags: ["demo", "consultation", "preview"]
  },

  // Pricing
  {
    id: "pricing-1",
    category: "Pricing",
    question: "What are your pricing plans?",
    answer: "We offer transparent flat-rate pricing: Full Applications cost $5,000 each (includes customization, setup, and training), Mini Tools cost $2,500 each (focused solutions for specific tasks). All prices include implementation, data migration support, team training, and ongoing support.",
    tags: ["pricing", "cost", "flat-rate"]
  },
  {
    id: "pricing-2",
    category: "Pricing",
    question: "Are there any hidden fees or ongoing costs?",
    answer: "No hidden fees! Our flat-rate pricing includes everything: development, customization, implementation, data migration, team training, and ongoing support. You only pay the upfront cost for each application. We believe in transparent pricing with no surprises.",
    tags: ["pricing", "fees", "transparency"]
  },
  {
    id: "pricing-3",
    category: "Pricing",
    question: "Do you offer payment plans or financing?",
    answer: "Yes, we offer flexible payment options including installment plans for larger projects. We can discuss payment terms during your consultation to find an arrangement that works for your budget and cash flow needs.",
    tags: ["pricing", "payment", "financing"]
  },
  {
    id: "pricing-4",
    category: "Pricing",
    question: "What's the difference between Full Applications and Mini Tools?",
    answer: "Full Applications ($5,000) are comprehensive solutions with multiple features, full customization, and complete workflow management. Mini Tools ($2,500) are focused solutions that address specific business tasks or processes. Both include full implementation and support.",
    tags: ["pricing", "applications", "tools", "comparison"]
  },

  // Applications & Services
  {
    id: "apps-1",
    category: "Applications & Services",
    question: "What types of applications can you build?",
    answer: "We build ANY type of custom business application you need. From simple task automation tools to complex enterprise systems, we create tailored solutions that match your exact requirements. Whether it's CRM systems, financial tools, inventory management, workflow automation, customer portals, or any other business application - if you can imagine it, we can build it. Everything is custom-coded from scratch specifically for your business.",
    tags: ["applications", "categories", "custom development"]
  },
  {
    id: "apps-2",
    category: "Applications & Services",
    question: "Can you integrate with our existing software?",
    answer: "Absolutely! Our applications are designed to integrate seamlessly with your existing software ecosystem. We work with popular platforms like Salesforce, QuickBooks, Slack, Microsoft 365, Google Workspace, and many others. We'll assess your current setup during consultation.",
    tags: ["integration", "existing software", "compatibility"]
  },
  {
    id: "apps-3",
    category: "Applications & Services",
    question: "How much customization is included?",
    answer: "Full customization is included in our flat-rate pricing. We tailor every application to match your specific business processes, branding, workflows, and requirements. This includes custom fields, automated workflows, reporting features, and user interface adjustments.",
    tags: ["customization", "tailoring", "workflows"]
  },
  {
    id: "apps-4",
    category: "Applications & Services",
    question: "Do you provide industry-specific solutions?",
    answer: "Yes! We have experience building applications for various industries including healthcare, manufacturing, e-commerce, professional services, and more. Each application is customized to meet industry-specific requirements and compliance needs.",
    tags: ["industry-specific", "compliance", "specialized"]
  },

  // Implementation & Support
  {
    id: "implementation-1",
    category: "Implementation & Support",
    question: "How long does implementation take?",
    answer: "Our standard implementation timeline is 30 days from project start to go-live. This includes development, customization, testing, data migration, setup, and team training. Complex integrations may require additional time, which we'll discuss upfront.",
    tags: ["timeline", "implementation", "delivery"]
  },
  {
    id: "implementation-2",
    category: "Implementation & Support",
    question: "What kind of training do you provide?",
    answer: "We provide comprehensive training for your team including: live training sessions, detailed user guides, video tutorials, and hands-on practice sessions. Training is included in our flat-rate pricing and continues until your team is confident using the application.",
    tags: ["training", "onboarding", "support"]
  },
  {
    id: "implementation-3",
    category: "Implementation & Support",
    question: "Do you help with data migration?",
    answer: "Yes! Data migration support is included in our service. We'll help transfer your existing data from spreadsheets, legacy systems, or other applications into your new custom application, ensuring data integrity and proper formatting.",
    tags: ["data migration", "transfer", "legacy systems"]
  },
  {
    id: "implementation-4",
    category: "Implementation & Support",
    question: "What ongoing support do you provide?",
    answer: "We provide 24/7 customer support, regular updates and improvements, technical assistance, and dedicated implementation team support. Our goal is to ensure your applications continue to serve your business effectively long-term.",
    tags: ["ongoing support", "maintenance", "updates"]
  },

  // Technical Questions
  {
    id: "technical-1",
    category: "Technical",
    question: "What technology do you use to build applications?",
    answer: "We use modern, enterprise-grade technologies including React, Node.js, TypeScript, and cloud infrastructure. Our applications are built with AI integration capabilities, responsive design, and scalable architecture to grow with your business.",
    tags: ["technology", "development", "architecture"]
  },
  {
    id: "technical-2",
    category: "Technical",
    question: "Are your applications cloud-based or on-premise?",
    answer: "Our applications are primarily cloud-based for maximum accessibility, security, and automatic updates. However, we can discuss on-premise or hybrid solutions if required by your organization's security or compliance requirements.",
    tags: ["cloud", "deployment", "hosting"]
  },
  {
    id: "technical-3",
    category: "Technical",
    question: "How do you handle data security and privacy?",
    answer: "Security is our top priority. We implement enterprise-grade security measures including data encryption, secure authentication, role-based access controls, regular security audits, and compliance with industry standards like GDPR and SOC 2.",
    tags: ["security", "privacy", "compliance"]
  },
  {
    id: "technical-4",
    category: "Technical",
    question: "Can applications be accessed on mobile devices?",
    answer: "Yes! All our applications are built with responsive design, ensuring they work seamlessly on desktop computers, tablets, and mobile phones. Your team can access their applications from anywhere with an internet connection.",
    tags: ["mobile", "responsive", "accessibility"]
  },

  // AI Integration
  {
    id: "ai-1",
    category: "AI Integration",
    question: "How do you incorporate AI into applications?",
    answer: "We integrate AI capabilities throughout our applications including intelligent data analysis, automated workflows, predictive insights, natural language processing, and smart recommendations. AI features are customized based on your specific business needs and data.",
    tags: ["AI", "automation", "intelligence"]
  },
  {
    id: "ai-2",
    category: "AI Integration",
    question: "Do I need technical knowledge to use AI features?",
    answer: "Not at all! Our AI features are designed to be user-friendly and intuitive. The AI works behind the scenes to provide insights, automate tasks, and enhance your workflows without requiring any technical expertise from your team.",
    tags: ["AI", "user-friendly", "no technical knowledge"]
  },
  {
    id: "ai-3",
    category: "AI Integration",
    question: "Can AI features be customized for our industry?",
    answer: "Absolutely! We train and customize AI features specifically for your industry and business processes. This includes industry-specific terminology, workflows, compliance requirements, and best practices to ensure maximum relevance and effectiveness.",
    tags: ["AI", "customization", "industry-specific"]
  },

  // Project Management
  {
    id: "project-1",
    category: "Project Management",
    question: "How do you manage projects and communication?",
    answer: "We use a structured project management approach with regular check-ins, milestone updates, and dedicated project managers. You'll have direct access to your project team and receive regular progress updates throughout the 2-week development cycle.",
    tags: ["project management", "communication", "updates"]
  },
  {
    id: "project-2",
    category: "Project Management",
    question: "What if I need changes during development?",
    answer: "We welcome feedback and minor adjustments during development. Our iterative approach allows for refinements based on your input. Major scope changes may affect timeline and cost, which we'll discuss transparently before proceeding.",
    tags: ["changes", "feedback", "flexibility"]
  },
  {
    id: "project-3",
    category: "Project Management",
    question: "Do you provide project documentation?",
    answer: "Yes! We provide comprehensive documentation including user guides, technical specifications, workflow diagrams, and administrator manuals. All documentation is customized for your specific application and business processes.",
    tags: ["documentation", "guides", "specifications"]
  },

  // Troubleshooting
  {
    id: "troubleshooting-1",
    category: "Troubleshooting",
    question: "What if something goes wrong with my application?",
    answer: "Our 24/7 support team is available to address any issues quickly. We provide multiple support channels including live chat, email, and phone support. Most issues are resolved within hours, and we guarantee rapid response times.",
    tags: ["troubleshooting", "support", "issues"]
  },
  {
    id: "troubleshooting-2",
    category: "Troubleshooting",
    question: "How do you handle application updates and maintenance?",
    answer: "Regular updates and maintenance are included in our ongoing support. We handle security updates, performance improvements, and feature enhancements automatically. You'll be notified of major updates in advance.",
    tags: ["updates", "maintenance", "improvements"]
  },
  {
    id: "troubleshooting-3",
    category: "Troubleshooting",
    question: "What if we need additional features later?",
    answer: "We can easily add new features to your existing applications. Additional customizations are priced transparently, and we'll provide a clear quote before starting any additional work. Our modular approach makes expansions straightforward.",
    tags: ["additional features", "expansion", "enhancements"]
  }
];

export const faqCategories = [
  "All",
  "Getting Started",
  "Pricing",
  "Applications & Services",
  "Implementation & Support",
  "Technical",
  "AI Integration",
  "Project Management",
  "Troubleshooting"
];

export function searchFAQs(query: string, category: string = "All"): FAQ[] {
  let filteredFAQs = faqData;
  
  if (category !== "All") {
    filteredFAQs = filteredFAQs.filter(faq => faq.category === category);
  }
  
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filteredFAQs = filteredFAQs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm) ||
      faq.answer.toLowerCase().includes(searchTerm) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
  
  return filteredFAQs;
}