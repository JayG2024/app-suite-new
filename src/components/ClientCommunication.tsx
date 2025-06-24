import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Video,
  Send,
  Paperclip,
  Calendar,
  Clock,
  CheckCheck,
  AlertCircle,
  Star,
  FileText,
  Search,
  Trash2,
  MoreHorizontal
} from "lucide-react";

interface ClientMessage {
  id: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  projectName: string;
  projectStatus: string;
  messageType: string;
  status: string;
  priority: string;
  content: string;
  notes: string;
  timestamp: string;
  respondedDate?: string;
  lastContact: string;
  unreadMessages: number;
}

const ClientCommunication = () => {
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [responseInput, setResponseInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
    
    // Refresh messages every 30 seconds
    const interval = setInterval(loadMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/client-messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        if (data.messages.length > 0 && !selectedMessage) {
          setSelectedMessage(data.messages[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendResponse = async () => {
    if (!responseInput.trim() || !selectedMessage) return;

    const message = messages.find(m => m.id === selectedMessage);
    if (!message) return;

    try {
      // First, save the response to the database
      const dbResponse = await fetch('/api/client-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'App Suite Team',
          email: 'team@app-suite.io',
          company: 'App Suite',
          message: responseInput,
          messageType: 'response',
          priority: 'medium',
          isResponse: true,
          originalMessageId: selectedMessage
        })
      });

      if (!dbResponse.ok) {
        throw new Error('Failed to save response');
      }

      // Then, send the actual email to the client
      const emailResponse = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: message.clientEmail,
          subject: `Re: ${message.projectName || 'Your inquiry'}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Response from App Suite</h2>
              <p>Hi ${message.clientName},</p>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                ${responseInput.replace(/\n/g, '<br>')}
              </div>
              <p style="color: #666;">Best regards,<br>The App Suite Team</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              <p style="font-size: 12px; color: #999;">
                This is a response to your message sent on ${new Date(message.timestamp).toLocaleDateString()}.
              </p>
            </div>
          `,
          text: responseInput,
          replyTo: 'jason@jaydus.ai'
        })
      });

      if (emailResponse.ok) {
        const emailResult = await emailResponse.json();
        toast.success('Response sent successfully!');
        console.log('Email sent with ID:', emailResult.messageId);
      } else {
        toast.warning('Response saved but email failed to send');
      }

      setResponseInput('');
      await loadMessages(); // Refresh messages
      await updateMessageStatus(selectedMessage, 'responded');
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Failed to send response');
    }
  };

  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      const response = await fetch(`/api/client-messages?id=${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        await loadMessages();
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/client-messages?id=${messageId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadMessages();
        if (selectedMessage === messageId) {
          setSelectedMessage(messages.length > 1 ? messages[0].id : null);
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const filteredMessages = messages.filter(message =>
    message.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.clientCompany?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMessageData = messages.find(m => m.id === selectedMessage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-500';
      case 'responded': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px]">
      {/* Client List */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Client Messages</CardTitle>
            <Badge variant="outline">{messages.length} total</Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="space-y-2 p-4">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedMessage === message.id 
                      ? 'bg-primary/10 border border-primary' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedMessage(message.id)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{message.clientName?.[0] || 'C'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                          {message.clientName || 'Anonymous'}
                        </p>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(message.status)}`} />
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {message.clientCompany}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {message.content}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant={getPriorityColor(message.priority)} className="text-xs">
                          {message.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {message.lastContact}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredMessages.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No messages found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Message Detail */}
      <div className="lg:col-span-2 space-y-4">
        {selectedMessageData ? (
          <>
            {/* Client Info Header */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{selectedMessageData.clientName?.[0] || 'C'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedMessageData.clientName}</CardTitle>
                      <CardDescription>{selectedMessageData.clientCompany}</CardDescription>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{selectedMessageData.projectName}</Badge>
                        <Badge variant={getPriorityColor(selectedMessageData.priority)}>
                          {selectedMessageData.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${selectedMessageData.clientEmail}`)}>
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => window.open(`tel:${selectedMessageData.clientPhone}`)}>
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Select value={selectedMessageData.status} onValueChange={(value) => updateMessageStatus(selectedMessageData.id, value)}>
                      <SelectTrigger className="w-[120px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="responded">Responded</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => deleteMessage(selectedMessageData.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Message Content */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Original Message</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {new Date(selectedMessageData.timestamp).toLocaleString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedMessageData.content}</p>
                  </div>
                  
                  {selectedMessageData.notes && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Internal Notes</h4>
                      <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <p className="text-sm">{selectedMessageData.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Response Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Send Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Type your response here..."
                    value={responseInput}
                    onChange={(e) => setResponseInput(e.target.value)}
                    className="min-h-[120px]"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Paperclip className="h-4 w-4 mr-2" />
                        Attach File
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Call
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => setResponseInput('')}>
                        Clear
                      </Button>
                      <Button onClick={sendResponse} disabled={!responseInput.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        Send Response
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="h-full">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">Select a message</p>
                <p className="text-muted-foreground">Choose a client message to view and respond</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClientCommunication;