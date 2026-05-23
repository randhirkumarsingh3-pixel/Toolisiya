import React, { useState } from 'react';
import { Shuffle, Copy, Trash2, ClipboardCopy as CopyAll } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const MALE_FIRST_NAMES = ['Liam', 'Noah', 'Oliver', 'Elijah', 'James', 'William', 'Benjamin', 'Lucas', 'Henry', 'Alexander', 'Mason', 'Michael', 'Ethan', 'Daniel', 'Jacob', 'Logan', 'Jackson', 'Levi', 'Sebastian', 'Mateo', 'Jack', 'Owen', 'Theodore', 'Aiden', 'Samuel', 'Joseph', 'John', 'David', 'Wyatt', 'Matthew'];

const FEMALE_FIRST_NAMES = ['Olivia', 'Emma', 'Charlotte', 'Amelia', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Evelyn', 'Harper', 'Luna', 'Camila', 'Gianna', 'Elizabeth', 'Eleanor', 'Ella', 'Abigail', 'Sofia', 'Avery', 'Scarlett', 'Emily', 'Aria', 'Penelope', 'Chloe', 'Layla', 'Mila', 'Nora', 'Hazel', 'Madison', 'Ellie'];

const UNISEX_FIRST_NAMES = ['Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Peyton', 'Cameron', 'Skyler', 'Sage', 'River', 'Rowan', 'Charlie', 'Finley', 'Emerson', 'Blake', 'Hayden', 'Reese', 'Parker', 'Dakota', 'Phoenix', 'Sawyer', 'Kai', 'Rory', 'Elliot', 'Lennon', 'Oakley', 'Arden', 'Marlowe'];

const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'];

const RandomNameGeneratorPage = () => {
  const [category, setCategory] = useState('full');
  const [quantity, setQuantity] = useState('5');
  const [generatedNames, setGeneratedNames] = useState([]);
  const [history, setHistory] = useState([]);

  const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

  const generateNames = () => {
    const count = Math.min(Math.max(parseInt(quantity) || 1, 1), 50);
    const names = [];

    for (let i = 0; i < count; i++) {
      let name = '';
      switch (category) {
        case 'male':
          name = getRandomItem(MALE_FIRST_NAMES);
          break;
        case 'female':
          name = getRandomItem(FEMALE_FIRST_NAMES);
          break;
        case 'unisex':
          name = getRandomItem(UNISEX_FIRST_NAMES);
          break;
        case 'full':
          const firstNames = [...MALE_FIRST_NAMES, ...FEMALE_FIRST_NAMES, ...UNISEX_FIRST_NAMES];
          name = `${getRandomItem(firstNames)} ${getRandomItem(LAST_NAMES)}`;
          break;
        default:
          name = getRandomItem(MALE_FIRST_NAMES);
      }
      names.push(name);
    }

    setGeneratedNames(names);
    
    // Add to history (keep last 20)
    const newHistory = [...names, ...history].slice(0, 20);
    setHistory(newHistory);
    
    toast.success(`Generated ${count} name${count > 1 ? 's' : ''}`);
  };

  const copyName = (name) => {
    navigator.clipboard.writeText(name);
    toast.success('Name copied to clipboard');
  };

  const copyAllNames = () => {
    if (generatedNames.length === 0) {
      toast.error('No names to copy');
      return;
    }
    const allNames = generatedNames.join('\n');
    navigator.clipboard.writeText(allNames);
    toast.success(`Copied ${generatedNames.length} names to clipboard`);
  };

  const clearResults = () => {
    setGeneratedNames([]);
  };

  const clearHistory = () => {
    setHistory([]);
    toast.success('History cleared');
  };

  return (
    <ToolPageTemplate toolData={toolPageData['random-name-generator']}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-md border-border">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-lg">Generator Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category-select">Name Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category-select" className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male Names</SelectItem>
                    <SelectItem value="female">Female Names</SelectItem>
                    <SelectItem value="unisex">Unisex Names</SelectItem>
                    <SelectItem value="full">Full Names (First + Last)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity-input">Quantity (1-50)</Label>
                <Input
                  id="quantity-input"
                  type="number"
                  min="1"
                  max="50"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="h-11"
                />
              </div>

              <Button onClick={generateNames} className="w-full h-11 font-semibold">
                <Shuffle className="h-4 w-4 mr-2" />
                Generate Names
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border bg-muted/30">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 text-foreground">Use Cases</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Character creation for stories or games</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Testing user registration forms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Placeholder data for mockups</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Creative writing inspiration</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-md border-border">
            <CardHeader className="bg-primary/5 border-b pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-primary">Generated Names</CardTitle>
              {generatedNames.length > 0 && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyAllNames}>
                    <CopyAll className="h-4 w-4 mr-2" />
                    Copy All
                  </Button>
                  <Button size="sm" variant="outline" onClick={clearResults}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-6">
              {generatedNames.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Shuffle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Click "Generate Names" to create random names</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {generatedNames.map((name, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border hover:border-primary/50 transition-colors group"
                    >
                      <span className="font-medium text-foreground">{name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyName(name)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {history.length > 0 && (
            <Card className="shadow-sm border-border">
              <CardHeader className="bg-muted/30 border-b pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-base">Recent History</CardTitle>
                <Button size="sm" variant="ghost" onClick={clearHistory}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear History
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {history.map((name, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => copyName(name)}
                    >
                      {name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default RandomNameGeneratorPage;