import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ExtraToolTips from '@/components/ExtraToolTips.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const SIPCalculatorPage = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState('5000');
  const [returnRate, setReturnRate] = useState('12');
  const [years, setYears] = useState('10');
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalReturns, setTotalReturns] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const p = parseFloat(monthlyInvestment);
    const r = parseFloat(returnRate) / 12 / 100;
    const n = parseFloat(years) * 12;

    if (p > 0 && r > 0 && n > 0) {
      const invested = p * n;
      const maturity = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      
      setTotalInvested(invested);
      setFinalAmount(maturity);
      setTotalReturns(maturity - invested);

      // Generate chart data
      const data = [];
      for (let i = 1; i <= parseFloat(years); i++) {
        const months = i * 12;
        const currentInvested = p * months;
        const currentMaturity = p * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
        data.push({
          year: `Year ${i}`,
          Invested: Math.round(currentInvested),
          Value: Math.round(currentMaturity)
        });
      }
      setChartData(data);
    } else {
      setTotalInvested(0);
      setFinalAmount(0);
      setTotalReturns(0);
      setChartData([]);
    }
  }, [monthlyInvestment, returnRate, years]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Total Invested: ₹${totalInvested.toFixed(0)}\nEst. Returns: ₹${totalReturns.toFixed(0)}\nTotal Value: ₹${finalAmount.toFixed(0)}`);
    setCopied(true);
    toast('Result copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Helmet>
        <title>SIP Calculator – Calculate Mutual Fund Returns & Investment Growth</title>
        <meta name="description" content="Estimate your SIP returns and plan investments effectively with our SIP calculator. Track your wealth growth over time easily." />
        <meta name="keywords" content="sip calculator, mutual fund sip calculator, sip return calculator, investment calculator india, sip growth calculator, monthly investment calculator, wealth calculator india, compound interest sip calculator, sip planner, sip maturity calculator, best sip calculator india" />
      </Helmet>
      <CalculatorLayout
        title="SIP Calculator for Smart Investment Planning"
        description="Calculate the future value of your Systematic Investment Plan (SIP) investments."
        category="Finance"
        categoryPath="/finance"
        formula={["FV = P × [((1 + r)^n - 1) / r] × (1 + r)", "Where P = Monthly Investment, r = Monthly Return Rate, n = Total Months"]}
        faqs={[
          { question: "What is SIP?", answer: "SIP (Systematic Investment Plan) is a method of investing a fixed sum regularly in a mutual fund scheme." },
          { question: "Are SIP returns guaranteed?", answer: "No, mutual fund investments are subject to market risks. The return rate used here is an expected average." }
        ]}
      >
        <NavigationButtons />
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Calculate SIP Returns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Monthly Investment (₹)</Label>
                <Input type="number" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Expected Return Rate (% p.a.)</Label>
                <Input type="number" value={returnRate} onChange={(e) => setReturnRate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Time Period (Years)</Label>
                <Input type="number" value={years} onChange={(e) => setYears(e.target.value)} />
              </div>
            </div>

            <div className="bg-muted rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Invested</span>
                <span className="text-xl font-semibold">₹{totalInvested.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Est. Returns</span>
                <span className="text-xl font-semibold text-green-600">+₹{totalReturns.toFixed(0)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="text-lg font-medium">Total Value</span>
                <span className="text-2xl font-bold text-primary">₹{finalAmount.toFixed(0)}</span>
              </div>
            </div>

            {chartData.length > 0 && (
              <div className="h-[300px] w-full mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="year" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`} />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Line type="monotone" dataKey="Value" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="Invested" stroke="#9ca3af" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <Button onClick={handleCopy} className="w-full">
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />} Copy Result
            </Button>
          </CardContent>
        </Card>

        <ExtraToolTips toolName="SIP Calculator" />
      </CalculatorLayout>
    </>
  );
};

export default SIPCalculatorPage;