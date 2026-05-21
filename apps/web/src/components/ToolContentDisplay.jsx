import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BookOpen, 
  Settings, 
  AlertTriangle, 
  HelpCircle, 
  Link as LinkIcon, 
  Info, 
  Lightbulb, 
  CheckCircle2,
  TrendingUp,
  Target
} from 'lucide-react';

const StructuredToolContent = ({ content }) => {
  return (
    <section className="mt-24 pt-12 border-t border-border">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Title & Introduction */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground text-balance">
              {content.title}
            </h2>
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
            <p>{content.introduction}</p>
          </div>
        </div>

        {/* How to Use Section */}
        {content.howToUse && content.howToUse.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold tracking-tight text-foreground">How to Use This Tool</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.howToUse.map((step, index) => (
                <div key={index} className="flex gap-4 p-6 bg-card border border-border shadow-sm rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-colors">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg z-10">
                    {index + 1}
                  </div>
                  <div className="z-10">
                    <h4 className="text-lg font-semibold text-card-foreground mb-2">{step.title}</h4>
                    <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 text-primary/5 font-black text-9xl pointer-events-none select-none group-hover:scale-110 transition-transform duration-500">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real World Examples */}
        {content.realWorldExamples && content.realWorldExamples.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold tracking-tight text-foreground">Real-World Examples & Scenarios</h3>
            </div>
            <div className="space-y-6">
              {content.realWorldExamples.map((example, index) => (
                <div key={index} className="bg-secondary rounded-2xl p-6 md:p-8">
                  <h4 className="text-xl font-bold text-secondary-foreground mb-4">{example.title}</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-bold uppercase tracking-wider text-primary/80">The Scenario:</span>
                      <p className="mt-1 text-secondary-foreground/90 leading-relaxed">{example.scenario}</p>
                    </div>
                    <div className="pl-4 border-l-2 border-primary/40">
                      <span className="text-sm font-bold uppercase tracking-wider text-primary/80">The Outcome:</span>
                      <p className="mt-1 text-secondary-foreground/90 leading-relaxed font-medium">{example.outcome}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips & Tricks */}
        {content.tipsAndTricks && content.tipsAndTricks.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-6 w-6 text-amber-500" />
              <h3 className="text-2xl font-bold tracking-tight text-foreground">Expert Tips & Strategies</h3>
            </div>
            <div className="bg-card border border-border shadow-sm rounded-2xl p-6 md:p-8">
              <ul className="space-y-6">
                {content.tipsAndTricks.map((tip, index) => (
                  <li key={index} className="flex gap-4">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-lg font-semibold text-card-foreground mb-1">{tip.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{tip.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Common Mistakes */}
        {content.commonMistakes && content.commonMistakes.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <h3 className="text-2xl font-bold tracking-tight text-foreground">Common Mistakes to Avoid</h3>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {content.commonMistakes.map((mistake, index) => (
                <div key={index} className="bg-destructive/5 border-l-4 border-destructive rounded-r-2xl p-6">
                  <h4 className="text-lg font-bold text-foreground mb-2">{mistake.title}</h4>
                  <p className="text-muted-foreground mb-3 leading-relaxed">{mistake.description}</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground bg-background/50 px-3 py-2 rounded-lg inline-flex">
                    <span className="text-emerald-600 dark:text-emerald-400">Solution:</span>
                    <span>{mistake.prevention}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        {content.faqs && content.faqs.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold tracking-tight text-foreground">Frequently Asked Questions</h3>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {content.faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-border bg-card mb-4 rounded-xl px-4 shadow-sm overflow-hidden data-[state=open]:ring-2 data-[state=open]:ring-primary/20">
                  <AccordionTrigger className="hover:no-underline py-4 text-left text-[1.05rem] font-semibold text-card-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {/* Related Tools */}
        {content.relatedTools && content.relatedTools.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold tracking-tight text-foreground">Explore Related Tools</h3>
            </div>
            <div className="flex flex-wrap gap-4">
              {content.relatedTools.map((tool, index) => (
                <Link 
                  key={index} 
                  to={tool.url} 
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all font-medium text-card-foreground group"
                >
                  <LinkIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  {tool.title}
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

const ToolContentDisplay = ({ toolId, toolName, content }) => {
  // 1. ALL useState hooks at the top unconditionally
  const [pbContent, setPbContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. ALL useEffect hooks next
  useEffect(() => {
    if (content) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    
    setLoading(true);
    setError(null);
    
    let query = '';
    if (toolName) query = `toolName="${toolName}"`;
    else if (toolId) query = `toolId="${toolId}"`;
    
    if (!query) {
      if (isMounted) setLoading(false);
      return;
    }

    // No try/catch block as requested, handling errors via promise chain
    pb.collection('tool_content').getFirstListItem(query, { $autoCancel: false })
      .then((record) => {
        if (isMounted) {
          setPbContent(record);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Tool content not found dynamically. Falling back to default if needed.", err);
        if (isMounted) {
          setError("Content not found");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [toolId, toolName, content]);

  // 3. Conditional rendering and logic placed AFTER all hooks
  if (content) {
    return <StructuredToolContent content={content} />;
  }

  if (loading) {
    return (
      <div className="mt-16 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-6 mt-8">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !pbContent) {
    return null; 
  }

  const formatText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-3 last:mb-0 text-muted-foreground leading-relaxed">
        {line}
      </p>
    ));
  };

  // Render PocketBase legacy format
  return (
    <section className="mt-16 pt-8 border-t border-border max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="h-8 w-8 text-primary" />
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Complete Guide: {pbContent.toolName}
        </h2>
      </div>

      <Accordion type="multiple" defaultValue={["intro", "how-to"]} className="w-full space-y-4">
        {pbContent.introduction && (
          <AccordionItem value="intro" className="border rounded-xl bg-card px-4 shadow-sm">
            <AccordionTrigger className="hover:no-underline py-4 text-lg font-semibold text-foreground">
              <span className="flex items-center gap-2"><Info className="h-5 w-5 text-primary/80" /> Introduction</span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="prose prose-slate dark:prose-invert max-w-none">{formatText(pbContent.introduction)}</div>
            </AccordionContent>
          </AccordionItem>
        )}
        {pbContent.howToUse && (
          <AccordionItem value="how-to" className="border rounded-xl bg-card px-4 shadow-sm">
            <AccordionTrigger className="hover:no-underline py-4 text-lg font-semibold text-foreground">
              <span className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary/80" /> How to Use</span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="prose prose-slate dark:prose-invert max-w-none">{formatText(pbContent.howToUse)}</div>
            </AccordionContent>
          </AccordionItem>
        )}
        {pbContent.realWorldExamples && (
          <AccordionItem value="examples" className="border rounded-xl bg-card px-4 shadow-sm">
            <AccordionTrigger className="hover:no-underline py-4 text-lg font-semibold text-foreground">
              <span className="flex items-center gap-2"><Target className="h-5 w-5 text-primary/80" /> Real-World Examples</span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="prose prose-slate dark:prose-invert max-w-none">{formatText(pbContent.realWorldExamples)}</div>
            </AccordionContent>
          </AccordionItem>
        )}
        {pbContent.tipsAndTricks && (
          <AccordionItem value="tips" className="border rounded-xl bg-card px-4 shadow-sm">
            <AccordionTrigger className="hover:no-underline py-4 text-lg font-semibold text-foreground">
              <span className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary/80" /> Tips & Tricks</span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="prose prose-slate dark:prose-invert max-w-none">{formatText(pbContent.tipsAndTricks)}</div>
            </AccordionContent>
          </AccordionItem>
        )}
        {pbContent.commonMistakes && (
          <AccordionItem value="mistakes" className="border rounded-xl bg-card px-4 shadow-sm">
            <AccordionTrigger className="hover:no-underline py-4 text-lg font-semibold text-foreground">
              <span className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive/80" /> Common Mistakes</span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="prose prose-slate dark:prose-invert max-w-none">{formatText(pbContent.commonMistakes)}</div>
            </AccordionContent>
          </AccordionItem>
        )}
        {pbContent.faqSection && (
          <AccordionItem value="faq" className="border rounded-xl bg-card px-4 shadow-sm">
            <AccordionTrigger className="hover:no-underline py-4 text-lg font-semibold text-foreground">
              <span className="flex items-center gap-2"><HelpCircle className="h-5 w-5 text-primary/80" /> FAQs</span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="prose prose-slate dark:prose-invert max-w-none">{formatText(pbContent.faqSection)}</div>
            </AccordionContent>
          </AccordionItem>
        )}
        {pbContent.relatedTools && Array.isArray(pbContent.relatedTools) && pbContent.relatedTools.length > 0 && (
          <AccordionItem value="related" className="border rounded-xl bg-card px-4 shadow-sm">
            <AccordionTrigger className="hover:no-underline py-4 text-lg font-semibold text-foreground">
              <span className="flex items-center gap-2"><LinkIcon className="h-5 w-5 text-primary/80" /> Related Tools</span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <ul className="space-y-2">
                {pbContent.relatedTools.map((tool, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    <Link to={tool.url || '#'} className="text-primary hover:underline font-medium">
                      {tool.name || tool.title || 'Tool Link'}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </section>
  );
};

export default ToolContentDisplay;