import React, { useState, useMemo } from 'react';
import { Calculator, Download, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const EmiCalculatorPage = () => {
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(10);

  const results = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseFloat(tenure) * 12;

    if (!p || !r || !n) return { emi: 0, totalInterest: 0, totalAmount: 0 };

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - p;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount)
    };
  }, [principal, rate, tenure]);

  const handleDownload = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text('EMI Calculation Report', 20, 20);
      doc.setFontSize(12);
      doc.text(`Loan Amount: ₹${principal.toLocaleString()}`, 20, 40);
      doc.text(`Interest Rate: ${rate}% p.a.`, 20, 50);
      doc.text(`Tenure: ${tenure} Years`, 20, 60);
      doc.text(`Monthly EMI: ₹${results.emi.toLocaleString()}`, 20, 80);
      doc.text(`Total Interest: ₹${results.totalInterest.toLocaleString()}`, 20, 90);
      doc.text(`Total Amount Payable: ₹${results.totalAmount.toLocaleString()}`, 20, 100);
      doc.save('EMI_Report.pdf');
      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  const handleCopy = () => {
    const text = `EMI: ₹${results.emi}\nTotal Interest: ₹${results.totalInterest}\nTotal Amount: ₹${results.totalAmount}`;
    navigator.clipboard.writeText(text);
    toast.success('Results copied to clipboard');
  };

  return (
    <ToolPageTemplate toolData={toolPageData['emi-calculator']}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card className="shadow-lg border-border">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5 text-primary" /> Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <Label className="text-base">Loan Amount (₹)</Label>
                <Input 
                  type="number" 
                  value={principal} 
                  onChange={(e) => setPrincipal(Number(e.target.value))} 
                  className="w-1/3 text-right font-medium"
                />
              </div>
              <Slider 
                value={[principal]} 
                min={100000} max={50000000} step={100000}
                onValueChange={(val) => setPrincipal(val[0])} 
                className="py-2"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <Label className="text-base">Interest Rate (% p.a.)</Label>
                <Input 
                  type="number" 
                  value={rate} 
                  onChange={(e) => setRate(Number(e.target.value))} 
                  className="w-1/3 text-right font-medium"
                  step={0.1}
                />
              </div>
              <Slider 
                value={[rate]} 
                min={1} max={30} step={0.1}
                onValueChange={(val) => setRate(val[0])} 
                className="py-2"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <Label className="text-base">Loan Tenure (Years)</Label>
                <Input 
                  type="number" 
                  value={tenure} 
                  onChange={(e) => setTenure(Number(e.target.value))} 
                  className="w-1/3 text-right font-medium"
                />
              </div>
              <Slider 
                value={[tenure]} 
                min={1} max={30} step={1}
                onValueChange={(val) => setTenure(val[0])} 
                className="py-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-primary/5 border-primary/20">
          <CardHeader className="border-b border-primary/10">
            <CardTitle>Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            <div className="text-center p-8 bg-background rounded-xl border border-primary/10 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Monthly EMI</p>
              <p className="text-5xl font-extrabold text-primary tracking-tight">₹{results.emi.toLocaleString()}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-background rounded-lg border shadow-sm">
                <span className="text-muted-foreground font-medium">Principal Amount</span>
                <span className="font-semibold text-lg">₹{principal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-background rounded-lg border shadow-sm border-l-4 border-l-emerald-500">
                <span className="text-muted-foreground font-medium">Total Interest</span>
                <span className="font-semibold text-lg text-emerald-600">₹{results.totalInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-primary text-primary-foreground rounded-lg shadow-sm">
                <span className="font-medium text-primary-foreground/90">Total Amount Payable</span>
                <span className="font-bold text-xl">₹{results.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-primary/10">
              <Button className="flex-1 h-12 shadow-sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" /> PDF Report
              </Button>
              <Button variant="outline" className="flex-1 h-12 bg-background hover:bg-muted shadow-sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" /> Copy Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default EmiCalculatorPage;