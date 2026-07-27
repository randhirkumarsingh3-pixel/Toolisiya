import React from 'react';
import { Helmet } from 'react-helmet';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import { Mail, MessageSquare, Bug, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function ContactUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Contact Us | Toolisiya</title>
        <meta name="description" content="Get in touch with the Toolisiya team for support, feedback, or business inquiries." />
      </Helmet>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <BreadcrumbNavigation customTitle="Contact Us" />
          
          <div className="mt-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground mb-8">
              We're here to help. Whether you have a question about a tool, want to report a bug, or are interested in a partnership, we'd love to hear from you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="border-border shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Email Us</h3>
                  <p className="text-muted-foreground">
                    For all general inquiries, support, and feedback, please email us directly.
                  </p>
                  <a 
                    href="mailto:admin@toolisiya.com" 
                    className="text-primary font-medium hover:underline text-lg"
                  >
                    admin@toolisiya.com
                  </a>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">What we can help with:</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Bug className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <strong className="block text-foreground">Tool Issues & Bugs</strong>
                      <span className="text-muted-foreground text-sm">Report any errors or unexpected behavior in our tools.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <strong className="block text-foreground">Feedback & Suggestions</strong>
                      <span className="text-muted-foreground text-sm">Have an idea for a new tool or feature? Let us know!</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <strong className="block text-foreground">Business Inquiries</strong>
                      <span className="text-muted-foreground text-sm">For partnerships, advertising, or other business opportunities.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-muted/30 rounded-2xl p-6 text-center border border-border">
              <h3 className="text-lg font-semibold mb-2">Response Time</h3>
              <p className="text-muted-foreground">
                We aim to respond to all inquiries within <strong className="text-foreground">24–48 hours</strong> during regular business days.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}