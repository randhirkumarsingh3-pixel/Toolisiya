import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import FormulaDisplay from '@/components/FormulaDisplay.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const PressureCalculatorPage = () => {
  const [force, setForce] = useState('');
  const [area, setArea] = useState('');
  const [pressure, setPressure] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const f = parseFloat(force);
    const a = parseFloat(area);
    if (!isNaN(f) && !isNaN(a) && a > 0) {
      setPressure(f / a);
    } else {
      setPressure(0);
    }
  }, [force, area]);

  const handleCopy = () => {
    navigator.clipboard.writeText(pressure.toFixed(4));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setForce('');
    setArea('');
  };

  return (
    <CalculatorLayout
      title="Pressure Calculator"
      description="Calculate the pressure exerted by a force over a specific area."
      category="Science"
      categoryPath="/science"
      example={{
        description: "Calculate the pressure when a 100 N force is applied over an area of 2 m².",
        steps: [
          { text: "Force (F) = 100 N" },
          { text: "Area (A) = 2 m²" },
          { text: "P = 100 / 2" },
          { text: "Pressure = 50 Pa", highlight: true }
        ]
      }}
      faqs={[
        { question: "What is pressure?", answer: "Pressure is the force applied perpendicular to the surface of an object per unit area over which that force is distributed." },
        { question: "What is a Pascal (Pa)?", answer: "A Pascal is the SI derived unit of pressure, defined as one Newton per square meter (1 Pa = 1 N/m²)." }
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
              <Label>Force (Newtons)</Label>
              <Input type="number" value={force} onChange={(e) => setForce(e.target.value)} placeholder="e.g., 100" step="any" />
            </div>
            <div className="space-y-2">
              <Label>Area (m²)</Label>
              <Input type="number" value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g., 2" min="0.000001" step="any" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 flex flex-col items-center justify-center h-full min-h-[200px]">
            <p className="text-muted-foreground mb-2 font-medium">Pressure (P)</p>
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold text-primary">
                {pressure.toFixed(4)}
              </span>
              <Button variant="outline" size="icon" onClick={handleCopy} disabled={!pressure}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <span className="mt-2 text-sm text-muted-foreground">Pascals (Pa)</span>
          </CardContent>
        </Card>
      </div>

      <FormulaDisplay formula="P = \frac{F}{A}" description="P = Pressure, F = Force, A = Area" />
    </CalculatorLayout>
  );
};

export default PressureCalculatorPage;