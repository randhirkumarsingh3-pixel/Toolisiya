import React, { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { numberToWords } from '@/utils/helpers.js';

const NumberToWordsPage = () => {
  const [number, setNumber] = useState('12345.67');
  const [copied, setCopied] = useState(false);

  const words = numberToWords(number);

  const handleCopy = () => {
    if (!words) return;
    navigator.clipboard.writeText(words);
    setCopied(true);
    toast('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CalculatorLayout
      title="Number to Words Converter"
      description="Convert numbers and decimals into English words instantly."
      category="Utilities"
      categoryPath="/utilities"
      example={{
        description: "Here are some examples of how numbers are converted:",
        steps: [
          { text: "123 → One Hundred Twenty Three" },
          { text: "1000 → One Thousand" },
          { text: "123.45 → One Hundred Twenty Three point Four Five" }
        ]
      }}
      faqs={[
        { question: "What is the maximum number supported?", answer: "This tool supports numbers up to 999,999,999 (99 Crores / 999 Million)." },
        { question: "Does it support decimals?", answer: "Yes, decimals are supported and read out digit by digit after the word 'point'." }
      ]}
    >
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Enter Number</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <Input 
              type="number" 
              value={number} 
              onChange={(e) => setNumber(e.target.value)} 
              placeholder="e.g. 12345"
              className="text-lg"
            />
            <Button variant="outline" size="icon" onClick={() => setNumber('')}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="bg-muted rounded-xl p-6 min-h-[120px] flex flex-col justify-center relative">
            <div className="text-xl font-medium leading-relaxed pr-12">
              {words || <span className="text-muted-foreground italic">Enter a number to see words...</span>}
            </div>
            {words && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </CalculatorLayout>
  );
};

export default NumberToWordsPage;