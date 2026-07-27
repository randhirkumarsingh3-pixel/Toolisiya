import React from 'react';
import { Helmet } from 'react-helmet';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Privacy Policy | Toolisiya</title>
        <meta name="description" content="Privacy Policy for Toolisiya. Learn how we handle your data, files, and privacy." />
      </Helmet>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <BreadcrumbNavigation customTitle="Privacy Policy" />
          
          <div className="mt-8 prose prose-slate dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
            
            <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                Welcome to Toolisiya. We are committed to protecting your personal information and your right to privacy. 
                This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and tools.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Data Collection</h2>
              <p>
                We collect minimal personal data. When you use our tools, any files you upload are processed temporarily 
                in your browser or on our secure servers and are not permanently stored. We may collect anonymous usage 
                data and analytics to improve our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. File Handling</h2>
              <p>
                Your files are processed securely. For most tools, processing happens entirely within your web browser, 
                meaning your files never leave your device. For tools requiring server-side processing, files are deleted 
                immediately after processing. We do not share your files with unauthorized third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Cookies & Tracking</h2>
              <p>
                We use cookies to enhance functionality and analyze site usage. This includes Google AdSense DoubleClick 
                cookies to serve relevant ads based on your prior visits to our website or other websites. You can opt out 
                of personalized advertising by visiting Google's Ads Settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
              <p>
                We may use third-party services such as Google AdSense and analytics providers. These third parties have 
                their own privacy policies addressing how they use such information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
              <p>
                We implement reasonable security measures to protect your information. We use encryption practices to 
                safeguard data transmission and ensure a secure browsing experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. User Rights</h2>
              <p>
                You have the right to control your data. If you have created an account, you can request the deletion 
                of your account and associated data at any time by contacting us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Children's Information</h2>
              <p>
                Our services are not intended for users under the age of 13. We do not knowingly collect personal 
                information from children under 13, in compliance with COPPA.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Consent</h2>
              <p>
                By using Toolisiya, you hereby consent to our Privacy Policy and agree to its terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Updates</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify users of any significant changes 
                by posting the new Privacy Policy on this page.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}