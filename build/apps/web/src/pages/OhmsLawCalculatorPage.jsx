import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import FormulaDisplay from '@/components/FormulaDisplay.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const OhmsLawCalculatorPage = () => {
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [resistance, setResistance] = useState('');
  const [lastCalculated, setLastCalculated] = useState(null);

  const calculate = () => {
    const v = parseFloat(voltage);
    const i = parseFloat(current);
    const r = parseFloat(resistance);

    if (!isNaN(i) && !isNaN(r) && isNaN(v)) {
      setVoltage((i * r).toFixed(4));
      setLastCalculated('V');
    } else if (!isNaN(v) && !isNaN(r) && isNaN(i)) {
      setCurrent((v / r).toFixed(4));
      setLastCalculated('I');
    } else if (!isNaN(v) && !isNaN(i) && isNaN(r)) {
      setResistance((v / i).toFixed(4));
      setLastCalculated('R');
    }
  };

  useEffect(() => {
    calculate();
  }, [voltage, current, resistance]);

  const handleClear = () => {
    setVoltage('');
    setCurrent('');
    setResistance('');
    setLastCalculated(null);
  };

  return (
    <CalculatorLayout
      title="Ohm's Law Calculator"
      description="Calculate Voltage (V), Current (I), or Resistance (R). Enter any two values to calculate the third."
      category="Science"
      categoryPath="/science"
      faqs={[
        { question: "What is Ohm's Law?", answer: "Ohm's law states that the current through a conductor between two points is directly proportional to the voltage across the two points." },
        { question: "What are the units?", answer: "Voltage is measured in Volts (V), Current in Amperes (A), and Resistance in Ohms (Ω)." }
      ]}
    >
      <NavigationButtons />
      <Card className="mb-8 max-w-2xl mx-auto">
        <CardContent className="pt-6 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">Enter exactly two values to calculate the third.</p>
            <Button variant="ghost" size="sm" onClick={handleClear}><RefreshCw className="h-4 w-4 mr-2" /> Clear</Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label className={lastCalculated === 'V' ? 'text-primary font-bold' : ''}>Voltage (V) in Volts</Label>
              <Input 
                type="number" 
                value={voltage} 
                onChange={(e) => { setVoltage(e.target.value); if(lastCalculated === 'V') setLastCalculated(null); }} 
                className={lastCalculated === 'V' ? 'border-primary bg-primary/5' : ''}
                placeholder="e.g., 12"
              />
            </div>
            <div className="space-y-2">
              <Label className={lastCalculated === 'I' ? 'text-primary font-bold' : ''}>Current (I) in Amperes</Label>
              <Input 
                type="number" 
                value={current} 
                onChange={(e) => { setCurrent(e.target.value); if(lastCalculated === 'I') setLastCalculated(null); }} 
                className={lastCalculated === 'I' ? 'border-primary bg-primary/5' : ''}
                placeholder="e.g., 2"
              />
            </div>
            <div className="space-y-2">
              <Label className={lastCalculated === 'R' ? 'text-primary font-bold' : ''}>Resistance (R) in Ohms (Ω)</Label>
              <Input 
                type="number" 
                value={resistance} 
                onChange={(e) => { setResistance(e.target.value); if(lastCalculated === 'R') setLastCalculated(null); }} 
                className={lastCalculated === 'R' ? 'border-primary bg-primary/5' : ''}
                placeholder="e.g., 6"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <FormulaDisplay formula="V = I \times R" block={false} />
        <FormulaDisplay formula="I = \frac{V}{R}" block={false} />
        <FormulaDisplay formula="R = \frac{V}{I}" block={false} />
      </div>
    </CalculatorLayout>
  );
};

export default OhmsLawCalculatorPage;