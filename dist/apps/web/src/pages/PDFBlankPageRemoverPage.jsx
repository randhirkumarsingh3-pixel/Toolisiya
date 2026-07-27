import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Eraser } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import PDFUploadZone from '@/components/pdf/PDFUploadZone.jsx';
import PDFPreviewPanel from '@/components/pdf/PDFPreviewPanel.jsx';
import PDFProgressIndicator from '@/components/pdf/PDFProgressIndicator.jsx';
import PDFDownloadButton from '@/components/pdf/PDFDownloadButton.jsx';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFBlankPageRemoverPage = () => {
  const [file, setFile] = useState(null);
  const [sensitivity, setSensitivity] = useState([50]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedPdfBytes, setProcessedPdfBytes] = useState(null);
  const [blankPagesFound, setBlankPagesFound] = useState(0);

  const isPageBlank = async (page, sensitivityValue) => {
    const viewport = page.getViewport({ scale: 1 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let whitePixels = 0;
    const totalPixels = data.length / 4;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      if (r > 250 && g > 250 && b > 250) {
        whitePixels++;
      }
    }
    
    const whitePercentage = (whitePixels / totalPixels) * 100;
    return whitePercentage >= sensitivityValue;
  };

  const handleRemoveBlankPages = async () => {
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
      
      setProgress(10);

      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      setProgress(20);

      const blankPages = [];
      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const isBlank = await isPageBlank(page, sensitivity[0]);
        if (isBlank) {
          blankPages.push(i - 1);
        }
        setProgress(20 + (i / totalPages) * 50);
      }

      setBlankPagesFound(blankPages.length);
      setProgress(70);

      if (blankPages.length === 0) {
        toast.error('No blank pages found');
        setIsProcessing(false);
        return;
      }

      const newPdfDoc = await PDFDocument.create();
      for (let i = 0; i < totalPages; i++) {
        if (!blankPages.includes(i)) {
          const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
          newPdfDoc.addPage(copiedPage);
        }
        setProgress(70 + (i / totalPages) * 20);
      }

      setProgress(90);

      const pdfBytes = await newPdfDoc.save();
      setProcessedPdfBytes(pdfBytes);
      setProgress(100);
      
      toast.success(`Removed ${blankPages.length} blank page(s) successfully`);
    } catch (error) {
      console.error('Blank page removal error:', error);
      toast.error('Failed to remove blank pages');
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PDF Blank Page Remover",
    "applicationCategory": "UtilityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Automatically detect and remove blank pages from PDF files. Adjust sensitivity and preview results before downloading."
  };

  return (
    <CalculatorLayout
      title="PDF Blank Page Remover"
      description="Automatically detect and remove blank pages from PDF files. Adjust sensitivity and preview results before downloading."
      category="Documents"
      categoryPath="/documents"
    >
      <Helmet>
        <title>Free PDF Blank Page Remover - Remove Empty Pages Online</title>
        <meta name="description" content="Automatically detect and remove blank pages from PDF files. Adjust sensitivity and download cleaned PDFs instantly." />
        <meta name="keywords" content="pdf blank page remover, remove empty pages, clean pdf, pdf optimizer" />
        <link rel="canonical" href="https://toolisiya.com/document/pdf-blank-page-remover" />
        
        <meta property="og:title" content="Free PDF Blank Page Remover - Remove Empty Pages Online" />
        <meta property="og:description" content="Automatically detect and remove blank pages from PDF files. Adjust sensitivity and download cleaned PDFs instantly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://toolisiya.com/document/pdf-blank-page-remover" />
        
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <BreadcrumbNavigation customTitle="PDF Blank Page Remover" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <div className="space-y-6">
          <PDFUploadZone onFileSelect={setFile} />

          <Card className="shadow-md border-border">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-lg">Detection Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Sensitivity: {sensitivity[0]}%</Label>
                <Slider
                  value={sensitivity}
                  onValueChange={setSensitivity}
                  min={0}
                  max={100}
                  step={5}
                  className="py-4"
                />
                <p className="text-xs text-muted-foreground">
                  Higher sensitivity detects more pages as blank. Lower sensitivity is more strict.
                </p>
              </div>

              <Button
                onClick={handleRemoveBlankPages}
                disabled={!file || isProcessing}
                className="w-full font-semibold"
                size="lg"
              >
                <Eraser className="h-5 w-5 mr-2" />
                Remove Blank Pages
              </Button>
            </CardContent>
          </Card>

          {isProcessing && (
            <PDFProgressIndicator
              progress={progress}
              status="Detecting and removing blank pages..."
              isProcessing={isProcessing}
            />
          )}

          {processedPdfBytes && !isProcessing && (
            <Card className="shadow-md border-border bg-emerald-50 dark:bg-emerald-950/20">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <Eraser className="h-5 w-5" />
                    <span className="font-semibold">Removed {blankPagesFound} blank page(s)</span>
                  </div>
                  <PDFDownloadButton
                    pdfBytes={processedPdfBytes}
                    filename={`cleaned-${file?.name || 'document.pdf'}`}
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

export default PDFBlankPageRemoverPage;