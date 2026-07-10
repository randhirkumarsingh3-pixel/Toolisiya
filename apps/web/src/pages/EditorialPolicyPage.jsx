import React from 'react';
import { Helmet } from 'react-helmet';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import { ShieldCheck, BookOpen, PenTool, CheckCircle, Clock } from 'lucide-react';

export default function EditorialPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Editorial Policy | Toolisiya</title>
        <meta name="description" content="Read our Editorial Policy to understand how Toolisiya maintains accuracy, trust, and quality across our digital tools and educational content." />
        <link rel="canonical" href="https://toolisiya.com/editorial-policy" />
      </Helmet>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <BreadcrumbNavigation customTitle="Editorial Policy" />

          <div className="mt-10 space-y-12">
            <section className="text-center py-8">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-foreground">
                Editorial Policy
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Our commitment to accuracy, independence, and user trust in every tool we build and article we publish.
              </p>
            </section>

            <section className="prose prose-slate dark:prose-invert max-w-none space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold tracking-tight text-foreground m-0">Core Principles</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Toolisiya, millions of users rely on our calculators, converters, and guides to make financial decisions, edit professional documents, and write code. We take this responsibility seriously. Our editorial policy is built on three core pillars: <strong>Accuracy, Independence, and Transparency.</strong>
              </p>
            </section>

            <section className="prose prose-slate dark:prose-invert max-w-none space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight text-foreground m-0">1. How We Create Content</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether we are publishing a guide on PDF compression or writing the formula for a Goods and Services Tax (GST) calculator, our process begins with extensive research.
              </p>
              <ul className="text-lg text-muted-foreground space-y-2">
                <li><strong>Expert Verification:</strong> Financial calculators are cross-referenced with official government tax structures and bank formulas.</li>
                <li><strong>Originality:</strong> We do not scrape or plagiarize content. Every guide is written by experienced professionals and developers.</li>
                <li><strong>Clarity:</strong> We avoid unnecessary jargon. Complex concepts are broken down into step-by-step guides.</li>
              </ul>
            </section>

            <section className="prose prose-slate dark:prose-invert max-w-none space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <PenTool className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight text-foreground m-0">2. Editorial Independence</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Toolisiya is an independent platform. We do not accept payment to artificially inflate the rating of third-party tools, nor do we accept paid content insertions that are not strictly labeled as advertisements. If we recommend a methodology or a piece of software, it is because our editorial team genuinely believes it is the best solution for the user.
              </p>
            </section>

            <section className="prose prose-slate dark:prose-invert max-w-none space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight text-foreground m-0">3. Tool Validation & Testing</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A tool is only as good as its underlying logic. Before a tool is published to the live site, it undergoes rigorous testing:
              </p>
              <ul className="text-lg text-muted-foreground space-y-2">
                <li>Edge case testing to ensure calculators do not produce negative or erroneous values.</li>
                <li>Privacy validation to ensure client-side tools (like the PDF Editor) genuinely do not send data to any server.</li>
                <li>Mobile usability testing across iOS and Android browsers.</li>
              </ul>
            </section>

            <section className="prose prose-slate dark:prose-invert max-w-none space-y-6 bg-primary/5 p-8 rounded-3xl border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight text-foreground m-0">4. Corrections and Updates</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Information changes. Tax brackets update, image compression algorithms improve, and SEO standards evolve. We actively monitor our top tools and guides to ensure they remain accurate.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every tool and article displays a <strong>"Last Updated"</strong> timestamp. If you spot an error or an outdated piece of information on Toolisiya, we want to know about it. Please contact us at <a href="mailto:support@toolisiya.com" className="text-primary hover:underline">support@toolisiya.com</a>. We aim to verify and correct factual errors within 48 hours of notification.
              </p>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
