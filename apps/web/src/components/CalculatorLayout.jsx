import React from 'react';
import { Helmet } from 'react-helmet';
import StickyNavigation from '@/components/StickyNavigation.jsx';

const CalculatorLayout = ({ 
  title, 
  description, 
  category, 
  categoryPath, 
  formula, 
  example, 
  faqs, 
  children,
  goBackTo,
  icon
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Helmet>
        <title>{title} - Free Online Tool | Toolisiya</title>
        <meta name="description" content={description} />
      </Helmet>
      
      <main className="flex-1 py-8 relative">
        <StickyNavigation />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl mt-2">

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-foreground flex items-center gap-3">
              {icon && <span className="inline-block p-2 bg-primary/10 rounded-xl">{icon}</span>}
              {title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-prose">
              {description}
            </p>
          </div>

          <div className="mb-12 animate-in fade-in duration-500">
            {children}
          </div>
          
          {/* Automatically inject formula, examples, and FAQs if provided and not handled inside children */}
          {(formula || example || faqs) && (
             <div className="space-y-8 mt-16 animate-in fade-in duration-700">
               {formula && (
                 <section className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
                   <h2 className="text-2xl font-bold mb-4">Formula</h2>
                   <div className="bg-muted rounded-lg p-5 font-mono text-sm space-y-3">
                     {Array.isArray(formula) ? formula.map((line, i) => <p key={i} className="text-muted-foreground">{line}</p>) : <p className="text-muted-foreground">{formula}</p>}
                   </div>
                 </section>
               )}
               
               {example && (
                 <section className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
                   <h2 className="text-2xl font-bold mb-4">Example</h2>
                   <p className="text-muted-foreground mb-4">{example.description}</p>
                   {example.steps && (
                     <div className="bg-muted rounded-lg p-5 space-y-2">
                       {example.steps.map((step, i) => (
                         <p key={i} className={step.highlight ? "font-bold text-primary mt-4 pt-4 border-t border-border/50" : "text-muted-foreground"}>{step.text}</p>
                       ))}
                     </div>
                   )}
                 </section>
               )}
               
               {faqs && faqs.length > 0 && (
                 <section className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
                   <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                   <div className="space-y-6">
                     {faqs.map((faq, i) => (
                       <div key={i}>
                         <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                         <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                       </div>
                     ))}
                   </div>
                 </section>
               )}
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CalculatorLayout;