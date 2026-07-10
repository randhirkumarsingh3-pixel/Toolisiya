import React from 'react';
import { Helmet } from 'react-helmet';
import { CheckCircle2, ShieldAlert, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function FactCheckingPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4">
      <Helmet>
        <title>Fact-Checking & Editorial Policy | Toolisiya</title>
        <meta name="description" content="Read Toolisiya's rigorous fact-checking policy and our commitment to accurate, unbiased information in our Learning Center." />
      </Helmet>
      
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-center">Fact-Checking Policy</h1>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
          Accuracy is the foundation of trust. Here is how we ensure the information in our Learning Center and tool descriptions is correct, current, and reliable.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6"><CheckCircle2 className="text-emerald-500" /> Our Fact-Checking Process</h2>
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">1. Primary Source Verification</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Whenever we discuss legal compliance (like GST rules), technical specifications (like OCR DPI requirements), or software capabilities, we link directly to primary sources such as official government portals, W3C standards, or official vendor documentation. We do not rely on secondary blogs for critical facts.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">2. Expert Review</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our deep-dive articles are written and reviewed by developers and subject matter experts. For instance, our finance tools and guides are cross-referenced with practicing chartered accountants to ensure formulas (such as EMI or tax calculations) are completely accurate.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">3. Continuous Updates</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Technology and tax laws change rapidly. We conduct quarterly audits of our most popular tools and Learning Center articles to ensure they reflect the latest operating systems, browser APIs, and compliance mandates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6"><ShieldAlert className="text-primary" /> Corrections Policy</h2>
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-8 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Despite our best efforts, errors occasionally happen. We are committed to transparency in acknowledging and correcting them immediately.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>If a minor factual error occurs, we will correct the text and update the "Last Modified" date at the top of the article.</li>
                  <li>If a significant error occurs that changes the fundamental takeaway of an article or calculation of a tool, we will publish a prominent correction notice at the top of the page detailing what was wrong and how it was fixed.</li>
                </ul>
                <p className="text-muted-foreground font-bold mt-4">
                  Found an error? Email us at corrections@toolisiya.com.
                </p>
              </CardContent>
            </Card>
          </section>

        </div>
      </div>
    </div>
  );
}
