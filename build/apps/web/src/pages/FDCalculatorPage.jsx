import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, Building2 } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useSEOData } from '@/hooks/useSEOData.js';
import { toast } from 'sonner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import CurrencyConverter from '@/components/CurrencyConverter.jsx';
import CalculationHistory from '@/components/CalculationHistory.jsx';
import ToolContentDisplay from '@/components/ToolContentDisplay.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';
import { calculateFDMaturity } from '@/utils/financeCalculations.js';
import { exportTableReportPDF } from '@/utils/pdfExport.js';
import { exportChartAsImage } from '@/utils/chartExport.js';

const CURRENCY_SYMBOLS = { USD: '$', INR: '₹', EUR: '€', GBP: '£' };

const fdContentData = {
  title: "Complete Guide to Fixed Deposits (FDs) & Safe Savings",
  introduction: "A Fixed Deposit (FD) calculator is a powerful tool that helps you calculate how much interest you will earn on a lump-sum deposit over a specified period. Fixed deposits are popular investment instruments offered by banks and financial institutions, providing a guaranteed rate of return and low risk compared to equity investments.",
  howToUse: [
    {
      title: "Enter Deposit Amount",
      description: "Specify the initial lump-sum amount of money you want to invest in the fixed deposit."
    },
    {
      title: "Set Interest Rate",
      description: "Enter the annual interest rate (p.a.) offered by the bank or financial institution."
    },
    {
      title: "Choose Tenure",
      description: "Provide the duration of the deposit in years or months."
    },
    {
      title: "Select Compounding Frequency",
      description: "Choose how often interest compounds—monthly, quarterly, half-yearly, or yearly. Banks typically compound quarterly."
    }
  ],
  realWorldExamples: [
    {
      title: "Scenario A: Quarterly Compounding Fixed Deposit",
      scenario: "Depositing $10,000 for 5 years at an annual interest rate of 6.5%, compounded quarterly (standard banking practice).",
      outcome: "After 5 years, your maturity amount will be $13,804.20. The total interest earned is $3,804.20, without any market risk exposure."
    },
    {
      title: "Scenario B: Senior Citizen Special Rate",
      scenario: "A senior citizen investing a lump sum of $50,000 for 3 years at a promotional rate of 7.25% p.a., compounded quarterly.",
      outcome: "At maturity, the deposit grows to $61,986.72, earning a guaranteed interest of $11,986.72."
    }
  ],
  tipsAndTricks: [
    {
      title: "Leverage FD Laddering",
      description: "Instead of locking all your funds in a single long-term FD, split your investment into multiple FDs maturing at different intervals (e.g., 1, 2, 3 years). This provides periodic liquidity and protects against interest rate fluctuations."
    },
    {
      title: "Compare Senior Citizen Rates",
      description: "Most banks offer an additional interest rate benefit (typically 0.50% to 0.75% higher) for senior citizens. Always open deposits under senior citizen profiles when applicable."
    },
    {
      title: "Mind the Tax Implications",
      description: "FD interest is taxable according to your income tax slab. Consider Tax-Saving Fixed Deposits or tax-efficient alternatives if your interest income exceeds tax-free limits."
    }
  ],
  commonMistakes: [
    {
      title: "Premature Withdrawal Penalties",
      description: "Withdrawing your fixed deposit before the maturity date usually incurs a penalty (e.g., 0.5% to 1.0% reduction in interest rate), which decreases your total returns.",
      prevention: "Only lock up funds you are certain you won't need immediately, or keep a portion in liquid/savings accounts for emergencies."
    },
    {
      title: "Ignoring Compounding Frequency",
      description: "Assuming all FDs calculate interest the same way can lead to mismatched expectations. Simple interest FDs pay less than compounded FDs.",
      prevention: "Confirm if the bank uses quarterly compounding (cumulative FD) or simple interest (non-cumulative payout FD)."
    }
  ],
  faqs: [
    {
      question: "What is a Fixed Deposit (FD)?",
      answer: "A Fixed Deposit is a financial instrument provided by banks or non-banking financial companies (NBFCs) which provides investors a higher rate of interest than a regular savings account until a given maturity date."
    },
    {
      question: "How does the compounding frequency affect FD returns?",
      answer: "The more frequently interest is compounded, the higher your total return. For example, monthly compounding earns slightly more interest than quarterly compounding, which earns more than yearly compounding."
    },
    {
      question: "Are fixed deposits safe?",
      answer: "Yes, fixed deposits are considered one of the safest investment options. In many countries, deposits up to a certain limit (e.g., $250,000 in the US, ₹5 Lakhs in India) are insured by government bodies."
    }
  ],
  relatedTools: [
    { title: "Investment Calculator", url: "/finance/investment-calculator" },
    { title: "Loan Calculator", url: "/finance/loan-calculator" },
    { title: "Advanced Scientific Calculator", url: "/finance/advanced-scientific-calculator" }
  ]
};

