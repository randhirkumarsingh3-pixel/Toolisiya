import React from 'react';
import { Link } from 'react-router-dom';
import { FileBadge, Receipt, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext.jsx';

const UserAccountToolsSection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 opacity-10 pointer-events-none">
        <svg width="404" height="384" fill="none" viewBox="0 0 404 384"><defs><pattern id="d3eb07ae-5182-43e6-857d-35c643af9034" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="4" height="4" fill="currentColor"></rect></pattern></defs><rect width="404" height="384" fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)"></rect></svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="mb-4 text-primary-foreground">Save Your Work & Access Anytime</h2>
          <p className="text-primary-foreground/80 text-lg">Create, manage, and securely store your professional documents with our premium integrated tools.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Resume Builder Card */}
          <Card className="bg-white/10 border-white/20 text-primary-foreground backdrop-blur-sm shadow-xl">
            <CardContent className="p-8 lg:p-10">
              <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <FileBadge className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Professional Resume Builder</h3>
              <p className="text-primary-foreground/80 mb-8 leading-relaxed">
                Craft ATS-friendly resumes in minutes. Export to PDF and store securely in your account to update whenever your career evolves.
              </p>
              <ul className="space-y-4 mb-8">
                {['Multiple professional templates', 'Auto-save progress to cloud', 'One-click PDF export'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-primary-foreground/90">
                    <CheckCircle className="h-5 w-5 shrink-0 text-accent mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/resume-builder">
                <Button className="w-full bg-white text-primary hover:bg-white/90 text-base h-12 font-bold shadow-soft">
                  Build Resume
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Invoice Generator Card */}
          <Card className="bg-white/10 border-white/20 text-primary-foreground backdrop-blur-sm shadow-xl">
            <CardContent className="p-8 lg:p-10">
              <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <Receipt className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Smart Invoice Generator</h3>
              <p className="text-primary-foreground/80 mb-8 leading-relaxed">
                Generate branded invoices for your clients. Manage client details, track past invoices, and automatically calculate taxes.
              </p>
              <ul className="space-y-4 mb-8">
                {['Custom branding and logo', 'Built-in tax & discount logic', 'Client database management'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-primary-foreground/90">
                    <CheckCircle className="h-5 w-5 shrink-0 text-accent mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/invoice-generator">
                <Button className="w-full bg-white text-primary hover:bg-white/90 text-base h-12 font-bold shadow-soft">
                  Create Invoice
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {!isAuthenticated && (
          <div className="text-center">
            <Link to="/signup">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-10 h-14 shadow-lg hover:shadow-xl transition-all">
                Login to Access & Save Your Work <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/70">100% free. No credit card required.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserAccountToolsSection;