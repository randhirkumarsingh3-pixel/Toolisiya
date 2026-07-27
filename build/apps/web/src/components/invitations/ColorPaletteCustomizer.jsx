import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const PRESET_PALETTES = [
  { 
    name: 'Red & Gold (Traditional)', 
    colors: { primary: '#DC2626', secondary: '#D4AF37', accent: '#B87333', text: '#1F1B24', background: '#FFF8DC' } 
  },
  { 
    name: 'Cream & Gold (Elegant)', 
    colors: { primary: '#D4AF37', secondary: '#FFF8DC', accent: '#B87333', text: '#1F1B24', background: '#FFFBEB' } 
  },
  { 
    name: 'Pastel (Modern)', 
    colors: { primary: '#F472B6', secondary: '#FB923C', accent: '#FDE047', text: '#1F1B24', background: '#FFF1F2' } 
  },
  { 
    name: 'Maroon & Copper', 
    colors: { primary: '#7F1D1D', secondary: '#B87333', accent: '#D4AF37', text: '#1F1B24', background: '#FFFBEB' } 
  },
];

const ColorPaletteCustomizer = ({ colors, onColorsChange }) => {
  const handleColorChange = (key, value) => {
    onColorsChange({ ...colors, [key]: value });
  };

  const applyPreset = (preset) => {
    onColorsChange(preset.colors);
  };

  const getContrastRatio = (color1, color2) => {
    // Simplified contrast check
    const getLuminance = (hex) => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    };
    
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return ratio.toFixed(2);
  };

  const contrastRatio = getContrastRatio(colors.text || '#1F1B24', colors.background || '#FFF8DC');
  const isAccessible = parseFloat(contrastRatio) >= 4.5;

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Color Palette</h3>
        <p className="text-sm text-muted-foreground">Customize colors or choose a preset</p>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Preset Palettes</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PRESET_PALETTES.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              className="h-auto p-3 justify-start"
              onClick={() => applyPreset(preset)}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex gap-1">
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.colors.primary }} />
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.colors.secondary }} />
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.colors.accent }} />
                </div>
                <span className="text-xs font-medium">{preset.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium">Custom Colors</Label>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Primary Color</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={colors.primary || '#D4AF37'}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="h-10 w-full rounded border cursor-pointer"
              />
              <span className="text-xs text-muted-foreground font-mono">{colors.primary}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Secondary Color</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={colors.secondary || '#8B4513'}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="h-10 w-full rounded border cursor-pointer"
              />
              <span className="text-xs text-muted-foreground font-mono">{colors.secondary}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Accent Color</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={colors.accent || '#FFD700'}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="h-10 w-full rounded border cursor-pointer"
              />
              <span className="text-xs text-muted-foreground font-mono">{colors.accent}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Text Color</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={colors.text || '#2C1810'}
                onChange={(e) => handleColorChange('text', e.target.value)}
                className="h-10 w-full rounded border cursor-pointer"
              />
              <span className="text-xs text-muted-foreground font-mono">{colors.text}</span>
            </div>
          </div>

          <div className="space-y-2 col-span-2">
            <Label className="text-xs">Background Color</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={colors.background || '#FFF8DC'}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="h-10 w-full rounded border cursor-pointer"
              />
              <span className="text-xs text-muted-foreground font-mono">{colors.background}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`p-3 rounded-lg ${isAccessible ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-medium">Contrast Ratio</Label>
            <p className="text-xs text-muted-foreground">Text vs Background: {contrastRatio}:1</p>
          </div>
          <span className={`text-xs font-semibold ${isAccessible ? 'text-green-600' : 'text-yellow-600'}`}>
            {isAccessible ? '✓ Accessible' : '⚠ Low Contrast'}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ColorPaletteCustomizer;