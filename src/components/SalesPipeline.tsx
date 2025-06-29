import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet-fixed";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { API_ENDPOINTS, apiCall } from "@/utils/api";
import { toast } from "sonner";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Phone,
  Mail,
  Calendar,
  FileText,
  Plus,
  MoveRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  Zap,
  Building,
  Trash2,
  Edit,
  MoreHorizontal
} from "lucide-react";

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
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

const SalesPipeline = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showEditLead, setShowEditLead] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Load data from database
  useEffect(() => {
    // Get current user
    const authUser = localStorage.getItem("commandCenterUser");
    setCurrentUser(authUser);

    // Load users and leads
    loadUsers();
    loadLeads();
    
    // Refresh data every 30 seconds for real-time collaboration
    const interval = setInterval(loadLeads, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const loadUsers = async () => {
    // Hardcode Jason and Almir as team members
    const hardcodedUsers = [
      { id: 1, name: 'Jason Gordon', email: 'jason@jaydus.ai' },
      { id: 2, name: 'Almir', email: 'almir@jaydus.ai' }
    ];
    
    try {
      const data = await apiCall(API_ENDPOINTS.users);
      // Combine API users with hardcoded ones, avoiding duplicates
      const apiUsers = data.users || [];
      const allUsers = [...hardcodedUsers];
      
      // Add any API users that aren't already in our hardcoded list
      apiUsers.forEach((apiUser: User) => {
        if (!allUsers.find(u => u.email === apiUser.email)) {
          allUsers.push(apiUser);
        }
      });
      
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      // Fallback to hardcoded users
      setUsers(hardcodedUsers);
    }
  };

  const loadLeads = async () => {
    try {
      const data = await apiCall(API_ENDPOINTS.leads);
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Error loading leads:', error);
      // Fallback to localStorage for now
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

  const getCurrentUserId = () => {
    const user = users.find(u => u.email === currentUser);
    return user?.id || null;
  };

  const [showAddLead, setShowAddLead] = useState(false);
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
  
  const [editLead, setEditLead] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    type: "standard" as Lead["type"],
    source: "website",
    notes: "",
    assignedTo: "",
    value: 5000,
    probability: 20,
    nextAction: "",
    nextActionDate: "",
    stage: "lead" as Lead["stage"]
  });

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

  const moveToNextStage = async (leadId: string) => {
    const stageOrder = ["lead", "qualified", "proposal", "negotiation", "closed-won"];
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const currentIndex = stageOrder.indexOf(lead.stage);
    if (currentIndex < stageOrder.length - 1) {
      const newStage = stageOrder[currentIndex + 1] as Lead["stage"];
      await moveToStage(leadId, newStage);
    }
  };

  const moveToStage = async (leadId: string, newStage: Lead["stage"]) => {
    try {
      await apiCall(API_ENDPOINTS.leads, {
        method: 'PUT',
        body: JSON.stringify({ id: leadId, stage: newStage })
      });
      
      await loadLeads(); // Refresh data
      toast.success('Lead stage updated');
    } catch (error) {
      console.error('Error updating lead stage:', error);
      toast.error('Failed to update lead stage');
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      await apiCall(`${API_ENDPOINTS.leads}?id=${leadId}`, {
        method: 'DELETE'
      });
      
      await loadLeads(); // Refresh data
      toast.success('Lead deleted successfully');
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    }
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
          name: newLead.contact,  // Changed from contact to name
          company: newLead.company,
          email: newLead.email,
          phone: newLead.phone,
          status: 'new',
          value: 0,
          source: newLead.source,
          notes: newLead.notes
        })
      });

      await loadLeads(); // Refresh data
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

  const updateLead = async () => {
    if (!selectedLead || !editLead.company || !editLead.contact || !editLead.email) {
      alert("Please fill in company, contact, and email fields");
      return;
    }

    try {
      await apiCall(`${API_ENDPOINTS.leads}?id=${selectedLead.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: editLead.contact,
          company: editLead.company,
          email: editLead.email,
          phone: editLead.phone,
          type: editLead.type,
          stage: editLead.stage,
          value: editLead.value,
          probability: editLead.probability,
          source: editLead.source,
          notes: editLead.notes,
          next_action: editLead.nextAction,
          next_action_date: editLead.nextActionDate,
          assigned_to: editLead.assignedTo ? parseInt(editLead.assignedTo) : null
        })
      });

      await loadLeads(); // Refresh data
      setShowEditLead(false);
      setSelectedLead(null);
      toast.success('Lead updated successfully');
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead. Please try again.');
    }
  };

  const openEditDialog = (lead: Lead) => {
    setSelectedLead(lead);
    setEditLead({
      company: lead.company,
      contact: lead.contact,
      email: lead.email,
      phone: lead.phone || "",
      type: lead.type,
      source: lead.source || "website",
      notes: lead.notes || "",
      assignedTo: lead.assignedTo?.toString() || "",
      value: lead.value,
      probability: lead.probability,
      nextAction: lead.nextAction || "",
      nextActionDate: lead.nextActionDate || "",
      stage: lead.stage
    });
    setShowEditLead(true);
  };

  const getTypeInfo = (type: string) => {
    switch(type) {
      case "standard": return { label: "$5K Standard", color: "default" };
      case "ai-enhanced": return { label: "$7.5K AI", color: "secondary" };
      case "enterprise": return { label: "$10K Enterprise", color: "destructive" };
      default: return { label: "Unknown", color: "outline" };
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

        <Sheet open={showAddLead} onOpenChange={setShowAddLead}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]" onInteractOutside={(e) => e.preventDefault()}>
            <SheetHeader>
              <SheetTitle>Add New Lead</SheetTitle>
              <SheetDescription>Enter the details for your new sales lead</SheetDescription>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Company Name</Label>
                  <Input 
                    placeholder="Acme Corp" 
                    value={newLead.company}
                    onChange={(e) => setNewLead({...newLead, company: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Contact Name</Label>
                  <Input 
                    placeholder="John Doe" 
                    value={newLead.contact}
                    onChange={(e) => setNewLead({...newLead, contact: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
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
                    <SelectItem value="unassigned">Unassigned</SelectItem>
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
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddLead(false)}>Cancel</Button>
                <Button onClick={addLead}>Add Lead</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Pipeline Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        {stages.map(stage => {
          const stageLeads = getStageLeads(stage.name);
          const stageValue = calculatePipelineValue(stage.name);
          
          return (
            <div key={stage.name} className="space-y-3">
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
                    <Card key={lead.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{lead.company}</p>
                            <p className="text-xs text-muted-foreground">{lead.contact}</p>
                            {lead.assignedToName && (
                              <p className="text-xs text-blue-600">
                                Assigned to: {lead.assignedToName}
                              </p>
                            )}
                          </div>
                          <Badge variant={typeInfo.color as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
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
                            Action needed {daysUntilAction === 0 ? "today" : `in ${daysUntilAction} day${daysUntilAction > 1 ? 's' : ''}`}
                          </div>
                        )}
                        
                        <div className="flex gap-1 pt-1">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => window.open(`tel:${lead.phone}`)}>
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => window.open(`mailto:${lead.email}`)}>
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                            <Calendar className="h-3 w-3" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 ml-auto">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Move to Stage</DropdownMenuLabel>
                              {stages.map(s => (
                                <DropdownMenuItem 
                                  key={s.name} 
                                  onClick={() => moveToStage(lead.id, s.name as Lead["stage"])}
                                  disabled={s.name === stage.name}
                                >
                                  {s.label}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => openEditDialog(lead)}
                              >
                                <Edit className="h-3 w-3 mr-2" />
                                Edit Lead
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteLead(lead.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-3 w-3 mr-2" />
                                Delete Lead
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
                  <p className="text-xs text-muted-foreground">No deals in this stage</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upcoming Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Actions</CardTitle>
          <CardDescription>Tasks that need your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leads
              .filter(lead => !["closed-won", "closed-lost"].includes(lead.stage))
              .sort((a, b) => new Date(a.nextActionDate).getTime() - new Date(b.nextActionDate).getTime())
              .slice(0, 5)
              .map(lead => (
                <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{lead.nextAction}</p>
                    <p className="text-xs text-muted-foreground">{lead.company} - {lead.contact}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{new Date(lead.nextActionDate).toLocaleDateString()}</p>
                    <Badge variant="outline" className="text-xs mt-1">{lead.stage}</Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Lead Sheet */}
      <Sheet open={showEditLead} onOpenChange={setShowEditLead}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]" onInteractOutside={(e) => e.preventDefault()}>
          <SheetHeader>
            <SheetTitle>Edit Lead</SheetTitle>
            <SheetDescription>Update lead information</SheetDescription>
          </SheetHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-company">Company *</Label>
              <Input 
                id="edit-company"
                value={editLead.company} 
                onChange={(e) => setEditLead({...editLead, company: e.target.value})}
                placeholder="Company name"
              />
            </div>
            <div>
              <Label htmlFor="edit-contact">Contact Person *</Label>
              <Input 
                id="edit-contact"
                value={editLead.contact} 
                onChange={(e) => setEditLead({...editLead, contact: e.target.value})}
                placeholder="John Doe"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-email">Email *</Label>
                <Input 
                  id="edit-email"
                  type="email"
                  value={editLead.email} 
                  onChange={(e) => setEditLead({...editLead, email: e.target.value})}
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input 
                  id="edit-phone"
                  value={editLead.phone} 
                  onChange={(e) => setEditLead({...editLead, phone: e.target.value})}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-type">Deal Type</Label>
                <Select value={editLead.type} onValueChange={(value) => {
                  setEditLead({
                    ...editLead, 
                    type: value as Lead["type"],
                    value: value === "standard" ? 5000 : value === "ai-enhanced" ? 7500 : 10000
                  });
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard ($5,000)</SelectItem>
                    <SelectItem value="ai-enhanced">AI-Enhanced ($7,500)</SelectItem>
                    <SelectItem value="enterprise">Enterprise ($10,000)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-stage">Stage</Label>
                <Select value={editLead.stage} onValueChange={(value) => setEditLead({...editLead, stage: value as Lead["stage"]})}>
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-value">Deal Value</Label>
                <Input 
                  id="edit-value"
                  type="number"
                  value={editLead.value} 
                  onChange={(e) => setEditLead({...editLead, value: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="edit-probability">Probability (%)</Label>
                <Input 
                  id="edit-probability"
                  type="number"
                  min="0"
                  max="100"
                  value={editLead.probability} 
                  onChange={(e) => setEditLead({...editLead, probability: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-nextAction">Next Action</Label>
                <Input 
                  id="edit-nextAction"
                  value={editLead.nextAction} 
                  onChange={(e) => setEditLead({...editLead, nextAction: e.target.value})}
                  placeholder="Follow up call"
                />
              </div>
              <div>
                <Label htmlFor="edit-nextActionDate">Action Date</Label>
                <Input 
                  id="edit-nextActionDate"
                  type="date"
                  value={editLead.nextActionDate} 
                  onChange={(e) => setEditLead({...editLead, nextActionDate: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-assignTo">Assign To</Label>
              <Select value={editLead.assignedTo} onValueChange={(value) => setEditLead({...editLead, assignedTo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea 
                id="edit-notes"
                value={editLead.notes} 
                onChange={(e) => setEditLead({...editLead, notes: e.target.value})}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowEditLead(false);
                setSelectedLead(null);
              }}>Cancel</Button>
              <Button onClick={updateLead}>Update Lead</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SalesPipeline;