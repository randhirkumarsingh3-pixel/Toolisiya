import React, { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { textCaseConverters } from '@/utils/helpers.js';

const TextCaseConverterPage = () => {
  const [text, setText] = useState('hello world. this is a test.');
  const [copiedCase, setCopiedCase] = useState(null);

  const handleCopy = (caseName, value) => {
    navigator.clipboard.writeText(value);
    setCopiedCase(caseName);
    toast(`Copied ${caseName}`);
    setTimeout(() => setCopiedCase(null), 2000);
  };

  return (
    <CalculatorLayout
      title="Text Case Converter"
      description="Convert text between UPPERCASE, lowercase, camelCase, snake_case, and more instantly."
      category="Utilities"
      categoryPath="/utilities"
      faqs={[
        { question: "What is camelCase?", answer: "camelCase writes phrases without spaces or punctuation, indicating the separation of words with a single capitalized letter (e.g., myVariableName)." },
        { question: "What is snake_case?", answer: "snake_case replaces spaces with underscores and uses all lowercase letters (e.g., my_variable_name)." }
      ]}
    >
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Input Text</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            placeholder="Type or paste your text here..."
            className="min-h-[120px]"
          />
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setText('')}>
              <Trash2 className="h-4 w-4 mr-2" /> Clear
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {Object.entries(textCaseConverters).map(([caseName, converter]) => {
              const convertedText = converter(text);
              return (
                <div key={caseName} className="bg-muted rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground capitalize">{caseName.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(caseName, convertedText)}>
                      {copiedCase === caseName ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="text-sm break-all bg-background p-2 rounded border min-h-[40px]">
                    {convertedText || <span className="text-muted-foreground italic">Empty</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </CalculatorLayout>
  );
};

export default TextCaseConverterPage;