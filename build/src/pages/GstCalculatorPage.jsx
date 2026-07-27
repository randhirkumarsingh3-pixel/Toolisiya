import React, { useState, useEffect } from 'react';
import { Calculator, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const GstCalculatorPage = () => {
  const [amount, setAmount] = useState('1000');
  const [rate, setRate] = useState('18');
  const [calculationType, setCalculationType] = useState('add');
  const [results, setResults] = useState({ netAmount: 0, gstAmount: 0, grossAmount: 0 });

  useEffect(() => {
    const amt = parseFloat(amount) || 0;
    const rt = parseFloat(rate) || 0;

    if (calculationType === 'add') {
      const gst = (amt * rt) / 100;
      setResults({
        netAmount: amt,
        gstAmount: gst,
        grossAmount: amt + gst
      });
    } else {
      const net = amt / (1 + rt / 100);
      const gst = amt - net;
      setResults({
        netAmount: net,
        gstAmount: gst,
        grossAmount: amt
      });
    }
  }, [amount, rate, calculationType]);

  const handleCopy = () => {
    const text = `Net Amount: ₹${results.netAmount.toFixed(2)}\nGST Amount: ₹${results.gstAmount.toFixed(2)}\nGross Amount: ₹${results.grossAmount.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    toast.success('Results copied to clipboard');
  };

  return (
    <ToolPageTemplate toolData={toolPageData['gst-calculator']}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-md border-border">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5 text-primary" /> Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-3">
              <Label>Calculation Type</Label>
              <RadioGroup defaultValue="add" value={calculationType} onValueChange={setCalculationType} className="flex flex-row gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="add" id="r1" />
                  <Label htmlFor="r1" className="cursor-pointer font-normal">Add GST (+)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="remove" id="r2" />
                  <Label htmlFor="r2" className="cursor-pointer font-normal">Remove GST (-)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Amount (₹)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="h-12 text-lg font-medium" />
            </div>

            <div className="space-y-3">
              <Label>GST Rate (%)</Label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {['5', '12', '18', '28'].map(r => (
                  <Button key={r} variant={rate === r ? 'default' : 'outline'} onClick={() => setRate(r)} className="font-semibold">{r}%</Button>
                ))}
              </div>
              <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="h-12 text-lg font-medium" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md bg-primary/5 border-primary/20">
          <CardHeader className="border-b border-primary/10">
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col justify-between h-[calc(100%-65px)]">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-background rounded-lg border shadow-sm">
                <span className="text-muted-foreground font-medium">Net Amount (Base)</span>
                <span className="font-semibold text-lg">₹{results.netAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-background rounded-lg border shadow-sm border-l-4 border-l-amber-500">
                <span className="text-muted-foreground font-medium flex items-center gap-1">GST Amount ({rate}%)</span>
                <span className="font-semibold text-lg text-amber-600">₹{results.gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-primary text-primary-foreground rounded-lg shadow-md mt-4">
                <span className="font-medium text-primary-foreground/90">Gross Amount (Total)</span>
                <span className="font-bold text-xl">₹{results.grossAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between mt-2 px-2 text-xs text-muted-foreground">
                <span>CGST ({(parseFloat(rate)/2).toFixed(1)}%): ₹{(results.gstAmount/2).toFixed(2)}</span>
                <span>SGST ({(parseFloat(rate)/2).toFixed(1)}%): ₹{(results.gstAmount/2).toFixed(2)}</span>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-8 bg-background shadow-sm h-12 font-bold" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-2" /> Copy Breakdown
            </Button>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default GstCalculatorPage;