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
import { supabase } from "@/lib/supabase";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { saveFormData, loadFormData, clearFormData, handleSupabaseError } from "@/utils/supabaseSessionFix";

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  status: "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
  source: string;
  notes: string;
  created_at: string;
  updated_at: string;
  assigned_to: string | null;
  assigned_user?: {
    name: string;
    email: string;
  };
}

const stageConfig = {
  new: { label: "New Lead", color: "bg-gray-500", icon: Users },
  contacted: { label: "Contacted", color: "bg-blue-500", icon: Phone },
  qualified: { label: "Qualified", color: "bg-indigo-500", icon: Target },
  proposal: { label: "Proposal", color: "bg-purple-500", icon: FileText },
  won: { label: "Won", color: "bg-green-500", icon: CheckCircle },
  lost: { label: "Lost", color: "bg-red-500", icon: AlertCircle }
};

const SalesPipelineSupabase = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showEditLead, setShowEditLead] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const { user, profile } = useSupabaseAuth();

  useEffect(() => {
    loadLeads();
    
    // Subscribe to real-time changes
    const subscription = supabase
      .channel('leads-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        loadLeads();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadLeads = async () => {
    setApiError(null);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          assigned_user:profiles!assigned_to(name, email)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      console.error('Error loading leads:', error);
      setApiError('Failed to load leads. Please check your connection or try again.');
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const saveLead = async (leadData: Partial<Lead>) => {
    setApiError(null);
    if (!user) {
      setApiError('You must be logged in to save a lead.');
      toast.error('You must be logged in to save a lead.');
      return;
    }
    try {
      if (selectedLead) {
        // Update existing lead
        const { error } = await supabase
          .from('leads')
          .update({
            ...leadData,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedLead.id);
        if (error) throw error;
        toast.success('Lead updated successfully');
      } else {
        // Create new lead
        const { error } = await supabase
          .from('leads')
          .insert({
            ...leadData,
            assigned_to: user?.id || null
          });
        if (error) throw error;
        toast.success('Lead created successfully');
      }
      setShowEditLead(false);
      setSelectedLead(null);
    } catch (error: any) {
      console.error('Error saving lead:', error);
      setApiError('Failed to save lead. Please check your connection or try again.');
      toast.error('Failed to save lead');
    }
  };

  const deleteLead = async (id: string) => {
    setApiError(null);
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Lead deleted successfully');
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      setApiError('Failed to delete lead. Please check your connection or try again.');
      toast.error('Failed to delete lead');
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: Lead['status']) => {
    setApiError(null);
    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);
      if (error) throw error;
      toast.success('Lead status updated');
    } catch (error: any) {
      console.error('Error updating lead status:', error);
      setApiError('Failed to update lead status. Please check your connection or try again.');
      toast.error('Failed to update lead status');
    }
  };

  const getStageLeads = (status: Lead['status']) => {
    return leads.filter(lead => lead.status === status);
  };

  const getTotalValue = (status: Lead['status']) => {
    return getStageLeads(status).reduce((sum, lead) => sum + (lead.value || 0), 0);
  };

  const getTotalPipelineValue = () => {
    return leads
      .filter(lead => lead.status !== 'lost')
      .reduce((sum, lead) => sum + (lead.value || 0), 0);
  };

  const getConversionRate = () => {
    const totalLeads = leads.length;
    const wonLeads = leads.filter(lead => lead.status === 'won').length;
    return totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }
  if (apiError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-700 dark:text-red-300">
        <div className="mb-4 font-bold">{apiError}</div>
        <Button onClick={loadLeads}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalPipelineValue().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across {leads.filter(l => l.status !== 'lost').length} active deals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalValue('won').toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{getStageLeads('won').length} deals closed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getConversionRate()}%</div>
            <Progress value={getConversionRate()} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.filter(l => l.status !== 'won' && l.status !== 'lost').length}</div>
            <Sheet open={showEditLead} onOpenChange={setShowEditLead}>
              <SheetTrigger asChild>
                <Button 
                  size="sm" 
                  className="mt-2 w-full"
                  onClick={() => setSelectedLead(null)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lead
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>{selectedLead ? 'Edit Lead' : 'Add New Lead'}</SheetTitle>
                  <SheetDescription>
                    {selectedLead ? 'Update lead information' : 'Enter lead details to add to pipeline'}
                  </SheetDescription>
                </SheetHeader>
                <LeadForm 
                  lead={selectedLead} 
                  onSave={saveLead}
                  onCancel={() => {
                    setShowEditLead(false);
                    setSelectedLead(null);
                  }}
                />
              </SheetContent>
            </Sheet>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        {(Object.keys(stageConfig) as Array<keyof typeof stageConfig>).map((stage) => {
          const config = stageConfig[stage];
          const stageLeads = getStageLeads(stage);
          const Icon = config.icon;

          return (
            <Card key={stage} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <CardTitle className="text-sm font-medium">
                      {config.label}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary">{stageLeads.length}</Badge>
                </div>
                <CardDescription className="text-xs">
                  ${getTotalValue(stage).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {stageLeads.map((lead) => (
                  <LeadCard 
                    key={lead.id} 
                    lead={lead} 
                    onEdit={() => {
                      setSelectedLead(lead);
                      setShowEditLead(true);
                    }}
                    onDelete={() => deleteLead(lead.id)}
                    onStatusChange={(newStatus) => updateLeadStatus(lead.id, newStatus)}
                  />
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// Lead Card Component
const LeadCard = ({ 
  lead, 
  onEdit, 
  onDelete,
  onStatusChange 
}: { 
  lead: Lead;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: Lead['status']) => void;
}) => {
  return (
    <Card className="p-3 cursor-pointer hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-medium text-sm truncate">{lead.name}</p>
            <p className="text-xs text-muted-foreground truncate">{lead.company}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Move to</DropdownMenuLabel>
              {(Object.keys(stageConfig) as Array<keyof typeof stageConfig>).map((stage) => (
                <DropdownMenuItem 
                  key={stage}
                  onClick={() => onStatusChange(stage)}
                  disabled={lead.status === stage}
                >
                  <MoveRight className="mr-2 h-4 w-4" />
                  {stageConfig[stage].label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">${lead.value?.toLocaleString() || 0}</span>
          {lead.assigned_user && (
            <span className="text-muted-foreground">{lead.assigned_user.name}</span>
          )}
        </div>
      </div>
    </Card>
  );
};

// Lead Form Component
const LeadForm = ({ 
  lead, 
  onSave, 
  onCancel 
}: { 
  lead: Lead | null;
  onSave: (data: Partial<Lead>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: lead?.name || '',
    company: lead?.company || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    value: lead?.value || 0,
    status: lead?.status || 'new',
    source: lead?.source || '',
    notes: lead?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Contact Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">Deal Value</Label>
        <Input
          id="value"
          type="number"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value as Lead['status'] })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(stageConfig) as Array<keyof typeof stageConfig>).map((stage) => (
              <SelectItem key={stage} value={stage}>
                {stageConfig[stage].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="source">Source</Label>
        <Input
          id="source"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          placeholder="e.g., Website, Referral, Cold Email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {lead ? 'Update' : 'Create'} Lead
        </Button>
      </div>
    </form>
  );
};

export default SalesPipelineSupabase;