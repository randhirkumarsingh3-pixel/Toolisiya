import React, { useState, useEffect } from 'react';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';
import { ArrowRightLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SPEED_UNITS = {
  'm/s': { name: 'Meters per second', factor: 1 },
  'km/h': { name: 'Kilometers per hour', factor: 0.277778 },
  'mph': { name: 'Miles per hour', factor: 0.44704 },
  'knots': { name: 'Knots', factor: 0.514444 },
  'ft/s': { name: 'Feet per second', factor: 0.3048 }
};

const SpeedConverterPage = () => {
  const [fromValue, setFromValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('km/h');
  const [toValue, setToValue] = useState('');
  const [toUnit, setToUnit] = useState('mph');

  useEffect(() => {
    if (!fromValue || isNaN(fromValue)) {
      setToValue('');
      return;
    }
    
    // Convert to base unit (m/s) first, then to target unit
    const valueInMs = parseFloat(fromValue) * SPEED_UNITS[fromUnit].factor;
    const result = valueInMs / SPEED_UNITS[toUnit].factor;
    
    // Format to avoid long decimals
    setToValue(Number(result.toFixed(6)).toString());
  }, [fromValue, fromUnit, toUnit]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
  };

  return (
    <ToolPageTemplate toolData={toolPageData['speed-converter']}>
      <Card className="shadow-sm border-border/50">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            
            {/* From Section */}
            <div className="w-full space-y-3">
              <Label htmlFor="fromValue" className="text-sm font-medium text-muted-foreground">From</Label>
              <div className="flex gap-2">
                <Input
                  id="fromValue"
                  type="number"
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                  className="text-lg font-medium"
                  placeholder="Enter value"
                />
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SPEED_UNITS).map(([key, { name }]) => (
                      <SelectItem key={key} value={key}>{name} ({key})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex items-center justify-center pt-6 md:pt-0">
              <button 
                onClick={handleSwap}
                className="p-3 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Swap units"
              >
                <ArrowRightLeft className="h-5 w-5" />
              </button>
            </div>

            {/* To Section */}
            <div className="w-full space-y-3">
              <Label htmlFor="toValue" className="text-sm font-medium text-muted-foreground">To</Label>
              <div className="flex gap-2">
                <Input
                  id="toValue"
                  type="text"
                  value={toValue}
                  readOnly
                  className="text-lg font-medium bg-muted/50"
                  placeholder="Result"
                />
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SPEED_UNITS).map(([key, { name }]) => (
                      <SelectItem key={key} value={key}>{name} ({key})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

          </div>

          {fromValue && toValue && (
            <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10 text-center">
              <p className="text-lg">
                <span className="font-bold">{fromValue}</span> {SPEED_UNITS[fromUnit].name} = <span className="font-bold text-primary">{toValue}</span> {SPEED_UNITS[toUnit].name}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolPageTemplate>
  );
};

export default SpeedConverterPage;