import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { 
  Send, 
  Hash, 
  Users, 
  MessageSquare,
  Plus,
  Search,
  Bell,
  BellOff,
  Pin,
  Paperclip,
  Smile,
  AtSign,
  Lock,
  Globe,
  X,
  UserPlus,
  Settings,
  ChevronDown,
  Circle,
  Loader2
} from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  channel_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  content: string;
  attachments?: string[];
  mentions?: string[];
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  reactions?: Record<string, string[]>;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'direct';
  members: string[];
  created_by: string;
  is_archived: boolean;
  last_message_at?: string;
  unread_count?: number;
  created_at: string;
  updated_at: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'away' | 'offline';
  role: string;
  last_seen?: string;
}

const TeamChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showNewChannelDialog, setShowNewChannelDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const [newChannelForm, setNewChannelForm] = useState({
    name: "",
    description: "",
    type: "public" as Channel['type'],
    members: [] as string[]
  });

  useEffect(() => {
    loadChannels();
    loadTeamMembers();
    setupRealtimeSubscriptions();

    return () => {
      // Cleanup subscriptions
      supabase.removeAllChannels();
    };
  }, []);

  useEffect(() => {
    if (currentChannel) {
      loadMessages(currentChannel.id);
      markChannelAsRead(currentChannel.id);
    }
  }, [currentChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to new messages
    const messageChannel = supabase
      .channel('team-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMsg = payload.new as Message;
          if (newMsg.channel_id === currentChannel?.id) {
            setMessages(prev => [...prev, newMsg]);
            // Play notification sound if not from current user
            if (newMsg.user_id !== user?.id) {
              playNotificationSound();
            }
          }
          // Update unread count for other channels
          updateChannelUnreadCount(newMsg.channel_id);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        (payload) => {
          const updatedMsg = payload.new as Message;
          setMessages(prev => prev.map(msg => 
            msg.id === updatedMsg.id ? updatedMsg : msg
          ));
        }
      )
      .subscribe();

    // Subscribe to presence (online status)
    const presenceChannel = supabase.channel('team-presence')
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        updateTeamMembersStatus(state);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: user?.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    // Subscribe to typing indicators
    const typingChannel = supabase.channel('team-typing')
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload.channel_id === currentChannel?.id && 
            payload.payload.user_id !== user?.id) {
          handleTypingIndicator(payload.payload.user_name, payload.payload.is_typing);
        }
      })
      .subscribe();
  };

  const loadChannels = async () => {
    try {
      // Mock data for demo
      const mockChannels: Channel[] = [
        {
          id: "1",
          name: "general",
          description: "General team discussions",
          type: "public",
          members: ["1", "2", "3", "4"],
          created_by: "1",
          is_archived: false,
          last_message_at: new Date().toISOString(),
          unread_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "2",
          name: "development",
          description: "Development team channel",
          type: "public",
          members: ["1", "2", "3"],
          created_by: "1",
          is_archived: false,
          unread_count: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "3",
          name: "sales",
          description: "Sales team discussions",
          type: "private",
          members: ["1", "4"],
          created_by: "1",
          is_archived: false,
          unread_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setChannels(mockChannels);
      if (mockChannels.length > 0) {
        setCurrentChannel(mockChannels[0]);
      }
    } catch (error) {
      console.error('Error loading channels:', error);
    }
    setLoading(false);
  };

  const loadMessages = async (channelId: string) => {
    try {
      // Mock messages for demo
      const mockMessages: Message[] = [
        {
          id: "1",
          channel_id: channelId,
          user_id: "2",
          user_name: "Sarah Chen",
          user_email: "sarah@app-suite.io",
          content: "Hey team! Just finished the new feature implementation 🎉",
          is_pinned: false,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          reactions: { "👍": ["1", "3"], "🎉": ["1"] }
        },
        {
          id: "2",
          channel_id: channelId,
          user_id: "1",
          user_name: "Mike Johnson",
          user_email: "mike@app-suite.io",
          content: "Great work @Sarah! Can you share the PR link?",
          mentions: ["2"],
          is_pinned: false,
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "3",
          channel_id: channelId,
          user_id: "2",
          user_name: "Sarah Chen",
          user_email: "sarah@app-suite.io",
          content: "Sure! Here's the PR: https://github.com/app-suite/project/pull/123",
          is_pinned: true,
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadTeamMembers = async () => {
    try {
      // Mock team members
      const mockMembers: TeamMember[] = [
        {
          id: "1",
          name: "Mike Johnson",
          email: "mike@app-suite.io",
          status: "online",
          role: "Developer"
        },
        {
          id: "2",
          name: "Sarah Chen",
          email: "sarah@app-suite.io",
          status: "online",
          role: "Developer"
        },
        {
          id: "3",
          name: "Alex Rivera",
          email: "alex@app-suite.io",
          status: "away",
          role: "Designer"
        },
        {
          id: "4",
          name: "Emma Watson",
          email: "emma@app-suite.io",
          status: "offline",
          role: "Sales",
          last_seen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ];
      setTeamMembers(mockMembers);
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentChannel || !user) return;

    setSendingMessage(true);
    try {
      const messageData = {
        channel_id: currentChannel.id,
        user_id: user.id,
        user_name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        user_email: user.email || '',
        content: newMessage,
        is_pinned: false,
        mentions: extractMentions(newMessage)
      };

      // In real app, this would insert into Supabase
      const newMsg: Message = {
        ...messageData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, newMsg]);
      setNewMessage("");
      
      // Broadcast typing stopped
      await broadcastTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const createChannel = async () => {
    if (!newChannelForm.name.trim()) {
      toast.error("Channel name is required");
      return;
    }

    try {
      // In real app, this would create in Supabase
      const newChannel: Channel = {
        id: Date.now().toString(),
        name: newChannelForm.name.toLowerCase().replace(/\s+/g, '-'),
        description: newChannelForm.description,
        type: newChannelForm.type,
        members: [user?.id || '1', ...newChannelForm.members],
        created_by: user?.id || '1',
        is_archived: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setChannels(prev => [...prev, newChannel]);
      setCurrentChannel(newChannel);
      setShowNewChannelDialog(false);
      setNewChannelForm({
        name: "",
        description: "",
        type: "public",
        members: []
      });
      toast.success('Channel created successfully!');
    } catch (error) {
      console.error('Error creating channel:', error);
      toast.error('Failed to create channel');
    }
  };

  const markChannelAsRead = async (channelId: string) => {
    setChannels(prev => prev.map(ch => 
      ch.id === channelId ? { ...ch, unread_count: 0 } : ch
    ));
  };

  const updateChannelUnreadCount = (channelId: string) => {
    if (channelId !== currentChannel?.id) {
      setChannels(prev => prev.map(ch => 
        ch.id === channelId ? { ...ch, unread_count: (ch.unread_count || 0) + 1 } : ch
      ));
    }
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
  };

  const broadcastTyping = async (isTyping: boolean) => {
    if (!currentChannel || !user) return;
    
    const channel = supabase.channel('team-typing');
    await channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        channel_id: currentChannel.id,
        user_id: user.id,
        user_name: user.user_metadata?.name || user.email?.split('@')[0],
        is_typing: isTyping
      }
    });
  };

  const handleTypingIndicator = (userName: string, isTyping: boolean) => {
    setTypingUsers(prev => {
      if (isTyping) {
        return prev.includes(userName) ? prev : [...prev, userName];
      } else {
        return prev.filter(u => u !== userName);
      }
    });
  };

  const updateTeamMembersStatus = (presenceState: any) => {
    const onlineUsers = Object.keys(presenceState).map(key => presenceState[key][0].user_id);
    setTeamMembers(prev => prev.map(member => ({
      ...member,
      status: onlineUsers.includes(member.id) ? 'online' : 'offline'
    })));
  };

  const playNotificationSound = () => {
    // Play a notification sound
    const audio = new Audio('/notification.mp3');
    audio.play().catch(() => {});
  };

  const togglePinMessage = async (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, is_pinned: !msg.is_pinned } : msg
    ));
  };

  const addReaction = async (messageId: string, emoji: string) => {
    if (!user) return;
    
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || {};
        const emojiUsers = reactions[emoji] || [];
        
        if (emojiUsers.includes(user.id)) {
          // Remove reaction
          reactions[emoji] = emojiUsers.filter(id => id !== user.id);
          if (reactions[emoji].length === 0) {
            delete reactions[emoji];
          }
        } else {
          // Add reaction
          reactions[emoji] = [...emojiUsers, user.id];
        }
        
        return { ...msg, reactions };
      }
      return msg;
    }));
  };

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
    }
  };

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Sidebar */}
      <div className="w-64 border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b">
          <Button 
            className="w-full" 
            onClick={() => setShowNewChannelDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Channel
          </Button>
        </div>

        <div className="p-4">
          <Input
            placeholder="Search channels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
        </div>

        <ScrollArea className="flex-1">
          <div className="px-4 pb-4">
            <h3 className="font-semibold text-sm text-gray-600 mb-2">Channels</h3>
            {filteredChannels.map(channel => (
              <button
                key={channel.id}
                onClick={() => setCurrentChannel(channel)}
                className={`w-full text-left p-2 rounded-lg mb-1 transition-colors ${
                  currentChannel?.id === channel.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {channel.type === 'private' ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Hash className="h-4 w-4" />
                    )}
                    <span className="font-medium">{channel.name}</span>
                  </div>
                  {channel.unread_count && channel.unread_count > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {channel.unread_count}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {channel.description}
                </p>
              </button>
            ))}
          </div>

          <div className="px-4 pb-4">
            <h3 className="font-semibold text-sm text-gray-600 mb-2">Team Members</h3>
            {teamMembers.map(member => (
              <div
                key={member.id}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div 
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      {currentChannel ? (
        <div className="flex-1 flex flex-col">
          {/* Channel Header */}
          <div className="border-b p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  {currentChannel.type === 'private' ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Hash className="h-4 w-4" />
                  )}
                  {currentChannel.name}
                </h2>
                <p className="text-sm text-gray-600">{currentChannel.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messages.map((message, index) => {
              const showDate = index === 0 || 
                new Date(message.created_at).toDateString() !== 
                new Date(messages[index - 1].created_at).toDateString();

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="flex items-center my-4">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="px-4 text-xs text-gray-500">
                        {format(new Date(message.created_at), 'MMMM d, yyyy')}
                      </span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                  )}
                  
                  <div className={`flex gap-3 mb-4 group ${message.is_pinned ? 'bg-yellow-50 p-2 rounded' : ''}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {message.user_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{message.user_name}</span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(message.created_at), 'h:mm a')}
                        </span>
                        {message.is_pinned && (
                          <Pin className="h-3 w-3 text-yellow-600" />
                        )}
                      </div>
                      <p className="text-sm mt-1">{message.content}</p>
                      
                      {/* Reactions */}
                      {message.reactions && Object.keys(message.reactions).length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {Object.entries(message.reactions).map(([emoji, users]) => (
                            <button
                              key={emoji}
                              onClick={() => addReaction(message.id, emoji)}
                              className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-xs"
                            >
                              <span>{emoji}</span>
                              <span>{users.length}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Message Actions (shown on hover) */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 mt-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2"
                          onClick={() => addReaction(message.id, '👍')}
                        >
                          <Smile className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2"
                          onClick={() => togglePinMessage(message.id)}
                        >
                          <Pin className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <div className="flex gap-1">
                  <Circle className="h-2 w-2 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <Circle className="h-2 w-2 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <Circle className="h-2 w-2 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>
                  {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t p-4 bg-white">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  if (e.target.value.length > 0) {
                    broadcastTyping(true);
                  } else {
                    broadcastTyping(false);
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={`Message #${currentChannel.name}`}
                className="flex-1"
              />
              <Button 
                onClick={sendMessage}
                disabled={!newMessage.trim() || sendingMessage}
              >
                {sendingMessage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Select a channel to start chatting</p>
          </div>
        </div>
      )}

      {/* New Channel Dialog */}
      {showNewChannelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Create New Channel</CardTitle>
              <CardDescription>
                Channels are where your team communicates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="channel-name">Channel Name</Label>
                <Input
                  id="channel-name"
                  value={newChannelForm.name}
                  onChange={(e) => setNewChannelForm({...newChannelForm, name: e.target.value})}
                  placeholder="e.g., marketing, product-updates"
                />
              </div>
              <div>
                <Label htmlFor="channel-description">Description</Label>
                <Input
                  id="channel-description"
                  value={newChannelForm.description}
                  onChange={(e) => setNewChannelForm({...newChannelForm, description: e.target.value})}
                  placeholder="What's this channel about?"
                />
              </div>
              <div>
                <Label>Channel Type</Label>
                <Select
                  value={newChannelForm.type}
                  onValueChange={(value) => setNewChannelForm({...newChannelForm, type: value as Channel['type']})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>Public - Anyone can join</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <span>Private - Invite only</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewChannelDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createChannel}>
                  Create Channel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TeamChat;