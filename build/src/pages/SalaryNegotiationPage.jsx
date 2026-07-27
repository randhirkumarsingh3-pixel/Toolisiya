import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronRight, IndianRupee, TrendingUp, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ToolContentDisplay from '@/components/ToolContentDisplay.jsx';
import { toolContent } from '@/data/toolContent.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SalaryNegotiationPage = () => {
  const contentData = toolContent['salary-negotiation'];
  const [currentCtc, setCurrentCtc] = useState('');
  const [expectedHike, setExpectedHike] = useState('30');
  const [target, setTarget] = useState(0);

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!currentCtc) {
      toast.error('Please enter current CTC');
      return;
    }
    const base = parseFloat(currentCtc);
    const hike = parseFloat(expectedHike) / 100;
    setTarget(base + (base * hike));
  };

  return (
    <>
      <Helmet>
        <title>{contentData.title} | Toolisiya</title>
        <meta name="description" content={contentData.introduction.substring(0, 150)} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-foreground transition-smooth">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/career" className="hover:text-foreground transition-smooth">Career</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium" aria-current="page">Salary Negotiation</span>
            </nav>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
                Salary Negotiation Guide
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-prose">
                Don't leave money on the table. Learn how to research market rates and negotiate your worth confidently in the Indian market.
              </p>
            </motion.div>

            {/* Interactive Shell */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-16">
              <Card className="shadow-lg border-none">
                <CardHeader className="bg-muted/30 border-b pb-6">
                  <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5 text-primary" /> Target Salary Calculator</CardTitle>
                  <CardDescription>Determine your target negotiation baseline</CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current CTC (Lakhs per annum)</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="number" step="0.1" value={currentCtc} onChange={(e) => setCurrentCtc(e.target.value)} placeholder="e.g. 8.5" className="pl-9" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Expected Minimum Hike (%)</label>
                      <div className="relative">
                        <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="number" value={expectedHike} onChange={(e) => setExpectedHike(e.target.value)} placeholder="30" className="pl-9" />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Button type="submit" className="w-full">Calculate Negotiation Baseline</Button>
                    </div>
                  </form>

                  {target > 0 && (
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl p-6 text-center">
                      <p className="text-emerald-800 dark:text-emerald-300 font-medium mb-1">Your Baseline Target Offer</p>
                      <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">₹{target.toFixed(2)} LPA</div>
                      <p className="text-sm text-emerald-700/80 dark:text-emerald-400/80 mt-2">Always quote 10-15% higher than this baseline during initial HR rounds to leave room for negotiation.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Dynamic SEO Content Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <ToolContentDisplay content={contentData} />
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SalaryNegotiationPage;