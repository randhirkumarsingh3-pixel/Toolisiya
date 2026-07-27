import React from 'react';
import { Helmet } from 'react-helmet';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import { CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>About Us | Toolisiya</title>
        <meta name="description" content="Learn about Toolisiya, your all-in-one platform for free online productivity tools." />
      </Helmet>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <BreadcrumbNavigation customTitle="About Us" />
          
          <div className="mt-8">
            <h1 className="text-4xl font-bold tracking-tight mb-6">About Toolisiya</h1>
            
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">What Toolisiya Is</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Toolisiya is a comprehensive platform offering a wide array of free online tools for productivity, 
                  document management, image editing, financial calculations, and more. Our tools are entirely web-based, 
                  meaning there is no installation required—just open your browser and get things done.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our mission is to provide simple, fast, and reliable tools for students, developers, and professionals. 
                  We aim to empower users with accessible technology that simplifies complex tasks and enhances daily productivity.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
                  {[
                    "No installation required",
                    "Mobile-friendly PWA support",
                    "Fast and secure processing",
                    "Easy-to-use interface",
                    "100% free and accessible",
                    "Privacy-focused local processing"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Value Proposition</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Toolisiya saves you time and improves your productivity by bringing essential utilities into one place. 
                  Access our tools anytime, anywhere, from any device. No technical knowledge is required to use our intuitive interfaces.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We envision Toolisiya becoming the most trusted all-in-one utility platform on the web. 
                  Through continuous improvement and innovation, we are constantly adding new tools and refining existing ones 
                  to meet the evolving needs of our users.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}