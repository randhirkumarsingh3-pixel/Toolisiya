import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Download, Minimize } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024, dm = 2, sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const ImageCompressorPage = () => {
  const [image, setImage] = useState(null);
  const [quality, setQuality] = useState(70);
  const [compressedBlob, setCompressedBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processImage = useCallback(async (fileUrl, q) => {
    setIsProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        setCompressedBlob(blob);
        setIsProcessing(false);
      }, 'image/jpeg', q / 100);
    };
    img.src = fileUrl;
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage({ file, url, name: file.name });
      processImage(url, quality);
    }
  }, [quality, processImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, maxFiles: 1 });

  const handleDownload = () => {
    if (!compressedBlob || !image) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${image.name}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Compressed image downloaded!');
  };

  return (
    <ToolPageTemplate toolData={toolPageData['image-compressor']}>
      {!image ? (
        <div className="border-2 border-dashed border-primary/20 hover:border-primary/50 bg-muted/10 rounded-xl p-16 text-center cursor-pointer transition-colors" {...getRootProps()}>
          <input {...getInputProps()} />
          <UploadCloud className="h-16 w-16 text-primary mx-auto mb-4 opacity-80" />
          <p className="text-xl font-bold mb-2">Drag & drop your image here</p>
          <p className="text-sm text-muted-foreground">or click to browse your files</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 shadow-sm border-border">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base truncate">Preview</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => { setImage(null); setCompressedBlob(null); }}>Upload New</Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 checkerboard-bg min-h-[300px] flex items-center justify-center">
              <img src={compressedBlob ? URL.createObjectURL(compressedBlob) : image.url} alt="Preview" className="max-h-[400px] object-contain shadow-sm border" />
            </CardContent>
          </Card>

          <Card className="shadow-md border-border h-fit">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle>Compression Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Quality Level</Label>
                  <span className="font-bold text-primary">{quality}%</span>
                </div>
                <Slider 
                  value={[quality]} 
                  onValueChange={v => { setQuality(v[0]); processImage(image.url, v[0]); }} 
                  min={10} max={100} step={5} 
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-xl border space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Original Size:</span>
                  <span className="font-semibold">{formatBytes(image.file.size)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Compressed Size:</span>
                  <span className="font-bold text-emerald-600">
                    {isProcessing ? 'Processing...' : (compressedBlob ? formatBytes(compressedBlob.size) : '...')}
                  </span>
                </div>
                {compressedBlob && (
                  <div className="pt-2 border-t mt-2 text-center text-xs font-medium text-emerald-600">
                    Saved {Math.round((1 - (compressedBlob.size / image.file.size)) * 100)}%
                  </div>
                )}
              </div>

              <Button className="w-full font-bold h-12" onClick={handleDownload} disabled={isProcessing || !compressedBlob}>
                <Download className="h-4 w-4 mr-2" /> Download Result
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </ToolPageTemplate>
  );
};

export default ImageCompressorPage;