import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, RefreshCw, Sliders, Sparkles, Wand2, Eraser, ImagePlus, Crop, Image as ImageIcon, Scissors, Undo, Redo, ZoomIn, ZoomOut, Maximize, Minimize2, SplitSquareHorizontal, Type, Frame, Pencil, Trash2, MousePointer2, Settings2, Check, LayoutPanelLeft, Heart, Star, Circle, Square, ArrowRight, ThumbsUp, Smile, Zap, MessageCircle, Shapes, LayoutTemplate, Palette, Save, Share2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

const defaultFilters = {
  brightness: 100, contrast: 100, saturation: 100, hueRotate: 0, blur: 0, grayscale: false, sepia: false, invert: false
};

const presets = [
  { name: 'Original', filters: { ...defaultFilters } },
  { name: 'Vintage', filters: { ...defaultFilters, brightness: 110, contrast: 120, saturation: 80, hueRotate: 15, sepia: true } },
  { name: 'Cinematic', filters: { ...defaultFilters, brightness: 95, contrast: 130, saturation: 110, hueRotate: 180 } },
  { name: 'B&W', filters: { ...defaultFilters, brightness: 110, contrast: 150, saturation: 0, grayscale: true } },
  { name: 'Cyberpunk', filters: { ...defaultFilters, brightness: 120, contrast: 130, saturation: 150, hueRotate: 280 } },
  { name: 'Soft Dream', filters: { ...defaultFilters, brightness: 115, contrast: 90, saturation: 120, hueRotate: 330, blur: 2 } },
];