const FDCalculatorPage = () => {
  const { seoData } = useSEOData('fd-calculator');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const [principal, setPrincipal] = useState('100000');
  const [rate, setRate] = useState('7.5');
  const [years, setYears] = useState('5');
  const [frequency, setFrequency] = useState('4');
  const [currency, setCurrency] = useState('INR');
  
  const [results, setResults] = useState({ maturity: 0, totalInterest: 0, schedule: [] });
  const [copied, setCopied] = useState(false);
  const chartRef = useRef(null);

  const calculate = useCallback(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    const f = parseFloat(frequency);
    
    if (p > 0 && r > 0 && y > 0) {
      setResults(calculateFDMaturity(p, r, y, f));
    } else {
      setResults({ maturity: 0, totalInterest: 0, schedule: [] });
    }
  }, [principal, rate, years, frequency]);

  useEffect(() => calculate(), [calculate]);

  const saveHistory = () => {
    if (!parseFloat(principal)) return;
    const history = JSON.parse(localStorage.getItem('fdHistory') || '[]');
    const newItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      summary: `FD: ${principal} ${currency} for ${years}Y at ${rate}%`,
      inputs: { principal, rate, years, frequency, currency }
    };
    localStorage.setItem('fdHistory', JSON.stringify([newItem, ...history].slice(0, 10)));
    window.dispatchEvent(new Event('fdHistory-updated'));
  };

  const handleCopy = () => {
    const sym = CURRENCY_SYMBOLS[currency];
    navigator.clipboard.writeText(`FD Principal: ${sym}${principal}\nMaturity: ${sym}${results.maturity.toFixed(2)}\nInterest Earned: ${sym}${results.totalInterest.toFixed(2)}`);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const sym = CURRENCY_SYMBOLS[currency];
    const tableData = results.schedule.map(r => [
      r.year, 
      `${sym}${r.investment.toLocaleString()}`, 
      `${sym}${r.interest.toLocaleString(undefined, {maximumFractionDigits:0})}`, 
      `${sym}${r.totalAmount.toLocaleString(undefined, {maximumFractionDigits:0})}`
    ]);
    exportTableReportPDF(
      'Fixed Deposit Maturity Report',
      {
        'Deposit Amount': `${sym}${principal}`,
        'Interest Rate': `${rate}% p.a.`,
        'Tenure': `${years} Years`,
        'Maturity Value': `${sym}${results.maturity.toLocaleString(undefined, {maximumFractionDigits:0})}`
      },
      ['Year', 'Principal', 'Cumulative Interest', 'Total Value'],
      tableData
    );
    saveHistory();
  };

  const handleDownloadChart = () => exportChartAsImage(chartRef, 'fd_growth_chart');
  const sym = CURRENCY_SYMBOLS[currency];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{seoData?.meta_title || 'FD Calculator – Calculate Fixed Deposit Interest & Maturity Amount'}</title>
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
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <NavigationButtons />
          <BreadcrumbNavigation customTitle="FD Calculator" />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 mt-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{seoData?.h1_tag || 'FD Calculator for Secure Investment Planning'}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">Plan your savings by calculating exact maturity amounts and interest earned on your fixed deposits.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <Card className="lg:col-span-4 shadow-lg border-none">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /> FD Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <Label>Total Deposit Amount</Label>
                  <div className="flex gap-2">
                    <CurrencyConverter value={currency} onChange={setCurrency} />
                    <Input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="flex-1 h-12 text-lg" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Interest Rate (% p.a.)</Label>
                  <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="h-12 text-lg" />
                </div>
                <div className="space-y-3">
                  <Label>Time Period (Years)</Label>
                  <Input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="h-12 text-lg" />
                </div>
                <div className="space-y-3">
                  <Label>Compounding Frequency</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger className="h-12 text-lg"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">Monthly</SelectItem>
                      <SelectItem value="4">Quarterly</SelectItem>
                      <SelectItem value="2">Half-Yearly</SelectItem>
                      <SelectItem value="1">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-8 shadow-lg border-none bg-primary/5">
              <CardContent className="p-6 md:p-8 flex flex-col h-full">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 bg-background rounded-xl border shadow-sm">
                    <p className="text-sm text-muted-foreground mb-1">Principal Amount</p>
                    <p className="text-2xl font-bold">{sym}{(parseFloat(principal)||0).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-background rounded-xl border shadow-sm">
                    <p className="text-sm text-muted-foreground mb-1">Total Interest</p>
                    <p className="text-2xl font-bold text-emerald-600">+{sym}{results.totalInterest.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
                  </div>
                  <div className="p-4 bg-primary text-primary-foreground rounded-xl shadow-md">
                    <p className="text-sm text-primary-foreground/80 mb-1">Maturity Amount</p>
                    <p className="text-3xl font-extrabold">{sym}{results.maturity.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
                  </div>
                </div>

                <div className="flex-1 min-h-[300px] bg-background p-4 rounded-xl border" ref={chartRef}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={results.schedule} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(val) => `${sym}${val >= 1000 ? (val/1000).toFixed(0)+'k' : val}`} />
                      <Tooltip formatter={(value) => `${sym}${value.toLocaleString(undefined, {maximumFractionDigits:0})}`} />
                      <Area type="monotone" dataKey="totalAmount" stroke="#2563eb" fillOpacity={1} fill="url(#colorValue)" name="Maturity Value" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-primary/10">
                  <Button variant="outline" onClick={handleCopy} className="bg-background hover:bg-muted"><Copy className="h-4 w-4 mr-2" /> Copy</Button>
                  <Button variant="outline" onClick={handleDownloadChart} className="bg-background hover:bg-muted"><Download className="h-4 w-4 mr-2" /> Save Chart</Button>
                  <Button onClick={handleDownloadPDF}><Download className="h-4 w-4 mr-2" /> PDF Report</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {results.schedule.length > 0 && (
            <Card className="shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle>Maturity Schedule</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">Year</TableHead>
                        <TableHead>Principal Deposit</TableHead>
                        <TableHead>Cumulative Interest</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.schedule.map((row) => (
                        <TableRow key={row.year}>
                          <TableCell className="font-medium">{row.year}</TableCell>
                          <TableCell>{sym}{row.investment.toLocaleString()}</TableCell>
                          <TableCell className="text-emerald-600">+{sym}{row.interest.toLocaleString(undefined, {maximumFractionDigits:0})}</TableCell>
                          <TableCell className="text-right font-bold">{sym}{row.totalAmount.toLocaleString(undefined, {maximumFractionDigits:0})}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          <CalculationHistory 
            storageKey="fdHistory" 
            onLoadHistory={(item) => {
              setPrincipal(item.inputs.principal);
              setRate(item.inputs.rate);
              setYears(item.inputs.years);
              setFrequency(item.inputs.frequency);
              setCurrency(item.inputs.currency);
              toast.success('Calculation loaded');
            }} 
          />
          <ToolContentDisplay content={fdContentData} />
        </div>
      </main>
    </div>
  );
};

export default FDCalculatorPage;