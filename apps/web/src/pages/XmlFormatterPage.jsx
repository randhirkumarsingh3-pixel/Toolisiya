import React, { useState } from 'react';
import { FileCode, FileDown, Copy, RefreshCcw, CheckCircle, AlertCircle, FileDigit } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const XmlFormatterPage = () => {
  const [inputXml, setInputXml] = useState('');
  const [outputXml, setOutputXml] = useState('');
  const [error, setError] = useState(null);

  const formatXML = (xml) => {
    let formatted = '';
    let pad = 0;
    
    xml = xml.replace(/(>)(<)(\/*)/g, '$1\r\n$2$3');
    
    xml.split('\r\n').forEach((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) {
          pad -= 1;
        }
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }

      formatted += '  '.repeat(pad) + node + '\r\n';
      pad += indent;
    });

    return formatted.trim();
  };

  const handleFormat = () => {
    if (!inputXml.trim()) {
      setError('Please enter XML to format.');
      return;
    }
    try {
      const formatted = formatXML(inputXml);
      setOutputXml(formatted);
      setError(null);
      toast.success('XML Formatted successfully');
    } catch (err) {
      setError('Failed to format XML. Ensure it is valid.');
    }
  };

  const handleMinify = () => {
    if (!inputXml.trim()) {
      setError('Please enter XML to minify.');
      return;
    }
    try {
      const minified = inputXml.replace(/>\s+</g, '><').replace(/<!--[\s\S]*?-->/g, '').trim();
      setOutputXml(minified);
      setError(null);
      toast.success('XML Minified successfully');
    } catch (err) {
      setError('Failed to minify XML.');
    }
  };

  const handleValidate = () => {
    if (!inputXml.trim()) {
      setError('Please enter XML to validate.');
      return;
    }
    try {
      const parser = new DOMParser();
      const dom = parser.parseFromString(inputXml, 'application/xml');
      const parserError = dom.querySelector('parsererror');
      
      if (parserError) {
        setError(parserError.textContent);
        toast.error('Invalid XML');
      } else {
        setError(null);
        toast.success('XML is valid!');
        setOutputXml('Valid XML document structure.');
      }
    } catch (err) {
      setError(err.message || 'Validation error');
    }
  };

  const handleCopy = () => {
    if (!outputXml) return;
    navigator.clipboard.writeText(outputXml);
    toast.success('Copied to clipboard');
  };

  const handleDownload = () => {
    if (!outputXml) return;
    const blob = new Blob([outputXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.xml';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded XML file');
  };

  const handleClear = () => {
    setInputXml('');
    setOutputXml('');
    setError(null);
  };

  return (
    <ToolPageTemplate toolData={toolPageData['xml-formatter']}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <Card className="flex flex-col h-full border-border">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileCode className="h-5 w-5 text-primary" /> Input XML
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleClear}><RefreshCcw className="h-4 w-4 mr-2" /> Clear</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <Textarea 
              value={inputXml}
              onChange={(e) => setInputXml(e.target.value)}
              placeholder="Paste your XML code here..."
              className="flex-1 min-h-[400px] border-0 rounded-none focus-visible:ring-0 font-mono text-sm resize-none bg-background text-foreground"
            />
            
            <div className="p-4 bg-muted/20 border-t flex flex-wrap gap-2">
              <Button onClick={handleFormat}><FileCode className="h-4 w-4 mr-2" /> Format</Button>
              <Button variant="secondary" onClick={handleMinify}><FileDigit className="h-4 w-4 mr-2" /> Minify</Button>
              <Button variant="outline" onClick={handleValidate}><CheckCircle className="h-4 w-4 mr-2" /> Validate</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full border-border">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Output</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={!outputXml}>
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload} disabled={!outputXml}>
                  <FileDown className="h-4 w-4 mr-2" /> Save
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col relative bg-[#1e1e1e]">
            {error && (
              <div className="absolute top-0 left-0 right-0 p-3 bg-destructive/10 text-destructive border-b border-destructive/20 text-sm flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <p className="whitespace-pre-wrap">{error}</p>
              </div>
            )}
            <Textarea 
              value={outputXml}
              readOnly
              placeholder="Output will appear here..."
              className={`flex-1 min-h-[400px] border-0 rounded-none focus-visible:ring-0 font-mono text-sm resize-none ${error ? 'pt-16' : ''} bg-transparent text-gray-200`}
            />
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default XmlFormatterPage;