import React, { useState, useEffect } from 'react';
import { Copy, Check, Plus, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import FormulaDisplay from '@/components/FormulaDisplay.jsx';

const PaintCalculatorPage = () => {
  const [walls, setWalls] = useState([{ id: 1, width: 10, height: 8 }]);
  const [coverage, setCoverage] = useState('350'); // sq ft per gallon/liter
  const [coats, setCoats] = useState('2');
  const [costPerUnit, setCostPerUnit] = useState('45');
  
  const [totalArea, setTotalArea] = useState(0);
  const [paintRequired, setPaintRequired] = useState(0);
  const [cansNeeded, setCansNeeded] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const area = walls.reduce((sum, wall) => sum + ((parseFloat(wall.width) || 0) * (parseFloat(wall.height) || 0)), 0);
    const cov = parseFloat(coverage) || 1;
    const c = parseFloat(coats) || 1;
    const cost = parseFloat(costPerUnit) || 0;
    
    const required = (area * c) / cov;
    const cans = Math.ceil(required);
    
    setTotalArea(area);
    setPaintRequired(required);
    setCansNeeded(cans);
    setTotalCost(cans * cost);
  }, [walls, coverage, coats, costPerUnit]);

  const addWall = () => {
    setWalls([...walls, { id: Date.now(), width: '', height: '' }]);
  };

  const removeWall = (id) => {
    if (walls.length > 1) {
      setWalls(walls.filter(w => w.id !== id));
    }
  };

  const updateWall = (id, field, value) => {
    setWalls(walls.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cansNeeded.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setWalls([{ id: 1, width: '', height: '' }]);
    setCoverage('350');
    setCoats('2');
    setCostPerUnit('');
  };

  return (
    <CalculatorLayout
      title="Paint Calculator"
      description="Calculate how much paint you need and estimate the total cost for your room."
      category="Real Estate"
      categoryPath="/real-estate"
      faqs={[
        { question: "How much does one gallon of paint cover?", answer: "On average, one gallon of paint covers about 350 to 400 square feet with one coat." },
        { question: "Why round up cans?", answer: "You can't buy a fraction of a can, and it's always better to have a little extra paint for touch-ups." }
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Wall Dimensions (ft)</CardTitle>
                <Button variant="outline" size="sm" onClick={addWall}>
                  <Plus className="h-4 w-4 mr-2" /> Add Wall
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {walls.map((wall, index) => (
                <div key={wall.id} className="flex gap-2 items-end">
                  <div className="space-y-1 flex-1">
                    <Label className="text-xs">Width</Label>
                    <Input type="number" value={wall.width} onChange={(e) => updateWall(wall.id, 'width', e.target.value)} min="0" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <Label className="text-xs">Height</Label>
                    <Input type="number" value={wall.height} onChange={(e) => updateWall(wall.id, 'height', e.target.value)} min="0" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeWall(wall.id)} disabled={walls.length === 1} className="text-destructive mb-0.5">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="pt-2 text-right text-sm text-muted-foreground">
                Total Area: <span className="font-semibold text-foreground">{totalArea.toFixed(1)} sq ft</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Paint Details</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-muted-foreground">
                  <RefreshCw className="h-4 w-4 mr-2" /> Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Coverage (sq ft/unit)</Label>
                  <Input type="number" value={coverage} onChange={(e) => setCoverage(e.target.value)} min="1" />
                </div>
                <div className="space-y-2">
                  <Label>Number of Coats</Label>
                  <Input type="number" value={coats} onChange={(e) => setCoats(e.target.value)} min="1" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Cost per Unit ($)</Label>
                  <Input type="number" value={costPerUnit} onChange={(e) => setCostPerUnit(e.target.value)} min="0" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 flex flex-col items-center justify-center">
              <p className="text-muted-foreground mb-2 font-medium">Paint Units Needed</p>
              <div className="flex items-center gap-4">
                <span className="text-5xl font-bold text-primary">
                  {cansNeeded}
                </span>
                <Button variant="outline" size="icon" onClick={handleCopy} disabled={!cansNeeded}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <span className="mt-2 text-sm text-muted-foreground">Exact amount: {paintRequired.toFixed(2)} units</span>
            </CardContent>
          </Card>

          <Card className="bg-secondary/5 border-secondary/20">
            <CardContent className="pt-6 flex flex-col items-center justify-center">
              <p className="text-muted-foreground mb-2 font-medium">Estimated Total Cost</p>
              <span className="text-4xl font-bold text-secondary-foreground">
                ${totalCost.toFixed(2)}
              </span>
            </CardContent>
          </Card>
        </div>
      </div>

      <FormulaDisplay formula="\text{Paint Required} = \frac{\text{Total Area} \times \text{Coats}}{\text{Coverage per Unit}}" block={false} />
    </CalculatorLayout>
  );
};

export default PaintCalculatorPage;