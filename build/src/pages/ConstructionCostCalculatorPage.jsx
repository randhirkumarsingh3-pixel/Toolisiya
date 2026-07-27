import React, { useState, useEffect } from 'react';
import { Copy, Check, Plus, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import ChartComponent from '@/components/ChartComponent.jsx';
import FormulaDisplay from '@/components/FormulaDisplay.jsx';

const ConstructionCostCalculatorPage = () => {
  const [area, setArea] = useState('1000');
  const [costPerSqFt, setCostPerSqFt] = useState('150');
  const [additionalCosts, setAdditionalCosts] = useState([
    { id: 1, name: 'Permits', cost: 5000 },
    { id: 2, name: 'Design/Architect', cost: 8000 }
  ]);
  
  const [baseCost, setBaseCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const a = parseFloat(area) || 0;
    const c = parseFloat(costPerSqFt) || 0;
    const base = a * c;
    
    const additionalTotal = additionalCosts.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
    const total = base + additionalTotal;
    
    setBaseCost(base);
    setTotalCost(total);
    
    const data = [
      { name: 'Base Construction', value: base },
      ...additionalCosts.filter(item => item.name && parseFloat(item.cost) > 0).map(item => ({
        name: item.name,
        value: parseFloat(item.cost)
      }))
    ];
    setChartData(data);
  }, [area, costPerSqFt, additionalCosts]);

  const addCostItem = () => {
    setAdditionalCosts([...additionalCosts, { id: Date.now(), name: '', cost: 0 }]);
  };

  const removeCostItem = (id) => {
    setAdditionalCosts(additionalCosts.filter(item => item.id !== id));
  };

  const updateCostItem = (id, field, value) => {
    setAdditionalCosts(additionalCosts.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(totalCost.toFixed(2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setArea('');
    setCostPerSqFt('');
    setAdditionalCosts([]);
  };

  return (
    <CalculatorLayout
      title="Construction Cost Calculator"
      description="Estimate total building costs including base construction and additional expenses."
      category="Real Estate"
      categoryPath="/real-estate"
      faqs={[
        { question: "What is included in base cost?", answer: "Base cost typically includes standard materials and labor for the main structure. It is calculated by multiplying the total built-up area by the average cost per square foot." },
        { question: "Why add additional costs?", answer: "Items like permits, architectural fees, landscaping, and premium finishes are often not included in the base per-square-foot estimate." }
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Base Construction</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-muted-foreground">
                  <RefreshCw className="h-4 w-4 mr-2" /> Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Built-up Area (sq ft)</Label>
                  <Input type="number" value={area} onChange={(e) => setArea(e.target.value)} min="0" />
                </div>
                <div className="space-y-2">
                  <Label>Cost per sq ft ($)</Label>
                  <Input type="number" value={costPerSqFt} onChange={(e) => setCostPerSqFt(e.target.value)} min="0" />
                </div>
              </div>
              <div className="pt-2 text-right text-sm text-muted-foreground">
                Base Cost: <span className="font-semibold text-foreground">${baseCost.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Additional Costs</CardTitle>
                <Button variant="outline" size="sm" onClick={addCostItem}>
                  <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {additionalCosts.map((item) => (
                <div key={item.id} className="flex gap-2 items-center">
                  <Input 
                    placeholder="Item name (e.g., Permits)" 
                    value={item.name} 
                    onChange={(e) => updateCostItem(item.id, 'name', e.target.value)}
                    className="flex-1"
                  />
                  <Input 
                    type="number" 
                    placeholder="Cost ($)" 
                    value={item.cost || ''} 
                    onChange={(e) => updateCostItem(item.id, 'cost', e.target.value)}
                    className="w-32"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeCostItem(item.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {additionalCosts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No additional costs added.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 flex flex-col items-center justify-center">
              <p className="text-muted-foreground mb-2 font-medium">Total Estimated Cost</p>
              <div className="flex items-center gap-4">
                <span className="text-4xl md:text-5xl font-bold text-primary">
                  ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <Button variant="outline" size="icon" onClick={handleCopy} disabled={!totalCost}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {totalCost > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartComponent data={chartData} type="pie" />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <FormulaDisplay formula="\text{Total} = (\text{Area} \times \text{Cost/sqft}) + \sum \text{Additional Costs}" block={false} />
    </CalculatorLayout>
  );
};

export default ConstructionCostCalculatorPage;