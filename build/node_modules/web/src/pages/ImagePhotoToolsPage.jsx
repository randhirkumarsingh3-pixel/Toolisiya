import React from 'react';
import { Helmet } from 'react-helmet';
import { useSEOData } from '@/hooks/useSEOData.js';
import { useActiveTools } from '@/contexts/ActiveToolsContext.jsx';
import { Image, Minimize, Maximize, RefreshCw, Crop, Sliders, Eraser, Layers } from 'lucide-react';
import ToolCard from '@/components/ToolCard.jsx';
import StickyNavigation from '@/components/StickyNavigation.jsx';

const ImagePhotoToolsPage = () => {
  const { seoData } = useSEOData('image');
  const { activeUrls } = useActiveTools();
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const tools = [
    { 
      id: 'image-compressor',
      name: 'Image Compressor', 
      path: '/image/image-compressor', 
      icon: Minimize, 
      description: 'Reduce image file size without losing quality using advanced compression. Free • No Sign-up Required.',
    },
    { 
      id: 'image-converter',
      name: 'Image Converter', 
      path: '/image/image-converter', 
      icon: RefreshCw, 
      description: 'Convert images between JPG, PNG, WebP, GIF, and BMP formats. Free • No Sign-up Required.',
    },
    { 
      id: 'image-resizer',
      name: 'Image Resizer', 
      path: '/image/image-resizer', 
      icon: Maximize, 
      description: 'Resize images to specific dimensions with aspect ratio lock. Free • No Sign-up Required.',
    },
    { 
      id: 'image-cropper',
      name: 'Image Cropper', 
      path: '/image/image-cropper', 
      icon: Crop, 
      description: 'Crop images to custom or preset aspect ratios with rotation support. Free • No Sign-up Required.',
    },
    { 
      id: 'image-filter',
      name: 'Image Filter', 
      path: '/image/image-filter', 
      icon: Sliders, 
      description: 'Apply stunning filters, adjust brightness, contrast, and saturation. Free • No Sign-up Required.',
    },
    { 
      id: 'image-watermark',
      name: 'Image Watermark', 
      path: '/image/image-watermark', 
      icon: Layers, 
      description: 'Add custom text or image watermarks to protect your photos. Free • No Sign-up Required.',
    },
    { 
      id: 'image-metadata-remover',
      name: 'Metadata Remover', 
      path: '/image/image-metadata-remover', 
      icon: Eraser, 
      description: 'Strip EXIF data from your photos to protect your privacy. Free • No Sign-up Required.',
    },
    { 
      id: 'image-batch-processor',
      name: 'Batch Processor', 
      path: '/image/image-batch-processor', 
      icon: Layers, 
      description: 'Process multiple images simultaneously. Convert, resize, and compress. Free • No Sign-up Required.',
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{seoData?.meta_title || 'Free Image Tools - Compress, Convert, Resize Images | Toolisiya'}</title>
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
      
      <main className="flex-1 py-12 bg-muted/10">
        <StickyNavigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <h1 className="text-4xl font-bold mb-4 flex items-center gap-3 text-foreground" style={{ letterSpacing: '-0.02em' }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
                <Image className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              {seoData?.h1_tag || 'Free Image Tools - Edit & Process Images Online'}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A complete suite of tools to edit, convert, compress, and manage your images and photos directly in your browser. No uploads required—everything is processed locally for maximum privacy.
              <span className="block mt-2 font-medium text-primary text-sm">Free • No Sign-up Required</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.filter(tool => activeUrls?.has(tool.path)).map((tool, index) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                index={index}
              />
            ))}
          </div>

          {/* SEO Content Section */}
          <div className="mt-16 bg-card p-8 rounded-2xl border border-border/50 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Free Image Editing & Conversion Tools</h2>
            <p className="text-muted-foreground mb-4">
              Edit, optimize, and convert your photos seamlessly using Toolisiya's free online image tools. We offer everything from quick image compression for web optimization to bulk resizing and format conversion. These utilities are perfect for photographers, social media managers, and developers who need quick and reliable image processing without installing clunky desktop software.
            </p>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Browser-Based, Privacy-First Photo Tools</h2>
            <p className="text-muted-foreground mb-4">
              Unlike many other online image editors, our tools run locally right in your web browser. This means your images are never uploaded to our servers, keeping your sensitive photos 100% private and secure. Whether you're cropping a profile picture, adding a watermark, or stripping EXIF metadata, everything happens instantly on your own device.
            </p>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Why Compress and Optimize Images?</h2>
            <p className="text-muted-foreground">
              Large image files slow down website loading times and consume unnecessary bandwidth. Using our Image Compressor helps you achieve optimal page speeds, which is a crucial factor for modern SEO and user experience. Convert large PNGs to WebP or optimize JPGs easily, completely free and with no watermarks added by us.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ImagePhotoToolsPage;