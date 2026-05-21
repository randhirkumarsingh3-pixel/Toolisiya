import React, { useState } from 'react';
import { Search, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useSEOData } from '@/hooks/useSEOData.js';
import { Input } from '@/components/ui/input';
import ToolCard from '@/components/ToolCard.jsx';
import StickyNavigation from '@/components/StickyNavigation.jsx';

const DocumentMediaToolsPage = () => {
  const { seoData } = useSEOData('document');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const [searchQuery, setSearchQuery] = useState('');

  const tools = [
    { 
      id: 'receipt-generator', 
      name: 'Receipt Generator', 
      path: '/document/receipt-generator', 
      icon: FileText, 
      description: 'Generate professional receipts. Free • No Sign-up Required.' 
    },
    { 
      id: 'certificate-generator', 
      name: 'Certificate Generator', 
      path: '/document/certificate-generator', 
      icon: FileText, 
      description: 'Create custom certificates. Free • No Sign-up Required.' 
    },
    { 
      id: 'letter-generator', 
      name: 'Letter Generator', 
      path: '/document/letter-generator', 
      icon: FileText, 
      description: 'Draft formal letters. Free • No Sign-up Required.' 
    },
    { 
      id: 'contract-generator', 
      name: 'Contract Generator', 
      path: '/document/contract-generator', 
      icon: FileText, 
      description: 'Generate legal contracts. Free • No Sign-up Required.' 
    },
    { 
      id: 'proposal-generator', 
      name: 'Proposal Generator', 
      path: '/document/proposal-generator', 
      icon: FileText, 
      description: 'Create business proposals. Free • No Sign-up Required.' 
    },
    { 
      id: 'quote-generator', 
      name: 'Quote Generator', 
      path: '/document/quote-generator', 
      icon: FileText, 
      description: 'Send price quotes. Free • No Sign-up Required.' 
    },
    { 
      id: 'bill-generator', 
      name: 'Bill Generator', 
      path: '/document/bill-generator', 
      icon: FileText, 
      description: 'Generate professional bills. Free • No Sign-up Required.' 
    },
    { 
      id: 'invoice-generator', 
      name: 'Invoice Generator', 
      path: '/document/invoice-generator', 
      icon: FileText, 
      description: 'Create GST invoices online. Free • No Sign-up Required.' 
    }
  ];

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{seoData?.meta_title || 'Free Document Tools - Generate Documents | Toolisiya'}</title>
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
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 tracking-tight text-foreground">
              {seoData?.h1_tag || 'Free Document Tools - Create Professional Documents'}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Manage your documents with our powerful suite of generators. All processing is secure and fast.
              <span className="block mt-2 font-medium text-primary text-sm">Free • No Sign-up Required</span>
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search document tools..." 
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
        </div>
      </main>
    </div>
  );
};

export default DocumentMediaToolsPage;