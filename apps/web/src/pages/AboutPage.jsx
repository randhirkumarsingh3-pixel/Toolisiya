import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import { CheckCircle2, Target, Heart, Users, Lightbulb, Globe, ShieldCheck, Mail } from 'lucide-react';

const TEAM = [
  {
    name: 'Randhir Kumar',
    role: 'Founder & Lead Developer',
    bio: 'Full-stack developer with a passion for building tools that make everyday digital tasks faster and more accessible. Randhir built Toolisiya after spending years searching for simple, privacy-respecting utilities that worked directly in the browser without requiring software installations or subscriptions.',
    initial: 'R',
  }
];

const STATS = [
  { value: '80+', label: 'Free Tools' },
  { value: '100%', label: 'Free, Always' },
  { value: '0', label: 'Installations Required' },
  { value: '100%', label: 'Privacy First' },
];

const VALUES = [
  { icon: Heart, title: 'Built for Everyone', text: 'We believe powerful digital tools should not cost money or require a computer science degree. Every tool is designed to be intuitive enough for a first-time user and efficient enough for a professional.' },
  { icon: ShieldCheck, title: 'Privacy is Non-Negotiable', text: 'Most of our tools run entirely inside your browser using client-side JavaScript. Your files, calculations, and documents never leave your device. For server-assisted tools, files are permanently deleted immediately after processing.' },
  { icon: Lightbulb, title: 'Constant Improvement', text: 'Toolisiya is not a static project. We actively monitor user feedback, add new tools, and improve existing ones every week. Our changelog reflects a genuine commitment to making the platform better for real people with real needs.' },
  { icon: Globe, title: 'Accessible Everywhere', text: 'As a Progressive Web App (PWA), Toolisiya works on any device — desktop, tablet, or smartphone — and can even be used offline once installed. No app store, no waiting, no platform lock-in.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>About Us — The Team Behind Toolisiya | Free Online Tools</title>
        <meta name="description" content="Learn about Toolisiya, who built it, why it exists, and how it helps millions of students, professionals, and developers get things done faster for free." />
        <link rel="canonical" href="https://toolisiya.com/about" />
      </Helmet>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <BreadcrumbNavigation customTitle="About Us" />

          <div className="mt-10 space-y-16">

            {/* Hero */}
            <section className="text-center py-8">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-foreground">
                About Toolisiya
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                We're building the internet's most accessible, privacy-first collection of free online tools — so you can get more done without paying for software, creating accounts, or waiting for downloads.
              </p>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center p-6 rounded-2xl border border-border bg-card shadow-sm">
                  <div className="text-3xl md:text-4xl font-black text-primary mb-2">{value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{label}</div>
                </div>
              ))}
            </section>

            {/* Story */}
            <section className="prose prose-slate dark:prose-invert max-w-none space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Our Story</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Toolisiya was founded in 2024 by Randhir Kumar, a developer who was frustrated by the same problem every day: needing a simple tool — to compress a PDF, generate an invoice, convert an image, or check a calculation — and finding only paid apps, registration walls, or websites filled with ads that barely worked.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The idea was straightforward: build every essential utility that a student, freelancer, or professional might need, make it fast, make it private, and make it completely free. No subscriptions. No account requirements. No file size limits that require "upgrading to Pro". Just open the tool, use it, and move on with your day.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                What started as a handful of PDF tools has grown into a platform of over 80 tools covering document management, image processing, financial calculations, developer utilities, QR code generation, OCR scanning, and more. Each tool is built with the same philosophy: it must be genuinely useful, must work directly in the browser where possible, and must respect the user's privacy.
              </p>
            </section>

            {/* Mission */}
            <section className="bg-primary/5 border border-primary/20 rounded-3xl p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                To democratize access to digital productivity tools. We believe that the ability to edit a document, compress an image, calculate a tax, or scan a contract should not require a paid subscription, a Windows license, or a computer science degree.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our mission is simple: if someone needs a tool to get something done, they should be able to find it on Toolisiya — for free, instantly, and without any barriers to entry. We serve students in rural areas with limited budgets, freelancers working across time zones, small business owners managing their own invoicing, and developers who just need a quick JSON formatter or UUID generator without leaving their workflow.
              </p>
            </section>

            {/* Values */}
            <section>
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-8">What We Stand For</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {VALUES.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="p-6 rounded-2xl border border-border bg-card shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg text-foreground">{title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Team */}
            <section>
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-8">The Team</h2>
              {TEAM.map(({ name, role, bio, initial }) => (
                <div key={name} className="flex flex-col sm:flex-row gap-6 p-8 rounded-2xl border border-border bg-card shadow-sm">
                  <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-white text-3xl font-black shrink-0">
                    {initial}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
                    <p className="text-primary font-semibold text-sm mb-4">{role}</p>
                    <p className="text-muted-foreground leading-relaxed">{bio}</p>
                  </div>
                </div>
              ))}
              <p className="text-muted-foreground mt-6 leading-relaxed">
                Toolisiya is an independent, bootstrapped product built and maintained by a small, dedicated team. We are not backed by venture capital. We are not optimizing for growth metrics. We are building a tool platform that we ourselves would want to use every day — and we think that shows in the quality of what we've built.
              </p>
            </section>

            {/* Approach to Tools */}
            <section className="prose prose-slate dark:prose-invert max-w-none space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">How We Build Tools</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every tool we add to Toolisiya goes through a deliberate evaluation process. We ask: Does this tool solve a real problem? Is the user experience genuinely intuitive? Can we process the data locally in the browser to protect user privacy? What would make this tool better than every alternative already available on the internet?
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                For PDF tools, we use PDF.js and pdf-lib to render and manipulate documents entirely in your browser. For image tools, we use the Canvas API. For OCR, we use Tesseract.js, an open-source OCR engine that runs completely client-side. Where server-side processing is genuinely necessary (like format conversions that require system-level libraries), we use isolated processing and immediate deletion policies.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We take tool quality seriously. When users report bugs, we fix them — usually within 24 hours. When a tool has a confusing interface, we redesign it. We are not building a tool graveyard of half-finished features; we are building a platform where every tool works exactly as advertised.
              </p>
            </section>

            {/* Contact */}
            <section className="border border-border rounded-3xl p-8 text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Get In Touch</h2>
              <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Have a question, found a bug, or want to suggest a new tool? We personally read every message and respond within 24 to 48 hours.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
                <a href="mailto:support@toolisiya.com" className="flex items-center gap-2 text-primary font-semibold hover:underline">
                  <Mail className="w-5 h-5" /> support@toolisiya.com
                </a>
                <Link to="/contact-us" className="text-primary font-semibold hover:underline">
                  Contact Form →
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">Based in India · Available worldwide</p>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}