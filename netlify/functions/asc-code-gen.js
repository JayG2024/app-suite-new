const Anthropic = require('@anthropic-ai/sdk');

// ASC.AI System Prompt
const ASC_SYSTEM_PROMPT = `You are ASC.AI, an AI coding assistant specialized in building business applications.

You understand business terminology and can generate complete, production-ready code for:
- CRM systems with pipelines, contacts, and deals
- Inventory management with SKUs, warehouses, and alerts
- Analytics dashboards with KPIs, charts, and reports
- E-commerce platforms with products, orders, and payments
- HR systems with employees, payroll, and leave management

When given commands starting with "asc", you:
1. Generate complete, working code (not snippets)
2. Include proper error handling and validation
3. Use modern React/Next.js with TypeScript
4. Add Tailwind CSS for styling
5. Include sample data for immediate demo
6. Structure code for production deployment

Always respond with JSON containing:
- code: The generated code
- explanation: Brief explanation of what was created
- files: Array of files that should be created (optional)`;

// Initialize Claude (if API key is available)
let anthropic;
if (process.env.ANTHROPIC_API_KEY) {
  anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { prompt, context: codeContext, projectType } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    // If we have Claude API configured, use it
    if (anthropic) {
      try {
        const response = await callClaude(prompt, codeContext, projectType);
        return {
          statusCode: 200,
          body: JSON.stringify(response)
        };
      } catch (claudeError) {
        console.error('Claude API error:', claudeError);
        // Fall back to simulation
      }
    }

    // Simulate ASC.AI response for internal testing
    const simulatedResponse = simulateASCResponse(prompt, codeContext, projectType);

    return {
      statusCode: 200,
      body: JSON.stringify({
        code: simulatedResponse.code,
        explanation: simulatedResponse.explanation,
        model: 'ASC.AI Simulator'
      })
    };
  } catch (error) {
    console.error('ASC code generation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to generate code',
        details: error.message 
      })
    };
  }
};

