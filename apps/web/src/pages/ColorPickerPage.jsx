import React, { useState, useEffect } from 'react';
import { Copy, Palette, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const PREDEFINED_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#10b981', 
  '#06b6d4', '#0ea5e9', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', 
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b', '#0f172a'
];

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r, g, b) => {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
};

const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hslToRgb = (h, s, l) => {
  s /= 100; l /= 100;
  const k = s * Math.min(l, 1 - l);
  const f = n => {
    const k2 = (n + h / 30) % 12;
    return Math.round(255 * (l - k * Math.max(Math.min(k2 - 3, 9 - k2, 1), -1)));
  };
  return { r: f(0), g: f(8), b: f(4) };
};

const ColorPickerPage = () => {
  const [hex, setHex] = useState('#3B82F6');
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 90, l: 60 });
  const [harmonies, setHarmonies] = useState({ complementary: '', analogous1: '', analogous2: '', triadic1: '', triadic2: '' });

  useEffect(() => {
    const r = hexToRgb(hex);
    const hl = rgbToHsl(r.r, r.g, r.b);
    setRgb(r);
    setHsl(hl);
    calculateHarmonies(hl.h, hl.s, hl.l);
  }, [hex]);

  const calculateHarmonies = (h, s, l) => {
    const getHex = (hue) => {
      const {r, g, b} = hslToRgb((hue + 360) % 360, s, l);
      return rgbToHex(r, g, b);
    };

    setHarmonies({
      complementary: getHex(h + 180),
      analogous1: getHex(h + 30),
      analogous2: getHex(h - 30),
      triadic1: getHex(h + 120),
      triadic2: getHex(h + 240)
    });
  };

  const handleHexChange = (e) => {
    const val = e.target.value;
    setHex(val);
  };

  const handleRgbChange = (e, channel) => {
    let val = parseInt(e.target.value) || 0;
    if (val > 255) val = 255;
    if (val < 0) val = 0;
    const newRgb = { ...rgb, [channel]: val };
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleHslChange = (e, channel) => {
    let val = parseInt(e.target.value) || 0;
    if (channel === 'h' && val > 360) val = 360;
    if (channel !== 'h' && val > 100) val = 100;
    if (val < 0) val = 0;
    const newHsl = { ...hsl, [channel]: val };
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(`${text} copied!`);
  };

  const ColorSwatch = ({ color, label }) => (
    <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => copyToClipboard(color)}>
      <div className="w-16 h-16 rounded-lg shadow-sm border border-border transition-transform hover:scale-105 active:scale-95" style={{ backgroundColor: color }} />
      <div className="text-xs font-medium uppercase">{label}</div>
      <div className="text-xs text-muted-foreground">{color}</div>
    </div>
  );

  return (
    <ToolPageTemplate toolData={toolPageData['color-picker']}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border shadow-md">
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-center mb-4">
                <div className="relative w-full aspect-square rounded-2xl shadow-inner border border-border overflow-hidden" style={{ backgroundColor: hex }}>
                  <input 
                    type="color" 
                    value={hex} 
                    onChange={handleHexChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">HEX</Label>
                  <div className="flex gap-2">
                    <Input value={hex} onChange={handleHexChange} className="font-mono uppercase" />
                    <Button variant="secondary" onClick={() => copyToClipboard(hex)}><Copy className="h-4 w-4" /></Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">RGB</Label>
                  <div className="flex gap-2">
                    <Input value={rgb.r} onChange={(e) => handleRgbChange(e, 'r')} type="number" min="0" max="255" className="font-mono text-center px-1" />
                    <Input value={rgb.g} onChange={(e) => handleRgbChange(e, 'g')} type="number" min="0" max="255" className="font-mono text-center px-1" />
                    <Input value={rgb.b} onChange={(e) => handleRgbChange(e, 'b')} type="number" min="0" max="255" className="font-mono text-center px-1" />
                    <Button variant="secondary" onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}><Copy className="h-4 w-4" /></Button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">HSL</Label>
                  <div className="flex gap-2">
                    <Input value={hsl.h} onChange={(e) => handleHslChange(e, 'h')} type="number" min="0" max="360" className="font-mono text-center px-1" />
                    <Input value={hsl.s} onChange={(e) => handleHslChange(e, 's')} type="number" min="0" max="100" className="font-mono text-center px-1" />
                    <Input value={hsl.l} onChange={(e) => handleHslChange(e, 'l')} type="number" min="0" max="100" className="font-mono text-center px-1" />
                    <Button variant="secondary" onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}><Copy className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Palette className="h-5 w-5 text-primary" /> Harmonies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center pb-6">
                <div className="col-span-2 md:col-span-4 mb-4 text-center border-b border-border w-full pb-4">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Complementary</p>
                  <div className="flex justify-center gap-8">
                    <ColorSwatch color={hex} label="Base" />
                    <ColorSwatch color={harmonies.complementary} label="Comp" />
                  </div>
                </div>

                <div className="col-span-2 text-center w-full">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Analogous</p>
                  <div className="flex justify-center gap-4">
                    <ColorSwatch color={harmonies.analogous2} label="-30°" />
                    <ColorSwatch color={hex} label="Base" />
                    <ColorSwatch color={harmonies.analogous1} label="+30°" />
                  </div>
                </div>

                <div className="col-span-2 text-center w-full">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Triadic</p>
                  <div className="flex justify-center gap-4">
                    <ColorSwatch color={harmonies.triadic1} label="+120°" />
                    <ColorSwatch color={hex} label="Base" />
                    <ColorSwatch color={harmonies.triadic2} label="+240°" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Predefined Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 md:grid-cols-9 gap-3">
                {PREDEFINED_COLORS.map(c => (
                  <div 
                    key={c} 
                    className="aspect-square rounded-md shadow-sm border border-border cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    style={{ backgroundColor: c }}
                    onClick={() => setHex(c)}
                    title={c}
                  >
                    {hex.toUpperCase() === c.toUpperCase() && (
                      <div className="w-full h-full flex items-center justify-center bg-black/20 rounded-md">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default ColorPickerPage;