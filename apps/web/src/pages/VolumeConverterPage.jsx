import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { conversionFactors } from '@/utils/helpers.js';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const VolumeConverterPage = () => {
  const [amount, setAmount] = useState('1');
  const [fromUnit, setFromUnit] = useState('l');
  const [results, setResults] = useState({});
  const [copiedUnit, setCopiedUnit] = useState(null);

  useEffect(() => {
    if (amount && !isNaN(amount)) {
      const baseInMl = parseFloat(amount) * conversionFactors.volume[fromUnit];
      const newResults = {};
      Object.keys(conversionFactors.volume).forEach(unit => {
        newResults[unit] = baseInMl / conversionFactors.volume[unit];
      });
      setResults(newResults);
    } else {
      setResults({});
    }
  }, [amount, fromUnit]);

  const handleCopy = (unit, value) => {
    navigator.clipboard.writeText(`${value.toFixed(4)} ${unit}`);
    setCopiedUnit(unit);
    toast(`Copied ${unit} value`);
    setTimeout(() => setCopiedUnit(null), 2000);
  };

  return (
    <CalculatorLayout
      title="Volume Converter"
      description="Convert between milliliters, liters, gallons, pints, cups, and spoons."
      category="Converters"
      categoryPath="/converters"
      formula={["Value in ml = Input × (From Unit Rate)", "Result = Value in ml / (To Unit Rate)"]}
      faqs={[
        { question: "How many cups in a gallon?", answer: "There are 16 US cups in a US gallon." },
        { question: "How many milliliters in a teaspoon?", answer: "There are approximately 4.93 milliliters in a US teaspoon." }
      ]}
    >
      <NavigationButtons />
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Convert Volume</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>From Unit</Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.keys(conversionFactors.volume).map(unit => <SelectItem key={unit} value={unit}>{unit.toUpperCase()}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {Object.entries(results).map(([unit, value]) => (
              <div key={unit} className="bg-muted rounded-xl p-4 flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground uppercase">{unit}</div>
                  <div className="text-lg font-bold">{value.toFixed(4)}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(unit, value)}>
                  {copiedUnit === unit ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </CalculatorLayout>
  );
};

export default VolumeConverterPage;