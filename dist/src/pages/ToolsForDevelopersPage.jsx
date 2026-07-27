import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import { Card, CardContent } from '@/components/ui/card';
import StickyNavigation from '@/components/StickyNavigation.jsx';

const ToolsForDevelopersPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Helmet>
        <title>Best Free Developer Tools Online - Toolisiya</title>
        <meta name="description" content="Enhance your coding workflow with tools for developers online. Access free JSON formatters, base64 encoders, and more." />
        <meta name="keywords" content="tools for developers online, best developer tools free, coding utilities" />
      </Helmet>
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <StickyNavigation />
        <BreadcrumbNavigation customTitle="Developer Tools" />
        <h1 className="text-4xl font-extrabold mb-6">Best Free Developer Tools Online</h1>
        <p className="text-lg text-muted-foreground mb-12">Clean, fast, and entirely local processing for most developer tools. Validate JSON, encode URLs, and generate QR codes easily.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Link to="/developer/json-formatter"><Card className="h-full hover:shadow-soft"><CardContent className="p-6 font-semibold hover:text-primary">JSON Formatter</CardContent></Card></Link>
           <Link to="/converters/base64-encoder-decoder"><Card className="h-full hover:shadow-soft"><CardContent className="p-6 font-semibold hover:text-primary">Base64 Encoder/Decoder</CardContent></Card></Link>
           <Link to="/converters/url-encoder-decoder"><Card className="h-full hover:shadow-soft"><CardContent className="p-6 font-semibold hover:text-primary">URL Encoder</CardContent></Card></Link>
        </div>
      </main>
    </div>
  );
};

export default ToolsForDevelopersPage;