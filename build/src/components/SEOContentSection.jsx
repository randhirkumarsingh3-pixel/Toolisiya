import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight, HelpCircle, Compass, ArrowRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';

const SEOContentSection = ({ description, features, howToSteps, faqs, relatedTools, categoryPath }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-12 border-t border-border mt-12 animate-fade-in">
      
      {/* Description Section */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground tracking-tight text-balance">
          About This Tool
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/30 p-8 rounded-3xl border border-border/50">
        <h2 className="text-2xl font-bold mb-6 text-secondary-foreground">Key Features & Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-secondary-foreground/90 font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How To Use Section - Numbered List Layout */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground tracking-tight">
          How to Use
        </h2>
        <div className="space-y-8">
          {howToSteps.map((step, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 group">
              <div className="text-6xl font-extrabold text-primary/15 font-mono leading-none select-none transition-colors group-hover:text-primary/30">
                {(index + 1).toString().padStart(2, '0')}
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/10 p-2 rounded-lg">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-card border rounded-xl px-4 overflow-hidden">
              <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Related Tools Section */}
      {relatedTools && relatedTools.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Compass className="h-6 w-6 text-muted-foreground" />
              <h2 className="text-2xl font-bold text-foreground">Related Tools</h2>
            </div>
            {categoryPath && (
              <Link to={categoryPath} className="text-sm font-medium text-primary hover:underline hidden sm:flex items-center">
                View Category <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedTools.map((tool, index) => (
              <Link key={index} to={tool.path} className="block group">
                <Card className="h-full border-border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/30">
                  <CardContent className="p-5 flex items-center justify-between">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {tool.name}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SEOContentSection;