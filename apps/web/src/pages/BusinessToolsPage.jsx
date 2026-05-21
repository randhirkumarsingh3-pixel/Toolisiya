import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import { Card, CardContent } from '@/components/ui/card';
import StickyNavigation from '@/components/StickyNavigation.jsx';

const BusinessToolsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Helmet>
        <title>Free Business Tools Online - Toolisiya</title>
        <meta name="description" content="Generate invoices, format documents, and manage tasks with professional tools online free." />
        <meta name="keywords" content="business tools free online, professional tools online free, free invoicing tools" />
      </Helmet>
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <StickyNavigation />
        <BreadcrumbNavigation customTitle="Business Tools" />
        <h1 className="text-4xl font-extrabold mb-6">Free Business Tools Online</h1>
        <p className="text-lg text-muted-foreground mb-12">Run your freelance or small business operations smoothly with our professional tools online free. Invoicing, PDF handling, and calculations.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Link to="/document/invoice-generator"><Card className="h-full hover:shadow-soft"><CardContent className="p-6 font-semibold hover:text-primary">Free Invoice Generator</CardContent></Card></Link>
           <Link to="/finance/discount-calculator"><Card className="h-full hover:shadow-soft"><CardContent className="p-6 font-semibold hover:text-primary">Discount & Margin Calculator</CardContent></Card></Link>
           <Link to="/productivity/meeting-notes"><Card className="h-full hover:shadow-soft"><CardContent className="p-6 font-semibold hover:text-primary">Meeting Notes Manager</CardContent></Card></Link>
        </div>
      </main>
    </div>
  );
};

export default BusinessToolsPage;