import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SEOContentDisplay from '@/components/SEOContentDisplay.jsx';
import SEOHead from '@/components/SEOHead.jsx';

export default function ToolPageTemplate({ toolData, children }) {
  if (!toolData) {
    return <div className="p-8 text-center text-red-500 font-bold">Error: Tool data is missing.</div>;
  }

  const {
    id,
    toolName,
    toolDescription,
    category,
    whatToolDoes,
    whyUseful,
    howToUseSteps,
    howItWorks,
    features,
    useCases,
    faqs,
    seoContent,
    relatedTools
  } = toolData;

  const toolId = id || toolName?.toLowerCase().replace(/\s+/g, '-');

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden tool-page-content">
      <SEOHead
        toolName={toolName}
        category={category}
        defaultSlug={toolId}
        defaultTitle={`${toolName} - Free Online Tool | Toolisiya`}
        defaultDescription={toolDescription}
      />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="bg-muted/30 border-b border-border pt-12 pb-16 relative overflow-hidden" style={{ minHeight: 'var(--tool-hero-height)' }}>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
          <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
            
            <nav className="flex justify-center items-center space-x-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">{toolName}</span>
            </nav>

            <h1 className="mb-4">{toolName}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">{toolDescription}</p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
              <Button size="lg" className="rounded-xl px-8 h-14 text-base font-bold shadow-md" onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}>
                Start Using {toolName}
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No signup required</span>
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure processing</span>
              <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-500" /> Instant results</span>
            </div>
          </div>
        </section>

        {/* 2. Tool Interface Section (Children) */}
        <section className="relative z-20 -mt-8 mb-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="bg-card rounded-2xl border border-border shadow-lg p-2 md:p-6" style={{ boxShadow: 'var(--tool-shadow)' }}>
              {children}
            </div>
          </div>
        </section>

        {/* Content Wrapper */}
        <div className="container mx-auto px-4 max-w-4xl space-y-16 pb-20">
          
          <SEOContentDisplay toolName={toolId} />

          {/* 12. Trust & Security Section */}
          <section className="bg-primary/5 border border-primary/20 rounded-3xl p-8 md:p-12 text-center">
            <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="mt-0 text-primary-foreground text-primary">Your Data is Secure</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We prioritize your privacy. Files processed by Toolisiya are handled securely. 
              Local processing tools never send your data to any server. For tools that require server-side 
              processing, files are automatically and permanently deleted immediately after the task is complete. 
              We never share, sell, or store your sensitive information.
            </p>
          </section>

          {/* 11. Internal Linking Section */}
          {relatedTools && relatedTools.length > 0 && (
            <section>
              <h2>Explore Related Tools</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedTools.map((related, idx) => (
                  <Link key={idx} to={related.url} className="block group">
                    <Card className="h-full border-border shadow-sm hover:border-primary/50 transition-all hover:-translate-y-1">
                      <CardContent className="p-5 flex justify-between items-center h-full">
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {related.name}
                        </span>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 13. CTA Section */}
          <section className="text-center py-12 border-t border-border">
            <h2 className="mt-0 mb-6">Ready to boost your productivity?</h2>
            <Button size="lg" className="rounded-xl px-10 h-14 text-lg font-bold shadow-md" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Start Using {toolName} Now
            </Button>
          </section>

        </div>
      </main>

      {/* 14. Footer Links (Simplified contextual footer for template if needed, standard footer exists in App.jsx but this satisfies the prompt requirement) */}
      <div className="bg-muted/50 border-t border-border py-8 mt-auto">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-6 text-sm font-medium text-muted-foreground">
          <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms & Conditions</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
          <Link to="/contact-us" className="hover:text-primary transition-colors">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}