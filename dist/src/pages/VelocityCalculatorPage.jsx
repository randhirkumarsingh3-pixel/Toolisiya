import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import FormulaDisplay from '@/components/FormulaDisplay.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const VelocityCalculatorPage = () => {
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [velocity, setVelocity] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const d = parseFloat(distance);
    const t = parseFloat(time);
    if (!isNaN(d) && !isNaN(t) && t > 0) {
      setVelocity(d / t);
    } else {
      setVelocity(0);
    }
  }, [distance, time]);

  const handleCopy = () => {
    navigator.clipboard.writeText(velocity.toFixed(4));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setDistance('');
    setTime('');
  };

  return (
    <CalculatorLayout
      title="Velocity Calculator"
      description="Calculate the velocity of an object based on distance traveled and time taken."
      category="Science"
      categoryPath="/science"
      example={{
        description: "Calculate the velocity of a car that travels 100 meters in 10 seconds.",
        steps: [
          { text: "Distance (d) = 100 m" },
          { text: "Time (t) = 10 s" },
          { text: "v = 100 / 10" },
          { text: "Velocity = 10 m/s", highlight: true }
        ]
      }}
      faqs={[
        { question: "What is velocity?", answer: "Velocity is the rate of change of an object's position with respect to a frame of reference, and is a function of time." },
        { question: "What is the difference between speed and velocity?", answer: "Speed is a scalar quantity (magnitude only), while velocity is a vector quantity (magnitude and direction)." }
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
              <Label>Distance (meters)</Label>
              <Input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="e.g., 100" min="0" step="any" />
            </div>
            <div className="space-y-2">
              <Label>Time (seconds)</Label>
              <Input type="number" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g., 10" min="0.000001" step="any" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 flex flex-col items-center justify-center h-full min-h-[200px]">
            <p className="text-muted-foreground mb-2 font-medium">Velocity (v)</p>
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold text-primary">
                {velocity.toFixed(4)}
              </span>
              <Button variant="outline" size="icon" onClick={handleCopy} disabled={!velocity}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <span className="mt-2 text-sm text-muted-foreground">m/s</span>
          </CardContent>
        </Card>
      </div>

      <FormulaDisplay formula="v = \frac{d}{t}" description="v = velocity, d = distance, t = time" />
    </CalculatorLayout>
  );
};

export default VelocityCalculatorPage;