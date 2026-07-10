import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Zap, CalendarDays, Star, Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function ProductUpdatesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4">
      <Helmet>
        <title>Product Updates & Releases | Toolisiya</title>
        <meta name="description" content="Stay up to date with the latest features, tool improvements, and Learning Center guides on Toolisiya." />
      </Helmet>
      
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Product Updates</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We deploy improvements to Toolisiya every single week. Here's a log of our latest feature releases, bug fixes, and massive guide drops.
          </p>
        </div>

        <div className="relative border-l-2 border-border ml-4 md:ml-8 space-y-12 pb-12">
          
          {/* Latest */}
          <div className="relative pl-8 md:pl-12">
            <div className="absolute -left-[21px] top-1 w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-primary">
              Latest Release
            </h2>
            <Card className="bg-card border-border shadow-md">
              <CardContent className="p-6 md:p-8 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Today</span>
                <h3 className="text-xl font-bold">The Enterprise Trust Upgrade</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We've completely overhauled our trust architecture to provide total transparency. This includes the rollout of our new Security Center, AI Content Policy, and Fact-Checking protocols.
                </p>
                <div className="flex flex-wrap gap-3 pt-4">
                  <Link to="/security" className="inline-flex items-center text-sm font-medium text-primary hover:underline">View Security Center &rarr;</Link>
                  <Link to="/ai-content-policy" className="inline-flex items-center text-sm font-medium text-primary hover:underline">Read AI Policy &rarr;</Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Last 7 Days */}
          <div className="relative pl-8 md:pl-12">
            <div className="absolute -left-[21px] top-1 w-10 h-10 rounded-full bg-background border-2 border-emerald-500 flex items-center justify-center shadow-sm">
              <CalendarDays className="w-5 h-5 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-emerald-500">
              Last 7 Days
            </h2>
            <div className="space-y-6">
              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-6 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Feature Enhancement</span>
                  <h3 className="text-lg font-bold">Dynamic SVG Workflows</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We replaced generic stock illustrations on all Premium Tool pages with dynamically generated, interactive SVG process flows. This helps users understand exactly how their data is being processed in the browser.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-6 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Content Drop</span>
                  <h3 className="text-lg font-bold">Learning Center v2.0 Launched</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We published 10 massive, 2,000+ word guides covering complex topics like OCR Binarization, ATS-Friendly Resumes, and GST Input Tax Credits.
                  </p>
                  <Link to="/blog" className="inline-flex items-center text-sm font-medium text-emerald-500 hover:underline pt-2">Visit the Academies &rarr;</Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Last 30 Days */}
          <div className="relative pl-8 md:pl-12">
            <div className="absolute -left-[21px] top-1 w-10 h-10 rounded-full bg-background border-2 border-blue-500 flex items-center justify-center shadow-sm">
              <Layers className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-blue-500">
              Last 30 Days
            </h2>
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Platform Update</span>
                <h3 className="text-lg font-bold">Tool Page Knowledge Hubs</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Every premium tool is no longer just a utility. We upgraded our underlying data structure to inject robust FAQs, Step-by-Step guides, and "Competitor Comparisons" (e.g., Toolisiya vs Adobe) directly into the tool pages.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Major Releases */}
          <div className="relative pl-8 md:pl-12">
            <div className="absolute -left-[21px] top-1 w-10 h-10 rounded-full bg-background border-2 border-purple-500 flex items-center justify-center shadow-sm">
              <Star className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-purple-500">
              Major Historical Releases
            </h2>
            <Card className="bg-muted/30 border-border border-dashed shadow-sm">
              <CardContent className="p-6 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Milestone</span>
                <h3 className="text-lg font-bold">Toolisiya 1.0 General Availability</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  The initial release of the Toolisiya PWA ecosystem, featuring 40+ offline-capable tools spanning PDF manipulation, Image Processing, and Financial Calculators.
                </p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
