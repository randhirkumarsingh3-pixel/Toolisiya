import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import FormulaDisplay from '@/components/FormulaDisplay.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const MolalityCalculatorPage = () => {
  const [moles, setMoles] = useState('');
  const [mass, setMass] = useState('');
  const [molality, setMolality] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const n = parseFloat(moles);
    const m = parseFloat(mass);
    if (!isNaN(n) && !isNaN(m) && m > 0) {
      setMolality(n / m);
    } else {
      setMolality(0);
    }
  }, [moles, mass]);

  const handleCopy = () => {
    navigator.clipboard.writeText(molality.toFixed(4));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setMoles('');
    setMass('');
  };

  return (
    <CalculatorLayout
      title="Molality Calculator"
      description="Calculate the molality (m) of a solution based on moles of solute and mass of solvent."
      category="Science"
      categoryPath="/science"
      example={{
        description: "Calculate the molality of a solution containing 1 mole of solute in 0.5 kg of solvent.",
        steps: [
          { text: "Moles of solute = 1 mol" },
          { text: "Mass of solvent = 0.5 kg" },
          { text: "m = 1 / 0.5" },
          { text: "Molality = 2 m", highlight: true }
        ]
      }}
      faqs={[
        { question: "What is molality?", answer: "Molality is a measure of the concentration of a solute in a solution in terms of amount of substance in a specified amount of mass of the solvent." },
        { question: "Why use molality instead of molarity?", answer: "Molality is independent of temperature and pressure because it is based on mass, whereas molarity is based on volume which can change with temperature." }
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
              <Label>Moles of Solute (mol)</Label>
              <Input type="number" value={moles} onChange={(e) => setMoles(e.target.value)} placeholder="e.g., 1" min="0" step="any" />
            </div>
            <div className="space-y-2">
              <Label>Mass of Solvent (kg)</Label>
              <Input type="number" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="e.g., 0.5" min="0.000001" step="any" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 flex flex-col items-center justify-center h-full min-h-[200px]">
            <p className="text-muted-foreground mb-2 font-medium">Molality (m)</p>
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold text-primary">
                {molality.toFixed(4)}
              </span>
              <Button variant="outline" size="icon" onClick={handleCopy} disabled={!molality}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <span className="mt-2 text-sm text-muted-foreground">mol/kg</span>
          </CardContent>
        </Card>
      </div>

      <FormulaDisplay formula="m = \frac{\text{moles}}{\text{mass of solvent (kg)}}" description="m = Molality" />
    </CalculatorLayout>
  );
};

export default MolalityCalculatorPage;