import React, { useState, useEffect } from 'react';
import { Copy, Check, Plus, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import FormulaDisplay from '@/components/FormulaDisplay.jsx';

const CarpetAreaCalculatorPage = () => {
  const [rooms, setRooms] = useState([{ id: 1, name: 'Living Room', length: 12, width: 15 }]);
  const [costPerSqFt, setCostPerSqFt] = useState('3.50');
  
  const [totalArea, setTotalArea] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const area = rooms.reduce((sum, room) => sum + ((parseFloat(room.length) || 0) * (parseFloat(room.width) || 0)), 0);
    const cost = parseFloat(costPerSqFt) || 0;
    
    setTotalArea(area);
    setTotalCost(area * cost);
  }, [rooms, costPerSqFt]);

  const addRoom = () => {
    setRooms([...rooms, { id: Date.now(), name: `Room ${rooms.length + 1}`, length: '', width: '' }]);
  };

  const removeRoom = (id) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter(r => r.id !== id));
    }
  };

  const updateRoom = (id, field, value) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(totalArea.toFixed(2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setRooms([{ id: 1, name: 'Room 1', length: '', width: '' }]);
    setCostPerSqFt('');
  };

  return (
    <CalculatorLayout
      title="Carpet Area Calculator"
      description="Calculate total carpet area and estimated cost for multiple rooms."
      category="Real Estate"
      categoryPath="/real-estate"
      faqs={[
        { question: "How is carpet area calculated?", answer: "Carpet area is simply the length of the room multiplied by its width." },
        { question: "Does this account for carpet rolls?", answer: "This calculates exact square footage. Carpets are often sold in 12ft or 15ft wide rolls, which may result in waste not accounted for here." }
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Room Dimensions (ft)</CardTitle>
                <Button variant="outline" size="sm" onClick={addRoom}>
                  <Plus className="h-4 w-4 mr-2" /> Add Room
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {rooms.map((room) => (
                <div key={room.id} className="flex gap-2 items-end bg-muted/30 p-3 rounded-lg">
                  <div className="space-y-1 flex-[2]">
                    <Label className="text-xs">Room Name</Label>
                    <Input value={room.name} onChange={(e) => updateRoom(room.id, 'name', e.target.value)} />
                  </div>
                  <div className="space-y-1 flex-1">
                    <Label className="text-xs">Length</Label>
                    <Input type="number" value={room.length} onChange={(e) => updateRoom(room.id, 'length', e.target.value)} min="0" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <Label className="text-xs">Width</Label>
                    <Input type="number" value={room.width} onChange={(e) => updateRoom(room.id, 'width', e.target.value)} min="0" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeRoom(room.id)} disabled={rooms.length === 1} className="text-destructive mb-0.5">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <Label>Cost per sq ft ($)</Label>
                <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-muted-foreground">
                  <RefreshCw className="h-4 w-4 mr-2" /> Clear
                </Button>
              </div>
              <Input type="number" value={costPerSqFt} onChange={(e) => setCostPerSqFt(e.target.value)} min="0" step="any" />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 flex flex-col items-center justify-center">
              <p className="text-muted-foreground mb-2 font-medium">Total Carpet Area</p>
              <div className="flex items-center gap-4">
                <span className="text-5xl font-bold text-primary">
                  {totalArea.toFixed(1)}
                </span>
                <Button variant="outline" size="icon" onClick={handleCopy} disabled={!totalArea}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <span className="mt-2 text-sm text-muted-foreground">sq ft</span>
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

      <FormulaDisplay formula="\text{Area} = \text{Length} \times \text{Width}" block={false} />
    </CalculatorLayout>
  );
};

export default CarpetAreaCalculatorPage;