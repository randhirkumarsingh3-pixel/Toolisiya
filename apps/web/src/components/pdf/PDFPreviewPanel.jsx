import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFPreviewPanel = ({ 
  file, 
  selectedPages = [], 
  onPageSelect, 
  showCheckboxes = false,
  title = "PDF Preview" 
}) => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [thumbnails, setThumbnails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) {
      setPdfDoc(null);
      setThumbnails([]);
      setNumPages(0);
      return;
    }

    const loadPDF = async () => {
      setLoading(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        
        // Generate thumbnails for all pages
        const thumbs = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.3 });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
          
          thumbs.push({
            pageNum: i,
            dataUrl: canvas.toDataURL()
          });
        }
        
        setThumbnails(thumbs);
      } catch (error) {
        console.error('Error loading PDF:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, [file]);

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
    if (onPageSelect && showCheckboxes) {
      const isSelected = selectedPages.includes(pageNum);
      if (isSelected) {
        onPageSelect(selectedPages.filter(p => p !== pageNum));
      } else {
        onPageSelect([...selectedPages, pageNum]);
      }
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));

  if (!file) {
    return (
      <Card className="shadow-md border-border">
        <CardHeader className="bg-muted/30 border-b pb-4">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-muted-foreground">
            <p>Upload a PDF to see preview</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border-border">
      <CardHeader className="bg-muted/30 border-b pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleZoomOut} disabled={zoom <= 0.5}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button size="sm" variant="outline" onClick={handleZoomIn} disabled={zoom >= 2}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading PDF...</p>
          </div>
        ) : (
          <>
            <div className="pdf-preview-container custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {thumbnails.map((thumb) => {
                  const isSelected = selectedPages.includes(thumb.pageNum);
                  return (
                    <div key={thumb.pageNum} className="relative">
                      <div
                        className={`pdf-thumbnail ${isSelected ? 'selected' : ''}`}
                        onClick={() => handlePageClick(thumb.pageNum)}
                        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
                      >
                        <img
                          src={thumb.dataUrl}
                          alt={`Page ${thumb.pageNum}`}
                          className="w-full h-auto"
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Page {thumb.pageNum}
                        </span>
                        {showCheckboxes && (
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handlePageClick(thumb.pageNum)}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {numPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(numPages, prev + 1))}
                disabled={currentPage === numPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PDFPreviewPanel;