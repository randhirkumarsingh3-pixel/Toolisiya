import React from 'react';
import { Helmet } from 'react-helmet';
import { Cookie, Info, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4">
      <Helmet>
        <title>Cookie Policy | Toolisiya</title>
        <meta name="description" content="Understand how Toolisiya uses cookies to improve your experience and serve non-personalized ads." />
      </Helmet>
      
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-center">Cookie Policy</h1>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
          We use minimal cookies. Here is exactly what we track and why.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6"><Cookie className="text-primary" /> What Are Cookies?</h2>
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-8 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Cookies are small text files that are placed on your computer or mobile device by your web browser when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6"><ShieldCheck className="text-primary" /> How We Use Cookies</h2>
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">1. Essential / Technical Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We use local storage (which acts similarly to cookies but stays on your device) to save your preferences, such as Dark Mode toggles, recently used tools, and custom layout settings. This data never leaves your browser and is strictly necessary to provide you with a customized tool experience.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">2. Analytical Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We use privacy-respecting analytics tools to measure traffic (e.g., seeing which tool is most popular so we can improve it). This data is aggregated and completely anonymized. We cannot identify you personally through our analytics.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">3. Advertising Cookies (Google AdSense)</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Toolisiya is ad-supported. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your web history.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-2 font-medium">
                    You can opt out of personalized advertising by visiting Google's <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-primary hover:underline">Ads Settings</a>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6"><Info className="text-primary" /> Managing Your Cookies</h2>
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-8 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use Toolisiya's tools, though some personal preferences (like Dark Mode) may not persist between visits.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
