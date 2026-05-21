import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import NavigationButtons from '@/components/NavigationButtons.jsx';
import SEOContentDisplay from '@/components/SEOContentDisplay.jsx';

const TemperatureConverterPage = () => {
  const [amount, setAmount] = useState('0');
  const [fromUnit, setFromUnit] = useState('celsius');
  const [results, setResults] = useState({ celsius: 0, fahrenheit: 32, kelvin: 273.15 });
  const [copiedUnit, setCopiedUnit] = useState(null);

  useEffect(() => {
    if (amount && !isNaN(amount)) {
      const val = parseFloat(amount);
      let c = 0, f = 0, k = 0;

      if (fromUnit === 'celsius') { c = val; f = (val * 9/5) + 32; k = val + 273.15; } 
      else if (fromUnit === 'fahrenheit') { c = (val - 32) * 5/9; f = val; k = (val - 32) * 5/9 + 273.15; } 
      else if (fromUnit === 'kelvin') { c = val - 273.15; f = (val - 273.15) * 9/5 + 32; k = val; }
      
      setResults({ celsius: c, fahrenheit: f, kelvin: k });
    }
  }, [amount, fromUnit]);

  const handleCopy = (unit, value) => {
    navigator.clipboard.writeText(`${value.toFixed(2)} °${unit.charAt(0).toUpperCase()}`);
    setCopiedUnit(unit);
    toast(`Copied ${unit} value`);
    setTimeout(() => setCopiedUnit(null), 2000);
  };

  return (
    <CalculatorLayout
      title="Temperature Converter"
      description="Convert between Celsius, Fahrenheit, and Kelvin instantly."
      category="Converters"
      categoryPath="/converters"
      formula={["°F = (°C × 9/5) + 32", "K = °C + 273.15", "°C = (°F - 32) × 5/9"]}
    >
      <NavigationButtons />
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Convert Temperature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Temperature</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>From Scale</Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="celsius">Celsius (°C)</SelectItem>
                  <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                  <SelectItem value="kelvin">Kelvin (K)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {Object.entries(results).map(([unit, value]) => (
              <div key={unit} className="bg-muted rounded-xl p-4 flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground capitalize">{unit}</div>
                  <div className="text-xl font-bold">{value.toFixed(2)}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(unit, value)}>
                  {copiedUnit === unit ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-12">
        <SEOContentDisplay toolName="temperature-converter" />
      </div>
    </CalculatorLayout>
  );
};

export default TemperatureConverterPage;