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
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Building, 
  MapPin,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  User,
  Filter,
  Download,
  Upload,
  Globe,
  Briefcase,
  Activity,
  FileText,
  MessageSquare,
  Bot,
  Loader2,
  X
} from "lucide-react";

interface Client {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  website?: string;
  industry?: string;
  type: 'prospect' | 'active' | 'inactive' | 'archived';
  source?: string;
  notes?: string;
  tags?: string[];
  created_at: string;
  updated_at?: string;
  total_projects?: number;
  total_revenue?: number;
  last_contact?: string;
  assigned_to?: number;
  assigned_to_name?: string;
}

interface ClientFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  website: string;
  industry: string;
  type: 'prospect' | 'active' | 'inactive' | 'archived';
  source: string;
  notes: string;
  assigned_to: string;
}

const ClientManager = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showEditClient, setShowEditClient] = useState(false);
  const [showClientDetail, setShowClientDetail] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [users, setUsers] = useState<any[]>([]);
  const [aiSearchLoading, setAiSearchLoading] = useState(false);
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
    website: '',
    industry: '',
    type: 'prospect',
    source: '',
    notes: '',
    assigned_to: ''
  });

  // Hardcoded team members
  const hardcodedUsers = [
    { id: 1, name: 'Jason Gordon', email: 'jason@jaydus.ai' },
    { id: 2, name: 'Almir', email: 'almir@jaydus.ai' }
  ];

  useEffect(() => {
    loadClients();
    setUsers(hardcodedUsers);
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchTerm, filterType]);

  const loadClients = async () => {
    try {
      // Use clients endpoint (which uses leads table internally)
      const data = await apiCall(API_ENDPOINTS.clients);
      const clientsData = (data.clients || data.leads)?.map((lead: any) => ({
        ...lead,
        type: lead.status === 'active' ? 'active' : 
              lead.status === 'new' ? 'prospect' : 
              lead.status === 'closed-lost' ? 'inactive' : 'prospect',
        industry: lead.source || 'Technology',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: 'USA',
        website: '',
        assigned_to_name: lead.assignedToName || lead.assigned_to_name
      })) || [];
      
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const filterClients = () => {
    let filtered = [...clients];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.includes(searchTerm)
      );
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(client => client.type === filterType);
    }
    
    setFilteredClients(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Create client
      const response = await apiCall(API_ENDPOINTS.clients, {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          status: formData.type === 'active' ? 'active' : 'new',
          source: formData.source || 'direct',
          notes: formData.notes,
          assigned_to: formData.assigned_to && formData.assigned_to !== 'unassigned' ? 
                       parseInt(formData.assigned_to) : null,
          // Additional fields for future use
          metadata: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
            website: formData.website,
            industry: formData.industry
          }
        })
      });

      if (response.client || response.lead) {
        toast.success('Client added successfully');
        loadClients();
        setShowAddClient(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client');
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone || '',
      address: client.address || '',
      city: client.city || '',
      state: client.state || '',
      zip: client.zip || '',
      country: client.country || 'USA',
      website: client.website || '',
      industry: client.industry || '',
      type: client.type,
      source: client.source || '',
      notes: client.notes || '',
      assigned_to: client.assigned_to?.toString() || ''
    });
    setShowEditClient(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !editingClient) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await apiCall(`${API_ENDPOINTS.clients}?id=${editingClient.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          status: formData.type === 'active' ? 'active' : 'new',
          source: formData.source || 'direct',
          notes: formData.notes,
          assigned_to: formData.assigned_to && formData.assigned_to !== 'unassigned' ? 
                       parseInt(formData.assigned_to) : null,
          metadata: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
            website: formData.website,
            industry: formData.industry
          }
        })
      });

      if (response.client || response.lead) {
        toast.success('Client updated successfully');
        loadClients();
        setShowEditClient(false);
        setEditingClient(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Failed to update client');
    }
  };

  const handleDelete = async (clientId: number) => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      await apiCall(`${API_ENDPOINTS.clients}?id=${clientId}`, {
        method: 'DELETE'
      });
      
      toast.success('Client deleted successfully');
      loadClients();
      if (selectedClient?.id === clientId) {
        setSelectedClient(null);
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
    }
  };

  const handleAISearch = async () => {
    if (!aiSearchQuery.trim()) {
      toast.error('Please enter a company name or employee information');
      return;
    }

    setAiSearchLoading(true);
    
    try {
      const response = await fetch('/.netlify/functions/openai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `I need to find contact information for "${aiSearchQuery}". Please search for and provide as much information as you can about this company or person including:
              - Full company name
              - Website URL
              - Industry/business type
              - Location (city, state, country)
              - Phone number if available
              - Email if available
              - Brief description of what they do
              
              Format your response as structured data that I can use to populate a client form.`
            }
          ],
          context: 'customer_support',
          temperature: 0.3,
          maxTokens: 800
        })
      });

      if (!response.ok) {
        throw new Error('AI search failed');
      }

      const data = await response.json();
      const aiInfo = data.message;

      // Parse AI response and populate form fields
      populateFormFromAI(aiInfo);
      
      toast.success('AI search completed! Review and edit the populated information.');
    } catch (error) {
      console.error('AI search error:', error);
      toast.error('AI search failed. Please try again or enter information manually.');
    } finally {
      setAiSearchLoading(false);
    }
  };

  const populateFormFromAI = (aiResponse: string) => {
    // Extract information from AI response and populate form
    // This is a simple implementation - in production you'd want more sophisticated parsing
    
    const extractField = (text: string, patterns: string[]): string => {
      for (const pattern of patterns) {
        const regex = new RegExp(pattern + '\\s*:?\\s*([^\\n]+)', 'i');
        const match = text.match(regex);
        if (match && match[1]) {
          return match[1].trim().replace(/["\*\-]/g, '').trim();
        }
      }
      return '';
    };

    const company = extractField(aiResponse, ['company', 'business', 'organization', 'corp']);
    const website = extractField(aiResponse, ['website', 'url', 'web']);
    const industry = extractField(aiResponse, ['industry', 'business type', 'sector']);
    const location = extractField(aiResponse, ['location', 'address', 'city']);
    const phone = extractField(aiResponse, ['phone', 'telephone', 'tel']);
    const email = extractField(aiResponse, ['email', 'e-mail']);

    // Parse location into city, state components
    let city = '', state = '', country = 'USA';
    if (location) {
      const locationParts = location.split(',').map(p => p.trim());
      if (locationParts.length >= 2) {
        city = locationParts[0];
        state = locationParts[1];
        if (locationParts.length >= 3) {
          country = locationParts[2];
        }
      } else {
        city = location;
      }
    }

    // Update form with AI-found information
    setFormData(prev => ({
      ...prev,
      company: company || prev.company,
      website: website || prev.website,
      industry: industry || prev.industry,
      city: city || prev.city,
      state: state || prev.state,
      country: country || prev.country,
      phone: phone || prev.phone,
      email: email || prev.email,
      notes: prev.notes + '\n\nAI Research:\n' + aiResponse
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: 'USA',
      website: '',
      industry: '',
      type: 'prospect',
      source: '',
      notes: '',
      assigned_to: ''
    });
    setAiSearchQuery('');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const clientStats = {
    total: clients.length,
    active: clients.filter(c => c.type === 'active').length,
    prospects: clients.filter(c => c.type === 'prospect').length,
    inactive: clients.filter(c => c.type === 'inactive').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Clients</CardDescription>
            <CardTitle className="text-2xl">{clientStats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Clients</CardDescription>
            <CardTitle className="text-2xl text-green-600">{clientStats.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Prospects</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{clientStats.prospects}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Inactive</CardDescription>
            <CardTitle className="text-2xl text-gray-600">{clientStats.inactive}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Client Management</CardTitle>
            <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Client</DialogTitle>
                  <DialogDescription>
                    Enter client information to add them to your database.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* AI-Powered Client Search */}
                  <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-2 mb-3">
                      <Bot className="h-5 w-5 text-blue-600" />
                      <Label className="text-base font-semibold text-blue-700">Fill Client Contact with AI</Label>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Enter a company name and employee (e.g., "My Computer Career employee Matthew") and AI will research and populate contact information.
                    </p>
                    <div className="flex gap-2">
                      <Input
                        value={aiSearchQuery}
                        onChange={(e) => setAiSearchQuery(e.target.value)}
                        placeholder="e.g., My Computer Career employee Matthew"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleAISearch}
                        disabled={aiSearchLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {aiSearchLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                        {aiSearchLoading ? 'Searching...' : 'Search'}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Contact Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        placeholder="Acme Inc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="123 Main St"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        placeholder="NY"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP</Label>
                      <Input
                        id="zip"
                        value={formData.zip}
                        onChange={(e) => setFormData({...formData, zip: e.target.value})}
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) => setFormData({...formData, industry: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Client Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({...formData, type: value as any})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prospect">Prospect</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="source">Source</Label>
                      <Select
                        value={formData.source}
                        onValueChange={(value) => setFormData({...formData, source: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="email">Email Campaign</SelectItem>
                          <SelectItem value="cold">Cold Outreach</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="assigned_to">Assigned To</Label>
                    <Select
                      value={formData.assigned_to}
                      onValueChange={(value) => setFormData({...formData, assigned_to: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Additional notes about this client..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddClient(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Client</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        {/* Edit Client Dialog */}
        <Dialog open={showEditClient} onOpenChange={setShowEditClient}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>
                Update client information and add notes.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              {/* AI-Powered Client Search for Edit */}
              <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <Label className="text-base font-semibold text-blue-700">Update with AI Research</Label>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Research and update contact information for this client using AI.
                </p>
                <div className="flex gap-2">
                  <Input
                    value={aiSearchQuery}
                    onChange={(e) => setAiSearchQuery(e.target.value)}
                    placeholder={`Research ${editingClient?.company || editingClient?.name || 'this client'}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAISearch}
                    disabled={aiSearchLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {aiSearchLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                    {aiSearchLoading ? 'Researching...' : 'Research'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Contact Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-company">Company Name</Label>
                  <Input
                    id="edit-company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="Acme Inc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-city">City</Label>
                  <Input
                    id="edit-city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-state">State</Label>
                  <Input
                    id="edit-state"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    placeholder="NY"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-zip">ZIP</Label>
                  <Input
                    id="edit-zip"
                    value={formData.zip}
                    onChange={(e) => setFormData({...formData, zip: e.target.value})}
                    placeholder="10001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-website">Website</Label>
                  <Input
                    id="edit-website"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-industry">Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData({...formData, industry: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-type">Client Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({...formData, type: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prospect">Prospect</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-source">Source</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => setFormData({...formData, source: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="email">Email Campaign</SelectItem>
                      <SelectItem value="cold">Cold Outreach</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-assigned_to">Assigned To</Label>
                <Select
                  value={formData.assigned_to}
                  onValueChange={(value) => setFormData({...formData, assigned_to: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes about this client..."
                  rows={6}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  AI research results will be appended to existing notes.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  setShowEditClient(false);
                  setEditingClient(null);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button type="submit">Update Client</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="prospect">Prospects</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')}>
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Client Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map((client) => (
                <Card key={client.id} className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedClient(client)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{client.name}</CardTitle>
                        {client.company && (
                          <CardDescription className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {client.company}
                          </CardDescription>
                        )}
                      </div>
                      <Badge className={getTypeColor(client.type)}>
                        {client.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {client.assigned_to_name && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{client.assigned_to_name}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `mailto:${client.email}`;
                        }}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(client);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(client.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Company</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Assigned To</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{client.name}</td>
                      <td className="py-3">{client.company || '-'}</td>
                      <td className="py-3">{client.email}</td>
                      <td className="py-3">{client.phone || '-'}</td>
                      <td className="py-3">
                        <Badge className={getTypeColor(client.type)}>
                          {client.type}
                        </Badge>
                      </td>
                      <td className="py-3">{client.assigned_to_name || 'Unassigned'}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.location.href = `mailto:${client.email}`}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(client)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(client.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No clients found</p>
              <Button
                className="mt-4"
                onClick={() => setShowAddClient(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Client
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientManager;