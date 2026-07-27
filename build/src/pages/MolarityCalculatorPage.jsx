import React, { useState, useEffect } from 'react';
import { Beaker } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import SEOHead from '@/components/SEOHead.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';
import SEOContentDisplay from '@/components/SEOContentDisplay.jsx';

const MolarityCalculatorPage = () => {
  const [mass, setMass] = useState('');
  const [volume, setVolume] = useState('');
  const [molarMass, setMolarMass] = useState('');
  const [volumeUnit, setVolumeUnit] = useState('L');
  const [molarity, setMolarity] = useState(null);

  useEffect(() => {
    if (mass && volume && molarMass) {
      const m = parseFloat(mass);
      let v = parseFloat(volume);
      const mm = parseFloat(molarMass);

      if (v <= 0 || mm <= 0) {
        setMolarity(null);
        return;
      }

      if (volumeUnit === 'mL') v = v / 1000;
      
      const moles = m / mm;
      const calcMolarity = moles / v;
      setMolarity(calcMolarity);
    } else {
      setMolarity(null);
    }
  }, [mass, volume, molarMass, volumeUnit]);

  const seoDescription = "Calculate the molarity of a solution from mass, volume, and molar mass. Free online chemistry calculator for students and scientists.";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead defaultTitle="Molarity Calculator | Toolisiya" defaultDescription={seoDescription} />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <NavigationButtons />
          <BreadcrumbNavigation customTitle="Molarity Calculator" />
          
          <div className="mb-8 mt-4 text-center animate-slide-up">
            <Beaker className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Molarity Calculator</h1>
            <p className="text-muted-foreground">Calculate the concentration of a solution in mol/L (Molarity).</p>
          </div>

          <Card className="shadow-lg border-border mb-12 max-w-2xl mx-auto">
            <CardHeader className="bg-muted/30 border-b pb-6">
              <CardTitle>Solution Parameters</CardTitle>
              <CardDescription>Enter values to calculate concentration automatically.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <Label className="font-semibold text-base">Mass of Solute (g)</Label>
                <Input type="number" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="e.g. 58.44" className="h-12 text-lg" />
              </div>
              <div className="space-y-3">
                <Label className="font-semibold text-base">Molar Mass (g/mol)</Label>
                <Input type="number" value={molarMass} onChange={(e) => setMolarMass(e.target.value)} placeholder="e.g. 58.44 (for NaCl)" className="h-12 text-lg" />
              </div>
              <div className="space-y-3">
                <Label className="font-semibold text-base">Volume of Solution</Label>
                <div className="flex gap-4">
                  <Input type="number" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="e.g. 1" className="flex-1 h-12 text-lg" />
                  <Select value={volumeUnit} onValueChange={setVolumeUnit}>
                    <SelectTrigger className="w-[120px] h-12 font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Liters (L)</SelectItem>
                      <SelectItem value="mL">Milliliters (mL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-6 border-t mt-4">
                <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl flex flex-col items-center justify-center min-h-[120px] shadow-sm">
                  <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Molarity (M)</div>
                  <div className="text-4xl font-extrabold text-primary">
                    {molarity !== null ? `${molarity.toFixed(4)} mol/L` : <span className="opacity-30">0.0000 mol/L</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12">
            <SEOContentDisplay toolName="molarity-calculator" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MolarityCalculatorPage;