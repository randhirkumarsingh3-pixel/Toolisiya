import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import CodeHighlight from '@/components/CodeHighlight.jsx';
import ExtraToolTips from '@/components/ExtraToolTips.jsx';

const JSONFormatterPage = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const formatJSON = (spaces = 2) => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, spaces));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMinify = () => formatJSON(0);
  const handleBeautify = () => formatJSON(2);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <CalculatorLayout
      title="JSON Formatter & Validator"
      description="Format, beautify, minify, and validate JSON data instantly."
      category="Developer Tools"
      categoryPath="/developer"
      faqs={[
        { question: "Is my JSON data sent to a server?", answer: "No, all formatting and validation happens locally in your browser. Your data is secure." },
        { question: "What is JSON?", answer: "JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write." }
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="flex flex-col h-[600px]">
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Input JSON</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleBeautify}>Beautify</Button>
                <Button variant="outline" size="sm" onClick={handleMinify}>Minify</Button>
                <Button variant="ghost" size="icon" onClick={() => { setInput(''); setOutput(''); setError(null); }} className="h-8 w-8 text-muted-foreground">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Textarea 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder='{"key": "value"}'
              className="flex-1 font-mono text-sm resize-none"
            />
            {error && (
              <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md flex items-start gap-2 text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Invalid JSON: {error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[600px] bg-muted/30">
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Output</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output}>
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />} Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output}>
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto rounded-md border border-border bg-[#0d1117]">
              {output ? (
                <CodeHighlight code={output} language="json" />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  Formatted output will appear here
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ExtraToolTips toolName="JSON Formatter" />
    </CalculatorLayout>
  );
};

export default JSONFormatterPage;