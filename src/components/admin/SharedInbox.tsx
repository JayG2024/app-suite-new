import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Send, 
  Archive, 
  Star, 
  Search,
  RefreshCw,
  Clock,
  User,
  Reply,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  labels: string[];
  replyTo?: string;
}

interface EmailReply {
  id: string;
  emailId: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: Date;
}

const SharedInbox = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred' | 'archived'>('all');

  // Mock data - replace with actual API calls
  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    setIsLoading(true);
    try {
      // Mock emails - replace with actual API call
      const mockEmails: Email[] = [
        {
          id: '1',
          from: 'john.doe@example.com',
          to: 'sales@jaydus.ai',
          subject: 'Interested in custom CRM solution',
          body: 'Hi, I am interested in developing a custom CRM solution for my business. We have about 50 employees and need features like lead tracking, pipeline management, and reporting. Can you provide a quote?',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: false,
          isStarred: false,
          isArchived: false,
          labels: ['sales', 'new-lead'],
          replyTo: 'john.doe@example.com'
        },
        {
          id: '2',
          from: 'support@client.com',
          to: 'support@jaydus.ai',
          subject: 'Bug report: Login issues',
          body: 'We are experiencing login issues with our application. Users are getting "Invalid credentials" error even with correct passwords. This started happening after the latest update.',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          isRead: true,
          isStarred: true,
          isArchived: false,
          labels: ['support', 'bug'],
          replyTo: 'support@client.com'
        },
        {
          id: '3',
          from: 'info@partner.com',
          to: 'info@jaydus.ai',
          subject: 'Partnership opportunity',
          body: 'Hello App Suite team, we would like to discuss a potential partnership opportunity. We are a digital marketing agency looking for a reliable development partner.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          isRead: true,
          isStarred: false,
          isArchived: false,
          labels: ['partnership'],
          replyTo: 'info@partner.com'
        }
      ];
      setEmails(mockEmails);
    } catch (error) {
      toast.error('Failed to load emails');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmails = emails.filter(email => {
    // Apply filter
    if (filter === 'unread' && email.isRead) return false;
    if (filter === 'starred' && !email.isStarred) return false;
    if (filter === 'archived' && !email.isArchived) return false;
    if (filter === 'all' && email.isArchived) return false;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        email.from.toLowerCase().includes(query) ||
        email.subject.toLowerCase().includes(query) ||
        email.body.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      setEmails(emails.map(e => 
        e.id === email.id ? { ...e, isRead: true } : e
      ));
    }
    setReplyText('');
    setIsReplying(false);
  };

  const handleStarToggle = (emailId: string) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
    ));
  };

  const handleArchive = (emailId: string) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, isArchived: true } : email
    ));
    setSelectedEmail(null);
    toast.success('Email archived');
  };

  const handleDelete = (emailId: string) => {
    setEmails(emails.filter(email => email.id !== emailId));
    setSelectedEmail(null);
    toast.success('Email deleted');
  };

  const handleSendReply = async () => {
    if (!selectedEmail || !replyText.trim()) return;

    setIsLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Reply sent successfully');
      setReplyText('');
      setIsReplying(false);
    } catch (error) {
      toast.error('Failed to send reply');
    } finally {
      setIsLoading(false);
    }
  };

  const getEmailLabel = (to: string) => {
    if (to.includes('sales@')) return 'sales';
    if (to.includes('support@')) return 'support';
    if (to.includes('help@')) return 'help';
    return 'info';
  };

  const getLabelColor = (label: string) => {
    switch (label) {
      case 'sales':
        return 'bg-green-100 text-green-800';
      case 'support':
        return 'bg-blue-100 text-blue-800';
      case 'help':
        return 'bg-purple-100 text-purple-800';
      case 'bug':
        return 'bg-red-100 text-red-800';
      case 'new-lead':
        return 'bg-yellow-100 text-yellow-800';
      case 'partnership':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Email List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Shared Inbox</CardTitle>
          <CardDescription>All emails sent to @jaydus.ai</CardDescription>
          
          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread
            </Button>
            <Button
              variant={filter === 'starred' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('starred')}
            >
              Starred
            </Button>
            <Button
              variant={filter === 'archived' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('archived')}
            >
              Archived
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-24rem)]">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            ) : filteredEmails.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                No emails found
              </div>
            ) : (
              <div className="divide-y">
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => handleEmailClick(email)}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      !email.isRead ? 'bg-muted/20' : ''
                    } ${selectedEmail?.id === email.id ? 'bg-muted' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Mail className={`h-4 w-4 ${!email.isRead ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`text-sm ${!email.isRead ? 'font-semibold' : ''}`}>
                          {email.from}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStarToggle(email.id);
                        }}
                        className="hover:text-yellow-500"
                      >
                        <Star className={`h-4 w-4 ${email.isStarred ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
                      </button>
                    </div>
                    <h4 className={`text-sm mb-1 ${!email.isRead ? 'font-semibold' : ''}`}>
                      {email.subject}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {email.body}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {email.labels.map((label) => (
                          <Badge key={label} variant="secondary" className={`text-xs ${getLabelColor(label)}`}>
                            {label}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(email.timestamp, 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Email Detail */}
      <Card className="lg:col-span-2">
        {selectedEmail ? (
          <>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{selectedEmail.subject}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{selectedEmail.from}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>to {selectedEmail.to}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{format(selectedEmail.timestamp, 'PPpp')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsReplying(!isReplying)}
                  >
                    <Reply className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleArchive(selectedEmail.id)}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(selectedEmail.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-20rem)]">
                <div className="whitespace-pre-wrap mb-6">{selectedEmail.body}</div>
                
                {isReplying && (
                  <>
                    <Separator className="my-6" />
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Reply className="h-4 w-4" />
                        Reply to {selectedEmail.from}
                      </h3>
                      <Textarea
                        placeholder="Type your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="min-h-[150px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsReplying(false);
                            setReplyText('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSendReply}
                          disabled={!replyText.trim() || isLoading}
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Reply
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </ScrollArea>
            </CardContent>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select an email to view</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SharedInbox;