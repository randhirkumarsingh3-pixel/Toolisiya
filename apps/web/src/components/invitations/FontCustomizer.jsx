import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const FONT_FAMILIES = [
  { name: 'Outfit', value: 'Outfit, sans-serif' },
  { name: 'Playfair Display', value: 'Playfair Display, serif' },
  { name: 'Cormorant Garamond', value: 'Cormorant Garamond, serif' },
  { name: 'Noto Sans Devanagari', value: 'Noto Sans Devanagari, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
];

const FontCustomizer = ({ fonts, onFontsChange }) => {
  const handleFontChange = (key, value) => {
    onFontsChange({ ...fonts, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Typography</h3>
        <p className="text-sm text-muted-foreground">Customize fonts and text styles</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm">Heading Font</Label>
          <Select 
            value={fonts.headingFont || 'Playfair Display, serif'} 
            onValueChange={(value) => handleFontChange('headingFont', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  <span style={{ fontFamily: font.value }}>{font.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Body Font</Label>
          <Select 
            value={fonts.bodyFont || 'Outfit, sans-serif'} 
            onValueChange={(value) => handleFontChange('bodyFont', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  <span style={{ fontFamily: font.value }}>{font.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Details Font</Label>
          <Select 
            value={fonts.detailsFont || 'Outfit, sans-serif'} 
            onValueChange={(value) => handleFontChange('detailsFont', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  <span style={{ fontFamily: font.value }}>{font.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Heading Size: {fonts.headingSize || 32}px</Label>
          <Slider
            value={[fonts.headingSize || 32]}
            onValueChange={([value]) => handleFontChange('headingSize', value)}
            min={24}
            max={64}
            step={2}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Body Size: {fonts.bodySize || 16}px</Label>
          <Slider
            value={[fonts.bodySize || 16]}
            onValueChange={([value]) => handleFontChange('bodySize', value)}
            min={12}
            max={24}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Letter Spacing: {fonts.letterSpacing || 0}px</Label>
          <Slider
            value={[fonts.letterSpacing || 0]}
            onValueChange={([value]) => handleFontChange('letterSpacing', value)}
            min={-2}
            max={4}
            step={0.5}
          />
        </div>
      </div>
    </div>
  );
};

export default FontCustomizer;