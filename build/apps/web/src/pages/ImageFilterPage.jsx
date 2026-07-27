import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Download, SlidersHorizontal, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const DEFAULT_FILTERS = {
  brightness: 100, contrast: 100, saturation: 100, blur: 0, sepia: 0, grayscale: 0, hueRotate: 0, invert: 0
};

const ImageFilterPage = () => {
  const [imgSrc, setImgSrc] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      if (acceptedFiles?.length > 0) {
        setFilters(DEFAULT_FILTERS);
        const reader = new FileReader();
        reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
        reader.readAsDataURL(acceptedFiles[0]);
      }
    }
  });

  useEffect(() => {
    if (imgSrc && canvasRef.current && imgRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imgRef.current;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      const filterString = `
        brightness(${filters.brightness}%) 
        contrast(${filters.contrast}%) 
        saturate(${filters.saturation}%) 
        blur(${filters.blur}px) 
        sepia(${filters.sepia}%) 
        grayscale(${filters.grayscale}%) 
        hue-rotate(${filters.hueRotate}deg) 
        invert(${filters.invert}%)
      `;
      ctx.filter = filterString;
      ctx.drawImage(img, 0, 0);
    }
  }, [imgSrc, filters]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'filtered_image.jpg';
    a.click();
    toast.success('Filtered image downloaded');
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const renderSlider = (label, key, min, max, unit = '%') => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <Label>{label}</Label>
        <span className="text-muted-foreground">{filters[key]}{unit}</span>
      </div>
      <Slider value={[filters[key]]} min={min} max={max} step={1} onValueChange={val => updateFilter(key, val[0])} />
    </div>
  );

  return (
    <ToolPageTemplate toolData={toolPageData['image-filter']}>
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
          <div className="lg:col-span-1 space-y-4 max-h-[800px] overflow-y-auto pr-2">
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2"><SlidersHorizontal className="h-4 w-4"/> Adjust</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setFilters(DEFAULT_FILTERS)} title="Reset"><RefreshCcw className="h-4 w-4"/></Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {renderSlider('Brightness', 'brightness', 0, 200)}
                {renderSlider('Contrast', 'contrast', 0, 200)}
                {renderSlider('Saturation', 'saturation', 0, 200)}
                {renderSlider('Grayscale', 'grayscale', 0, 100)}
                {renderSlider('Sepia', 'sepia', 0, 100)}
                {renderSlider('Hue Rotate', 'hueRotate', 0, 360, '°')}
                {renderSlider('Blur', 'blur', 0, 20, 'px')}
                {renderSlider('Invert', 'invert', 0, 100)}
                
                <Button className="w-full mt-4" onClick={handleDownload}><Download className="h-4 w-4 mr-2"/> Download Image</Button>
                <Button variant="outline" className="w-full" onClick={() => setImgSrc('')}>Upload New Image</Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardContent className="p-6 h-full flex items-center justify-center checkerboard-bg relative rounded-lg">
                <img ref={imgRef} src={imgSrc} alt="source" className="hidden" onLoad={() => setFilters({...filters})} />
                <canvas ref={canvasRef} className="max-w-full max-h-[700px] object-contain shadow-lg" />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </ToolPageTemplate>
  );
};

export default ImageFilterPage;