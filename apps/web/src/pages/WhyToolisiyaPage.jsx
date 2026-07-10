import React from 'react';
import { Helmet } from 'react-helmet';
import { ShieldCheck, Cpu, Code2, Rocket, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function WhyToolisiyaPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4">
      <Helmet>
        <title>Why Toolisiya? | The Philosophy Behind Our Tools</title>
        <meta name="description" content="Discover why Toolisiya exists, our commitment to browser-first processing, and our dedication to free, secure digital tools." />
      </Helmet>
      
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Why Toolisiya?
        </h1>
        <p className="text-xl text-muted-foreground mb-16 text-center max-w-3xl mx-auto leading-relaxed">
          The internet is full of "free" tools that suddenly demand a credit card after you've spent 10 minutes formatting a document. We got tired of it. So we built something better.
        </p>

        <div className="space-y-16">
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Cpu className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Browser-First Processing</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Traditional tools require you to upload your sensitive PDFs and images to a remote server for processing. This is a massive privacy risk. Toolisiya relies on modern WebAssembly and HTML5 APIs to process your files <strong>directly inside your browser</strong>. Your files never touch our servers.
              </p>
            </div>
            <Card className="bg-card border-border shadow-xl transform rotate-1 hover:rotate-0 transition-transform">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-emerald-500 font-medium">
                    <ShieldCheck className="w-5 h-5" /> 100% Local Execution
                  </div>
                  <div className="flex items-center gap-3 text-emerald-500 font-medium">
                    <ShieldCheck className="w-5 h-5" /> Zero Server Uploads
                  </div>
                  <div className="flex items-center gap-3 text-emerald-500 font-medium">
                    <ShieldCheck className="w-5 h-5" /> Instant Processing
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center md:flex-row-reverse">
            <Card className="bg-card border-border shadow-xl transform -rotate-1 hover:rotate-0 transition-transform order-2 md:order-1">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-blue-500 font-medium">
                    <Code2 className="w-5 h-5" /> No Hidden Subscriptions
                  </div>
                  <div className="flex items-center gap-3 text-blue-500 font-medium">
                    <Code2 className="w-5 h-5" /> No Watermarks
                  </div>
                  <div className="flex items-center gap-3 text-blue-500 font-medium">
                    <Code2 className="w-5 h-5" /> No Registration Required
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-6 order-1 md:order-2">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-3xl font-bold">No Hidden Paywalls</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                We believe basic digital utilities should be a public good. You shouldn't have to pay $15/month just to merge two PDFs or compress an image. Toolisiya is entirely ad-supported, meaning the core tools will remain <strong>free forever</strong>, without sudden paywalls or forced watermarks.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-purple-500" />
              </div>
              <h2 className="text-3xl font-bold">Built for Speed</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                We despise bloated websites that take 10 seconds to load a simple calculator. Toolisiya is built on a highly optimized React stack. Our tools load instantly, work offline via our PWA (Progressive Web App), and feel like native desktop software.
              </p>
            </div>
            <Card className="bg-card border-border shadow-xl transform rotate-1 hover:rotate-0 transition-transform">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-purple-500 font-medium">
                    <Rocket className="w-5 h-5" /> PWA Installable
                  </div>
                  <div className="flex items-center gap-3 text-purple-500 font-medium">
                    <Rocket className="w-5 h-5" /> Offline Capabilities
                  </div>
                  <div className="flex items-center gap-3 text-purple-500 font-medium">
                    <Rocket className="w-5 h-5" /> Minimal JavaScript Payload
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
