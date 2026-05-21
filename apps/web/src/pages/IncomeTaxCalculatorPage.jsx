import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Calculator, IndianRupee, Info, ArrowRight, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSEOData } from '@/hooks/useSEOData.js';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const IncomeTaxCalculatorPage = () => {
  // 6. Implement Meta Tag Injection using useSEOData hook
  const { seoData } = useSEOData('income-tax-calculator');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const [income, setIncome] = useState('');
  const [regime, setRegime] = useState('new');
  const [ageGroup, setAgeGroup] = useState('under60');
  const [deductions, setDeductions] = useState('');
  const [result, setResult] = useState(null);

  const calculateTax = () => {
    const grossIncome = parseFloat(income) || 0;
    const totalDeductions = parseFloat(deductions) || 0;
    let taxableIncome = grossIncome;
    let tax = 0;

    if (regime === 'old') {
      taxableIncome = Math.max(0, grossIncome - totalDeductions);
      if (taxableIncome <= 250000) tax = 0;
      else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
      else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.2;
      else tax = 112500 + (taxableIncome - 1000000) * 0.3;
      
      if (taxableIncome <= 500000) tax = 0; // Rebate u/s 87A
    } else {
      // New Regime (2024-25)
      taxableIncome = Math.max(0, grossIncome - 50000); // Standard deduction
      if (taxableIncome <= 300000) tax = 0;
      else if (taxableIncome <= 600000) tax = (taxableIncome - 300000) * 0.05;
      else if (taxableIncome <= 900000) tax = 15000 + (taxableIncome - 600000) * 0.1;
      else if (taxableIncome <= 1200000) tax = 45000 + (taxableIncome - 900000) * 0.15;
      else if (taxableIncome <= 1500000) tax = 90000 + (taxableIncome - 1200000) * 0.2;
      else tax = 150000 + (taxableIncome - 1500000) * 0.3;

      if (taxableIncome <= 700000) tax = 0; // Rebate u/s 87A
    }

    const cess = tax * 0.04;
    const totalTax = tax + cess;

    setResult({
      grossIncome,
      taxableIncome,
      tax,
      cess,
      totalTax,
      takeHome: grossIncome - totalTax
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 6. Inject Meta Tags */}
      <Helmet>
        <title>{seoData?.meta_title || 'Income Tax Calculator | Toolisiya'}</title>
        {seoData?.meta_description && <meta name="description" content={seoData.meta_description} />}
        {seoData?.meta_keywords && <meta name="keywords" content={seoData.meta_keywords} />}
        {seoData?.og_title && <meta property="og:title" content={seoData.og_title} />}
        {seoData?.og_description && <meta property="og:description" content={seoData.og_description} />}
        {seoData?.og_image && <meta property="og:image" content={seoData.og_image} />}
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        {seoData?.structured_data && (
          <script type="application/ld+json">
            {typeof seoData.structured_data === 'string' ? seoData.structured_data : JSON.stringify(seoData.structured_data)}
          </script>
        )}
      </Helmet>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <BreadcrumbNavigation customTitle="Income Tax Calculator" />
          <NavigationButtons />
          
          <div className="mb-8 mt-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{seoData?.h1_tag || 'Income Tax Calculator (FY 2024-25)'}</h1>
            <p className="text-muted-foreground">Calculate your tax liability under the old and new tax regimes.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <Card className="shadow-lg border-border">
                <CardHeader className="bg-muted/30 border-b pb-4">
                  <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5 text-primary" /> Tax Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="space-y-2">
                    <Label>Financial Year</Label>
                    <Select defaultValue="2024-25">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="2024-25">FY 2024-25 (AY 2025-26)</SelectItem></SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tax Regime</Label>
                    <Select value={regime} onValueChange={setRegime}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New Tax Regime (Default)</SelectItem>
                        <SelectItem value="old">Old Tax Regime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Gross Annual Income</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="pl-9" placeholder="e.g. 1200000" />
                    </div>
                  </div>

                  {regime === 'old' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <Label>Total Deductions (80C, 80D, etc.)</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="number" value={deductions} onChange={(e) => setDeductions(e.target.value)} className="pl-9" placeholder="e.g. 150000" />
                      </div>
                    </div>
                  )}

                  <Button className="w-full font-bold" size="lg" onClick={calculateTax}>Calculate Tax</Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-7">
              {result ? (
                <Card className="shadow-lg border-primary/20 bg-primary/5 h-full animate-in fade-in slide-in-from-bottom-4">
                  <CardHeader className="border-b border-primary/10 pb-4">
                    <CardTitle>Tax Summary</CardTitle>
                    <CardDescription>Based on {regime === 'new' ? 'New' : 'Old'} Regime</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-background p-4 rounded-xl border shadow-sm">
                        <p className="text-sm text-muted-foreground mb-1">Gross Income</p>
                        <p className="text-xl font-bold">₹{result.grossIncome.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="bg-background p-4 rounded-xl border shadow-sm">
                        <p className="text-sm text-muted-foreground mb-1">Taxable Income</p>
                        <p className="text-xl font-bold">₹{result.taxableIncome.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    <div className="bg-background p-6 rounded-xl border shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Income Tax</span>
                        <span className="font-medium">₹{result.tax.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Health & Education Cess (4%)</span>
                        <span className="font-medium">₹{result.cess.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="border-t pt-4 flex justify-between items-center">
                        <span className="text-lg font-bold text-foreground">Total Tax Payable</span>
                        <span className="text-2xl font-black text-destructive">₹{result.totalTax.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-xl text-center">
                      <p className="text-emerald-700 dark:text-emerald-400 font-medium mb-1">In-Hand Salary (Yearly)</p>
                      <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">₹{result.takeHome.toLocaleString('en-IN')}</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full border-dashed flex flex-col items-center justify-center p-12 text-center text-muted-foreground bg-muted/10">
                  <Calculator className="h-16 w-16 mb-4 opacity-20" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Calculate</h3>
                  <p className="max-w-sm">Enter your income details on the left to see your complete tax breakdown and take-home salary.</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IncomeTaxCalculatorPage;