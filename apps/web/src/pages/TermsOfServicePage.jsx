import React from 'react';
import { Helmet } from 'react-helmet';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Terms of Service | Toolisiya</title>
        <meta name="description" content="Terms of Service and usage guidelines for Toolisiya." />
        <link rel="canonical" href="https://toolisiya.com/terms-of-service" />
      </Helmet>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <BreadcrumbNavigation customTitle="Terms of Service" />
          
          <div className="mt-8 prose prose-slate dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
            
            <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Toolisiya, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Description of Services</h2>
              <p>
                Toolisiya provides a web-based platform offering various online tools for productivity, document management, 
                image editing, and more. These services are provided free of charge, with potential premium features available 
                where applicable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
              <p>
                You agree to use our tools responsibly. You must not misuse the tools, upload illegal or harmful content, 
                or use the platform to violate any applicable local, state, national, or international laws. You must respect 
                the intellectual property rights of others.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
              <p>
                The platform, its original content, features, and functionality are owned by Toolisiya and are protected by 
                international copyright, trademark, patent, trade secret, and other intellectual property laws. You retain 
                full ownership of any files or data you upload or process using our tools.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
              <p>
                Our tools are provided on an "as-is" and "as available" basis. Toolisiya makes no guarantees regarding the 
                100% accuracy, reliability, or availability of the services. In no event shall Toolisiya be liable for any 
                indirect, incidental, special, consequential, or punitive damages, including loss of data, arising from your 
                use of the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. File Usage</h2>
              <p>
                Files uploaded to our servers for processing are stored temporarily and deleted automatically. Users are solely 
                responsible for their data. We strongly recommend keeping backups of your original files before processing them 
                through our tools.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Prohibited Uses</h2>
              <p>
                You are prohibited from using the site or its content for any unlawful purpose, to solicit others to perform 
                or participate in any unlawful acts, to violate any regulations, rules, or laws, or to upload malicious code, 
                viruses, or spam.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Modifications</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. We will notify users of significant changes. 
                Your continued use of the platform following the posting of any changes constitutes acceptance of those changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the applicable jurisdiction, 
                without regard to its conflict of law provisions.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}