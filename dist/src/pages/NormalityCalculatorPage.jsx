import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import FormulaDisplay from '@/components/FormulaDisplay.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';
import SEOContentDisplay from '@/components/SEOContentDisplay.jsx';

const NormalityCalculatorPage = () => {
  const [equivalents, setEquivalents] = useState('');
  const [volume, setVolume] = useState('');
  const [normality, setNormality] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const eq = parseFloat(equivalents);
    const v = parseFloat(volume);
    if (!isNaN(eq) && !isNaN(v) && v > 0) {
      setNormality(eq / v);
    } else {
      setNormality(0);
    }
  }, [equivalents, volume]);

  const handleCopy = () => {
    navigator.clipboard.writeText(normality.toFixed(4));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setEquivalents('');
    setVolume('');
  };

  return (
    <CalculatorLayout
      title="Normality Calculator"
      description="Calculate the normality (N) of a solution based on equivalents of solute and volume."
      category="Science"
      categoryPath="/science"
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
              <Label>Equivalents of Solute (eq)</Label>
              <Input type="number" value={equivalents} onChange={(e) => setEquivalents(e.target.value)} placeholder="e.g., 2" min="0" step="any" />
            </div>
            <div className="space-y-2">
              <Label>Volume of Solution (Liters)</Label>
              <Input type="number" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="e.g., 0.5" min="0.000001" step="any" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 flex flex-col items-center justify-center h-full min-h-[200px]">
            <p className="text-muted-foreground mb-2 font-medium">Normality (N)</p>
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold text-primary">
                {normality.toFixed(4)}
              </span>
              <Button variant="outline" size="icon" onClick={handleCopy} disabled={!normality}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <span className="mt-2 text-sm text-muted-foreground">eq/L or N</span>
          </CardContent>
        </Card>
      </div>

      <FormulaDisplay formula="N = \frac{\text{equivalents}}{\text{volume (L)}}" description="N = Normality, equivalents = gram equivalent weight of solute" />

      <div className="mt-12">
        <SEOContentDisplay toolName="normality-calculator" />
      </div>
    </CalculatorLayout>
  );
};

export default NormalityCalculatorPage;