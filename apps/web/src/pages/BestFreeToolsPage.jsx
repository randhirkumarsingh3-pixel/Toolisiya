import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Calculator, FileText } from 'lucide-react';

const BestFreeToolsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Helmet>
        <title>Free Online Tools & Calculators - Toolisiya | 50+ Tools in One Place</title>
        <meta name="description" content="Discover the best free online tools website. From top productivity tools to must-have online calculators, access everything you need in one place." />
        <meta name="keywords" content="best free online tools website, top productivity tools, must have online calculators, toolisiya best tools" />
      </Helmet>
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <BreadcrumbNavigation customTitle="Best Free Online Tools" />
        
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">The Best Free Online Tools & Calculators in One Place</h1>
        <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
          Welcome to your ultimate guide on finding the best free online tools website. Whether you need top productivity tools or must-have online calculators, Toolisiya brings 50+ professional utilities to your fingertips without subscriptions or installations.
        </p>

        <div className="space-y-16">
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Calculator className="h-8 w-8 text-primary" /> Must-Have Online Calculators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/finance/gst-calculator">
                <Card className="hover:shadow-soft transition-smooth group cursor-pointer h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold group-hover:text-primary mb-2">GST Calculator</h3>
                    <p className="text-muted-foreground">Instantly calculate inclusive or exclusive GST values.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/finance/emi-calculator">
                <Card className="hover:shadow-soft transition-smooth group cursor-pointer h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold group-hover:text-primary mb-2">EMI Calculator</h3>
                    <p className="text-muted-foreground">Plan your home or auto loans with our accurate EMI tool.</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" /> Top Productivity Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/productivity/smart-todo-list">
                <Card className="hover:shadow-soft transition-smooth group cursor-pointer h-full border-l-4 border-l-emerald-500">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold group-hover:text-emerald-600 mb-2">Smart To-Do List</h3>
                    <p className="text-muted-foreground">Organize your daily tasks beautifully and track your progress.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/career/resume-builder">
                <Card className="hover:shadow-soft transition-smooth group cursor-pointer h-full border-l-4 border-l-emerald-500">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold group-hover:text-emerald-600 mb-2">Free Resume Builder</h3>
                    <p className="text-muted-foreground">Create ATS-friendly professional resumes in minutes.</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <FileText className="h-8 w-8 text-orange-500" /> Document & Media Utilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Link to="/document/pdf-merger"><Card className="h-full hover:shadow-soft"><CardContent className="p-6 font-semibold hover:text-primary">PDF Merger</CardContent></Card></Link>
               <Link to="/image/image-compressor"><Card className="h-full hover:shadow-soft"><CardContent className="p-6 font-semibold hover:text-primary">Image Compressor</CardContent></Card></Link>
               <Link to="/document/word-counter"><Card className="h-full hover:shadow-soft"><CardContent className="p-6 font-semibold hover:text-primary">Word Counter</CardContent></Card></Link>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
};

export default BestFreeToolsPage;