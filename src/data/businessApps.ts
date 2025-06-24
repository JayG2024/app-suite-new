export interface BusinessApp {
  id: string;
  title: string;
  description: string;
  category: string;
  features: string[];
}

export const businessApps: BusinessApp[] = [
  {
    id: "invoice-generator",
    title: "Invoice Generator & Management",
    description: "Create, send, and track professional invoices. Get paid faster with automated payment reminders and multiple payment options.",
    category: "Finance",
    features: [
      "Create professional invoices with custom branding",
      "Send automated payment reminders",
      "Track payment status in real-time",
      "Generate financial reports",
      "Multiple currency support",
      "Client database management"
    ]
  },
  {
    id: "crm",
    title: "Customer Relationship Manager",
    description: "Keep track of all your customer interactions, manage leads, and improve your sales process with our comprehensive CRM system.",
    category: "Customer Management",
    features: [
      "Contact management with detailed history",
      "Lead scoring and qualification",
      "Sales pipeline visualization",
      "Task and follow-up reminders",
      "Email integration",
      "Performance analytics"
    ]
  },
  {
    id: "appointment-scheduler",
    title: "Appointment Scheduler",
    description: "Allow customers to book appointments online, reduce no-shows with automated reminders, and manage your calendar efficiently.",
    category: "Operations",
    features: [
      "Online booking widget for your website",
      "Automated email and SMS reminders",
      "Staff schedule management",
      "Calendar sync with Google/Outlook",
      "Customizable booking rules",
      "Client self-service portal"
    ]
  },
  {
    id: "inventory-management",
    title: "Inventory Management System",
    description: "Track stock levels, manage suppliers, set reorder points, and get insights into your inventory performance.",
    category: "Operations",
    features: [
      "Real-time inventory tracking",
      "Barcode scanning support",
      "Automatic reorder notifications",
      "Supplier management",
      "Stock performance analytics",
      "Multi-location support"
    ]
  },
  {
    id: "time-tracker",
    title: "Employee Time Tracker",
    description: "Track employee work hours, manage shift schedules, approve time off requests, and streamline payroll processing.",
    category: "Operations",
    features: [
      "Clock in/out functionality",
      "Shift scheduling and management",
      "PTO and leave request handling",
      "Overtime calculation",
      "Payroll integration",
      "Mobile app for remote tracking"
    ]
  },
  {
    id: "expense-tracker",
    title: "Expense Tracker",
    description: "Track business expenses, categorize spending, scan receipts, and generate expense reports for better financial control.",
    category: "Finance",
    features: [
      "Receipt scanning and digitization",
      "Expense categorization",
      "Corporate card integration",
      "Approval workflows",
      "Reimbursement tracking",
      "Tax-ready reporting"
    ]
  },
  {
    id: "project-management",
    title: "Project Management Dashboard",
    description: "Plan projects, assign tasks, track progress, and collaborate with team members to deliver projects on time and within budget.",
    category: "Operations",
    features: [
      "Task creation and assignment",
      "Project timeline visualization",
      "File sharing and collaboration",
      "Time tracking per task",
      "Progress reporting",
      "Client access portal"
    ]
  },
  {
    id: "social-content-planner",
    title: "Social Media Content Planner",
    description: "Plan, create, and schedule social media content across multiple platforms. Analyze performance and engage with your audience.",
    category: "Marketing",
    features: [
      "Content calendar and scheduling",
      "Multi-platform posting",
      "Performance analytics",
      "Audience engagement tracking",
      "Hashtag management",
      "Content library"
    ]
  },
  {
    id: "email-marketing",
    title: "Email Marketing Campaign Manager",
    description: "Design email campaigns, manage subscriber lists, automate email sequences, and analyze campaign performance.",
    category: "Marketing",
    features: [
      "Email template builder",
      "Subscriber list management",
      "Automated email sequences",
      "A/B testing capabilities",
      "Open and click tracking",
      "Behavioral targeting"
    ]
  },
  {
    id: "website-analytics",
    title: "Website Analytics Dashboard",
    description: "Understand your website traffic, user behavior, conversion rates, and other key metrics to optimize your online presence.",
    category: "Marketing",
    features: [
      "Traffic source analysis",
      "User behavior tracking",
      "Conversion funnel visualization",
      "Custom goal tracking",
      "Heatmap generation",
      "SEO performance monitoring"
    ]
  },
  {
    id: "customer-feedback",
    title: "Customer Feedback Collection Tool",
    description: "Collect, analyze, and act on customer feedback to improve your products and services and increase customer satisfaction.",
    category: "Customer Management",
    features: [
      "Custom survey creation",
      "NPS and CSAT measurement",
      "Feedback analysis dashboard",
      "Action item assignment",
      "Customer follow-up automation",
      "Trend reporting"
    ]
  },
  {
    id: "digital-menu",
    title: "Digital Menu Creator",
    description: "Create and update digital menus for your restaurant. Add images, descriptions, and prices with real-time updates across all platforms.",
    category: "Operations",
    features: [
      "Visual menu editor",
      "QR code generation",
      "Dietary and allergen labeling",
      "Special promotion highlighting",
      "Online ordering integration",
      "Multi-language support"
    ]
  },
  {
    id: "property-management",
    title: "Property Management System",
    description: "Manage rental properties, track maintenance requests, collect rent payments, and communicate with tenants efficiently.",
    category: "Operations",
    features: [
      "Property listing management",
      "Tenant screening and onboarding",
      "Rent collection and tracking",
      "Maintenance request handling",
      "Document storage and signing",
      "Financial reporting"
    ]
  },
  {
    id: "service-scheduling",
    title: "Service Business Scheduling Tool",
    description: "Schedule service appointments, dispatch technicians, track job status, and collect payments for service-based businesses.",
    category: "Operations",
    features: [
      "Job scheduling and assignment",
      "Technician dispatch management",
      "Real-time job status updates",
      "Digital job sheets and forms",
      "On-site payment collection",
      "Customer communication tools"
    ]
  },
  {
    id: "loyalty-program",
    title: "Loyalty Program Manager",
    description: "Create and manage customer loyalty programs. Track points, rewards, and member activity to increase customer retention.",
    category: "Customer Management",
    features: [
      "Customer enrollment and profiles",
      "Points calculation and tracking",
      "Reward redemption management",
      "Tiered membership levels",
      "Loyalty analytics",
      "Marketing integration"
    ]
  },
  {
    id: "document-management",
    title: "Document Management System",
    description: "Store, organize, and share business documents securely. Control access, track versions, and find documents quickly.",
    category: "Operations",
    features: [
      "Secure document storage",
      "Version control system",
      "Permission-based access",
      "Document tagging and search",
      "Workflow approvals",
      "Audit trail tracking"
    ]
  },
  {
    id: "shipping-label-generator",
    title: "Shipping Label Generator",
    description: "Create shipping labels, track shipments, manage carriers, and streamline your shipping process for physical products.",
    category: "Operations",
    features: [
      "Multi-carrier label creation",
      "Batch label printing",
      "Shipment tracking integration",
      "Address validation",
      "Shipping cost calculation",
      "Order management integration"
    ]
  },
  {
    id: "business-proposal",
    title: "Business Proposal Generator",
    description: "Create professional business proposals with customizable templates, digital signatures, and tracking of client interactions.",
    category: "Customer Management",
    features: [
      "Proposal template library",
      "Interactive pricing tables",
      "Digital signature collection",
      "Proposal tracking and analytics",
      "Client interaction notifications",
      "Follow-up automation"
    ]
  },
  {
    id: "digital-contract",
    title: "Digital Contract & E-Signature Tool",
    description: "Create, send, and manage digital contracts with secure electronic signatures, reminders, and document storage.",
    category: "Operations",
    features: [
      "Contract template creation",
      "Legal clause library",
      "E-signature collection",
      "Contract tracking and reminders",
      "Secure document storage",
      "Audit trail and compliance"
    ]
  },
  {
    id: "expense-report",
    title: "Business Expense Report Generator",
    description: "Create detailed expense reports for tax purposes, client billing, and financial analysis with minimal effort.",
    category: "Finance",
    features: [
      "Expense categorization",
      "Receipt attachment and storage",
      "Tax category mapping",
      "Client billable tracking",
      "Custom report generation",
      "Accounting software integration"
    ]
  },
  {
    id: "equipment-tracker",
    title: "Rental Equipment Tracker",
    description: "Track rental equipment availability, maintenance schedules, and customer usage to maximize rental revenue and equipment lifespan.",
    category: "Operations",
    features: [
      "Equipment inventory management",
      "Availability calendar",
      "Rental contract generation",
      "Maintenance scheduling",
      "Damage reporting and billing",
      "Utilization analytics"
    ]
  },
  {
    id: "service-quote",
    title: "Service Quote Generator",
    description: "Create professional service quotes with customizable options, pricing calculations, and follow-up automation.",
    category: "Finance",
    features: [
      "Service item library",
      "Dynamic pricing calculations",
      "Optional line items and packages",
      "Digital client approval",
      "Quote to invoice conversion",
      "Follow-up reminders"
    ]
  },
  {
    id: "business-card",
    title: "Business Card Designer",
    description: "Design and order professional business cards for your team with consistent branding and multiple design options.",
    category: "Marketing",
    features: [
      "Template-based card design",
      "Brand style enforcement",
      "Team member information management",
      "Digital business card generation",
      "Print-ready file export",
      "Ordering and reordering system"
    ]
  },
  {
    id: "team-communication",
    title: "Team Communication Hub",
    description: "Streamline internal team communication with organized channels, direct messaging, file sharing, and searchable archives.",
    category: "Operations",
    features: [
      "Channel-based communication",
      "Direct messaging",
      "File sharing and organization",
      "Search and archive functionality",
      "Mobile access",
      "Integration with other tools"
    ]
  }
];
