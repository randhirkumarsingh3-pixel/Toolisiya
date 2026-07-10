import React from 'react';
import { Helmet } from 'react-helmet';
import { CheckCircle2, Circle, Clock, Flame, Beaker } from 'lucide-react';

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4">
      <Helmet>
        <title>Product Roadmap | Toolisiya</title>
        <meta name="description" content="See what we're building next at Toolisiya. View our completed features, current projects, and long-term research goals." />
      </Helmet>
      
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Product Roadmap</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Toolisiya is under continuous development. Here is exactly what we have built, what we are currently working on, and where we are heading next.
          </p>
        </div>

        <div className="space-y-16">
          
          {/* Currently Building */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
              <Flame className="text-orange-500" />
              Currently Building
            </h2>
            <div className="bg-card border border-orange-500/30 shadow-md rounded-2xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full -z-10"></div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Circle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-foreground">Advanced PDF Editor 2.0</h3>
                    <p className="text-muted-foreground text-sm mt-1">Full in-browser annotation, freehand drawing, and signature support without uploading files.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Circle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-foreground">User Accounts & History</h3>
                    <p className="text-muted-foreground text-sm mt-1">Optional accounts to save your favorite tools and view recent generations.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Coming Soon */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
              <Clock className="text-blue-500" />
              Coming Soon
            </h2>
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Circle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-foreground">AI Background Remover</h3>
                    <p className="text-muted-foreground text-sm mt-1">High-quality, local WASM-based background removal for images.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Circle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-foreground">Bulk Image Converter</h3>
                    <p className="text-muted-foreground text-sm mt-1">Convert hundreds of WebP files to JPG or PNG simultaneously.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Circle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-foreground">Global Finance Tools</h3>
                    <p className="text-muted-foreground text-sm mt-1">Expanding tax calculators beyond India to include US, UK, and Australian frameworks.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Research */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
              <Beaker className="text-purple-500" />
              Research & Long-Term
            </h2>
            <div className="bg-muted/30 border border-border border-dashed rounded-2xl p-6 md:p-8">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Circle className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-foreground">Local AI Text Generation</h3>
                    <p className="text-muted-foreground text-sm mt-1">Investigating WebGPU to run small LLMs entirely in the browser for privacy-first copywriting tools.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Circle className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-foreground">Offline Desktop App</h3>
                    <p className="text-muted-foreground text-sm mt-1">Packaging the Toolisiya PWA ecosystem into standalone native apps for Windows and macOS.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Community Suggestions */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/10 text-pink-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
              </span>
              Community Suggestions
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-foreground mb-4 text-emerald-500">Recently Implemented</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Bulk Image Compression
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> PDF Page Extraction
                  </li>
                </ul>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-foreground mb-4 text-primary">Top Requested Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="font-bold text-foreground bg-muted px-1.5 rounded">1</span> API Access for Developers
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="font-bold text-foreground bg-muted px-1.5 rounded">2</span> Invoice Generation in Multiple Currencies
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Completed */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 opacity-70">
              <CheckCircle2 className="text-emerald-500" />
              Recently Completed
            </h2>
            <div className="opacity-80">
              <ul className="space-y-4 border-l-2 border-border ml-2 pl-6">
                <li className="relative">
                  <div className="absolute -left-[33px] top-1 w-3 h-3 rounded-full bg-emerald-500"></div>
                  <h3 className="font-bold text-foreground">Enterprise-Grade E-E-A-T Architecture</h3>
                  <p className="text-muted-foreground text-sm mt-1">Rolled out comprehensive Trust & Safety centers, AI policies, and Editorial Independence guidelines.</p>
                </li>
                <li className="relative">
                  <div className="absolute -left-[33px] top-1 w-3 h-3 rounded-full bg-emerald-500"></div>
                  <h3 className="font-bold text-foreground">Programmatic SVG Workflows</h3>
                  <p className="text-muted-foreground text-sm mt-1">Replaced stock graphics with dynamic, educational process diagrams for all premium tools.</p>
                </li>
                <li className="relative">
                  <div className="absolute -left-[33px] top-1 w-3 h-3 rounded-full bg-emerald-500"></div>
                  <h3 className="font-bold text-foreground">The Learning Center v2.0</h3>
                  <p className="text-muted-foreground text-sm mt-1">Launched 10+ massive knowledge-base articles replacing thin blog stubs.</p>
                </li>
              </ul>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
