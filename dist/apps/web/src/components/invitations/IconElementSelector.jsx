import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

const ICON_ELEMENTS = [
  { id: 'mandap', name: 'Mandap', symbol: '🕌', description: 'Traditional wedding canopy' },
  { id: 'kalash', name: 'Kalash', symbol: '🏺', description: 'Sacred pot' },
  { id: 'dhol', name: 'Dhol', symbol: '🥁', description: 'Traditional drum' },
  { id: 'rings', name: 'Rings', symbol: '💍', description: 'Wedding rings' },
  { id: 'lotus', name: 'Lotus', symbol: '🪷', description: 'Sacred flower' },
  { id: 'diya', name: 'Diya', symbol: '🪔', description: 'Oil lamp' },
  { id: 'peacock', name: 'Peacock', symbol: '🦚', description: 'Auspicious bird' },
  { id: 'elephant', name: 'Elephant', symbol: '🐘', description: 'Symbol of prosperity' },
];

const DIVIDER_STYLES = [
  { id: 'floral', name: 'Floral Divider', pattern: '✿ ❀ ✿' },
  { id: 'geometric', name: 'Geometric', pattern: '◆ ◇ ◆' },
  { id: 'traditional', name: 'Traditional', pattern: '❖ ❖ ❖' },
  { id: 'minimal', name: 'Minimal', pattern: '— ◦ —' },
];

const IconElementSelector = ({ icons, onIconsChange }) => {
  const handleIconToggle = (iconId) => {
    const selectedIcons = icons.selectedIcons || [];
    const isSelected = selectedIcons.includes(iconId);
    
    const newSelectedIcons = isSelected
      ? selectedIcons.filter(id => id !== iconId)
      : [...selectedIcons, iconId];
    
    onIconsChange({ ...icons, selectedIcons: newSelectedIcons });
  };

  const handleChange = (key, value) => {
    onIconsChange({ ...icons, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Decorative Icons</h3>
        <p className="text-sm text-muted-foreground">Add cultural elements to your invitation</p>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium">Select Icons</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ICON_ELEMENTS.map((icon) => (
            <Card
              key={icon.id}
              className={`p-3 cursor-pointer transition-all ${
                icons.selectedIcons?.includes(icon.id)
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => handleIconToggle(icon.id)}
            >
              <div className="text-center space-y-1">
                <div className="text-3xl">{icon.symbol}</div>
                <p className="text-xs font-medium">{icon.name}</p>
                <p className="text-xs text-muted-foreground">{icon.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {icons.selectedIcons?.length > 0 && (
        <div className="space-y-4 pt-4 border-t">
          <Label className="text-sm font-medium">Icon Settings</Label>
          
          <div className="space-y-2">
            <Label className="text-xs">Icon Size: {icons.iconSize || 32}px</Label>
            <Slider
              value={[icons.iconSize || 32]}
              onValueChange={([value]) => handleChange('iconSize', value)}
              min={16}
              max={64}
              step={4}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Icon Color</Label>
            <input
              type="color"
              value={icons.iconColor || '#D4AF37'}
              onChange={(e) => handleChange('iconColor', e.target.value)}
              className="h-10 w-full rounded border cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Icon Opacity: {icons.iconOpacity || 100}%</Label>
            <Slider
              value={[icons.iconOpacity || 100]}
              onValueChange={([value]) => handleChange('iconOpacity', value)}
              min={20}
              max={100}
              step={10}
            />
          </div>
        </div>
      )}

      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Section Dividers</Label>
            <p className="text-xs text-muted-foreground">Add decorative dividers between sections</p>
          </div>
          <Switch
            checked={icons.showDividers || false}
            onCheckedChange={(checked) => handleChange('showDividers', checked)}
          />
        </div>

        {icons.showDividers && (
          <div className="space-y-3 pl-4">
            <Label className="text-xs">Divider Style</Label>
            <div className="grid grid-cols-2 gap-2">
              {DIVIDER_STYLES.map((divider) => (
                <Card
                  key={divider.id}
                  className={`p-3 cursor-pointer transition-all ${
                    icons.dividerStyle === divider.id
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleChange('dividerStyle', divider.id)}
                >
                  <div className="text-center space-y-1">
                    <p className="text-sm">{divider.pattern}</p>
                    <p className="text-xs font-medium">{divider.name}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Divider Color</Label>
              <input
                type="color"
                value={icons.dividerColor || '#D4AF37'}
                onChange={(e) => handleChange('dividerColor', e.target.value)}
                className="h-8 w-full rounded border cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IconElementSelector;