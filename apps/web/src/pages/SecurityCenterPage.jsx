import React from 'react';
import { Helmet } from 'react-helmet';
import { ShieldAlert, Lock, Trash2, Globe, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SecurityCenterPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4">
      <Helmet>
        <title>Security Center | Toolisiya</title>
        <meta name="description" content="Learn how Toolisiya protects your data with browser-first processing, immediate file deletion, and enterprise-grade encryption." />
      </Helmet>
      
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-6">
            <ShieldAlert className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Security Center</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your data belongs to you. Here is exactly how we ensure your sensitive files and calculations remain completely private.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          
          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Globe className="text-primary w-6 h-6" />
                Browser-First Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              Most of our core tools (including PDF merging, image compression, and all calculators) process your data entirely within your browser. <strong>Your files never leave your device.</strong> Because no data is transmitted to our servers, there is zero risk of interception or server-side data breaches.
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Trash2 className="text-primary w-6 h-6" />
                Auto-Deletion Protocol
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              For tools that explicitly require server-side processing (such as highly complex OCR tasks or AI text generation), files are securely transmitted using TLS 1.3 encryption. Once the output is generated and downloaded, <strong>the original file and the result are permanently and automatically deleted from our servers within 1 hour.</strong>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Lock className="text-primary w-6 h-6" />
                No Data Mining
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              We do not scan, read, or mine the contents of your documents. Whether you are generating a legal contract or compressing family photos, the contents are inaccessible to Toolisiya staff and are never used to train machine learning models.
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Database className="text-primary w-6 h-6" />
                GDPR & CCPA Compliant
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              Toolisiya operates in strict adherence to global privacy laws, including the GDPR (Europe) and CCPA (California). We collect only the absolute minimum telemetry data required to maintain site health, and we use privacy-respecting, anonymized analytics.
            </CardContent>
          </Card>

        </div>
        
        <div className="bg-muted/30 border border-border rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Report a Vulnerability</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Security is a community effort. If you are a security researcher and have discovered a vulnerability on Toolisiya, please report it to us immediately.
          </p>
          <a href="mailto:security@toolisiya.com" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
            security@toolisiya.com
          </a>
        </div>
      </div>
    </div>
  );
}
