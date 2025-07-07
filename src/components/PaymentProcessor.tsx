import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { API_ENDPOINTS, apiCall } from "@/utils/api";
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Send,
  Plus,
  Search,
  Filter,
  Receipt,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Building,
  User,
  FileText,
  Link,
  Loader2,
  Trash2
} from "lucide-react";
import { format } from "date-fns";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded' | 'partially_refunded';
  payment_method: string;
  customer_name: string;
  customer_email: string;
  project_id?: string;
  project_name?: string;
  invoice_id?: string;
  invoice_number?: string;
  description?: string;
  metadata?: Record<string, any>;
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  created_at: string;
  updated_at: string;
  paid_at?: string;
  refunded_at?: string;
  refund_amount?: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_address?: string;
  project_id?: string;
  project_name?: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'canceled';
  due_date: string;
  items: InvoiceItem[];
  notes?: string;
  terms?: string;
  created_at: string;
  updated_at: string;
  sent_at?: string;
  paid_at?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string;
  exp_month?: number;
  exp_year?: number;
  customer_id: string;
  is_default: boolean;
}

const PaymentProcessor = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    customer_email: "",
    customer_name: "",
    description: "",
    project_id: "",
    save_payment_method: false
  });

  const [invoiceForm, setInvoiceForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_address: "",
    project_name: "",
    due_date: "",
    items: [{ description: "", quantity: 1, unit_price: 0, amount: 0 }],
    notes: "",
    terms: "Payment due within 30 days"
  });

  useEffect(() => {
    loadPayments();
    loadInvoices();
  }, []);

  const loadPayments = async () => {
    try {
      // Using mock data - API endpoint not implemented yet
      // const data = await apiCall(API_ENDPOINTS.payments);
      // setPayments(data.payments || []);
    } catch (error) {
      console.error('Error loading payments:', error);
    }
    // Mock data for demo
    setPayments([
        {
          id: "1",
          amount: 7500,
          currency: "usd",
          status: "succeeded",
          payment_method: "card",
          customer_name: "Sarah Chen",
          customer_email: "sarah@techvision.com",
          project_name: "E-Commerce Platform",
          description: "Payment for AI-enhanced web application",
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          paid_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "2",
          amount: 5000,
          currency: "usd",
          status: "pending",
          payment_method: "invoice",
          customer_name: "Mike Johnson",
          customer_email: "mike@globalretail.com",
          project_name: "Inventory System",
          description: "Initial payment for project",
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
    }
    setLoading(false);
  };

  const loadInvoices = async () => {
    try {
      // Using mock data - API endpoint not implemented yet
      // const data = await apiCall(API_ENDPOINTS.invoices);
      // setInvoices(data.invoices || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
    }
  };

  const processPayment = async () => {
    if (!paymentForm.amount || !paymentForm.customer_email) {
      toast.error("Please fill in required fields");
      return;
    }

    setProcessingPayment(true);
    try {
      // In a real app, this would create a Stripe payment intent
      const response = await apiCall(API_ENDPOINTS.createPayment, {
        method: 'POST',
        body: JSON.stringify({
          amount: Math.round(parseFloat(paymentForm.amount) * 100), // Convert to cents
          currency: 'usd',
          customer_email: paymentForm.customer_email,
          customer_name: paymentForm.customer_name,
          description: paymentForm.description,
          project_id: paymentForm.project_id,
          save_payment_method: paymentForm.save_payment_method
        })
      });

      if (response.success) {
        toast.success('Payment processed successfully!');
        setShowPaymentDialog(false);
        setPaymentForm({
          amount: "",
          customer_email: "",
          customer_name: "",
          description: "",
          project_id: "",
          save_payment_method: false
        });
        loadPayments();
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  const createInvoice = async () => {
    if (!invoiceForm.customer_name || !invoiceForm.customer_email || invoiceForm.items.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const totalAmount = invoiceForm.items.reduce((sum, item) => sum + item.amount, 0);
      const taxAmount = totalAmount * 0.1; // 10% tax

      await apiCall(API_ENDPOINTS.invoices, {
        method: 'POST',
        body: JSON.stringify({
          ...invoiceForm,
          amount: totalAmount,
          tax_amount: taxAmount,
          total_amount: totalAmount + taxAmount,
          currency: 'usd',
          status: 'draft',
          invoice_number: `INV-${Date.now()}`
        })
      });

      toast.success('Invoice created successfully!');
      setShowInvoiceDialog(false);
      setInvoiceForm({
        customer_name: "",
        customer_email: "",
        customer_address: "",
        project_name: "",
        due_date: "",
        items: [{ description: "", quantity: 1, unit_price: 0, amount: 0 }],
        notes: "",
        terms: "Payment due within 30 days"
      });
      loadInvoices();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    }
  };

  const addInvoiceItem = () => {
    setInvoiceForm({
      ...invoiceForm,
      items: [...invoiceForm.items, { description: "", quantity: 1, unit_price: 0, amount: 0 }]
    });
  };

  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...invoiceForm.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate amount
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].amount = newItems[index].quantity * newItems[index].unit_price;
    }
    
    setInvoiceForm({ ...invoiceForm, items: newItems });
  };

  const removeInvoiceItem = (index: number) => {
    setInvoiceForm({
      ...invoiceForm,
      items: invoiceForm.items.filter((_, i) => i !== index)
    });
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'succeeded': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'refunded': return <ArrowDownRight className="h-4 w-4 text-purple-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: Payment['status']) => {
    const colors = {
      'pending': 'secondary',
      'processing': 'default',
      'succeeded': 'default',
      'failed': 'destructive',
      'refunded': 'secondary',
      'partially_refunded': 'secondary'
    };
    return <Badge variant={colors[status] as any}>{status}</Badge>;
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (payment.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesFilter = filterStatus === "all" || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const paymentStats = {
    total_revenue: payments.filter(p => p.status === 'succeeded').reduce((sum, p) => sum + p.amount, 0),
    pending_amount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    total_transactions: payments.length,
    successful_transactions: payments.filter(p => p.status === 'succeeded').length,
    failed_transactions: payments.filter(p => p.status === 'failed').length,
    refunded_amount: payments.filter(p => p.status === 'refunded' || p.status === 'partially_refunded')
      .reduce((sum, p) => sum + (p.refund_amount || p.amount), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl">${(paymentStats.total_revenue / 100).toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-2xl">${(paymentStats.pending_amount / 100).toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Transactions</CardDescription>
            <CardTitle className="text-2xl">{paymentStats.total_transactions}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Successful</CardDescription>
            <CardTitle className="text-2xl text-green-600">{paymentStats.successful_transactions}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Failed</CardDescription>
            <CardTitle className="text-2xl text-red-600">{paymentStats.failed_transactions}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Refunded</CardDescription>
            <CardTitle className="text-2xl">${(paymentStats.refunded_amount / 100).toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="payments">
        <TabsList>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payment Transactions</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={loadPayments}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Collect Payment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Collect Payment</DialogTitle>
                        <DialogDescription>
                          Process a one-time payment from a customer
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="customer_name">Customer Name *</Label>
                            <Input
                              id="customer_name"
                              value={paymentForm.customer_name}
                              onChange={(e) => setPaymentForm({...paymentForm, customer_name: e.target.value})}
                              placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <Label htmlFor="customer_email">Customer Email *</Label>
                            <Input
                              id="customer_email"
                              type="email"
                              value={paymentForm.customer_email}
                              onChange={(e) => setPaymentForm({...paymentForm, customer_email: e.target.value})}
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="amount">Amount (USD) *</Label>
                          <Input
                            id="amount"
                            type="number"
                            value={paymentForm.amount}
                            onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                            placeholder="5000.00"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            value={paymentForm.description}
                            onChange={(e) => setPaymentForm({...paymentForm, description: e.target.value})}
                            placeholder="Payment for web application development"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="save_payment"
                            checked={paymentForm.save_payment_method}
                            onChange={(e) => setPaymentForm({...paymentForm, save_payment_method: e.target.checked})}
                          />
                          <Label htmlFor="save_payment">Save payment method for future use</Label>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={processPayment} disabled={processingPayment}>
                            {processingPayment ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CreditCard className="h-4 w-4 mr-2" />
                                Process Payment
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="succeeded">Succeeded</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                {filteredPayments.map(payment => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(payment.status)}
                      <div>
                        <div className="font-medium">{payment.customer_name}</div>
                        <div className="text-sm text-gray-600">{payment.customer_email}</div>
                        <div className="text-xs text-gray-400">
                          {format(new Date(payment.created_at), 'MMM d, yyyy h:mm a')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">${(payment.amount / 100).toFixed(2)}</div>
                        {payment.project_name && (
                          <div className="text-sm text-gray-600">{payment.project_name}</div>
                        )}
                      </div>
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Invoices</CardTitle>
                <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Invoice
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create Invoice</DialogTitle>
                      <DialogDescription>
                        Generate a new invoice for your customer
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Customer Name *</Label>
                          <Input
                            value={invoiceForm.customer_name}
                            onChange={(e) => setInvoiceForm({...invoiceForm, customer_name: e.target.value})}
                            placeholder="Customer name"
                          />
                        </div>
                        <div>
                          <Label>Customer Email *</Label>
                          <Input
                            type="email"
                            value={invoiceForm.customer_email}
                            onChange={(e) => setInvoiceForm({...invoiceForm, customer_email: e.target.value})}
                            placeholder="customer@example.com"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Customer Address</Label>
                        <Input
                          value={invoiceForm.customer_address}
                          onChange={(e) => setInvoiceForm({...invoiceForm, customer_address: e.target.value})}
                          placeholder="123 Main St, City, State ZIP"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Project Name</Label>
                          <Input
                            value={invoiceForm.project_name}
                            onChange={(e) => setInvoiceForm({...invoiceForm, project_name: e.target.value})}
                            placeholder="Project name"
                          />
                        </div>
                        <div>
                          <Label>Due Date</Label>
                          <Input
                            type="date"
                            value={invoiceForm.due_date}
                            onChange={(e) => setInvoiceForm({...invoiceForm, due_date: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Invoice Items</Label>
                        <div className="space-y-2 mt-2">
                          {invoiceForm.items.map((item, index) => (
                            <div key={index} className="flex gap-2 items-end">
                              <div className="flex-1">
                                <Input
                                  placeholder="Description"
                                  value={item.description}
                                  onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                                />
                              </div>
                              <div className="w-20">
                                <Input
                                  type="number"
                                  placeholder="Qty"
                                  value={item.quantity}
                                  onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                />
                              </div>
                              <div className="w-32">
                                <Input
                                  type="number"
                                  placeholder="Price"
                                  value={item.unit_price}
                                  onChange={(e) => updateInvoiceItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                  step="0.01"
                                />
                              </div>
                              <div className="w-32">
                                <Input
                                  type="number"
                                  value={item.amount}
                                  disabled
                                  placeholder="Amount"
                                />
                              </div>
                              {invoiceForm.items.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeInvoiceItem(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={addInvoiceItem}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                      
                      <div>
                        <Label>Notes</Label>
                        <Input
                          value={invoiceForm.notes}
                          onChange={(e) => setInvoiceForm({...invoiceForm, notes: e.target.value})}
                          placeholder="Additional notes"
                        />
                      </div>
                      
                      <div>
                        <Label>Payment Terms</Label>
                        <Input
                          value={invoiceForm.terms}
                          onChange={(e) => setInvoiceForm({...invoiceForm, terms: e.target.value})}
                        />
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>${invoiceForm.items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tax (10%):</span>
                          <span>${(invoiceForm.items.reduce((sum, item) => sum + item.amount, 0) * 0.1).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>${(invoiceForm.items.reduce((sum, item) => sum + item.amount, 0) * 1.1).toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowInvoiceDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={createInvoice}>
                          Create Invoice
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No invoices yet</p>
                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={() => setShowInvoiceDialog(true)}
                  >
                    Create Your First Invoice
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {invoices.map(invoice => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <div className="font-medium">{invoice.invoice_number}</div>
                        <div className="text-sm text-gray-600">{invoice.customer_name}</div>
                        <div className="text-xs text-gray-400">
                          Due: {format(new Date(invoice.due_date), 'MMM d, yyyy')}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold">${invoice.total_amount.toFixed(2)}</div>
                        </div>
                        <Badge variant={invoice.status === 'paid' ? 'default' : 
                                       invoice.status === 'overdue' ? 'destructive' : 'secondary'}>
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Payment Customers</CardTitle>
              <CardDescription>
                Manage customer payment methods and subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Customer payment profiles coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PaymentProcessor;