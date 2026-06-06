import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, FileText, Languages, Volume2, Save, Download, 
  Trash2, RefreshCw, Copy, Check, CheckCircle2, ChevronDown, AlignLeft, Search, ZoomIn, ZoomOut, Settings2, ShieldCheck, Cpu
} from 'lucide-react';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { apiServerClient } from '@/lib/apiServerClient';

// Configure PDF.js Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const SUPPORTED_LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'hin', name: 'Hindi' },
  { code: 'ben', name: 'Bengali' },
  { code: 'mar', name: 'Marathi' },
  { code: 'tam', name: 'Tamil' },
  { code: 'tel', name: 'Telugu' },
  { code: 'guj', name: 'Gujarati' },
  { code: 'fra', name: 'French' },
  { code: 'deu', name: 'German' },
  { code: 'spa', name: 'Spanish' },
];

export default function OCRDocumentReaderPage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('eng');
  const [accuracyMode, setAccuracyMode] = useState('standard');
  // Translation
  const [targetLang, setTargetLang] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Audio
  const [isPlaying, setIsPlaying] = useState(false);
  
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const onDrop = async (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setExtractedText('');
    setProgress(0);
    setConfidence(0);
    
    if (synthRef.current) synthRef.current.cancel();
    setIsPlaying(false);

    if (selectedFile.type.includes('image')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else if (selectedFile.type === 'application/pdf') {
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        setPreviewUrl(canvas.toDataURL('image/jpeg'));
      } catch (err) {
        console.error('PDF preview error:', err);
        toast.error("Failed to generate PDF preview.");
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const extractTextFromImage = async (imageUrl) => {
    const worker = await createWorker(selectedLanguage, 1, {
      logger: m => {
        if (m.status === 'recognizing text') {
          setProgress(Math.round(m.progress * 100));
          setStatusText(`Extracting text... ${Math.round(m.progress * 100)}%`);
        } else {
          setStatusText(m.status);
        }
      }
    });

    const { data: { text, confidence } } = await worker.recognize(imageUrl);
    await worker.terminate();
    
    return { text, confidence };
  };

  const extractTextCloudMode = async (fileObj) => {
    setStatusText('Uploading to Cloud AI...');
    const formData = new FormData();
    formData.append('file', fileObj);

    const response = await apiServerClient.fetch('/ocr/extract-text', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Cloud extraction failed');
    return { text: data.text, confidence: data.confidence };
  };

  const processOCR = async () => {
    if (!file && !previewUrl) return;
    
    setIsProcessing(true);
    setProgress(0);
    setExtractedText('');
    setConfidence(0);
    
    try {
      if (accuracyMode === 'high') {
        setStatusText('Processing with High-Accuracy Cloud AI...');
        setProgress(40);
        const { text, confidence: conf } = await extractTextCloudMode(file);
        setExtractedText(text);
        setConfidence(conf);
        setProgress(100);
      } else {
        if (file && file.type === 'application/pdf') {
          setStatusText('Reading PDF Document...');
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          
          let fullText = '';
          let totalConfidence = 0;
          
          for (let i = 1; i <= pdf.numPages; i++) {
             setStatusText(`Processing PDF Page ${i} of ${pdf.numPages}...`);
             const page = await pdf.getPage(i);
             const viewport = page.getViewport({ scale: 2.0 }); // higher scale for OCR
             const canvas = document.createElement('canvas');
             const context = canvas.getContext('2d');
             canvas.height = viewport.height;
             canvas.width = viewport.width;
             await page.render({ canvasContext: context, viewport }).promise;
             const imgUrl = canvas.toDataURL('image/jpeg');
             
             const { text, confidence: conf } = await extractTextFromImage(imgUrl);
             fullText += text + '\n\n';
             totalConfidence += conf;
          }
          
          setExtractedText(fullText.trim());
          setConfidence(Math.round(totalConfidence / pdf.numPages));
        } else {
          const { text, confidence: conf } = await extractTextFromImage(previewUrl);
          setExtractedText(text);
          setConfidence(Math.round(conf));
        }
      }
      
      setStatusText('Extraction Complete');
      toast.success("Text extracted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during OCR processing.");
      setStatusText('Extraction Failed');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleTranslate = async () => {
    if (!extractedText || !targetLang) return;
    
    setIsTranslating(true);
    try {
      const response = await apiServerClient.fetch('/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText, targetLanguage: targetLang })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Translation failed');
      
      setExtractedText(data.translatedText);
      toast.success(`Translated to ${targetLang}!`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to translate text.");
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleSpeech = () => {
    if (!synthRef.current) return;
    
    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
      return;
    }

    if (!extractedText) return;

    utteranceRef.current = new SpeechSynthesisUtterance(extractedText);
    utteranceRef.current.onend = () => setIsPlaying(false);
    
    synthRef.current.speak(utteranceRef.current);
    setIsPlaying(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    toast.success("Text copied to clipboard");
  };

  const handleExport = (format) => {
    if (!extractedText) return;

    if (format === 'txt') {
      const blob = new Blob([extractedText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'extracted_text.txt';
      a.click();
    } else if (format === 'json') {
      const blob = new Blob([JSON.stringify({ text: extractedText }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'extracted_text.json';
      a.click();
    } else {
      toast.info(`Export to ${format.toUpperCase()} will be added in the next update!`);
    }
  };

  const clearAll = () => {
    setFile(null);
    setPreviewUrl(null);
    setExtractedText('');
    setConfidence(0);
    setProgress(0);
    if (synthRef.current) synthRef.current.cancel();
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] py-8">
      <Helmet>
        <title>OCR Document Reader - Extract Text from Images & PDFs Online | Toolisiya</title>
        <meta name="description" content="Free online OCR workspace. Extract editable text from scanned documents, PDFs, handwritten notes, and images. Translate, edit, and convert to speech instantly." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">OCR Document Workspace</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload any scanned document, PDF, or image to instantly extract editable text. 
            Translate into 10+ languages or convert text to speech.
          </p>
        </div>

        {/* Main Workspace Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Pane: Upload & Preview */}
          <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                Original Document
              </h2>
              {file && (
                <Button variant="ghost" size="sm" onClick={clearAll} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>

            {!previewUrl ? (
              <div 
                {...getRootProps()} 
                className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 min-h-[400px]
                  ${isDragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                  Drag & Drop Document Here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
                  Supports PDF, JPG, PNG, and WEBP. You can also capture from camera.
                </p>
              </div>
            ) : (
              <div className="flex flex-col flex-1 h-[400px] relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <img 
                  src={previewUrl} 
                  alt="Document Preview" 
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* OCR Controls */}
            {file && (
              <div className="flex flex-col gap-3 mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Language:</span>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage} disabled={isProcessing || accuracyMode === 'high'}>
                      <SelectTrigger className="w-[140px] bg-white dark:bg-gray-800">
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORTED_LANGUAGES.map(l => (
                          <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Accuracy:</span>
                    <Select value={accuracyMode} onValueChange={setAccuracyMode} disabled={isProcessing}>
                      <SelectTrigger className="w-[160px] bg-white dark:bg-gray-800">
                        <SelectValue placeholder="Mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (Fast)</SelectItem>
                        <SelectItem value="high">High (Cloud AI)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={processOCR} 
                    disabled={isProcessing}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Cpu className="w-4 h-4 mr-2" />
                        Extract Text
                      </>
                    )}
                  </Button>
                </div>
                
                {isProcessing && (
                  <div className="w-full space-y-1 mt-2">
                    <div className="flex justify-between text-xs text-gray-500 font-medium">
                      <span>{statusText}</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2 w-full" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Pane: Extracted Text Workspace */}
          <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <AlignLeft className="w-5 h-5 text-emerald-500" />
                Extracted Text
              </h2>
              {confidence > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Confidence: {confidence}%
                </span>
              )}
            </div>

            <textarea
              className="flex-1 min-h-[400px] w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all"
              placeholder="Extracted text will appear here. You can edit this text freely..."
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
            />

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopy} 
                disabled={!extractedText}
                className="bg-white dark:bg-gray-800 flex-1 sm:flex-none"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleSpeech} 
                disabled={!extractedText}
                className="bg-white dark:bg-gray-800 flex-1 sm:flex-none"
              >
                <Volume2 className={`w-4 h-4 mr-2 ${isPlaying ? 'text-indigo-500 animate-pulse' : ''}`} />
                {isPlaying ? 'Stop Audio' : 'Listen'}
              </Button>

              {/* Translation Controls */}
              <div className="flex items-center gap-2 ml-auto w-full sm:w-auto">
                <Select value={targetLang} onValueChange={setTargetLang} disabled={isTranslating || !extractedText}>
                  <SelectTrigger className="w-[140px] h-9 bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Translate to..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map(l => (
                      <SelectItem key={l.name} value={l.name}>{l.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={handleTranslate} 
                  disabled={isTranslating || !extractedText || !targetLang}
                >
                  {isTranslating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Export Bar */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400 w-full mb-1">Export As:</span>
              <Button variant="default" size="sm" onClick={() => handleExport('txt')} disabled={!extractedText} className="flex-1 sm:flex-none">
                <Download className="w-4 h-4 mr-2" /> TXT
              </Button>
              <Button variant="default" size="sm" onClick={() => handleExport('json')} disabled={!extractedText} className="flex-1 sm:flex-none">
                <Download className="w-4 h-4 mr-2" /> JSON
              </Button>
            </div>
          </div>

        </div>

        {/* SEO & Educational Content */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-6 h-6 text-indigo-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Secure & Private OCR Processing</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Your privacy is our priority. All document processing happens directly in your browser or through secure API pipelines. Files are not permanently stored on our servers and are automatically discarded after extraction.
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What is OCR?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Optical Character Recognition (OCR) is a revolutionary technology that recognizes text within a digital image. It is commonly used to recognize text in scanned documents and images. OCR software can be used to convert a physical paper document, or an image into an accessible electronic version with text.
              </p>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 mt-8">OCR Use Cases</h3>
              <ul className="space-y-3">
                {[
                  "Students extracting text from textbook photos",
                  "Businesses digitizing receipts and invoices",
                  "Researchers translating foreign language documents",
                  "Professionals converting non-editable PDFs to text"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-emerald-500 mr-2 shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Related Document Tools</h3>
              <div className="grid grid-cols-1 gap-4">
                <Link to="/document/scanner" className="flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors group bg-gray-50 dark:bg-gray-900/50">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform">
                    <Search className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Document Scanner</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Scan and crop documents</p>
                  </div>
                </Link>
                <Link to="/document/pdf-compressor" className="flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors group bg-gray-50 dark:bg-gray-900/50">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform">
                    <Settings2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">PDF Compressor</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Reduce PDF file size</p>
                  </div>
                </Link>
                <Link to="/pdf/merge" className="flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors group bg-gray-50 dark:bg-gray-900/50">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">PDF Merger</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Combine multiple PDF files</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
