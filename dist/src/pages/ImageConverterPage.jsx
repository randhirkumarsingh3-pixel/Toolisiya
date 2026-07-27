import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { Download, UploadCloud, RefreshCcw, FileArchive, FileImage as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import SEOContentSection from '@/components/SEOContentSection.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';
import { Helmet } from 'react-helmet';
import { useSEOData } from '@/hooks/useSEOData.js';

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024, dm = 2, sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const ImageConverterPage = () => {
  const { seoData } = useSEOData('image-converter');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const [files, setFiles] = useState([]);
  const [outputFormat, setOutputFormat] = useState('image/webp');
  const [pdfQuality, setPdfQuality] = useState('medium');
  const [isProcessing, setIsProcessing] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: acceptedFiles => {
      const newFiles = acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substring(7)
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  });

  useEffect(() => {
    return () => files.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
      if (file.convertedPreview) URL.revokeObjectURL(file.convertedPreview);
    });
  }, [files]);

  const convertImage = (file, format) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (format === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => resolve(blob), format || 'image/jpeg', 0.9);
      };
      img.src = file.preview;
    });
  };

  const handleConvertAll = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    
    try {
      if (outputFormat === 'application/pdf') {
        await generatePDF();
      } else {
        const safeOutputFormat = outputFormat || 'image/jpeg';
        const outputParts = safeOutputFormat.split('/');
        const extension = outputParts.length > 1 ? outputParts[1] : 'jpg';

        const updatedFiles = await Promise.all(files.map(async (file) => {
          const convertedBlob = await convertImage(file, safeOutputFormat);
          if (file.convertedPreview) URL.revokeObjectURL(file.convertedPreview);
          return {
            ...file,
            convertedBlob,
            convertedPreview: URL.createObjectURL(convertedBlob),
            convertedSize: convertedBlob.size,
            extension
          };
        }));
        setFiles(updatedFiles);
        toast.success('Images converted successfully');
      }
    } catch (error) {
      toast.error('Failed to convert images');
    } finally {
      setIsProcessing(false);
    }
  };

  const generatePDF = async () => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });

      const compressionMap = {
        low: 0.5,
        medium: 0.75,
        high: 0.95
      };
      const quality = compressionMap[pdfQuality] || 0.75;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const img = new Image();
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = file.preview;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const imgData = canvas.toDataURL('image/jpeg', quality);
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height);
        const imgX = (pdfWidth - img.width * ratio) / 2;
        const imgY = (pdfHeight - img.height * ratio) / 2;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', imgX, imgY, img.width * ratio, img.height * ratio);
      }

      pdf.save('converted_images.pdf');
      toast.success('PDF generated and downloaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleDownloadZip = async () => {
    if (files.filter(f => f.convertedBlob).length === 0) return;
    const zip = new JSZip();
    files.forEach((file, index) => {
      if (file.convertedBlob) {
        const safeName = file.name || `image_${index}`;
        const nameParts = safeName.split('.');
        const baseName = nameParts.length > 0 ? nameParts[0] : `image_${index}`;
        zip.file(`converted_${index}_${baseName}.${file.extension}`, file.convertedBlob);
      }
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted_images.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  const seoDescription = "Free online image converter. Convert your photos securely in your browser to PNG, JPG, WebP, or PDF formats in bulk. No sign-up required.";
  const seoFeatures = [
    "Convert multiple images simultaneously (Batch Processing)",
    "Supports transparent backgrounds when converting to PNG or WebP",
    "Automatically fills transparent backgrounds with white when converting to JPG or PDF",
    "100% private and secure - all processing happens inside your web browser",
    "Download all converted images neatly packaged in a single ZIP file or as a single PDF",
    "Compare file sizes before and after conversion"
  ];
  const seoSteps = [
    { title: "Select Images", description: "Drag and drop one or more images into the upload area. You can mix and match input formats." },
    { title: "Choose Output Format", description: "Select your desired destination format (PNG, JPG, WebP, or PDF) from the dropdown menu." },
    { title: "Convert Files", description: "Click the 'Convert All' button. The conversion happens instantly on your device." },
    { title: "Download Result", description: "Download files individually, as a ZIP, or as a single PDF document." }
  ];
  const seoFaqs = [
    { question: "Which image format is best for websites?", answer: "WebP is currently the gold standard for web images. It provides superior lossless and lossy compression compared to PNG and JPEG." },
    { question: "What happens to transparent backgrounds if I convert to JPG?", answer: "JPEG (JPG) does not support transparency. Our converter automatically fills any transparent areas with a solid white background." },
    { question: "Can I convert images to a single PDF?", answer: "Yes! Select PDF as the output format, choose your quality, and all uploaded images will be combined into a single PDF file." }
  ];
  const relatedTools = [
    { name: "Image Compressor", path: "/image/image-compressor" },
    { name: "Image Resizer", path: "/image/image-resizer" },
    { name: "Batch Image Processor", path: "/image/image-batch-processor" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{seoData?.meta_title || 'Free Image Converter - PNG to JPG, WebP, PDF | Toolisiya'}</title>
        {seoData?.meta_description && <meta name="description" content={seoData.meta_description} />}
        {seoData?.meta_keywords && <meta name="keywords" content={seoData.meta_keywords} />}
        {seoData?.og_title && <meta property="og:title" content={seoData.og_title} />}
        {seoData?.og_description && <meta property="og:description" content={seoData.og_description} />}
        {seoData?.og_image && <meta property="og:image" content={seoData.og_image} />}
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        {seoData?.structured_data && (
          <script type="application/ld+json">
            {typeof seoData.structured_data === 'string' ? seoData.structured_data : JSON.stringify(seoData.structured_data)}
          </script>
        )}
      </Helmet>
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <BreadcrumbNavigation customTitle="Image Converter" />
          
          <NavigationButtons />
          
          <div className="mb-8 mt-4 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-balance">{seoData?.h1_tag || 'Free Online Image Converter'}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">Convert images to PNG, JPG, WebP, or PDF format securely and instantly in your browser.</p>
          </div>

          <Card className="mb-8 shadow-lg border-border">
            <CardContent className="p-6">
              <div {...getRootProps()} className={`dropzone-container ${isDragActive ? 'dropzone-active' : ''} bg-muted/20 hover:bg-muted/40 transition-colors border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer`}>
                <input {...getInputProps()} />
                <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                  <UploadCloud className="h-10 w-10 text-primary" />
                </div>
                <p className="text-xl font-bold text-foreground mb-2">Drag & drop images here</p>
                <p className="text-sm text-muted-foreground">or click to browse your device (Any standard image format)</p>
              </div>
            </CardContent>
          </Card>

          {files.length > 0 && (
            <div className="space-y-6 animate-fade-in">
              <Card className="shadow-lg border-border">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-muted/30 border-b pb-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <Label className="whitespace-nowrap font-bold text-base">Convert all to:</Label>
                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                      <SelectTrigger className="w-[180px] h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image/png">PNG</SelectItem>
                        <SelectItem value="image/jpeg">JPG (JPEG)</SelectItem>
                        <SelectItem value="image/webp">WebP</SelectItem>
                        <SelectItem value="application/pdf">PDF Document</SelectItem>
                      </SelectContent>
                    </Select>

                    {outputFormat === 'application/pdf' && (
                      <Select value={pdfQuality} onValueChange={setPdfQuality}>
                        <SelectTrigger className="w-[140px] h-11"><SelectValue placeholder="Quality" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Quality</SelectItem>
                          <SelectItem value="medium">Medium Quality</SelectItem>
                          <SelectItem value="high">High Quality</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={() => setFiles([])} className="flex-1 sm:flex-none"><RefreshCcw className="h-4 w-4 mr-2"/> Clear All</Button>
                    <Button onClick={handleConvertAll} disabled={isProcessing} className="flex-1 sm:flex-none font-bold">
                      {isProcessing ? 'Processing...' : (outputFormat === 'application/pdf' ? 'Download PDF' : 'Convert All')}
                    </Button>
                    {outputFormat !== 'application/pdf' && (
                      <Button variant="secondary" onClick={handleDownloadZip} disabled={!files.some(f => f.convertedBlob)} className="flex-1 sm:flex-none">
                        <FileArchive className="h-4 w-4 mr-2"/> Download ZIP
                      </Button>
                    )}
                  </div>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {files.map(file => {
                  const safeType = file.type || '';
                  const typeParts = safeType.split('/');
                  const displayType = typeParts.length > 1 ? typeParts[1].toUpperCase() : 'UNKNOWN';

                  return (
                    <Card key={file.id} className="overflow-hidden flex flex-col shadow-md border-border">
                      <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
                        <span className="truncate max-w-[180px] text-sm font-semibold text-foreground" title={file.name}>{file.name || 'Unnamed Image'}</span>
                        <Badge variant="outline" className="font-mono bg-background">{displayType}</Badge>
                      </div>
                      <div className="checkerboard-bg h-[220px] flex items-center justify-center border-b border-border/50 shadow-inner">
                        <img src={file.convertedPreview || file.preview} alt="Preview" className="max-h-full max-w-full object-contain p-2" />
                      </div>
                      {outputFormat !== 'application/pdf' && (
                        <div className="p-5 bg-card flex-1 flex flex-col justify-end gap-4">
                          <div className="flex justify-between text-sm items-center">
                            <span className="text-muted-foreground font-medium flex flex-col"><span>Original</span><span>{formatBytes(file.size)}</span></span>
                            {file.convertedSize && (
                              <span className="font-bold text-primary flex flex-col text-right"><span>New Output</span><span>{formatBytes(file.convertedSize)}</span></span>
                            )}
                          </div>
                          {file.convertedPreview ? (
                            <Button className="w-full shadow-sm" onClick={() => {
                              const safeName = file.name || 'image';
                              const nameParts = safeName.split('.');
                              const baseName = nameParts.length > 0 ? nameParts[0] : 'image';
                              const a = document.createElement('a');
                              a.href = file.convertedPreview;
                              a.download = `${baseName}.${file.extension}`;
                              a.click();
                            }}>
                              <Download className="h-4 w-4 mr-2" /> Download .{file.extension?.toUpperCase() || 'FILE'}
                            </Button>
                          ) : (
                            <Button variant="outline" className="w-full bg-muted/50" disabled>Waiting to Convert</Button>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          <SEOContentSection 
            description={seoDescription}
            features={seoFeatures}
            howToSteps={seoSteps}
            faqs={seoFaqs}
            relatedTools={relatedTools}
            categoryPath="/image"
          />

        </div>
      </main>
    </div>
  );
};

export default ImageConverterPage;