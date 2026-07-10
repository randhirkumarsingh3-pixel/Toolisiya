import React from 'react';
import { getToolSeoContent } from '@/data/toolSeoContent.js';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, HelpCircle, Briefcase, Zap, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

// Internal Linking Engine Dictionary
const INTERNAL_LINKS = [
  { keyword: 'PDF Editor', url: '/pdf/editor' },
  { keyword: 'Compress PDF', url: '/pdf/compress' },
  { keyword: 'Invoice Generator', url: '/finance/invoice-generator' },
  { keyword: 'Image Compressor', url: '/image/compress' },
  { keyword: 'QR Code Generator', url: '/generator/qr-code' },
];

const Linkify = ({ text }) => {
  if (!text) return null;
  
  // A simple implementation of internal linking engine for SEO
  let elements = [text];
  
  INTERNAL_LINKS.forEach(({ keyword, url }) => {
    const newElements = [];
    const regex = new RegExp(`(${keyword})`, 'gi');
    
    elements.forEach(el => {
      if (typeof el === 'string') {
        const parts = el.split(regex);
        parts.forEach(part => {
          if (part.toLowerCase() === keyword.toLowerCase()) {
            newElements.push(
              <Link key={`${url}-${Math.random()}`} to={url} className="text-primary font-medium hover:underline">
                {part}
              </Link>
            );
          } else if (part) {
            newElements.push(part);
          }
        });
      } else {
        newElements.push(el);
      }
    });
    elements = newElements;
  });

  return <>{elements.map((el, i) => <React.Fragment key={i}>{el}</React.Fragment>)}</>;
};

