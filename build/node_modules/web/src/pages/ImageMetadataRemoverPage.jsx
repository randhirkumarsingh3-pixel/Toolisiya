import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, ShieldCheck, Download, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024, dm = 2, sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const ImageMetadataRemoverPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [cleanPreview, setCleanPreview] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      if (acceptedFiles?.length > 0) {
        setFile(acceptedFiles[0]);
        setPreview(URL.createObjectURL(acceptedFiles[0]));
        setCleanPreview('');
      }
    }
  });

  const removeMetadata = () => {
    setIsProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      // Drawing to canvas inherently strips EXIF metadata
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        setCleanPreview(URL.createObjectURL(blob));
        setIsProcessing(false);
        toast.success('Metadata removed! Image is clean.');
      }, file.type, 1);
    };
    img.src = preview;
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = cleanPreview;
    a.download = `clean_${file.name}`;
    a.click();
  };

  return (
    <ToolPageTemplate toolData={toolPageData['image-metadata-remover']}>
      <Card className="mb-8 border-primary/20">
        <CardContent className="p-6 bg-primary/5 rounded-xl flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-primary shrink-0" />
          <div>
            <h3 className="font-semibold text-primary-foreground text-primary">Why remove metadata?</h3>
            <p className="text-sm text-muted-foreground mt-1">Photos taken with smartphones contain hidden data (EXIF) including the exact GPS coordinates where the photo was taken, the date and time, and your device model. Removing this protects your privacy online.</p>
          </div>
        </CardContent>
      </Card>

      {!file ? (
        <Card>
          <CardContent className="p-12">
            <div {...getRootProps()} className={`dropzone-container min-h-[250px] ${isDragActive ? 'dropzone-active' : ''}`}>
              <input {...getInputProps()} />
              <UploadCloud className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl font-medium">Drag & drop an image here</p>
              <p className="text-sm text-muted-foreground mt-2">JPG, PNG, WebP supported</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>File Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="checkerboard-bg h-[300px] rounded-lg p-2 flex items-center justify-center">
                <img src={preview} alt="Upload" className="max-h-full object-contain shadow-md" />
              </div>
              <div className="flex flex-col justify-center space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground">Filename</p>
                  <p className="font-medium truncate">{file.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Original Size</p>
                  <p className="font-medium">{formatBytes(file.size)}</p>
                </div>

                {!cleanPreview ? (
                  <Button size="lg" className="w-full mt-4" onClick={removeMetadata} disabled={isProcessing}>
                    {isProcessing ? 'Scrubbing Metadata...' : 'Remove All Metadata'}
                  </Button>
                ) : (
                  <div className="space-y-4 animate-fade-in bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                      <ShieldCheck className="h-5 w-5" /> Image is Clean
                    </div>
                    <p className="text-sm">All EXIF data, GPS coordinates, and camera properties have been permanently stripped.</p>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" /> Download Clean Image
                    </Button>
                  </div>
                )}
                <Button variant="outline" onClick={() => { setFile(null); setPreview(''); setCleanPreview(''); }}>Upload Different Image</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </ToolPageTemplate>
  );
};

export default ImageMetadataRemoverPage;