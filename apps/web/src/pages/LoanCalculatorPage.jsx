import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Download, Copy, Check, Info } from 'lucide-react';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import CurrencyConverter from '@/components/CurrencyConverter.jsx';
import CalculationHistory from '@/components/CalculationHistory.jsx';
import ToolContentDisplay from '@/components/ToolContentDisplay.jsx';
import { calculateMonthlyEMI, generateAmortizationSchedule } from '@/utils/financeCalculations.js';
import { exportCalculationResultsPDF, exportAmortizationSchedulePDF } from '@/utils/pdfExport.js';
import { exportChartAsImage } from '@/utils/chartExport.js';
import { Helmet } from 'react-helmet';
import { useSEOData } from '@/hooks/useSEOData.js';

const CURRENCY_SYMBOLS = { USD: '$', INR: '₹', EUR: '€', GBP: '£' };
const CHART_COLORS = ['#2563eb', '#10b981'];

const loanContentData = {
  title: "Complete Guide to Loan EMIs & Amortization",
  introduction: "A loan calculator is a vital financial planning tool designed to help you calculate your Equated Monthly Installment (EMI) and visualize how your loan amortizes over its tenure. Whether you are planning a home purchase, buying a new car, or taking a personal loan to manage urgent expenses, knowing your monthly repayment obligation beforehand is essential for maintaining a healthy budget and preventing debt traps.",
  howToUse: [
    {
      title: "Enter Loan Principal",
      description: "Input the total amount you intend to borrow. Adjust this based on your budget and target down payment."
    },
    {
      title: "Set Interest Rate",
      description: "Specify the annual interest rate (p.a.) offered by the bank or financial institution."
    },
    {
      title: "Input Loan Tenure",
      description: "Enter the repayment period in years. A longer tenure reduces EMI but increases total interest."
    },
    {
      title: "Analyze Results",
      description: "Review your monthly EMI, total interest payable, total payment amount, and download the full amortization report."
    }
  ],
  realWorldExamples: [
    {
      title: "Scenario A: Long-Term Home Loan Plan",
      scenario: "Borrowing $250,000 for a home purchase at an interest rate of 6.5% per annum for a 30-year period.",
      outcome: "Your monthly EMI will be $1,580.17. The total interest paid over 30 years will equal $318,861.13, exceeding the initial principal borrowed."
    },
    {
      title: "Scenario B: Short-Term Auto Loan Option",
      scenario: "Buying a vehicle with a $30,000 auto loan at a rate of 5.5% for a 5-year repayment tenure.",
      outcome: "Your monthly EMI is $573.00. The total interest paid is $4,380.00, keeping borrowing costs relatively low."
    }
  ],
  tipsAndTricks: [
    {
      title: "Opt for Shorter Tenure When Possible",
      description: "Even if your monthly EMI is slightly higher, a shorter tenure can save you thousands of dollars in interest charges over the life of the loan."
    },
    {
      title: "Make Periodic Prepayments",
      description: "Paying extra towards your principal whenever you have surplus cash directly decreases the remaining balance, shortening your loan term significantly."
    },
    {
      title: "Compare APR, Not Just Base Rates",
      description: "Ensure you evaluate the Annual Percentage Rate (APR), which includes processing fees and administration charges, rather than just the nominal interest rate."
    }
  ],
  commonMistakes: [
    {
      title: "Focusing Only on Lower EMIs",
      description: "Choosing an extremely long tenure simply to get a lower monthly payment will lead to paying disproportionately high cumulative interest fees.",
      prevention: "Evaluate the total payable interest alongside the EMI to find a balanced tenure."
    },
    {
      title: "Ignoring Processing & Administrative Fees",
      description: "Many lenders charge hidden upfront processing fees that reduce the net loan amount disbursed to your account.",
      prevention: "Inquire about all fee structures beforehand and factor them into your initial loan amount calculation."
    }
  ],
  faqs: [
    {
      question: "What is an Equated Monthly Installment (EMI)?",
      answer: "An EMI is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs consist of both interest and principal components, structured so that the loan is fully paid off over a specified number of years."
    },
    {
      question: "What does the yearly amortization schedule show?",
      answer: "The amortization schedule details exactly how much principal and interest you pay each year. Initially, a larger portion of your payments goes toward interest. Over time, as the outstanding principal decreases, a larger portion goes toward paying off the actual debt."
    },
    {
      question: "Can I use this calculator for reducing balance loans?",
      answer: "Yes, this calculator is built on the standard reducing-balance EMI formula used globally by banks for home, auto, and personal loans, where interest is computed on the remaining principal balance monthly."
    }
  ],
  relatedTools: [
    { title: "FD Calculator", url: "/finance/fd-calculator" },
    { title: "Investment Calculator", url: "/finance/investment-calculator" },
    { title: "Advanced Scientific Calculator", url: "/finance/advanced-scientific-calculator" }
  ]
};

