import React, { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';

const URLEncoderDecoderPage = () => {
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
        setOutput(encodeURIComponent(text));
      } else {
        setOutput(decodeURIComponent(text));
      }
      setError(null);
    } catch (err) {
      setError('Invalid URL encoding');
      setOutput('');
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorLayout
      title="URL Encoder / Decoder"
      description="Encode or decode URL components safely to ensure valid web addresses."
      category="Developer Tools"
      categoryPath="/developer"
      faqs={[
        { question: "Why do we need URL encoding?", answer: "URLs can only be sent over the Internet using the ASCII character-set. URL encoding converts unsafe ASCII characters into a valid format (like %20 for space)." }
      ]}
    >
      <div className="flex justify-center mb-6">
        <Tabs value={mode} onValueChange={handleModeChange} className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encode">Encode URL</TabsTrigger>
            <TabsTrigger value="decode">Decode URL</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="flex flex-col h-[300px]">
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Input</span>
              <Button variant="ghost" size="icon" onClick={() => { setInput(''); setOutput(''); setError(null); }} className="h-8 w-8 text-muted-foreground">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea 
              value={input} 
              onChange={handleInputChange} 
              placeholder={mode === 'encode' ? 'Enter text to encode (e.g., Hello World!)...' : 'Enter URL to decode (e.g., Hello%20World%21)...'}
              className="flex-1 font-mono text-sm resize-none"
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[300px] bg-muted/30">
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Output</span>
              <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />} Copy
              </Button>
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

export default URLEncoderDecoderPage;