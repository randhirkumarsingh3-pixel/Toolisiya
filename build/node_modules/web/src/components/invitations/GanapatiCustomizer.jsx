import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import ImageUploadComponent from './ImageUploadComponent.jsx';

const GanapatiCustomizer = ({ ganapati, onGanapatiChange }) => {
  const handleChange = (key, value) => {
    onGanapatiChange({ ...ganapati, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Ganapati Element</h3>
          <p className="text-sm text-muted-foreground">Add traditional Ganapati symbol</p>
        </div>
        <Switch
          checked={ganapati.enabled || false}
          onCheckedChange={(checked) => handleChange('enabled', checked)}
        />
      </div>

      {ganapati.enabled && (
        <div className="space-y-4 pl-4 border-l-2 border-primary/20">
          <div className="space-y-2">
            <Label className="text-sm">Type</Label>
            <Select 
              value={ganapati.type || 'icon'} 
              onValueChange={(value) => handleChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="icon">Icon</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="custom">Custom Image</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {ganapati.type === 'custom' && (
            <ImageUploadComponent
              label="Ganapati Image"
              currentImage={ganapati.customImage}
              onImageUpload={(image) => handleChange('customImage', image)}
              onRemove={() => handleChange('customImage', null)}
            />
          )}

          <div className="space-y-2">
            <Label className="text-sm">Placement</Label>
            <Select 
              value={ganapati.placement || 'top-center'} 
              onValueChange={(value) => handleChange('placement', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top-center">Top Center</SelectItem>
                <SelectItem value="top-left">Top Left</SelectItem>
                <SelectItem value="top-right">Top Right</SelectItem>
                <SelectItem value="bottom-center">Bottom Center</SelectItem>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                <SelectItem value="corners">All Corners</SelectItem>
                <SelectItem value="watermark">Watermark</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Size: {ganapati.size || 64}px</Label>
            <Slider
              value={[ganapati.size || 64]}
              onValueChange={([value]) => handleChange('size', value)}
              min={32}
              max={128}
              step={8}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Opacity: {ganapati.opacity || 100}%</Label>
            <Slider
              value={[ganapati.opacity || 100]}
              onValueChange={([value]) => handleChange('opacity', value)}
              min={10}
              max={100}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Rotation: {ganapati.rotation || 0}°</Label>
            <Slider
              value={[ganapati.rotation || 0]}
              onValueChange={([value]) => handleChange('rotation', value)}
              min={-45}
              max={45}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Color</Label>
            <input
              type="color"
              value={ganapati.color || '#D4AF37'}
              onChange={(e) => handleChange('color', e.target.value)}
              className="h-10 w-full rounded border cursor-pointer"
            />
          </div>

          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Traditional Text</Label>
              <Switch
                checked={ganapati.showText || false}
                onCheckedChange={(checked) => handleChange('showText', checked)}
              />
            </div>

            {ganapati.showText && (
              <div className="space-y-3 pl-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-center font-devanagari text-lg">॥ श्री गणेशाय नमः ॥</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Text Size: {ganapati.textSize || 18}px</Label>
                  <Slider
                    value={[ganapati.textSize || 18]}
                    onValueChange={([value]) => handleChange('textSize', value)}
                    min={12}
                    max={32}
                    step={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Text Color</Label>
                  <input
                    type="color"
                    value={ganapati.textColor || '#D4AF37'}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="h-8 w-full rounded border cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GanapatiCustomizer;