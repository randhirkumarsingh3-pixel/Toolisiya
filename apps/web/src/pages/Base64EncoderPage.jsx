import React, { useState, useRef } from 'react';
import { ArrowLeftRight, UploadCloud, Copy, FileDown, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024, dm = 2, sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const Base64EncoderPage = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('encode');
  const [file, setFile] = useState(null);
  
  const fileInputRef = useRef(null);

  const processText = () => {
    if (!inputText) return;
    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(inputText)));
        setOutputText(encoded);
        toast.success('Text encoded to Base64');
      } else {
        const decoded = decodeURIComponent(escape(atob(inputText)));
        setOutputText(decoded);
        toast.success('Base64 decoded to text');
      }
    } catch (e) {
      toast.error('Invalid input for this operation');
      setOutputText('ERROR: Input cannot be processed.');
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);

    const reader = new FileReader();
    if (mode === 'encode') {
      reader.onload = (event) => {
        const base64String = event.target.result;
        setOutputText(base64String);
        toast.success('File encoded to Base64');
      };
      reader.readAsDataURL(uploadedFile);
    } else {
      reader.onload = (event) => {
        try {
          const content = event.target.result.trim();
          const base64Content = content.includes(',') ? content.split(',')[1] : content;
          const decoded = decodeURIComponent(escape(atob(base64Content)));
          setOutputText(decoded);
          toast.success('File contents decoded');
        } catch (err) {
          toast.error('Invalid Base64 file content');
        }
      };
      reader.readAsText(uploadedFile);
    }
  };

  const copyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    toast.success('Output copied to clipboard');
  };

  const downloadOutput = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encode' ? 'base64_encoded.txt' : 'decoded_text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setFile(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <ToolPageTemplate toolData={toolPageData['base64-encoder']}>
      <div className="max-w-4xl mx-auto">
        <Tabs value={mode} onValueChange={(m) => {setMode(m); clearAll();}} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="encode" className="text-lg py-3">Encode to Base64</TabsTrigger>
            <TabsTrigger value="decode" className="text-lg py-3">Decode Base64</TabsTrigger>
          </TabsList>
          
          <TabsContent value="encode" className="space-y-6">
            <Card className="border-border shadow-md">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <CardTitle className="text-lg">Input Data (Text or File)</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label>Type your text</Label>
                  <Textarea 
                    placeholder="Enter text to encode..." 
                    rows={6} 
                    value={inputText} 
                    onChange={(e) => {setInputText(e.target.value); setFile(null);}}
                    className="font-mono text-sm resize-none"
                  />
                </div>
                
                <div className="flex items-center">
                  <div className="border-t flex-1"></div>
                  <span className="px-4 text-muted-foreground font-medium text-sm">OR</span>
                  <div className="border-t flex-1"></div>
                </div>

                <div 
                  className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                  <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium text-lg">{file ? file.name : 'Upload File to Encode'}</p>
                  {file && <p className="text-sm text-muted-foreground mt-2">{formatBytes(file.size)}</p>}
                </div>

                <div className="pt-4 flex gap-4">
                  <Button size="lg" className="flex-1" onClick={processText} disabled={!inputText && !file}>
                    <ArrowLeftRight className="h-4 w-4 mr-2" /> Encode Data
                  </Button>
                  <Button size="lg" variant="outline" onClick={clearAll}>
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="decode" className="space-y-6">
            <Card className="border-border shadow-md">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <CardTitle className="text-lg">Input Base64 String</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label>Paste Base64 encoded text</Label>
                  <Textarea 
                    placeholder="e.g. SGVsbG8gV29ybGQ=" 
                    rows={6} 
                    value={inputText} 
                    onChange={(e) => {setInputText(e.target.value); setFile(null);}}
                    className="font-mono text-sm resize-none"
                  />
                </div>

                <div className="flex items-center">
                  <div className="border-t flex-1"></div>
                  <span className="px-4 text-muted-foreground font-medium text-sm">OR</span>
                  <div className="border-t flex-1"></div>
                </div>

                <div 
                  className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" className="hidden" ref={fileInputRef} accept=".txt" onChange={handleFileUpload} />
                  <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium text-lg">{file ? file.name : 'Upload Base64 TXT File'}</p>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button size="lg" className="flex-1" onClick={processText} disabled={!inputText && !file}>
                    <ArrowLeftRight className="h-4 w-4 mr-2" /> Decode Data
                  </Button>
                  <Button size="lg" variant="outline" onClick={clearAll}>
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {outputText && (
          <Card className="mt-8 border-border shadow-md bg-[#1e1e1e] text-gray-200 animate-fade-in">
            <CardHeader className="bg-[#2d2d2d] border-b border-gray-800 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-white">Output Result</CardTitle>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="h-8" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" /> Copy
                  </Button>
                  <Button variant="secondary" size="sm" className="h-8" onClick={downloadOutput}>
                    <FileDown className="h-4 w-4 mr-2" /> Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Textarea 
                value={outputText} 
                readOnly 
                className="min-h-[300px] border-0 rounded-none bg-transparent focus-visible:ring-0 font-mono text-sm resize-y"
              />
              <div className="p-3 bg-[#2d2d2d] text-xs text-gray-400 border-t border-gray-800 flex justify-between">
                <span>Input size: {formatBytes(file ? file.size : new Blob([inputText]).size)}</span>
                <span>Output size: {formatBytes(new Blob([outputText]).size)}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default Base64EncoderPage;