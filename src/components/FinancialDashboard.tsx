import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { API_ENDPOINTS, apiCall } from "@/utils/api";
import { toast } from "sonner";
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  CreditCard,
  Calendar,
  Download,
  Eye,
  Mail,
  Plus,
  Trash2,
  Edit,
  Filter
} from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  projectName: string;
  projectId?: number;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  description: string;
  dueDate: string;
  issueDate: string;
  paidDate?: string;
  notes: string;
  createdDate: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  subcategory: string;
  vendor: string;
  projectName?: string;
  projectId?: number;
  expenseDate: string;
  receipt: string;
  notes: string;
  status: "pending" | "approved" | "paid" | "rejected";
  recurring: boolean;
  recurringFrequency?: string;
  createdBy: number;
  createdByName: string;
  createdDate: string;
  taxDeductible: boolean;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface Project {
  id: string;
  projectName: string;
  clientName: string;
}

const FinancialDashboard = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  
  const [newInvoice, setNewInvoice] = useState({
    clientName: "",
    clientCompany: "",
    clientEmail: "",
    projectName: "",
    projectId: "",
    amount: 0,
    taxAmount: 0,
    description: "",
    dueDate: "",
    notes: ""
  });

  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: 0,
    category: "software",
    subcategory: "",
    vendor: "",
    projectId: "",
    expenseDate: "",
    notes: "",
    recurring: false,
    recurringFrequency: "",
    taxDeductible: false
  });

  useEffect(() => {
    // Get current user
    const authUser = localStorage.getItem("commandCenterUser");
    setCurrentUser(authUser);

    // Load all data
    loadInvoices();
    loadExpenses();
    loadUsers();
    loadProjects();
    
    // Refresh data every 30 seconds for real-time collaboration
    const interval = setInterval(() => {
      loadInvoices();
      loadExpenses();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await apiCall(API_ENDPOINTS.invoices);
      setInvoices(data.invoices || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadExpenses = async () => {
    try {
      const data = await apiCall(API_ENDPOINTS.expenses);
      setExpenses(data.expenses || []);
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await apiCall(API_ENDPOINTS.users);
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await apiCall(API_ENDPOINTS.projects);
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const getCurrentUserId = () => {
    const user = users.find(u => u.email === currentUser);
    return user?.id || null;
  };

  const addInvoice = async () => {
    if (!newInvoice.clientName || !newInvoice.amount) {
      alert("Please fill in client name and amount");
      return;
    }

    try {
      await apiCall(API_ENDPOINTS.invoices, {
        method: 'POST',
        body: JSON.stringify({
          ...newInvoice,
          project_id: newInvoice.projectId && newInvoice.projectId !== 'none' ? parseInt(newInvoice.projectId) : null,
          client_id: 1 // TODO: Get from leads/clients
        })
      });

      await loadInvoices();
      setNewInvoice({
        clientName: "",
        clientCompany: "",
        clientEmail: "",
        projectName: "",
        projectId: "",
        amount: 0,
        taxAmount: 0,
        description: "",
        dueDate: "",
        notes: ""
      });
      setShowInvoiceDialog(false);
      toast.success('Invoice created successfully');
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice. Please try again.');
    }
  };

  const addExpense = async () => {
    if (!newExpense.description || !newExpense.amount) {
      alert("Please fill in description and amount");
      return;
    }

    try {
      await apiCall(API_ENDPOINTS.expenses, {
        method: 'POST',
        body: JSON.stringify({
          ...newExpense,
          project_id: newExpense.projectId && newExpense.projectId !== 'none' ? parseInt(newExpense.projectId) : null,
          created_by: getCurrentUserId()
        })
      });

      await loadExpenses();
      setNewExpense({
        description: "",
        amount: 0,
        category: "software",
        subcategory: "",
        vendor: "",
        projectId: "",
        expenseDate: "",
        notes: "",
        recurring: false,
        recurringFrequency: "",
        taxDeductible: false
      });
      setShowExpenseDialog(false);
      toast.success('Expense created successfully');
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error('Failed to create expense. Please try again.');
    }
  };

  const updateInvoiceStatus = async (invoiceId: string, status: string) => {
    try {
      await apiCall(API_ENDPOINTS.invoices, {
        method: 'PUT',
        body: JSON.stringify({ 
          id: invoiceId,
          status,
          paid_date: status === 'paid' ? new Date().toISOString().split('T')[0] : null
        })
      });

      await loadInvoices();
      toast.success('Invoice status updated');
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast.error('Failed to update invoice status');
    }
  };

  const updateExpenseStatus = async (expenseId: string, status: string) => {
    try {
      await apiCall(API_ENDPOINTS.expenses, {
        method: 'PUT',
        body: JSON.stringify({ 
          id: expenseId,
          status 
        })
      });

      await loadExpenses();
      toast.success('Expense status updated');
    } catch (error) {
      console.error('Error updating expense status:', error);
      toast.error('Failed to update expense status');
    }
  };

  const deleteInvoice = async (invoiceId: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    try {
      await apiCall(`${API_ENDPOINTS.invoices}?id=${invoiceId}`, {
        method: 'DELETE'
      });

      await loadInvoices();
      toast.success('Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
    }
  };

  const deleteExpense = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      await apiCall(`${API_ENDPOINTS.expenses}?id=${expenseId}`, {
        method: 'DELETE'
      });

      await loadExpenses();
      toast.success('Expense deleted successfully');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  // Calculate financial metrics from real data
  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const pendingInvoices = invoices
    .filter(inv => ['sent', 'overdue'].includes(inv.status))
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const totalExpenses = expenses
    .filter(exp => exp.status === 'approved' || exp.status === 'paid')
    .reduce((sum, exp) => sum + exp.amount, 0);

  const netProfit = totalRevenue - totalExpenses;

  const overdueInvoices = invoices.filter(inv => {
    if (inv.status !== 'sent') return false;
    const dueDate = new Date(inv.dueDate);
    const today = new Date();
    return dueDate < today;
  }).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': case 'approved': return 'bg-green-500';
      case 'sent': case 'pending': return 'bg-blue-500';
      case 'overdue': case 'rejected': return 'bg-red-500';
      case 'draft': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': case 'approved': return 'default';
      case 'sent': case 'pending': return 'secondary';
      case 'overdue': case 'rejected': return 'destructive';
      case 'draft': case 'cancelled': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">
              {invoices.filter(i => i.status === 'paid').length} paid invoices
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${pendingInvoices.toLocaleString()}</div>
            <p className="text-xs text-blue-600 mt-1">
              {invoices.filter(i => ['sent', 'overdue'].includes(i.status)).length} outstanding invoices
            </p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-orange-600 mt-1">
              {expenses.filter(e => ['approved', 'paid'].includes(e.status)).length} expenses
            </p>
          </CardContent>
        </Card>

        <Card className={`${netProfit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netProfit.toLocaleString()}
            </div>
            <p className={`text-xs mt-1 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {overdueInvoices > 0 && `${overdueInvoices} overdue`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Invoices</h3>
            <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                  <DialogDescription>Create an invoice for a client project</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Client Name</Label>
                      <Input 
                        placeholder="John Doe" 
                        value={newInvoice.clientName}
                        onChange={(e) => setNewInvoice({...newInvoice, clientName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input 
                        placeholder="Acme Corp" 
                        value={newInvoice.clientCompany}
                        onChange={(e) => setNewInvoice({...newInvoice, clientCompany: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input 
                      type="email"
                      placeholder="john@acme.com" 
                      value={newInvoice.clientEmail}
                      onChange={(e) => setNewInvoice({...newInvoice, clientEmail: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Project</Label>
                    <Select value={newInvoice.projectId} onValueChange={(value) => {
                      const project = projects.find(p => p.id === value);
                      setNewInvoice({
                        ...newInvoice, 
                        projectId: value,
                        projectName: project?.projectName || ''
                      });
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No project</SelectItem>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.projectName} - {project.clientName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Amount</Label>
                      <Input 
                        type="number" 
                        placeholder="5000" 
                        value={newInvoice.amount}
                        onChange={(e) => setNewInvoice({...newInvoice, amount: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label>Tax Amount</Label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        value={newInvoice.taxAmount}
                        onChange={(e) => setNewInvoice({...newInvoice, taxAmount: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input 
                      type="date" 
                      value={newInvoice.dueDate}
                      onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea 
                      placeholder="Invoice description..." 
                      value={newInvoice.description}
                      onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowInvoiceDialog(false)}>Cancel</Button>
                    <Button onClick={addInvoice}>Create Invoice</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Invoices List */}
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{invoice.invoiceNumber}</h4>
                        <Badge variant={getStatusBadgeVariant(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {invoice.clientName} - {invoice.clientCompany}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.projectName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${invoice.totalAmount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${invoice.clientEmail}`)}>
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Select value={invoice.status} onValueChange={(value) => updateInvoiceStatus(invoice.id, value)}>
                        <SelectTrigger className="w-[100px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => deleteInvoice(invoice.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {invoices.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No invoices found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Expenses</h3>
            <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>Record a business expense</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Description</Label>
                    <Input 
                      placeholder="Office supplies" 
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Amount</Label>
                      <Input 
                        type="number" 
                        placeholder="100" 
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select value={newExpense.category} onValueChange={(value) => setNewExpense({...newExpense, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="software">Software</SelectItem>
                          <SelectItem value="hardware">Hardware</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="office">Office</SelectItem>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Vendor</Label>
                    <Input 
                      placeholder="Microsoft" 
                      value={newExpense.vendor}
                      onChange={(e) => setNewExpense({...newExpense, vendor: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Project (Optional)</Label>
                    <Select value={newExpense.projectId} onValueChange={(value) => setNewExpense({...newExpense, projectId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No project</SelectItem>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.projectName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input 
                      type="date" 
                      value={newExpense.expenseDate}
                      onChange={(e) => setNewExpense({...newExpense, expenseDate: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="taxDeductible"
                      checked={newExpense.taxDeductible}
                      onChange={(e) => setNewExpense({...newExpense, taxDeductible: e.target.checked})}
                    />
                    <Label htmlFor="taxDeductible">Tax deductible</Label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowExpenseDialog(false)}>Cancel</Button>
                    <Button onClick={addExpense}>Add Expense</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Expenses List */}
          <div className="space-y-3">
            {expenses.map((expense) => (
              <Card key={expense.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{expense.description}</h4>
                        <Badge variant={getStatusBadgeVariant(expense.status)}>
                          {expense.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {expense.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {expense.vendor} • {new Date(expense.expenseDate).toLocaleDateString()}
                      </p>
                      {expense.projectName && (
                        <p className="text-sm text-muted-foreground">
                          Project: {expense.projectName}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${expense.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">by {expense.createdByName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={expense.status} onValueChange={(value) => updateExpenseStatus(expense.id, value)}>
                        <SelectTrigger className="w-[100px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => deleteExpense(expense.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {expenses.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No expenses found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Revenue:</span>
                    <span className="font-bold text-green-600">${totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Expenses:</span>
                    <span className="font-bold text-red-600">${totalExpenses.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Net Profit:</span>
                      <span className={`font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${netProfit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Invoices:</span>
                    <span className="font-bold">{invoices.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paid Invoices:</span>
                    <span className="font-bold text-green-600">{invoices.filter(i => i.status === 'paid').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overdue Invoices:</span>
                    <span className="font-bold text-red-600">{overdueInvoices}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Expenses:</span>
                    <span className="font-bold">{expenses.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialDashboard;