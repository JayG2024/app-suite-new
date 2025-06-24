import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Calculator, 
  DollarSign, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Zap,
  Info
} from "lucide-react";
import SEO from "@/components/SEO";

const FinancingCalculator = () => {
  const [projectType, setProjectType] = useState('5000');
  const [needFinancing, setNeedFinancing] = useState('no');
  const [financingTerm, setFinancingTerm] = useState('6');
  const [additionalAPIs, setAdditionalAPIs] = useState(0);
  const [apiType, setApiType] = useState('basic');

  // Project types with included APIs
  const projectTypes = {
    '2500': { name: 'Small Business Tool', price: 2500, includedAPIs: 1 },
    '5000': { name: 'Standard Application', price: 5000, includedAPIs: 2 },
    '7500': { name: 'AI-Powered Solution', price: 7500, includedAPIs: 3 },
    '10000': { name: 'Enterprise Solution', price: 10000, includedAPIs: 3 },
    '15000': { name: 'Enterprise Plus', price: 15000, includedAPIs: 3 },
    '20000': { name: 'Enterprise Premium', price: 20000, includedAPIs: 3 }
  };

  // Financing rates
  const financingRates = {
    '6': { months: 6, rate: 0.10, label: '6 months (+10%)' },
    '12': { months: 12, rate: 0.15, label: '12 months (+15%)' },
    '24': { months: 24, rate: 0.20, label: '24 months (+20%)' }
  };

  // API pricing
  const apiPricing = {
    'basic': { name: 'Basic Data Sync API', price: 1000 },
    'full': { name: 'Full Functional API', price: 2500 }
  };

  // Calculate totals
  const basePrice = projectTypes[projectType].price;
  const apiCost = additionalAPIs * apiPricing[apiType].price;
  const totalProjectCost = basePrice + apiCost;
  
  // Calculate down payment based on project size
  const downPayment = totalProjectCost < 10000 
    ? totalProjectCost * 0.5 
    : 5000;
  
  const amountToFinance = totalProjectCost - downPayment;
  const financingFee = needFinancing === 'yes' 
    ? amountToFinance * financingRates[financingTerm].rate 
    : 0;
  const totalWithFinancing = totalProjectCost + financingFee;
  const monthlyPayment = needFinancing === 'yes' 
    ? (amountToFinance + financingFee) / financingRates[financingTerm].months 
    : 0;

  return (
    <>
      <SEO 
        title="Financing Calculator - App Suite"
        description="Calculate your custom software project cost and explore flexible financing options. Get transparent pricing for your business application."
        keywords="software financing, app development cost calculator, payment plans, custom software pricing"
      />
      
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calculator className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">Project Financing Calculator</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculate your project cost and explore flexible financing options. 
              Build now, pay over time with transparent terms.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Configuration */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Project Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Select Your Project Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={projectType} onValueChange={setProjectType}>
                    <div className="grid gap-4">
                      {Object.entries(projectTypes).map(([value, project]) => (
                        <div key={value} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                          <RadioGroupItem value={value} id={value} />
                          <Label htmlFor={value} className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold">{project.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  Includes {project.includedAPIs} API connection{project.includedAPIs > 1 ? 's' : ''}
                                </div>
                              </div>
                              <div className="text-xl font-bold">${project.price.toLocaleString()}</div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Additional APIs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Additional API Connections
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        Your {projectTypes[projectType].name} includes {projectTypes[projectType].includedAPIs} API connection{projectTypes[projectType].includedAPIs > 1 ? 's' : ''} at no extra cost.
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>API Type</Label>
                    <RadioGroup value={apiType} onValueChange={setApiType} className="mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="basic" id="basic" />
                        <Label htmlFor="basic" className="font-normal">
                          Basic Data Sync API - $1,000 each
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="full" id="full" />
                        <Label htmlFor="full" className="font-normal">
                          Full Functional API - $2,500 each
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="apiCount">Number of Additional APIs</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setAdditionalAPIs(Math.max(0, additionalAPIs - 1))}
                        disabled={additionalAPIs === 0}
                      >
                        -
                      </Button>
                      <div className="w-16 text-center text-xl font-semibold">{additionalAPIs}</div>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setAdditionalAPIs(additionalAPIs + 1)}
                      >
                        +
                      </Button>
                    </div>
                    {additionalAPIs > 0 && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        Additional API Cost: ${(additionalAPIs * apiPricing[apiType].price).toLocaleString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Financing Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Financing Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Do you need financing?</Label>
                    <RadioGroup value={needFinancing} onValueChange={setNeedFinancing} className="mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no" className="font-normal">
                          No - I'll pay in full or 50/50 split
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes" className="font-normal">
                          Yes - I want to finance the balance
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {needFinancing === 'yes' && (
                    <div>
                      <Label>Select Financing Term</Label>
                      <RadioGroup value={financingTerm} onValueChange={setFinancingTerm} className="mt-2">
                        {Object.entries(financingRates).map(([value, term]) => (
                          <div key={value} className="flex items-center space-x-2">
                            <RadioGroupItem value={value} id={`term-${value}`} />
                            <Label htmlFor={`term-${value}`} className="font-normal">
                              {term.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Cost Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{projectTypes[projectType].name}</span>
                      <span className="font-semibold">${basePrice.toLocaleString()}</span>
                    </div>
                    {additionalAPIs > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>{additionalAPIs} Additional {apiPricing[apiType].name}</span>
                        <span>${apiCost.toLocaleString()}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Project Total</span>
                      <span>${totalProjectCost.toLocaleString()}</span>
                    </div>
                  </div>

                  {needFinancing === 'yes' && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Down Payment</span>
                          <span className="font-semibold">${downPayment.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Amount to Finance</span>
                          <span>${amountToFinance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Financing Fee ({(financingRates[financingTerm].rate * 100).toFixed(0)}%)</span>
                          <span>${financingFee.toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total with Financing</span>
                          <span>${totalWithFinancing.toLocaleString()}</span>
                        </div>
                        <div className="bg-primary/10 rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Monthly Payment</div>
                            <div className="text-2xl font-bold text-primary">
                              ${monthlyPayment.toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              for {financingRates[financingTerm].months} months
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {needFinancing === 'no' && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <Badge variant="secondary" className="w-full justify-center">
                          Payment Options Available
                        </Badge>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>50/50 Split Payment</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>Full Payment (5% discount)</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />
                  
                  <div className="space-y-3">
                    <Button asChild className="w-full" size="lg">
                      <Link to="/contact?type=custom-quote">
                        Get Started
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/payment-terms">
                        View Full Terms
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Information Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">No Hidden Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our pricing is transparent. The calculator shows your total cost including any financing fees upfront.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Flexible Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Choose from 6, 12, or 24-month financing. Enterprise clients can request custom terms.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Approval</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get approved quickly with our simple application process. Start building in days, not weeks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinancingCalculator;