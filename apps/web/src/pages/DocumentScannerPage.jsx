import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Camera, RefreshCw, Check, X, Download, FileImage, FileText, GripVertical, Trash2, Plus, Sun, Contrast, Upload, Smartphone, AlertCircle, ArrowRight } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import SEOHead from '@/components/SEOHead.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';

export default function DocumentScannerPage() {
  // 5-step workflow: 1: capture, 2: adjust, 3: save, 4: review, 5: export
  const [step, setStep] = useState(1); 
  const [stream, setStream] = useState(null);
  const [scans, setScans] = useState([]); 
  const [cameraError, setCameraError] = useState(null);
  
  // Current capture processing
  const [rawCapture, setRawCapture] = useState(null);
  
  // Crop State
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  
  // Edit State (Filters & Adjustments)
  const [filterMode, setFilterMode] = useState('original'); 
  const [brightness, setBrightness] = useState(100); 
  const [contrast, setContrast] = useState(100); 
  
  // Export State
  const [exportFormat, setExportFormat] = useState('pdf'); 
  const [exportQuality, setExportQuality] = useState(0.8); 
  const [isExporting, setIsExporting] = useState(false);
  
  const videoRef = useRef(null);
  const imgRef = useRef(null); 
  const fileInputRef = useRef(null);

  // Stop camera stream safely
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Clean up on unmount
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser.');
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      setStream(mediaStream);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(e => {
            console.error("Play error", e);
            setCameraError('Unable to start video preview.');
          });
        }
      }, 100);
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError(err.message || 'Camera access denied. Please allow camera access or upload a file.');
      toast.error('Unable to access camera.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Prevent empty file read errors
    if (file.size === 0) {
      toast.error('The selected file is empty.');
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      toast.error('Failed to read the file.');
    };
    reader.onload = (event) => {
      const result = event.target.result;
      if (result) {
        setRawCapture(result);
        stopCamera();
        setStep(2);
      } else {
        toast.error('Failed to process image data.');
      }
    };
    reader.readAsDataURL(file);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
      if (imageUrl && imageUrl.length > 10) {
        setRawCapture(imageUrl);
        stopCamera();
        setStep(2);
      } else {
        throw new Error('Generated image is empty');
      }
    } catch (err) {
      toast.error('Failed to capture photo.');
    }
  };

  // Initialize crop boundaries (simulating auto edge detection by inset)
  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    if (!width || !height) return;
    setCrop({ unit: '%', width: 90, height: 90, x: 5, y: 5 });
    setCompletedCrop({
      unit: '%',
      width: 90, height: 90, x: 5, y: 5,
      width_px: width * 0.9, height_px: height * 0.9
    });
  };

  // Apply crop and filters to generate final image for this page
  const handleSavePage = () => {
    if (!completedCrop || !imgRef.current || !completedCrop.width || !completedCrop.height) {
      toast.error('Please adjust the crop area first.');
      return;
    }

    try {
      const image = imgRef.current;
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;
      const ctx = canvas.getContext('2d');

      // Draw cropped area
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0, 0, canvas.width, canvas.height
      );

      // Apply filters
      let finalContrast = contrast;
      if (filterMode === 'bw') {
        finalContrast = contrast + 150; 
      }
      
      let filterStr = `brightness(${brightness}%) contrast(${finalContrast}%)`;
      if (filterMode !== 'original') {
        filterStr += ' grayscale(100%)';
      }

      ctx.filter = filterStr;
      ctx.globalCompositeOperation = 'copy';
      ctx.drawImage(canvas, 0, 0);

      const finalImageUrl = canvas.toDataURL('image/jpeg', 0.95);
      
      if (finalImageUrl && finalImageUrl.length > 20) {
        const newScan = {
          id: `scan_${Date.now()}`,
          cropped: finalImageUrl,
        };

        setScans(prev => [...prev, newScan]);
        setRawCapture(null);
        
        // Reset edit settings
        setFilterMode('original');
        setBrightness(100);
        setContrast(100);
        
        setStep(3);
        toast.success('Page saved successfully!');
      } else {
        toast.error('Failed to generate image data.');
      }
    } catch (err) {
      toast.error('Error processing the image.');
      console.error(err);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(scans);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setScans(items);
  };

  const deleteScan = (id) => {
    setScans(prev => {
      const updated = prev.filter(scan => scan.id !== id);
      if (updated.length === 0) setStep(1);
      return updated;
    });
  };

  const handleExport = async () => {
    if (scans.length === 0) return;
    setIsExporting(true);
    
    try {
      if (exportFormat === 'pdf') {
        const a4Width = 595.28;
        const a4Height = 841.89;
        const pdf = new jsPDF({ format: 'a4', unit: 'pt' });

        for (let index = 0; index < scans.length; index++) {
          const scan = scans[index];
          if (index > 0) pdf.addPage();
          
          if (!scan.cropped || !scan.cropped.startsWith('data:image')) continue;

          const imgProps = pdf.getImageProperties(scan.cropped);
          const imgRatio = imgProps.width / imgProps.height;
          const a4Ratio = a4Width / a4Height;
          
          let renderWidth, renderHeight;
          
          if (imgRatio > a4Ratio) {
            renderWidth = a4Width;
            renderHeight = a4Width / imgRatio;
          } else {
            renderHeight = a4Height;
            renderWidth = a4Height * imgRatio;
          }
          
          const x = (a4Width - renderWidth) / 2;
          const y = (a4Height - renderHeight) / 2;
          
          pdf.addImage(scan.cropped, 'JPEG', x, y, renderWidth, renderHeight, undefined, 'FAST');
        }

        pdf.save(`Scanned_Document_${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success('PDF downloaded successfully!');
      } else {
        // Zip images if multiple, or download directly if single
        if (scans.length === 1 && scans[0].cropped) {
          const link = document.createElement('a');
          link.href = scans[0].cropped;
          link.download = `Scan.${exportFormat}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success('Image downloaded!');
        } else if (scans.length > 1) {
          const zip = new JSZip();
          scans.forEach((scan, index) => {
            if (scan.cropped && scan.cropped.includes(',')) {
              const base64Data = scan.cropped.split(',')[1];
              zip.file(`Page_${index + 1}.${exportFormat}`, base64Data, {base64: true});
            }
          });
          const content = await zip.generateAsync({ type: 'blob' });
          const url = URL.createObjectURL(content);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Scanned_Images.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          toast.success('Images downloaded as ZIP!');
        }
      }
    } catch (error) {
      console.error('Export Error:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Helper to generate the current CSS filter for the edit preview
  const getPreviewFilterStyle = () => {
    let c = contrast;
    if (filterMode === 'bw') c += 150;
    
    let filter = `brightness(${brightness}%) contrast(${c}%)`;
    if (filterMode !== 'original') filter += ' grayscale(100%)';
    return filter;
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col relative w-full overflow-x-hidden">
      <SEOHead 
        title="Free Online Document Scanner - Scan to PDF | Toolisiya"
        description="Scan physical documents, receipts, notes, and books using your device camera and save as PDF or images. Free, browser-based, no upload — 100% private."
        keywords="document scanner online, scan to pdf, mobile document scanner, free document scanner, scan receipt, scan notes to pdf, browser document scanner"
        canonical="https://toolisiya.com/pdf/document-scanner"
      />

      <div className="bg-card border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2 md:gap-4 max-w-full overflow-x-auto custom-scrollbar">
          {[1, 2, 3, 4, 5].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {s}
              </div>
              {s < 5 && <div className={`w-4 md:w-8 h-0.5 shrink-0 transition-colors ${step > s ? 'bg-primary' : 'bg-muted'}`}></div>}
            </React.Fragment>
          ))}
        </div>
        {scans.length > 0 && step < 4 && (
          <Button variant="ghost" size="sm" onClick={() => setStep(4)} className="text-primary whitespace-nowrap ml-4">
            {scans.length} {scans.length === 1 ? 'Page' : 'Pages'}
          </Button>
        )}
      </div>

      <div className="flex-1 w-full max-w-3xl mx-auto flex flex-col">
        {/* STEP 1: CAPTURE */}
        {step === 1 && (
          <div className="flex-1 flex flex-col w-full px-4 py-8">
            <div className="mb-4">
              <BreadcrumbNavigation customTitle="Document Scanner" />
            </div>
            {!stream ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Smartphone className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Scan Document</h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Use your device camera to capture pages, or upload an existing image.
                </p>
                
                {cameraError && (
                  <Alert variant="destructive" className="mb-6 text-left">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Camera Error</AlertTitle>
                    <AlertDescription>{cameraError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex flex-col w-full gap-4">
                  <Button size="lg" className="h-14 text-lg rounded-xl shadow-md w-full" onClick={startCamera}>
                    <Camera className="mr-2 w-5 h-5" /> Open Camera
                  </Button>
                  <div className="relative w-full">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={handleFileUpload}
                      ref={fileInputRef}
                    />
                    <Button variant="outline" size="lg" className="w-full h-14 text-lg rounded-xl border-border">
                      <Upload className="mr-2 w-5 h-5" /> Upload Image
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              createPortal(
                <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
                  <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      className="absolute min-w-full min-h-full object-cover"
                    />
                    <div className="absolute inset-8 md:inset-16 border-2 border-white/50 rounded-xl pointer-events-none">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl"></div>
                    </div>
                  </div>
                  <div className="h-36 bg-black/90 flex items-center justify-between px-10 pb-8 md:pb-6">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full w-12 h-12" onClick={stopCamera}>
                      <X className="w-8 h-8" />
                    </Button>
                    <button 
                      onClick={capturePhoto}
                      className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent active:scale-95 transition-transform"
                      aria-label="Take photo"
                    >
                      <div className="w-16 h-16 rounded-full bg-white"></div>
                    </button>
                    <div className="w-12"></div>
                  </div>
                </div>,
                document.body
              )
            )}
          </div>
        )}

        {/* STEP 2: ADJUST */}
        {step === 2 && rawCapture && (
          <div className="flex-1 flex flex-col w-full bg-card h-[calc(100vh-60px)]">
            <div className="flex-1 overflow-auto bg-muted/20 flex items-center justify-center p-4">
              <div className="relative shadow-xl border rounded-lg bg-white overflow-hidden max-w-full">
                <ReactCrop
                  crop={crop}
                  onChange={c => setCrop(c)}
                  onComplete={c => setCompletedCrop(c)}
                  className="max-h-[50vh]"
                >
                  {rawCapture && (
                    <img 
                      ref={imgRef}
                      src={rawCapture} 
                      alt="Captured" 
                      onLoad={onImageLoad}
                      className="max-h-[50vh] w-auto object-contain pointer-events-none"
                      style={{ filter: getPreviewFilterStyle() }}
                    />
                  )}
                </ReactCrop>
              </div>
            </div>
            
            <div className="bg-card border-t border-border p-4 space-y-5 pb-safe">
              <Tabs value={filterMode} onValueChange={setFilterMode} className="w-full max-w-sm mx-auto">
                <TabsList className="grid w-full grid-cols-3 h-12 rounded-xl">
                  <TabsTrigger value="original" className="rounded-lg">Color</TabsTrigger>
                  <TabsTrigger value="grayscale" className="rounded-lg">Gray</TabsTrigger>
                  <TabsTrigger value="bw" className="rounded-lg">B&W</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-4 max-w-sm mx-auto px-2">
                <div className="flex items-center gap-4">
                  <Sun className="w-5 h-5 text-muted-foreground shrink-0" />
                  <Slider value={[brightness]} onValueChange={([v]) => setBrightness(v)} max={200} step={1} className="flex-1" />
                </div>
                <div className="flex items-center gap-4">
                  <Contrast className="w-5 h-5 text-muted-foreground shrink-0" />
                  <Slider value={[contrast]} onValueChange={([v]) => setContrast(v)} max={200} step={1} className="flex-1" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 h-14 text-base rounded-xl" onClick={() => { setRawCapture(null); setStep(1); }}>
                  Retake
                </Button>
                <Button className="flex-1 h-14 text-base rounded-xl" onClick={handleSavePage}>
                  Save Page
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 3 && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Check className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Page Saved!</h2>
            <p className="text-muted-foreground text-lg mb-10">
              Document currently has {scans.length} {scans.length === 1 ? 'page' : 'pages'}.
            </p>
            
            <div className="flex flex-col w-full gap-4">
              <Button size="lg" className="h-14 text-lg rounded-xl" onClick={() => setStep(1)}>
                <Plus className="mr-2 w-5 h-5" /> Add Another Page
              </Button>
              <Button variant="secondary" size="lg" className="h-14 text-lg rounded-xl border-border border" onClick={() => setStep(4)}>
                <GripVertical className="mr-2 w-5 h-5" /> Organize & Export
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: ORGANIZE */}
        {step === 4 && (
          <div className="flex-1 flex flex-col w-full p-4 h-[calc(100vh-60px)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">Review Pages</h2>
                <p className="text-sm text-muted-foreground">Drag to reorder. {scans.length} total.</p>
              </div>
              <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" /> Add
              </Button>
            </div>

            <div className="flex-1 overflow-auto bg-muted/20 rounded-xl border p-4 mb-4">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="scan-list">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {scans.map((scan, index) => (
                        <Draggable key={scan.id} draggableId={scan.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="group relative bg-white border border-border rounded-xl overflow-hidden shadow-sm"
                            >
                              <div className="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                                {index + 1}
                              </div>
                              <div 
                                {...provided.dragHandleProps}
                                className="absolute top-2 right-10 z-10 bg-black/50 text-white p-1.5 rounded-lg cursor-grab active:cursor-grabbing backdrop-blur-sm touch-none"
                              >
                                <GripVertical className="w-4 h-4" />
                              </div>
                              <button 
                                onClick={() => deleteScan(scan.id)}
                                className="absolute top-2 right-2 z-10 bg-destructive/90 text-white p-1.5 rounded-lg hover:bg-destructive backdrop-blur-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              {scan.cropped && (
                                <img 
                                  src={scan.cropped} 
                                  alt={`Page ${index + 1}`} 
                                  className="w-full aspect-[1/1.414] object-cover pointer-events-none bg-muted"
                                />
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            <div className="pb-safe">
              <Button size="lg" className="w-full h-14 text-lg rounded-xl" onClick={() => setStep(5)}>
                Continue to Export <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: EXPORT */}
        {step === 5 && (
          <div className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold mb-6 text-center">Export Document</h2>
            
            <div className="space-y-8 bg-card border rounded-2xl p-6 shadow-sm mb-6">
              <div className="space-y-3">
                <label className="text-sm font-bold">File Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {['pdf', 'jpg', 'png'].map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setExportFormat(fmt)}
                      className={`h-12 rounded-xl border uppercase font-semibold transition-all ${exportFormat === fmt ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-background hover:bg-muted text-foreground'}`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold">Quality / File Size</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setExportQuality(0.5)}
                    className={`h-12 rounded-xl border font-semibold transition-all ${exportQuality === 0.5 ? 'bg-primary/10 border-primary text-primary' : 'bg-background hover:bg-muted'}`}
                  >
                    Low
                  </button>
                  <button
                    onClick={() => setExportQuality(0.8)}
                    className={`h-12 rounded-xl border font-semibold transition-all ${exportQuality === 0.8 ? 'bg-primary/10 border-primary text-primary' : 'bg-background hover:bg-muted'}`}
                  >
                    Med
                  </button>
                  <button
                    onClick={() => setExportQuality(1.0)}
                    className={`h-12 rounded-xl border font-semibold transition-all ${exportQuality === 1.0 ? 'bg-primary/10 border-primary text-primary' : 'bg-background hover:bg-muted'}`}
                  >
                    High
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pb-safe mt-auto">
              <Button size="lg" className="w-full h-14 text-lg rounded-xl shadow-md" onClick={handleExport} disabled={isExporting}>
                {isExporting ? 'Processing...' : (
                  <>
                    <Download className="mr-2 w-5 h-5" /> 
                    Download {exportFormat.toUpperCase()}
                  </>
                )}
              </Button>
              <Button variant="ghost" className="w-full h-12 rounded-xl text-muted-foreground" onClick={() => setStep(4)} disabled={isExporting}>
                Back to Review
              </Button>
            </div>
          </div>
        )}
        {/* SEO & AdSense Content Section - shown on initial load */}
        {step === 1 && !stream && (
          <div className="w-full max-w-3xl mx-auto px-4 pb-16 mt-8 space-y-10">

            {/* Introduction */}
            <section>
              <h1 className="text-2xl font-bold mb-3">Free Online Document Scanner</h1>
              <p className="text-muted-foreground leading-relaxed">
                The <strong>Toolisiya Document Scanner</strong> is a free, browser-based tool that lets you scan physical documents, receipts, notes, and books using your device camera and instantly save them as high-quality PDFs or images. No app download needed — it works entirely in your browser, keeping your documents private and secure.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Whether you are a student scanning class notes, a professional digitising contracts, or someone converting old paper documents into a shareable digital format, this tool handles it all with ease. Multi-page scanning, crop adjustment, brightness and contrast controls, and PDF export are all included — completely free of cost.
              </p>
            </section>

            {/* Key Features */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Key Features</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {[
                  { title: "Camera & Upload Support", desc: "Use your device camera or upload an existing image file." },
                  { title: "Smart Crop Tool", desc: "Manually adjust the crop area to perfectly frame your document." },
                  { title: "Color, Grayscale & B&W Modes", desc: "Choose the right filter for crisp, readable scans." },
                  { title: "Brightness & Contrast Control", desc: "Fine-tune image quality for perfect output every time." },
                  { title: "Multi-page Documents", desc: "Scan multiple pages and arrange them before export." },
                  { title: "PDF & Image Export", desc: "Download your scans as a single PDF, JPG, or PNG file." },
                  { title: "100% Private", desc: "All processing happens in your browser. Nothing is uploaded to a server." },
                  { title: "Works on Mobile & Desktop", desc: "Optimised for smartphone cameras and desktop uploads alike." },
                ].map((f) => (
                  <li key={f.title} className="flex gap-3 p-3 rounded-xl border bg-card">
                    <span className="mt-0.5 text-primary">✓</span>
                    <div>
                      <p className="font-medium text-sm">{f.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* How to Use */}
            <section>
              <h2 className="text-xl font-semibold mb-4">How to Scan a Document — Step by Step</h2>
              <ol className="space-y-4">
                {[
                  { step: "1", title: "Open the Camera or Upload an Image", desc: "Click 'Open Camera' to use your device's camera. Alternatively, click 'Upload Image' to use an existing photo from your gallery or computer." },
                  { step: "2", title: "Capture or Select the Document", desc: "Point the camera at your document and press the capture button. A preview of the captured image will appear. If uploading, select the file you want to scan." },
                  { step: "3", title: "Adjust Crop and Filters", desc: "Drag the crop handles to frame your document precisely. Choose between Color, Grayscale, or Black & White mode and adjust brightness and contrast for best readability." },
                  { step: "4", title: "Save the Page", desc: "Click 'Save Page' to add this capture to your document. Repeat for as many pages as you need." },
                  { step: "5", title: "Export as PDF or Image", desc: "Review your pages, drag to reorder them, then choose your preferred export format (PDF, JPG, or PNG) and click Download." },
                ].map((item) => (
                  <li key={item.step} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">{item.step}</div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Use Cases */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Who Uses This Tool?</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                This document scanner is used daily by <strong>students</strong> to digitise handwritten notes and textbook pages, <strong>professionals</strong> to scan contracts, invoices, and business cards, <strong>freelancers</strong> to share signed agreements quickly, and <strong>home users</strong> to archive important paper documents like insurance papers, certificates, and receipts. Its zero-install, browser-based design makes it accessible to anyone on any device.
              </p>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  { q: "Is this document scanner free to use?", a: "Yes, the Toolisiya Document Scanner is completely free with no hidden fees, subscriptions, or account required." },
                  { q: "Does it work on mobile phones?", a: "Yes. The tool is fully optimised for mobile device cameras. On smartphones, it defaults to the rear camera for best document quality." },
                  { q: "Is my document uploaded to any server?", a: "No. All scanning and processing happens locally inside your browser. Your documents are never uploaded or stored anywhere." },
                  { q: "How many pages can I scan at once?", a: "You can scan as many pages as your browser's memory allows. Most devices comfortably handle 10–20 pages in a single session." },
                  { q: "What formats can I export in?", a: "You can export your scanned document as a multi-page PDF, or save individual pages as JPG or PNG image files." },
                  { q: "Can I scan in black and white?", a: "Yes. The B&W filter with increased contrast is ideal for scanning printed text as it produces sharp, highly readable output and smaller file sizes." },
                  { q: "Does it automatically detect document edges?", a: "The tool provides an initial crop suggestion. You can manually adjust the crop boundaries to precisely match your document's edges." },
                ].map((faq) => (
                  <details key={faq.q} className="border rounded-xl p-4 group">
                    <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
                      {faq.q}
                      <span className="text-muted-foreground text-lg ml-2 group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* Related Tools */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Related PDF Tools</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { name: "PDF Compressor", path: "/pdf/pdf-compressor" },
                  { name: "PDF Merger", path: "/pdf/pdf-merger" },
                  { name: "PDF Splitter", path: "/pdf/pdf-splitter" },
                  { name: "PDF to Image", path: "/pdf/pdf-to-image-converter" },
                  { name: "PDF Page Rotator", path: "/pdf/pdf-page-rotator" },
                  { name: "PDF Watermark Adder", path: "/pdf/pdf-watermark-adder" },
                ].map((tool) => (
                  <a key={tool.name} href={tool.path} className="text-sm text-center p-3 rounded-xl border bg-card hover:bg-muted hover:border-primary transition-colors font-medium text-primary">
                    {tool.name}
                  </a>
                ))}
              </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
}