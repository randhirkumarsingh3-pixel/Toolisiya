import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Download, Type, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const POSITIONS = [
  'top-left', 'top-center', 'top-right',
  'center-left', 'center', 'center-right',
  'bottom-left', 'bottom-center', 'bottom-right'
];

const ImageWatermarkPage = () => {
  const [imgSrc, setImgSrc] = useState('');
  const [text, setText] = useState('© Copyright');
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(50);
  const [color, setColor] = useState('#ffffff');
  const [position, setPosition] = useState('bottom-right');
  
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      if (acceptedFiles?.length > 0) {
        const reader = new FileReader();
        reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
        reader.readAsDataURL(acceptedFiles[0]);
      }
    }
  });

  const drawWatermark = () => {
    if (!canvasRef.current || !imgRef.current || !imgSrc) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    if (!text) return;

    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.globalAlpha = opacity / 100;
    ctx.fillStyle = color;
    
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const padding = 20;

    let x = 0, y = 0;
    switch (position) {
      case 'top-left': x = padding; y = fontSize + padding; break;
      case 'top-center': x = (canvas.width - textWidth) / 2; y = fontSize + padding; break;
      case 'top-right': x = canvas.width - textWidth - padding; y = fontSize + padding; break;
      case 'center-left': x = padding; y = canvas.height / 2; break;
      case 'center': x = (canvas.width - textWidth) / 2; y = canvas.height / 2; break;
      case 'center-right': x = canvas.width - textWidth - padding; y = canvas.height / 2; break;
      case 'bottom-left': x = padding; y = canvas.height - padding; break;
      case 'bottom-center': x = (canvas.width - textWidth) / 2; y = canvas.height - padding; break;
      case 'bottom-right': x = canvas.width - textWidth - padding; y = canvas.height - padding; break;
      default: x = padding; y = fontSize + padding;
    }

    ctx.fillText(text, x, y);
    ctx.globalAlpha = 1.0; 
  };

  useEffect(() => {
    drawWatermark();
  }, [imgSrc, text, fontSize, opacity, color, position]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'watermarked_image.jpg';
    a.click();
    toast.success('Watermarked image downloaded');
  };

  return (
    <ToolPageTemplate toolData={toolPageData['image-watermark']}>
      {!imgSrc ? (
        <Card>
          <CardContent className="p-12">
            <div {...getRootProps()} className={`dropzone-container min-h-[300px] ${isDragActive ? 'dropzone-active' : ''}`}>
              <input {...getInputProps()} />
              <UploadCloud className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl font-medium">Drag & drop an image here</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><Type className="h-4 w-4"/> Text Config</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Watermark Text</Label><Input value={text} onChange={e => setText(e.target.value)} /></div>
                
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Select value={position} onValueChange={setPosition}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      {POSITIONS.map(p => <SelectItem key={p} value={p}>{p.split('-').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ')}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><Label>Font Size</Label><span>{fontSize}px</span></div>
                  <Slider value={[fontSize]} min={10} max={200} step={1} onValueChange={v => setFontSize(v[0])} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><Label>Opacity</Label><span>{opacity}%</span></div>
                  <Slider value={[opacity]} min={0} max={100} step={1} onValueChange={v => setOpacity(v[0])} />
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-10 p-1" />
                    <Input type="text" value={color} onChange={e => setColor(e.target.value)} className="flex-1 uppercase" />
                  </div>
                </div>

                <Button className="w-full mt-4" onClick={handleDownload}><Download className="h-4 w-4 mr-2"/> Download Image</Button>
                <Button variant="outline" className="w-full" onClick={() => setImgSrc('')}>Upload New Image</Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardContent className="p-6 h-full flex items-center justify-center checkerboard-bg relative rounded-lg">
                <img ref={imgRef} src={imgSrc} alt="source" className="hidden" onLoad={drawWatermark} />
                <canvas ref={canvasRef} className="max-w-full max-h-[700px] object-contain shadow-lg" />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </ToolPageTemplate>
  );
};

export default ImageWatermarkPage;