import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Hash } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
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

const PDFPageNumbererPage = () => {
  const [file, setFile] = useState(null);
  const [numberFormat, setNumberFormat] = useState('numeric');
  const [position, setPosition] = useState('bottom-center');
  const [font, setFont] = useState('Helvetica');
  const [startNumber, setStartNumber] = useState('1');
  const [skipFirstPage, setSkipFirstPage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [numberedPdfBytes, setNumberedPdfBytes] = useState(null);

  const formatPageNumber = (num, format) => {
    switch (format) {
      case 'numeric':
        return num.toString();
      case 'roman':
        const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
        return num <= 10 ? romanNumerals[num - 1] : num.toString();
      case 'alpha':
        return String.fromCharCode(96 + num);
      default:
        return num.toString();
    }
  };

  const getPosition = (width, height, textWidth) => {
    const margin = 30;
    switch (position) {
      case 'top-left':
        return { x: margin, y: height - margin };
      case 'top-center':
        return { x: (width - textWidth) / 2, y: height - margin };
      case 'top-right':
        return { x: width - textWidth - margin, y: height - margin };
      case 'bottom-left':
        return { x: margin, y: margin };
      case 'bottom-center':
        return { x: (width - textWidth) / 2, y: margin };
      case 'bottom-right':
        return { x: width - textWidth - margin, y: margin };
      default:
        return { x: (width - textWidth) / 2, y: margin };
    }
  };

  const handleAddPageNumbers = async () => {
    if (!file) {
      toast.error('Please upload a PDF file first');
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
      const pages = pdfDoc.getPages();
      const start = parseInt(startNumber) || 1;
      
      setProgress(40);

      for (let i = 0; i < totalPages; i++) {
        if (skipFirstPage && i === 0) continue;
        
        const page = pages[i];
        const { width, height } = page.getSize();
        const pageNum = skipFirstPage ? i : i + 1;
        const displayNum = start + (skipFirstPage ? i - 1 : i);
        const numberText = formatPageNumber(displayNum, numberFormat);
        const textWidth = selectedFont.widthOfTextAtSize(numberText, 12);
        const pos = getPosition(width, height, textWidth);
        
        page.drawText(numberText, {
          x: pos.x,
          y: pos.y,
          size: 12,
          font: selectedFont,
          color: rgb(0, 0, 0)
        });
        
        setProgress(40 + (i / totalPages) * 50);
      }

      setProgress(90);

      const pdfBytes = await pdfDoc.save();
      setNumberedPdfBytes(pdfBytes);
      setProgress(100);
      
      toast.success('Page numbers added successfully');
    } catch (error) {
      console.error('Page numbering error:', error);
      toast.error('Failed to add page numbers');
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PDF Page Numberer",
    "applicationCategory": "UtilityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Add page numbers to PDF files with customizable format, position, and font options."
  };

  return (
    <CalculatorLayout
      title="PDF Page Numberer"
      description="Add page numbers to PDF files with customizable format, position, and font options."
      category="Documents"
      categoryPath="/documents"
    >
      <Helmet>
        <title>Free PDF Page Numberer - Add Page Numbers to PDF Online</title>
        <meta name="description" content="Add page numbers to PDF files with customizable format, position, and font. Download numbered PDFs instantly." />
        <meta name="keywords" content="pdf page numberer, add page numbers, pdf numbering, number pdf pages" />
        <link rel="canonical" href="https://toolisiya.com/document/pdf-page-numberer" />
        
        <meta property="og:title" content="Free PDF Page Numberer - Add Page Numbers to PDF Online" />
        <meta property="og:description" content="Add page numbers to PDF files with customizable format, position, and font. Download numbered PDFs instantly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://toolisiya.com/document/pdf-page-numberer" />
        
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <BreadcrumbNavigation customTitle="PDF Page Numberer" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <div className="space-y-6">
          <PDFUploadZone onFileSelect={setFile} />

          <Card className="shadow-md border-border">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-lg">Numbering Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="number-format">Number Format</Label>
                <Select value={numberFormat} onValueChange={setNumberFormat}>
                  <SelectTrigger id="number-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="numeric">1, 2, 3...</SelectItem>
                    <SelectItem value="roman">i, ii, iii...</SelectItem>
                    <SelectItem value="alpha">a, b, c...</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position-select">Position</Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger id="position-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="top-center">Top Center</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="bottom-center">Bottom Center</SelectItem>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-select-num">Font</Label>
                <Select value={font} onValueChange={setFont}>
                  <SelectTrigger id="font-select-num">
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
                <Label htmlFor="start-number">Start Number</Label>
                <Input
                  id="start-number"
                  type="number"
                  min="1"
                  value={startNumber}
                  onChange={(e) => setStartNumber(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="skip-first"
                  checked={skipFirstPage}
                  onCheckedChange={setSkipFirstPage}
                />
                <Label htmlFor="skip-first" className="cursor-pointer font-normal">
                  Skip first page
                </Label>
              </div>

              <Button
                onClick={handleAddPageNumbers}
                disabled={!file || isProcessing}
                className="w-full font-semibold"
                size="lg"
              >
                <Hash className="h-5 w-5 mr-2" />
                Add Page Numbers
              </Button>
            </CardContent>
          </Card>

          {isProcessing && (
            <PDFProgressIndicator
              progress={progress}
              status="Adding page numbers..."
              isProcessing={isProcessing}
            />
          )}

          {numberedPdfBytes && !isProcessing && (
            <Card className="shadow-md border-border bg-emerald-50 dark:bg-emerald-950/20">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <Hash className="h-5 w-5" />
                    <span className="font-semibold">Page numbers added successfully</span>
                  </div>
                  <PDFDownloadButton
                    pdfBytes={numberedPdfBytes}
                    filename={`numbered-${file?.name || 'document.pdf'}`}
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

export default PDFPageNumbererPage;