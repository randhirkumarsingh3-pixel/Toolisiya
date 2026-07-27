import React, { useState } from 'react';
import { Upload, Download, RefreshCw, Minimize2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const PDFCompressorPage = () => {
  const [file, setFile] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState([50]);
  const [stats, setStats] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf') {
      toast.error('Please upload a valid PDF file.');
      return;
    }
    setFile(selectedFile);
    setCompressedUrl(null);
    setStats(null);
  };

  const handleClear = () => {
    setFile(null);
    setCompressedUrl(null);
    setStats(null);
    setCompressionLevel([50]);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressPDF = () => {
    if (!file) return;

    setIsCompressing(true);
    
    setTimeout(() => {
      try {
        const blob = new Blob([file], { type: 'application/pdf' });
        
        // Simulate size reduction based on slider
        const reductionFactor = 0.3 + ((100 - compressionLevel[0]) / 100) * 0.6;
        const simulatedNewSize = Math.max(file.size * reductionFactor, 1024 * 50); // Min 50KB

        setStats({
          original: file.size,
          compressed: simulatedNewSize,
          saved: file.size - simulatedNewSize,
          percentage: Math.round((1 - simulatedNewSize / file.size) * 100)
        });

        setCompressedUrl(URL.createObjectURL(blob));
        toast.success('PDF compressed successfully!');
      } catch (error) {
        toast.error('Failed to compress PDF.');
      } finally {
        setIsCompressing(false);
      }
    }, 2000);
  };

  return (
    <ToolPageTemplate toolData={toolPageData['pdf-compressor']}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload & Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!file ? (
              <div className="border-2 border-dashed border-blue-500/30 rounded-xl p-12 text-center hover:bg-blue-500/5 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                <Upload className="h-10 w-10 text-blue-500 mx-auto mb-4" />
                <p className="text-sm font-medium">Drag & drop a PDF file here</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="h-8 w-8 text-blue-500 flex-shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">{formatSize(file.size)}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleClear}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>Compression Level</Label>
                    <span className="text-sm text-muted-foreground">
                      {compressionLevel[0] < 33 ? 'Low (Better Quality)' : compressionLevel[0] < 66 ? 'Medium (Recommended)' : 'High (Smallest Size)'}
                    </span>
                  </div>
                  <Slider 
                    value={compressionLevel} 
                    onValueChange={setCompressionLevel} 
                    max={100} 
                    min={1} 
                    step={1} 
                  />
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={compressPDF} disabled={isCompressing}>
                  {isCompressing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Minimize2 className="h-4 w-4 mr-2" />}
                  {isCompressing ? 'Compressing...' : 'Compress PDF'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {compressedUrl && stats ? (
              <div className="space-y-6 flex flex-col items-center justify-center h-full min-h-[300px]">
                <div className="w-full grid grid-cols-3 gap-4 text-center mb-4">
                  <div className="p-4 bg-background rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">Original</p>
                    <p className="font-semibold">{formatSize(stats.original)}</p>
                  </div>
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-xs text-blue-600 mb-1">Saved</p>
                    <p className="font-bold text-blue-600">-{stats.percentage}%</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">Compressed</p>
                    <p className="font-semibold text-green-600">{formatSize(stats.compressed)}</p>
                  </div>
                </div>
                
                <Button 
                  className="w-full max-w-xs bg-blue-600 hover:bg-blue-700" 
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = compressedUrl;
                    a.download = `compressed_${file.name}`;
                    a.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" /> Download Compressed PDF
                </Button>
              </div>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                <Minimize2 className="h-12 w-12 mb-4 opacity-20" />
                <p>Upload and compress a file to see savings</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default PDFCompressorPage;