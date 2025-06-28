import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import SlideInSidebar from "./SlideInSidebar";
import { cn } from "@/lib/utils";
import { 
  Mail, 
  Inbox,
  Send,
  Archive,
  Trash2,
  Star,
  Clock,
  Paperclip,
  Reply,
  ReplyAll,
  Forward,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Calendar,
  User,
  Tag,
  MoreVertical,
  Loader2,
  ExternalLink
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Email {
  id: string;
  threadId: string;
  from: {
    name: string;
    email: string;
  };
  to: Array<{
    name: string;
    email: string;
  }>;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
  important: boolean;
  labels: string[];
  attachments?: Array<{
    name: string;
    size: number;
    type: string;
  }>;
}

const GmailInbox = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showEmailDetail, setShowEmailDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("inbox");
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [connected, setConnected] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    loadEmails();
  }, [activeTab]);

  const loadEmails = () => {
    setLoading(true);
    // Mock emails - in production, this would fetch from Gmail API
    setTimeout(() => {
      const mockEmails: Email[] = [
        {
          id: "1",
          threadId: "thread1",
          from: { name: "Sarah Johnson", email: "sarah@techcorp.com" },
          to: [{ name: "You", email: "you@appsuite.io" }],
          subject: "Re: Custom Application Proposal",
          snippet: "Thank you for the proposal. I've reviewed it with our team and we're very interested in moving forward...",
          body: "Thank you for the proposal. I've reviewed it with our team and we're very interested in moving forward with the AI-enhanced package. Can we schedule a call this week to discuss the implementation timeline?",
          date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          starred: true,
          important: true,
          labels: ["clients", "proposals"],
          attachments: [
            { name: "requirements.pdf", size: 245000, type: "application/pdf" }
          ]
        },
        {
          id: "2",
          threadId: "thread2",
          from: { name: "Michael Chen", email: "mchen@startup.io" },
          to: [{ name: "You", email: "you@appsuite.io" }],
          subject: "Question about pricing",
          snippet: "Hi, I saw your website and I'm interested in getting a custom CRM built. Could you provide more details about...",
          body: "Hi, I saw your website and I'm interested in getting a custom CRM built. Could you provide more details about what's included in the $5K standard package?",
          date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          read: true,
          starred: false,
          important: false,
          labels: ["leads"],
        },
        {
          id: "3",
          threadId: "thread3",
          from: { name: "Emily Davis", email: "emily@healthcare.com" },
          to: [{ name: "You", email: "you@appsuite.io" }],
          subject: "Project Update Request",
          snippet: "Hope you're doing well. I wanted to check on the progress of our patient management system...",
          body: "Hope you're doing well. I wanted to check on the progress of our patient management system. Our team is excited to see the latest updates!",
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          starred: false,
          important: false,
          labels: ["projects", "active"],
        }
      ];
      
      if (activeTab === "sent") {
        setEmails([]);
      } else if (activeTab === "starred") {
        setEmails(mockEmails.filter(e => e.starred));
      } else {
        setEmails(mockEmails);
      }
      setLoading(false);
    }, 1000);
  };

  const connectGmail = async () => {
    try {
      const response = await fetch('/.netlify/functions/gmail-auth');
      const { authUrl } = await response.json();
      
      if (authUrl) {
        // Redirect to Google OAuth
        window.location.href = authUrl;
      } else {
        toast.error('Failed to generate authentication URL');
      }
    } catch (error) {
      console.error('Gmail auth error:', error);
      toast.error('Failed to connect Gmail. Please try again.');
    }
  };

  const syncEmails = async () => {
    setSyncing(true);
    await loadEmails();
    setTimeout(() => {
      setSyncing(false);
      toast.success("Emails synced successfully");
    }, 2000);
  };

  const markAsRead = (emailId: string) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, read: true } : email
    ));
  };

  const toggleStar = (emailId: string) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ));
  };

  const openEmailDetail = (email: Email) => {
    setSelectedEmail(email);
    setShowEmailDetail(true);
    markAsRead(email.id);
  };

  const closeEmailDetail = () => {
    setShowEmailDetail(false);
    setTimeout(() => setSelectedEmail(null), 300);
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const emailDate = new Date(date);
    const diff = now.getTime() - emailDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  const filteredEmails = emails.filter(email => 
    !searchTerm || 
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.from.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.snippet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Gmail Inbox</CardTitle>
              <CardDescription>
                Manage your emails directly from the dashboard
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {!connected ? (
                <Button onClick={connectGmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Connect Gmail
                </Button>
              ) : (
                <>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Connected
                  </Badge>
                  <Button 
                    variant="outline" 
                    onClick={syncEmails}
                    disabled={syncing}
                  >
                    {syncing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="inbox">
                <Inbox className="h-4 w-4 mr-2" />
                Inbox
              </TabsTrigger>
              <TabsTrigger value="sent">
                <Send className="h-4 w-4 mr-2" />
                Sent
              </TabsTrigger>
              <TabsTrigger value="starred">
                <Star className="h-4 w-4 mr-2" />
                Starred
              </TabsTrigger>
              <TabsTrigger value="archive">
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredEmails.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No emails found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredEmails.map((email) => (
                    <div
                      key={email.id}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                        !email.read ? "bg-blue-50 border-blue-200 hover:bg-blue-100" : "hover:bg-gray-50"
                      )}
                      onClick={() => openEmailDetail(email)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(email.id);
                        }}
                      >
                        <Star className={cn(
                          "h-4 w-4",
                          email.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                        )} />
                      </Button>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-sm",
                              !email.read ? "font-semibold" : ""
                            )}>
                              {email.from.name}
                            </span>
                            {email.important && (
                              <Badge variant="destructive" className="text-xs">
                                Important
                              </Badge>
                            )}
                            {email.attachments && (
                              <Paperclip className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(email.date)}
                          </span>
                        </div>
                        <p className={cn(
                          "text-sm mb-1",
                          !email.read ? "font-semibold" : ""
                        )}>
                          {email.subject}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {email.snippet}
                        </p>
                        {email.labels.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {email.labels.map((label) => (
                              <Badge key={label} variant="secondary" className="text-xs">
                                {label}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Tag className="h-4 w-4 mr-2" />
                            Add Label
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Email Detail Sidebar */}
      <SlideInSidebar
        isOpen={showEmailDetail}
        onClose={closeEmailDetail}
        title={selectedEmail?.subject}
        width="w-1/2"
      >
        {selectedEmail && (
          <div className="flex flex-col h-full">
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              {/* Email Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedEmail.subject}</h3>
                    <div className="flex gap-2 mt-2">
                      {selectedEmail.labels.map((label) => (
                        <Badge key={label} variant="secondary">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon">
                      <Star className={cn(
                        "h-4 w-4",
                        selectedEmail.starred ? "fill-yellow-400 text-yellow-400" : ""
                      )} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedEmail.from.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedEmail.from.email}</p>
                    </div>
                  </div>
                  <span className="text-muted-foreground">
                    {new Date(selectedEmail.date).toLocaleString()}
                  </span>
                </div>
                
                <div className="text-sm">
                  <span className="text-muted-foreground">To: </span>
                  {selectedEmail.to.map(recipient => recipient.email).join(", ")}
                </div>
              </div>

              {/* Email Body */}
              <div className="border-t pt-4">
                <div className="prose prose-sm max-w-none">
                  {selectedEmail.body.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Attachments */}
              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm mb-2">Attachments</h4>
                  <div className="space-y-2">
                    {selectedEmail.attachments.map((attachment, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 border rounded-lg">
                        <Paperclip className="h-4 w-4 text-gray-400" />
                        <span className="text-sm flex-1">{attachment.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {(attachment.size / 1024).toFixed(1)} KB
                        </span>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="border-t p-4 flex gap-2">
              <Button className="flex-1">
                <Reply className="h-4 w-4 mr-2" />
                Reply
              </Button>
              <Button variant="outline" className="flex-1">
                <ReplyAll className="h-4 w-4 mr-2" />
                Reply All
              </Button>
              <Button variant="outline" className="flex-1">
                <Forward className="h-4 w-4 mr-2" />
                Forward
              </Button>
            </div>
          </div>
        )}
      </SlideInSidebar>
    </div>
  );
};

export default GmailInbox;