import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { UploadCloud, Settings, Download, RefreshCcw, FileImage, Cpu } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const ImageBatchProcessorPage = () => {
  const [files, setFiles] = useState([]);
  const [operation, setOperation] = useState('format');
  const [outputFormat, setOutputFormat] = useState('image/webp');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedFiles, setProcessedFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: acceptedFiles => {
      const newFiles = acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substring(7)
      }));
      setFiles(prev => [...prev, ...newFiles]);
      setProcessedFiles([]);
    }
  });

  const processImage = (fileObj) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (operation === 'format' && outputFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        if (operation === 'grayscale') {
          ctx.filter = 'grayscale(100%)';
        }

        ctx.drawImage(img, 0, 0);

        const format = operation === 'format' ? outputFormat : fileObj.type;
        canvas.toBlob((blob) => resolve(blob), format, 0.9);
      };
      img.src = fileObj.preview;
    });
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    const results = [];

    for (let i = 0; i < files.length; i++) {
      const blob = await processImage(files[i]);
      results.push({
        origFile: files[i],
        blob,
        url: URL.createObjectURL(blob),
        ext: operation === 'format' ? outputFormat.split('/')[1] : files[i].name.split('.').pop()
      });
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    setProcessedFiles(results);
    setIsProcessing(false);
    toast.success(`Processed ${files.length} images`);
  };

  const downloadZip = async () => {
    if (processedFiles.length === 0) return;
    const zip = new JSZip();
    processedFiles.forEach((file, index) => {
      zip.file(`processed_${index}_${file.origFile.name.split('.')[0]}.${file.ext}`, file.blob);
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batch_processed_images.zip';
    a.click();
  };

  const getFallbackData = () => ({
    toolName: 'Batch Image Processor',
    toolDescription: 'Process multiple images at once: format conversion, filters, and more.',
    whatToolDoes: 'Applies the same operation to hundreds of images instantly.',
    whyUseful: ['Saves time', 'Consistent results', 'No software installation'],
    howToUseSteps: ['Upload multiple images', 'Select operation', 'Start batch', 'Download ZIP'],
    howItWorks: 'Uses client-side processing to handle multiple images securely in your browser.',
    features: ['Format conversion', 'Grayscale filter', 'EXIF scrubbing'],
    useCases: ['Photographers', 'Web developers', 'Social media managers'],
    faqs: [{ question: 'Is there a limit?', answer: 'Depends on your device memory, usually up to 100 images.' }],
    seoContent: 'Process multiple images at once with our free online batch image processor.',
    relatedTools: []
  });

  return (
    <ToolPageTemplate toolData={toolPageData['batch-processor'] || getFallbackData()}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-4 w-4"/> Operations</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Select value={operation} onValueChange={setOperation}>
                  <SelectTrigger><SelectValue placeholder="Select Operation"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="format">Convert Format</SelectItem>
                    <SelectItem value="grayscale">Convert to Grayscale</SelectItem>
                    <SelectItem value="scrub">Scrub EXIF Metadata</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {operation === 'format' && (
                <div className="space-y-2">
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger><SelectValue placeholder="Output Format"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image/png">PNG</SelectItem>
                      <SelectItem value="image/jpeg">JPG</SelectItem>
                      <SelectItem value="image/webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button className="w-full" onClick={handleProcess} disabled={isProcessing || files.length === 0}>
                  {isProcessing ? 'Processing...' : <><Cpu className="h-4 w-4 mr-2"/> Start Batch</>}
                </Button>
                <Button variant="secondary" className="w-full mt-2" onClick={downloadZip} disabled={processedFiles.length === 0}>
                  <Download className="h-4 w-4 mr-2"/> Download ZIP
                </Button>
                <Button variant="ghost" className="w-full mt-2" onClick={() => {setFiles([]); setProcessedFiles([]);}}><RefreshCcw className="h-4 w-4 mr-2"/> Clear All</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div {...getRootProps()} className={`dropzone-container min-h-[150px] ${isDragActive ? 'dropzone-active' : ''}`}>
                <input {...getInputProps()} />
                <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="font-medium">Drop multiple images here</p>
                <Badge variant="secondary" className="mt-2">{files.length} images queued</Badge>
              </div>
            </CardContent>
          </Card>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Processing {files.length} images...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {processedFiles.length > 0 && (
            <Card className="bg-emerald-500/10 border-emerald-500/20">
              <CardContent className="p-4 flex justify-between items-center">
                <span className="font-medium text-emerald-700 dark:text-emerald-400">Successfully processed {processedFiles.length} files.</span>
                <Button onClick={downloadZip} className="bg-emerald-600 hover:bg-emerald-700 text-white"><Download className="h-4 w-4 mr-2"/> Download All</Button>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map((file, i) => {
              const processed = processedFiles[i];
              return (
                <Card key={file.id} className="overflow-hidden border-border/50 shadow-sm relative">
                  <div className="h-[100px] checkerboard-bg p-2 flex items-center justify-center">
                    <img src={processed ? processed.url : file.preview} className="max-h-full max-w-full object-contain" alt="" />
                  </div>
                  <div className="p-2 text-xs truncate bg-card">
                    {file.name}
                  </div>
                  {processed && <div className="absolute top-1 right-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded">Done</div>}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default ImageBatchProcessorPage;