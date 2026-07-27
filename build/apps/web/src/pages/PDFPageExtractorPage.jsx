import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Scissors } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
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

const PDFPageExtractorPage = () => {
  const [file, setFile] = useState(null);
  const [selectionMode, setSelectionMode] = useState('range');
  const [pageRange, setPageRange] = useState('');
  const [selectedPages, setSelectedPages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedPdfBytes, setExtractedPdfBytes] = useState(null);

  const handleExtract = async () => {
    if (!file) {
      toast.error('Please upload a PDF file first');
      return;
    }

    let pagesToExtract = [];
    
    if (selectionMode === 'range') {
      if (!pageRange.trim()) {
        toast.error('Please enter page range');
        return;
      }
      
      const ranges = pageRange.split(',').map(r => r.trim());
      for (const range of ranges) {
        if (range.includes('-')) {
          const [start, end] = range.split('-').map(n => parseInt(n.trim()));
          for (let i = start; i <= end; i++) {
            pagesToExtract.push(i - 1);
          }
        } else {
          pagesToExtract.push(parseInt(range) - 1);
        }
      }
    } else {
      if (selectedPages.length === 0) {
        toast.error('Please select at least one page');
        return;
      }
      pagesToExtract = selectedPages.map(p => p - 1);
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = pdfDoc.getPageCount();
      
      setProgress(20);

      pagesToExtract = pagesToExtract.filter(p => p >= 0 && p < totalPages);
      
      if (pagesToExtract.length === 0) {
        toast.error('No valid pages to extract');
        setIsProcessing(false);
        return;
      }

      pagesToExtract.sort((a, b) => a - b);
      
      setProgress(40);

      const newPdfDoc = await PDFDocument.create();
      
      for (let i = 0; i < pagesToExtract.length; i++) {
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pagesToExtract[i]]);
        newPdfDoc.addPage(copiedPage);
        setProgress(40 + (i / pagesToExtract.length) * 50);
      }

      setProgress(90);

      const pdfBytes = await newPdfDoc.save();
      setExtractedPdfBytes(pdfBytes);
      setProgress(100);
      
      toast.success(`Extracted ${pagesToExtract.length} page(s) successfully`);
    } catch (error) {
      console.error('Extraction error:', error);
      toast.error('Failed to extract PDF pages');
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PDF Page Extractor",
    "applicationCategory": "UtilityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Extract specific pages from your PDF files. Select page ranges or individual pages and download as a new PDF document."
  };

  return (
    <CalculatorLayout
      title="PDF Page Extractor"
      description="Extract specific pages from your PDF files. Select page ranges or individual pages and download as a new PDF document."
      category="Documents"
      categoryPath="/documents"
    >
      <Helmet>
        <title>Free PDF Page Extractor - Extract Pages from PDF Online</title>
        <meta name="description" content="Extract specific pages from PDF files with our free online PDF page extractor. Select page ranges and download as a new PDF." />
        <meta name="keywords" content="pdf page extractor, extract pdf pages, pdf extraction tool, online pdf extractor" />
        <link rel="canonical" href="https://toolisiya.com/document/pdf-page-extractor" />
        
        <meta property="og:title" content="Free PDF Page Extractor - Extract Pages from PDF Online" />
        <meta property="og:description" content="Extract specific pages from PDF files with our free online PDF page extractor. Select page ranges and download as a new PDF." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://toolisiya.com/document/pdf-page-extractor" />
        
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <BreadcrumbNavigation customTitle="PDF Page Extractor" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        <div className="space-y-6">
          <PDFUploadZone onFileSelect={setFile} />

          <Card className="shadow-md border-border">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-lg">Page Selection</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Selection Mode</Label>
                <RadioGroup value={selectionMode} onValueChange={setSelectionMode}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="range" id="range-mode" />
                    <Label htmlFor="range-mode" className="cursor-pointer font-normal">Page Range</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="checkbox" id="checkbox-mode" />
                    <Label htmlFor="checkbox-mode" className="cursor-pointer font-normal">Select from Preview</Label>
                  </div>
                </RadioGroup>
                
                {selectionMode === 'range' && (
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="e.g., 1-5, 10-15, 20"
                      value={pageRange}
                      onChange={(e) => setPageRange(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter page numbers or ranges separated by commas
                    </p>
                  </div>
                )}
                
                {selectionMode === 'checkbox' && (
                  <p className="text-sm text-muted-foreground">
                    Click on pages in the preview to select them
                  </p>
                )}
              </div>

              <Button
                onClick={handleExtract}
                disabled={!file || isProcessing}
                className="w-full font-semibold"
                size="lg"
              >
                <Scissors className="h-5 w-5 mr-2" />
                Extract Pages
              </Button>
            </CardContent>
          </Card>

          {isProcessing && (
            <PDFProgressIndicator
              progress={progress}
              status="Extracting PDF pages..."
              isProcessing={isProcessing}
            />
          )}

          {extractedPdfBytes && !isProcessing && (
            <Card className="shadow-md border-border bg-emerald-50 dark:bg-emerald-950/20">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <Scissors className="h-5 w-5" />
                    <span className="font-semibold">Pages extracted successfully</span>
                  </div>
                  <PDFDownloadButton
                    pdfBytes={extractedPdfBytes}
                    filename={`extracted-${file?.name || 'document.pdf'}`}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <PDFPreviewPanel
            file={file}
            title="Select Pages to Extract"
            showCheckboxes={selectionMode === 'checkbox'}
            selectedPages={selectedPages}
            onPageSelect={setSelectedPages}
          />
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default PDFPageExtractorPage;