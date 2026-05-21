import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ColorPreview = ({ color = '#3B82F6' }) => {
  const [copied, setCopied] = useState(null);

  // Basic hex to rgb/hsl conversion for display
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgb = hexToRgb(color);
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-card rounded-xl border border-border shadow-sm">
      <div 
        className="w-24 h-24 rounded-lg shadow-inner border border-border/50 flex-shrink-0" 
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 w-full space-y-2">
        <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
          <span className="text-sm font-mono font-medium">{color.toUpperCase()}</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(color, 'hex')}>
            {copied === 'hex' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
        <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
          <span className="text-sm font-mono font-medium">{rgbString}</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(rgbString, 'rgb')}>
            {copied === 'rgb' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ColorPreview;