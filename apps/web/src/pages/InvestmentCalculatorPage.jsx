import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Download, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import CurrencyConverter from '@/components/CurrencyConverter.jsx';
import CalculationHistory from '@/components/CalculationHistory.jsx';
import ToolContentDisplay from '@/components/ToolContentDisplay.jsx';
import { calculateCompoundInterest } from '@/utils/financeCalculations.js';
import { exportTableReportPDF } from '@/utils/pdfExport.js';
import { exportChartAsImage } from '@/utils/chartExport.js';
import { Helmet } from 'react-helmet';
import { useSEOData } from '@/hooks/useSEOData.js';

const CURRENCY_SYMBOLS = { USD: '$', INR: '₹', EUR: '€', GBP: '£' };

const investmentContentData = {
  title: "Complete Guide to Compound Interest & Long-term Investing",
  introduction: "An investment calculator is an essential tool designed to help you project the future value of your savings based on the power of compounding. By visualizing how consistent contributions and interest returns accumulate over years, you can make informed decisions about your financial goals, retirement planning, and wealth-building strategies.",
  howToUse: [
    {
      title: "Specify Initial Principal",
      description: "Enter the starting amount of capital you plan to invest or already have in your savings account."
    },
    {
      title: "Set Expected Annual Return",
      description: "Input the projected annual interest rate or average rate of return you anticipate from your portfolio."
    },
    {
      title: "Define Investment Period",
      description: "Enter the number of years you plan to leave the investment to grow and accumulate returns."
    },
    {
      title: "Examine Growth Projection",
      description: "Review the final maturity value, total principal, and cumulative interest earned over time in the detailed chart and table."
    }
  ],
  realWorldExamples: [
    {
      title: "Scenario A: Long-term Retirement Nest Egg",
      scenario: "Starting with a lump sum of $10,000, compounding at an average annual return of 10% (standard stock index fund historical average) for 30 years.",
      outcome: "After 30 years, your initial $10,000 will grow to approximately $174,494.02. The total interest earned is $164,494.02, representing a 17x growth of your initial principal."
    },
    {
      title: "Scenario B: Mid-term Capital Growth",
      scenario: "Setting aside $50,000 in a balanced mutual fund aiming for a conservative 7% annual return over 10 years.",
      outcome: "Your investment grows to $98,357.57. Total interest earned equals $48,357.57, nearly doubling your initial capital within a decade."
    }
  ],
  tipsAndTricks: [
    {
      title: "Start as Early as Possible",
      description: "The compounding effect accelerates dramatically in the later years. Investing a smaller amount early in life often yields far more than investing larger sums later."
    },
    {
      title: "Reinvest All Dividends & Interest",
      description: "To achieve true compound growth, make sure all distributions are automatically reinvested back into the underlying asset instead of being withdrawn."
    },
    {
      title: "Understand Risk and Return Trade-offs",
      description: "Higher returns usually come with higher market volatility. Ensure your return assumptions align with your risk tolerance and asset allocation."
    }
  ],
  commonMistakes: [
    {
      title: "Underestimating the Impact of Inflation",
      description: "Failing to account for the rising cost of living means your future nominal maturity amount will buy less than it would today.",
      prevention: "Calculate with a real rate of return adjusted for inflation (e.g., subtract 2-3% from your nominal return rate)."
    },
    {
      title: "Withdrawing Returns Prematurely",
      description: "Taking out earned interest breaks the compounding cycle, reducing the potential future size of your investment portfolio.",
      prevention: "Keep investment accounts separated from emergency funds to ensure long-term compound growth is uninterrupted."
    }
  ],
  faqs: [
    {
      question: "What is Compound Interest?",
      answer: "Compound interest is the interest earned on both the initial principal and the accumulated interest from previous periods. It enables your money to grow at an accelerating rate over time."
    },
    {
      question: "What is the Rule of 72?",
      answer: "The Rule of 72 is a quick way to estimate how long it takes to double an investment. Divide 72 by your annual interest rate. For example, at an 8% return, your money will double in about 9 years (72 / 8 = 9)."
    },
    {
      question: "Is compound interest guaranteed?",
      answer: "In fixed-income assets like Fixed Deposits or treasury bonds, compound interest is guaranteed. In market-linked assets like stocks or index funds, the rate of return varies annually, so compounding is calculated using average historical rates."
    }
  ],
  relatedTools: [
    { title: "FD Calculator", url: "/finance/fd-calculator" },
    { title: "Loan Calculator", url: "/finance/loan-calculator" },
    { title: "Advanced Scientific Calculator", url: "/finance/advanced-scientific-calculator" }
  ]
};

