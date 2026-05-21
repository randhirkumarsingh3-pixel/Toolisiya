import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

const FRAME_STYLES = [
  { id: 'circle', name: 'Circle Frame', description: 'Modern and elegant' },
  { id: 'square', name: 'Square Frame', description: 'Traditional and clean' },
  { id: 'decorative', name: 'Decorative Frame', description: 'Ornate and cultural' },
  { id: 'royal', name: 'Royal Border', description: 'Gold double border' },
];

const BORDER_COLORS = [
  { id: 'gold', name: 'Gold', value: '#D4AF37' },
  { id: 'silver', name: 'Silver', value: '#C0C0C0' },
  { id: 'copper', name: 'Copper', value: '#B87333' },
  { id: 'red', name: 'Red', value: '#DC2626' },
  { id: 'maroon', name: 'Maroon', value: '#7F1D1D' },
];

const ImageFrameCustomizer = ({ frameSettings, onFrameChange }) => {
  const handleChange = (key, value) => {
    onFrameChange({ ...frameSettings, [key]: value });
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Image Frame Styling</h3>
        <p className="text-sm text-muted-foreground">Customize how photos appear in your invitation</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Frame Style</Label>
          <Select 
            value={frameSettings.style || 'circle'} 
            onValueChange={(value) => handleChange('style', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FRAME_STYLES.map((style) => (
                <SelectItem key={style.id} value={style.id}>
                  <div>
                    <div className="font-medium">{style.name}</div>
                    <div className="text-xs text-muted-foreground">{style.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Border Color</Label>
          <div className="grid grid-cols-5 gap-2">
            {BORDER_COLORS.map((color) => (
              <button
                key={color.id}
                onClick={() => handleChange('borderColor', color.value)}
                className={`h-10 rounded-md border-2 transition-all ${
                  frameSettings.borderColor === color.value 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Border Width: {frameSettings.borderWidth || 3}px</Label>
          <Slider
            value={[frameSettings.borderWidth || 3]}
            onValueChange={([value]) => handleChange('borderWidth', value)}
            min={1}
            max={10}
            step={1}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <Label className="font-medium">Shadow Effect</Label>
            <p className="text-xs text-muted-foreground">Add depth to frames</p>
          </div>
          <Switch
            checked={frameSettings.shadow || false}
            onCheckedChange={(checked) => handleChange('shadow', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <Label className="font-medium">Glow Effect</Label>
            <p className="text-xs text-muted-foreground">Add subtle glow</p>
          </div>
          <Switch
            checked={frameSettings.glow || false}
            onCheckedChange={(checked) => handleChange('glow', checked)}
          />
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 bg-muted/30 rounded-lg">
        <Label className="text-xs mb-2 block">Frame Preview</Label>
        <div className="flex justify-center">
          <div 
            className={`w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 ${
              frameSettings.style === 'circle' ? 'rounded-full' : 
              frameSettings.style === 'square' ? 'rounded-none' :
              frameSettings.style === 'decorative' ? 'rounded-full' :
              'rounded-md'
            } ${frameSettings.shadow ? 'shadow-lg' : ''} ${frameSettings.glow ? 'wedding-glow-gold' : ''}`}
            style={{
              border: `${frameSettings.borderWidth || 3}px ${frameSettings.style === 'royal' ? 'double' : 'solid'} ${frameSettings.borderColor || '#D4AF37'}`,
              padding: frameSettings.style === 'decorative' ? '0.5rem' : '0',
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default ImageFrameCustomizer;