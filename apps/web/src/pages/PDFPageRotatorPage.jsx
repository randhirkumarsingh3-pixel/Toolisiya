import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { RotateCw } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import PDFUploadZone from '@/components/pdf/PDFUploadZone.jsx';
import PDFPreviewPanel from '@/components/pdf/PDFPreviewPanel.jsx';
import PDFProgressIndicator from '@/components/pdf/PDFProgressIndicator.jsx';
import PDFDownloadButton from '@/components/pdf/PDFDownloadButton.jsx';

const PDFPageRotatorPage = () => {
  const [file, setFile] = useState(null);
  const [pageMode, setPageMode] = useState('all');
  const [pageRange, setPageRange] = useState('');
  const [rotationAngle, setRotationAngle] = useState('90');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rotatedPdfBytes, setRotatedPdfBytes] = useState(null);

  const handleRotate = async () => {
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

      let pagesToRotate = [];
      if (pageMode === 'all') {
        pagesToRotate = Array.from({ length: totalPages }, (_, i) => i);
      } else {
        const ranges = pageRange.split(',').map(r => r.trim());
        for (const range of ranges) {
          if (range.includes('-')) {
            const [start, end] = range.split('-').map(n => parseInt(n.trim()));
            for (let i = start - 1; i < end && i < totalPages; i++) {
              if (i >= 0) pagesToRotate.push(i);
            }
          } else {
            const pageNum = parseInt(range) - 1;
            if (pageNum >= 0 && pageNum < totalPages) {
              pagesToRotate.push(pageNum);
            }
          }
        }
      }

      setProgress(40);

      const angle = parseInt(rotationAngle);
      const pages = pdfDoc.getPages();
      
      for (let i = 0; i < pagesToRotate.length; i++) {
        const pageIndex = pagesToRotate[i];
        const page = pages[pageIndex];
        page.setRotation(degrees(angle));
        setProgress(40 + (i / pagesToRotate.length) * 40);
      }

      setProgress(90);

      const pdfBytes = await pdfDoc.save();
      setRotatedPdfBytes(pdfBytes);
      setProgress(100);
      
      toast.success(`Rotated ${pagesToRotate.length} page(s) successfully`);
    } catch (error) {
      console.error('Rotation error:', error);
      toast.error('Failed to rotate PDF pages');
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PDF Page Rotator",
    "applicationCategory": "UtilityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Rotate PDF pages 90°, 180°, or 270° with ease. Select specific pages or rotate all pages at once. Download your rotated PDF instantly."
  };

  return (
    <CalculatorLayout
      title="PDF Page Rotator"
      description="Rotate PDF pages 90°, 180°, or 270° with ease. Select specific pages or rotate all pages at once. Download your rotated PDF instantly."
      category="Documents"
      categoryPath="/documents"
    >
      <Helmet>
        <title>Free PDF Page Rotator - Rotate PDF Pages 90°, 180°, 270° Online</title>
        <meta name="description" content="Rotate PDF pages easily with our free online PDF page rotator. Rotate single or multiple pages 90°, 180°, or 270° and download instantly." />
        <meta name="keywords" content="pdf page rotator, rotate pdf pages, pdf rotation tool, online pdf rotator" />
        <link rel="canonical" href="https://toolisiya.com/document/pdf-page-rotator" />
        
        <meta property="og:title" content="Free PDF Page Rotator - Rotate PDF Pages Online" />
        <meta property="og:description" content="Rotate PDF pages easily with our free online PDF page rotator. Rotate single or multiple pages 90°, 180°, or 270° and download instantly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://toolisiya.com/document/pdf-page-rotator" />
        
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <BreadcrumbNavigation customTitle="PDF Page Rotator" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <div className="space-y-6">
          <PDFUploadZone onFileSelect={setFile} />

          <Card className="shadow-md border-border">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-lg">Rotation Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Page Selection</Label>
                <RadioGroup value={pageMode} onValueChange={setPageMode}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all-pages" />
                    <Label htmlFor="all-pages" className="cursor-pointer font-normal">All Pages</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specific" id="specific-pages" />
                    <Label htmlFor="specific-pages" className="cursor-pointer font-normal">Specific Pages</Label>
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
                <Label className="text-base font-semibold">Rotation Angle</Label>
                <RadioGroup value={rotationAngle} onValueChange={setRotationAngle}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="90" id="rotate-90" />
                    <Label htmlFor="rotate-90" className="cursor-pointer font-normal">90° Clockwise</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="180" id="rotate-180" />
                    <Label htmlFor="rotate-180" className="cursor-pointer font-normal">180° (Upside Down)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="270" id="rotate-270" />
                    <Label htmlFor="rotate-270" className="cursor-pointer font-normal">270° Counter-Clockwise</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                onClick={handleRotate}
                disabled={!file || isProcessing}
                className="w-full font-semibold"
                size="lg"
              >
                <RotateCw className="h-5 w-5 mr-2" />
                Rotate Pages
              </Button>
            </CardContent>
          </Card>

          {isProcessing && (
            <PDFProgressIndicator
              progress={progress}
              status="Rotating PDF pages..."
              isProcessing={isProcessing}
            />
          )}

          {rotatedPdfBytes && !isProcessing && (
            <Card className="shadow-md border-border bg-emerald-50 dark:bg-emerald-950/20">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <RotateCw className="h-5 w-5" />
                    <span className="font-semibold">PDF rotated successfully</span>
                  </div>
                  <PDFDownloadButton
                    pdfBytes={rotatedPdfBytes}
                    filename={`rotated-${file?.name || 'document.pdf'}`}
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

export default PDFPageRotatorPage;