const InvestmentCalculatorPage = () => {
  const { seoData } = useSEOData('investment-calculator');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const [principal, setPrincipal] = useState('50000');
  const [rate, setRate] = useState('12');
  const [years, setYears] = useState('10');
  const [currency, setCurrency] = useState('INR');
  
  const [results, setResults] = useState({ maturity: 0, totalInterest: 0, schedule: [] });
  const [copied, setCopied] = useState(false);
  const chartRef = useRef(null);

  const calculate = useCallback(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    
    if (p > 0 && r > 0 && y > 0) {
      setResults(calculateCompoundInterest(p, r, y, 1));
    } else {
      setResults({ maturity: 0, totalInterest: 0, schedule: [] });
    }
  }, [principal, rate, years]);

  useEffect(() => calculate(), [calculate]);

  const saveHistory = () => {
    if (!parseFloat(principal)) return;
    const history = JSON.parse(localStorage.getItem('investHistory') || '[]');
    const newItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      summary: `Invest ${principal} ${currency} for ${years}Y at ${rate}%`,
      inputs: { principal, rate, years, currency }
    };
    localStorage.setItem('investHistory', JSON.stringify([newItem, ...history].slice(0, 10)));
    window.dispatchEvent(new Event('investHistory-updated'));
  };

  const handleCopy = () => {
    const sym = CURRENCY_SYMBOLS[currency];
    const text = `Investment: ${sym}${principal}\nRate: ${rate}%\nPeriod: ${years} Years\nTotal Return: ${sym}${results.maturity.toFixed(2)}`;
    navigator.clipboard.writeText(text);
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
      'Investment Growth Report',
      {
        'Initial Investment': `${sym}${principal}`,
        'Expected Return Rate': `${rate}% p.a.`,
        'Total Time Period': `${years} Years`,
        'Final Maturity Value': `${sym}${results.maturity.toLocaleString(undefined, {maximumFractionDigits:0})}`
      },
      ['Year', 'Principal', 'Cumulative Interest', 'Total Value'],
      tableData
    );
    saveHistory();
  };

  const handleDownloadChart = () => exportChartAsImage(chartRef, 'investment_chart');
  const sym = CURRENCY_SYMBOLS[currency];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{seoData?.meta_title || 'Investment Calculator | Toolisiya'}</title>
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
          <BreadcrumbNavigation customTitle="Investment Calculator" />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 mt-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{seoData?.h1_tag || 'Investment Growth Calculator'}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">Visualize the power of compound interest. See how your money grows over time with detailed charts and tables.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <Card className="lg:col-span-4 shadow-lg border-none">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-emerald-500" /> Parameters</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <Label>Initial Investment Amount</Label>
                  <div className="flex gap-2">
                    <CurrencyConverter value={currency} onChange={setCurrency} />
                    <Input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="flex-1 h-12 text-lg" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Expected Return Rate (% p.a.)</Label>
                  <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="h-12 text-lg" />
                </div>
                <div className="space-y-3">
                  <Label>Time Period (Years)</Label>
                  <Input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="h-12 text-lg" />
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-8 shadow-lg border-none">
              <CardContent className="p-6 md:p-8 flex flex-col h-full">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 bg-muted/30 rounded-xl border">
                    <p className="text-sm text-muted-foreground mb-1">Total Investment</p>
                    <p className="text-2xl font-bold">{sym}{(parseFloat(principal)||0).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-1">Total Interest Earned</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">+{sym}{results.totalInterest.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                    <p className="text-sm text-primary mb-1">Final Maturity Value</p>
                    <p className="text-3xl font-extrabold text-primary">{sym}{results.maturity.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
                  </div>
                </div>

                <div className="flex-1 min-h-[300px]" ref={chartRef}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.schedule} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(val) => `${sym}${val >= 1000 ? (val/1000).toFixed(0)+'k' : val}`} />
                      <Tooltip formatter={(value) => `${sym}${value.toLocaleString(undefined, {maximumFractionDigits:0})}`} labelFormatter={(label) => `Year ${label}`} />
                      <Line type="monotone" dataKey="totalAmount" stroke="#10b981" strokeWidth={3} dot={{r:4}} activeDot={{r:8}} name="Total Value" />
                      <Line type="monotone" dataKey="investment" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" name="Principal" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  <Button variant="outline" onClick={handleCopy}><Copy className="h-4 w-4 mr-2" /> Copy Results</Button>
                  <Button variant="outline" onClick={handleDownloadChart}><Download className="h-4 w-4 mr-2" /> Save Chart</Button>
                  <Button onClick={handleDownloadPDF}><Download className="h-4 w-4 mr-2" /> Export PDF</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {results.schedule.length > 0 && (
            <Card className="shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle>Year-by-Year Growth</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">Year</TableHead>
                        <TableHead>Principal</TableHead>
                        <TableHead>Cumulative Interest</TableHead>
                        <TableHead className="text-right">Total Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.schedule.map((row) => (
                        <TableRow key={row.year}>
                          <TableCell className="font-medium">{row.year}</TableCell>
                          <TableCell>{sym}{row.investment.toLocaleString()}</TableCell>
                          <TableCell className="text-emerald-600">+{sym}{row.interest.toLocaleString(undefined, {maximumFractionDigits:0})}</TableCell>
                          <TableCell className="text-right font-bold text-primary">{sym}{row.totalAmount.toLocaleString(undefined, {maximumFractionDigits:0})}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          <CalculationHistory 
            storageKey="investHistory" 
            onLoadHistory={(item) => {
              setPrincipal(item.inputs.principal);
              setRate(item.inputs.rate);
              setYears(item.inputs.years);
              setCurrency(item.inputs.currency);
              toast.success('Calculation loaded');
            }} 
          />
          <ToolContentDisplay content={investmentContentData} />
        </div>
      </main>
    </div>
  );
};

export default InvestmentCalculatorPage;