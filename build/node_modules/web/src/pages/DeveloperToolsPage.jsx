import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSEOData } from '@/hooks/useSEOData.js';
import { useActiveTools } from '@/contexts/ActiveToolsContext.jsx';
import { Search, Code, FileJson, Link as LinkIcon, Palette, Volume2, Mic, Fingerprint, QrCode, Barcode, Key, Hash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ToolCard from '@/components/ToolCard.jsx';
import StickyNavigation from '@/components/StickyNavigation.jsx';

const DeveloperToolsPage = () => {
  const { seoData } = useSEOData('developer');
  const { activeUrls } = useActiveTools();
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const [searchQuery, setSearchQuery] = useState('');

  const tools = [
    { id: 'json-formatter', name: 'JSON Formatter', path: '/developer/json-formatter', description: 'Format, validate, and minify JSON data payloads instantly.', icon: FileJson },
    { id: 'xml-formatter', name: 'XML Formatter', path: '/developer/xml-formatter', description: 'Beautify and validate complex XML and SOAP API responses.', icon: Code },
    { id: 'code-beautifier', name: 'Code Beautifier', path: '/developer/code-beautifier', description: 'Clean and format messy HTML, CSS, and JavaScript source code.', icon: Code },
    { id: 'color-picker', name: 'Color Picker', path: '/developer/color-picker', description: 'Pick colors and convert between HEX, RGB, HSL, and HSV arrays.', icon: Palette },
    { id: 'qr-code-generator', name: 'QR Code Generator', path: '/generator/qr-code-generator', description: 'Generate customized scannable QR codes for URLs and text.', icon: QrCode },
    { id: 'barcode-generator', name: 'Barcode Generator', path: '/generator/barcode-generator', description: 'Generate standard 1D barcodes for retail and inventory.', icon: Barcode },
    { id: 'text-to-speech', name: 'Text to Speech', path: '/developer/text-to-speech', description: 'Convert written text into natural sounding audio voiceovers.', icon: Volume2 },
    { id: 'speech-to-text', name: 'Speech to Text', path: '/developer/speech-to-text', description: 'Real-time voice dictation and audio transcription utility.', icon: Mic },
    { id: 'password-generator', name: 'Password Generator', path: '/generator/password-generator', description: 'Generate cryptographically secure random passwords and keys.', icon: Key },
    { id: 'uuid-generator', name: 'UUID Generator', path: '/developer/uuid-generator', description: 'Generate secure, random Version 4 UUIDs for database keys.', icon: Fingerprint },
    { id: 'base64-encoder', name: 'Base64 Encoder/Decoder', path: '/developer/base64-encoder-decoder', description: 'Encode and decode text or tokens safely to Base64 format.', icon: Hash },
    { id: 'url-encoder', name: 'URL Encoder/Decoder', path: '/developer/url-encoder', description: 'Safely encode and decode URL components and query parameters.', icon: LinkIcon },
    { id: 'markdown-to-html', name: 'Markdown to HTML', path: '/developer/markdown-to-html', description: 'Instantly convert Markdown syntax into clean HTML code.', icon: FileJson }
  ];

  const filteredTools = tools.filter(tool => {
    if (!activeUrls.has(tool.path)) return false;
    return tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <Helmet>
        <title>{seoData?.meta_title || 'Developer Tools - Toolisiya.com'}</title>
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
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 py-12 lg:py-20">
          <StickyNavigation />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-20">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">{seoData?.h1_tag || 'Developer Tools'}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Essential utilities for software developers, designers, and system administrators.
              </p>
              <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search developer tools..." 
                  className="pl-12 h-14 text-base rounded-full bg-background border-muted-foreground/20 shadow-sm focus-visible:ring-primary/20"
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
              <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed mt-8">
                <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground mb-1">No tools found</h3>
                <p className="text-muted-foreground">We couldn't find anything matching "{searchQuery}"</p>
              </div>
            )}

            {/* SEO Content Section */}
            <div className="mt-16 bg-card p-8 rounded-2xl border border-border/50 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Free Developer Tools & Utilities</h2>
              <p className="text-muted-foreground mb-4">
                Toolisiya provides a powerful collection of free, browser-based developer tools designed to streamline your coding workflow. Whether you need to format complex JSON payloads, beautify minified XML/HTML, or securely generate Version 4 UUIDs, our utilities deliver instant, client-side results without sending your sensitive data to any server.
              </p>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Encode, Decode, and Optimize</h2>
              <p className="text-muted-foreground mb-4">
                Our platform includes essential encoding tools like Base64 encoders and URL decoders that safely handle query parameters and tokens. Front-end developers can leverage our advanced Color Picker to convert between HEX, RGB, and HSL values instantly, while our text-to-speech and code beautifier tools help test and refine applications faster.
              </p>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Why Choose Toolisiya Developer Tools?</h2>
              <p className="text-muted-foreground">
                All developer utilities on Toolisiya are 100% free with no sign-ups or API keys required. Built with privacy in mind, tools like the Password Generator and Hash Generators execute entirely within your browser, ensuring your secure strings and credentials never touch a remote database. Experience fast, reliable, and secure development directly from your browser.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DeveloperToolsPage;