import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Clock, RefreshCw, FileEdit, Calculator, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function RecentlyUpdatedPage() {
  const updates = [
    { name: 'PDF Editor', type: 'Tool', date: 'Updated 2 hours ago', icon: FileEdit, url: '/pdf/editor', desc: 'Added advanced whiteout and digital signature flattening.' },
    { name: 'GST Calculator', type: 'Tool', date: 'Updated 1 day ago', icon: Calculator, url: '/finance/gst-calculator', desc: 'Updated input tax credit logic to match recent 2026 guidelines.' },
    { name: 'Image Compressor', type: 'Tool', date: 'Updated 3 days ago', icon: ImageIcon, url: '/image/compress', desc: 'Improved WebAssembly processing speed by 15%.' },
    { name: 'OCR Scanner', type: 'Tool', date: 'Updated 5 days ago', icon: FileEdit, url: '/pdf/ocr', desc: 'Enhanced handwriting recognition models.' },
    { name: 'Resume Builder', type: 'Tool', date: 'Updated 1 week ago', icon: FileEdit, url: '/career/resume-builder', desc: 'Added 3 new ATS-optimized export templates.' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4">
      <Helmet>
        <title>Recently Updated Tools | Toolisiya</title>
        <meta name="description" content="View the tools and resources we've recently updated, improved, and optimized to provide the best possible experience." />
      </Helmet>
      
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-6">
            <RefreshCw className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Recently Updated</h1>
          <p className="text-lg text-muted-foreground">
            We are constantly refining our tools based on your feedback. Here is what we've optimized lately.
          </p>
        </div>

        <div className="space-y-4">
          {updates.map((item, index) => (
            <Link key={index} to={item.url} className="block group">
              <Card className="border-border bg-card shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all rounded-2xl overflow-hidden">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors shrink-0">
                      <item.icon className="w-6 h-6 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-emerald-500 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                      <Clock className="w-3.5 h-3.5" /> {item.date}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
