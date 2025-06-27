import { useState, useEffect, DragEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { API_ENDPOINTS, apiCall } from "@/utils/api";
import { toast } from "sonner";
import SlideInSidebar from "./SlideInSidebar";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Phone,
  Mail,
  Calendar,
  FileText,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  Building,
  Trash2,
  Edit,
  MoreVertical,
  GripVertical,
  MessageSquare,
  User,
  MapPin,
  Globe,
  Briefcase,
  Activity
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  value: number;
  type: "standard" | "ai-enhanced" | "enterprise";
  stage: "lead" | "qualified" | "proposal" | "negotiation" | "closed-won" | "closed-lost";
  probability: number;
  nextAction: string;
  nextActionDate: string;
  source: string;
  notes: string;
  createdDate: string;
  assignedTo?: number;
  assignedToName?: string;
  createdBy?: number;
  createdByName?: string;
  address?: string;
  website?: string;
  industry?: string;
  lastContact?: string;
  activities?: Array<{
    date: string;
    type: string;
    description: string;
  }>;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

const SalesPipelineV2 = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAddLead, setShowAddLead] = useState(false);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [filterStage, setFilterStage] = useState<string>("all");
  const [newLead, setNewLead] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    type: "standard" as Lead["type"],
    source: "website",
    notes: "",
    assignedTo: ""
  });

  // Load data from database
  useEffect(() => {
    const authUser = localStorage.getItem("commandCenterUser");
    setCurrentUser(authUser);
    loadUsers();
    loadLeads();
    
    const interval = setInterval(loadLeads, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadUsers = async () => {
    const hardcodedUsers = [
      { id: 1, name: 'Jason Gordon', email: 'jason@jaydus.ai', role: 'admin' },
      { id: 2, name: 'Almir', email: 'almir@jaydus.ai', role: 'admin' }
    ];
    
    try {
      const data = await apiCall(API_ENDPOINTS.users);
      const apiUsers = data.users || [];
      const allUsers = [...hardcodedUsers];
      
      apiUsers.forEach((apiUser: User) => {
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

  const loadLeads = async () => {
    try {
      const data = await apiCall(API_ENDPOINTS.leads);
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Error loading leads:', error);
      const storedLeads = localStorage.getItem('app_suite_leads');
      if (storedLeads) {
        try {
          setLeads(JSON.parse(storedLeads));
        } catch (e) {
          console.error('Error parsing localStorage leads:', e);
        }
      }
    }
  };

  const stages = [
    { name: "lead", label: "New Lead", color: "bg-gray-500" },
    { name: "qualified", label: "Qualified", color: "bg-blue-500" },
    { name: "proposal", label: "Proposal Sent", color: "bg-purple-500" },
    { name: "negotiation", label: "Negotiation", color: "bg-orange-500" },
    { name: "closed-won", label: "Closed Won", color: "bg-green-500" },
    { name: "closed-lost", label: "Closed Lost", color: "bg-red-500" }
  ];

  const calculatePipelineValue = (stage?: string) => {
    return leads
      .filter(lead => !stage || stage === "all" || lead.stage === stage)
      .reduce((sum, lead) => {
        if (lead.stage === "closed-won") return sum + lead.value;
        if (lead.stage === "closed-lost") return sum;
        return sum + (lead.value * lead.probability / 100);
      }, 0);
  };

  const getStageLeads = (stage: string) => {
    return leads.filter(lead => lead.stage === stage);
  };

  const getCurrentUserId = () => {
    const user = users.find(u => u.email === currentUser);
    return user?.id || null;
  };

  // Drag and Drop handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, stage: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, newStage: string) => {
    e.preventDefault();
    setDragOverStage(null);
    
    if (!draggedLead || draggedLead.stage === newStage) return;
    
    try {
      await apiCall(API_ENDPOINTS.leads, {
        method: 'PUT',
        body: JSON.stringify({ id: draggedLead.id, stage: newStage })
      });
      
      await loadLeads();
      toast.success(`Moved ${draggedLead.company} to ${stages.find(s => s.name === newStage)?.label}`);
    } catch (error) {
      console.error('Error updating lead stage:', error);
      toast.error('Failed to update lead stage');
    }
    
    setDraggedLead(null);
  };

  const openLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowSidebar(true);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
    setTimeout(() => setSelectedLead(null), 300);
  };

  const addLead = async () => {
    if (!newLead.company || !newLead.contact || !newLead.email) {
      alert("Please fill in company, contact, and email fields");
      return;
    }

    try {
      await apiCall(API_ENDPOINTS.leads, {
        method: 'POST',
        body: JSON.stringify({
          company: newLead.company,
          contact: newLead.contact,
          email: newLead.email,
          phone: newLead.phone,
          type: newLead.type,
          source: newLead.source,
          notes: newLead.notes,
          assigned_to: newLead.assignedTo ? parseInt(newLead.assignedTo) : null,
          created_by: getCurrentUserId()
        })
      });

      await loadLeads();
      setNewLead({
        company: "",
        contact: "",
        email: "",
        phone: "",
        type: "standard",
        source: "website",
        notes: "",
        assignedTo: ""
      });
      setShowAddLead(false);
      toast.success('Lead created successfully');
    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error('Failed to create lead. Please try again.');
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      await apiCall(`${API_ENDPOINTS.leads}?id=${leadId}`, {
        method: 'DELETE'
      });
      
      await loadLeads();
      closeSidebar();
      toast.success('Lead deleted successfully');
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    }
  };

  const getTypeInfo = (type: string) => {
    switch(type) {
      case "standard": return { label: "$5K Standard", color: "default" };
      case "ai-enhanced": return { label: "$7.5K AI", color: "secondary" };
      case "enterprise": return { label: "$10K Enterprise", color: "destructive" };
      default: return { label: "Unknown", color: "outline" };
    }
  };

  const updateLead = async (updates: Partial<Lead>) => {
    if (!selectedLead) return;
    
    try {
      await apiCall(`${API_ENDPOINTS.leads}?id=${selectedLead.id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      
      await loadLeads();
      toast.success('Lead updated successfully');
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead');
    }
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${calculatePipelineValue().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Weighted by probability</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.filter(l => !["closed-won", "closed-lost"].includes(l.stage)).length}</div>
            <p className="text-xs text-muted-foreground mt-1">${leads.filter(l => !["closed-won", "closed-lost"].includes(l.stage)).reduce((sum, l) => sum + l.value, 0).toLocaleString()} potential</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const closedWon = leads.filter(l => l.stage === "closed-won").length;
              const closedLost = leads.filter(l => l.stage === "closed-lost").length;
              const total = closedWon + closedLost;
              const winRate = total > 0 ? Math.round((closedWon / total) * 100) : 0;
              return (
                <>
                  <div className="text-2xl font-bold">{winRate}%</div>
                  <Progress value={winRate} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">{closedWon} won, {closedLost} lost</p>
                </>
              );
            })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const avgValue = leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + l.value, 0) / leads.length) : 0;
              return (
                <>
                  <div className="text-2xl font-bold">${avgValue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">{leads.length} total deals</p>
                </>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={filterStage} onValueChange={setFilterStage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {stages.map(stage => (
                <SelectItem key={stage.name} value={stage.name}>{stage.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline">
            {filterStage === "all" ? leads.length : getStageLeads(filterStage).length} deals
          </Badge>
        </div>

        <Button onClick={() => setShowAddLead(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Pipeline Stages - Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        {stages.map(stage => {
          const stageLeads = getStageLeads(stage.name);
          const stageValue = calculatePipelineValue(stage.name);
          
          return (
            <div 
              key={stage.name} 
              className={cn(
                "space-y-3 p-3 rounded-lg border-2 transition-colors",
                dragOverStage === stage.name ? "border-primary bg-primary/5" : "border-transparent"
              )}
              onDragOver={(e) => handleDragOver(e, stage.name)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.name)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{stage.label}</h3>
                <Badge variant="outline">{stageLeads.length}</Badge>
              </div>
              <div className={`h-1 ${stage.color} rounded`} />
              <p className="text-xs text-muted-foreground">
                ${stageValue.toLocaleString()}
              </p>
              
              <div className="space-y-2">
                {stageLeads.map(lead => {
                  const typeInfo = getTypeInfo(lead.type);
                  const daysUntilAction = Math.ceil((new Date(lead.nextActionDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <Card 
                      key={lead.id} 
                      className="cursor-move hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead)}
                      onClick={() => openLeadDetails(lead)}
                    >
                      <CardHeader className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="space-y-1">
                              <p className="font-medium text-sm">{lead.company}</p>
                              <p className="text-xs text-muted-foreground">{lead.contact}</p>
                              {lead.assignedToName && (
                                <p className="text-xs text-blue-600">
                                  {lead.assignedToName}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge variant={typeInfo.color as any} className="text-xs">
                            ${(lead.value / 1000).toFixed(1)}K
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Probability</span>
                          <span className="font-medium">{lead.probability}%</span>
                        </div>
                        <Progress value={lead.probability} className="h-1" />
                        
                        {daysUntilAction <= 2 && (
                          <div className="flex items-center gap-1 text-xs text-orange-600">
                            <AlertCircle className="h-3 w-3" />
                            Action {daysUntilAction === 0 ? "today" : `in ${daysUntilAction}d`}
                          </div>
                        )}
                        
                        <div className="flex gap-1 pt-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 w-7 p-0" 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`tel:${lead.phone}`);
                            }}
                          >
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 w-7 p-0" 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`mailto:${lead.email}`);
                            }}
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 w-7 p-0 ml-auto"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openLeadDetails(lead)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => deleteLead(lead.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-3 w-3 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {stageLeads.length === 0 && (
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <p className="text-xs text-muted-foreground">Drop leads here</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lead Details Sidebar */}
      <SlideInSidebar 
        isOpen={showSidebar} 
        onClose={closeSidebar}
        title={selectedLead?.company}
      >
        {selectedLead && (
          <div className="p-6 space-y-6">
            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedLead.company}</h3>
                  <p className="text-sm text-muted-foreground">{selectedLead.industry || 'Technology'}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Badge variant={getTypeInfo(selectedLead.type).color as any}>
                  {getTypeInfo(selectedLead.type).label}
                </Badge>
                <Badge variant="outline">
                  {stages.find(s => s.name === selectedLead.stage)?.label}
                </Badge>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedLead.contact}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${selectedLead.email}`} className="text-blue-600 hover:underline">
                    {selectedLead.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${selectedLead.phone}`} className="text-blue-600 hover:underline">
                    {selectedLead.phone}
                  </a>
                </div>
                {selectedLead.website && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a href={selectedLead.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {selectedLead.website}
                    </a>
                  </div>
                )}
                {selectedLead.address && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedLead.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Deal Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Deal Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Value</span>
                  <span className="font-medium">${selectedLead.value.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Probability</span>
                  <span className="font-medium">{selectedLead.probability}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expected Value</span>
                  <span className="font-medium">
                    ${Math.round(selectedLead.value * selectedLead.probability / 100).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Source</span>
                  <span className="font-medium capitalize">{selectedLead.source}</span>
                </div>
              </div>
            </div>

            {/* Stage Update */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Stage</h4>
              <Select 
                value={selectedLead.stage} 
                onValueChange={(value) => updateLead({ stage: value as Lead["stage"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.map(stage => (
                    <SelectItem key={stage.name} value={stage.name}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Next Action */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Next Action</h4>
              <Input 
                value={selectedLead.nextAction} 
                onChange={(e) => updateLead({ nextAction: e.target.value })}
                placeholder="Enter next action..."
              />
              <Input 
                type="date" 
                value={selectedLead.nextActionDate} 
                onChange={(e) => updateLead({ nextActionDate: e.target.value })}
              />
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Notes</h4>
              <Textarea 
                value={selectedLead.notes} 
                onChange={(e) => updateLead({ notes: e.target.value })}
                placeholder="Add notes..."
                rows={4}
              />
            </div>

            {/* Activity Timeline */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Recent Activity</h4>
              <div className="space-y-2">
                {selectedLead.activities?.map((activity, index) => (
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
              <Button variant="outline" className="flex-1" onClick={() => window.open(`mailto:${selectedLead.email}`)}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => window.open(`tel:${selectedLead.phone}`)}>
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => deleteLead(selectedLead.id)}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </SlideInSidebar>

      {/* Add Lead Sidebar */}
      <SlideInSidebar 
        isOpen={showAddLead} 
        onClose={() => setShowAddLead(false)}
        title="Add New Lead"
      >
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Company Name *</Label>
              <Input 
                placeholder="Acme Corp" 
                value={newLead.company}
                onChange={(e) => setNewLead({...newLead, company: e.target.value})}
              />
            </div>
            <div>
              <Label>Contact Name *</Label>
              <Input 
                placeholder="John Doe" 
                value={newLead.contact}
                onChange={(e) => setNewLead({...newLead, contact: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email *</Label>
              <Input 
                type="email" 
                placeholder="john@acme.com" 
                value={newLead.email}
                onChange={(e) => setNewLead({...newLead, email: e.target.value})}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input 
                type="tel" 
                placeholder="+1 (555) 123-4567" 
                value={newLead.phone}
                onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Deal Type</Label>
              <Select value={newLead.type} onValueChange={(value) => setNewLead({...newLead, type: value as Lead["type"]})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">$5K Standard</SelectItem>
                  <SelectItem value="ai-enhanced">$7.5K AI-Enhanced</SelectItem>
                  <SelectItem value="enterprise">$10K Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Lead Source</Label>
              <Select value={newLead.source} onValueChange={(value) => setNewLead({...newLead, source: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="cold-outreach">Cold Outreach</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="event">Event/Conference</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Assign To</Label>
            <Select value={newLead.assignedTo} onValueChange={(value) => setNewLead({...newLead, assignedTo: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea 
              placeholder="Initial notes about this lead..." 
              value={newLead.notes}
              onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddLead(false)}>Cancel</Button>
            <Button onClick={addLead}>Add Lead</Button>
          </div>
        </div>
      </SlideInSidebar>
    </div>
  );
};

export default SalesPipelineV2;