async function callClaude(prompt, codeContext, projectType) {
  const messages = [{
    role: 'user',
    content: `Project Type: ${projectType}
Current Context: ${codeContext || 'No specific context'}

Request: ${prompt}`
  }];

  const message = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 4000,
    temperature: 0.7,
    system: ASC_SYSTEM_PROMPT,
    messages
  });

  // Parse response
  const responseText = message.content[0].text;
  
  try {
    // Try to parse as JSON first
    const jsonResponse = JSON.parse(responseText);
    return {
      code: jsonResponse.code,
      explanation: jsonResponse.explanation,
      model: 'claude-3-opus (via ASC.AI)'
    };
  } catch {
    // If not JSON, extract code from markdown blocks
    const codeMatch = responseText.match(/```(?:jsx?|tsx?|javascript|typescript)?\n([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1].trim() : responseText;
    const explanation = responseText.replace(/```[\s\S]*?```/g, '').trim();
    
    return {
      code,
      explanation,
      model: 'claude-3-opus (via ASC.AI)'
    };
  }
}

function simulateASCResponse(prompt, context, projectType = 'react') {
  const promptLower = prompt.toLowerCase();
  
  // Parse ASC commands
  if (promptLower.includes('asc create crm')) {
    return {
      code: generateCRMCode(prompt.includes('--with-analytics')),
      explanation: 'ASC.AI created a complete CRM system with customer management, sales pipeline, and activity tracking.'
    };
  }
  
  if (promptLower.includes('asc create inventory')) {
    return {
      code: generateInventoryCode(),
      explanation: 'ASC.AI created an inventory management system with product tracking, stock levels, and reorder alerts.'
    };
  }
  
  if (promptLower.includes('asc add authentication')) {
    return {
      code: generateAuthCode(),
      explanation: 'ASC.AI added a complete authentication system with login, signup, and session management.'
    };
  }
  
  if (promptLower.includes('asc add payment')) {
    return {
      code: generatePaymentCode(promptLower.includes('stripe') ? 'stripe' : 'paypal'),
      explanation: 'ASC.AI integrated payment processing with secure checkout and order management.'
    };
  }
  
  if (promptLower.includes('asc create dashboard')) {
    return {
      code: generateDashboardCode(),
      explanation: 'ASC.AI created an analytics dashboard with KPIs, charts, and real-time data updates.'
    };
  }
  
  if (promptLower.includes('asc analyze')) {
    return {
      code: generateAnalysisReport(context),
      explanation: 'ASC.AI analyzed your codebase and generated a comprehensive report with recommendations.'
    };
  }
  
  // Default response for other commands
  return {
    code: generateDefaultComponent(prompt),
    explanation: `ASC.AI processed your request: "${prompt}"`
  };
}

// Code generation functions
function generateCRMCode(withAnalytics = false) {
  return `import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Search,
  Plus,
  Filter,
  MoreHorizontal
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'lead' | 'prospect' | 'customer';
  value: number;
  lastContact: string;
  assignedTo: string;
}

interface Deal {
  id: string;
  title: string;
  customer: string;
  value: number;
  stage: 'qualification' | 'proposal' | 'negotiation' | 'closed';
  probability: number;
  expectedClose: string;
}

const CRMDashboard = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@techcorp.com',
      company: 'TechCorp Inc',
      status: 'customer',
      value: 125000,
      lastContact: '2024-02-20',
      assignedTo: 'Sarah Johnson'
    },
    {
      id: '2',
      name: 'Emily Davis',
      email: 'emily@innovate.io',
      company: 'Innovate Solutions',
      status: 'prospect',
      value: 75000,
      lastContact: '2024-02-22',
      assignedTo: 'Mike Wilson'
    }
  ]);

  const [deals, setDeals] = useState<Deal[]>([
    {
      id: '1',
      title: 'Enterprise Software License',
      customer: 'TechCorp Inc',
      value: 50000,
      stage: 'negotiation',
      probability: 80,
      expectedClose: '2024-03-15'
    },
    {
      id: '2',
      title: 'Custom Development Project',
      customer: 'Innovate Solutions',
      value: 75000,
      stage: 'proposal',
      probability: 60,
      expectedClose: '2024-04-01'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  // Calculate metrics
  const totalRevenue = customers
    .filter(c => c.status === 'customer')
    .reduce((sum, c) => sum + c.value, 0);
  
  const totalPipeline = deals
    .reduce((sum, d) => sum + (d.value * d.probability / 100), 0);
  
  const activeDeals = deals.length;
  const conversionRate = 68; // Mock data

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter deals by stage
  const filteredDeals = selectedStage
    ? deals.filter(deal => deal.stage === selectedStage)
    : deals;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'customer': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'lead': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'closed': return 'bg-green-100 text-green-800';
      case 'negotiation': return 'bg-purple-100 text-purple-800';
      case 'proposal': return 'bg-blue-100 text-blue-800';
      case 'qualification': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CRM Dashboard</h1>
          <p className="text-muted-foreground">Manage customers and track deals</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Customer
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">\${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">\${totalPipeline.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Weighted by probability</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeals}</div>
            <p className="text-xs text-muted-foreground">Across all stages</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Lead to customer</p>
          </CardContent>
        </Card>
      </div>

      {/* Customers Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Customers</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold">{customer.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.company} • {customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(customer.status)}>
                    {customer.status}
                  </Badge>
                  <div className="text-right">
                    <p className="font-medium">\${customer.value.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Lifetime value</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sales Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Pipeline</CardTitle>
          <CardDescription>Track deals through stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {['qualification', 'proposal', 'negotiation', 'closed'].map((stage) => (
              <div key={stage} className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium capitalize">{stage}</h3>
                  <Badge variant="secondary">
                    {deals.filter(d => d.stage === stage).length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {deals
                    .filter(deal => deal.stage === stage)
                    .map(deal => (
                      <div key={deal.id} className="p-3 border rounded-lg bg-card">
                        <p className="font-medium text-sm">{deal.title}</p>
                        <p className="text-xs text-muted-foreground">{deal.customer}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm font-medium">\${deal.value.toLocaleString()}</span>
                          <Badge variant="outline" className="text-xs">
                            {deal.probability}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      ${withAnalytics ? `
      {/* Analytics Section */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
          <CardDescription>Key insights and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">Chart visualization would go here</p>
          </div>
        </CardContent>
      </Card>` : ''}
    </div>
  );
};

export default CRMDashboard;`;
}

function generateInventoryCode() {
  return `import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  BarChart3,
  Search,
  Plus,
  Download,
  Upload
} from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  reorderPoint: number;
  unitCost: number;
  location: string;
  lastRestocked: string;
}

const InventoryManagement = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      sku: 'PROD-001',
      name: 'Wireless Mouse',
      category: 'Electronics',
      quantity: 45,
      reorderPoint: 20,
      unitCost: 25.99,
      location: 'Warehouse A - Shelf 3',
      lastRestocked: '2024-02-15'
    },
    {
      id: '2',
      sku: 'PROD-002',
      name: 'USB-C Cable',
      category: 'Accessories',
      quantity: 12,
      reorderPoint: 50,
      unitCost: 9.99,
      location: 'Warehouse A - Shelf 5',
      lastRestocked: '2024-02-10'
    },
    {
      id: '3',
      sku: 'PROD-003',
      name: 'Laptop Stand',
      category: 'Accessories',
      quantity: 78,
      reorderPoint: 30,
      unitCost: 45.99,
      location: 'Warehouse B - Shelf 1',
      lastRestocked: '2024-02-20'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Calculate metrics
  const totalProducts = products.length;
  const lowStockItems = products.filter(p => p.quantity <= p.reorderPoint).length;
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.unitCost), 0);
  const avgTurnover = 4.2; // Mock data

  // Filter products
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (product: Product) => {
    if (product.quantity === 0) return { color: 'bg-red-100 text-red-800', text: 'Out of Stock' };
    if (product.quantity <= product.reorderPoint) return { color: 'bg-yellow-100 text-yellow-800', text: 'Low Stock' };
    return { color: 'bg-green-100 text-green-800', text: 'In Stock' };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage your product inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active SKUs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items need reorder</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">\${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Inventory worth</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Turnover</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTurnover}x</div>
            <p className="text-xs text-muted-foreground">Per year</p>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Product Inventory</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">SKU</th>
                  <th className="text-left p-4">Product Name</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Quantity</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Location</th>
                  <th className="text-left p-4">Unit Cost</th>
                  <th className="text-left p-4">Total Value</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const status = getStockStatus(product);
                  return (
                    <tr key={product.id} className="border-b">
                      <td className="p-4 font-medium">{product.sku}</td>
                      <td className="p-4">{product.name}</td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4">
                        <div>
                          <span className="font-medium">{product.quantity}</span>
                          <span className="text-sm text-muted-foreground"> / {product.reorderPoint}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={status.color}>{status.text}</Badge>
                      </td>
                      <td className="p-4 text-sm">{product.location}</td>
                      <td className="p-4">\${product.unitCost.toFixed(2)}</td>
                      <td className="p-4 font-medium">\${(product.quantity * product.unitCost).toFixed(2)}</td>
                      <td className="p-4">
                        <Button variant="outline" size="sm">Edit</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      {lowStockItems > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>These items need to be reordered soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {products
                .filter(p => p.quantity <= p.reorderPoint)
                .map(product => (
                  <div key={product.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium">{product.name} ({product.sku})</p>
                      <p className="text-sm text-muted-foreground">Current: {product.quantity} | Reorder at: {product.reorderPoint}</p>
                    </div>
                    <Button size="sm">Create PO</Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InventoryManagement;`;
}

function generateAuthCode() {
  return `import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Lock, 
  Github,
  Chrome,
  Loader2
} from 'lucide-react';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
}

const AuthenticationSystem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store auth token
      localStorage.setItem('authToken', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        name: 'John Doe'
      }));

      toast.success('Login successful!');
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      toast.error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Account created successfully!');
      // Switch to login tab
    } catch (error) {
      toast.error('Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(\`Logged in with \${provider}\`);
    } catch (error) {
      toast.error(\`\${provider} login failed\`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to App Suite</CardTitle>
          <CardDescription>Login or create an account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin('Google')}
                    disabled={isLoading}
                  >
                    <Chrome className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin('GitHub')}
                    disabled={isLoading}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  By signing up, you agree to our{' '}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthenticationSystem;

// Auth Context Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  return <>{children}</>;
};`;
}

function generatePaymentCode(gateway = 'stripe') {
  return `import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  CreditCard, 
  Lock, 
  ShieldCheck,
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react';

interface PaymentFormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  billingAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

interface OrderSummary {
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

const PaymentIntegration = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    billingAddress: {
      line1: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US'
    }
  });

  const [orderSummary] = useState<OrderSummary>({
    items: [
      { id: '1', name: 'Premium Subscription', quantity: 1, price: 99.99 },
      { id: '2', name: 'Additional User License', quantity: 2, price: 29.99 }
    ],
    subtotal: 159.97,
    tax: 12.80,
    shipping: 0,
    total: 172.77
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('billing.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        billingAddress: {
          ...formData.billingAddress,
          [field]: value
        }
      });
    } else {
      // Format card number
      if (name === 'cardNumber') {
        const formatted = value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || value;
        setFormData({ ...formData, [name]: formatted });
      } 
      // Format expiry date
      else if (name === 'expiryDate') {
        const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
        setFormData({ ...formData, [name]: formatted });
      } 
      else {
        setFormData({ ...formData, [name]: value });
      }
    }
  };

  const processPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate ${gateway} payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In production, you would:
      // 1. Create payment intent on backend
      // 2. Confirm payment with ${gateway} SDK
      // 3. Handle 3D Secure if required
      // 4. Process order on success

      const paymentResult = {
        paymentId: 'pi_' + Math.random().toString(36).substr(2, 9),
        status: 'succeeded',
        amount: orderSummary.total,
        currency: 'usd',
        gateway: '${gateway}'
      };

      console.log('Payment processed:', paymentResult);
      
      setPaymentComplete(true);
      toast.success('Payment successful!');
      
      // Redirect to success page after delay
      setTimeout(() => {
        window.location.href = '/order-confirmation';
      }, 3000);

    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">Payment Successful!</h2>
              <p className="text-muted-foreground">
                Your order has been confirmed and will be processed shortly.
              </p>
              <p className="text-sm text-muted-foreground">
                Order Total: <span className="font-semibold">\${orderSummary.total.toFixed(2)}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>
                  Enter your payment details to complete your order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={processPayment} className="space-y-6">
                  {/* Security Badge */}
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-800">
                      Your payment information is encrypted and secure
                    </span>
                  </div>

                  {/* Card Information */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="pl-9"
                          maxLength={19}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cardHolder">Cardholder Name</Label>
                      <Input
                        id="cardHolder"
                        name="cardHolder"
                        placeholder="John Doe"
                        value={formData.cardHolder}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="cvv"
                            name="cvv"
                            type="password"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className="pl-9"
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Billing Address</h3>
                    
                    <div>
                      <Label htmlFor="billing.line1">Street Address</Label>
                      <Input
                        id="billing.line1"
                        name="billing.line1"
                        placeholder="123 Main Street"
                        value={formData.billingAddress.line1}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billing.city">City</Label>
                        <Input
                          id="billing.city"
                          name="billing.city"
                          placeholder="New York"
                          value={formData.billingAddress.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing.state">State</Label>
                        <Input
                          id="billing.state"
                          name="billing.state"
                          placeholder="NY"
                          value={formData.billingAddress.state}
                          onChange={handleInputChange}
                          maxLength={2}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="billing.postalCode">Postal Code</Label>
                      <Input
                        id="billing.postalCode"
                        name="billing.postalCode"
                        placeholder="10001"
                        value={formData.billingAddress.postalCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Pay \${orderSummary.total.toFixed(2)}
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <span>Powered by</span>
                    <Badge variant="outline">${gateway.toUpperCase()}</Badge>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {orderSummary.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">\${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>\${orderSummary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>\${orderSummary.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{orderSummary.shipping === 0 ? 'Free' : \`\$\${orderSummary.shipping.toFixed(2)}\`}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>\${orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">30-Day Money Back Guarantee</p>
                      <p>If you're not satisfied, we'll refund your purchase.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentIntegration;`;
}

function generateDashboardCode() {
  return `import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Package,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Activity,
  CreditCard,
  ShoppingCart
} from 'lucide-react';

const AnalyticsDashboard = () => {
  // Mock data - in production, this would come from your API
  const metrics = {
    revenue: {
      current: 54231,
      previous: 48256,
      change: 12.4
    },
    customers: {
      current: 2341,
      previous: 2156,
      change: 8.6
    },
    orders: {
      current: 486,
      previous: 423,
      change: 14.9
    },
    avgOrderValue: {
      current: 111.6,
      previous: 114.1,
      change: -2.2
    }
  };

  const recentActivity = [
    { id: 1, type: 'order', description: 'New order #3847', amount: 299.99, time: '2 min ago' },
    { id: 2, type: 'customer', description: 'New customer registered', time: '15 min ago' },
    { id: 3, type: 'payment', description: 'Payment received', amount: 1250.00, time: '1 hour ago' },
    { id: 4, type: 'order', description: 'Order #3846 shipped', time: '2 hours ago' },
  ];

  const topProducts = [
    { name: 'Premium Widget', sales: 145, revenue: 14500, growth: 23 },
    { name: 'Basic Widget', sales: 98, revenue: 4900, growth: 12 },
    { name: 'Pro Widget', sales: 76, revenue: 11400, growth: -5 },
    { name: 'Enterprise Widget', sales: 43, revenue: 21500, growth: 34 },
  ];

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor your business performance</p>
        </div>
        <Button>
          Download Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">\${metrics.revenue.current.toLocaleString()}</div>
            <div className={\`flex items-center text-xs \${getChangeColor(metrics.revenue.change)}\`}>
              {getChangeIcon(metrics.revenue.change)}
              <span>{Math.abs(metrics.revenue.change)}% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.customers.current.toLocaleString()}</div>
            <div className={\`flex items-center text-xs \${getChangeColor(metrics.customers.change)}\`}>
              {getChangeIcon(metrics.customers.change)}
              <span>{Math.abs(metrics.customers.change)}% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.orders.current}</div>
            <div className={\`flex items-center text-xs \${getChangeColor(metrics.orders.change)}\`}>
              {getChangeIcon(metrics.orders.change)}
              <span>{Math.abs(metrics.orders.change)}% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">\${metrics.avgOrderValue.current.toFixed(2)}</div>
            <div className={\`flex items-center text-xs \${getChangeColor(metrics.avgOrderValue.change)}\`}>
              {getChangeIcon(metrics.avgOrderValue.change)}
              <span>{Math.abs(metrics.avgOrderValue.change)}% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
              <BarChart3 className="h-12 w-12 text-muted-foreground/50" />
              <span className="ml-4 text-muted-foreground">Chart visualization area</span>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">\${product.revenue.toLocaleString()}</p>
                      <div className={\`flex items-center justify-end text-xs \${getChangeColor(product.growth)}\`}>
                        {getChangeIcon(product.growth)}
                        <span>{Math.abs(product.growth)}%</span>
                      </div>
                    </div>
                  </div>
                  <Progress value={product.sales / 145 * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest transactions and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={\`w-8 h-8 rounded-full flex items-center justify-center
                    \${activity.type === 'order' ? 'bg-blue-100' : ''}
                    \${activity.type === 'customer' ? 'bg-green-100' : ''}
                    \${activity.type === 'payment' ? 'bg-purple-100' : ''}
                  \`}>
                    {activity.type === 'order' && <Package className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'customer' && <Users className="h-4 w-4 text-green-600" />}
                    {activity.type === 'payment' && <CreditCard className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                {activity.amount && (
                  <span className="font-medium">\${activity.amount.toFixed(2)}</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;`;
}

function generateAnalysisReport(context) {
  return `// ASC.AI Codebase Analysis Report
// Generated at: ${new Date().toISOString()}

/**
 * CODEBASE ANALYSIS SUMMARY
 * ========================
 * 
 * Project Type: React Application
 * Framework: React 18 with TypeScript
 * UI Library: Tailwind CSS + shadcn/ui
 * State Management: React Hooks
 * 
 * STRUCTURE ANALYSIS
 * ==================
 * 
 * 1. Architecture Pattern: Component-Based
 * 2. Code Organization: Feature-based folders
 * 3. Naming Convention: PascalCase for components, camelCase for functions
 * 4. Type Safety: TypeScript interfaces for all data structures
 * 
 * RECOMMENDATIONS
 * ===============
 * 
 * 1. Performance Optimizations:
 *    - Implement React.memo for heavy components
 *    - Add lazy loading for route-based code splitting
 *    - Optimize re-renders with useMemo/useCallback
 * 
 * 2. Code Quality:
 *    - Add ESLint rules for consistent code style
 *    - Implement unit tests for critical functions
 *    - Add error boundaries for better error handling
 * 
 * 3. Security:
 *    - Sanitize user inputs
 *    - Implement proper authentication checks
 *    - Use environment variables for sensitive data
 * 
 * 4. Scalability:
 *    - Consider Redux for complex state management
 *    - Implement proper data fetching with React Query
 *    - Add proper loading and error states
 * 
 * NEXT STEPS
 * ==========
 * 
 * 1. Run 'asc optimize performance' to implement performance improvements
 * 2. Run 'asc add testing jest' to set up testing framework
 * 3. Run 'asc add error-handling' to implement error boundaries
 * 4. Run 'asc analyze security' for detailed security audit
 */

export const analysisReport = {
  summary: {
    totalFiles: 45,
    totalLines: 3250,
    coverage: 0, // No tests found
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    lastModified: new Date().toISOString()
  },
  
  issues: [
    {
      severity: 'warning',
      type: 'performance',
      description: 'Large bundle size detected',
      recommendation: 'Implement code splitting and tree shaking'
    },
    {
      severity: 'info',
      type: 'code-quality',
      description: 'No tests found',
      recommendation: 'Add unit and integration tests'
    }
  ],
  
  metrics: {
    maintainability: 78,
    complexity: 'Medium',
    duplicateCode: 12,
    testCoverage: 0
  }
};`;
}

function generateDefaultComponent(prompt) {
  return `// ASC.AI Generated Component
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const GeneratedComponent = () => {
  // Component generated based on: "${prompt}"
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>ASC.AI Generated Component</CardTitle>
        <CardDescription>
          This component was generated based on your request
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Request: "${prompt}"
        </p>
        <div className="space-y-4">
          {/* Add your implementation here */}
          <p>Component implementation goes here.</p>
          <Button>Action Button</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneratedComponent;`;
}