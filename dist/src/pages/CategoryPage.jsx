import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight, CheckCircle2, LayoutGrid } from 'lucide-react';
import { categoryPageContent } from '@/data/categoryPageContent.js';
import { toolPageContent } from '@/data/toolPageContent.js';
import SEOHead from '@/components/SEOHead.jsx';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import NotFoundPage from '@/pages/NotFoundPage.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function CategoryPage() {
  const { slug } = useParams();
  
  const category = categoryPageContent.find(c => c.slug === slug);

  if (!category) {
    return <NotFoundPage />;
  }

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Categories', path: '/browse-categories' },
    { label: category.categoryName, path: `/category/${slug}` }
  ];

  // Map tool slugs to actual tool data
  const categoryTools = category.tools
    .map(toolSlug => toolPageContent.find(t => t.slug === toolSlug))
    .filter(Boolean); // Remove any undefined tools

  // Map related category slugs to actual category data
  const relatedCategories = category.relatedCategories
    .map(catSlug => categoryPageContent.find(c => c.slug === catSlug))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead 
        pageName={`category-${slug}`} 
        defaultTitle={`${category.categoryName} - Free Online Tools | Toolisiya`} 
        defaultDescription={category.description} 
      />

      {/* Hero Section */}
      <section className="bg-muted/30 border-b border-border pt-8 pb-12 md:pt-16 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <BreadcrumbNavigation items={breadcrumbItems} className="mb-6" />
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              <LayoutGrid className="mr-2 h-4 w-4" />
              {category.toolCount} Tools Available
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance mb-6">
              {category.categoryName}
            </h1>
            <p className="text-xl text-muted-foreground text-balance mb-8 leading-relaxed">
              {category.description}
            </p>
            <Button size="lg" className="px-8 rounded-xl" onClick={() => {
              document.getElementById('tools-grid').scrollIntoView({ behavior: 'smooth' });
            }}>
              Explore Tools
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl py-16 space-y-20">
        
        {/* Description & Benefits */}
        <section className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-6">What are {category.categoryName}?</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {category.longDescription}
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Key Benefits</h3>
            <ul className="space-y-4">
              {category.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Tools Grid */}
        <section id="tools-grid" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Available Tools</h2>
            <span className="text-muted-foreground font-medium">{categoryTools.length} tools</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryTools.map((tool, idx) => (
              <Card key={idx} className="border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 bg-card group flex flex-col h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">{tool.toolName}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{tool.description}</p>
                  </div>
                  <div className="mt-auto pt-4">
                    <Button asChild variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Link to={`/tool/${tool.slug}`}>Use Tool</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="bg-muted/30 rounded-3xl p-8 md:p-12 border border-border">
          <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">Common Use Cases</h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {category.useCases.map((useCase, idx) => (
              <div key={idx} className="bg-background border border-border rounded-xl p-4 flex items-start gap-3 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                <p className="text-muted-foreground">{useCase}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SEO Content */}
        <section className="prose prose-slate dark:prose-invert max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-6 text-center">{category.categoryName} - Complete Guide</h2>
          <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-lg">
            {category.seoContent}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full bg-card rounded-xl border border-border shadow-sm px-4">
            {category.faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-bold text-lg py-4">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Related Categories */}
        {relatedCategories.length > 0 && (
          <section className="border-t border-border pt-16">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Explore Related Categories</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {relatedCategories.map((cat, idx) => (
                <Link key={idx} to={`/category/${cat.slug}`} className="block group">
                  <Card className="h-full border-border shadow-sm hover:border-primary/50 hover:shadow-md transition-all bg-card">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors mb-2">
                          {cat.categoryName}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
                      </div>
                      <div className="flex items-center text-sm font-medium text-primary mt-4">
                        View Category <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}