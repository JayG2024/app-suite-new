import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import SEO from "@/components/SEO";

const RoiCalculator = () => {
  const navigate = useNavigate();
  
  // Calculator state
  const [monthlySubscriptions, setMonthlySubscriptions] = useState({
    crm: 150,
    projectManagement: 80,
    accounting: 120,
    marketing: 200,
    other: 100
  });
  
  const [customSoftwareCost, setCustomSoftwareCost] = useState(25000);
  const [timeframe, setTimeframe] = useState(36); // months
  
  // Calculations
  const totalMonthlyCost = Object.values(monthlySubscriptions).reduce((sum, cost) => sum + cost, 0);
  const totalSaasCost = totalMonthlyCost * timeframe;
  const savings = totalSaasCost - customSoftwareCost;
  const breakEvenMonths = Math.ceil(customSoftwareCost / totalMonthlyCost);
  const roiPercentage = ((savings / customSoftwareCost) * 100).toFixed(1);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <SEO title="ROI Calculator - Calculate Custom Software Savings" description="Calculate your return on investment with custom software development. See how much you can save by replacing monthly subscriptions with one-time custom solutions." />
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="flex justify-center mb-4">
          <Calculator className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-6">ROI Calculator</h1>
        <p className="text-lg text-muted-foreground">
          See how much you could save by building custom software instead of paying monthly SaaS subscriptions
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Current Monthly Software Costs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="crm">CRM Software (Salesforce, HubSpot, etc.)</Label>
                <Input
                  id="crm"
                  type="number"
                  value={monthlySubscriptions.crm}
                  onChange={(e) => setMonthlySubscriptions(prev => ({...prev, crm: Number(e.target.value)}))}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="pm">Project Management (Monday, Asana, etc.)</Label>
                <Input
                  id="pm"
                  type="number"
                  value={monthlySubscriptions.projectManagement}
                  onChange={(e) => setMonthlySubscriptions(prev => ({...prev, projectManagement: Number(e.target.value)}))}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="accounting">Accounting Software (QuickBooks, Xero, etc.)</Label>
                <Input
                  id="accounting"
                  type="number"
                  value={monthlySubscriptions.accounting}
                  onChange={(e) => setMonthlySubscriptions(prev => ({...prev, accounting: Number(e.target.value)}))}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="marketing">Marketing Tools (Mailchimp, Buffer, etc.)</Label>
                <Input
                  id="marketing"
                  type="number"
                  value={monthlySubscriptions.marketing}
                  onChange={(e) => setMonthlySubscriptions(prev => ({...prev, marketing: Number(e.target.value)}))}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="other">Other Software Subscriptions</Label>
                <Input
                  id="other"
                  type="number"
                  value={monthlySubscriptions.other}
                  onChange={(e) => setMonthlySubscriptions(prev => ({...prev, other: Number(e.target.value)}))}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Monthly Cost:</span>
                <span className="text-red-600">${totalMonthlyCost.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="custom-cost">Custom Software Investment</Label>
                <Input
                  id="custom-cost"
                  type="number"
                  value={customSoftwareCost}
                  onChange={(e) => setCustomSoftwareCost(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="timeframe">Analysis Timeframe (months)</Label>
                <Input
                  id="timeframe"
                  type="number"
                  value={timeframe}
                  onChange={(e) => setTimeframe(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">${savings.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Savings</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{breakEvenMonths}</div>
                <div className="text-sm text-muted-foreground">Break-even (months)</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Comparison Over {timeframe} Months</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium">SaaS Subscriptions</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">${totalSaasCost.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Custom Software</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">${customSoftwareCost.toLocaleString()}</span>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">ROI:</span>
                    <span className="text-xl font-bold text-primary">{roiPercentage}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Beyond Cost Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Own your software forever - no recurring fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Built exactly for your workflow and processes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">No user limits or feature restrictions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Complete data control and security</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Scales with your business without extra costs</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Ready to Stop Renting Software?</h3>
              <p className="mb-4 opacity-90">
                Let's discuss building your custom solution and eliminate those monthly subscriptions forever.
              </p>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate('/contact')}
                className="w-full"
              >
                Schedule Discovery Call
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoiCalculator;