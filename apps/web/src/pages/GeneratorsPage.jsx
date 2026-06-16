import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSEOData } from '@/hooks/useSEOData.js';
import { useActiveTools } from '@/contexts/ActiveToolsContext.jsx';
import { Search, QrCode, Barcode, Key, Hash, FileText, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ToolCard from '@/components/ToolCard.jsx';
import StickyNavigation from '@/components/StickyNavigation.jsx';

const GeneratorsPage = () => {
  const { seoData } = useSEOData('generators');
  const { activeUrls } = useActiveTools();
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const [searchQuery, setSearchQuery] = useState('');

  const tools = [
    { id: 'qr-code-generator', name: 'QR Code Generator', path: '/generator/qr-code-generator', description: 'Generate custom QR codes for URLs, text, and more.', icon: QrCode },
    { id: 'barcode-generator', name: 'Barcode Generator', path: '/generator/barcode-generator', description: 'Generate standard barcodes like Code128, EAN, and UPC.', icon: Barcode },
    { id: 'password-generator', name: 'Password Generator', path: '/generator/password-generator', description: 'Generate highly secure cryptographic passwords.', icon: Key },
    { id: 'uuid-generator', name: 'UUID Generator', path: '/developer/uuid-generator', description: 'Generate random UUIDs for your applications.', icon: Hash },
    { id: 'slug-generator', name: 'Slug Generator', path: '/generator/slug-generator', description: 'Convert strings into URL-friendly slugs.', icon: FileText },
    { id: 'random-name-generator', name: 'Random Name Generator', path: '/generator/random-name-generator', description: 'Generate realistic placeholder names.', icon: User },
  ];

  const filteredTools = tools.filter(tool => {
    if (activeUrls && !activeUrls.has(tool.path)) return false;
    return tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <Helmet>
        <title>{seoData?.meta_title || 'Generators - Toolisiya.com'}</title>
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
        <link rel="canonical" href={seoData?.canonical_url || 'https://toolisiya.com/generators'} />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 py-12 bg-muted/30">
          <StickyNavigation />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 tracking-tight">{seoData?.h1_tag || 'Generators'}</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Create custom QR codes, barcodes, passwords, and identifiers instantly.
              </p>
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search generators..." 
                  className="pl-10 h-12 text-base bg-background"
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
              <h2 className="text-2xl font-bold mb-4 text-foreground">Free Online Generators</h2>
              <p className="text-muted-foreground mb-4">
                Toolisiya provides a versatile collection of free online generators to create essential digital assets in seconds. Whether you are generating highly secure passwords for your accounts, creating customized QR codes for marketing campaigns, or building standard barcodes for retail inventory, our platform delivers instant, reliable results directly within your browser.
              </p>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Secure & Private Data Creation</h2>
              <p className="text-muted-foreground mb-4">
                We prioritize your privacy and data security. Tools like our Password Generator, UUID Generator, and Random Name Generator execute entirely on the client-side. This means that your randomly generated data, cryptographic keys, and unique identifiers are never sent to or stored on our servers, ensuring complete confidentiality.
              </p>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Why Use Our Generators?</h2>
              <p className="text-muted-foreground">
                All generators on Toolisiya are completely free to use with no hidden fees, subscriptions, or sign-ups required. From converting text to URL-friendly slugs to generating 1D barcodes, our tools are optimized for speed and ease of use, making them perfect for developers, marketers, and everyday users who need quick solutions.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default GeneratorsPage;