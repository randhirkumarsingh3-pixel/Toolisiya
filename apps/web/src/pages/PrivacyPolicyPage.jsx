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
              <h2 className="text-2xl font-semibold mb-4">4. Google AdSense & DoubleClick Cookies</h2>
              <p>
                Google, as a third-party vendor, uses cookies to serve advertisements on Toolisiya. Google's use of the DoubleClick cookie enables it and its partners to serve ads to our users based on their visits to Toolisiya and other websites on the Internet.
              </p>
              <p className="mt-2">
                We use third-party advertising companies to serve ads when you visit our website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
              </p>
              <p className="mt-2">
                <strong>How to Opt-Out:</strong> Users may opt out of personalized advertising. You can manage your Google ad settings or opt out of the DoubleClick cookie for interest-based advertising by visiting the <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Google Ads Settings</a> page. Alternatively, you can opt out of a third-party vendor's use of cookies for interest-based advertising by visiting <a href="https://aboutads.info" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">aboutads.info</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Third-Party Web Analytics & Advertising</h2>
              <p>
                Toolisiya works with third-party service providers, including Google AdSense, Google Analytics, and others, who use cookies, web beacons, and other tracking technologies to collect and analyze information about site usage, traffic patterns, and ad performance. 
              </p>
              <p className="mt-2">
                These third-party vendors and ad networks may place cookies on your browser when you visit our site. These cookies are subject to the respective privacy policies of those third-party providers. We encourage you to review their policies to understand their data processing practices and your options for managing cookies.
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