const LoanCalculatorPage = () => {
  const { seoData } = useSEOData('loan-calculator');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const [principal, setPrincipal] = useState('1000000');
  const [rate, setRate] = useState('8.5');
  const [tenure, setTenure] = useState('10');
  const [currency, setCurrency] = useState('INR');
  
  const [results, setResults] = useState({ emi: 0, totalInterest: 0, totalAmount: 0 });
  const [schedule, setSchedule] = useState([]);
  const [copied, setCopied] = useState(false);
  const chartRef = useRef(null);

  const calculate = useCallback(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(tenure);
    
    if (p > 0 && r > 0 && t > 0) {
      setResults(calculateMonthlyEMI(p, r, t));
      setSchedule(generateAmortizationSchedule(p, r, t));
    } else {
      setResults({ emi: 0, totalInterest: 0, totalAmount: 0 });
      setSchedule([]);
    }
  }, [principal, rate, tenure]);

  useEffect(() => calculate(), [calculate]);

  const saveHistory = () => {
    if (!parseFloat(principal)) return;
    const history = JSON.parse(localStorage.getItem('loanHistory') || '[]');
    const newItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      summary: `Loan of ${principal} ${currency} for ${tenure}Y at ${rate}%`,
      inputs: { principal, rate, tenure, currency }
    };
    localStorage.setItem('loanHistory', JSON.stringify([newItem, ...history].slice(0, 10)));
    window.dispatchEvent(new Event('loanHistory-updated'));
  };

  const handleCopy = () => {
    const sym = CURRENCY_SYMBOLS[currency];
    const text = `Loan Amount: ${sym}${principal}\nMonthly EMI: ${sym}${results.emi}\nTotal Interest: ${sym}${results.totalInterest}\nTotal Payable: ${sym}${results.totalAmount}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const sym = CURRENCY_SYMBOLS[currency];
    exportAmortizationSchedulePDF(schedule, {
      'Principal': `${sym}${principal}`,
      'Interest Rate': `${rate}% p.a.`,
      'Tenure': `${tenure} Years`,
      'Monthly EMI': `${sym}${results.emi}`
    });
    saveHistory();
  };

  const handleDownloadChart = () => {
    exportChartAsImage(chartRef, 'loan_breakdown_chart');
  };

  const sym = CURRENCY_SYMBOLS[currency];
  const chartData = [
    { name: 'Principal', value: parseFloat(principal) || 0 },
    { name: 'Interest', value: results.totalInterest }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{seoData?.meta_title || 'Free Loan Calculator - Calculate EMI & Interest | Toolisiya'}</title>
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
          <BreadcrumbNavigation customTitle="Loan Calculator" />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 mt-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{seoData?.h1_tag || 'Free Loan Calculator - Calculate EMI Online'}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">Plan your finances by calculating your Equated Monthly Installment (EMI) with a detailed yearly amortization schedule.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <Card className="lg:col-span-4 shadow-lg border-none">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5 text-primary" /> Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    Loan Amount
                    <TooltipProvider><UITooltip><TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent>The total amount you are borrowing</TooltipContent></UITooltip></TooltipProvider>
                  </Label>
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
                  <Label>Tenure (Years)</Label>
                  <Input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} className="h-12 text-lg" />
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-8 shadow-lg border-none bg-primary/5">
              <CardContent className="p-6 md:p-8 flex flex-col h-full justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="p-6 bg-background rounded-2xl shadow-sm border border-primary/10">
                      <p className="text-muted-foreground font-medium mb-1">Monthly EMI</p>
                      <p className="text-4xl md:text-5xl font-bold text-primary tracking-tight">{sym}{results.emi.toLocaleString()}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-primary/10 pb-3">
                        <span className="text-muted-foreground">Principal Amount</span>
                        <span className="font-semibold text-lg">{sym}{(parseFloat(principal) || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-primary/10 pb-3">
                        <span className="text-muted-foreground">Total Interest</span>
                        <span className="font-semibold text-lg text-emerald-600">{sym}{results.totalInterest.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Total Payable</span>
                        <span className="font-bold text-xl">{sym}{results.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="w-full h-[250px]" ref={chartRef}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={CHART_COLORS[index]} />)}
                          </Pie>
                          <Tooltip formatter={(value) => `${sym}${value.toLocaleString()}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex gap-4 text-sm font-medium">
                      <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary"></div> Principal</span>
                      <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Interest</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-primary/10">
                  <Button variant="outline" onClick={handleCopy} className="w-full bg-background hover:bg-muted">
                    {copied ? <Check className="h-4 w-4 mr-2 text-emerald-500" /> : <Copy className="h-4 w-4 mr-2" />} Copy Results
                  </Button>
                  <Button variant="outline" onClick={handleDownloadChart} className="w-full bg-background hover:bg-muted">
                    <Download className="h-4 w-4 mr-2" /> Save Chart
                  </Button>
                  <Button onClick={handleDownloadPDF} className="w-full">
                    <Download className="h-4 w-4 mr-2" /> Export PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {schedule.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <CardTitle>Yearly Amortization Schedule</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-24">Year</TableHead>
                          <TableHead>Principal Paid</TableHead>
                          <TableHead>Interest Paid</TableHead>
                          <TableHead>Total Payment</TableHead>
                          <TableHead className="text-right">Remaining Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {schedule.map((row) => (
                          <TableRow key={row.year}>
                            <TableCell className="font-medium">{row.year}</TableCell>
                            <TableCell>{sym}{row.principal.toLocaleString()}</TableCell>
                            <TableCell className="text-muted-foreground">{sym}{row.interest.toLocaleString()}</TableCell>
                            <TableCell>{sym}{(row.principal + row.interest).toLocaleString()}</TableCell>
                            <TableCell className="text-right font-semibold">{sym}{row.balance.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          <CalculationHistory 
            storageKey="loanHistory" 
            onLoadHistory={(item) => {
              setPrincipal(item.inputs.principal);
              setRate(item.inputs.rate);
              setTenure(item.inputs.tenure);
              setCurrency(item.inputs.currency);
              toast.success('Calculation loaded');
            }} 
          />

          <ToolContentDisplay content={loanContentData} />
        </div>
      </main>
    </div>
  );
};

export default LoanCalculatorPage;