import React from 'react';
import { getToolSeoContent } from '@/data/toolSeoContent.js';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, HelpCircle, Briefcase, Zap, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const SEOContentDisplay = ({ toolName }) => {
  if (!toolName) return null;

  const content = getToolSeoContent(toolName);
  if (!content) return null;

  const formattedTitle = toolName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <article className="max-w-4xl mx-auto space-y-16 py-16 mt-12 border-t border-border animate-in fade-in duration-700">
      
      {/* Definition & Overview */}
      <section className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Understanding the {formattedTitle}
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-muted-foreground">
            {content.definition}
          </p>
          {content.formulaTypes && (
            <div className="mt-6 p-6 bg-muted/40 rounded-2xl border border-border/50">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Formulas & Methodology
              </h3>
              <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {content.formulaTypes}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How it Works - Step Layout */}
      <section className="space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          How It Works
        </h2>
        <div className="grid gap-6 relative">
          {/* Subtle connecting line for steps */}
          <div className="absolute left-6 top-8 bottom-8 w-px bg-border hidden md:block"></div>
          
          {content.howItWorks.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 md:gap-6 relative z-10">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-background border-2 border-primary/20 text-primary font-bold text-lg shadow-sm">
                {index + 1}
              </div>
              <div className="pt-2 md:pt-3">
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tips & Best Practices */}
      <section className="bg-secondary/20 rounded-3xl p-8 md:p-10 border border-secondary/30">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 text-foreground">
          Tips & Best Practices
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-1" />
              <span className="text-muted-foreground leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Common Use Cases */}
      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          Common Use Cases
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {content.useCases.map((useCase, index) => (
            <Card key={index} className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-bold text-foreground mb-2">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{useCase.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-3">
          {content.faq.map((faqItem, index) => (
            <AccordionItem key={index} value={`faq-${index}`} className="bg-card border border-border rounded-xl px-5">
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-5 text-foreground">
                {faqItem.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-base">
                {faqItem.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

    </article>
  );
};

export default SEOContentDisplay;