import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { QrCode } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import QRCodeLib from 'qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import PDFUploadZone from '@/components/pdf/PDFUploadZone.jsx';
import PDFPreviewPanel from '@/components/pdf/PDFPreviewPanel.jsx';
import PDFProgressIndicator from '@/components/pdf/PDFProgressIndicator.jsx';
import PDFDownloadButton from '@/components/pdf/PDFDownloadButton.jsx';

const PDFQRCodeAdderPage = () => {
  const [file, setFile] = useState(null);
  const [qrText, setQrText] = useState('');
  const [qrSize, setQrSize] = useState([100]);
  const [xPosition, setXPosition] = useState('50');
  const [yPosition, setYPosition] = useState('50');
  const [pageMode, setPageMode] = useState('all');
  const [pageRange, setPageRange] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modifiedPdfBytes, setModifiedPdfBytes] = useState(null);

  const handleAddQRCode = async () => {
    if (!file) {
      toast.error('Please upload a PDF file first');
      return;
    }

    if (!qrText.trim()) {
      toast.error('Please enter text or URL for QR code');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = pdfDoc.getPageCount();
      
      setProgress(20);

      const qrCodeDataUrl = await QRCodeLib.toDataURL(qrText, {
        width: qrSize[0] * 2,
        margin: 1
      });
      
      setProgress(40);

      const qrImageBytes = await fetch(qrCodeDataUrl).then(res => res.arrayBuffer());
      const qrImage = await pdfDoc.embedPng(qrImageBytes);
      
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
        
        const x = (parseFloat(xPosition) / 100) * width;
        const y = height - (parseFloat(yPosition) / 100) * height;
        
        page.drawImage(qrImage, {
          x: x,
          y: y - qrSize[0],
          width: qrSize[0],
          height: qrSize[0]
        });
        
        setProgress(40 + (i / pagesToModify.length) * 50);
      }

      setProgress(90);

      const pdfBytes = await pdfDoc.save();
      setModifiedPdfBytes(pdfBytes);
      setProgress(100);
      
      toast.success(`Added QR code to ${pagesToModify.length} page(s) successfully`);
    } catch (error) {
      console.error('QR code addition error:', error);
      toast.error('Failed to add QR code');
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PDF QR Code Adder",
    "applicationCategory": "UtilityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Add QR codes to PDF files with customizable size and position. Generate QR codes from text or URLs."
  };

  return (
    <CalculatorLayout
      title="PDF QR Code Adder"
      description="Add QR codes to PDF files with customizable size and position. Generate QR codes from text or URLs."
      category="Documents"
      categoryPath="/documents"
    >
      <Helmet>
        <title>Free PDF QR Code Adder - Add QR Codes to PDF Online</title>
        <meta name="description" content="Add QR codes to PDF files. Generate QR codes from text or URLs with customizable size and position." />
        <meta name="keywords" content="pdf qr code, add qr code to pdf, qr code generator, pdf qr tool" />
        <link rel="canonical" href="https://toolisiya.com/document/pdf-qr-code-adder" />
        
        <meta property="og:title" content="Free PDF QR Code Adder - Add QR Codes to PDF Online" />
        <meta property="og:description" content="Add QR codes to PDF files. Generate QR codes from text or URLs with customizable size and position." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://toolisiya.com/document/pdf-qr-code-adder" />
        
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <BreadcrumbNavigation customTitle="PDF QR Code Adder" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <div className="space-y-6">
          <PDFUploadZone onFileSelect={setFile} />

          <Card className="shadow-md border-border">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-lg">QR Code Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="qr-text">QR Code Content (Text or URL)</Label>
                <Input
                  id="qr-text"
                  type="text"
                  placeholder="Enter text or URL..."
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>QR Code Size: {qrSize[0]}px</Label>
                <Slider
                  value={qrSize}
                  onValueChange={setQrSize}
                  min={50}
                  max={200}
                  step={10}
                  className="py-4"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="x-position-qr">X Position (%)</Label>
                  <Input
                    id="x-position-qr"
                    type="number"
                    min="0"
                    max="100"
                    value={xPosition}
                    onChange={(e) => setXPosition(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="y-position-qr">Y Position (%)</Label>
                  <Input
                    id="y-position-qr"
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
                    <RadioGroupItem value="all" id="all-pages-qr" />
                    <Label htmlFor="all-pages-qr" className="cursor-pointer font-normal">All Pages</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specific" id="specific-pages-qr" />
                    <Label htmlFor="specific-pages-qr" className="cursor-pointer font-normal">Specific Pages</Label>
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
                onClick={handleAddQRCode}
                disabled={!file || isProcessing}
                className="w-full font-semibold"
                size="lg"
              >
                <QrCode className="h-5 w-5 mr-2" />
                Add QR Code
              </Button>
            </CardContent>
          </Card>

          {isProcessing && (
            <PDFProgressIndicator
              progress={progress}
              status="Adding QR code to PDF..."
              isProcessing={isProcessing}
            />
          )}

          {modifiedPdfBytes && !isProcessing && (
            <Card className="shadow-md border-border bg-emerald-50 dark:bg-emerald-950/20">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <QrCode className="h-5 w-5" />
                    <span className="font-semibold">QR code added successfully</span>
                  </div>
                  <PDFDownloadButton
                    pdfBytes={modifiedPdfBytes}
                    filename={`qr-code-${file?.name || 'document.pdf'}`}
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

export default PDFQRCodeAdderPage;