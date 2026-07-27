import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import FormulaDisplay from '@/components/FormulaDisplay.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const ForceCalculatorPage = () => {
  const [mass, setMass] = useState('');
  const [acceleration, setAcceleration] = useState('');
  const [force, setForce] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const m = parseFloat(mass);
    const a = parseFloat(acceleration);
    if (!isNaN(m) && !isNaN(a)) {
      setForce(m * a);
    } else {
      setForce(0);
    }
  }, [mass, acceleration]);

  const handleCopy = () => {
    navigator.clipboard.writeText(force.toFixed(4));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setMass('');
    setAcceleration('');
  };

  return (
    <CalculatorLayout
      title="Force Calculator"
      description="Calculate the force applied to an object using Newton's Second Law of Motion."
      category="Science"
      categoryPath="/science"
      example={{
        description: "Calculate the force required to accelerate a 5 kg mass at 2 m/s².",
        steps: [
          { text: "Mass (m) = 5 kg" },
          { text: "Acceleration (a) = 2 m/s²" },
          { text: "F = 5 × 2" },
          { text: "Force = 10 N", highlight: true }
        ]
      }}
      faqs={[
        { question: "What is Newton's Second Law?", answer: "Newton's second law states that the force acting on an object is equal to the mass of that object times its acceleration (F = ma)." },
        { question: "What is a Newton (N)?", answer: "A Newton is the standard unit of force. One Newton is the force needed to accelerate one kilogram of mass at the rate of one meter per second squared (1 N = 1 kg·m/s²)." }
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
              <Label>Mass (kg)</Label>
              <Input type="number" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="e.g., 5" min="0" step="any" />
            </div>
            <div className="space-y-2">
              <Label>Acceleration (m/s²)</Label>
              <Input type="number" value={acceleration} onChange={(e) => setAcceleration(e.target.value)} placeholder="e.g., 2" step="any" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 flex flex-col items-center justify-center h-full min-h-[200px]">
            <p className="text-muted-foreground mb-2 font-medium">Force (F)</p>
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold text-primary">
                {force.toFixed(4)}
              </span>
              <Button variant="outline" size="icon" onClick={handleCopy} disabled={!force}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <span className="mt-2 text-sm text-muted-foreground">Newtons (N)</span>
          </CardContent>
        </Card>
      </div>

      <FormulaDisplay formula="F = m \times a" description="F = Force, m = mass, a = acceleration" />
    </CalculatorLayout>
  );
};

export default ForceCalculatorPage;