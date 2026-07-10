import React from 'react';
import { Helmet } from 'react-helmet';
import { ShieldCheck, Eye, Scale, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function TransparencyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4">
      <Helmet>
        <title>Transparency & Funding Policy | Toolisiya</title>
        <meta name="description" content="Learn how Toolisiya is funded, our editorial independence, and our commitment to providing free, unbiased tools." />
      </Helmet>
      
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-center">Transparency & Funding Policy</h1>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
          We believe you have the right to know exactly who we are, how we make money, and how we ensure editorial independence.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6"><Eye className="text-primary" /> How We Are Funded</h2>
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-8 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Toolisiya is 100% free to use. We do not charge subscriptions, we do not lock features behind paywalls, and we do not sell your personal data. 
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  To keep our servers running and our team paid, we rely entirely on display advertising (such as Google AdSense) and occasional affiliate partnerships. When you see an ad on our site, it is dynamically placed by advertising networks. We do not accept direct payment from companies to build specific tools or write biased reviews.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6"><Scale className="text-primary" /> Editorial Independence</h2>
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-8 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Our development roadmap and editorial content in the Learning Center are strictly independent of our advertising partners. Advertisers do not have a say in what tools we build, what articles we publish, or how we rank software alternatives in our comparison tables.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  If we ever publish a sponsored article (which is rare), it will be explicitly marked as "Sponsored Content" at the very top of the page.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6"><Users className="text-primary" /> Our Team</h2>
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-8 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Toolisiya was built by an independent team of developers in India. We built this platform because we were tired of encountering hidden paywalls when trying to compress a simple PDF or convert an image. Our mission is to democratize digital utility tools for students, freelancers, and small businesses globally.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6"><ShieldCheck className="text-primary" /> Affiliate Disclosure</h2>
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-8 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  In some of our Learning Center articles, we may link to third-party software or services using affiliate links. If you click on one of these links and make a purchase, we may earn a small commission at no extra cost to you. We only recommend products that we have independently tested and believe will provide value to our users.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
