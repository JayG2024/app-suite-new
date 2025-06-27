import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { API_ENDPOINTS, apiCall } from "@/utils/api";
import { clients as importedClientsData } from "@/data/clientData";
import SlideInSidebar from "./SlideInSidebar";
import { cn } from "@/lib/utils";
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
  X,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreVertical,
  Hash,
  Target,
  TrendingUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  activities?: Array<{
    date: string;
    type: string;
    description: string;
  }>;
  projects?: Array<{
    id: string;
    name: string;
    status: string;
    value: number;
  }>;
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

const ClientManagerV2 = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showClientDetail, setShowClientDetail] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [users, setUsers] = useState<any[]>([]);
  const [aiSearchLoading, setAiSearchLoading] = useState(false);
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  
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
    source: 'website',
    notes: '',
    assigned_to: ''
  });

  useEffect(() => {
    loadClients();
    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = clients.filter(client => {
      const matchesSearch = !searchTerm || 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterType === "all" || client.type === filterType;
      
      return matchesSearch && matchesFilter;
    });
    setFilteredClients(filtered);
  }, [clients, searchTerm, filterType]);

  const loadClients = async () => {
    try {
      const data = await apiCall(API_ENDPOINTS.clients);
      setClients(data.clients || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      const storedClients = localStorage.getItem('app_suite_clients');
      if (storedClients) {
        try {
          const parsedClients = JSON.parse(storedClients);
          setClients(parsedClients);
        } catch (e) {
          console.error('Error parsing stored clients:', e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    const hardcodedUsers = [
      { id: 1, name: 'Jason Gordon', email: 'jason@jaydus.ai' },
      { id: 2, name: 'Almir', email: 'almir@jaydus.ai' }
    ];
    
    try {
      const data = await apiCall(API_ENDPOINTS.users);
      const apiUsers = data.users || [];
      const allUsers = [...hardcodedUsers];
      
      apiUsers.forEach((apiUser: any) => {
        if (!allUsers.find(u => u.email === apiUser.email)) {
          allUsers.push(apiUser);
        }
      });
      
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers(hardcodedUsers);
    }
  };

  const handleAISearch = async () => {
    if (!aiSearchQuery.trim()) return;
    
    setAiSearchLoading(true);
    try {
      const response = await apiCall(API_ENDPOINTS.aiResearch, {
        method: 'POST',
        body: JSON.stringify({ query: aiSearchQuery })
      });
      
      if (response.data) {
        const aiData = response.data;
        setFormData(prev => ({
          ...prev,
          name: aiData.contactName || prev.name,
          company: aiData.companyName || prev.company,
          email: aiData.email || prev.email,
          phone: aiData.phone || prev.phone,
          website: aiData.website || prev.website,
          address: aiData.address || prev.address,
          city: aiData.city || prev.city,
          state: aiData.state || prev.state,
          industry: aiData.industry || prev.industry,
          notes: `${prev.notes}\n\nAI Research Results:\n${aiData.summary || ''}`
        }));
        toast.success('AI research completed successfully');
      }
    } catch (error) {
      console.error('AI search error:', error);
      toast.error('Failed to perform AI research');
    } finally {
      setAiSearchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    try {
      await apiCall(API_ENDPOINTS.clients, {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null
        })
      });

      await loadClients();
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
        source: 'website',
        notes: '',
        assigned_to: ''
      });
      setShowAddClient(false);
      toast.success('Client added successfully');
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client');
    }
  };

  const handleUpdate = async (updates: Partial<Client>) => {
    if (!selectedClient) return;
    
    try {
      await apiCall(`${API_ENDPOINTS.clients}?id=${selectedClient.id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      
      await loadClients();
      toast.success('Client updated successfully');
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Failed to update client');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        await apiCall(`${API_ENDPOINTS.clients}?id=${id}`, {
          method: 'DELETE'
        });
        
        await loadClients();
        setShowClientDetail(false);
        setSelectedClient(null);
        toast.success('Client deleted successfully');
      } catch (error) {
        console.error('Error deleting client:', error);
        toast.error('Failed to delete client');
      }
    }
  };

  const handleImportClients = async () => {
    if (!confirm(`This will import ${importedClientsData.length} clients from the pre-loaded data. Continue?`)) {
      return;
    }

    setImportLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      const batchSize = 10;
      for (let i = 0; i < importedClientsData.length; i += batchSize) {
        const batch = importedClientsData.slice(i, i + batchSize);
        
        await Promise.all(
          batch.map(async (client) => {
            try {
              await apiCall(API_ENDPOINTS.clients, {
                method: 'POST',
                body: JSON.stringify({
                  name: `${client.firstName} ${client.lastName}`.trim(),
                  company: client.company || '',
                  email: client.email,
                  phone: client.phone || '',
                  type: 'prospect',
                  source: 'import',
                  notes: `Imported on ${new Date().toLocaleDateString()}`
                })
              });
              successCount++;
            } catch (error) {
              errorCount++;
              console.error(`Failed to import ${client.email}:`, error);
            }
          })
        );
        
        toast.success(`Imported ${Math.min(i + batchSize, importedClientsData.length)} of ${importedClientsData.length} clients...`);
        
        if (i + batchSize < importedClientsData.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      await loadClients();
      toast.success(`Import complete! ${successCount} clients imported successfully.`);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Import failed. Please try again.');
    } finally {
      setImportLoading(false);
    }
  };

  const openClientDetails = (client: Client) => {
    setSelectedClient(client);
    setShowClientDetail(true);
  };

  const closeClientDetails = () => {
    setShowClientDetail(false);
    setTimeout(() => setSelectedClient(null), 300);
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Client Management</CardTitle>
              <CardDescription>
                Manage your clients, track interactions, and maintain relationships
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleImportClients}
                disabled={importLoading}
              >
                {importLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Import Clients
              </Button>
              <Button onClick={() => setShowAddClient(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </div>
          </div>
        </CardHeader>
        
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

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}

          {!loading && viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map((client) => (
                <Card 
                  key={client.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openClientDetails(client)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{client.name}</h3>
                          <p className="text-sm text-muted-foreground">{client.company || 'No company'}</p>
                        </div>
                      </div>
                      <Badge className={getTypeColor(client.type)}>
                        {client.type}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {client.assigned_to_name && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{client.assigned_to_name}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `mailto:${client.email}`;
                          }}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        {client.phone && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `tel:${client.phone}`;
                            }}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {client.total_projects || 0} projects
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && viewMode === 'list' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
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
                    <tr 
                      key={client.id} 
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => openClientDetails(client)}
                    >
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
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `mailto:${client.email}`;
                            }}>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            {client.phone && (
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `tel:${client.phone}`;
                              }}>
                                <Phone className="h-4 w-4 mr-2" />
                                Call
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(client.id);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredClients.length === 0 && !loading && (
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

      {/* Client Details Sidebar */}
      <SlideInSidebar 
        isOpen={showClientDetail} 
        onClose={closeClientDetails}
        title={selectedClient?.name}
      >
        {selectedClient && (
          <div className="p-6 space-y-6">
            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedClient.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedClient.company || 'No company'}</p>
                </div>
              </div>
              
              <Badge className={getTypeColor(selectedClient.type)}>
                {selectedClient.type}
              </Badge>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${selectedClient.email}`} className="text-blue-600 hover:underline">
                    {selectedClient.email}
                  </a>
                </div>
                {selectedClient.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${selectedClient.phone}`} className="text-blue-600 hover:underline">
                      {selectedClient.phone}
                    </a>
                  </div>
                )}
                {selectedClient.website && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a href={selectedClient.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {selectedClient.website}
                    </a>
                  </div>
                )}
                {selectedClient.address && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedClient.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Business Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Business Information</h4>
              <div className="space-y-2">
                {selectedClient.industry && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Industry</span>
                    <span className="font-medium">{selectedClient.industry}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Source</span>
                  <span className="font-medium capitalize">{selectedClient.source || 'Direct'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">{new Date(selectedClient.created_at).toLocaleDateString()}</span>
                </div>
                {selectedClient.assigned_to_name && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Assigned To</span>
                    <span className="font-medium">{selectedClient.assigned_to_name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Projects</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{selectedClient.total_projects || 0}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Revenue</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">${(selectedClient.total_revenue || 0).toLocaleString()}</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Update Fields */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Update Status</h4>
              <Select 
                value={selectedClient.type} 
                onValueChange={(value) => handleUpdate({ type: value as Client["type"] })}
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

            {/* Notes */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Notes</h4>
              <Textarea 
                value={selectedClient.notes || ''} 
                onChange={(e) => handleUpdate({ notes: e.target.value })}
                placeholder="Add notes about this client..."
                rows={4}
              />
            </div>

            {/* Recent Activity */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Recent Activity</h4>
              <div className="space-y-2">
                {selectedClient.activities?.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p>{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                )) || (
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => window.open(`mailto:${selectedClient.email}`)}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              {selectedClient.phone && (
                <Button variant="outline" className="flex-1" onClick={() => window.open(`tel:${selectedClient.phone}`)}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              )}
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleDelete(selectedClient.id)}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </SlideInSidebar>

      {/* Add Client Sidebar */}
      <SlideInSidebar 
        isOpen={showAddClient} 
        onClose={() => setShowAddClient(false)}
        title="Add New Client"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* AI-Powered Client Search */}
          <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="h-5 w-5 text-blue-600" />
              <Label className="text-base font-semibold text-blue-700">AI-Powered Contact Search</Label>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Search for contact information using company name or person's name
            </p>
            <div className="flex gap-2">
              <Input
                value={aiSearchQuery}
                onChange={(e) => setAiSearchQuery(e.target.value)}
                placeholder="e.g., 'John Smith from Acme Corp' or 'CEO of TechStartup Inc'"
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
                <SelectItem value="">Unassigned</SelectItem>
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

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowAddClient(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Client</Button>
          </div>
        </form>
      </SlideInSidebar>
    </div>
  );
};

export default ClientManagerV2;