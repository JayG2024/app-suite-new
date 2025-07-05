export interface SalesLeadImportData {
  company: string;
  contact: string;
  email: string;
  phone?: string;
  title?: string;
  value: number;
  stage: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  source?: string;
  notes?: string;
  nextAction?: string;
  industry?: string;
}

export const sampleLeads: SalesLeadImportData[] = [
  {
    company: "TechVision Corp",
    contact: "Michael Chen",
    email: "michael.chen@techvision.com",
    phone: "(555) 123-4567",
    title: "CTO",
    value: 7500,
    stage: "qualified",
    source: "Website",
    industry: "Technology",
    notes: "Interested in AI-powered customer analytics dashboard",
    nextAction: "Schedule technical demo for next week"
  },
  {
    company: "Global Retail Solutions",
    contact: "Sarah Johnson",
    email: "sjohnson@globalretail.com",
    phone: "(555) 234-5678",
    title: "VP of Operations",
    value: 10000,
    stage: "proposal",
    source: "Referral",
    industry: "Retail",
    notes: "Need inventory management system with predictive analytics",
    nextAction: "Follow up on proposal sent last week"
  },
  {
    company: "HealthFirst Medical",
    contact: "Dr. James Wilson",
    email: "jwilson@healthfirst.med",
    phone: "(555) 345-6789",
    title: "Director of IT",
    value: 10000,
    stage: "negotiation",
    source: "LinkedIn",
    industry: "Healthcare",
    notes: "HIPAA-compliant patient portal with telemedicine features",
    nextAction: "Negotiate final pricing and timeline"
  },
  {
    company: "EduTech Innovations",
    contact: "Lisa Martinez",
    email: "lmartinez@edutech.edu",
    phone: "(555) 456-7890",
    title: "Product Manager",
    value: 5000,
    stage: "new",
    source: "Cold Email",
    industry: "Education",
    notes: "Looking for student engagement platform",
    nextAction: "Qualify needs and budget in discovery call"
  },
  {
    company: "FinanceFlow Inc",
    contact: "Robert Thompson",
    email: "rthompson@financeflow.com",
    phone: "(555) 567-8901",
    title: "CFO",
    value: 10000,
    stage: "closed-won",
    source: "Partner Referral",
    industry: "Finance",
    notes: "Automated financial reporting dashboard - PROJECT WON!",
    nextAction: "Begin project kickoff next Monday"
  },
  {
    company: "Green Energy Systems",
    contact: "Amanda Foster",
    email: "afoster@greenenergy.com",
    phone: "(555) 678-9012",
    title: "Operations Director",
    value: 7500,
    stage: "qualified",
    source: "Conference",
    industry: "Energy",
    notes: "Solar panel monitoring and analytics platform",
    nextAction: "Send technical requirements document"
  },
  {
    company: "LegalEase Partners",
    contact: "David Kim",
    email: "dkim@legalease.com",
    phone: "(555) 789-0123",
    title: "Managing Partner",
    value: 10000,
    stage: "proposal",
    source: "Website",
    industry: "Legal",
    notes: "Document automation system with AI contract review",
    nextAction: "Present proposal to partners next week"
  },
  {
    company: "FoodChain Logistics",
    contact: "Maria Garcia",
    email: "mgarcia@foodchain.com",
    phone: "(555) 890-1234",
    title: "Supply Chain Manager",
    value: 7500,
    stage: "new",
    source: "Webinar",
    industry: "Logistics",
    notes: "Real-time shipment tracking with predictive delays",
    nextAction: "Schedule initial discovery call"
  },
  {
    company: "SmartHome Technologies",
    contact: "Kevin Zhang",
    email: "kzhang@smarthome.tech",
    phone: "(555) 901-2345",
    title: "Head of Product",
    value: 5000,
    stage: "closed-lost",
    source: "Trade Show",
    industry: "IoT",
    notes: "IoT device management platform - went with competitor",
    nextAction: "Keep in touch for future opportunities"
  },
  {
    company: "Metro Real Estate",
    contact: "Jennifer Brown",
    email: "jbrown@metrorealty.com",
    phone: "(555) 012-3456",
    title: "Broker/Owner",
    value: 5000,
    stage: "negotiation",
    source: "Referral",
    industry: "Real Estate",
    notes: "CRM integration with MLS feeds and automated marketing",
    nextAction: "Final contract review with legal team"
  },
  {
    company: "CloudFirst Solutions",
    contact: "Alex Rivera",
    email: "arivera@cloudfirst.com",
    phone: "(555) 123-4567",
    title: "Technical Lead",
    value: 7500,
    stage: "qualified",
    source: "Partner",
    industry: "Cloud Services",
    notes: "Multi-cloud cost optimization dashboard",
    nextAction: "Technical deep dive session scheduled"
  },
  {
    company: "Fitness Plus Gyms",
    contact: "Tom Anderson",
    email: "tanderson@fitnessplus.com",
    phone: "(555) 234-5678",
    title: "CEO",
    value: 7500,
    stage: "proposal",
    source: "Website",
    industry: "Fitness",
    notes: "Member management app with class booking and payments",
    nextAction: "Review proposal feedback"
  },
  {
    company: "AutoDrive Innovations",
    contact: "Rachel Lee",
    email: "rlee@autodrive.com",
    phone: "(555) 345-6789",
    title: "VP Engineering",
    value: 10000,
    stage: "new",
    source: "Conference",
    industry: "Automotive",
    notes: "Fleet management system with predictive maintenance",
    nextAction: "Initial needs assessment call"
  },
  {
    company: "BioTech Research Lab",
    contact: "Dr. Stephen Miller",
    email: "smiller@biotechlab.com",
    phone: "(555) 456-7890",
    title: "Research Director",
    value: 10000,
    stage: "qualified",
    source: "Referral",
    industry: "Biotechnology",
    notes: "Lab data management and analysis platform",
    nextAction: "Security and compliance review"
  },
  {
    company: "Express Shipping Co",
    contact: "Nancy Wilson",
    email: "nwilson@expressship.com",
    phone: "(555) 567-8901",
    title: "COO",
    value: 7500,
    stage: "closed-won",
    source: "Cold Call",
    industry: "Shipping",
    notes: "Route optimization with real-time tracking - SIGNED!",
    nextAction: "Project kickoff scheduled"
  }
];

// Function to generate additional sample leads
export function generateSalesLeads(count: number): SalesLeadImportData[] {
  const companies = ['Tech Corp', 'Global Systems', 'Smart Solutions', 'Digital Ventures', 'Future Tech'];
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Robert', 'Emma'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  const titles = ['CEO', 'CTO', 'VP Sales', 'Director of IT', 'Product Manager', 'Operations Manager'];
  const stages: SalesLeadImportData['stage'][] = ['new', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
  const sources = ['Website', 'Referral', 'LinkedIn', 'Cold Email', 'Conference', 'Partner'];
  const industries = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Services'];
  
  const leads: SalesLeadImportData[] = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = `${companies[Math.floor(Math.random() * companies.length)]} ${i + 1}`;
    
    leads.push({
      company,
      contact: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      title: titles[Math.floor(Math.random() * titles.length)],
      value: (Math.floor(Math.random() * 3) + 1) * 2500 + 2500, // 5000, 7500, or 10000
      stage: stages[Math.floor(Math.random() * stages.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      industry: industries[Math.floor(Math.random() * industries.length)],
      notes: `Interested in custom business application`,
      nextAction: 'Follow up required'
    });
  }
  
  return leads;
}