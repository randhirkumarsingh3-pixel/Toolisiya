import React, { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const DNARNAConverterPage = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = (type) => {
    const seq = input.toUpperCase().replace(/[^ATCGU]/g, '');
    let result = '';
    
    switch (type) {
      case 'dna-to-rna':
        result = seq.replace(/T/g, 'U');
        break;
      case 'rna-to-dna':
        result = seq.replace(/U/g, 'T');
        break;
      case 'complement':
        const compMap = { A: 'T', T: 'A', C: 'G', G: 'C', U: 'A' };
        result = seq.split('').map(c => compMap[c] || c).join('');
        break;
      case 'reverse-complement':
        const rcMap = { A: 'T', T: 'A', C: 'G', G: 'C', U: 'A' };
        result = seq.split('').reverse().map(c => rcMap[c] || c).join('');
        break;
      default:
        result = seq;
    }
    setOutput(result);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <CalculatorLayout
      title="DNA/RNA Converter"
      description="Convert between DNA and RNA sequences, find complements, and reverse complements."
      category="Science"
      categoryPath="/science"
      faqs={[
        { question: "What is a reverse complement?", answer: "The reverse complement of a DNA sequence is formed by reversing the letters, then replacing each letter with its complement (A with T, C with G)." },
        { question: "How does DNA to RNA conversion work?", answer: "In RNA, the nucleotide Thymine (T) is replaced by Uracil (U). The converter simply swaps these bases." }
      ]}
    >
      <NavigationButtons />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Input Sequence</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-muted-foreground">
                <RefreshCw className="h-4 w-4 mr-2" /> Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Enter DNA or RNA sequence (A, T, C, G, U)..."
              className="min-h-[150px] font-mono"
            />
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => handleConvert('dna-to-rna')}>DNA to RNA</Button>
              <Button variant="outline" onClick={() => handleConvert('rna-to-dna')}>RNA to DNA</Button>
              <Button variant="outline" onClick={() => handleConvert('complement')}>Complement</Button>
              <Button variant="outline" onClick={() => handleConvert('reverse-complement')}>Reverse Complement</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Output Sequence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              value={output} 
              readOnly
              placeholder="Result will appear here..."
              className="min-h-[150px] font-mono bg-background"
            />
            <Button className="w-full" onClick={handleCopy} disabled={!output}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />} Copy Result
            </Button>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayout>
  );
};

export default DNARNAConverterPage;