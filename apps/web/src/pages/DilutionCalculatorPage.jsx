import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import FormulaDisplay from '@/components/FormulaDisplay.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const DilutionCalculatorPage = () => {
  const [m1, setM1] = useState('');
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('');
  const [m2, setM2] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const conc1 = parseFloat(m1);
    const vol1 = parseFloat(v1);
    const vol2 = parseFloat(v2);
    if (!isNaN(conc1) && !isNaN(vol1) && !isNaN(vol2) && vol2 > 0) {
      setM2((conc1 * vol1) / vol2);
    } else {
      setM2(0);
    }
  }, [m1, v1, v2]);

  const handleCopy = () => {
    navigator.clipboard.writeText(m2.toFixed(4));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setM1('');
    setV1('');
    setV2('');
  };

  return (
    <CalculatorLayout
      title="Dilution Calculator"
      description="Calculate the final concentration of a solution after dilution."
      category="Science"
      categoryPath="/science"
      example={{
        description: "Calculate the final concentration when 100 mL of a 2 M solution is diluted to 500 mL.",
        steps: [
          { text: "Initial Concentration (M₁) = 2 M" },
          { text: "Initial Volume (V₁) = 100 mL" },
          { text: "Final Volume (V₂) = 500 mL" },
          { text: "M₂ = (2 × 100) / 500" },
          { text: "Final Concentration (M₂) = 0.4 M", highlight: true }
        ]
      }}
      faqs={[
        { question: "What is the dilution equation?", answer: "The dilution equation is M₁V₁ = M₂V₂, where M is concentration and V is volume. It states that the amount of solute remains constant during dilution." },
        { question: "Do the volume units matter?", answer: "As long as V₁ and V₂ use the same units (e.g., both in mL or both in L), the equation works perfectly." }
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
              <Label>Initial Concentration (M₁)</Label>
              <Input type="number" value={m1} onChange={(e) => setM1(e.target.value)} placeholder="e.g., 2" min="0" step="any" />
            </div>
            <div className="space-y-2">
              <Label>Initial Volume (V₁) in mL</Label>
              <Input type="number" value={v1} onChange={(e) => setV1(e.target.value)} placeholder="e.g., 100" min="0" step="any" />
            </div>
            <div className="space-y-2">
              <Label>Final Volume (V₂) in mL</Label>
              <Input type="number" value={v2} onChange={(e) => setV2(e.target.value)} placeholder="e.g., 500" min="0.000001" step="any" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 flex flex-col items-center justify-center h-full min-h-[200px]">
            <p className="text-muted-foreground mb-2 font-medium">Final Concentration (M₂)</p>
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold text-primary">
                {m2.toFixed(4)}
              </span>
              <Button variant="outline" size="icon" onClick={handleCopy} disabled={!m2}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <span className="mt-2 text-sm text-muted-foreground">M (Molarity)</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormulaDisplay formula="M_1V_1 = M_2V_2" description="Standard dilution equation" />
        <FormulaDisplay formula="M_2 = \frac{M_1 \times V_1}{V_2}" description="Solved for final concentration" />
      </div>
    </CalculatorLayout>
  );
};

export default DilutionCalculatorPage;