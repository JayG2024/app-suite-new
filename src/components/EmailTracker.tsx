import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { API_ENDPOINTS, apiCall } from "@/utils/api";
import { 
  Mail, 
  Send, 
  Clock, 
  CheckCircle, 
  Eye, 
  MousePointer,
  BarChart,
  Users,
  Calendar,
  FileText,
  Link,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Inbox,
  Archive,
  Trash2,
  Star,
  Reply,
  Forward,
  AlertCircle,
  Loader2
} from "lucide-react";
import { format } from "date-fns";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  category: string;
  created_at: string;
  updated_at: string;
}

interface Email {
  id: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  content: string;
  html?: string;
  status: 'draft' | 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  template_id?: string;
  campaign_id?: string;
  sent_at?: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
  open_count: number;
  click_count: number;
  links_clicked: string[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  template_id: string;
  recipient_list: string[];
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'paused';
  scheduled_for?: string;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  created_at: string;
  updated_at: string;
}

const EmailTracker = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sendingEmail, setSendingEmail] = useState(false);

  const [composeForm, setComposeForm] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    content: "",
    template_id: "",
    schedule_send: false,
    schedule_time: ""
  });

  const [templateForm, setTemplateForm] = useState({
    name: "",
    subject: "",
    content: "",
    category: "general"
  });

  useEffect(() => {
    loadEmails();
    loadTemplates();
    loadCampaigns();
  }, []);

  const loadEmails = async () => {
    try {
      // Using mock data - API endpoint not implemented yet
      // const data = await apiCall(API_ENDPOINTS.emails);
      // setEmails(data.emails || []);
    } catch (error) {
      console.error('Error loading emails:', error);
    }
    // Mock data for demo
    setEmails([
        {
          id: "1",
          to: "client@example.com",
          subject: "Project Update - E-Commerce Platform",
          content: "Hi Sarah, just wanted to update you on the progress...",
          status: "opened",
          sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          opened_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          open_count: 3,
          click_count: 1,
          links_clicked: ["https://app-suite.io/project/123"],
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "2",
          to: "lead@company.com",
          subject: "Follow-up: AI Integration Proposal",
          content: "Thank you for your time yesterday...",
          status: "sent",
          sent_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          open_count: 0,
          click_count: 0,
          links_clicked: [],
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
    setLoading(false);
  };

  const loadTemplates = async () => {
    try {
      // Using mock data - API endpoint not implemented yet
      // const data = await apiCall(API_ENDPOINTS.emailTemplates);
      // setTemplates(data.templates || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
    // Mock templates
    setTemplates([
        {
          id: "1",
          name: "Project Update",
          subject: "Project Update - {{project_name}}",
          content: "Hi {{client_name}},\n\nI wanted to update you on the progress of {{project_name}}...",
          variables: ["client_name", "project_name"],
          category: "project",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "2",
          name: "Follow-up",
          subject: "Following up on our conversation",
          content: "Hi {{contact_name}},\n\nThank you for taking the time to speak with me about {{topic}}...",
          variables: ["contact_name", "topic"],
          category: "sales",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
  };

  const loadCampaigns = async () => {
    try {
      // Using mock data - API endpoint not implemented yet
      // const data = await apiCall(API_ENDPOINTS.emailCampaigns);
      // setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    }
  };

  const sendEmail = async () => {
    if (!composeForm.to || !composeForm.subject || !composeForm.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSendingEmail(true);
    try {
      const response = await apiCall(API_ENDPOINTS.sendEmail, {
        method: 'POST',
        body: JSON.stringify({
          to: composeForm.to.split(',').map(e => e.trim()),
          cc: composeForm.cc ? composeForm.cc.split(',').map(e => e.trim()) : undefined,
          bcc: composeForm.bcc ? composeForm.bcc.split(',').map(e => e.trim()) : undefined,
          subject: composeForm.subject,
          html: composeForm.content,
          text: composeForm.content.replace(/<[^>]*>/g, ''), // Strip HTML for text version
          schedule_send: composeForm.schedule_send,
          schedule_time: composeForm.schedule_time || undefined
        })
      });

      if (response.success) {
        toast.success('Email sent successfully!');
        setShowCompose(false);
        setComposeForm({
          to: "",
          cc: "",
          bcc: "",
          subject: "",
          content: "",
          template_id: "",
          schedule_send: false,
          schedule_time: ""
        });
        loadEmails();
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  const createTemplate = async () => {
    if (!templateForm.name || !templateForm.subject || !templateForm.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await apiCall(API_ENDPOINTS.emailTemplates, {
        method: 'POST',
        body: JSON.stringify(templateForm)
      });

      toast.success('Template created successfully!');
      setShowTemplateDialog(false);
      setTemplateForm({
        name: "",
        subject: "",
        content: "",
        category: "general"
      });
      loadTemplates();
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
    }
  };

  const useTemplate = (template: EmailTemplate) => {
    setComposeForm({
      ...composeForm,
      subject: template.subject,
      content: template.content,
      template_id: template.id
    });
    toast.success(`Template "${template.name}" loaded`);
  };

  const getStatusIcon = (status: Email['status']) => {
    switch (status) {
      case 'sent': return <Send className="h-4 w-4 text-blue-500" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'opened': return <Eye className="h-4 w-4 text-purple-500" />;
      case 'clicked': return <MousePointer className="h-4 w-4 text-indigo-500" />;
      case 'bounced': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: Email['status']) => {
    const colors = {
      'draft': 'default',
      'queued': 'secondary',
      'sent': 'default',
      'delivered': 'default',
      'opened': 'secondary',
      'clicked': 'default',
      'bounced': 'destructive',
      'failed': 'destructive'
    };
    return <Badge variant={colors[status] as any}>{status}</Badge>;
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || email.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const emailStats = {
    total: emails.length,
    sent: emails.filter(e => e.status === 'sent').length,
    delivered: emails.filter(e => e.status === 'delivered').length,
    opened: emails.filter(e => e.status === 'opened' || e.status === 'clicked').length,
    clicked: emails.filter(e => e.status === 'clicked').length,
    bounced: emails.filter(e => e.status === 'bounced').length,
    openRate: emails.length > 0 ? Math.round((emails.filter(e => e.open_count > 0).length / emails.filter(e => e.status !== 'draft').length) * 100) || 0 : 0,
    clickRate: emails.length > 0 ? Math.round((emails.filter(e => e.click_count > 0).length / emails.filter(e => e.status !== 'draft').length) * 100) || 0 : 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Sent</CardDescription>
            <CardTitle className="text-2xl">{emailStats.sent}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Delivered</CardDescription>
            <CardTitle className="text-2xl">{emailStats.delivered}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Opened</CardDescription>
            <CardTitle className="text-2xl">{emailStats.opened}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Clicked</CardDescription>
            <CardTitle className="text-2xl">{emailStats.clicked}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Bounced</CardDescription>
            <CardTitle className="text-2xl">{emailStats.bounced}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Open Rate</CardDescription>
            <CardTitle className="text-2xl">{emailStats.openRate}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Click Rate</CardDescription>
            <CardTitle className="text-2xl">{emailStats.clickRate}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Templates</CardDescription>
            <CardTitle className="text-2xl">{templates.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="inbox">
        <TabsList>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Email Tracking</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={loadEmails}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Dialog open={showCompose} onOpenChange={setShowCompose}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Compose Email
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Compose Email</DialogTitle>
                        <DialogDescription>
                          Send a new email with tracking enabled
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="to">To *</Label>
                          <Input
                            id="to"
                            value={composeForm.to}
                            onChange={(e) => setComposeForm({...composeForm, to: e.target.value})}
                            placeholder="email@example.com, another@example.com"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cc">CC</Label>
                            <Input
                              id="cc"
                              value={composeForm.cc}
                              onChange={(e) => setComposeForm({...composeForm, cc: e.target.value})}
                              placeholder="cc@example.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="bcc">BCC</Label>
                            <Input
                              id="bcc"
                              value={composeForm.bcc}
                              onChange={(e) => setComposeForm({...composeForm, bcc: e.target.value})}
                              placeholder="bcc@example.com"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="subject">Subject *</Label>
                          <Input
                            id="subject"
                            value={composeForm.subject}
                            onChange={(e) => setComposeForm({...composeForm, subject: e.target.value})}
                            placeholder="Email subject"
                          />
                        </div>
                        <div>
                          <Label>Template (optional)</Label>
                          <Select
                            value={composeForm.template_id}
                            onValueChange={(value) => {
                              const template = templates.find(t => t.id === value);
                              if (template) {
                                useTemplate(template);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                            <SelectContent>
                              {templates.map(template => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="content">Message *</Label>
                          <Textarea
                            id="content"
                            value={composeForm.content}
                            onChange={(e) => setComposeForm({...composeForm, content: e.target.value})}
                            placeholder="Your message..."
                            rows={10}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="schedule"
                            checked={composeForm.schedule_send}
                            onChange={(e) => setComposeForm({...composeForm, schedule_send: e.target.checked})}
                          />
                          <Label htmlFor="schedule">Schedule send</Label>
                          {composeForm.schedule_send && (
                            <Input
                              type="datetime-local"
                              value={composeForm.schedule_time}
                              onChange={(e) => setComposeForm({...composeForm, schedule_time: e.target.value})}
                              className="ml-4"
                            />
                          )}
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowCompose(false)}>
                            Cancel
                          </Button>
                          <Button onClick={sendEmail} disabled={sendingEmail}>
                            {sendingEmail ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Send Email
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Emails</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="opened">Opened</SelectItem>
                    <SelectItem value="clicked">Clicked</SelectItem>
                    <SelectItem value="bounced">Bounced</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                {filteredEmails.map(email => (
                  <div
                    key={email.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedEmail(email)}
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(email.status)}
                      <div>
                        <div className="font-medium">{email.to}</div>
                        <div className="text-sm text-gray-600">{email.subject}</div>
                        <div className="text-xs text-gray-400">
                          {email.sent_at ? format(new Date(email.sent_at), 'MMM d, yyyy h:mm a') : 'Not sent'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm">
                          <Eye className="h-3 w-3 inline mr-1" />
                          {email.open_count}
                        </div>
                        <div className="text-sm">
                          <MousePointer className="h-3 w-3 inline mr-1" />
                          {email.click_count}
                        </div>
                      </div>
                      {getStatusBadge(email.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Email Templates</CardTitle>
                <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Email Template</DialogTitle>
                      <DialogDescription>
                        Create a reusable email template with variables
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="template-name">Template Name *</Label>
                        <Input
                          id="template-name"
                          value={templateForm.name}
                          onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                          placeholder="e.g., Welcome Email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="template-category">Category</Label>
                        <Select
                          value={templateForm.category}
                          onValueChange={(value) => setTemplateForm({...templateForm, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="project">Project</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="template-subject">Subject Line *</Label>
                        <Input
                          id="template-subject"
                          value={templateForm.subject}
                          onChange={(e) => setTemplateForm({...templateForm, subject: e.target.value})}
                          placeholder="Use {{variable}} for dynamic content"
                        />
                      </div>
                      <div>
                        <Label htmlFor="template-content">Content *</Label>
                        <Textarea
                          id="template-content"
                          value={templateForm.content}
                          onChange={(e) => setTemplateForm({...templateForm, content: e.target.value})}
                          placeholder="Hi {{name}}, ..."
                          rows={8}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={createTemplate}>
                          Create Template
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {templates.map(template => (
                  <Card key={template.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <CardDescription>{template.subject}</CardDescription>
                        </div>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-2">{template.content}</p>
                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowCompose(true);
                            useTemplate(template);
                          }}
                        >
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Email Campaigns</CardTitle>
              <CardDescription>
                Manage and track your email marketing campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No campaigns yet</p>
                <Button className="mt-4" variant="outline">
                  Create Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <Dialog open={!!selectedEmail} onOpenChange={() => setSelectedEmail(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Email Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>To</Label>
                  <p className="text-sm">{selectedEmail.to}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedEmail.status)}</div>
                </div>
                <div>
                  <Label>Sent At</Label>
                  <p className="text-sm">
                    {selectedEmail.sent_at ? format(new Date(selectedEmail.sent_at), 'MMM d, yyyy h:mm a') : 'Not sent'}
                  </p>
                </div>
                <div>
                  <Label>Opens / Clicks</Label>
                  <p className="text-sm">{selectedEmail.open_count} / {selectedEmail.click_count}</p>
                </div>
              </div>
              <div>
                <Label>Subject</Label>
                <p className="text-sm font-medium">{selectedEmail.subject}</p>
              </div>
              <div>
                <Label>Content</Label>
                <div className="border rounded p-4 bg-gray-50 max-h-96 overflow-y-auto">
                  <div dangerouslySetInnerHTML={{ __html: selectedEmail.html || selectedEmail.content }} />
                </div>
              </div>
              {selectedEmail.links_clicked.length > 0 && (
                <div>
                  <Label>Clicked Links</Label>
                  <ul className="text-sm space-y-1 mt-2">
                    {selectedEmail.links_clicked.map((link, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Link className="h-3 w-3" />
                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default EmailTracker;