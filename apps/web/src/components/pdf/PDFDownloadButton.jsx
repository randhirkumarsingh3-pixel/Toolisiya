import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PDFDownloadButton = ({ pdfBytes, filename = 'document.pdf', disabled = false }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!pdfBytes) {
      toast.error('No PDF available to download');
      return;
    }

    setIsDownloading(true);
    try {
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={disabled || isDownloading || !pdfBytes}
      className="w-full sm:w-auto font-semibold"
      size="lg"
    >
      <Download className="h-5 w-5 mr-2" />
      {isDownloading ? 'Downloading...' : 'Download PDF'}
    </Button>
  );
};

export default PDFDownloadButton;