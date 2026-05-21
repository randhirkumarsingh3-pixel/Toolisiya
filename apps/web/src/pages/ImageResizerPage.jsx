import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Download, Lock, Unlock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const ImageResizerPage = () => {
  const [image, setImage] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [targetWidth, setTargetWidth] = useState(0);
  const [targetHeight, setTargetHeight] = useState(0);
  const [maintainRatio, setMaintainRatio] = useState(true);

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setImage({ file, url, name: file.name });
        setDimensions({ width: img.width, height: img.height });
        setTargetWidth(img.width);
        setTargetHeight(img.height);
      };
      img.src = url;
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  const handleWidthChange = (val) => {
    const w = parseInt(val) || 0;
    setTargetWidth(w);
    if (maintainRatio && dimensions.width) {
      setTargetHeight(Math.round((w * dimensions.height) / dimensions.width));
    }
  };

  const handleHeightChange = (val) => {
    const h = parseInt(val) || 0;
    setTargetHeight(h);
    if (maintainRatio && dimensions.height) {
      setTargetWidth(Math.round((h * dimensions.width) / dimensions.height));
    }
  };

  const downloadResized = () => {
    if (!image || !targetWidth || !targetHeight) return;
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resized_${image.name}`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Image downloaded successfully!');
      }, image.file.type);
    };
    img.src = image.url;
  };

  return (
    <ToolPageTemplate toolData={toolPageData['image-resizer']}>
      {!image ? (
        <Card className="border-2 border-dashed shadow-sm">
          <CardContent className="p-12 text-center" {...getRootProps()}>
            <input {...getInputProps()} />
            <UploadCloud className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Drag & drop your image here</p>
            <p className="text-sm text-muted-foreground mt-2">or click to browse</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 shadow-sm border-border overflow-hidden">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base truncate">{image.name}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setImage(null)}>Change Image</Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 checkerboard-bg min-h-[300px] flex items-center justify-center">
              <img src={image.url} alt="Preview" className="max-h-[400px] object-contain shadow-sm border" />
            </CardContent>
          </Card>

          <Card className="shadow-md border-border h-fit">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle>Dimensions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="text-sm text-muted-foreground mb-4">
                Original: {dimensions.width} x {dimensions.height} px
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Width (px)</Label>
                  <Input type="number" value={targetWidth} onChange={(e) => handleWidthChange(e.target.value)} />
                </div>
                <div className="flex justify-center">
                  <Button variant="ghost" size="sm" onClick={() => setMaintainRatio(!maintainRatio)} className="text-muted-foreground hover:text-primary">
                    {maintainRatio ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Height (px)</Label>
                  <Input type="number" value={targetHeight} onChange={(e) => handleHeightChange(e.target.value)} />
                </div>
              </div>

              <Button className="w-full font-bold" size="lg" onClick={downloadResized}>
                <Download className="h-4 w-4 mr-2" /> Download Image
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </ToolPageTemplate>
  );
};

export default ImageResizerPage;