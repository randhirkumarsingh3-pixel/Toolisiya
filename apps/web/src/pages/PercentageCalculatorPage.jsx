import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronRight, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSEOData } from '@/hooks/useSEOData.js';

const PercentageCalculatorPage = () => {
  const { seoData } = useSEOData('percentage-calculator');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const [number, setNumber] = useState('');
  const [percentage, setPercentage] = useState('');
  const [percentageOf, setPercentageOf] = useState(0);
  const [percentageIncrease, setPercentageIncrease] = useState(0);
  const [percentageDecrease, setPercentageDecrease] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (number && percentage && !isNaN(number) && !isNaN(percentage)) {
      const num = parseFloat(number);
      const percent = parseFloat(percentage);
      
      const result = (num * percent) / 100;
      const increase = num + result;
      const decrease = num - result;
      
      setPercentageOf(result);
      setPercentageIncrease(increase);
      setPercentageDecrease(decrease);
    } else {
      setPercentageOf(0);
      setPercentageIncrease(0);
      setPercentageDecrease(0);
    }
  }, [number, percentage]);

  const handleCopy = () => {
    const result = `${percentage}% of ${number} = ${percentageOf.toFixed(2)}\n${percentage}% increase = ${percentageIncrease.toFixed(2)}\n${percentage}% decrease = ${percentageDecrease.toFixed(2)}`;
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast('Result copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: 'How do you calculate a percentage of a number?',
      answer: 'To find a percentage of a number, multiply the number by the percentage and divide by 100. For example, 20% of 500 is (500 × 20) / 100 = 100.',
    },
    {
      question: 'What is percentage increase?',
      answer: 'Percentage increase adds the calculated percentage to the original number. If you increase 100 by 20%, you add 20 to get 120.',
    },
    {
      question: 'What is percentage decrease?',
      answer: 'Percentage decrease subtracts the calculated percentage from the original number. If you decrease 100 by 20%, you subtract 20 to get 80.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{seoData?.meta_title || 'Percentage Calculator - Calculate percentages instantly | Toolisiya'}</title>
        {seoData?.meta_description && <meta name="description" content={seoData.meta_description} />}
        {seoData?.meta_keywords && <meta name="keywords" content={seoData.meta_keywords} />}
        {seoData?.og_title && <meta property="og:title" content={seoData.og_title} />}
        {seoData?.og_description && <meta property="og:description" content={seoData.og_description} />}
        {seoData?.og_image && <meta property="og:image" content={seoData.og_image} />}
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        {seoData?.structured_data && (
          <script type="application/ld+json">
            {typeof seoData.structured_data === 'string' ? seoData.structured_data : JSON.stringify(seoData.structured_data)}
          </script>
        )}
      </Helmet>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8 mt-4">
            <Link to="/" className="hover:text-foreground transition-smooth">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/finance" className="hover:text-foreground transition-smooth">Finance</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Percentage Calculator</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
              {seoData?.h1_tag || 'Percentage calculator'}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-prose">
              Calculate percentages, percentage increases, and decreases instantly. Perfect for discounts, tips, and financial calculations.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card className="mb-8 border-border shadow-md">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <CardTitle>Calculate percentage</CardTitle>
                <CardDescription>Enter a number and percentage value</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="number">Number</Label>
                    <Input id="number" type="number" placeholder="Enter number" value={number} onChange={(e) => setNumber(e.target.value)} className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="percentage">Percentage (%)</Label>
                    <Input id="percentage" type="number" placeholder="Enter percentage" value={percentage} onChange={(e) => setPercentage(e.target.value)} className="h-12" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 shadow-sm">
                    <div className="text-sm text-muted-foreground mb-2">{percentage || 0}% of {number || 0}</div>
                    <div className="text-4xl font-bold text-primary">{percentageOf.toFixed(2)}</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-xl p-5 border shadow-sm">
                      <div className="text-sm text-muted-foreground mb-2">{percentage || 0}% increase</div>
                      <div className="text-2xl font-bold text-emerald-600">{percentageIncrease.toFixed(2)}</div>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-5 border shadow-sm">
                      <div className="text-sm text-muted-foreground mb-2">{percentage || 0}% decrease</div>
                      <div className="text-2xl font-bold text-destructive">{percentageDecrease.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                <Button onClick={handleCopy} className="w-full h-11 font-semibold">
                  {copied ? <><Check className="mr-2 h-4 w-4" /> Copied</> : <><Copy className="mr-2 h-4 w-4" /> Copy result</>}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="mb-8 shadow-sm">
              <CardHeader><CardTitle>Formula</CardTitle></CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 font-mono text-sm space-y-2">
                  <p>Percentage = (Number × Percentage) / 100</p>
                  <p>Increase = Number + Percentage</p>
                  <p>Decrease = Number - Percentage</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card className="mb-8 shadow-sm">
              <CardHeader><CardTitle>Example calculation</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">Calculate 15% of 200:</p>
                <div className="bg-muted rounded-lg p-4 space-y-2 text-sm font-medium">
                  <p>15% of 200 = 30</p>
                  <p className="text-emerald-600">15% increase = 230</p>
                  <p className="text-destructive">15% decrease = 170</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card className="shadow-sm">
              <CardHeader><CardTitle>Frequently asked questions</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-semibold">{faq.question}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default PercentageCalculatorPage;