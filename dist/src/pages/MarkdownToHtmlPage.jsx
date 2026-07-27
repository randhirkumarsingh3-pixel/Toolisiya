import React, { useState, useEffect } from 'react';
import { FileText, Code2, Eye } from 'lucide-react';
import { marked } from 'marked';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CopyButton from '@/components/CopyButton.jsx';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const MarkdownToHtmlPage = () => {
  const [markdown, setMarkdown] = useState('# Hello World\n\nWrite your **markdown** here.\n\n- List item 1\n- List item 2\n\n[Visit Toolisiya](https://toolisiya.com)');
  const [html, setHtml] = useState('');

  useEffect(() => {
    try {
      const parsedHtml = marked.parse(markdown);
      setHtml(parsedHtml);
    } catch (error) {
      console.error('Markdown parsing error:', error);
    }
  }, [markdown]);

  return (
    <ToolPageTemplate toolData={toolPageData['markdown-to-html']}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16 animate-fade-in">
        {/* Input Section */}
        <Card className="shadow-lg border-border flex flex-col h-full">
          <CardHeader className="bg-muted/30 border-b pb-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" /> Markdown Input
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <Textarea 
              className="flex-1 min-h-[500px] border-0 focus-visible:ring-0 rounded-none resize-none p-6 font-mono text-sm"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              spellCheck={false}
            />
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="shadow-lg border-border flex flex-col h-full">
          <Tabs defaultValue="preview" className="flex flex-col h-full">
            <CardHeader className="bg-muted/30 border-b pb-4 flex flex-row items-center justify-between space-y-0 px-6 pt-4">
              <TabsList className="grid w-full max-w-[300px] grid-cols-2">
                <TabsTrigger value="preview" className="flex items-center gap-2"><Eye className="h-4 w-4" /> Preview</TabsTrigger>
                <TabsTrigger value="html" className="flex items-center gap-2"><Code2 className="h-4 w-4" /> HTML Code</TabsTrigger>
              </TabsList>
              <CopyButton textToCopy={html} size="sm" />
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <TabsContent value="preview" className="h-full m-0">
                <div 
                  className="prose dark:prose-invert max-w-none p-6 h-full min-h-[500px] overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </TabsContent>
              <TabsContent value="html" className="h-full m-0 bg-slate-950">
                <textarea 
                  readOnly
                  className="w-full h-full min-h-[500px] bg-transparent border-0 focus-visible:ring-0 resize-none p-6 font-mono text-sm text-emerald-400 scrollbar-none"
                  value={html}
                />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default MarkdownToHtmlPage;