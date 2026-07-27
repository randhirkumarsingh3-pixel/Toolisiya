import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RefreshCw, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const PhotoEditorPage = () => {
  const [file, setFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [editedUrl, setEditedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hueRotate: 0,
    blur: 0,
    grayscale: false,
    sepia: false,
    invert: false
  });

  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Please upload a valid image file.');
      return;
    }
    
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setOriginalUrl(url);
    resetFilters();
  };

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hueRotate: 0,
      blur: 0,
      grayscale: false,
      sepia: false,
      invert: false
    });
  };

  const applyFilters = () => {
    if (!originalUrl) return;
    setIsProcessing(true);
    
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const filterString = `
        brightness(${filters.brightness}%) 
        contrast(${filters.contrast}%) 
        saturate(${filters.saturation}%) 
        hue-rotate(${filters.hueRotate}deg) 
        blur(${filters.blur}px)
        ${filters.grayscale ? 'grayscale(100%)' : ''}
        ${filters.sepia ? 'sepia(100%)' : ''}
        ${filters.invert ? 'invert(100%)' : ''}
      `.trim();
      
      ctx.filter = filterString;
      ctx.drawImage(img, 0, 0);
      
      setEditedUrl(canvas.toDataURL('image/jpeg', 0.9));
      setIsProcessing(false);
    };
    img.src = originalUrl;
  };

  useEffect(() => {
    if (originalUrl) {
      const timer = setTimeout(() => {
        applyFilters();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [filters, originalUrl]);

  const handleClear = () => {
    setFile(null);
    setOriginalUrl(null);
    setEditedUrl(null);
    resetFilters();
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ToolPageTemplate toolData={toolPageData['photo-editor']}>
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Adjustments</span>
              {file && (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!file ? (
              <div className="border-2 border-dashed border-blue-500/30 rounded-xl p-12 text-center hover:bg-blue-500/5 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Upload className="h-10 w-10 text-blue-500 mx-auto mb-4" />
                <p className="text-sm font-medium">Drag & drop an image here</p>
              </div>
            ) : (
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Brightness</Label>
                    <span className="text-xs text-muted-foreground">{filters.brightness}%</span>
                  </div>
                  <Slider value={[filters.brightness]} onValueChange={(v) => updateFilter('brightness', v[0])} min={0} max={200} />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Contrast</Label>
                    <span className="text-xs text-muted-foreground">{filters.contrast}%</span>
                  </div>
                  <Slider value={[filters.contrast]} onValueChange={(v) => updateFilter('contrast', v[0])} min={0} max={200} />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Saturation</Label>
                    <span className="text-xs text-muted-foreground">{filters.saturation}%</span>
                  </div>
                  <Slider value={[filters.saturation]} onValueChange={(v) => updateFilter('saturation', v[0])} min={0} max={200} />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Hue Rotate</Label>
                    <span className="text-xs text-muted-foreground">{filters.hueRotate}°</span>
                  </div>
                  <Slider value={[filters.hueRotate]} onValueChange={(v) => updateFilter('hueRotate', v[0])} min={0} max={360} />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Blur</Label>
                    <span className="text-xs text-muted-foreground">{filters.blur}px</span>
                  </div>
                  <Slider value={[filters.blur]} onValueChange={(v) => updateFilter('blur', v[0])} min={0} max={20} />
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label>Grayscale</Label>
                    <Switch checked={filters.grayscale} onCheckedChange={(c) => updateFilter('grayscale', c)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Sepia</Label>
                    <Switch checked={filters.sepia} onCheckedChange={(c) => updateFilter('sepia', c)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Invert Colors</Label>
                    <Switch checked={filters.invert} onCheckedChange={(c) => updateFilter('invert', c)} />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-8 bg-muted/30">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Preview</span>
              {file && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleClear}>
                    Clear Image
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = editedUrl;
                      a.download = `edited_${file.name}`;
                      a.click();
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" /> Download
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editedUrl ? (
              <div className="rounded-lg overflow-hidden border bg-black/5 flex items-center justify-center relative min-h-[400px] p-4">
                <img 
                  src={editedUrl} 
                  alt="Edited" 
                  className="max-w-full max-h-[600px] object-contain shadow-sm" 
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground">
                <Sliders className="h-12 w-12 mb-4 opacity-20" />
                <p>Upload an image to start editing</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default PhotoEditorPage;