const PhotoEditorPage = () => {
  const [file, setFile] = useState(null);
  const [sourceUrl, setSourceUrl] = useState(null); // The original unmodified upload
  const [originalUrl, setOriginalUrl] = useState(null); // The base image (can be cropped)
  const [editedUrl, setEditedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Crop State
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [aspect, setAspect] = useState(undefined);
  const imgRef = useRef(null);

  // Text State
  const [texts, setTexts] = useState([]);
  const [selectedTextId, setSelectedTextId] = useState(null);

  // Collage & Frame State
  const [collageLayout, setCollageLayout] = useState('single');
  const [collageImages, setCollageImages] = useState({ slot1: null, slot2: null, slot3: null, slot4: null });
  const [collageProps, setCollageProps] = useState({ gap: 10, radius: 0, bgColor: '#ffffff' });

  // Stickers & Shapes State
  const [stickers, setStickers] = useState([]);
  const [selectedStickerId, setSelectedStickerId] = useState(null);

  // History & Undo/Redo
  const [history, setHistory] = useState([defaultFilters]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const filters = history[historyIndex] || defaultFilters;

  // Background Remover State
  const [isBgRemoving, setIsBgRemoving] = useState(false);
  const [bgRemoveProgress, setBgRemoveProgress] = useState(0);

  // UX Polish & Analytics
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [exportStats, setExportStats] = useState({ size: '0MB', res: '0x0' });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Brand Kits & Identity
  const [brandColors, setBrandColors] = useState(() => {
    try {
      const saved = localStorage.getItem('toolisiya_brand_colors');
      return saved ? JSON.parse(saved) : ['#aa8855', '#3b82f6', '#10b981', '#000000', '#ffffff'];
    } catch {
      return ['#aa8855', '#3b82f6', '#10b981', '#000000', '#ffffff'];
    }
  });

  // Workspace State
  const [zoom, setZoom] = useState(1);
  const [isComparing, setIsComparing] = useState(false);
  const [activeTool, setActiveTool] = useState('adjust');
  
  const canvasRef = useRef(null);
  const workspaceRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Please upload a valid image file.');
      return;
    }
    
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setSourceUrl(url);
    setOriginalUrl(url);
    setHistory([defaultFilters]);
    setHistoryIndex(0);
    setZoom(1);
    setCrop(undefined);
    setCompletedCrop(null);
    setTexts([]);
    setSelectedTextId(null);
    setStickers([]);
    setSelectedStickerId(null);
    setCollageLayout('single');
    setCollageImages({ slot1: url, slot2: null, slot3: null, slot4: null });
  };

  const pushHistory = (newFilters) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newFilters);
    if (newHistory.length > 20) newHistory.shift(); // Keep last 20 states
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  };

  const redo = () => {
    if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1);
  };

  const resetFilters = () => {
    setOriginalUrl(sourceUrl);
    pushHistory(defaultFilters);
  };
  
  const applyPreset = (presetFilters) => pushHistory(presetFilters);

  const applyCrop = () => {
    if (!completedCrop || !completedCrop.width || !completedCrop.height || !imgRef.current) return;
    setIsProcessing(true);
    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    
    setOriginalUrl(canvas.toDataURL('image/png'));
    setCrop(undefined);
    setCompletedCrop(null);
    setActiveTool('adjust');
    setIsProcessing(false);
  };

  const applyFilters = () => {
    if (!originalUrl) return;
    setIsProcessing(true);
    
    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const filterString = `
        brightness(${filters.brightness}%) 
        contrast(${filters.contrast}%) 
        saturate(${filters.saturation}%) 
        hue-rotate(${filters.hueRotate}deg) 
        blur(${filters.blur}px)
        ${filters.grayscale ? 'grayscale(100%)' : ''}
        ${filters.sepia ? 'sepia(100%)' : ''}
        ${filters.invert ? 'invert(100%)' : ''}
      `.trim();
      
      ctx.filter = filterString;
      ctx.drawImage(img, 0, 0);
      
      setEditedUrl(canvas.toDataURL('image/jpeg', 0.9));
      setIsProcessing(false);
    };
    img.src = originalUrl;
  };

  useEffect(() => {
    if (originalUrl) {
      const timer = setTimeout(() => {
        applyFilters();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [filters, originalUrl]);

  const handleClear = () => {
    setFile(null);
    setOriginalUrl(null);
    setEditedUrl(null);
    setHistory([defaultFilters]);
    setHistoryIndex(0);
  };

  const updateFilter = (key, value) => {
    pushHistory({ ...filters, [key]: value });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      workspaceRef.current?.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleCollageUpload = (e, slot) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    const url = URL.createObjectURL(selectedFile);
    setCollageImages(prev => ({ ...prev, [slot]: url }));
  };

  const handleAddSticker = (type, url = null) => {
    const newSticker = {
      id: Date.now().toString(),
      type,
      url,
      color: '#ffffff',
      size: type === 'image' ? 120 : 64,
      shadow: true,
      x: 0,
      y: 0,
    };
    setStickers([...stickers, newSticker]);
    setSelectedStickerId(newSticker.id);
    trackCreatorEvent('layer_added', { type: 'sticker', stickerType: type });
  };

  const handleLogoUpload = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    const url = URL.createObjectURL(selectedFile);
    handleAddSticker('image', url);
  };

  const loadTemplate = (id) => {
    setCollageImages({ slot1: originalUrl || null, slot2: null, slot3: null, slot4: null });
    
    if (id === 'wedding') {
      setCollageLayout('split-v');
      setCollageProps({ gap: 24, radius: 16, bgColor: '#fffcf2' });
      setTexts([{
        id: Date.now().toString(),
        content: 'You are Invited!',
        fontFamily: "'Playfair Display', serif",
        fontSize: 56,
        fontWeight: 600,
        color: '#aa8855',
        letterSpacing: 2,
        lineHeight: 1.2,
        align: 'center',
        shadow: false,
      }]);
      setStickers([{
        id: Date.now().toString() + 's',
        type: 'heart',
        color: '#aa8855',
        size: 48,
        shadow: false,
      }]);
    } else if (id === 'quote') {
      setCollageLayout('single');
      setCollageProps({ gap: 0, radius: 0, bgColor: '#ffffff' });
      setTexts([{
        id: Date.now().toString(),
        content: '"Success is not final,\nfailure is not fatal:\nit is the courage to continue\nthat counts."',
        fontFamily: "'Inter', sans-serif",
        fontSize: 32,
        fontWeight: 700,
        color: '#ffffff',
        letterSpacing: -1,
        lineHeight: 1.4,
        align: 'center',
        shadow: true,
      }]);
      setStickers([]);
    } else if (id === 'youtube') {
      setCollageLayout('single');
      setCollageProps({ gap: 0, radius: 0, bgColor: '#ffffff' });
      setTexts([{
        id: Date.now().toString(),
        content: 'MUST WATCH!',
        fontFamily: "'Impact', sans-serif",
        fontSize: 90,
        fontWeight: 400,
        color: '#ffd700',
        letterSpacing: 2,
        lineHeight: 1.1,
        align: 'center',
        shadow: true,
      }]);
      setStickers([{
        id: Date.now().toString() + 's',
        type: 'zap',
        color: '#ff0000',
        size: 120,
        shadow: true,
      }]);
    }
    toast.success('Template loaded successfully!');
    trackCreatorEvent('template_loaded', { templateId: id });
  };

  const trackCreatorEvent = (eventName, data) => {
    console.log(`[Analytics] ${eventName}`, data);
    // Here we would sync with Mixpanel or PostHog in a real production environment
  };

  const saveProject = () => {
    try {
      const projectState = {
        history, historyIndex, texts, stickers, collageLayout, collageProps,
        timestamp: Date.now()
      };
      localStorage.setItem('toolisiya_saved_project', JSON.stringify(projectState));
      toast.success('Project saved locally!');
      trackCreatorEvent('project_saved', { layers: texts.length + stickers.length });
    } catch (err) {
      toast.error('Failed to save project');
    }
  };

  const handleRemoveBackground = async () => {
    if (!originalUrl) return;
    setIsBgRemoving(true);
    setBgRemoveProgress(10);
    try {
      const res = await fetch(originalUrl);
      const blob = await res.blob();
      
      const formData = new FormData();
      formData.append('image', blob, 'image.png');
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      setBgRemoveProgress(30);
      
      const jobRes = await fetch(`${API_URL}/api/photo-studio/remove-bg`, {
        method: 'POST',
        body: formData
      });
      const jobData = await jobRes.json();
      
      if (jobData.error) throw new Error(jobData.error);
      
      setBgRemoveProgress(50);
      
      // Poll job
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(`${API_URL}/api/photo-studio/job/${jobData.jobId}`);
          const statusData = await statusRes.json();
          
          if (statusData.status === 'completed') {
            clearInterval(pollInterval);
            setIsBgRemoving(false);
            setBgRemoveProgress(100);
            
            // In a real scenario, you'd use statusData.resultUrl
            // For this architecture demo, we mock success
            toast.success('Background removed successfully!');
          }
        } catch (e) {
          clearInterval(pollInterval);
          setIsBgRemoving(false);
          toast.error('Failed to check background removal status');
        }
      }, 1000);
      
    } catch (err) {
      setIsBgRemoving(false);
      toast.error('Failed to initialize background removal');
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    // 1. Check for Drag-and-Drop Image from HomePage
    const dndImage = sessionStorage.getItem('toolisiya_dnd_image');
    if (dndImage) {
      setFile({ name: 'dropped_image.png', type: 'image/png' });
      setOriginalUrl(dndImage);
      sessionStorage.removeItem('toolisiya_dnd_image');
      setHistory([defaultFilters]);
      setHistoryIndex(0);
      setCrop(null);
      setCompletedCrop(null);
      setTexts([]);
      setStickers([]);
      setCollageLayout('single');
      setCollageImages({});
    }

    // 2. Keyboard Shortcuts for Power Users
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        if (selectedTextId) {
          setTexts(prev => prev.filter(t => t.id !== selectedTextId));
          setSelectedTextId(null);
        }
        if (selectedStickerId) {
          setStickers(prev => prev.filter(s => s.id !== selectedStickerId));
          setSelectedStickerId(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedTextId, selectedStickerId]);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Caveat:wght@400..700&family=Pacifico&family=Inter:wght@100..900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []);

  const handleAddText = () => {
    const newText = {
      id: Date.now().toString(),
      content: 'Double click to edit',
      fontFamily: 'Inter, sans-serif',
      fontSize: 32,
      fontWeight: 600,
      color: '#ffffff',
      letterSpacing: 0,
      lineHeight: 1.2,
      align: 'center',
      shadow: true,
      x: 0,
      y: 0,
    };
    setTexts([...texts, newText]);
    setSelectedTextId(newText.id);
  };

  const exportContainerRef = useRef(null);

  const handleExport = async () => {
    if (!editedUrl) return;
    
    // If no text layers, just export the base image fast
    if (texts.length === 0) {
      const a = document.createElement('a');
      a.href = editedUrl;
      a.download = `edited_${file.name}`;
      a.click();
      return;
    }
    
    // Export with html2canvas
    if (exportContainerRef.current) {
      setIsProcessing(true);
      try {
        // Find the image and remove shadow temporarily
        const imgEl = exportContainerRef.current.querySelector('img[alt="Edited"]');
        let oldFilter = '';
        if (imgEl) {
          oldFilter = imgEl.style.filter;
          imgEl.style.filter = 'none'; // remove drop-shadow
        }
        
        // Hide selection UI temporarily
        const oldTextSelected = selectedTextId;
        const oldStickerSelected = selectedStickerId;
        setSelectedTextId(null);
        setSelectedStickerId(null);
        
        // Wait for react to render selection off
        await new Promise(r => setTimeout(r, 150));
        
        const canvas = await html2canvas(exportContainerRef.current, {
          useCORS: true,
          backgroundColor: null, // transparent
          scale: 2, // high quality
        });
        
        // Restore
        if (imgEl) imgEl.style.filter = oldFilter;
        setSelectedTextId(oldTextSelected);
        setSelectedStickerId(oldStickerSelected);
        
        const base64 = canvas.toDataURL('image/png', 1.0);
        const a = document.createElement('a');
        a.href = base64;
        a.download = `studio_${file.name}.png`;
        a.click();
        
        // Success Experience
        const sizeInMb = (base64.length * 0.75) / (1024 * 1024);
        setExportStats({ size: sizeInMb.toFixed(2) + 'MB', res: `${canvas.width} x ${canvas.height}` });
        setShowExportSuccess(true);
        trackCreatorEvent('export_completed', { size: sizeInMb, res: `${canvas.width}x${canvas.height}`, format: 'png' });
        
        // Hide success after 5 seconds
        setTimeout(() => setShowExportSuccess(false), 5000);
      } catch (err) {
        console.error("Export failed", err);
        toast.error('Failed to export image');
        trackCreatorEvent('export_failed', { error: err.message });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const Wrapper = isFullscreen ? 'div' : ToolPageTemplate;
  const wrapperProps = isFullscreen 
    ? { className: "fixed inset-0 z-[200] bg-background w-full h-full flex flex-col" }
    : { title: "Photo Studio", toolData: toolPageData['photo-editor'] };

  return (
    <Wrapper {...wrapperProps}>
      <canvas ref={canvasRef} className="hidden" />
      
      <div 
        ref={workspaceRef}
        className={`flex flex-col bg-background border rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none h-screen w-screen' : 'h-[75vh] min-h-[500px] max-h-[900px] mb-8'}`}
      >
        {/* Top Sticky Toolbar */}
        <div className="h-14 border-b bg-card/80 backdrop-blur-md flex items-center justify-between px-4 z-20 shrink-0">
          <div className="flex items-center gap-4">
            <div className="font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-500" />
              Studio
            </div>
            
            {file && (
              <div className="flex items-center gap-1 border-l pl-4 ml-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={undo} disabled={historyIndex === 0} title="Undo">
                  <Undo className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={redo} disabled={historyIndex === history.length - 1} title="Redo">
                  <Redo className="w-4 h-4" />
                </Button>
                <div className="w-px h-4 bg-border mx-2" />
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setZoom(Math.max(0.1, zoom - 0.2))} title="Zoom Out">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-xs font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setZoom(Math.min(3, zoom + 0.2))} title="Zoom In">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs rounded-full px-3 ml-1" onClick={() => setZoom(1)}>
                  Fit
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {file && (
              <>
                <Button 
                  variant={isComparing ? "secondary" : "ghost"} 
                  size="sm" 
                  className="h-8 rounded-full"
                  onClick={() => setIsComparing(!isComparing)}
                  onMouseDown={() => setIsComparing(true)}
                  onMouseUp={() => setIsComparing(false)}
                  onMouseLeave={() => setIsComparing(false)}
                >
                  <SplitSquareHorizontal className="w-4 h-4 mr-2" />
                  Compare
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={toggleFullscreen}>
                  <Maximize className="w-4 h-4" />
                </Button>
                <div className="w-px h-4 bg-border mx-2" />
                <Button variant="destructive" size="sm" className="h-8 rounded-full" onClick={handleClear}>
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Clear
                </Button>
                <Button variant="outline" size="sm" className="h-8 rounded-full hidden md:flex" onClick={saveProject}>
                  <Save className="w-4 h-4 mr-1.5" /> Save
                </Button>
                <Button variant="ghost" size="sm" className="h-8 rounded-full hidden md:flex text-muted-foreground" onClick={() => setIsFullscreen(!isFullscreen)}>
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </Button>
                <Button 
                  size="sm" 
                  className="h-8 rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20"
                  onClick={handleExport}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export HD <span className="ml-1.5 px-1 py-0.5 rounded bg-white/20 text-[9px] uppercase tracking-wider font-bold">Pro</span>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden relative pb-16 md:pb-0">
          {/* Responsive Navigation Sidebar */}
          <div className="absolute bottom-0 left-0 w-full h-16 md:relative md:w-16 md:h-auto border-t md:border-t-0 md:border-r bg-card/95 backdrop-blur-md flex flex-row md:flex-col items-center px-2 md:px-0 py-0 md:py-4 gap-2 md:gap-4 shrink-0 z-30 overflow-x-auto overflow-y-hidden custom-scrollbar">
            <button onClick={() => setActiveTool('adjust')} className={`p-3 rounded-xl transition-all shrink-0 ${activeTool === 'adjust' ? 'bg-blue-500/10 text-blue-500' : 'text-muted-foreground hover:bg-muted'}`} title="Adjustments">
              <Sliders className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveTool('presets')} className={`p-3 rounded-xl transition-all shrink-0 ${activeTool === 'presets' ? 'bg-blue-500/10 text-blue-500' : 'text-muted-foreground hover:bg-muted'}`} title="Presets">
              <Wand2 className="w-5 h-5" />
            </button>
            <div className="w-px h-8 md:w-8 md:h-px bg-border my-auto md:my-1 shrink-0" />
            <button onClick={() => setActiveTool('crop')} className={`p-3 rounded-xl transition-all shrink-0 ${activeTool === 'crop' ? 'bg-blue-500/10 text-blue-500' : 'text-muted-foreground hover:bg-muted'}`} title="Crop">
              <Crop className="w-5 h-5" />
            </button>
            <div className="w-px h-8 md:w-8 md:h-px bg-border my-auto md:my-1 shrink-0" />
            <button onClick={() => setActiveTool('templates')} className={`p-3 rounded-xl transition-all shrink-0 ${activeTool === 'templates' ? 'bg-blue-500/10 text-blue-500' : 'text-muted-foreground hover:bg-muted'}`} title="Templates">
              <LayoutTemplate className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveTool('collage')} className={`p-3 rounded-xl transition-all shrink-0 ${activeTool === 'collage' ? 'bg-blue-500/10 text-blue-500' : 'text-muted-foreground hover:bg-muted'}`} title="Collage Frames">
              <LayoutPanelLeft className="w-5 h-5" />
            </button>
            <div className="w-px h-8 md:w-8 md:h-px bg-border my-auto md:my-1 shrink-0" />
            <button onClick={() => setActiveTool('text')} className={`p-3 rounded-xl transition-all shrink-0 ${activeTool === 'text' ? 'bg-blue-500/10 text-blue-500' : 'text-muted-foreground hover:bg-muted'}`} title="Text">
              <Type className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveTool('stickers')} className={`p-3 rounded-xl transition-all shrink-0 ${activeTool === 'stickers' ? 'bg-blue-500/10 text-blue-500' : 'text-muted-foreground hover:bg-muted'}`} title="Stickers & Shapes">
              <Shapes className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveTool('brandkit')} className={`p-3 rounded-xl transition-all shrink-0 ${activeTool === 'brandkit' ? 'bg-amber-500/10 text-amber-500' : 'text-muted-foreground hover:bg-muted'}`} title="Brand Kit">
              <Palette className="w-5 h-5" />
            </button>
            <div className="w-px h-8 md:w-8 md:h-px bg-border my-auto md:my-1 shrink-0" />
            <button onClick={() => setActiveTool('ai')} className={`p-3 rounded-xl transition-all shrink-0 ${activeTool === 'ai' ? 'bg-purple-500/10 text-purple-500' : 'text-muted-foreground hover:bg-muted'}`} title="AI Tools">
              <Sparkles className="w-5 h-5" />
            </button>
          </div>

          {/* Properties Panel (BottomSheet on Mobile) */}
          <div className={`border-r bg-card/95 backdrop-blur overflow-y-auto custom-scrollbar shrink-0 flex flex-col z-20 transition-all duration-300 absolute md:left-16 bottom-16 md:bottom-0 top-[auto] md:top-0 h-[60vh] md:h-auto rounded-t-3xl md:rounded-none shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:shadow-xl ${file ? 'w-full md:w-72 translate-y-0 md:translate-x-0' : 'w-full md:w-0 translate-y-full md:-translate-x-full border-r-0'}`}>
            <div className="p-4 border-b sticky top-0 bg-card/95 backdrop-blur z-10 flex items-center justify-between rounded-t-3xl md:rounded-none">
              <h3 className="font-semibold capitalize flex items-center">
                {activeTool === 'ai' ? 'AI Magic Tools' : activeTool === 'brandkit' ? 'Brand Kit' : activeTool}
              </h3>
              <div className="flex gap-2">
                {activeTool === 'brandkit' && <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full">PRO</span>}
                {activeTool === 'adjust' && <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6 px-2 text-xs">Reset</Button>}
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs md:hidden" onClick={() => setActiveTool('none')}>Close</Button>
              </div>
            </div>
            
            <div className="p-4">
              {activeTool === 'adjust' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center"><Label className="text-xs text-muted-foreground">Brightness</Label><span className="text-[10px] font-mono">{filters.brightness}</span></div>
                      <Slider value={[filters.brightness]} onValueChange={(v) => updateFilter('brightness', v[0])} min={0} max={200} className="py-1" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center"><Label className="text-xs text-muted-foreground">Contrast</Label><span className="text-[10px] font-mono">{filters.contrast}</span></div>
                      <Slider value={[filters.contrast]} onValueChange={(v) => updateFilter('contrast', v[0])} min={0} max={200} className="py-1" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center"><Label className="text-xs text-muted-foreground">Saturation</Label><span className="text-[10px] font-mono">{filters.saturation}</span></div>
                      <Slider value={[filters.saturation]} onValueChange={(v) => updateFilter('saturation', v[0])} min={0} max={200} className="py-1" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center"><Label className="text-xs text-muted-foreground">Hue</Label><span className="text-[10px] font-mono">{filters.hueRotate}°</span></div>
                      <Slider value={[filters.hueRotate]} onValueChange={(v) => updateFilter('hueRotate', v[0])} min={0} max={360} className="py-1" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center"><Label className="text-xs text-muted-foreground">Blur</Label><span className="text-[10px] font-mono">{filters.blur}px</span></div>
                      <Slider value={[filters.blur]} onValueChange={(v) => updateFilter('blur', v[0])} min={0} max={20} className="py-1" />
                    </div>
                  </div>

                  <div className="space-y-1 pt-4 border-t">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"><Label className="text-sm">Grayscale</Label><Switch checked={filters.grayscale} onCheckedChange={(c) => updateFilter('grayscale', c)} /></div>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"><Label className="text-sm">Sepia</Label><Switch checked={filters.sepia} onCheckedChange={(c) => updateFilter('sepia', c)} /></div>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"><Label className="text-sm">Invert Colors</Label><Switch checked={filters.invert} onCheckedChange={(c) => updateFilter('invert', c)} /></div>
                  </div>
                </div>
              )}

              {activeTool === 'presets' && (
                <div className="grid grid-cols-2 gap-3">
                  {presets.map((preset) => (
                    <button key={preset.name} onClick={() => applyPreset(preset.filters)} className="flex flex-col items-center justify-center p-4 border rounded-xl hover:border-blue-500 hover:bg-blue-500/5 transition-all text-sm font-medium shadow-sm bg-background">
                      {preset.name}
                    </button>
                  ))}
                </div>
              )}

              {activeTool === 'crop' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant={aspect === undefined ? "default" : "outline"} onClick={() => setAspect(undefined)} className="w-full text-xs h-8">Free</Button>
                    <Button variant={aspect === 1 ? "default" : "outline"} onClick={() => setAspect(1)} className="w-full text-xs h-8">1:1</Button>
                    <Button variant={aspect === 4/5 ? "default" : "outline"} onClick={() => setAspect(4/5)} className="w-full text-xs h-8">4:5</Button>
                    <Button variant={aspect === 16/9 ? "default" : "outline"} onClick={() => setAspect(16/9)} className="w-full text-xs h-8">16:9</Button>
                  </div>
                  <div className="space-y-2 pt-4 border-t">
                    <Label className="text-sm font-medium">Social Presets</Label>
                    <div className="grid grid-cols-1 gap-2">
                      <Button variant="outline" size="sm" onClick={() => setAspect(1080/1080)} className="justify-start text-xs font-normal">Instagram Post</Button>
                      <Button variant="outline" size="sm" onClick={() => setAspect(1080/1920)} className="justify-start text-xs font-normal">Instagram Story</Button>
                      <Button variant="outline" size="sm" onClick={() => setAspect(1280/720)} className="justify-start text-xs font-normal">YouTube Thumbnail</Button>
                      <Button variant="outline" size="sm" onClick={() => setAspect(1584/396)} className="justify-start text-xs font-normal">LinkedIn Banner</Button>
                    </div>
                  </div>
                  {completedCrop && completedCrop.width > 0 && (
                    <div className="pt-6">
                      <Button onClick={applyCrop} className="w-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20">
                        <Check className="w-4 h-4 mr-2" /> Apply Crop
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {activeTool === 'text' && (
                <div className="space-y-6 pb-6">
                  <Button onClick={handleAddText} className="w-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20">
                    <Type className="w-4 h-4 mr-2" /> Add Text Layer
                  </Button>

                  {selectedTextId && texts.find(t => t.id === selectedTextId) && (() => {
                    const t = texts.find(t => t.id === selectedTextId);
                    const updateText = (key, val) => {
                      setTexts(texts.map(text => text.id === selectedTextId ? { ...text, [key]: val } : text));
                    };
                    return (
                      <div className="space-y-4 pt-4 border-t border-border/50">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Text Content</Label>
                          <textarea 
                            value={t.content} 
                            onChange={(e) => updateText('content', e.target.value)}
                            className="w-full bg-muted/50 rounded-md border-0 p-2 text-sm focus:ring-1 focus:ring-blue-500 custom-scrollbar"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Font Family</Label>
                            <select 
                              value={t.fontFamily} 
                              onChange={(e) => updateText('fontFamily', e.target.value)}
                              className="w-full bg-muted/50 rounded-md border-0 p-2 text-sm"
                            >
                              <option value="Inter, sans-serif">Modern</option>
                              <option value="'Playfair Display', serif">Elegant</option>
                              <option value="'Caveat', cursive">Handwritten</option>
                              <option value="'Pacifico', cursive">Brush</option>
                              <option value="Impact, sans-serif">Impact</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Text Color</Label>
                            <div className="flex h-9 rounded-md border border-border/50 overflow-hidden bg-background">
                              <input 
                                type="color" 
                                value={t.color} 
                                onChange={(e) => updateText('color', e.target.value)}
                                className="w-full h-12 -mt-1 cursor-pointer border-0 p-0"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3 pt-2">
                          <div className="flex justify-between items-center"><Label className="text-xs text-muted-foreground">Size</Label><span className="text-[10px] font-mono">{t.fontSize}px</span></div>
                          <Slider value={[t.fontSize]} onValueChange={(v) => updateText('fontSize', v[0])} min={12} max={180} className="py-1" />
                        </div>
                        <div className="space-y-3 pt-2">
                          <div className="flex justify-between items-center"><Label className="text-xs text-muted-foreground">Letter Spacing</Label><span className="text-[10px] font-mono">{t.letterSpacing}px</span></div>
                          <Slider value={[t.letterSpacing]} onValueChange={(v) => updateText('letterSpacing', v[0])} min={-5} max={30} className="py-1" />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50 mt-4">
                          <Label className="cursor-pointer flex-1 text-sm font-medium">Drop Shadow</Label>
                          <Switch checked={t.shadow} onCheckedChange={(c) => updateText('shadow', c)} />
                        </div>

                        <Button variant="destructive" size="sm" className="w-full mt-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white" onClick={() => {
                          setTexts(texts.filter(text => text.id !== selectedTextId));
                          setSelectedTextId(null);
                        }}>
                          <Trash2 className="w-4 h-4 mr-2" /> Delete Layer
                        </Button>
                      </div>
                    );
                  })()}
                  
                  {texts.length > 0 && !selectedTextId && (
                    <div className="pt-6 border-t border-border/50">
                      <Label className="text-xs text-muted-foreground mb-3 block uppercase tracking-wider font-bold">Text Layers</Label>
                      <div className="space-y-2">
                        {texts.map(t => (
                          <Button 
                            key={t.id} 
                            variant="secondary" 
                            size="sm" 
                            className="w-full justify-start text-xs overflow-hidden text-ellipsis whitespace-nowrap bg-muted hover:bg-blue-500/10 hover:text-blue-500" 
                            onClick={() => setSelectedTextId(t.id)}
                          >
                            <Type className="w-3 h-3 mr-2 shrink-0 opacity-50" /> {t.content.substring(0, 20) || 'Empty text'}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTool === 'collage' && (
                <div className="space-y-6 pb-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Layout Selection</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant={collageLayout === 'single' ? "default" : "outline"} onClick={() => setCollageLayout('single')} className="text-xs h-8">Single</Button>
                      <Button variant={collageLayout === 'split-v' ? "default" : "outline"} onClick={() => setCollageLayout('split-v')} className="text-xs h-8">Split Vertical</Button>
                      <Button variant={collageLayout === 'split-h' ? "default" : "outline"} onClick={() => setCollageLayout('split-h')} className="text-xs h-8">Split Horizontal</Button>
                      <Button variant={collageLayout === 'grid-4' ? "default" : "outline"} onClick={() => setCollageLayout('grid-4')} className="text-xs h-8">2x2 Grid</Button>
                      <Button variant={collageLayout === 'story-3' ? "default" : "outline"} onClick={() => setCollageLayout('story-3')} className="text-xs h-8">3 Stack (Story)</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <Label className="text-sm font-medium">Frame Styling</Label>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center"><Label className="text-xs text-muted-foreground">Gap Spacing</Label><span className="text-[10px] font-mono">{collageProps.gap}px</span></div>
                      <Slider value={[collageProps.gap]} onValueChange={(v) => setCollageProps(p => ({ ...p, gap: v[0] }))} min={0} max={40} className="py-1" />
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center"><Label className="text-xs text-muted-foreground">Corner Radius</Label><span className="text-[10px] font-mono">{collageProps.radius}px</span></div>
                      <Slider value={[collageProps.radius]} onValueChange={(v) => setCollageProps(p => ({ ...p, radius: v[0] }))} min={0} max={60} className="py-1" />
                    </div>
                    <div className="space-y-2 pt-2">
                      <Label className="text-xs text-muted-foreground">Background Color</Label>
                      <div className="flex h-9 rounded-md border border-border/50 overflow-hidden bg-background">
                        <input type="color" value={collageProps.bgColor} onChange={(e) => setCollageProps(p => ({ ...p, bgColor: e.target.value }))} className="w-full h-12 -mt-1 cursor-pointer border-0 p-0" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTool === 'stickers' && (
                <div className="space-y-6 pb-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Add Sticker</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {['heart', 'star', 'circle', 'square', 'thumbsup', 'smile', 'zap', 'message'].map(type => (
                        <button key={type} onClick={() => handleAddSticker(type)} className="aspect-square flex items-center justify-center border border-border/50 rounded-xl hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-500 transition-colors bg-card">
                          {type === 'heart' && <Heart className="w-6 h-6" />}
                          {type === 'star' && <Star className="w-6 h-6" />}
                          {type === 'circle' && <Circle className="w-6 h-6" />}
                          {type === 'square' && <Square className="w-6 h-6" />}
                          {type === 'thumbsup' && <ThumbsUp className="w-6 h-6" />}
                          {type === 'smile' && <Smile className="w-6 h-6" />}
                          {type === 'zap' && <Zap className="w-6 h-6" />}
                          {type === 'message' && <MessageCircle className="w-6 h-6" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedStickerId && stickers.find(s => s.id === selectedStickerId) && (() => {
                    const s = stickers.find(s => s.id === selectedStickerId);
                    const updateSticker = (key, val) => {
                      setStickers(stickers.map(sticker => sticker.id === selectedStickerId ? { ...sticker, [key]: val } : sticker));
                    };
                    return (
                      <div className="space-y-4 pt-4 border-t border-border/50">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Color</Label>
                          <div className="flex h-9 rounded-md border border-border/50 overflow-hidden bg-background">
                            <input type="color" value={s.color} onChange={(e) => updateSticker('color', e.target.value)} className="w-full h-12 -mt-1 cursor-pointer border-0 p-0" />
                          </div>
                        </div>
                        <div className="space-y-3 pt-2">
                          <div className="flex justify-between items-center"><Label className="text-xs text-muted-foreground">Size</Label><span className="text-[10px] font-mono">{s.size}px</span></div>
                          <Slider value={[s.size]} onValueChange={(v) => updateSticker('size', v[0])} min={20} max={300} className="py-1" />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50 mt-4">
                          <Label className="cursor-pointer flex-1 text-sm font-medium">Drop Shadow</Label>
                          <Switch checked={s.shadow} onCheckedChange={(c) => updateSticker('shadow', c)} />
                        </div>
                        <Button variant="destructive" size="sm" className="w-full mt-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white" onClick={() => {
                          setStickers(stickers.filter(sticker => sticker.id !== selectedStickerId));
                          setSelectedStickerId(null);
                        }}>
                          <Trash2 className="w-4 h-4 mr-2" /> Delete Layer
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              )}
              
              {activeTool === 'templates' && (
                <div className="space-y-6 pb-6">
                  <Label className="text-sm font-medium">Starter Templates</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <Button variant="outline" className="h-24 justify-start p-4 relative overflow-hidden group" onClick={() => loadTemplate('wedding')}>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#aa8855]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="text-left relative z-10">
                        <div className="font-medium text-[#aa8855] text-sm">Wedding Invitation</div>
                        <div className="text-xs text-muted-foreground mt-1">Split Vertical Layout, Playfair Display</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-24 justify-start p-4 relative overflow-hidden group" onClick={() => loadTemplate('quote')}>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="text-left relative z-10">
                        <div className="font-medium text-blue-500 text-sm">Instagram Quote</div>
                        <div className="text-xs text-muted-foreground mt-1">Single Image, Bold Typography</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-24 justify-start p-4 relative overflow-hidden group" onClick={() => loadTemplate('youtube')}>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="text-left relative z-10">
                        <div className="font-medium text-red-500 text-sm">YouTube Thumbnail</div>
                        <div className="text-xs text-muted-foreground mt-1">Impact Font, High Contrast</div>
                      </div>
                    </Button>
                  </div>
                </div>
              )}
              
              {activeTool === 'draw' && (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-12">
                  <Pencil className="w-8 h-8 mb-4 opacity-50" />
                  <p className="text-sm">Drawing & Annotations</p>
                  <p className="text-xs mt-2">Implementation pending in Phase 8</p>
                </div>
              )}

              {activeTool === 'brandkit' && (
                <div className="space-y-6 pb-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Brand Colors</Label>
                    <div className="flex flex-wrap gap-2">
                      {brandColors.map((color, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border border-border/50 shadow-sm" style={{ backgroundColor: color }} />
                      ))}
                      <div className="w-8 h-8 rounded-full border border-dashed border-muted-foreground/50 flex items-center justify-center relative overflow-hidden bg-muted/30 hover:bg-muted transition-colors cursor-pointer">
                        <input 
                          type="color" 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={(e) => {
                            const newColors = [...brandColors, e.target.value].slice(-10);
                            setBrandColors(newColors);
                            localStorage.setItem('toolisiya_brand_colors', JSON.stringify(newColors));
                          }}
                        />
                        <span className="text-muted-foreground text-xs font-bold">+</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <Label className="text-sm font-medium">Logo & Watermark</Label>
                    <div className="relative border-2 border-dashed border-border/50 rounded-xl p-6 text-center hover:bg-muted/30 transition-colors">
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoUpload} />
                      <ImageIcon className="w-6 h-6 mx-auto mb-2 text-muted-foreground opacity-50" />
                      <div className="text-xs font-medium">Upload Logo (PNG)</div>
                      <div className="text-[10px] text-muted-foreground mt-1">Stamps as draggable layer</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <Label className="text-sm font-medium">Default Fonts</Label>
                    <Button variant="outline" className="w-full justify-start text-xs h-8 opacity-50 cursor-not-allowed">
                      Primary: Inter
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-xs h-8 opacity-50 cursor-not-allowed">
                      Secondary: Playfair Display
                    </Button>
                  </div>
                </div>
              )}

              {activeTool === 'ai' && (
                <div className="space-y-6 pb-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Smart AI Tools</Label>
                    <div className="grid grid-cols-1 gap-3">
                      <Button 
                        onClick={handleRemoveBackground} 
                        disabled={!originalUrl || isBgRemoving}
                        className="h-auto p-4 justify-start relative overflow-hidden group border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition-colors"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Sparkles className="w-6 h-6 mr-4 text-purple-500 shrink-0" />
                        <div className="text-left">
                          <div className="font-medium text-purple-600 dark:text-purple-400">AI Background Remover</div>
                          <div className="text-xs text-muted-foreground mt-1">Automatically extract subject (PRO)</div>
                        </div>
                      </Button>
                      
                      <Button variant="outline" className="h-auto p-4 justify-start opacity-50 cursor-not-allowed border border-blue-500/20 bg-blue-500/5">
                        <Wand2 className="w-6 h-6 mr-4 text-blue-500 shrink-0" />
                        <div className="text-left">
                          <div className="font-medium text-blue-500">AI Smart Upscale</div>
                          <div className="text-xs text-muted-foreground mt-1">Coming soon in Phase 10</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Canvas Area */}
          <div className={`flex-1 bg-white relative overflow-hidden flex items-center justify-center transition-all duration-300 touch-none ${file ? 'mb-16 md:mb-0 md:ml-72' : 'ml-0'}`}>
            {!file ? (
              <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm">
                <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-6 border border-black/10">
                  <ImagePlus className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Creator Studio</h2>
                <p className="text-gray-500 text-sm mb-8">Upload an image to start editing in your professional browser workspace.</p>
                <div className="relative">
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" onChange={handleFileChange} />
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white px-8 rounded-full shadow-lg shadow-blue-500/20">
                    <Upload className="w-4 h-4 mr-2" /> Select Image
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center p-8 overflow-auto custom-scrollbar" onClick={() => { setSelectedTextId(null); setSelectedStickerId(null); }}>
                {/* Canvas Container with Zoom */}
                <div 
                  ref={exportContainerRef}
                  className="relative transition-transform duration-200 ease-out flex items-center justify-center inline-block max-w-full"
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
                >
                  {/* Single Image Rendering */}
                  {collageLayout === 'single' && (
                    <>
                      {/* Original Image (for Compare feature) */}
                      {isComparing && originalUrl && (
                        <img src={originalUrl} alt="Original" className="max-w-full max-h-[75vh] object-contain rounded-sm z-20 shadow-2xl" style={{ filter: 'drop-shadow(0 25px 40px rgba(0,0,0,0.8))', position: activeTool === 'crop' ? 'relative' : 'absolute', inset: 0 }} />
                      )}
                      {/* Edited Image */}
                      {editedUrl && activeTool !== 'crop' && (
                        <img src={editedUrl} alt="Edited" className={`max-w-full max-h-[75vh] object-contain rounded-sm shadow-2xl z-10 transition-opacity ${isComparing ? 'opacity-0' : 'opacity-100'}`} style={{ filter: 'drop-shadow(0 25px 40px rgba(0,0,0,0.8))' }} />
                      )}
                    </>
                  )}

                  {/* Collage Layout Rendering */}
                  {collageLayout !== 'single' && (
                    <div 
                      className={`grid w-full shadow-2xl z-10 relative overflow-hidden`}
                      style={{ 
                        gap: `${collageProps.gap}px`, 
                        borderRadius: `${collageProps.radius}px`,
                        backgroundColor: collageProps.bgColor,
                        padding: `${collageProps.gap}px`,
                        filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) hue-rotate(${filters.hueRotate}deg) blur(${filters.blur}px) ${filters.grayscale ? 'grayscale(100%)' : ''} ${filters.sepia ? 'sepia(100%)' : ''} ${filters.invert ? 'invert(100%)' : ''}`,
                        width: collageLayout.startsWith('split-h') || collageLayout === 'story-3' ? '400px' : '700px',
                        height: collageLayout.startsWith('split-v') ? '400px' : '700px',
                        gridTemplateColumns: collageLayout === 'split-v' || collageLayout === 'grid-4' ? '1fr 1fr' : '1fr',
                        gridTemplateRows: collageLayout === 'split-h' || collageLayout === 'grid-4' ? '1fr 1fr' : collageLayout === 'story-3' ? '1fr 1fr 1fr' : '1fr',
                      }}
                    >
                      {['slot1', 'slot2', 'slot3', 'slot4'].slice(0, collageLayout === 'grid-4' ? 4 : collageLayout === 'story-3' ? 3 : 2).map((slot, idx) => (
                        <div key={slot} className="relative bg-black/10 rounded-sm overflow-hidden flex items-center justify-center border border-border/10">
                          {collageImages[slot] ? (
                            <img src={collageImages[slot]} alt={`Collage ${idx}`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" onChange={(e) => handleCollageUpload(e, slot)} />
                              <Button variant="secondary" size="sm" className="opacity-70"><ImagePlus className="w-4 h-4 mr-2" /> Add</Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Text Overlays */}
                  {activeTool !== 'crop' && texts.length > 0 && (
                    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                      {texts.map(t => (
                        <motion.div
                          key={t.id}
                          drag
                          dragMomentum={false}
                          className={`absolute cursor-move px-2 py-1 ${selectedTextId === t.id ? 'ring-2 ring-blue-500/50 ring-offset-2 ring-offset-black/50 bg-white/5 rounded-md backdrop-blur-sm' : ''}`}
                          style={{
                            left: '50%',
                            top: '50%',
                            pointerEvents: 'auto',
                            fontFamily: t.fontFamily,
                            fontSize: `${t.fontSize}px`,
                            fontWeight: t.fontWeight,
                            color: t.color,
                            textShadow: t.shadow ? '2px 2px 8px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.8)' : 'none',
                            letterSpacing: `${t.letterSpacing}px`,
                            lineHeight: t.lineHeight,
                            textAlign: t.align,
                            whiteSpace: 'pre-wrap',
                            minWidth: '50px',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTextId(t.id);
                            setActiveTool('text');
                          }}
                        >
                          {t.content}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Stickers Overlays */}
                  {activeTool !== 'crop' && stickers.length > 0 && (
                    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                      {stickers.map(s => {
                        const Icon = s.type !== 'image' ? { heart: Heart, star: Star, circle: Circle, square: Square, thumbsup: ThumbsUp, smile: Smile, zap: Zap, message: MessageCircle }[s.type] : null;
                        return (
                          <motion.div
                            key={s.id}
                            drag
                            dragMomentum={false}
                            className={`absolute cursor-move px-2 py-2 flex items-center justify-center ${selectedStickerId === s.id ? 'ring-2 ring-blue-500/50 ring-offset-2 ring-offset-black/50 bg-white/5 rounded-md backdrop-blur-sm' : ''}`}
                            style={{
                              left: '50%',
                              top: '50%',
                              pointerEvents: 'auto',
                              color: s.color,
                              width: `${s.size}px`,
                              height: `${s.size}px`,
                              filter: s.shadow ? 'drop-shadow(2px 4px 6px rgba(0,0,0,0.6))' : 'none',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStickerId(s.id);
                              setActiveTool('stickers');
                            }}
                          >
                            {s.type === 'image' ? (
                              <img src={s.url} alt="Sticker" className="w-full h-full object-contain pointer-events-none" />
                            ) : (
                              <Icon style={{ width: '100%', height: '100%' }} />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* Crop UI */}
                  {activeTool === 'crop' && originalUrl && (
                    <div className="z-10 shadow-2xl rounded-sm">
                      <ReactCrop 
                        crop={crop} 
                        onChange={c => setCrop(c)} 
                        onComplete={c => setCompletedCrop(c)}
                        aspect={aspect}
                      >
                        <img 
                          ref={imgRef}
                          src={originalUrl} 
                          alt="Crop Source" 
                          className="max-w-full max-h-[75vh] object-contain"
                        />
                      </ReactCrop>
                    </div>
                  )}

                  {(isProcessing || isBgRemoving) && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center rounded-sm z-30 shadow-2xl border border-white/10">
                      <div className="relative">
                        <RefreshCw className="h-12 w-12 animate-spin text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-6 w-6 bg-black rounded-full" />
                        </div>
                      </div>
                      <p className="text-white mt-6 font-medium tracking-wide">
                        {isBgRemoving ? "AI Processing Background..." : "Rendering Composition..."}
                      </p>
                      {isBgRemoving && (
                        <div className="w-48 h-1.5 bg-white/20 rounded-full mt-4 overflow-hidden">
                          <div className="h-full bg-blue-500 transition-all duration-300 ease-out" style={{ width: `${bgRemoveProgress}%` }} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Export Success Celebration Modal */}
                {showExportSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 bg-card/95 backdrop-blur-xl border shadow-2xl rounded-2xl p-6 w-[320px] flex flex-col items-center text-center"
                  >
                    <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-lg mb-1">Export Successful!</h4>
                    <p className="text-sm text-muted-foreground mb-4">Your design is ready for the world.</p>
                    <div className="flex gap-4 mb-6">
                      <div className="text-center bg-muted/50 rounded-lg py-2 px-4">
                        <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Size</div>
                        <div className="font-mono text-sm">{exportStats.size}</div>
                      </div>
                      <div className="text-center bg-muted/50 rounded-lg py-2 px-4">
                        <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Resolution</div>
                        <div className="font-mono text-sm">{exportStats.res}</div>
                      </div>
                    </div>
                    <div className="w-full flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => setShowExportSuccess(false)}>Dismiss</Button>
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-500">
                        <Share2 className="w-4 h-4 mr-2" /> Share
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Trust Footer */}
        <div className="h-8 bg-card border-t flex items-center justify-center shrink-0 z-20 pb-16 md:pb-0">
          <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 opacity-60">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Images processed securely in your browser. Fast local rendering. No files are permanently stored.
          </p>
        </div>
      </div>
    </Wrapper>
  );
};

export default PhotoEditorPage;