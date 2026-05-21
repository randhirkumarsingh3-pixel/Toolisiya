import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Image as ImageIcon, Trash2, Settings2, Layout } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

export default function BatchFramePage() {
  const [images, setImages] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [layout, setLayout] = useState('grid-2x2');
  const [spacing, setSpacing] = useState([10]);
  const [borderWidth, setBorderWidth] = useState([2]);
  const [borderColor, setBorderColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [cornerRadius, setCornerRadius] = useState([0]);
  const [exportFormat, setExportFormat] = useState('image/jpeg');
  const [exportQuality, setExportQuality] = useState('high');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const processFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error('Please upload valid image files.');
      return;
    }

    const newImages = imageFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      previewUrl: URL.createObjectURL(file),
      imgElement: null,
      scale: 1.0,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      fit: 'cover'
    }));

    newImages.forEach(imgObj => {
      const img = new Image();
      img.onload = () => {
        setImages(prev => prev.map(item => item.id === imgObj.id ? { ...item, imgElement: img } : item));
      };
      img.src = imgObj.previewUrl;
    });

    setImages(prev => [...prev, ...newImages]);
    if (newImages.length > 0) {
      setSelectedImageId(newImages[0].id);
    }
    toast.success(`Added ${newImages.length} image(s)`);
  };

  const updateSelectedImage = (key, value) => {
    const targetId = selectedImageId || (images[0]?.id);
    if (!targetId) return;
    setImages(prev => prev.map(img => {
      if (img.id === targetId) {
        return { ...img, [key]: value };
      }
      return img;
    }));
  };

  const resetSelectedImage = () => {
    const targetId = selectedImageId || (images[0]?.id);
    if (!targetId) return;
    setImages(prev => prev.map(img => {
      if (img.id === targetId) {
        return {
          ...img,
          scale: 1.0,
          offsetX: 0,
          offsetY: 0,
          rotation: 0,
          fit: 'cover'
        };
      }
      return img;
    }));
  };

  const clearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setSelectedImageId(null);
  };

  useEffect(() => {
    if (!canvasRef.current || images.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const baseWidth = 800;
    let cols = 2;
    let rows = 2;
    
    switch(layout) {
      case 'row-2': cols = 2; rows = 1; break;
      case 'row-3': cols = 3; rows = 1; break;
      case 'grid-2x2': cols = 2; rows = 2; break;
      case 'grid-2x3': cols = 3; rows = 2; break;
      case 'grid-2x4': cols = 4; rows = 2; break;
      default: cols = 2; rows = 2;
    }

    const cellWidth = baseWidth / cols;
    const cellHeight = cellWidth; 
    
    canvas.width = baseWidth;
    canvas.height = cellHeight * rows;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gap = spacing[0];
    const bw = borderWidth[0];
    const radius = cornerRadius[0];

    for (let i = 0; i < Math.min(images.length, cols * rows); i++) {
      const imgObj = images[i];
      if (!imgObj.imgElement) continue;

      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cellWidth + gap / 2;
      const y = row * cellHeight + gap / 2;
      const w = cellWidth - gap;
      const h = cellHeight - gap;

      ctx.save();
      
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.fillStyle = bgColor;
      ctx.fill();
      
      if (bw > 0) {
        ctx.lineWidth = bw;
        ctx.strokeStyle = borderColor;
        ctx.stroke();
      }

      ctx.clip();

      const img = imgObj.imgElement;
      const imgRatio = img.width / img.height;
      const cellRatio = w / h;
      
      const fit = imgObj.fit || 'cover';
      let baseW = w;
      let baseH = h;

      if (fit === 'cover') {
        if (imgRatio > cellRatio) {
          baseW = h * imgRatio;
          baseH = h;
        } else {
          baseW = w;
          baseH = w / imgRatio;
        }
      } else if (fit === 'contain') {
        if (imgRatio > cellRatio) {
          baseW = w;
          baseH = w / imgRatio;
        } else {
          baseW = h * imgRatio;
          baseH = h;
        }
      } else {
        baseW = w;
        baseH = h;
      }

      const scale = imgObj.scale !== undefined ? imgObj.scale : 1.0;
      const offsetX = imgObj.offsetX !== undefined ? imgObj.offsetX : 0;
      const offsetY = imgObj.offsetY !== undefined ? imgObj.offsetY : 0;
      const rotation = imgObj.rotation !== undefined ? imgObj.rotation : 0;

      const centerX = x + w / 2;
      const centerY = y + h / 2;

      ctx.translate(centerX, centerY);
      if (rotation !== 0) {
        ctx.rotate(rotation * Math.PI / 180);
      }
      if (scale !== 1) {
        ctx.scale(scale, scale);
      }

      const drawX = -baseW / 2 + offsetX;
      const drawY = -baseH / 2 + offsetY;

      ctx.drawImage(img, drawX, drawY, baseW, baseH);
      ctx.restore();
    }
  }, [images, layout, spacing, borderWidth, borderColor, bgColor, cornerRadius]);

  const generateFramedImage = async () => {
    if (images.length === 0 || !canvasRef.current) return;
    
    setIsProcessing(true);
    setProgress(50);

    try {
      const canvas = canvasRef.current;
      const qualityMap = { low: 0.5, medium: 0.75, high: 1.0 };
      const quality = qualityMap[exportQuality] || 0.9;
      
      const dataUrl = canvas.toDataURL(exportFormat, quality);
      
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `framed_image.${exportFormat === 'image/png' ? 'png' : 'jpg'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setProgress(100);
      toast.success('Framed image downloaded successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('An error occurred while generating the image.');
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <ToolPageTemplate toolData={toolPageData['batch-frame']}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-sm border-border">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" /> Frame Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-6">
              
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Layout</Label>
                <Select value={layout} onValueChange={setLayout}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="row-2">2 Frames (Side by Side)</SelectItem>
                    <SelectItem value="row-3">3 Frames (Row)</SelectItem>
                    <SelectItem value="grid-2x2">4 Frames (2x2 Grid)</SelectItem>
                    <SelectItem value="grid-2x3">6 Frames (2x3 Grid)</SelectItem>
                    <SelectItem value="grid-2x4">8 Frames (2x4 Grid)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-semibold">Spacing (Gap)</Label>
                  <span className="text-xs text-muted-foreground font-medium">{spacing[0]}px</span>
                </div>
                <Slider value={spacing} onValueChange={setSpacing} max={50} min={0} step={1} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-semibold">Border Width</Label>
                  <span className="text-xs text-muted-foreground font-medium">{borderWidth[0]}px</span>
                </div>
                <Slider value={borderWidth} onValueChange={setBorderWidth} max={20} min={0} step={1} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-semibold">Corner Radius</Label>
                  <span className="text-xs text-muted-foreground font-medium">{cornerRadius[0]}px</span>
                </div>
                <Slider value={cornerRadius} onValueChange={setCornerRadius} max={50} min={0} step={1} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Border Color</Label>
                  <div className="flex gap-2">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden border border-input shrink-0">
                      <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Background</Label>
                  <div className="flex gap-2">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden border border-input shrink-0">
                      <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          {images.length > 0 && (
            <Card className="shadow-sm border-border">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" /> Image Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-6">
                
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Select Image to Adjust</Label>
                  <Select 
                    value={selectedImageId || (images[0]?.id || '')} 
                    onValueChange={(val) => setSelectedImageId(val)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select image" />
                    </SelectTrigger>
                    <SelectContent>
                      {images.map((img, idx) => (
                        <SelectItem key={img.id} value={img.id}>
                          Image {idx + 1} ({img.file?.name ? (img.file.name.length > 18 ? img.file.name.substring(0, 15) + '...' : img.file.name) : `Image ${idx + 1}`})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {(() => {
                  const activeImg = images.find(img => img.id === (selectedImageId || images[0]?.id));
                  if (!activeImg) return null;
                  
                  return (
                    <div className="space-y-5 pt-2 border-t border-border/50">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">Fit Mode</Label>
                        <Select 
                          value={activeImg.fit || 'cover'} 
                          onValueChange={(val) => updateSelectedImage('fit', val)}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cover">Cover (Fill cell)</SelectItem>
                            <SelectItem value="contain">Contain (Fit inside)</SelectItem>
                            <SelectItem value="none">Stretch (Distort to fit)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-semibold">Zoom (Scale)</Label>
                          <span className="text-xs text-muted-foreground font-semibold">{(activeImg.scale || 1.0).toFixed(2)}x</span>
                        </div>
                        <Slider 
                          value={[activeImg.scale || 1.0]} 
                          onValueChange={(val) => updateSelectedImage('scale', val[0])} 
                          max={4.0} 
                          min={0.1} 
                          step={0.05} 
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-semibold">Horizontal Shift</Label>
                          <span className="text-xs text-muted-foreground font-semibold">{activeImg.offsetX || 0}px</span>
                        </div>
                        <Slider 
                          value={[activeImg.offsetX || 0]} 
                          onValueChange={(val) => updateSelectedImage('offsetX', val[0])} 
                          max={400} 
                          min={-400} 
                          step={1} 
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-semibold">Vertical Shift</Label>
                          <span className="text-xs text-muted-foreground font-semibold">{activeImg.offsetY || 0}px</span>
                        </div>
                        <Slider 
                          value={[activeImg.offsetY || 0]} 
                          onValueChange={(val) => updateSelectedImage('offsetY', val[0])} 
                          max={400} 
                          min={-400} 
                          step={1} 
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-semibold">Rotation</Label>
                          <span className="text-xs text-muted-foreground font-semibold">{activeImg.rotation || 0}°</span>
                        </div>
                        <Slider 
                          value={[activeImg.rotation || 0]} 
                          onValueChange={(val) => updateSelectedImage('rotation', val[0])} 
                          max={360} 
                          min={0} 
                          step={1} 
                        />
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={resetSelectedImage} 
                        className="w-full mt-2"
                      >
                        Reset Image Settings
                      </Button>
                    </div>
                  );
                })()}

              </CardContent>
            </Card>
          )}

          <Card className="shadow-sm border-border">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-lg">Export Options</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image/jpeg">JPG</SelectItem>
                      <SelectItem value="image/png">PNG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Quality</Label>
                  <Select value={exportQuality} onValueChange={setExportQuality}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                className="w-full h-12 text-base font-semibold shadow-sm mt-4" 
                onClick={generateFramedImage}
                disabled={images.length === 0 || isProcessing}
              >
                {isProcessing ? `Processing... ${progress}%` : <><Download className="w-5 h-5 mr-2" /> Download Image</>}
              </Button>
              {isProcessing && <Progress value={progress} className="h-2 mt-2" />}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div 
            className="border-2 border-dashed border-primary/20 hover:border-primary/50 bg-primary/5 rounded-2xl p-8 text-center transition-colors cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept="image/*" />
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-border">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-1">Click or drag images here</h3>
            <p className="text-sm text-muted-foreground">Supports JPG, PNG, WEBP (Multiple files allowed)</p>
          </div>

          {images.length > 0 && (
            <Card className="shadow-sm border-border overflow-hidden">
              <CardHeader className="bg-muted/30 border-b pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layout className="w-5 h-5 text-primary" /> Canvas Preview
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={clearAll} className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8">
                  <Trash2 className="w-4 h-4 mr-2" /> Clear All
                </Button>
              </CardHeader>
              <CardContent className="p-6 bg-muted/10 flex justify-center overflow-auto">
                <canvas 
                  ref={canvasRef} 
                  className="max-w-full h-auto shadow-md border border-border bg-white"
                  style={{ maxHeight: '600px' }}
                />
              </CardContent>
            </Card>
          )}

          {images.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-2xl bg-muted/10 border-dashed">
              <ImageIcon className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">No images selected</h3>
              <p className="text-sm text-muted-foreground">Upload some images to see the frame preview here.</p>
            </div>
          )}
        </div>
      </div>
    </ToolPageTemplate>
  );
}