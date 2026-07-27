import React, { useState, useRef } from 'react';
import { Upload, Download, FilePlus, Loader2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient.js';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const PDFMergerPage = () => {
  const [files, setFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedUrl, setMergedUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(f => f.type === 'application/pdf');
    
    if (validFiles.length !== selectedFiles.length) {
      toast.warning('Some files were ignored because they are not PDFs.');
    }
    
    if (validFiles.length > 0) {
      const newFiles = validFiles.map(f => ({ file: f, id: crypto.randomUUID() }));
      setFiles(prev => [...prev, ...newFiles]);
      setMergedUrl(null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setMergedUrl(null);
  };

  const moveFile = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === files.length - 1)) return;
    
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index + direction];
    newFiles[index + direction] = temp;
    setFiles(newFiles);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      toast.error('Please upload at least 2 PDF files to merge.');
      return;
    }

    setIsMerging(true);
    setMergedUrl(null);

    try {
      const formData = new FormData();
      files.forEach(f => {
        formData.append('files', f.file);
      });

      const response = await apiServerClient.fetch('/pdf/merge', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to merge PDFs');
      }

      const blob = await response.blob();
      setMergedUrl(URL.createObjectURL(blob));
      toast.success('PDFs merged successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'An error occurred while merging PDFs.');
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <ToolPageTemplate toolData={toolPageData['pdf-merger']}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div 
              className="border-2 border-dashed border-blue-500/30 rounded-xl p-10 text-center hover:bg-blue-500/5 transition-colors cursor-pointer relative"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                multiple
                ref={fileInputRef}
                className="hidden" 
                accept="application/pdf"
                onChange={handleFileChange}
              />
              <Upload className="h-10 w-10 text-blue-500 mx-auto mb-4" />
              <p className="text-sm font-medium">Click or Drag & Drop PDF files here</p>
              <p className="text-xs text-muted-foreground mt-2">Maximum 50MB per file</p>
            </div>

            {files.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Files to merge (in order):</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {files.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border group">
                      <div className="flex items-center gap-3 overflow-hidden flex-1">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <FilePlus className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-medium truncate" title={item.file.name}>{item.file.name}</span>
                          <span className="text-xs text-muted-foreground">{(item.file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveFile(index, -1)} disabled={index === 0}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveFile(index, 1)} disabled={index === files.length - 1}>
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFile(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 mt-4" 
                  onClick={mergePDFs} 
                  disabled={isMerging || files.length < 2}
                >
                  {isMerging ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FilePlus className="h-4 w-4 mr-2" />}
                  {isMerging ? 'Merging PDFs...' : `Merge ${files.length} Files`}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 h-full min-h-[300px] flex flex-col items-center justify-center">
            {mergedUrl ? (
              <div className="space-y-6 flex flex-col items-center text-center">
                <div className="h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                  <FilePlus className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">Merge Complete!</h3>
                <p className="text-muted-foreground max-w-xs">Your PDFs have been successfully combined into a single file.</p>
                
                <Button 
                  className="w-full max-w-xs bg-green-600 hover:bg-green-700" 
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = mergedUrl;
                    a.download = `Merged_Document_${Date.now()}.pdf`;
                    a.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" /> Download Merged PDF
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <FilePlus className="h-16 w-16 mb-4" />
                <p>Upload files and click merge to see the result</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default PDFMergerPage;