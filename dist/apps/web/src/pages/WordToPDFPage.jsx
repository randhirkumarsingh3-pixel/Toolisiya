import React, { useState } from 'react';
import { Upload, Download, RefreshCw, FileType, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';
import mammoth from 'mammoth';

const WordToPDFPage = () => {
  const [file, setFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    const validTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.doc') && !selectedFile.name.endsWith('.docx')) {
      toast.error('Please upload a valid Word document (.doc or .docx).');
      return;
    }
    
    setFile(selectedFile);
    setPdfUrl(null);
  };

  const handleConvert = async () => {
    if (!file) return;
    
    setIsConverting(true);
    setPdfUrl(null);

    try {
      // Lazy load html2pdf
      const html2pdf = (await import('html2pdf.js')).default;
      
      const arrayBuffer = await file.arrayBuffer();
      
      // Convert Word to HTML using mammoth
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;

      if (!html) {
        throw new Error('Could not extract content from the document.');
      }

      // Create a temporary container for the HTML
      const container = document.createElement('div');
      container.innerHTML = html;
      
      // Apply some basic styling to the container for better PDF output
      container.style.padding = '20mm';
      container.style.width = '210mm'; // A4 width
      container.style.backgroundColor = 'white';
      container.style.color = 'black';
      container.style.fontFamily = 'Arial, sans-serif';
      container.style.lineHeight = '1.6';
      
      // Add standard CSS for mammoth output
      const style = document.createElement('style');
      style.innerHTML = `
        div table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
        div table, div th, div td { border: 1px solid #ccc; padding: 8px; }
        div img { max-width: 100%; height: auto; }
        div p { margin-bottom: 1em; }
        div h1, div h2, div h3 { margin-top: 1.5em; margin-bottom: 0.5em; }
      `;
      container.prepend(style);

      // Convert HTML to PDF using html2pdf.js
      const opt = {
        margin: [0, 0, 0, 0],
        filename: `${file.name.split('.')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const pdfBlob = await html2pdf().set(opt).from(container).output('blob');
      
      setPdfUrl(URL.createObjectURL(pdfBlob));
      toast.success('Word document converted successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to convert Word document.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPdfUrl(null);
  };

  return (
    <ToolPageTemplate toolData={toolPageData['word-to-pdf']}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Upload Word Document</span>
              {file && (
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Clear
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!file ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                />
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm font-medium mb-1">Click or drag file to this area to upload</p>
                <p className="text-xs text-muted-foreground">Supports .doc and .docx files</p>
              </div>
            ) : (
              <div className="bg-muted/50 rounded-lg p-6 flex items-center gap-4">
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            )}
            
            <Button 
              className="w-full" 
              onClick={handleConvert} 
              disabled={!file || isConverting || pdfUrl}
            >
              {isConverting ? (
                <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Converting...</>
              ) : (
                <><FileType className="h-4 w-4 mr-2" /> Convert to PDF</>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle>Download PDF</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[250px] text-center">
            {pdfUrl ? (
              <div className="space-y-4 w-full">
                <div className="bg-green-500/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-2">
                  <FileText className="h-8 w-8 text-green-500" />
                </div>
                <p className="font-medium text-green-600 dark:text-green-400">Conversion Complete!</p>
                <a href={pdfUrl} download={`${file?.name.split('.')[0] || 'document'}.pdf`} className="block w-full">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Download className="h-4 w-4 mr-2" /> Download PDF
                  </Button>
                </a>
              </div>
            ) : (
              <div className="text-muted-foreground">
                <FileType className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Your converted PDF will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default WordToPDFPage;