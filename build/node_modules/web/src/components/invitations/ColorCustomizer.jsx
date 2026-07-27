import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const COLOR_SCHEMES = {
  wedding: [
    { name: 'Classic Gold', primary: '#D4AF37', secondary: '#8B4513', accent: '#FFD700', text: '#2C1810', background: '#FFF8DC' },
    { name: 'Royal Purple', primary: '#6B46C1', secondary: '#9333EA', accent: '#C084FC', text: '#1F1B24', background: '#FAF5FF' },
    { name: 'Rose Elegance', primary: '#E11D48', secondary: '#FB7185', accent: '#FDA4AF', text: '#1F1B24', background: '#FFF1F2' },
    { name: 'Emerald Green', primary: '#059669', secondary: '#10B981', accent: '#6EE7B7', text: '#1F1B24', background: '#F0FDF4' },
    { name: 'Ocean Blue', primary: '#0284C7', secondary: '#0EA5E9', accent: '#7DD3FC', text: '#1F1B24', background: '#F0F9FF' },
  ],
  birthday: [
    { name: 'Rainbow Party', primary: '#EC4899', secondary: '#F59E0B', accent: '#8B5CF6', text: '#1F1B24', background: '#FFFBEB' },
    { name: 'Candy Pink', primary: '#F472B6', secondary: '#FB923C', accent: '#FDE047', text: '#1F1B24', background: '#FFF1F2' },
    { name: 'Ocean Splash', primary: '#06B6D4', secondary: '#3B82F6', accent: '#A78BFA', text: '#1F1B24', background: '#F0F9FF' },
    { name: 'Sunset Orange', primary: '#F97316', secondary: '#FB923C', accent: '#FDE047', text: '#1F1B24', background: '#FFF7ED' },
    { name: 'Purple Magic', primary: '#A855F7', secondary: '#C084FC', accent: '#E9D5FF', text: '#1F1B24', background: '#FAF5FF' },
  ]
};

const ColorCustomizer = ({ colors, onColorsChange, type = 'wedding' }) => {
  const schemes = COLOR_SCHEMES[type] || COLOR_SCHEMES.wedding;

  const handleColorChange = (key, value) => {
    onColorsChange({ ...colors, [key]: value });
  };

  const applyScheme = (scheme) => {
    onColorsChange({
      primary: scheme.primary,
      secondary: scheme.secondary,
      accent: scheme.accent,
      text: scheme.text,
      background: scheme.background,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Color Scheme</h3>
        <p className="text-sm text-muted-foreground">Choose a preset or customize colors</p>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Preset Schemes</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {schemes.map((scheme) => (
            <Card
              key={scheme.name}
              className="p-3 cursor-pointer hover:shadow-md transition-all"
              onClick={() => applyScheme(scheme)}
            >
              <div className="flex gap-2 mb-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: scheme.primary }} />
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: scheme.secondary }} />
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: scheme.accent }} />
              </div>
              <p className="text-xs font-medium">{scheme.name}</p>
            </Card>
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
    </div>
  );
};

export default ColorCustomizer;