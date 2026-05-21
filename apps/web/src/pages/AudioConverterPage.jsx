import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Music, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const AudioConverterPage = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  
  const [format, setFormat] = useState('mp3');
  const [bitrate, setBitrate] = useState('192k');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith('audio/') && !selectedFile.name.match(/\.(mp3|wav|ogg|m4a|flac|aac)$/i)) {
      toast.error('Please upload a valid audio file.');
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

  const convertAudio = async () => {
    if (!file) return;

    setIsProcessing(true);
    setResultUrl(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', format);
      formData.append('bitrate', bitrate);

      const response = await apiServerClient.fetch('/audio/convert', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to convert audio');
      }

      const blob = await response.blob();
      setResultUrl(URL.createObjectURL(blob));
      toast.success('Audio converted successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'An error occurred during audio conversion.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getFallbackData = () => ({
    toolName: 'Audio Converter',
    toolDescription: 'Convert audio files between different formats easily.',
    whatToolDoes: 'Converts audio files to MP3, WAV, OGG, M4A, FLAC, and AAC formats.',
    whyUseful: ['Free to use', 'High-quality output', 'Multiple formats supported'],
    howToUseSteps: ['Upload your audio file', 'Select output format and bitrate', 'Click convert', 'Download the result'],
    howItWorks: 'Uses secure server-side processing to convert audio files quickly and efficiently.',
    features: ['Multiple formats', 'Customizable bitrate', 'Fast processing'],
    useCases: ['Musicians', 'Podcasters', 'General users needing format conversion'],
    faqs: [{ question: 'Is there a file size limit?', answer: 'Yes, maximum audio file size is 100MB per conversion.' }],
    seoContent: 'Convert your audio files online for free with our fast and secure audio converter.',
    relatedTools: []
  });

  return (
    <ToolPageTemplate toolData={toolPageData['audio-converter'] || getFallbackData()}>
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
                  accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac,.aac"
                  onChange={handleFileChange}
                />
                <Upload className="h-10 w-10 text-blue-500 mx-auto mb-4" />
                <p className="text-sm font-medium">Click or Drag & drop an audio file here</p>
                <p className="text-xs text-muted-foreground mt-2">MP3, WAV, OGG, M4A, FLAC, AAC</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-3 overflow-hidden">
                  <Music className="h-8 w-8 text-blue-500 flex-shrink-0" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
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
                    <SelectItem value="mp3">MP3</SelectItem>
                    <SelectItem value="wav">WAV</SelectItem>
                    <SelectItem value="ogg">OGG</SelectItem>
                    <SelectItem value="m4a">M4A</SelectItem>
                    <SelectItem value="flac">FLAC</SelectItem>
                    <SelectItem value="aac">AAC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Audio Quality (Bitrate)</Label>
                <Select value={bitrate} onValueChange={setBitrate} disabled={format === 'wav' || format === 'flac'}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="128k">128 kbps (Standard)</SelectItem>
                    <SelectItem value="192k">192 kbps (High)</SelectItem>
                    <SelectItem value="256k">256 kbps (Very High)</SelectItem>
                    <SelectItem value="320k">320 kbps (Maximum)</SelectItem>
                  </SelectContent>
                </Select>
                {(format === 'wav' || format === 'flac') && (
                  <p className="text-[10px] text-muted-foreground">Lossless formats ignore bitrate</p>
                )}
              </div>
            </div>

            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={convertAudio} 
              disabled={isProcessing || !file}
            >
              {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Music className="h-4 w-4 mr-2" />}
              {isProcessing ? 'Converting...' : 'Convert Audio'}
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
                  <Music className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">Conversion Complete!</h3>
                <p className="text-muted-foreground max-w-xs">Your audio has been converted to {format.toUpperCase()}.</p>
                
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
                <Music className="h-16 w-16 mb-4" />
                <p>Upload a file to convert formats</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default AudioConverterPage;