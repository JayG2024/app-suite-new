import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_CONFIG } from "@/config/app";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Copy, 
  Mail, 
  FileText, 
  Users, 
  DollarSign,
  Rocket,
  Calendar,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Send,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Download,
  Upload,
  Save
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  content: string;
  variables: string[];
  icon: React.ReactNode;
}

const emailTemplates: Record<string, EmailTemplate> = {
  'pre-project': {
    id: 'pre-project',
    name: 'Pre-Project Information Gathering',
    category: 'Sales',
    subject: 'Let\'s Build Your Custom Application - Information Needed',
    icon: <FileText className="h-4 w-4" />,
    variables: ['[CLIENT_NAME]', '[PROJECT_TYPE]', '[BUDGET]'],
    content: `Hi [CLIENT_NAME],

Thank you for your interest in App Suite! I'm excited to help you build a custom application that perfectly fits your business needs.

To ensure we deliver exactly what you need, I'd like to gather some initial information:

**1. Business Overview**
- What specific problem are you trying to solve?
- Who will be using this application (employees, customers, both)?
- How many users do you expect initially?
- What's your target launch date?

**2. Core Features Needed**
- What are the top 3-5 features that are absolutely essential?
- What type of data will you be managing?
- Do you need reporting or analytics capabilities?
- Will users need mobile access?

**3. Technical Requirements**
- Do you have any existing systems we need to integrate with?
- Any specific compliance requirements (HIPAA, PCI, etc.)?
- Do you have brand guidelines (colors, logos, etc.)?

**4. AI & Automation Opportunities**
- Which manual processes take the most time currently?
- Would AI-powered features add value (chatbots, data analysis, content generation)?
- Any repetitive tasks you'd like to automate?

**Investment & Timeline**
Based on your requirements, your investment will be:
- Standard App: $5,000 (30-day delivery)
- AI-Enhanced App: $7,500 (21-day delivery)
- Enterprise Solution: $10,000 (30-day delivery)

**What's Included:**
✓ Custom application built from scratch (no templates)
✓ Complete source code ownership
✓ Database design & implementation
✓ User authentication & management
✓ 30-day post-launch support
✓ Technical documentation
✓ Deployment & hosting setup

**Payment Options Available:**
- 50% deposit + 50% on completion (standard)
- Monthly payment plans (6 or 12 months)
- Net 30 terms for qualified businesses
Learn more: ${APP_CONFIG.url}/payment-terms

**How We Work - Our 5-Phase Process:**
1. Discovery & Architecture (Days 1-3)
2. Core Development (Days 4-10)
3. AI Integration (Days 11-14)
4. Testing & Refinement (Days 15-18)
5. Deployment & Training (Days 19-21)

See full process: ${APP_CONFIG.url}/ai-development-process

**Next Steps:**
1. Reply with answers to the questions above (as many as you can)
2. I'll create a detailed proposal within 24 hours
3. Once approved, we begin with a 50% deposit
4. Development starts immediately with regular updates

**Helpful Resources:**
- Calculate Your ROI: ${APP_CONFIG.url}/roi-calculator
- View Our Process: ${APP_CONFIG.url}/get-started
- AI Development Details: ${APP_CONFIG.url}/ai-development-process
- Client Success Stories: ${APP_CONFIG.url}/blog
- Technology We Use: ${APP_CONFIG.url}/technology-partners

**Flexible Financing Available:**
We understand that cash flow matters. That's why we offer:
- 0% interest for 6 months
- Low-interest 12-month plans
- No prepayment penalties
- Ownership transfers immediately

Calculate your monthly payment: ${APP_CONFIG.url}/price-calculator

Looking forward to building something amazing for your business!

Best regards,
[YOUR_NAME]
App Suite Team`
  },
  'proposal-follow-up': {
    id: 'proposal-follow-up',
    name: 'Proposal Follow-Up',
    category: 'Sales',
    subject: 'Your Custom App Proposal - Ready for Review',
    icon: <DollarSign className="h-4 w-4" />,
    variables: ['[CLIENT_NAME]', '[COMPANY_NAME]', '[PROPOSAL_AMOUNT]'],
    content: `Hi [CLIENT_NAME],

I wanted to follow up on the custom application proposal I sent for [COMPANY_NAME]. 

**Quick Recap:**
- Investment: $[PROPOSAL_AMOUNT]
- Timeline: 30 days from deposit
- Includes: Custom app, AI features, full ownership, 30-day support

I'm here to answer any questions you might have about:
- The development process
- Technical specifications
- Payment options
- Timeline adjustments

Would you like to schedule a quick 15-minute call to discuss the proposal? I'm available:
- Tomorrow between 10am-2pm EST
- Thursday anytime after 1pm EST
- Friday morning

Or feel free to reply with any questions.

Looking forward to helping you streamline your business operations!

Best regards,
[YOUR_NAME]`
  },
  'project-kickoff': {
    id: 'project-kickoff',
    name: 'Project Kickoff & Timeline',
    category: 'Project',
    subject: 'Your Custom Business Application Timeline - App Suite',
    icon: <Rocket className="h-4 w-4" />,
    variables: ['[CLIENT_NAME]', '[PROJECT_NAME]', '[PACKAGE_TYPE]', '[TIMELINE]', '[COMPLETION_DATE]', '[PM_NAME]', '[DEV_NAME]', '[DESIGNER_NAME]', '[PM_EMAIL]'],
    content: `Thank you for choosing App Suite for your custom business application. We're excited to build a solution tailored specifically to your organization's needs. Below is our transparent implementation timeline that outlines exactly what to expect over the next 14-30 days.

**Project Overview**
• Project Type: [PROJECT_NAME]
• Timeline: [TIMELINE] days
• Flat Rate Package: [PACKAGE_TYPE]
• Estimated Completion: [COMPLETION_DATE]

**Implementation Schedule**

**Hour 1: Project Kickoff**
• Confirm project requirements and business objectives
• Introduce your dedicated development team
• Establish communication protocols and check-in schedule
• Provide access to our project management dashboard

**Days 1-3: Discovery & Architecture**
• Finalize detailed requirements documentation
• Design database schema and relationships to support your business logic
• Create technical architecture blueprint
• Define API integration points with your existing systems
• Develop user journey maps for key workflows

**Days 4-10: Core Development**
• Build foundation database and server infrastructure
• Implement core business logic and calculations
• Develop authentication system with role-based permissions
• Create admin dashboard framework
• Build client portal backend functionality
• Implement custom data processing workflows
• Establish secure data handling protocols

**Days 11-14: Frontend Development** (Standard Package completes here)
• Design intuitive user interfaces based on your brand guidelines
• Build responsive layouts for all device types
• Implement user-friendly navigation and workflow screens
• Create interactive forms and data visualization components
• Develop printable report templates
• Build client-facing portal interfaces
• Implement real-time notifications system

**Days 15-18: AI Integration & Testing** (AI-Enhanced Package)
• Integrate ChatGPT/Claude for intelligent features
• Implement AI-powered automation workflows
• Create natural language processing capabilities
• Perform comprehensive quality assurance testing
• Conduct user acceptance testing with your team
• Debug and optimize performance
• Implement security auditing

**Days 19-21: Advanced Features** (Enterprise Package)
• Implement complex integrations with existing systems
• Build advanced reporting and analytics
• Create multi-tenant architecture if needed
• Develop custom API endpoints
• Implement advanced security features
• Configure scalability optimizations

**Days 22-30: Deployment & Support**
• Deploy application to production environment
• Conduct data migration from existing systems
• Configure backup and disaster recovery
• Provide comprehensive training sessions
• Deliver complete documentation
• Create video tutorials for workflows
• Monitor system performance
• Provide priority support
• Make refinements based on usage patterns

**What Makes This Timeline Work**

At App Suite, we've refined our development process to deliver custom business applications efficiently at a transparent flat rate. Our approach eliminates the traditional complexities of software development through:

• **AI-Powered Development**: We leverage advanced AI tools to generate custom code specific to your business requirements
• **Focused Scope**: Clear definition of deliverables upfront ensures we stay on track
• **Dedicated Team**: Your project has a committed team for the entire duration
• **Agile Methodology**: Daily progress reviews keep development moving forward
• **Transparent Communication**: Regular check-ins ensure you're always informed
• **No Templates**: Everything is built from scratch for your specific needs

**Communication & Updates**
• Daily progress emails with completed tasks
• Weekly video calls for demonstrations
• 24/7 access to project dashboard
• Direct line to your project manager

**Your Dedicated Team**
• Project Manager: [PM_NAME]
• Lead Developer: [DEV_NAME]
• UI/UX Designer: [DESIGNER_NAME]
• Direct Line: (833) APP-SUIT
• Email: [PM_EMAIL]

We're committed to delivering your custom business application on time and exactly as specified. Our 30-day support period ensures a smooth transition to your new system.

Please let us know if you have any questions about this timeline or the implementation process.

Best regards,

The App Suite Team
${APP_CONFIG.url}`
  },
  'progress-update': {
    id: 'progress-update',
    name: 'Progress Update',
    category: 'Project',
    subject: 'Project Update - [PROJECT_NAME] - Day [DAY_NUMBER]',
    icon: <CheckCircle className="h-4 w-4" />,
    variables: ['[CLIENT_NAME]', '[PROJECT_NAME]', '[DAY_NUMBER]', '[PROGRESS_PERCENTAGE]'],
    content: `Hi [CLIENT_NAME],

Here's your daily progress update for [PROJECT_NAME]:

**Day [DAY_NUMBER] of [TOTAL_DAYS] - [PROGRESS_PERCENTAGE]% Complete**

**Completed Today:**
✓ [COMPLETED_TASK_1]
✓ [COMPLETED_TASK_2]
✓ [COMPLETED_TASK_3]

**In Progress:**
- [IN_PROGRESS_TASK_1]
- [IN_PROGRESS_TASK_2]

**Coming Tomorrow:**
- [TOMORROW_TASK_1]
- [TOMORROW_TASK_2]

**Quick Preview:**
[SCREENSHOT_OR_DESCRIPTION]

Everything is on track for your [COMPLETION_DATE] delivery date.

Questions? Just reply to this email or call me directly.

Best regards,
[YOUR_NAME]`
  },
  'project-completion': {
    id: 'project-completion',
    name: 'Project Completion',
    category: 'Project',
    subject: 'Your Custom Application is Ready! 🎉',
    icon: <CheckCircle className="h-4 w-4" />,
    variables: ['[CLIENT_NAME]', '[PROJECT_NAME]', '[FINAL_AMOUNT]'],
    content: `Hi [CLIENT_NAME],

Fantastic news - your custom application is complete and ready for launch!

**Project Delivered: [PROJECT_NAME]**

**What's Included:**
✓ Fully functional custom application
✓ Admin dashboard with full control
✓ Complete source code (GitHub repository)
✓ Technical documentation
✓ Deployment instructions
✓ 30-day support period (starts today)

**Access Your Application:**
- Live URL: [APP_URL]
- Admin Login: [ADMIN_URL]
- Username: [USERNAME]
- Temporary Password: [PASSWORD]

**Important Resources:**
- Documentation: [DOCS_LINK]
- Video Walkthrough: [VIDEO_LINK]
- Support Portal: [SUPPORT_LINK]

**Final Payment:**
Your remaining balance of $[FINAL_AMOUNT] is now due. Payment options:
- Online: [PAYMENT_LINK]
- Bank Transfer: [BANK_DETAILS]
- Check: [MAILING_ADDRESS]

**Your 30-Day Support Includes:**
- Bug fixes and minor adjustments
- Technical questions answered
- Deployment assistance
- Usage guidance

**What's Next?**
1. Test your application thoroughly
2. Let us know any final adjustments needed
3. We'll help you go live with real users

Thank you for choosing App Suite. It's been a pleasure building this custom solution for your business!

Best regards,
[YOUR_NAME]
App Suite Team

P.S. We'd love to feature your success story! If you're open to it, let's schedule a brief case study interview.`
  },
  'payment-reminder': {
    id: 'payment-reminder',
    name: 'Payment Reminder',
    category: 'Finance',
    subject: 'Friendly Reminder - Invoice #[INVOICE_NUMBER]',
    icon: <AlertCircle className="h-4 w-4" />,
    variables: ['[CLIENT_NAME]', '[AMOUNT]', '[INVOICE_NUMBER]', '[DUE_DATE]'],
    content: `Hi [CLIENT_NAME],

I hope you're enjoying your new custom application!

This is a friendly reminder that your invoice #[INVOICE_NUMBER] for $[AMOUNT] was due on [DUE_DATE].

**Payment Options:**
- Online (instant): [PAYMENT_LINK]
- Bank Transfer: [BANK_DETAILS]
- Check payable to: App Suite LLC

If you've already sent payment, please disregard this email. If you have any questions about the invoice or need to discuss payment arrangements, just reply to this email or call me directly.

Thank you for your business!

Best regards,
[YOUR_NAME]
App Suite Team`
  },
  'referral-request': {
    id: 'referral-request',
    name: 'Referral Request',
    category: 'Marketing',
    subject: 'Love Your New App? Share the Success! 🌟',
    icon: <Users className="h-4 w-4" />,
    variables: ['[CLIENT_NAME]', '[APP_NAME]'],
    content: `Hi [CLIENT_NAME],

I hope you're getting great value from [APP_NAME]! 

We're thrilled to have helped streamline your business operations. If you're happy with the results, we'd be grateful if you could help spread the word.

**Three Ways to Help:**

1. **Write a Review**
   Share your experience on Google Reviews: [REVIEW_LINK]

2. **Refer a Friend**
   Know someone who could benefit from a custom app? 
   You'll both get $500 off your next project!
   
3. **Success Story**
   Let us feature your success! We'll create a case study that showcases your business.

**What Our Clients Say:**
"App Suite built exactly what we needed in just 30 days. Game-changer!" - Sarah M.

"Finally, software that works the way WE work, not the other way around." - Mike T.

Thank you for being an amazing client. Your success is our success!

Best regards,
[YOUR_NAME]
App Suite Team

P.S. As a thank you, use code LOYAL20 for 20% off your next project!`
  },
  'support-welcome': {
    id: 'support-welcome',
    name: 'Support Period Welcome',
    category: 'Support',
    subject: 'Your 30-Day Support Period Has Started',
    icon: <Sparkles className="h-4 w-4" />,
    variables: ['[CLIENT_NAME]', '[APP_NAME]', '[SUPPORT_END_DATE]'],
    content: `Hi [CLIENT_NAME],

Your 30-day support period for [APP_NAME] is now active!

**Support Period: Today - [SUPPORT_END_DATE]**

**What's Included (FREE):**
✓ Bug fixes and error corrections
✓ Minor adjustments and tweaks
✓ Technical questions answered
✓ Deployment assistance
✓ User guidance and best practices

**How to Get Support:**
1. Email: ${APP_CONFIG.supportEmail}
2. Priority Phone: [SUPPORT_PHONE]
3. Support Portal: [SUPPORT_PORTAL]

**Response Times:**
- Critical Issues: Within 2 hours
- Normal Issues: Within 24 hours
- Questions: Within 48 hours

**Not Included (Quoted Separately):**
- New features or major changes
- Additional integrations
- Design overhauls
- Data migration services

**Pro Tips:**
- Document any issues with screenshots
- Test thoroughly in the first week
- Keep a list of minor tweaks needed

We're here to ensure your application runs perfectly!

Best regards,
[YOUR_NAME]
App Suite Support Team`
  }
};

