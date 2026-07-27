import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, Banknote, Briefcase } from 'lucide-react';
import StickyNavigation from '@/components/StickyNavigation.jsx';

const IndiaToolsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Helmet>
        <title>Free Online Tools India - GST, EMI, Salary Calculator | Toolisiya</title>
        <meta name="description" content="Access free online tools tailored for India. Use our accurate GST calculator India online, EMI calculator for Indian banks, and precise in-hand salary estimators." />
        <meta name="keywords" content="free online tools India, GST calculator India online, EMI calculator India banks, salary calculator india" />
      </Helmet>
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <StickyNavigation />
        <BreadcrumbNavigation customTitle="Tools For India" />
        
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Free Online Tools for Indian Professionals</h1>
        <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
          From precise tax computations to loan estimations, Toolisiya provides reliable, free online tools for India. Whether you are filing taxes or planning a home loan, our calculators are updated with Indian financial standards.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link to="/finance/gst-calculator" className="h-full">
            <Card className="h-full hover:shadow-soft transition-smooth group cursor-pointer border-t-4 border-t-orange-500">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold group-hover:text-primary mb-2">GST Calculator India</h3>
                <p className="text-muted-foreground">
                  The best GST calculator India online. Split amounts into CGST and SGST/IGST instantly for your invoices.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/finance/emi-calculator" className="h-full">
            <Card className="h-full hover:shadow-soft transition-smooth group cursor-pointer border-t-4 border-t-emerald-500">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                  <Banknote className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold group-hover:text-primary mb-2">EMI Calculator (Indian Banks)</h3>
                <p className="text-muted-foreground">
                  Accurate EMI calculator India banks rely on. Check your monthly schedule for home, auto, or personal loans.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/finance/salary-calculator" className="h-full">
            <Card className="h-full hover:shadow-soft transition-smooth group cursor-pointer border-t-4 border-t-blue-500">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold group-hover:text-primary mb-2">In-Hand Salary Calculator</h3>
                <p className="text-muted-foreground">
                  Break down your CTC. Deduct PF, PT, and compute your precise take-home salary.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

      </main>
    </div>
  );
};

export default IndiaToolsPage;