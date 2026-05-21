import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { AlignJustify } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
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

const PDFHeaderFooterAdderPage = () => {
  const [file, setFile] = useState(null);
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [font, setFont] = useState('Helvetica');
  const [textColor, setTextColor] = useState('#000000');
  const [includePageNumbers, setIncludePageNumbers] = useState(false);
  const [includeDate, setIncludeDate] = useState(false);
  const [alignment, setAlignment] = useState('center');
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

  const getAlignmentX = (width, textWidth, align) => {
    switch (align) {
      case 'left':
        return 30;
      case 'center':
        return (width - textWidth) / 2;
      case 'right':
        return width - textWidth - 30;
      default:
        return (width - textWidth) / 2;
    }
  };

  const handleAddHeaderFooter = async () => {
    if (!file) {
      toast.error('Please upload a PDF file first');
      return;
    }

    if (!headerText.trim() && !footerText.trim()) {
      toast.error('Please enter header or footer text');
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
      const currentDate = new Date().toLocaleDateString();
      
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
        
        if (headerText.trim()) {
          let headerContent = headerText;
          if (includePageNumbers) headerContent += ` - Page ${pageIndex + 1}`;
          if (includeDate) headerContent += ` - ${currentDate}`;
          
          const headerWidth = selectedFont.widthOfTextAtSize(headerContent, 10);
          const headerX = getAlignmentX(width, headerWidth, alignment);
          
          page.drawText(headerContent, {
            x: headerX,
            y: height - 30,
            size: 10,
            font: selectedFont,
            color: rgb(color.r, color.g, color.b)
          });
        }
        
        if (footerText.trim()) {
          let footerContent = footerText;
          if (includePageNumbers) footerContent += ` - Page ${pageIndex + 1}`;
          if (includeDate) footerContent += ` - ${currentDate}`;
          
          const footerWidth = selectedFont.widthOfTextAtSize(footerContent, 10);
          const footerX = getAlignmentX(width, footerWidth, alignment);
          
          page.drawText(footerContent, {
            x: footerX,
            y: 30,
            size: 10,
            font: selectedFont,
            color: rgb(color.r, color.g, color.b)
          });
        }
        
        setProgress(40 + (i / pagesToModify.length) * 50);
      }

      setProgress(90);

      const pdfBytes = await pdfDoc.save();
      setModifiedPdfBytes(pdfBytes);
      setProgress(100);
      
      toast.success(`Added header/footer to ${pagesToModify.length} page(s) successfully`);
    } catch (error) {
      console.error('Header/footer addition error:', error);
      toast.error('Failed to add header/footer');
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PDF Header Footer Adder",
    "applicationCategory": "UtilityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Add custom headers and footers to PDF files with page numbers, dates, and formatting options."
  };

  return (
    <CalculatorLayout
      title="PDF Header Footer Adder"
      description="Add custom headers and footers to PDF files with page numbers, dates, and formatting options."
      category="Documents"
      categoryPath="/documents"
    >
      <Helmet>
        <title>Free PDF Header Footer Adder - Add Headers & Footers Online</title>
        <meta name="description" content="Add custom headers and footers to PDF files. Include page numbers, dates, and custom text with formatting options." />
        <meta name="keywords" content="pdf header footer, add header to pdf, pdf footer tool, customize pdf headers" />
        <link rel="canonical" href="https://toolisiya.com/document/pdf-header-footer-adder" />
        
        <meta property="og:title" content="Free PDF Header Footer Adder - Add Headers & Footers Online" />
        <meta property="og:description" content="Add custom headers and footers to PDF files. Include page numbers, dates, and custom text with formatting options." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://toolisiya.com/document/pdf-header-footer-adder" />
        
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <BreadcrumbNavigation customTitle="PDF Header Footer Adder" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <div className="space-y-6">
          <PDFUploadZone onFileSelect={setFile} />

          <Card className="shadow-md border-border">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-lg">Header & Footer Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="header-text">Header Text</Label>
                <Input
                  id="header-text"
                  type="text"
                  placeholder="Enter header text..."
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer-text">Footer Text</Label>
                <Input
                  id="footer-text"
                  type="text"
                  placeholder="Enter footer text..."
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="font-select-hf">Font</Label>
                  <Select value={font} onValueChange={setFont}>
                    <SelectTrigger id="font-select-hf">
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
                  <Label htmlFor="color-input-hf">Text Color</Label>
                  <Input
                    id="color-input-hf"
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-11 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alignment-select">Alignment</Label>
                <Select value={alignment} onValueChange={setAlignment}>
                  <SelectTrigger id="alignment-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-page-numbers"
                    checked={includePageNumbers}
                    onCheckedChange={setIncludePageNumbers}
                  />
                  <Label htmlFor="include-page-numbers" className="cursor-pointer font-normal">
                    Include page numbers
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-date"
                    checked={includeDate}
                    onCheckedChange={setIncludeDate}
                  />
                  <Label htmlFor="include-date" className="cursor-pointer font-normal">
                    Include current date
                  </Label>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Apply To</Label>
                <RadioGroup value={pageMode} onValueChange={setPageMode}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all-pages-hf" />
                    <Label htmlFor="all-pages-hf" className="cursor-pointer font-normal">All Pages</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specific" id="specific-pages-hf" />
                    <Label htmlFor="specific-pages-hf" className="cursor-pointer font-normal">Specific Pages</Label>
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
                onClick={handleAddHeaderFooter}
                disabled={!file || isProcessing}
                className="w-full font-semibold"
                size="lg"
              >
                <AlignJustify className="h-5 w-5 mr-2" />
                Add Header/Footer
              </Button>
            </CardContent>
          </Card>

          {isProcessing && (
            <PDFProgressIndicator
              progress={progress}
              status="Adding header and footer..."
              isProcessing={isProcessing}
            />
          )}

          {modifiedPdfBytes && !isProcessing && (
            <Card className="shadow-md border-border bg-emerald-50 dark:bg-emerald-950/20">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <AlignJustify className="h-5 w-5" />
                    <span className="font-semibold">Header/footer added successfully</span>
                  </div>
                  <PDFDownloadButton
                    pdfBytes={modifiedPdfBytes}
                    filename={`header-footer-${file?.name || 'document.pdf'}`}
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

export default PDFHeaderFooterAdderPage;