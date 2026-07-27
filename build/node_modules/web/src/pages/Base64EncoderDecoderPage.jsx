import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, Upload, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';

const Base64EncoderDecoderPage = () => {
  const [mode, setMode] = useState('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    processText(val, mode);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setInput(output);
    processText(output, newMode);
  };

  const processText = (text, currentMode) => {
    if (!text) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      if (currentMode === 'encode') {
        // Handle unicode characters properly
        setOutput(btoa(unescape(encodeURIComponent(text))));
      } else {
        setOutput(decodeURIComponent(escape(atob(text))));
      }
      setError(null);
    } catch (err) {
      setError(currentMode === 'decode' ? 'Invalid Base64 string' : 'Error encoding text');
      setOutput('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (mode === 'encode') {
        // Extract base64 part from data URL
        const base64 = event.target.result.split(',')[1];
        setInput(`[File: ${file.name}]`);
        setOutput(base64);
      } else {
        setInput(event.target.result);
        processText(event.target.result, 'decode');
      }
    };
    
    if (mode === 'encode') {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <CalculatorLayout
      title="Base64 Encoder / Decoder"
      description="Encode text or files to Base64 format, or decode Base64 strings back to normal text."
      category="Developer Tools"
      categoryPath="/developer"
      faqs={[
        { question: "What is Base64?", answer: "Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format by translating it into a radix-64 representation." },
        { question: "Is Base64 encryption?", answer: "No, Base64 is an encoding mechanism, not encryption. It provides no security and can be easily decoded by anyone." }
      ]}
    >
      <div className="flex justify-center mb-6">
        <Tabs value={mode} onValueChange={handleModeChange} className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encode">Encode to Base64</TabsTrigger>
            <TabsTrigger value="decode">Decode from Base64</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="flex flex-col h-[400px]">
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Input {mode === 'encode' ? 'Text' : 'Base64'}</span>
              <div className="flex gap-2">
                <div className="relative">
                  <input type="file" id="file-upload" className="sr-only" onChange={handleFileUpload} />
                  <label htmlFor="file-upload">
                    <Button variant="outline" size="sm" asChild className="cursor-pointer">
                      <span><Upload className="h-4 w-4 mr-2" /> Upload File</span>
                    </Button>
                  </label>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { setInput(''); setOutput(''); setError(null); }} className="h-8 w-8 text-muted-foreground">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Textarea 
              value={input} 
              onChange={handleInputChange} 
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
              className="flex-1 font-mono text-sm resize-none"
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[400px] bg-muted/30">
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Output {mode === 'encode' ? 'Base64' : 'Text'}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output}>
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />} Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output}>
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </div>
            </div>
            <Textarea 
              value={error ? error : output} 
              readOnly
              className={`flex-1 font-mono text-sm resize-none bg-background ${error ? 'text-destructive border-destructive' : ''}`}
              placeholder="Result will appear here..."
            />
          </CardContent>
        </Card>
      </div>
    </CalculatorLayout>
  );
};

export default Base64EncoderDecoderPage;