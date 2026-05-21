import React, { useState, useEffect, useCallback } from 'react';
import { Calculator, Download, Copy, RefreshCcw, Check, Info } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import SEOHead from '@/components/SEOHead.jsx';
import SEOContentSection from '@/components/SEOContentSection.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';
import { exportCalculationResultsPDF } from '@/utils/pdfExport.js';

// Implementation of Old Tax Regime logic as per specific request for age-based slabs
const TaxCalculatorPage = () => {
  const [income, setIncome] = useState('1000000');
  const [deductions, setDeductions] = useState('0');
  const [citizenType, setCitizenType] = useState('non_senior');
  
  const [results, setResults] = useState({
    grossIncome: 0,
    standardDeduction: 50000,
    otherDeductions: 0,
    taxableIncome: 0,
    baseTax: 0,
    rebate87A: 0,
    surcharge: 0,
    cess: 0,
    totalTax: 0,
    takeHome: 0
  });

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const calculateTax = useCallback(() => {
    setLoading(true);
    
    setTimeout(() => {
      const gross = parseFloat(income) || 0;
      const stdDeduction = 50000;
      const otherDeductions = parseFloat(deductions) || 0;
      
      // Calculate taxable income
      let taxable = gross - stdDeduction - otherDeductions;
      if (taxable < 0) taxable = 0;

      let tax = 0;
      
      // Old Regime Slabs based on Age (2024-25)
      if (citizenType === 'super_senior') {
        // > 80 years (Exempt up to 5L)
        if (taxable > 1000000) {
          tax += (taxable - 1000000) * 0.30;
          tax += 100000; // 20% of 5L (5L to 10L)
        } else if (taxable > 500000) {
          tax += (taxable - 500000) * 0.20;
        }
      } else if (citizenType === 'senior') {
        // 60-80 years (Exempt up to 3L)
        if (taxable > 1000000) {
          tax += (taxable - 1000000) * 0.30;
          tax += 100000; // 20% of 5L (5L to 10L)
          tax += 10000;  // 5% of 2L (3L to 5L)
        } else if (taxable > 500000) {
          tax += (taxable - 500000) * 0.20;
          tax += 10000;  // 5% of 2L (3L to 5L)
        } else if (taxable > 300000) {
          tax += (taxable - 300000) * 0.05;
        }
      } else {
        // < 60 years (Exempt up to 2.5L)
        if (taxable > 1000000) {
          tax += (taxable - 1000000) * 0.30;
          tax += 100000; // 20% of 5L (5L to 10L)
          tax += 12500;  // 5% of 2.5L (2.5L to 5L)
        } else if (taxable > 500000) {
          tax += (taxable - 500000) * 0.20;
          tax += 12500;  // 5% of 2.5L (2.5L to 5L)
        } else if (taxable > 250000) {
          tax += (taxable - 250000) * 0.05;
        }
      }

      // Rebate under 87A (Old Regime: up to 5L taxable income gets max 12500 rebate)
      let rebate = 0;
      if (taxable <= 500000) {
        rebate = Math.min(tax, 12500);
        tax -= rebate;
      }

      // Surcharge Calculation
      let surchargeRate = 0;
      if (taxable > 50000000) surchargeRate = 0.37; // > 5 Cr
      else if (taxable > 20000000) surchargeRate = 0.25; // > 2 Cr
      else if (taxable > 10000000) surchargeRate = 0.15; // > 1 Cr
      else if (taxable > 5000000) surchargeRate = 0.10;  // > 50 L
      
      const surcharge = tax * surchargeRate;
      const taxWithSurcharge = tax + surcharge;

      // Health and Education Cess (4% on Tax + Surcharge)
      const cess = taxWithSurcharge * 0.04;
      const totalTax = taxWithSurcharge + cess;

      setResults({
        grossIncome: gross,
        standardDeduction: stdDeduction,
        otherDeductions: otherDeductions,
        taxableIncome: taxable,
        baseTax: tax + rebate, // show before rebate
        rebate87A: rebate,
        surcharge: surcharge,
        cess: cess,
        totalTax: totalTax,
        takeHome: gross - totalTax
      });
      
      setLoading(false);
    }, 400);
  }, [income, deductions, citizenType]);

  useEffect(() => {
    calculateTax();
  }, [calculateTax]);

  const handleCopy = () => {
    const text = `Income Tax Report (2024-25):\nGross Income: ₹${results.grossIncome}\nTaxable Income: ₹${results.taxableIncome}\nTotal Tax Payable: ₹${results.totalTax.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    exportCalculationResultsPDF({
      'Assessment Year': '2024-2025',
      'Citizen Category': citizenType === 'super_senior' ? 'Super Senior Citizen (80+)' : citizenType === 'senior' ? 'Senior Citizen (60-80)' : 'Non-Senior Citizen (<60)',
      'Gross Income': `₹${results.grossIncome.toLocaleString()}`,
      'Standard Deduction': `₹${results.standardDeduction.toLocaleString()}`,
      'Other Deductions': `₹${results.otherDeductions.toLocaleString()}`,
      'Taxable Income': `₹${results.taxableIncome.toLocaleString()}`,
      'Base Tax': `₹${results.baseTax.toLocaleString()}`,
      'Rebate (87A)': `-₹${results.rebate87A.toLocaleString()}`,
      'Surcharge': `₹${results.surcharge.toLocaleString()}`,
      'Health & Education Cess (4%)': `₹${results.cess.toLocaleString()}`,
      'Total Tax Payable': `₹${Math.round(results.totalTax).toLocaleString()}`,
      'Take Home Income': `₹${Math.round(results.takeHome).toLocaleString()}`
    }, 'Income Tax Report');
  };

  const seoDescription = "Estimate your income tax accurately based on 2024-2025 tax slabs. Our free online Income Tax Calculator handles complex tax brackets for Non-Senior, Senior (60-80 years), and Super Senior (80+ years) citizens under the standard tax regime. It automatically applies the ₹50,000 standard deduction, computes section 87A rebates, and correctly calculates applicable surcharges and the 4% Health and Education Cess. Whether you are a salaried employee planning investments or a freelancer estimating quarterly advance tax, this utility gives you an immediate breakdown of your taxable income, exact tax liability, and projected take-home pay. All calculations happen instantly within your local browser for absolute financial privacy. Free • No Sign-up Required.";
  
  const seoFeatures = [
    "Supports all age categories (Non-Senior, Senior 60-80, Super Senior 80+)",
    "Automatically applies ₹50,000 standard deduction",
    "Accurately calculates complex surcharges for high-income brackets (>50L, >1Cr)",
    "Applies mandatory 4% Health and Education Cess on tax and surcharge",
    "Provides a transparent breakdown of base tax, rebates, and final liability",
    "Export comprehensive tax projection to PDF format instantly"
  ];

  const seoSteps = [
    { title: "Select Citizen Category", description: "Choose your age bracket. Tax slabs vary significantly if you are a Senior or Super Senior citizen." },
    { title: "Enter Gross Income", description: "Input your total annual gross income before any deductions or tax." },
    { title: "Provide Additional Deductions", description: "Enter any other eligible deductions (like 80C investments, HRA, etc.) besides the standard ₹50,000 deduction." },
    { title: "Review Total Tax", description: "Instantly see your taxable income, applicable surcharge, cess, and final tax payable on the results panel." }
  ];

  const seoFaqs = [
    { question: "Is the ₹50,000 standard deduction applied automatically?", answer: "Yes, our calculator automatically subtracts the ₹50,000 standard deduction from your gross income to compute the taxable income." },
    { question: "How does age affect my income tax calculation?", answer: "Under the older standard tax regime, basic exemption limits vary by age: ₹2.5 Lakhs for individuals under 60, ₹3 Lakhs for senior citizens (60-80 years), and ₹5 Lakhs for super senior citizens (above 80 years)." },
    { question: "What is the 4% Cess?", answer: "The Government of India levies a mandatory 4% Health and Education Cess on the total computed income tax plus any applicable surcharge. Our calculator handles this automatically." },
    { question: "How is the Surcharge calculated?", answer: "A surcharge is an additional tax on individuals with higher incomes. It is applied at 10% for taxable income above ₹50 Lakhs, 15% above ₹1 Crore, 25% above ₹2 Crores, and 37% above ₹5 Crores." }
  ];

  const relatedTools = [
    { name: "Salary Calculator", path: "/finance/salary-calculator" },
    { name: "GST Calculator", path: "/finance/gst-calculator" },
    { name: "Investment Calculator", path: "/finance/investment-calculator" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead 
        defaultTitle="Income Tax Calculator - Free Online Tax Slabs 2024-25 | Toolisiya" 
        defaultDescription="Calculate your income tax for 2024-2025. Supports all citizen categories, standard deductions, surcharge, and cess. Private & secure. Free • No Sign-up Required."
        faqs={seoFaqs}
        toolData={{
          name: "Income Tax Calculator",
          description: seoDescription,
          applicationCategory: "FinanceApplication"
        }}
        schemaType="calculator"
      />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <NavigationButtons />
          <BreadcrumbNavigation customTitle="Income Tax Calculator" />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-balance">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Free Income Tax Calculator</h1>
            <p className="text-lg text-muted-foreground">Estimate your tax liability accurately based on 2024-2025 slabs, including surcharges and cess.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <Card className="lg:col-span-7 shadow-lg border-border">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5 text-primary" /> Tax Details</CardTitle>
                <CardDescription>Enter your income and category details</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                
                <div className="space-y-4">
                  <Label className="text-base font-bold">Citizen Category</Label>
                  <RadioGroup value={citizenType} onValueChange={setCitizenType} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2 border rounded-lg p-4 bg-muted/10 hover:bg-muted/30 cursor-pointer">
                      <RadioGroupItem value="non_senior" id="non_senior" />
                      <Label htmlFor="non_senior" className="cursor-pointer">&lt; 60 Years<br/><span className="text-xs text-muted-foreground font-normal">Non-Senior</span></Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4 bg-muted/10 hover:bg-muted/30 cursor-pointer">
                      <RadioGroupItem value="senior" id="senior" />
                      <Label htmlFor="senior" className="cursor-pointer">60-80 Years<br/><span className="text-xs text-muted-foreground font-normal">Senior</span></Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4 bg-muted/10 hover:bg-muted/30 cursor-pointer">
                      <RadioGroupItem value="super_senior" id="super_senior" />
                      <Label htmlFor="super_senior" className="cursor-pointer">&gt; 80 Years<br/><span className="text-xs text-muted-foreground font-normal">Super Senior</span></Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-bold flex items-center gap-2">Gross Annual Income</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input 
                      type="number" 
                      value={income} 
                      onChange={(e) => setIncome(e.target.value)} 
                      className="pl-8 h-12 text-lg" 
                      placeholder="e.g. 1200000"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-bold">Other Deductions (80C, HRA, etc.)</Label>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded">Std Deduction: ₹50,000 (Auto-applied)</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input 
                      type="number" 
                      value={deductions} 
                      onChange={(e) => setDeductions(e.target.value)} 
                      className="pl-8 h-12 text-lg" 
                      placeholder="e.g. 150000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-5 shadow-lg bg-slate-950 text-slate-50 border-none relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>
              <CardHeader className="border-b border-slate-800 pb-4 relative z-10">
                <CardTitle className="text-slate-100">Tax Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6 relative z-10">
                {loading ? (
                  <div className="flex justify-center items-center h-48">
                    <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                      <span className="text-slate-400">Gross Income</span>
                      <span className="text-lg font-medium">₹{results.grossIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-slate-300">
                      <span>Total Deductions</span>
                      <span>-₹{(results.standardDeduction + results.otherDeductions).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                      <span className="text-slate-400">Taxable Income</span>
                      <span className="text-xl font-bold text-white">₹{results.taxableIncome.toLocaleString()}</span>
                    </div>
                    
                    <div className="pt-2 space-y-2 text-sm text-slate-300">
                      <div className="flex justify-between items-center">
                        <span>Base Tax</span>
                        <span>₹{results.baseTax.toLocaleString()}</span>
                      </div>
                      {results.rebate87A > 0 && (
                        <div className="flex justify-between items-center text-emerald-400">
                          <span>Rebate u/s 87A</span>
                          <span>-₹{results.rebate87A.toLocaleString()}</span>
                        </div>
                      )}
                      {results.surcharge > 0 && (
                        <div className="flex justify-between items-center text-amber-400">
                          <span>Surcharge</span>
                          <span>+₹{Math.round(results.surcharge).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span>Health & Edu Cess (4%)</span>
                        <span>+₹{Math.round(results.cess).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end pt-4 mt-2 border-t-2 border-slate-700">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Tax Payable</span>
                      </div>
                      <span className="text-4xl font-extrabold text-primary">₹{Math.round(results.totalTax).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 bg-emerald-500/10 -mx-6 px-6 py-4 border-t border-emerald-500/20 mt-6">
                      <span className="font-bold text-emerald-400">Net Take Home</span>
                      <span className="text-2xl font-bold text-emerald-400">₹{Math.round(results.takeHome).toLocaleString()}</span>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Button variant="secondary" onClick={handleCopy} className="w-full bg-slate-800 text-white hover:bg-slate-700 border-none shadow-none">
                    {copied ? <Check className="h-4 w-4 mr-2 text-emerald-400" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy Summary
                  </Button>
                  <Button onClick={handleDownload} className="w-full font-bold shadow-md">
                    <Download className="h-4 w-4 mr-2" /> Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <SEOContentSection 
            description={seoDescription}
            features={seoFeatures}
            howToSteps={seoSteps}
            faqs={seoFaqs}
            relatedTools={relatedTools}
            categoryPath="/finance"
          />
        </div>
      </main>

    </div>
  );
};

export default TaxCalculatorPage;