export interface ProjectImportData {
  projectName: string;
  clientName: string;
  type: 'website' | 'webapp' | 'mobile' | 'ai' | 'integration' | 'consulting';
  status: 'planning' | 'development' | 'review' | 'completed' | 'on-hold';
  startDate: string;
  endDate: string;
  budget: number;
  description: string;
  teamMembers?: string[];
  technologies?: string[];
  progress?: number;
}

export const sampleProjects: ProjectImportData[] = [
  {
    projectName: "E-Commerce Platform Redesign",
    clientName: "TechStyle Fashion",
    type: "webapp",
    status: "development",
    startDate: "2025-01-15",
    endDate: "2025-02-28",
    budget: 7500,
    description: "Complete redesign of e-commerce platform with AI-powered recommendations",
    teamMembers: ["Sarah Chen", "Mike Johnson"],
    technologies: ["React", "Node.js", "Stripe", "OpenAI"],
    progress: 65
  },
  {
    projectName: "AI Customer Service Bot",
    clientName: "Global Support Inc",
    type: "ai",
    status: "completed",
    startDate: "2024-11-01",
    endDate: "2024-12-15",
    budget: 10000,
    description: "Custom AI chatbot with multi-language support and CRM integration",
    teamMembers: ["Alex Rivera", "Emma Watson"],
    technologies: ["Claude API", "Python", "FastAPI", "PostgreSQL"],
    progress: 100
  },
  {
    projectName: "Mobile Inventory Management",
    clientName: "WarehousePro",
    type: "mobile",
    status: "development",
    startDate: "2025-01-05",
    endDate: "2025-03-15",
    budget: 7500,
    description: "Cross-platform mobile app for real-time inventory tracking",
    teamMembers: ["David Kim", "Lisa Brown"],
    technologies: ["React Native", "Firebase", "QR Scanner"],
    progress: 40
  },
  {
    projectName: "Healthcare Patient Portal",
    clientName: "MediCare Solutions",
    type: "webapp",
    status: "planning",
    startDate: "2025-02-01",
    endDate: "2025-04-30",
    budget: 10000,
    description: "HIPAA-compliant patient portal with appointment scheduling and telemedicine",
    teamMembers: ["Sarah Chen", "Carlos Martinez"],
    technologies: ["Next.js", "Supabase", "Twilio", "Stripe"],
    progress: 10
  },
  {
    projectName: "Real Estate CRM Integration",
    clientName: "PropertyMax Realty",
    type: "integration",
    status: "review",
    startDate: "2024-12-10",
    endDate: "2025-01-20",
    budget: 5000,
    description: "Integration of multiple MLS feeds with custom CRM system",
    teamMembers: ["Mike Johnson"],
    technologies: ["Node.js", "API Integration", "MongoDB"],
    progress: 85
  },
  {
    projectName: "Restaurant Ordering System",
    clientName: "Bistro Central",
    type: "webapp",
    status: "completed",
    startDate: "2024-10-15",
    endDate: "2024-11-30",
    budget: 5000,
    description: "Online ordering system with kitchen display and delivery tracking",
    teamMembers: ["Emma Watson", "David Kim"],
    technologies: ["Vue.js", "Express", "Socket.io", "Square API"],
    progress: 100
  },
  {
    projectName: "AI Content Generator",
    clientName: "Digital Marketing Pro",
    type: "ai",
    status: "development",
    startDate: "2025-01-10",
    endDate: "2025-02-20",
    budget: 7500,
    description: "AI-powered content generation platform for social media and blogs",
    teamMembers: ["Alex Rivera"],
    technologies: ["GPT-4", "Claude", "React", "Python"],
    progress: 55
  },
  {
    projectName: "Fitness Tracking Platform",
    clientName: "FitLife Studios",
    type: "webapp",
    status: "on-hold",
    startDate: "2024-12-01",
    endDate: "2025-02-15",
    budget: 7500,
    description: "Comprehensive fitness tracking with wearable device integration",
    teamMembers: ["Lisa Brown", "Carlos Martinez"],
    technologies: ["React", "HealthKit API", "Fitbit API", "ChartJS"],
    progress: 30
  },
  {
    projectName: "Legal Document Automation",
    clientName: "LawTech Solutions",
    type: "ai",
    status: "development",
    startDate: "2025-01-20",
    endDate: "2025-03-30",
    budget: 10000,
    description: "AI-powered legal document generation and review system",
    teamMembers: ["Sarah Chen", "Mike Johnson", "Alex Rivera"],
    technologies: ["Claude API", "Next.js", "DocuSign API", "PostgreSQL"],
    progress: 45
  },
  {
    projectName: "Supply Chain Dashboard",
    clientName: "LogisticsCorp",
    type: "webapp",
    status: "completed",
    startDate: "2024-09-01",
    endDate: "2024-10-31",
    budget: 10000,
    description: "Real-time supply chain visibility dashboard with predictive analytics",
    teamMembers: ["David Kim", "Emma Watson", "Carlos Martinez"],
    technologies: ["React", "D3.js", "Python", "TensorFlow", "Redis"],
    progress: 100
  }
];

// Function to generate more sample data if needed
export function generateProjectData(count: number): ProjectImportData[] {
  const types: ProjectImportData['type'][] = ['website', 'webapp', 'mobile', 'ai', 'integration', 'consulting'];
  const statuses: ProjectImportData['status'][] = ['planning', 'development', 'review', 'completed', 'on-hold'];
  const clients = ['Acme Corp', 'Tech Innovations', 'Global Systems', 'Future Vision', 'Smart Solutions'];
  const teamMembers = ['Sarah Chen', 'Mike Johnson', 'Alex Rivera', 'Emma Watson', 'David Kim', 'Lisa Brown', 'Carlos Martinez'];
  
  const projects: ProjectImportData[] = [];
  
  for (let i = 0; i < count; i++) {
    const startDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + Math.floor(Math.random() * 3) + 1);
    
    projects.push({
      projectName: `Project ${i + 1}`,
      clientName: clients[Math.floor(Math.random() * clients.length)],
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      budget: (Math.floor(Math.random() * 3) + 1) * 2500 + 2500, // 5000, 7500, or 10000
      description: `Custom ${types[Math.floor(Math.random() * types.length)]} solution`,
      teamMembers: [teamMembers[Math.floor(Math.random() * teamMembers.length)]],
      progress: Math.floor(Math.random() * 101)
    });
  }
  
  return projects;
}