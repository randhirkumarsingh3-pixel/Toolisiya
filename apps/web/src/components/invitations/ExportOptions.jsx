import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, FileImage, FileText, Archive, Printer, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ExportOptions = ({ previewRef, invitationName = 'invitation' }) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportAsPDF = async () => {
    if (!previewRef?.current) {
      toast.error('Preview not available');
      return;
    }

    setIsExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${invitationName}.pdf`);

      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsImage = async (format = 'png') => {
    if (!previewRef?.current) {
      toast.error('Preview not available');
      return;
    }

    setIsExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${invitationName}.${format}`;
        link.click();
        URL.revokeObjectURL(url);

        toast.success(`${format.toUpperCase()} downloaded successfully`);
        setIsExporting(false);
      }, `image/${format}`);
    } catch (error) {
      console.error('Image export error:', error);
      toast.error('Failed to export image');
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Export & Download</h3>
          <p className="text-sm text-muted-foreground">Save your invitation in various formats</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            onClick={exportAsPDF}
            disabled={isExporting}
            className="flex flex-col h-auto py-4 gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
            <span className="text-xs">PDF</span>
          </Button>

          <Button
            onClick={() => exportAsImage('png')}
            disabled={isExporting}
            variant="outline"
            className="flex flex-col h-auto py-4 gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <FileImage className="h-5 w-5" />
            )}
            <span className="text-xs">PNG</span>
          </Button>

          <Button
            onClick={() => exportAsImage('jpeg')}
            disabled={isExporting}
            variant="outline"
            className="flex flex-col h-auto py-4 gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Download className="h-5 w-5" />
            )}
            <span className="text-xs">JPG</span>
          </Button>

          <Button
            onClick={handlePrint}
            variant="outline"
            className="flex flex-col h-auto py-4 gap-2"
          >
            <Printer className="h-5 w-5" />
            <span className="text-xs">Print</span>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center pt-2">
          High-quality exports ready for printing or digital sharing
        </p>
      </div>
    </Card>
  );
};

export default ExportOptions;