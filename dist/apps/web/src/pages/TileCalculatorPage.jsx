import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import FormulaDisplay from '@/components/FormulaDisplay.jsx';

const TileCalculatorPage = () => {
  const [area, setArea] = useState('100');
  const [tileSize, setTileSize] = useState('1');
  const [wastePercent, setWastePercent] = useState([10]);
  
  const [tilesNeeded, setTilesNeeded] = useState(0);
  const [wasteTiles, setWasteTiles] = useState(0);
  const [totalTiles, setTotalTiles] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const a = parseFloat(area) || 0;
    const t = parseFloat(tileSize) || 1;
    const w = wastePercent[0] / 100;
    
    const needed = a / t;
    const waste = needed * w;
    
    setTilesNeeded(needed);
    setWasteTiles(waste);
    setTotalTiles(Math.ceil(needed + waste));
  }, [area, tileSize, wastePercent]);

  const handleCopy = () => {
    navigator.clipboard.writeText(totalTiles.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setArea('');
    setTileSize('1');
    setWastePercent([10]);
  };

  return (
    <CalculatorLayout
      title="Tile Calculator"
      description="Calculate how many tiles you need for your floor or wall project, including waste."
      category="Real Estate"
      categoryPath="/real-estate"
      faqs={[
        { question: "Why add waste percentage?", answer: "Tiles often need to be cut to fit edges, corners, or around obstacles. A 10% waste factor is standard, but complex patterns or diagonal layouts may require 15%." }
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Project Details</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-muted-foreground">
                <RefreshCw className="h-4 w-4 mr-2" /> Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Total Area (sq ft)</Label>
              <Input type="number" value={area} onChange={(e) => setArea(e.target.value)} min="0" />
            </div>
            
            <div className="space-y-2">
              <Label>Single Tile Area (sq ft)</Label>
              <div className="flex gap-2 mb-2">
                <Button variant="outline" size="sm" onClick={() => setTileSize('0.25')}>6"x6"</Button>
                <Button variant="outline" size="sm" onClick={() => setTileSize('1')}>12"x12"</Button>
                <Button variant="outline" size="sm" onClick={() => setTileSize('2.25')}>18"x18"</Button>
              </div>
              <Input type="number" value={tileSize} onChange={(e) => setTileSize(e.target.value)} min="0.01" step="any" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Waste Factor: {wastePercent[0]}%</Label>
              </div>
              <Slider value={wastePercent} onValueChange={setWastePercent} min={0} max={25} step={1} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 flex flex-col items-center justify-center">
              <p className="text-muted-foreground mb-2 font-medium">Total Tiles to Order</p>
              <div className="flex items-center gap-4">
                <span className="text-5xl font-bold text-primary">
                  {totalTiles}
                </span>
                <Button variant="outline" size="icon" onClick={handleCopy} disabled={!totalTiles}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Exact Tiles Needed</span>
                <span className="font-medium">{tilesNeeded.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Waste Tiles (+{wastePercent[0]}%)</span>
                <span className="font-medium">{wasteTiles.toFixed(1)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <FormulaDisplay formula="\text{Total Tiles} = \left(\frac{\text{Area}}{\text{Tile Size}}\right) \times (1 + \text{Waste}\%)" block={false} />
    </CalculatorLayout>
  );
};

export default TileCalculatorPage;