import React, { useState, useEffect } from 'react';
import { Code, Copy, Check, FileCode2, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const CodeBeautifierPage = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const beautifyCode = (code) => {
    if (!code) return '';
    try {
      if (code.trim().startsWith('{') || code.trim().startsWith('[')) {
        return JSON.stringify(JSON.parse(code), null, 2);
      }
      
      let formatted = '';
      let indent = 0;
      const lines = code.replace(/>\s*</g, '>\n<')
                        .replace(/{\s*/g, '{\n')
                        .replace(/}\s*/g, '\n}')
                        .replace(/;\s*/g, ';\n')
                        .split('\n');

      lines.forEach(line => {
        let l = line.trim();
        if (l.match(/^<\/\w/)) indent = Math.max(0, indent - 1);
        if (l.startsWith('}')) indent = Math.max(0, indent - 1);
        
        formatted += '  '.repeat(indent) + l + '\n';
        
        if (l.match(/^<\w[^>]*[^\/]>$/) && !l.startsWith('<!')) indent++;
        if (l.endsWith('{')) indent++;
      });
      return formatted.trim();
    } catch (e) {
      return code;
    }
  };

  useEffect(() => {
    setOutput(beautifyCode(input));
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPageTemplate toolData={toolPageData['code-beautifier']}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-border">
          <CardHeader className="bg-muted/30 border-b pb-4 flex flex-row justify-between items-center">
            <CardTitle className="text-base font-medium">Input Code</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setInput('')}><RefreshCcw className="h-4 w-4 mr-2"/> Clear</Button>
          </CardHeader>
          <CardContent className="p-0">
            <Textarea 
              placeholder="Paste your minified or unformatted code here..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[500px] border-0 rounded-none focus-visible:ring-0 font-mono text-sm resize-none bg-background p-4"
            />
          </CardContent>
        </Card>

        <Card className="shadow-md border-border bg-[#1e1e1e]">
          <CardHeader className="bg-[#2d2d2d] border-b border-gray-800 pb-4 flex flex-row justify-between items-center">
            <CardTitle className="text-base font-medium text-gray-200">Beautified Output</CardTitle>
            <Button variant="secondary" size="sm" onClick={handleCopy} disabled={!output} className="h-8 text-xs font-semibold">
              {copied ? <Check className="h-3 w-3 mr-2" /> : <Copy className="h-3 w-3 mr-2" />} Copy
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Textarea 
              value={output}
              readOnly
              className="min-h-[500px] border-0 rounded-none focus-visible:ring-0 font-mono text-sm resize-none bg-transparent text-gray-300 p-4"
            />
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default CodeBeautifierPage;