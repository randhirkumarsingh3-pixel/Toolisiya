import React, { useState, useCallback, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Download, Crop, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const ImageCropperPage = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 50, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result));
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, maxFiles: 1 });

  const downloadCroppedImage = async () => {
    if (!completedCrop || !imgRef.current) return;
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0, 0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cropped_image.png';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Cropped image downloaded!');
    }, 'image/png');
  };

  return (
    <ToolPageTemplate toolData={toolPageData['image-cropper']}>
      {!imageSrc ? (
        <Card className="border-2 border-dashed shadow-sm">
          <CardContent className="p-12 text-center" {...getRootProps()}>
            <input {...getInputProps()} />
            <UploadCloud className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Drag & drop your image here</p>
            <p className="text-sm text-muted-foreground mt-2">or click to browse</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Card className="lg:col-span-3 shadow-sm border-border overflow-hidden">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Crop Area</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setImageSrc(null)}>Change Image</Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex items-center justify-center min-h-[400px] checkerboard-bg">
              <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={c => setCompletedCrop(c)}>
                <img ref={imgRef} src={imageSrc} alt="Upload" className="max-h-[600px] object-contain" />
              </ReactCrop>
            </CardContent>
          </Card>

          <Card className="shadow-md border-border h-fit">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Aspect Ratio</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant={crop.aspect === 1 ? 'default' : 'outline'} size="sm" onClick={() => setCrop({...crop, aspect: 1})}>1:1</Button>
                  <Button variant={crop.aspect === 16/9 ? 'default' : 'outline'} size="sm" onClick={() => setCrop({...crop, aspect: 16/9})}>16:9</Button>
                  <Button variant={crop.aspect === 4/3 ? 'default' : 'outline'} size="sm" onClick={() => setCrop({...crop, aspect: 4/3})}>4:3</Button>
                  <Button variant={!crop.aspect ? 'default' : 'outline'} size="sm" onClick={() => setCrop({...crop, aspect: undefined})}>Free</Button>
                </div>
              </div>

              <Button className="w-full font-bold" size="lg" onClick={downloadCroppedImage} disabled={!completedCrop?.width || !completedCrop?.height}>
                <Download className="h-4 w-4 mr-2" /> Download Crop
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </ToolPageTemplate>
  );
};

export default ImageCropperPage;