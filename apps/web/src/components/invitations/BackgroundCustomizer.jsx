import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import ImageUploadComponent from './ImageUploadComponent.jsx';

const PREDEFINED_THEMES = [
  { id: 'royal-palace', name: 'Royal Palace', gradient: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)' },
  { id: 'floral-watercolor', name: 'Floral Watercolor', gradient: 'linear-gradient(135deg, #FFE5E5 0%, #FFF0F0 100%)' },
  { id: 'mandap', name: 'Mandap Theme', gradient: 'linear-gradient(135deg, #DC2626 0%, #7F1D1D 100%)' },
  { id: 'minimal-plain', name: 'Minimal Plain', gradient: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)' },
  { id: 'traditional-red', name: 'Traditional Red', gradient: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)' },
];

const TEXTURES = [
  { id: 'silk', name: 'Silk Texture', class: 'wedding-texture-silk' },
  { id: 'paper', name: 'Paper Texture', class: 'wedding-texture-paper' },
  { id: 'paisley', name: 'Paisley Pattern', class: 'wedding-pattern-paisley' },
  { id: 'mandala', name: 'Mandala Pattern', class: 'wedding-pattern-mandala' },
];

const OVERLAY_TINTS = [
  { id: 'gold', name: 'Gold', color: '#D4AF37' },
  { id: 'cream', name: 'Cream', color: '#FFF8DC' },
  { id: 'red', name: 'Red', color: '#DC2626' },
  { id: 'none', name: 'None', color: 'transparent' },
];

const BackgroundCustomizer = ({ background, onBackgroundChange }) => {
  const handleChange = (key, value) => {
    onBackgroundChange({ ...background, [key]: value });
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Background Design</h3>
        <p className="text-sm text-muted-foreground">Customize the invitation background</p>
      </div>

      <Tabs value={background.type || 'theme'} onValueChange={(value) => handleChange('type', value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="color">Color</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="texture">Texture</TabsTrigger>
        </TabsList>

        <TabsContent value="theme" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {PREDEFINED_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleChange('themeId', theme.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  background.themeId === theme.id 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div 
                  className="h-16 rounded-md mb-2"
                  style={{ background: theme.gradient }}
                />
                <p className="text-xs font-medium">{theme.name}</p>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="color" className="space-y-4">
          <div className="space-y-2">
            <Label>Solid Color</Label>
            <input
              type="color"
              value={background.solidColor || '#FFF8DC'}
              onChange={(e) => handleChange('solidColor', e.target.value)}
              className="h-12 w-full rounded border cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <Label>Gradient (Optional)</Label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="color"
                value={background.gradientStart || '#FFF8DC'}
                onChange={(e) => handleChange('gradientStart', e.target.value)}
                className="h-10 w-full rounded border cursor-pointer"
              />
              <input
                type="color"
                value={background.gradientEnd || '#FFFBEB'}
                onChange={(e) => handleChange('gradientEnd', e.target.value)}
                className="h-10 w-full rounded border cursor-pointer"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="image" className="space-y-4">
          <ImageUploadComponent
            label="Background Image"
            currentImage={background.customImage}
            onImageUpload={(img) => handleChange('customImage', img)}
            onRemove={() => handleChange('customImage', null)}
            maxSizeMB={10}
          />

          {background.customImage && (
            <>
              <div className="space-y-2">
                <Label>Blur: {background.blur || 0}%</Label>
                <Slider
                  value={[background.blur || 0]}
                  onValueChange={([value]) => handleChange('blur', value)}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Brightness: {background.brightness || 100}%</Label>
                <Slider
                  value={[background.brightness || 100]}
                  onValueChange={([value]) => handleChange('brightness', value)}
                  min={0}
                  max={200}
                  step={10}
                />
              </div>

              <div className="space-y-2">
                <Label>Overlay Tint</Label>
                <div className="grid grid-cols-4 gap-2">
                  {OVERLAY_TINTS.map((tint) => (
                    <button
                      key={tint.id}
                      onClick={() => handleChange('overlayTint', tint.color)}
                      className={`h-10 rounded border-2 transition-all ${
                        background.overlayTint === tint.color 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      style={{ backgroundColor: tint.color }}
                      title={tint.name}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="texture" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {TEXTURES.map((texture) => (
              <button
                key={texture.id}
                onClick={() => handleChange('textureClass', texture.class)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  background.textureClass === texture.class 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className={`h-16 rounded-md mb-2 bg-gray-100 ${texture.class}`} />
                <p className="text-xs font-medium">{texture.name}</p>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-4 pt-4 border-t">
        <div className="space-y-2">
          <Label>Opacity: {background.opacity || 100}%</Label>
          <Slider
            value={[background.opacity || 100]}
            onValueChange={([value]) => handleChange('opacity', value)}
            min={0}
            max={100}
            step={5}
          />
        </div>

        <div className="space-y-2">
          <Label>Contrast: {background.contrast || 100}%</Label>
          <Slider
            value={[background.contrast || 100]}
            onValueChange={([value]) => handleChange('contrast', value)}
            min={0}
            max={200}
            step={10}
          />
        </div>
      </div>
    </Card>
  );
};

export default BackgroundCustomizer;