import React, { useState, useRef } from 'react';
import { Upload, RefreshCw, QrCode, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import jsQR from 'jsqr';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const QRCodeScannerPage = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file.');
      return;
    }
    
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    scanImage(url);
  };

  const scanImage = (url) => {
    setIsScanning(true);
    setResult(null);
    
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      
      if (code) {
        setResult(code.data);
        addToHistory(code.data);
        toast.success('QR Code detected!');
      } else {
        toast.error('No QR code found in this image.');
      }
      setIsScanning(false);
    };
    img.src = url;
  };

  const addToHistory = (data) => {
    setHistory(prev => {
      const newHistory = [{ data, timestamp: new Date().toLocaleString() }, ...prev];
      return newHistory.slice(0, 5); // Keep last 5
    });
  };

  const handleClear = () => {
    setImageSrc(null);
    setResult(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const isUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <ToolPageTemplate toolData={toolPageData['qr-code-scanner']}>
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Upload Image</span>
              {imageSrc && (
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Clear
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!imageSrc ? (
              <div className="border-2 border-dashed border-blue-500/30 rounded-xl p-12 text-center hover:bg-blue-500/5 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Upload className="h-10 w-10 text-blue-500 mx-auto mb-4" />
                <p className="text-sm font-medium">Drag & drop an image with a QR code</p>
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden border bg-black/5 flex items-center justify-center relative min-h-[250px] p-4">
                <img 
                  src={imageSrc} 
                  alt="Uploaded QR" 
                  className="max-w-full max-h-[300px] object-contain shadow-sm" 
                />
                {isScanning && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle>Scan Result</CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="p-4 bg-background rounded-lg border break-all font-mono text-sm">
                    {result}
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => copyToClipboard(result)}>
                      <Copy className="h-4 w-4 mr-2" /> Copy Text
                    </Button>
                    {isUrl(result) && (
                      <Button variant="secondary" className="flex-1" onClick={() => window.open(result, '_blank')}>
                        <ExternalLink className="h-4 w-4 mr-2" /> Open Link
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-[150px] flex flex-col items-center justify-center text-muted-foreground">
                  <QrCode className="h-12 w-12 mb-4 opacity-20" />
                  <p>Upload an image to see the result</p>
                </div>
              )}
            </CardContent>
          </Card>

          {history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex justify-between items-center">
                  Recent Scans
                  <Button variant="ghost" size="sm" onClick={() => setHistory([])}>Clear</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {history.map((item, i) => (
                    <div key={i} className="p-3 bg-muted/50 rounded-lg border flex justify-between items-center gap-4">
                      <div className="truncate flex-1">
                        <p className="text-sm font-medium truncate">{item.data}</p>
                        <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(item.data)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default QRCodeScannerPage;