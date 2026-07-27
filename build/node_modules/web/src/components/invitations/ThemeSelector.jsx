import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const THEMES = [
  {
    id: 'royal',
    name: 'Royal',
    description: 'Gold, red, and traditional elements',
    colors: { primary: '#D4AF37', secondary: '#DC2626', accent: '#B87333', text: '#1F1B24', background: '#FFF8DC' },
    fonts: { heading: 'Playfair Display, serif', body: 'Outfit, sans-serif' },
    ganapatiDefault: true,
    preview: 'linear-gradient(135deg, #D4AF37 0%, #DC2626 100%)',
  },
  {
    id: 'floral',
    name: 'Floral',
    description: 'Pastel colors with elegant flowers',
    colors: { primary: '#F472B6', secondary: '#FB923C', accent: '#FDE047', text: '#1F1B24', background: '#FFF1F2' },
    fonts: { heading: 'Cormorant Garamond, serif', body: 'Outfit, sans-serif' },
    ganapatiDefault: true,
    preview: 'linear-gradient(135deg, #F472B6 0%, #FB923C 100%)',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, modern, and simple',
    colors: { primary: '#1F2937', secondary: '#6B7280', accent: '#F59E0B', text: '#111827', background: '#FFFFFF' },
    fonts: { heading: 'Outfit, sans-serif', body: 'Outfit, sans-serif' },
    ganapatiDefault: false,
    preview: 'linear-gradient(135deg, #1F2937 0%, #6B7280 100%)',
  },
  {
    id: 'traditional',
    name: 'Traditional',
    description: 'Red, maroon, and cultural design',
    colors: { primary: '#DC2626', secondary: '#7F1D1D', accent: '#D4AF37', text: '#1F1B24', background: '#FFFBEB' },
    fonts: { heading: 'Playfair Display, serif', body: 'Noto Sans Devanagari, sans-serif' },
    ganapatiDefault: true,
    preview: 'linear-gradient(135deg, #DC2626 0%, #7F1D1D 100%)',
  },
];

const ThemeSelector = ({ selectedTheme, onThemeSelect }) => {
  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose a Theme</h3>
        <p className="text-sm text-muted-foreground">Select a pre-designed theme or customize your own</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {THEMES.map((theme) => (
          <Card
            key={theme.id}
            className={`p-4 cursor-pointer transition-all ${
              selectedTheme?.id === theme.id 
                ? 'ring-2 ring-primary shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => onThemeSelect(theme)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold">{theme.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{theme.description}</p>
              </div>
              {selectedTheme?.id === theme.id && (
                <div className="bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>

            <div 
              className="h-16 rounded-lg mb-3"
              style={{ background: theme.preview }}
            />

            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {theme.fonts.heading.split(',')[0]}
              </Badge>
              {theme.ganapatiDefault && (
                <Badge variant="outline" className="text-xs">
                  Ganapati ✓
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default ThemeSelector;