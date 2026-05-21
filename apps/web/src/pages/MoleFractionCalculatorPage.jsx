import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import FormulaDisplay from '@/components/FormulaDisplay.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const MoleFractionCalculatorPage = () => {
  const [molesA, setMolesA] = useState('');
  const [molesB, setMolesB] = useState('');
  const [fractionA, setFractionA] = useState(0);
  const [fractionB, setFractionB] = useState(0);
  const [copiedA, setCopiedA] = useState(false);
  const [copiedB, setCopiedB] = useState(false);

  useEffect(() => {
    const nA = parseFloat(molesA);
    const nB = parseFloat(molesB);
    const total = nA + nB;
    
    if (!isNaN(nA) && !isNaN(nB) && total > 0) {
      setFractionA(nA / total);
      setFractionB(nB / total);
    } else {
      setFractionA(0);
      setFractionB(0);
    }
  }, [molesA, molesB]);

  const handleCopy = (value, setter) => {
    navigator.clipboard.writeText(value.toFixed(4));
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const handleClear = () => {
    setMolesA('');
    setMolesB('');
  };

  return (
    <CalculatorLayout
      title="Mole Fraction Calculator"
      description="Calculate the mole fraction of two components in a mixture."
      category="Science"
      categoryPath="/science"
      example={{
        description: "Calculate the mole fractions in a mixture of 2 moles of component A and 3 moles of component B.",
        steps: [
          { text: "Moles A (n_A) = 2" },
          { text: "Moles B (n_B) = 3" },
          { text: "Total Moles = 2 + 3 = 5" },
          { text: "χ_A = 2 / 5 = 0.4", highlight: true },
          { text: "χ_B = 3 / 5 = 0.6", highlight: true }
        ]
      }}
      faqs={[
        { question: "What is mole fraction?", answer: "Mole fraction is the ratio of the number of moles of one component to the total number of moles of all components in the mixture." },
        { question: "What is the sum of all mole fractions?", answer: "The sum of the mole fractions of all components in a mixture always equals exactly 1." }
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
              <Label>Moles of Component A (n_A)</Label>
              <Input type="number" value={molesA} onChange={(e) => setMolesA(e.target.value)} placeholder="e.g., 2" min="0" step="any" />
            </div>
            <div className="space-y-2">
              <Label>Moles of Component B (n_B)</Label>
              <Input type="number" value={molesB} onChange={(e) => setMolesB(e.target.value)} placeholder="e.g., 3" min="0" step="any" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 flex flex-col items-center justify-center">
              <p className="text-muted-foreground mb-2 font-medium">Mole Fraction of A (χ_A)</p>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-primary">
                  {fractionA.toFixed(4)}
                </span>
                <Button variant="outline" size="icon" onClick={() => handleCopy(fractionA, setCopiedA)} disabled={!fractionA}>
                  {copiedA ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/5 border-secondary/20">
            <CardContent className="pt-6 flex flex-col items-center justify-center">
              <p className="text-muted-foreground mb-2 font-medium">Mole Fraction of B (χ_B)</p>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-secondary-foreground">
                  {fractionB.toFixed(4)}
                </span>
                <Button variant="outline" size="icon" onClick={() => handleCopy(fractionB, setCopiedB)} disabled={!fractionB}>
                  {copiedB ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <FormulaDisplay formula="\chi_A = \frac{n_A}{n_A + n_B}" description="Formula for mole fraction of component A" />
    </CalculatorLayout>
  );
};

export default MoleFractionCalculatorPage;