import React, { useState } from 'react';
import { Download, Trash2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const HTMLPreviewPage = () => {
  const [html, setHtml] = useState('<div style="text-align: center; padding: 2rem;">\n  <h1 style="color: #3B82F6;">Hello World!</h1>\n  <p>Edit this HTML to see live changes.</p>\n</div>');

  const handleDownload = () => {
    if (!html) return;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'preview.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openFullScreen = () => {
    const newWindow = window.open();
    newWindow.document.write(html);
    newWindow.document.close();
  };

  return (
    <ToolPageTemplate toolData={toolPageData['html-preview']}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="flex flex-col h-[600px]">
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">HTML Code</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => setHtml('')} className="h-8 w-8 text-muted-foreground">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Textarea 
              value={html} 
              onChange={(e) => setHtml(e.target.value)} 
              placeholder="Enter HTML code here..."
              className="flex-1 font-mono text-sm resize-none bg-[#0d1117] text-gray-100 border-border"
              spellCheck={false}
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[600px] bg-white">
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-900">Live Preview</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={openFullScreen}>
                  <Maximize2 className="h-4 w-4 mr-2" /> Full Screen
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </div>
            </div>
            <div className="flex-1 border border-gray-200 rounded-md overflow-hidden bg-white">
              <iframe
                srcDoc={html}
                title="HTML Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default HTMLPreviewPage;