const ProgrammaticSVGWorkflow = ({ toolName }) => {
  // Determine diagram type based on toolName keywords
  const name = toolName.toLowerCase();
  
  if (name.includes('pdf')) {
    return (
      <div className="w-full bg-muted/30 rounded-2xl p-6 border border-border mb-8 flex justify-center items-center overflow-x-auto">
        <svg viewBox="0 0 600 200" className="w-full max-w-2xl h-auto" style={{ minWidth: '400px' }}>
          <defs>
            <linearGradient id="pdfGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
            <linearGradient id="procGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
          <g transform="translate(40, 50)">
            <rect x="0" y="0" width="80" height="100" rx="8" fill="url(#pdfGrad)" opacity="0.1" stroke="url(#pdfGrad)" strokeWidth="2" />
            <text x="40" y="55" textAnchor="middle" fill="#ef4444" fontWeight="bold" fontSize="16">PDF</text>
            
            <path d="M 90 50 L 210 50" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" fill="none" />
            <polygon points="210,50 200,45 200,55" fill="#94a3b8" />
            
            <circle cx="260" cy="50" r="40" fill="url(#procGrad)" opacity="0.1" stroke="url(#procGrad)" strokeWidth="2" />
            <text x="260" y="55" textAnchor="middle" fill="#3b82f6" fontWeight="bold" fontSize="14">Engine</text>
            
            <path d="M 310 50 L 430 50" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" fill="none" />
            <polygon points="430,50 420,45 420,55" fill="#94a3b8" />
            
            <rect x="440" y="0" width="80" height="100" rx="8" fill="#10b981" opacity="0.1" stroke="#10b981" strokeWidth="2" />
            <text x="480" y="55" textAnchor="middle" fill="#10b981" fontWeight="bold" fontSize="16">Output</text>
          </g>
        </svg>
      </div>
    );
  }

  if (name.includes('calculator') || name.includes('finance')) {
    return (
      <div className="w-full bg-muted/30 rounded-2xl p-6 border border-border mb-8 flex justify-center items-center overflow-x-auto">
        <svg viewBox="0 0 600 200" className="w-full max-w-2xl h-auto" style={{ minWidth: '400px' }}>
          <g transform="translate(40, 50)">
            <rect x="0" y="0" width="100" height="80" rx="8" fill="#f59e0b" opacity="0.1" stroke="#f59e0b" strokeWidth="2" />
            <text x="50" y="45" textAnchor="middle" fill="#f59e0b" fontWeight="bold" fontSize="14">Raw Data</text>
            
            <path d="M 110 40 L 230 40" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" fill="none" />
            <polygon points="230,40 220,35 220,45" fill="#94a3b8" />
            
            <polygon points="280,0 330,40 280,80 230,40" fill="#3b82f6" opacity="0.1" stroke="#3b82f6" strokeWidth="2" />
            <text x="280" y="45" textAnchor="middle" fill="#3b82f6" fontWeight="bold" fontSize="12">Algorithm</text>
            
            <path d="M 330 40 L 430 40" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" fill="none" />
            <polygon points="430,40 420,35 420,45" fill="#94a3b8" />
            
            <rect x="440" y="0" width="100" height="80" rx="8" fill="#10b981" opacity="0.1" stroke="#10b981" strokeWidth="2" />
            <text x="490" y="45" textAnchor="middle" fill="#10b981" fontWeight="bold" fontSize="14">Final Report</text>
          </g>
        </svg>
      </div>
    );
  }

  // Default process flow
  return (
    <div className="w-full bg-muted/30 rounded-2xl p-6 border border-border mb-8 flex justify-center items-center overflow-x-auto">
      <svg viewBox="0 0 600 150" className="w-full max-w-2xl h-auto" style={{ minWidth: '400px' }}>
        <g transform="translate(50, 40)">
          <circle cx="30" cy="30" r="30" fill="#8b5cf6" opacity="0.1" stroke="#8b5cf6" strokeWidth="2" />
          <text x="30" y="35" textAnchor="middle" fill="#8b5cf6" fontWeight="bold">Input</text>
          
          <path d="M 70 30 L 210 30" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" fill="none" />
          <polygon points="210,30 200,25 200,35" fill="#94a3b8" />
          
          <circle cx="250" cy="30" r="30" fill="#3b82f6" opacity="0.1" stroke="#3b82f6" strokeWidth="2" />
          <text x="250" y="35" textAnchor="middle" fill="#3b82f6" fontWeight="bold">Process</text>
          
          <path d="M 290 30 L 430 30" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" fill="none" />
          <polygon points="430,30 420,25 420,35" fill="#94a3b8" />
          
          <circle cx="470" cy="30" r="30" fill="#10b981" opacity="0.1" stroke="#10b981" strokeWidth="2" />
          <text x="470" y="35" textAnchor="middle" fill="#10b981" fontWeight="bold">Result</text>
        </g>
      </svg>
    </div>
  );
};

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
            <Linkify text={content.definition} />
          </p>
          {content.formulaTypes && (
            <div className="mt-6 p-6 bg-muted/40 rounded-2xl border border-border/50">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Formulas & Methodology
              </h3>
              <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                <Linkify text={content.formulaTypes} />
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How it Works - Step Layout */}
      <section className="space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 mb-6">
          <Zap className="h-6 w-6 text-primary" />
          How It Works
        </h2>
        
        <ProgrammaticSVGWorkflow toolName={toolName} />

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
              <span className="text-muted-foreground leading-relaxed"><Linkify text={tip} /></span>
            </li>
          ))}
        </ul>
      </section>

      {/* Worked Examples */}
      {content.workedExamples && content.workedExamples.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            Worked Examples & Real Scenarios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.workedExamples.map((example, index) => (
              <Card key={index} className="border-border shadow-md bg-card">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-primary">{example.title}</h3>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">Scenario</span>
                    <p className="text-sm text-foreground leading-relaxed"><Linkify text={example.scenario} /></p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg border border-border/50">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">Calculation / Action</span>
                    <p className="text-sm font-mono text-foreground whitespace-pre-wrap"><Linkify text={example.calculation} /></p>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">Outcome</span>
                    <p className="text-sm font-medium text-foreground"><Linkify text={example.outcome} /></p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Comparison Tables */}
      {content.comparisonTables && content.comparisonTables.length > 0 && (
        <section className="space-y-6">
          {content.comparisonTables.map((table, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-border shadow-sm">
              <div className="bg-muted px-6 py-4 border-b border-border">
                <h3 className="text-lg font-bold text-foreground">{table.title}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary/10 text-muted-foreground uppercase">
                    <tr>
                      {table.headers.map((header, hIdx) => (
                        <th key={hIdx} className="px-6 py-4 font-semibold">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-muted/50 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className={`px-6 py-4 ${cIdx === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Competitor Comparison */}
      {content.competitorComparison && (
        <section className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
            <div className="bg-primary/10 px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary">{content.competitorComparison.title}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground uppercase">
                  <tr>
                    {content.competitorComparison.headers.map((header, hIdx) => (
                      <th key={hIdx} className="px-6 py-4 font-bold">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {content.competitorComparison.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-muted/50 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className={`px-6 py-4 ${cIdx === 1 ? 'font-bold text-emerald-500' : cIdx === 0 ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Use Case Comparison */}
      {content.useCaseComparison && content.useCaseComparison.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            Use Case Comparisons
          </h2>
          <div className="grid gap-4">
            {content.useCaseComparison.map((uc, index) => (
              <div key={index} className="grid md:grid-cols-3 gap-4 bg-card border border-border p-5 rounded-2xl shadow-sm items-center">
                <div className="font-bold text-foreground text-lg">{uc.task}</div>
                <div className="flex flex-col border-l-4 border-muted pl-4">
                  <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Manual Method</span>
                  <span className="text-muted-foreground">{uc.manual}</span>
                </div>
                <div className="flex flex-col border-l-4 border-emerald-500 pl-4 bg-emerald-500/5 p-3 rounded-r-lg">
                  <span className="text-xs uppercase font-bold text-emerald-500 tracking-wider">Toolisiya Method</span>
                  <span className="font-medium text-foreground">{uc.toolisiya}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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