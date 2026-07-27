import React, { useState, useRef } from 'react';
import { Copy, Check, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';

const QRCodeGeneratorPage = () => {
  const [text, setText] = useState('https://toolisiya.com');
  const [size, setSize] = useState([256]);
  const [level, setLevel] = useState('M');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  const handleDownload = () => {
    if (!text) return;
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleCopy = async () => {
    if (!text) return;
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      try {
        canvas.toBlob(async (blob) => {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      } catch (err) {
        console.error('Failed to copy image', err);
      }
    }
  };

  const handleClear = () => {
    setText('');
    setSize([256]);
    setLevel('M');
  };

  return (
    <CalculatorLayout
      title="QR Code Generator"
      description="Generate custom QR codes for URLs, text, emails, and more instantly."
      category="Generators"
      categoryPath="/generators"
      faqs={[
        { question: "What is Error Correction Level?", answer: "Error correction allows the QR code to be read even if it is partially damaged or obscured. L (Low) allows ~7% recovery, M (Medium) ~15%, Q (Quartile) ~25%, and H (High) ~30%." },
        { question: "Do these QR codes expire?", answer: "No, the QR codes generated here are static and contain the actual data. They will never expire." }
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="flex justify-between items-center">
              <Label className="text-base">Data to Encode</Label>
              <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-muted-foreground">
                <RefreshCw className="h-4 w-4 mr-2" /> Clear
              </Button>
            </div>
            
            <Textarea 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder="Enter URL or text here..."
              className="min-h-[120px] resize-none"
            />

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Size: {size[0]}px</Label>
              </div>
              <Slider 
                value={size} 
                onValueChange={setSize} 
                min={100} 
                max={500} 
                step={8} 
              />
            </div>

            <div className="space-y-2">
              <Label>Error Correction Level</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (L) - 7% damage recovery</SelectItem>
                  <SelectItem value="M">Medium (M) - 15% damage recovery</SelectItem>
                  <SelectItem value="Q">Quartile (Q) - 25% damage recovery</SelectItem>
                  <SelectItem value="H">High (H) - 30% damage recovery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardContent className="pt-6 flex flex-col items-center justify-center h-full min-h-[400px] space-y-6">
            {!text ? (
              <div className="flex flex-col items-center text-muted-foreground text-center p-8">
                <AlertCircle className="h-12 w-12 mb-4 opacity-50" />
                <p>Please enter some text or a URL to generate a QR code.</p>
              </div>
            ) : (
              <>
                <div ref={qrRef} className="p-4 bg-white rounded-xl shadow-sm border border-border">
                  <QRCodeCanvas 
                    value={text} 
                    size={size[0]} 
                    level={level}
                    includeMargin={true}
                  />
                </div>
                
                <div className="flex gap-4 w-full max-w-xs">
                  <Button className="flex-1" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" /> Download
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />} Copy
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </CalculatorLayout>
  );
};

export default QRCodeGeneratorPage;