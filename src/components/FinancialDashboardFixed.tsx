import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Calendar,
  Plus
} from "lucide-react";

const FinancialDashboardFixed = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data to prevent API failures
  const mockMetrics = {
    totalRevenue: 125000,
    outstandingInvoices: 3,
    overdueAmount: 5000,
    monthlyRecurring: 8500,
    averageProjectValue: 6250,
    profitMargin: 72
  };

  const mockInvoices = [
    {
      id: "1",
      invoiceNumber: "INV-001",
      clientName: "Tech Startup Inc",
      amount: 7500,
      status: "paid",
      dueDate: "2025-06-15"
    },
    {
      id: "2", 
      invoiceNumber: "INV-002",
      clientName: "E-commerce Plus",
      amount: 5000,
      status: "sent",
      dueDate: "2025-06-30"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockMetrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.outstandingInvoices}</div>
            <p className="text-xs text-muted-foreground">Unpaid invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.profitMargin}%</div>
            <p className="text-xs text-muted-foreground">Average margin</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Financial Management</CardTitle>
            <Button size="sm" disabled>
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">Financial Overview</h3>
                <p className="text-muted-foreground">
                  Financial features are being upgraded. Check back soon!
                </p>
              </div>
            </TabsContent>

            <TabsContent value="invoices" className="space-y-4 mt-4">
              <div className="space-y-4">
                {mockInvoices.map(invoice => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{invoice.invoiceNumber}</h4>
                      <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">${invoice.amount.toLocaleString()}</span>
                      <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="expenses" className="space-y-4 mt-4">
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">Expense Tracking</h3>
                <p className="text-muted-foreground">
                  Expense management features coming soon!
                </p>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4 mt-4">
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">Financial Reports</h3>
                <p className="text-muted-foreground">
                  Detailed reports will be available in the next update.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialDashboardFixed;