import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Type, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const SubtitleConverterPage = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  
  const [format, setFormat] = useState('vtt');
  const [timeShift, setTimeShift] = useState('0');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (!selectedFile.name.match(/\.(srt|vtt|ass|sub)$/i)) {
      toast.error('Please upload a valid subtitle file (SRT, VTT, ASS, SUB).');
      return;
    }
    setFile(selectedFile);
    setResultUrl(null);
  };

  const handleClear = () => {
    setFile(null);
    setResultUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const convertSubtitle = async () => {
    if (!file) return;

    setIsProcessing(true);
    setResultUrl(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', format);
      if (timeShift && timeShift !== '0') {
        formData.append('timeShift', timeShift);
      }

      const response = await apiServerClient.fetch('/subtitle/convert', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to convert subtitle');
      }

      const blob = await response.blob();
      setResultUrl(URL.createObjectURL(blob));
      toast.success('Subtitle converted successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'An error occurred during conversion.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getFallbackData = () => ({
    toolName: 'Subtitle Converter',
    toolDescription: 'Convert subtitles between formats and adjust timing.',
    whatToolDoes: 'Converts subtitle files to SRT, VTT, ASS, and SUB formats.',
    whyUseful: ['Free to use', 'Adjust timing easily', 'Multiple formats supported'],
    howToUseSteps: ['Upload your subtitle file', 'Select output format and time shift', 'Click convert', 'Download the result'],
    howItWorks: 'Uses secure server-side processing to convert subtitle files quickly and efficiently.',
    features: ['Multiple formats', 'Time shifting', 'Fast processing'],
    useCases: ['Video editors', 'Translators', 'General users needing format conversion'],
    faqs: [{ question: 'What is Time Shift?', answer: 'You can delay or speed up subtitles. Enter milliseconds (e.g., 1000 delays by 1 second, -500 advances by 0.5s).' }],
    seoContent: 'Convert your subtitle files online for free with our fast and secure subtitle converter.',
    relatedTools: []
  });

  return (
    <ToolPageTemplate toolData={toolPageData['subtitle-converter'] || getFallbackData()}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Settings & Upload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!file ? (
              <div 
                className="border-2 border-dashed border-blue-500/30 rounded-xl p-12 text-center hover:bg-blue-500/5 transition-colors cursor-pointer relative"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept=".srt,.vtt,.ass,.sub"
                  onChange={handleFileChange}
                />
                <Upload className="h-10 w-10 text-blue-500 mx-auto mb-4" />
                <p className="text-sm font-medium">Click or Drag & drop a subtitle file here</p>
                <p className="text-xs text-muted-foreground mt-2">SRT, VTT, ASS, SUB</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-3 overflow-hidden">
                  <Type className="h-8 w-8 text-blue-500 flex-shrink-0" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Output Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="srt">SRT</SelectItem>
                    <SelectItem value="vtt">VTT</SelectItem>
                    <SelectItem value="ass">ASS</SelectItem>
                    <SelectItem value="sub">SUB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Time Shift (ms)</Label>
                <Input type="number" placeholder="0" value={timeShift} onChange={e => setTimeShift(e.target.value)} />
                <p className="text-[10px] text-muted-foreground">E.g., 1000 = +1s delay</p>
              </div>
            </div>

            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={convertSubtitle} 
              disabled={isProcessing || !file}
            >
              {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Type className="h-4 w-4 mr-2" />}
              {isProcessing ? 'Converting...' : 'Convert Subtitle'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent className="h-full min-h-[300px] flex flex-col items-center justify-center">
            {resultUrl ? (
              <div className="space-y-6 flex flex-col items-center text-center">
                <div className="h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                  <Type className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">Conversion Complete!</h3>
                <p className="text-muted-foreground max-w-xs">Your subtitle file is ready for download.</p>
                
                <Button 
                  className="w-full max-w-xs bg-green-600 hover:bg-green-700" 
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = resultUrl;
                    const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
                    a.download = `${originalName}_converted.${format}`;
                    a.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" /> Download {format.toUpperCase()}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <Type className="h-16 w-16 mb-4" />
                <p>Upload a file to convert formats</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default SubtitleConverterPage;