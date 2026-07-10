import React from 'react';
import { Helmet } from 'react-helmet';
import { FileWarning, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4">
      <Helmet>
        <title>Legal Disclaimer | Toolisiya</title>
        <meta name="description" content="Legal and professional disclaimers regarding the use of Toolisiya's free online tools." />
      </Helmet>
      
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-center">Legal Disclaimer</h1>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
          Please read this disclaimer carefully before using Toolisiya's tools and calculators.
        </p>

        <div className="space-y-8">
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-8 space-y-6">
              
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-4"><FileWarning className="text-amber-500" /> Not Professional Advice</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The calculators, tools, and educational content provided on Toolisiya (including but not limited to the GST Calculator, Salary Calculator, Loan EMI Calculator, and Invoice Generator) are designed for informational and educational purposes only. They do not constitute professional financial, legal, or tax advice. While we strive to keep our formulas and rules completely accurate, you should always consult with a certified professional (such as a CPA, Chartered Accountant, or legal counsel) before making business or financial decisions based on our tools.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-4"><FileText className="text-primary" /> "As Is" Basis</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All tools on this platform are provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied. Toolisiya explicitly disclaims any warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not guarantee that the tools will be completely uninterrupted, error-free, or fully secure against unforeseen browser-level vulnerabilities.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Under no circumstances shall Toolisiya, its founders, developers, or affiliates be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to or use of the platform. This includes, but is not limited to, data loss, loss of profits, or business interruption resulting from the use of our file converters, PDF editors, or financial calculators.
                </p>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
