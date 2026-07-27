import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Calculator, Percent, Receipt, Landmark, PiggyBank, Wallet, FileText, Sigma } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ToolCard from '@/components/ToolCard.jsx';
import { useSEOData } from '@/hooks/useSEOData.js';
import StickyNavigation from '@/components/StickyNavigation.jsx';

const FinancePage = () => {
  const { seoData } = useSEOData('category_finance');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const [searchQuery, setSearchQuery] = useState('');

  const tools = [
    { id: 'gst-calculator', name: 'GST Calculator', path: '/finance/gst-calculator', description: 'Calculate GST amount and total price with different tax rates. Free • No Sign-up Required.', icon: Calculator },
    { id: 'income-tax-calculator', name: 'Income Tax Calculator', path: '/finance/income-tax-calculator', description: 'Estimate your income tax based on 2024-25 tax slabs. Free • No Sign-up Required.', icon: Receipt },
    { id: 'salary-calculator', name: 'Salary Calculator', path: '/finance/salary-calculator', description: 'Calculate gross salary, deductions, and net take-home pay. Free • No Sign-up Required.', icon: Wallet },
    { id: 'discount-calculator', name: 'Discount Calculator', path: '/finance/discount-calculator', description: 'Find discount amount, final price, and total savings. Free • No Sign-up Required.', icon: Percent },
    { id: 'emi-calculator', name: 'EMI Calculator', path: '/finance/emi-calculator', description: 'Calculate Equated Monthly Installment for loans. Free • No Sign-up Required.', icon: Landmark },
    { id: 'sip-calculator', name: 'SIP Calculator', path: '/finance/sip-calculator', description: 'Calculate returns on Systematic Investment Plan. Free • No Sign-up Required.', icon: PiggyBank },
    { id: 'fd-calculator', name: 'FD Calculator', path: '/finance/fd-calculator', description: 'Calculate maturity amount and interest earned on Fixed Deposits. Free • No Sign-up Required.', icon: Landmark },
    { id: 'invoice-generator', name: 'Invoice Generator', path: '/document/invoice-generator', description: 'Create professional invoices and download as PDF. Free • No Sign-up Required.', icon: FileText },
    { id: 'bill-generator', name: 'Bill Generator', path: '/document/bill-generator', description: 'Generate professional bills easily. Free • No Sign-up Required.', icon: FileText },
    { id: 'advanced-scientific-calculator', name: 'Advanced Scientific Calculator', path: '/finance/advanced-scientific-calculator', description: 'Free advanced scientific calculator with trigonometric functions, logarithms, and more.', icon: Sigma },
  ];

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{seoData?.meta_title || 'Finance Tools & Calculators - Free Online Tools | Toolisiya'}</title>
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
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 tracking-tight text-foreground">{seoData?.h1_tag || 'Finance Tools'}</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Smart, accurate calculators for your personal and business finances.
              <span className="block mt-2 font-medium text-primary text-sm">Free • No Sign-up Required</span>
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search finance tools..." 
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
            <div className="text-center py-12 bg-card border border-dashed rounded-2xl">
              <Search className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-lg">No tools found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FinancePage;