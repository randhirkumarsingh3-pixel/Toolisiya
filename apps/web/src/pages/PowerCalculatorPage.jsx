import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import FormulaDisplay from '@/components/FormulaDisplay.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const PowerCalculatorPage = () => {
  const [work, setWork] = useState('');
  const [time, setTime] = useState('');
  const [power, setPower] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const w = parseFloat(work);
    const t = parseFloat(time);
    if (!isNaN(w) && !isNaN(t) && t > 0) {
      setPower(w / t);
    } else {
      setPower(0);
    }
  }, [work, time]);

  const handleCopy = () => {
    navigator.clipboard.writeText(power.toFixed(4));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setWork('');
    setTime('');
  };

  return (
    <CalculatorLayout
      title="Power Calculator"
      description="Calculate the power output based on work done over time."
      category="Science"
      categoryPath="/science"
      example={{
        description: "Calculate the power if 100 Joules of work is done in 5 seconds.",
        steps: [
          { text: "Work (W) = 100 J" },
          { text: "Time (t) = 5 s" },
          { text: "P = 100 / 5" },
          { text: "Power = 20 W", highlight: true }
        ]
      }}
      faqs={[
        { question: "What is power?", answer: "Power is the rate at which work is done or energy is transferred over time." },
        { question: "What is a Watt (W)?", answer: "A Watt is the standard unit of power, equivalent to one Joule per second (1 W = 1 J/s)." }
      ]}
    >
      <NavigationButtons />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-base">Input Values</Label>
              <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-muted-foreground">
                <RefreshCw className="h-4 w-4 mr-2" /> Clear
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Work (Joules)</Label>
              <Input type="number" value={work} onChange={(e) => setWork(e.target.value)} placeholder="e.g., 100" step="any" />
            </div>
            <div className="space-y-2">
              <Label>Time (seconds)</Label>
              <Input type="number" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g., 5" min="0.000001" step="any" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 flex flex-col items-center justify-center h-full min-h-[200px]">
            <p className="text-muted-foreground mb-2 font-medium">Power (P)</p>
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold text-primary">
                {power.toFixed(4)}
              </span>
              <Button variant="outline" size="icon" onClick={handleCopy} disabled={!power}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <span className="mt-2 text-sm text-muted-foreground">Watts (W)</span>
          </CardContent>
        </Card>
      </div>

      <FormulaDisplay formula="P = \frac{W}{t}" description="P = Power, W = Work, t = time" />
    </CalculatorLayout>
  );
};

export default PowerCalculatorPage;