const EmailTemplates = () => {
  const [templates, setTemplates] = useState<Record<string, EmailTemplate>>(emailTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    id: '',
    name: '',
    category: 'Sales',
    subject: '',
    content: '',
    variables: [] as string[],
    icon: <FileText className="h-4 w-4" />
  });
  const [trackingData, setTrackingData] = useState({
    projectId: '',
    clientEmail: '',
    templateId: '',
    templateContent: ''
  });
  const [projects, setProjects] = useState<{id: number; name: string; client_name: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [variableInput, setVariableInput] = useState('');

  // Load templates from localStorage on mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem('emailTemplates');
    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates);
        setTemplates({ ...emailTemplates, ...parsed });
      } catch (e) {
        console.error('Failed to parse saved templates:', e);
      }
    }
  }, []);

  // Fetch projects for dropdown
  useEffect(() => {
    fetch('/.netlify/functions/projects')
      .then(res => res.json())
      .then(data => setProjects(data.projects || []))
      .catch(err => console.error('Failed to fetch projects:', err));
  }, []);

  // Save templates to localStorage whenever they change
  const saveTemplates = (newTemplates: Record<string, EmailTemplate>) => {
    setTemplates(newTemplates);
    // Only save custom templates, not the default ones
    const customTemplates: Record<string, EmailTemplate> = {};
    Object.entries(newTemplates).forEach(([id, template]) => {
      if (!emailTemplates[id]) {
        customTemplates[id] = template;
      }
    });
    localStorage.setItem('emailTemplates', JSON.stringify(customTemplates));
  };

  const copyToClipboard = (content: string, templateId: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(templateId);
    toast.success("Template copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTrackEmail = (template: EmailTemplate) => {
    const templateToUse = templates[template.id] || template;
    setTrackingData({
      projectId: '',
      clientEmail: '',
      templateId: templateToUse.id,
      templateContent: templateToUse.content
    });
    setShowTrackingDialog(true);
  };

  const trackEmailSent = async () => {
    if (!trackingData.projectId) {
      toast.error("Please select a project");
      return;
    }

    setLoading(true);
    try {
      // Get user info from localStorage
      const userStr = localStorage.getItem('adminUser') || localStorage.getItem('teamUser');
      const user = userStr ? JSON.parse(userStr) : null;

      // Log the email activity
      const response = await fetch('/.netlify/functions/project-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: parseInt(trackingData.projectId),
          activity_type: 'email_sent',
          activity_description: `${trackingData.templateId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} email sent to ${trackingData.clientEmail || 'client'}`,
          metadata: {
            email_type: trackingData.templateId,
            recipient: trackingData.clientEmail,
            template_used: trackingData.templateId
          },
          user_id: user?.id || 1
        }),
      });

      if (response.ok) {
        toast.success("Email tracked successfully! Project updated.");
        setShowTrackingDialog(false);
        
        // Copy the template content to clipboard
        copyToClipboard(trackingData.templateContent, trackingData.templateId);
      } else {
        throw new Error('Failed to track email');
      }
    } catch (error) {
      console.error('Error tracking email:', error);
      toast.error("Failed to track email. Template still copied to clipboard.");
      
      // Still copy the template even if tracking fails
      copyToClipboard(trackingData.templateContent, trackingData.templateId);
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (template: EmailTemplate) => {
    setEditingTemplate({
      ...template,
      variables: [...template.variables]
    });
    setShowEditDialog(true);
  };

  const saveEditedTemplate = () => {
    if (!editingTemplate) return;
    
    const updatedTemplates = {
      ...templates,
      [editingTemplate.id]: editingTemplate
    };
    saveTemplates(updatedTemplates);
    setShowEditDialog(false);
    setEditingTemplate(null);
    toast.success('Template updated successfully!');
  };

  const createNewTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    const id = newTemplate.name.toLowerCase().replace(/\s+/g, '-');
    const template: EmailTemplate = {
      ...newTemplate,
      id,
      icon: <FileText className="h-4 w-4" />
    };

    const updatedTemplates = {
      ...templates,
      [id]: template
    };
    saveTemplates(updatedTemplates);
    setShowCreateDialog(false);
    setNewTemplate({
      id: '',
      name: '',
      category: 'Sales',
      subject: '',
      content: '',
      variables: [],
      icon: <FileText className="h-4 w-4" />
    });
    setVariableInput('');
    toast.success('Template created successfully!');
  };

  const deleteTemplate = (templateId: string) => {
    if (emailTemplates[templateId]) {
      toast.error('Cannot delete default templates');
      return;
    }

    if (confirm('Are you sure you want to delete this template?')) {
      const updatedTemplates = { ...templates };
      delete updatedTemplates[templateId];
      saveTemplates(updatedTemplates);
      toast.success('Template deleted successfully!');
    }
  };

  const addVariable = () => {
    if (variableInput && !variableInput.startsWith('[')) {
      const variable = `[${variableInput.toUpperCase().replace(/\s+/g, '_')}]`;
      if (showEditDialog && editingTemplate) {
        setEditingTemplate({
          ...editingTemplate,
          variables: [...editingTemplate.variables, variable]
        });
      } else {
        setNewTemplate({
          ...newTemplate,
          variables: [...newTemplate.variables, variable]
        });
      }
      setVariableInput('');
    }
  };

  const removeVariable = (variable: string) => {
    if (showEditDialog && editingTemplate) {
      setEditingTemplate({
        ...editingTemplate,
        variables: editingTemplate.variables.filter(v => v !== variable)
      });
    } else {
      setNewTemplate({
        ...newTemplate,
        variables: newTemplate.variables.filter(v => v !== variable)
      });
    }
  };

  const exportTemplates = () => {
    const customTemplates: Record<string, EmailTemplate> = {};
    Object.entries(templates).forEach(([id, template]) => {
      if (!emailTemplates[id]) {
        customTemplates[id] = template;
      }
    });
    
    const dataStr = JSON.stringify(customTemplates, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'email-templates.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importTemplates = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        const updatedTemplates = { ...templates, ...imported };
        saveTemplates(updatedTemplates);
        toast.success('Templates imported successfully!');
      } catch (error) {
        toast.error('Failed to import templates. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const categories = [...new Set(Object.values(templates).map(t => t.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Templates</h2>
          <p className="text-muted-foreground">Pre-written templates for common communications</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Mail className="h-3 w-3" />
            {Object.keys(templates).length} Templates
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportTemplates}>
                <Download className="h-4 w-4 mr-2" />
                Export Templates
              </DropdownMenuItem>
              <DropdownMenuItem>
                <label className="flex items-center cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Templates
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={importTemplates}
                  />
                </label>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="Sales" className="space-y-4">
        <TabsList>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(templates)
                .filter(template => template.category === category)
                .map(template => (
                  <Card 
                    key={template.id}
                    className="cursor-pointer transition-colors hover:border-primary"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {template.icon}
                          <CardTitle className="text-base">{template.name}</CardTitle>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(template);
                            }}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Template
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleTrackEmail(template);
                            }}>
                              <Send className="h-4 w-4 mr-2" />
                              Send & Track
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(template.content, template.id);
                            }}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </DropdownMenuItem>
                            {!emailTemplates[template.id] && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTemplate(template.id);
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription className="text-sm">
                        Subject: {template.subject}
                      </CardDescription>
                      {!emailTemplates[template.id] && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          Custom
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {template.variables.map(variable => (
                          <Badge key={variable} variant="outline" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedTemplate.icon}
                <CardTitle>{selectedTemplate.name}</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(selectedTemplate)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(selectedTemplate.content, selectedTemplate.id)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Template
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Close
                </Button>
              </div>
            </div>
            <CardDescription>
              Subject: {selectedTemplate.subject}
            </CardDescription>
            {!emailTemplates[selectedTemplate.id] && (
              <Badge variant="secondary" className="text-xs mt-1">
                Custom Template
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Variables to Replace:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedTemplate.variables.map(variable => (
                    <Badge key={variable} variant="secondary" className="text-xs">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Template Content:</p>
                <Textarea
                  value={selectedTemplate.content}
                  readOnly
                  className="min-h-[400px] font-mono text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Email Tracking Dialog */}
      <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Track Email Sent</DialogTitle>
            <DialogDescription>
              Log this email to automatically update the project status and activity timeline.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project">Project</Label>
              <Select
                value={trackingData.projectId}
                onValueChange={(value) => setTrackingData({ ...trackingData, projectId: value })}
              >
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name} - {project.client_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Client Email (optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="client@example.com"
                value={trackingData.clientEmail}
                onChange={(e) => setTrackingData({ ...trackingData, clientEmail: e.target.value })}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {trackingData.templateId === 'project-kickoff' && (
                <p className="text-green-600">
                  ✓ Kickoff email will automatically update project status to "In Progress" and create initial tasks
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTrackingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={trackEmailSent} disabled={loading}>
              {loading ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4 animate-spin" />
                  Tracking...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Track & Copy
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Email Template</DialogTitle>
            <DialogDescription>
              Create a custom email template for your communications
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Template Name *</Label>
              <Input
                placeholder="e.g., Follow-up Email"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select 
                value={newTemplate.category} 
                onValueChange={(value) => setNewTemplate({...newTemplate, category: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Project">Project</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subject Line *</Label>
              <Input
                placeholder="e.g., Your Project Update - [PROJECT_NAME]"
                value={newTemplate.subject}
                onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
              />
            </div>
            <div>
              <Label>Variables</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="e.g., CLIENT_NAME"
                  value={variableInput}
                  onChange={(e) => setVariableInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVariable())}
                />
                <Button type="button" onClick={addVariable} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {newTemplate.variables.map(variable => (
                  <Badge key={variable} variant="secondary" className="text-xs">
                    {variable}
                    <button
                      onClick={() => removeVariable(variable)}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label>Template Content *</Label>
              <Textarea
                placeholder="Write your email template here..."
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createNewTemplate}>
              <Save className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Email Template</DialogTitle>
            <DialogDescription>
              Modify your email template
            </DialogDescription>
          </DialogHeader>
          {editingTemplate && (
            <div className="space-y-4 mt-4">
              <div>
                <Label>Template Name *</Label>
                <Input
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select 
                  value={editingTemplate.category} 
                  onValueChange={(value) => setEditingTemplate({...editingTemplate, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Project">Project</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subject Line *</Label>
                <Input
                  value={editingTemplate.subject}
                  onChange={(e) => setEditingTemplate({...editingTemplate, subject: e.target.value})}
                />
              </div>
              <div>
                <Label>Variables</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="e.g., CLIENT_NAME"
                    value={variableInput}
                    onChange={(e) => setVariableInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVariable())}
                  />
                  <Button type="button" onClick={addVariable} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {editingTemplate.variables.map(variable => (
                    <Badge key={variable} variant="secondary" className="text-xs">
                      {variable}
                      <button
                        onClick={() => removeVariable(variable)}
                        className="ml-1 hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>Template Content *</Label>
                <Textarea
                  value={editingTemplate.content}
                  onChange={(e) => setEditingTemplate({...editingTemplate, content: e.target.value})}
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>
              {emailTemplates[editingTemplate.id] && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Default Template</AlertTitle>
                  <AlertDescription>
                    This is a default template. Your changes will be saved separately and can be reverted.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditedTemplate}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailTemplates;