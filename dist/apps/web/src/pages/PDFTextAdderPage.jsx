import React, { useState } from 'react';
import { Type } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

const PDFTextAdderPage = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [font, setFont] = useState('Helvetica');
  const [fontSize, setFontSize] = useState([24]);
  const [textColor, setTextColor] = useState('#000000');
  const [xPosition, setXPosition] = useState('50');
  const [yPosition, setYPosition] = useState('50');
  const [pageMode, setPageMode] = useState('all');
  const [pageRange, setPageRange] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modifiedPdfBytes, setModifiedPdfBytes] = useState(null);

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
  };

  const handleAddText = async () => {
    if (!file) {
      toast.error('Please upload a PDF file first');
      return;
    }

    if (!text.trim()) {
      toast.error('Please enter text to add');
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
      const x = parseFloat(xPosition);
      const y = parseFloat(yPosition);
      
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
      
      for (let i = 0; i < pagesToModify.length; i++) {
        const pageIndex = pagesToModify[i];
        const page = pages[pageIndex];
        const { width, height } = page.getSize();
        
        page.drawText(text, {
          x: (x / 100) * width,
          y: height - (y / 100) * height,
          size: fontSize[0],
          font: selectedFont,
          color: rgb(color.r, color.g, color.b)
        });
        
        setProgress(40 + (i / pagesToModify.length) * 50);
      }

      setProgress(90);

      const pdfBytes = await pdfDoc.save();
      setModifiedPdfBytes(pdfBytes);
      setProgress(100);
      
      toast.success(`Added text to ${pagesToModify.length} page(s) successfully`);
    } catch (error) {
      console.error('Text addition error:', error);
      toast.error('Failed to add text to PDF');
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  return (
    <CalculatorLayout
      title="PDF Text Adder"
      description="Add custom text to PDF pages with font, size, color, and position controls."
      category="Documents"
      categoryPath="/documents"
    >
      <SEOHead
        defaultTitle="Free PDF Text Adder - Add Text to PDF Online | Toolisiya"
        defaultDescription="Add custom text to PDF files online for free. Customize font, size, color, and position. No sign-up required."
        keywords="pdf text adder, add text to pdf, pdf text editor, pdf annotation, free pdf tools"
      />
      <BreadcrumbNavigation customTitle="PDF Text Adder" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <div className="space-y-6">
          <PDFUploadZone onFileSelect={setFile} />

          <Card className="shadow-md border-border">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-lg">Text Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="text-input">Text Content</Label>
                <Textarea
                  id="text-input"
                  placeholder="Enter text to add..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="font-select">Font</Label>
                  <Select value={font} onValueChange={setFont}>
                    <SelectTrigger id="font-select">
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
                  <Label htmlFor="color-input">Text Color</Label>
                  <Input
                    id="color-input"
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="x-position">X Position (%)</Label>
                  <Input
                    id="x-position"
                    type="number"
                    min="0"
                    max="100"
                    value={xPosition}
                    onChange={(e) => setXPosition(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="y-position">Y Position (%)</Label>
                  <Input
                    id="y-position"
                    type="number"
                    min="0"
                    max="100"
                    value={yPosition}
                    onChange={(e) => setYPosition(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Apply To</Label>
                <RadioGroup value={pageMode} onValueChange={setPageMode}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all-pages-text" />
                    <Label htmlFor="all-pages-text" className="cursor-pointer font-normal">All Pages</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specific" id="specific-pages-text" />
                    <Label htmlFor="specific-pages-text" className="cursor-pointer font-normal">Specific Pages</Label>
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
                onClick={handleAddText}
                disabled={!file || isProcessing}
                className="w-full font-semibold"
                size="lg"
              >
                <Type className="h-5 w-5 mr-2" />
                Add Text
              </Button>
            </CardContent>
          </Card>

          {isProcessing && (
            <PDFProgressIndicator
              progress={progress}
              status="Adding text to PDF..."
              isProcessing={isProcessing}
            />
          )}

          {modifiedPdfBytes && !isProcessing && (
            <Card className="shadow-md border-border bg-emerald-50 dark:bg-emerald-950/20">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <Type className="h-5 w-5" />
                    <span className="font-semibold">Text added successfully</span>
                  </div>
                  <PDFDownloadButton
                    pdfBytes={modifiedPdfBytes}
                    filename={`text-added-${file?.name || 'document.pdf'}`}
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

export default PDFTextAdderPage;