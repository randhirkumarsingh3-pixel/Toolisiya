import React, { useState } from 'react';
import { Image as ImageIcon, Download } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import PDFUploadZone from '@/components/pdf/PDFUploadZone.jsx';
import PDFPreviewPanel from '@/components/pdf/PDFPreviewPanel.jsx';
import PDFProgressIndicator from '@/components/pdf/PDFProgressIndicator.jsx';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFToImageConverterPage = () => {
  const [file, setFile] = useState(null);
  const [pageMode, setPageMode] = useState('all');
  const [pageRange, setPageRange] = useState('');
  const [imageFormat, setImageFormat] = useState('png');
  const [quality, setQuality] = useState([90]);
  const [dpi, setDpi] = useState('150');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedImages, setConvertedImages] = useState([]);

  const handleConvert = async () => {
    if (!file) {
      toast.error('Please upload a PDF file first');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setConvertedImages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;
      
      setProgress(10);

      let pagesToConvert = [];
      if (pageMode === 'all') {
        pagesToConvert = Array.from({ length: totalPages }, (_, i) => i + 1);
      } else {
        const ranges = pageRange.split(',').map(r => r.trim());
        for (const range of ranges) {
          if (range.includes('-')) {
            const [start, end] = range.split('-').map(n => parseInt(n.trim()));
            for (let i = start; i <= end && i <= totalPages; i++) {
              if (i > 0) pagesToConvert.push(i);
            }
          } else {
            const pageNum = parseInt(range);
            if (pageNum > 0 && pageNum <= totalPages) {
              pagesToConvert.push(pageNum);
            }
          }
        }
      }

      if (pagesToConvert.length === 0) {
        toast.error('No valid pages to convert');
        setIsProcessing(false);
        return;
      }

      setProgress(20);

      const scale = parseInt(dpi) / 72;
      const images = [];

      for (let i = 0; i < pagesToConvert.length; i++) {
        const pageNum = pagesToConvert[i];
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        const mimeType = imageFormat === 'png' ? 'image/png' : 'image/jpeg';
        const qualityValue = imageFormat === 'jpg' ? quality[0] / 100 : undefined;
        const dataUrl = canvas.toDataURL(mimeType, qualityValue);
        
        images.push({
          pageNum,
          dataUrl,
          filename: `page-${pageNum}.${imageFormat}`
        });
        
        setProgress(20 + (i / pagesToConvert.length) * 70);
      }

      setConvertedImages(images);
      setProgress(100);
      
      toast.success(`Converted ${images.length} page(s) to ${imageFormat.toUpperCase()}`);
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Failed to convert PDF to images');
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const downloadImage = (image) => {
    const link = document.createElement('a');
    link.href = image.dataUrl;
    link.download = image.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded');
  };

  const downloadAllAsZip = async () => {
    if (convertedImages.length === 0) {
      toast.error('No images to download');
      return;
    }

    try {
      const zip = new JSZip();
      
      for (const image of convertedImages) {
        const base64Data = image.dataUrl.split(',')[1];
        zip.file(image.filename, base64Data, { base64: true });
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pdf-images-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('ZIP file downloaded');
    } catch (error) {
      console.error('ZIP creation error:', error);
      toast.error('Failed to create ZIP file');
    }
  };

  return (
    <ToolPageTemplate toolData={toolPageData['pdf-to-image-converter']}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <div className="space-y-6">
          <PDFUploadZone onFileSelect={setFile} />

          <Card className="shadow-md border-border">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-lg">Conversion Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Page Selection</Label>
                <RadioGroup value={pageMode} onValueChange={setPageMode}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all-pages-img" />
                    <Label htmlFor="all-pages-img" className="cursor-pointer font-normal">All Pages</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specific" id="specific-pages-img" />
                    <Label htmlFor="specific-pages-img" className="cursor-pointer font-normal">Specific Pages</Label>
                  </div>
                </RadioGroup>
                
                {pageMode === 'specific' && (
                  <Input
                    type="text"
                    placeholder="e.g., 1-3, 5, 7-9"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Image Format</Label>
                <RadioGroup value={imageFormat} onValueChange={setImageFormat}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="png" id="format-png" />
                    <Label htmlFor="format-png" className="cursor-pointer font-normal">PNG (Lossless)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="jpg" id="format-jpg" />
                    <Label htmlFor="format-jpg" className="cursor-pointer font-normal">JPG (Compressed)</Label>
                  </div>
                </RadioGroup>
              </div>

              {imageFormat === 'jpg' && (
                <div className="space-y-2">
                  <Label>Quality: {quality[0]}%</Label>
                  <Slider
                    value={quality}
                    onValueChange={setQuality}
                    min={50}
                    max={100}
                    step={5}
                    className="py-4"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="dpi-select">Resolution (DPI)</Label>
                <Select value={dpi} onValueChange={setDpi}>
                  <SelectTrigger id="dpi-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="72">72 DPI (Screen)</SelectItem>
                    <SelectItem value="150">150 DPI (Standard)</SelectItem>
                    <SelectItem value="300">300 DPI (High Quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleConvert}
                disabled={!file || isProcessing}
                className="w-full font-semibold"
                size="lg"
              >
                <ImageIcon className="h-5 w-5 mr-2" />
                Convert to Images
              </Button>
            </CardContent>
          </Card>

          {isProcessing && (
            <PDFProgressIndicator
              progress={progress}
              status="Converting PDF to images..."
              isProcessing={isProcessing}
            />
          )}

          {convertedImages.length > 0 && !isProcessing && (
            <Card className="shadow-md border-border bg-emerald-50 dark:bg-emerald-950/20">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <ImageIcon className="h-5 w-5" />
                    <span className="font-semibold">{convertedImages.length} image(s) converted</span>
                  </div>
                  <Button onClick={downloadAllAsZip} className="w-full font-semibold" size="lg">
                    <Download className="h-5 w-5 mr-2" />
                    Download All as ZIP
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <PDFPreviewPanel file={file} title="Original PDF" />
          
          {convertedImages.length > 0 && (
            <Card className="shadow-md border-border">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <CardTitle className="text-lg">Converted Images</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {convertedImages.map((image) => (
                    <div key={image.pageNum} className="space-y-2">
                      <div className="border border-border rounded-lg overflow-hidden">
                        <img
                          src={image.dataUrl}
                          alt={`Page ${image.pageNum}`}
                          className="w-full h-auto"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadImage(image)}
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Page {image.pageNum}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default PDFToImageConverterPage;