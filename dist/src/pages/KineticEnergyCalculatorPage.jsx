import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import FormulaDisplay from '@/components/FormulaDisplay.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const KineticEnergyCalculatorPage = () => {
  const [mass, setMass] = useState('');
  const [velocity, setVelocity] = useState('');
  const [energy, setEnergy] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const m = parseFloat(mass);
    const v = parseFloat(velocity);
    if (!isNaN(m) && !isNaN(v)) {
      setEnergy(0.5 * m * Math.pow(v, 2));
    } else {
      setEnergy(0);
    }
  }, [mass, velocity]);

  const handleCopy = () => {
    navigator.clipboard.writeText(energy.toFixed(4));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setMass('');
    setVelocity('');
  };

  return (
    <CalculatorLayout
      title="Kinetic Energy Calculator"
      description="Calculate the kinetic energy of an object in motion."
      category="Science"
      categoryPath="/science"
      example={{
        description: "Calculate the kinetic energy of a 2 kg object moving at 5 m/s.",
        steps: [
          { text: "Mass (m) = 2 kg" },
          { text: "Velocity (v) = 5 m/s" },
          { text: "KE = 0.5 × 2 × (5²)" },
          { text: "Kinetic Energy = 25 J", highlight: true }
        ]
      }}
      faqs={[
        { question: "What is kinetic energy?", answer: "Kinetic energy is the energy that an object possesses due to its motion." },
        { question: "Why is velocity squared?", answer: "The kinetic energy of an object increases with the square of its speed. This means if you double the speed, the kinetic energy increases by a factor of four." }
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
              <Label>Velocity (m/s)</Label>
              <Input type="number" value={velocity} onChange={(e) => setVelocity(e.target.value)} placeholder="e.g., 5" step="any" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 flex flex-col items-center justify-center h-full min-h-[200px]">
            <p className="text-muted-foreground mb-2 font-medium">Kinetic Energy (KE)</p>
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

      <FormulaDisplay formula="KE = \frac{1}{2} \times m \times v^2" description="KE = Kinetic Energy, m = mass, v = velocity" />
    </CalculatorLayout>
  );
};

export default KineticEnergyCalculatorPage;