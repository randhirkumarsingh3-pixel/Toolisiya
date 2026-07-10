import React, { useState } from 'react';
import { Upload, Download, RefreshCw, Table, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient.js';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const ExcelToPDFPage = () => {
  const [file, setFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      toast.error('Please upload a valid Excel spreadsheet (.xls or .xlsx).');
      return;
    }
    
    setFile(selectedFile);
    setPdfUrl(null);
  };

  const handleClear = () => {
    setFile(null);
    setPdfUrl(null);
  };

  const convertToPDF = async () => {
    if (!file) return;

    setIsConverting(true);
    setPdfUrl(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiServerClient.fetch('/pdf/excel-to-pdf', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        let errorMessage = 'Failed to convert spreadsheet';
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const err = await response.json();
          errorMessage = err.error || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      setPdfUrl(URL.createObjectURL(blob));
      toast.success('Spreadsheet converted successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to convert spreadsheet.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <ToolPageTemplate toolData={toolPageData['excel-to-pdf']}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Spreadsheet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!file ? (
              <div className="border-2 border-dashed border-blue-500/30 rounded-xl p-12 text-center hover:bg-blue-500/5 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleFileChange}
                />
                <Upload className="h-10 w-10 text-blue-500 mx-auto mb-4" />
                <p className="text-sm font-medium">Drag & drop an Excel file here</p>
                <p className="text-xs text-muted-foreground mt-2">Supports .xls and .xlsx</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Table className="h-8 w-8 text-blue-500 flex-shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleClear}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={convertToPDF} disabled={isConverting}>
                  {isConverting ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
                  {isConverting ? 'Converting...' : 'Convert to PDF'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {pdfUrl ? (
              <div className="space-y-6 flex flex-col items-center justify-center h-full min-h-[300px]">
                <div className="h-24 w-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold">Conversion Complete!</h3>
                <p className="text-muted-foreground text-center max-w-xs">Your spreadsheet has been successfully converted to PDF.</p>
                
                <Button 
                  className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 mt-4" 
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = pdfUrl;
                    a.download = `${file.name.split('.')[0]}.pdf`;
                    a.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" /> Download PDF
                </Button>
              </div>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                <FileText className="h-12 w-12 mb-4 opacity-20" />
                <p>Upload a spreadsheet to convert</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default ExcelToPDFPage;