import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Download, X, Loader2, AlertCircle } from 'lucide-react';

const PDFPreviewModal = ({ 
  isOpen = false, 
  onClose = () => {}, 
  pdfBlob = null, 
  filename = 'document.pdf' 
}) => {
  const [zoom, setZoom] = useState(100);
  const [pdfUrl, setPdfUrl] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isOpen && pdfBlob) {
      try {
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
        setHasError(false);
        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error("Failed to create PDF URL:", error);
        setHasError(true);
        setPdfUrl('');
      }
    } else if (!isOpen) {
      // Cleanup when closed
      setPdfUrl('');
      setZoom(100);
      setHasError(false);
    }
  }, [pdfBlob, isOpen]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 150));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 75));

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between bg-muted/30">
          <DialogTitle className="text-lg font-semibold">PDF Preview</DialogTitle>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-background border rounded-md p-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut} disabled={zoom <= 75 || !pdfUrl}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn} disabled={zoom >= 150 || !pdfUrl}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleDownload} size="sm" className="gap-2" disabled={!pdfUrl}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 bg-muted/50 overflow-auto relative flex items-center justify-center p-4">
          {hasError ? (
            <div className="flex flex-col items-center text-destructive text-center max-w-md">
              <AlertCircle className="h-10 w-10 mb-3" />
              <p className="font-medium text-lg mb-1">Failed to load PDF</p>
              <p className="text-sm text-muted-foreground">There was an error generating the document preview. Please try downloading it instead or check your inputs.</p>
            </div>
          ) : !pdfUrl ? (
            <div className="flex flex-col items-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-3 text-primary" />
              <p className="font-medium">Generating document...</p>
              <p className="text-sm opacity-80">This might take a few seconds</p>
            </div>
          ) : (
            <div 
              className="bg-white shadow-xl transition-transform duration-200 origin-top"
              style={{ 
                width: '100%', 
                maxWidth: '800px', 
                height: '100%',
                transform: `scale(${zoom / 100})` 
              }}
            >
              <iframe 
                src={`${pdfUrl}#toolbar=0&navpanes=0`} 
                className="w-full h-full border-0"
                title="PDF Preview"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFPreviewModal;