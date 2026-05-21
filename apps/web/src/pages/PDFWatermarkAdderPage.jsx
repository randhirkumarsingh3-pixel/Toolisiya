import React, { useState } from 'react';
import { Droplet } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import SEOHead from '@/components/SEOHead.jsx';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import PDFUploadZone from '@/components/pdf/PDFUploadZone.jsx';
import PDFPreviewPanel from '@/components/pdf/PDFPreviewPanel.jsx';
import PDFProgressIndicator from '@/components/pdf/PDFProgressIndicator.jsx';
import PDFDownloadButton from '@/components/pdf/PDFDownloadButton.jsx';

const FONT_MAP = {
  'Helvetica': StandardFonts.Helvetica,
  'Times-Roman': StandardFonts.TimesRoman,
  'Courier': StandardFonts.Courier
};

const PDFWatermarkAdderPage = () => {
  const [file, setFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [font, setFont] = useState('Helvetica');
  const [fontSize, setFontSize] = useState([48]);
  const [textColor, setTextColor] = useState('#cccccc');
  const [opacity, setOpacity] = useState([30]);
  const [position, setPosition] = useState('center');
  const [customX, setCustomX] = useState('50');
  const [customY, setCustomY] = useState('50');
  const [rotation, setRotation] = useState([45]);
  const [pageMode, setPageMode] = useState('all');
  const [pageRange, setPageRange] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [watermarkedPdfBytes, setWatermarkedPdfBytes] = useState(null);

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0.8, g: 0.8, b: 0.8 };
  };

  const getPosition = (width, height, textWidth, textHeight) => {
    switch (position) {
      case 'center':
        return { x: (width - textWidth) / 2, y: (height - textHeight) / 2 };
      case 'top-left':
        return { x: 50, y: height - 50 };
      case 'top-right':
        return { x: width - textWidth - 50, y: height - 50 };
      case 'bottom-left':
        return { x: 50, y: 50 };
      case 'bottom-right':
        return { x: width - textWidth - 50, y: 50 };
      case 'custom':
        return { x: (parseFloat(customX) / 100) * width, y: height - (parseFloat(customY) / 100) * height };
      default:
        return { x: (width - textWidth) / 2, y: (height - textHeight) / 2 };
    }
  };

  const handleAddWatermark = async () => {
    if (!file) {
      toast.error('Please upload a PDF file first');
      return;
    }

    if (!watermarkText.trim()) {
      toast.error('Please enter watermark text');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = pdfDoc.getPageCount();
      
      setProgress(20);

      const selectedFont = await pdfDoc.embedFont(FONT_MAP[font]);
      const color = hexToRgb(textColor);
      const textOpacity = opacity[0] / 100;
      
      setProgress(40);

      let pagesToModify = [];
      if (pageMode === 'all') {
        pagesToModify = Array.from({ length: totalPages }, (_, i) => i);
      } else {
        const ranges = pageRange.split(',').map(r => r.trim());
        for (const range of ranges) {
          if (range.includes('-')) {
            const [start, end] = range.split('-').map(n => parseInt(n.trim()));
            for (let i = start - 1; i < end && i < totalPages; i++) {
              if (i >= 0) pagesToModify.push(i);
            }
          } else {
            const pageNum = parseInt(range) - 1;
            if (pageNum >= 0 && pageNum < totalPages) {
              pagesToModify.push(pageNum);
            }
          }
        }
      }

      const pages = pdfDoc.getPages();
      const textWidth = selectedFont.widthOfTextAtSize(watermarkText, fontSize[0]);
      const textHeight = fontSize[0];
      
      for (let i = 0; i < pagesToModify.length; i++) {
        const pageIndex = pagesToModify[i];
        const page = pages[pageIndex];
        const { width, height } = page.getSize();
        
        const pos = getPosition(width, height, textWidth, textHeight);
        
        page.drawText(watermarkText, {
          x: pos.x,
          y: pos.y,
          size: fontSize[0],
          font: selectedFont,
          color: rgb(color.r, color.g, color.b),
          opacity: textOpacity,
          rotate: degrees(rotation[0])
        });
        
        setProgress(40 + (i / pagesToModify.length) * 50);
      }

      setProgress(90);

      const pdfBytes = await pdfDoc.save();
      setWatermarkedPdfBytes(pdfBytes);
      setProgress(100);
      
      toast.success(`Added watermark to ${pagesToModify.length} page(s) successfully`);
    } catch (error) {
      console.error('Watermark addition error:', error);
      toast.error('Failed to add watermark to PDF');
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  return (
    <CalculatorLayout
      title="PDF Watermark Adder"
      description="Add custom watermarks to PDF pages with opacity, rotation, and position controls."
      category="Documents"
      categoryPath="/documents"
    >
      <SEOHead
        defaultTitle="Free PDF Watermark Adder - Add Watermark to PDF Online | Toolisiya"
        defaultDescription="Add custom watermarks to PDF files online for free. Control opacity, rotation, position, and styling. No sign-up required."
        keywords="pdf watermark, add watermark to pdf, pdf watermark tool, watermark pdf online, free pdf tools"
      />
      <BreadcrumbNavigation customTitle="PDF Watermark Adder" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <div className="space-y-6">
          <PDFUploadZone onFileSelect={setFile} />

          <Card className="shadow-md border-border">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-lg">Watermark Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="watermark-text">Watermark Text</Label>
                <Input
                  id="watermark-text"
                  type="text"
                  placeholder="Enter watermark text..."
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="font-select-wm">Font</Label>
                  <Select value={font} onValueChange={setFont}>
                    <SelectTrigger id="font-select-wm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times-Roman">Times Roman</SelectItem>
                      <SelectItem value="Courier">Courier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color-input-wm">Color</Label>
                  <Input
                    id="color-input-wm"
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-11 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Font Size: {fontSize[0]}pt</Label>
                <Slider
                  value={fontSize}
                  onValueChange={setFontSize}
                  min={8}
                  max={72}
                  step={1}
                  className="py-4"
                />
              </div>

              <div className="space-y-2">
                <Label>Opacity: {opacity[0]}%</Label>
                <Slider
                  value={opacity}
                  onValueChange={setOpacity}
                  min={0}
                  max={100}
                  step={5}
                  className="py-4"
                />
              </div>

              <div className="space-y-2">
                <Label>Rotation: {rotation[0]}°</Label>
                <Slider
                  value={rotation}
                  onValueChange={setRotation}
                  min={-45}
                  max={45}
                  step={5}
                  className="py-4"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Position</Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="custom">Custom Position</SelectItem>
                  </SelectContent>
                </Select>
                
                {position === 'custom' && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="custom-x">X (%)</Label>
                      <Input
                        id="custom-x"
                        type="number"
                        min="0"
                        max="100"
                        value={customX}
                        onChange={(e) => setCustomX(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custom-y">Y (%)</Label>
                      <Input
                        id="custom-y"
                        type="number"
                        min="0"
                        max="100"
                        value={customY}
                        onChange={(e) => setCustomY(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Apply To</Label>
                <RadioGroup value={pageMode} onValueChange={setPageMode}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all-pages-wm" />
                    <Label htmlFor="all-pages-wm" className="cursor-pointer font-normal">All Pages</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specific" id="specific-pages-wm" />
                    <Label htmlFor="specific-pages-wm" className="cursor-pointer font-normal">Specific Pages</Label>
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

              <Button
                onClick={handleAddWatermark}
                disabled={!file || isProcessing}
                className="w-full font-semibold"
                size="lg"
              >
                <Droplet className="h-5 w-5 mr-2" />
                Add Watermark
              </Button>
            </CardContent>
          </Card>

          {isProcessing && (
            <PDFProgressIndicator
              progress={progress}
              status="Adding watermark to PDF..."
              isProcessing={isProcessing}
            />
          )}

          {watermarkedPdfBytes && !isProcessing && (
            <Card className="shadow-md border-border bg-emerald-50 dark:bg-emerald-950/20">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <Droplet className="h-5 w-5" />
                    <span className="font-semibold">Watermark added successfully</span>
                  </div>
                  <PDFDownloadButton
                    pdfBytes={watermarkedPdfBytes}
                    filename={`watermarked-${file?.name || 'document.pdf'}`}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <PDFPreviewPanel file={file} title="Original PDF" />
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default PDFWatermarkAdderPage;