import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, FileMinus, Scissors, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient.js';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const PDFSplitterPage = () => {
  const [file, setFile] = useState(null);
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitUrl, setSplitUrl] = useState(null);
  const [pageRange, setPageRange] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf') {
      toast.error('Please upload a valid PDF file.');
      return;
    }
    setFile(selectedFile);
    setSplitUrl(null);
  };

  const handleClear = () => {
    setFile(null);
    setSplitUrl(null);
    setPageRange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const splitPDF = async () => {
    if (!file) return;
    if (!pageRange.trim()) {
      toast.error('Please enter a page range to extract.');
      return;
    }

    setIsSplitting(true);
    setSplitUrl(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pages', pageRange);

      const response = await apiServerClient.fetch('/pdf/split', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to split PDF');
      }

      const blob = await response.blob();
      setSplitUrl(URL.createObjectURL(blob));
      toast.success('PDF split successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'An error occurred while splitting the PDF.');
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <ToolPageTemplate toolData={toolPageData['pdf-splitter']}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 mt-4">
        <Card className="shadow-lg border-border">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <CardTitle>Upload & Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {!file ? (
              <div 
                className="border-2 border-dashed border-primary/30 rounded-xl p-12 text-center hover:bg-primary/5 transition-colors cursor-pointer relative"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                <Upload className="h-10 w-10 text-primary mx-auto mb-4" />
                <p className="text-base font-bold text-foreground">Click or Drag & drop a PDF file here</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="bg-primary/10 p-2 rounded-lg"><FileMinus className="h-6 w-6 text-primary flex-shrink-0" /></div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-bold truncate text-foreground">{file.name}</span>
                      <span className="text-xs font-medium text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleClear} className="hover:bg-background shadow-sm border border-transparent hover:border-border">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-bold">Pages to Extract</Label>
                  <Input 
                    placeholder="e.g., 1-5, 8, 11-13" 
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    className="h-12 text-lg font-mono"
                  />
                  <p className="text-sm font-medium text-muted-foreground">Enter page numbers and/or ranges separated by commas.</p>
                </div>

                <Button className="w-full h-12 text-base font-bold shadow-md" onClick={splitPDF} disabled={isSplitting || !pageRange}>
                  {isSplitting ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Scissors className="h-5 w-5 mr-2" />}
                  {isSplitting ? 'Splitting PDF...' : 'Extract Pages'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-muted/10 border-border shadow-md">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent className="h-full min-h-[300px] flex flex-col items-center justify-center p-6">
            {splitUrl ? (
              <div className="space-y-6 flex flex-col items-center text-center animate-fade-in w-full">
                <div className="h-24 w-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2 border border-emerald-500/20 shadow-sm">
                  <FileMinus className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Split Complete!</h3>
                <p className="text-muted-foreground max-w-sm">Your selected pages have been successfully extracted into a new PDF document.</p>
                
                <Button 
                  className="w-full max-w-xs h-12 font-bold shadow-md text-base" 
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = splitUrl;
                    a.download = `extracted_${file.name}`;
                    a.click();
                  }}
                >
                  <Download className="h-5 w-5 mr-2" /> Download PDF
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground opacity-50 p-8 text-center">
                <Scissors className="h-16 w-16 mb-4" />
                <p className="font-medium text-lg">Upload and split a file to see the result</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default PDFSplitterPage;