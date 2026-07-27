import React, { useState } from 'react';
import { Search, FileText, PenTool, LayoutTemplate, DollarSign } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useSEOData } from '@/hooks/useSEOData.js';
import { Input } from '@/components/ui/input';
import ToolCard from '@/components/ToolCard.jsx';
import StickyNavigation from '@/components/StickyNavigation.jsx';

const CareerPage = () => {
  const { seoData } = useSEOData('career');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const [searchQuery, setSearchQuery] = useState('');

  const tools = [
    { id: 'resume-builder', name: 'Resume Builder', path: '/career/resume-builder', description: 'Create professional ATS-friendly resumes with customizable templates. Free • No Sign-up Required.', icon: FileText },
    { id: 'cover-letter-generator', name: 'Cover Letter Generator', path: '/career/cover-letter-generator', description: 'Generate tailored cover letters for your job applications. Free • No Sign-up Required.', icon: PenTool },
    { id: 'job-application-tracker', name: 'Job Application Tracker', path: '/career/job-application-tracker', description: 'Track your job search progress, interviews, and offers. Free • No Sign-up Required.', icon: LayoutTemplate },
    { id: 'salary-calculator', name: 'Salary Calculator', path: '/finance/salary-calculator', description: 'Calculate take-home salary and plan negotiations. Free • No Sign-up Required.', icon: DollarSign }
  ];

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>{seoData?.meta_title || 'Career Tools - Free Online Resume Builder & More | Toolisiya'}</title>
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
        <main className="flex-1 py-12 bg-muted/10">
          <StickyNavigation />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 tracking-tight text-foreground">{seoData?.h1_tag || 'Career Tools'}</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Build your professional profile, track applications, and negotiate your salary.
                <span className="block mt-2 font-medium text-primary text-sm">Free • No Sign-up Required</span>
              </p>
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search career tools..." 
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
    </>
  );
};

export default CareerPage;