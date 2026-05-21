import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import { Download, FileImage, Printer, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const BarcodeGeneratorPage = () => {
  const [data, setData] = useState('TOOLISIYA-12345');
  const [format, setFormat] = useState('CODE128');
  const [size, setSize] = useState(150);
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (format !== 'QR') {
      try {
        if (barcodeRef.current && data) {
          JsBarcode(barcodeRef.current, data, {
            format: format,
            width: size / 75,
            height: size,
            displayValue: true,
            margin: 10,
            background: '#ffffff',
            lineColor: '#000000'
          });
        }
      } catch (error) {
        const ctx = barcodeRef.current?.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, barcodeRef.current.width, barcodeRef.current.height);
          ctx.font = '14px Arial';
          ctx.fillStyle = '#ef4444';
          ctx.fillText('Invalid data for this format', 10, 50);
        }
      }
    }
  }, [data, format, size]);

  const handleDownloadPNG = () => {
    if (format === 'QR') {
      const svg = document.getElementById('qr-code');
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const a = document.createElement('a');
        a.download = `qrcode_${data}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
        toast.success('Downloaded PNG');
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    } else {
      if (!barcodeRef.current) return;
      const a = document.createElement('a');
      a.download = `barcode_${format}_${data}.png`;
      a.href = barcodeRef.current.toDataURL('image/png');
      a.click();
      toast.success('Downloaded PNG');
    }
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    if (format === 'QR') {
      const svg = document.getElementById('qr-code');
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 15, 40, 100, 100);
        pdf.text(`QR Code: ${data}`, 15, 30);
        pdf.save(`qrcode_${data}.pdf`);
        toast.success('Downloaded PDF');
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    } else {
      const imgData = barcodeRef.current.toDataURL('image/png');
      const props = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 30;
      const pdfHeight = (props.height * pdfWidth) / props.width;
      pdf.text(`Barcode (${format}): ${data}`, 15, 30);
      pdf.addImage(imgData, 'PNG', 15, 40, pdfWidth, pdfHeight);
      pdf.save(`barcode_${format}_${data}.pdf`);
      toast.success('Downloaded PDF');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (format === 'QR') {
      const svg = document.getElementById('qr-code').outerHTML;
      printWindow.document.write(`<html><body><h2>QR Code</h2><div>${svg}</div><p>${data}</p></body></html>`);
    } else {
      const imgData = barcodeRef.current.toDataURL('image/png');
      printWindow.document.write(`<html><body><h2>Barcode (${format})</h2><img src="${imgData}" /><p>${data}</p></body></html>`);
    }
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const getFallbackData = () => ({
    toolName: 'Barcode Generator',
    toolDescription: 'Create 1D Barcodes and 2D QR Codes for products, inventory, and sharing.',
    whatToolDoes: 'Generates scannable barcodes in multiple formats.',
    whyUseful: ['Free to use', 'High-resolution output', 'Multiple formats'],
    howToUseSteps: ['Enter your data', 'Select a barcode format', 'Adjust size', 'Download or print'],
    howItWorks: 'Uses client-side rendering to generate a vector barcode which is then converted to an image format.',
    features: ['Real-time preview', 'Supports EAN, UPC, CODE128, and QR', 'Print directly'],
    useCases: ['Inventory management', 'Product labeling', 'Ticketing'],
    faqs: [{ question: 'Are these barcodes valid for retail?', answer: 'Yes, if you use standard EAN or UPC formats.' }],
    seoContent: 'Generate unlimited high-quality barcodes for your business or personal use securely.',
    relatedTools: []
  });

  return (
    <ToolPageTemplate toolData={toolPageData['barcode-generator'] || getFallbackData()}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="border-border shadow-sm">
          <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Data / Content</Label>
              <Input 
                value={data} 
                onChange={e => setData(e.target.value)} 
                placeholder="Enter text, URL, or numbers"
                className="font-mono text-lg py-6"
              />
            </div>

            <div className="space-y-2">
              <Label>Format Type</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CODE128">Code 128 (Standard)</SelectItem>
                  <SelectItem value="CODE39">Code 39</SelectItem>
                  <SelectItem value="EAN13">EAN-13 (Product Retail)</SelectItem>
                  <SelectItem value="UPC">UPC-A</SelectItem>
                  <SelectItem value="QR">QR Code (2D)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Size / Height</Label>
                <span className="text-sm text-muted-foreground">{size}px</span>
              </div>
              <Slider 
                value={[size]} 
                onValueChange={v => setSize(v[0])} 
                min={50} max={300} step={10} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-md overflow-hidden flex flex-col h-full">
          <CardHeader className="bg-muted/30 border-b">
            <div className="flex justify-between items-center">
              <CardTitle>Preview</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(data); toast.success('Data copied'); }}>
                <Copy className="h-4 w-4 mr-2" /> Copy Data
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8 flex-1 flex flex-col items-center justify-center min-h-[300px] checkerboard-bg">
            <div className="bg-white p-6 rounded-xl shadow-sm border inline-block">
              {format === 'QR' ? (
                <QRCodeSVG id="qr-code" value={data || ' '} size={size} level="M" />
              ) : (
                <canvas ref={barcodeRef} className="max-w-full h-auto"></canvas>
              )}
            </div>
          </CardContent>
          <div className="p-4 bg-muted/20 border-t flex flex-wrap justify-center gap-3">
            <Button onClick={handleDownloadPNG} className="flex-1 md:flex-none"><FileImage className="h-4 w-4 mr-2" /> PNG</Button>
            <Button variant="secondary" onClick={handleDownloadPDF} className="flex-1 md:flex-none"><Download className="h-4 w-4 mr-2" /> PDF</Button>
            <Button variant="outline" onClick={handlePrint} className="flex-1 md:flex-none"><Printer className="h-4 w-4 mr-2" /> Print</Button>
          </div>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default BarcodeGeneratorPage;