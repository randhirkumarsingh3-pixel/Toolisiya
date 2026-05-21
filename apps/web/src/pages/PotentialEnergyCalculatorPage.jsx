import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import FormulaDisplay from '@/components/FormulaDisplay.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const PotentialEnergyCalculatorPage = () => {
  const [mass, setMass] = useState('');
  const [gravity, setGravity] = useState('9.8');
  const [height, setHeight] = useState('');
  const [energy, setEnergy] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const m = parseFloat(mass);
    const g = parseFloat(gravity);
    const h = parseFloat(height);
    if (!isNaN(m) && !isNaN(g) && !isNaN(h)) {
      setEnergy(m * g * h);
    } else {
      setEnergy(0);
    }
  }, [mass, gravity, height]);

  const handleCopy = () => {
    navigator.clipboard.writeText(energy.toFixed(4));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setMass('');
    setGravity('9.8');
    setHeight('');
  };

  return (
    <CalculatorLayout
      title="Potential Energy Calculator"
      description="Calculate the gravitational potential energy of an object."
      category="Science"
      categoryPath="/science"
      example={{
        description: "Calculate the potential energy of a 2 kg object at a height of 5 meters on Earth.",
        steps: [
          { text: "Mass (m) = 2 kg" },
          { text: "Gravity (g) = 9.8 m/s²" },
          { text: "Height (h) = 5 m" },
          { text: "PE = 2 × 9.8 × 5" },
          { text: "Potential Energy = 98 J", highlight: true }
        ]
      }}
      faqs={[
        { question: "What is potential energy?", answer: "Potential energy is the energy held by an object because of its position relative to other objects, stresses within itself, its electric charge, or other factors." },
        { question: "What is standard gravity?", answer: "Standard gravity on Earth is approximately 9.8 m/s². You can change this value if calculating for other planets." }
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
              <Input type="number" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="e.g., 2" min="0" step="any" />
            </div>
            <div className="space-y-2">
              <Label>Gravity (m/s²)</Label>
              <Input type="number" value={gravity} onChange={(e) => setGravity(e.target.value)} placeholder="e.g., 9.8" step="any" />
            </div>
            <div className="space-y-2">
              <Label>Height (meters)</Label>
              <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g., 5" step="any" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 flex flex-col items-center justify-center h-full min-h-[200px]">
            <p className="text-muted-foreground mb-2 font-medium">Potential Energy (PE)</p>
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold text-primary">
                {energy.toFixed(4)}
              </span>
              <Button variant="outline" size="icon" onClick={handleCopy} disabled={!energy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <span className="mt-2 text-sm text-muted-foreground">Joules (J)</span>
          </CardContent>
        </Card>
      </div>

      <FormulaDisplay formula="PE = m \times g \times h" description="PE = Potential Energy, m = mass, g = acceleration due to gravity, h = height" />
    </CalculatorLayout>
  );
};

export default PotentialEnergyCalculatorPage;