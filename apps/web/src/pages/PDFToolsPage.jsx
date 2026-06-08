import React, { useState } from 'react';
import { Search, FileDown } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useSEOData } from '@/hooks/useSEOData.js';
import { useActiveTools } from '@/contexts/ActiveToolsContext.jsx';
import { Input } from '@/components/ui/input';
import ToolCard from '@/components/ToolCard.jsx';
import StickyNavigation from '@/components/StickyNavigation.jsx';

const PDFToolsPage = () => {
  const { seoData } = useSEOData('pdf');
  const { activeUrls } = useActiveTools();
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const [searchQuery, setSearchQuery] = useState('');

  const tools = [
    { id: 'document-scanner', name: 'Document Scanner', path: '/pdf/document-scanner', icon: FileDown, description: 'Scan physical documents to PDF using your camera.' },
    { id: 'pdf-compressor', name: 'PDF Compressor', path: '/pdf/pdf-compressor', icon: FileDown, description: 'Reduce PDF file size without losing quality.' },
    { id: 'pdf-merger', name: 'PDF Merger', path: '/pdf/pdf-merger', icon: FileDown, description: 'Combine multiple PDF files into one.' },
    { id: 'pdf-splitter', name: 'PDF Splitter', path: '/pdf/pdf-splitter', icon: FileDown, description: 'Split PDF into multiple individual files.' },
    { id: 'pdf-page-rotator', name: 'PDF Page Rotator', path: '/pdf/pdf-page-rotator', icon: FileDown, description: 'Rotate specific PDF pages.' },
    { id: 'pdf-page-extractor', name: 'PDF Page Extractor', path: '/pdf/pdf-page-extractor', icon: FileDown, description: 'Extract specific pages from your PDF.' },
    { id: 'pdf-watermark-adder', name: 'PDF Watermark Adder', path: '/pdf/pdf-watermark-adder', icon: FileDown, description: 'Add a watermark text or image.' },
    { id: 'pdf-to-image-converter', name: 'PDF to Image Converter', path: '/pdf/pdf-to-image-converter', icon: FileDown, description: 'Convert PDF pages into images.' },
    { id: 'pdf-blank-page-remover', name: 'PDF Blank Page Remover', path: '/pdf/pdf-blank-page-remover', icon: FileDown, description: 'Auto-remove blank pages.' },
    { id: 'pdf-page-number', name: 'PDF Page Number', path: '/pdf/pdf-page-number', icon: FileDown, description: 'Add page numbers to your document.' },
    { id: 'pdf-header-footer-adder', name: 'PDF Header Footer Adder', path: '/pdf/pdf-header-footer-adder', icon: FileDown, description: 'Add custom headers and footers.' },
    { id: 'pdf-qr-code-adder', name: 'PDF QR Code Adder', path: '/pdf/pdf-qr-code-adder', icon: FileDown, description: 'Embed QR codes into PDF.' },
    { id: 'pdf-bookmark-creator', name: 'PDF Bookmark Creator', path: '/pdf/pdf-bookmark-creator', icon: FileDown, description: 'Create internal navigation bookmarks.' },
    { id: 'pdf-text-adder', name: 'PDF Text Adder', path: '/pdf/pdf-text-adder', icon: FileDown, description: 'Add text annotations to PDF documents.' },
    { id: 'excel-to-pdf', name: 'Excel to PDF', path: '/pdf/excel-to-pdf', icon: FileDown, description: 'Convert Excel spreadsheets to PDF.' },
    { id: 'word-to-pdf', name: 'Word to PDF', path: '/pdf/word-to-pdf', icon: FileDown, description: 'Convert Word documents to PDF.' },
    { id: 'pdf-to-word', name: 'PDF to Word', path: '/pdf/pdf-to-word', icon: FileDown, description: 'Convert PDF files to editable Word documents.' },
    { id: 'edit-pdf-online', name: 'Edit PDF Online', path: '/pdf/edit-pdf-online', icon: FileDown, description: 'Add text, signatures, stamps, highlights and more to any PDF.' }
  ];

  const filteredTools = tools.filter(tool => {
    if (activeUrls && !activeUrls.has(tool.path)) return false;
    return tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{seoData?.meta_title || 'Free PDF Tools - Merge, Split, Compress PDFs | Toolisiya'}</title>
        {seoData?.meta_description && <meta name="description" content={seoData.meta_description} />}
        {seoData?.meta_keywords && <meta name="keywords" content={seoData.meta_keywords} />}
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <main className="flex-1 py-12 bg-muted/10">
        <StickyNavigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 tracking-tight text-foreground">
              {seoData?.h1_tag || 'Free PDF Tools'}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Compress, merge, split, and manipulate your PDF files entirely in your browser. Complete privacy, zero uploads.
              <span className="block mt-2 font-medium text-primary text-sm">Free • No Sign-up Required</span>
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search PDF tools..." 
                className="pl-10 h-12 text-base bg-background shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No tools found matching "{searchQuery}"</p>
            </div>
          )}

          {/* SEO Content Section */}
          <div className="mt-16 bg-card p-8 rounded-2xl border border-border/50 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Comprehensive Free PDF Tools</h2>
            <p className="text-muted-foreground mb-4">
              Toolisiya offers a complete suite of free online PDF tools that let you merge, split, compress, and edit PDF documents without installing heavy software. Whether you're combining monthly reports, extracting specific pages, or converting an Excel spreadsheet into a presentation-ready PDF, our tools provide fast and accurate results directly in your browser.
            </p>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Secure PDF Manipulation & Editing</h2>
            <p className="text-muted-foreground mb-4">
              Protect your document integrity by adding custom watermarks, page numbers, or embedding QR codes securely. Our PDF tools are optimized for privacy—processing happens quickly without the need to create an account. Easily remove blank pages, rotate misaligned scans, or convert PDF pages into high-quality images with just a few clicks.
            </p>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Why Use Our Online PDF Utilities?</h2>
            <p className="text-muted-foreground">
              All Toolisiya PDF tools are 100% free with no hidden limits. They are designed for students, professionals, and businesses who need quick, reliable document management. With no sign-up required, you can optimize your digital workflow and manage your PDF files securely, efficiently, and effortlessly from any device.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PDFToolsPage;