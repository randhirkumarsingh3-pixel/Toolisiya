import React, { useState, useEffect } from 'react';
import { Copy, Check, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const WordCounterPage = () => {
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(text.length);
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    setSentenceCount(sentences.length);
    const paragraphs = text.split(/\n+/).filter(para => para.trim().length > 0);
    setParagraphCount(paragraphs.length);
  }, [text]);

  const handleCopy = () => {
    const result = `Words: ${wordCount}\nCharacters: ${charCount}\nSentences: ${sentenceCount}\nParagraphs: ${paragraphCount}`;
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Statistics copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
    toast.success('Text cleared');
  };

  return (
    <ToolPageTemplate toolData={toolPageData['word-counter']}>
      <Card className="shadow-sm border-border">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Text Input
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Textarea
            placeholder="Start typing or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[300px] text-foreground resize-y border-border focus-visible:ring-primary/20 text-base p-4"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-center">
              <div className="text-4xl font-bold text-primary mb-1">{wordCount}</div>
              <div className="text-sm font-medium text-primary/80 uppercase tracking-wider">Words</div>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center border border-border">
              <div className="text-3xl font-bold text-foreground mb-1">{charCount}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Characters</div>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center border border-border">
              <div className="text-3xl font-bold text-foreground mb-1">{sentenceCount}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Sentences</div>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center border border-border">
              <div className="text-3xl font-bold text-foreground mb-1">{paragraphCount}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Paragraphs</div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={handleCopy} className="flex-1 h-12 font-bold" disabled={!text}>
              {copied ? <><Check className="mr-2 h-4 w-4" /> Copied</> : <><Copy className="mr-2 h-4 w-4" /> Copy Stats</>}
            </Button>
            <Button onClick={handleClear} variant="outline" className="h-12" disabled={!text}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </ToolPageTemplate>
  );
};

export default WordCounterPage;