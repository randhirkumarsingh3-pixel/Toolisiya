import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Check, ArrowRightLeft, AlertCircle, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import SEOHead from '@/components/SEOHead.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useCurrencyRates } from '@/hooks/useCurrencyRates.js';
import ExtraToolTips from '@/components/ExtraToolTips.jsx';
import RelatedToolsSection from '@/components/RelatedToolsSection.jsx';
import ToolContentDisplay from '@/components/ToolContentDisplay.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const faqs = [
  { question: "How often are exchange rates updated?", answer: "Exchange rates are updated hourly to ensure accuracy while maintaining performance. The exact time of the last update is displayed directly below your conversion result." },
  { question: "Are there any hidden fees in these rates?", answer: "No, the rates displayed are mid-market exchange rates. However, please note that banks and money transfer services will typically apply their own margins or markup fees when you actually convert money." },
  { question: "Which currencies are supported?", answer: "Our free currency converter supports over 150 global currencies, including major pairs like USD to INR, EUR to USD, and GBP to INR." }
];

const CurrencyConverterPage = () => {
  const { rates, loading, error, lastUpdated } = useCurrencyRates();
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [result, setResult] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (rates && amount && !isNaN(amount)) {
      const baseInUSD = parseFloat(amount) / rates[fromCurrency];
      setResult(baseInUSD * rates[toCurrency]);
    } else {
      setResult(0);
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  const handleSwap = () => {
    const tempFrom = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempFrom);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`);
    setCopied(true);
    toast('Result copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SEOHead 
        pageName="tool_currency_converter" 
        defaultTitle="Currency Converter - Live Exchange Rates | Toolisiya"
        defaultDescription="Convert between 150+ global currencies with real-time, accurate mid-market exchange rates completely free. Check USD to INR, EUR to USD, and more."
        faqs={faqs}
        toolData={{
          name: "Currency Converter",
          description: "Free online currency converter with live hourly updated rates.",
          category: "FinanceApplication"
        }}
      />

      <div className="min-h-screen flex flex-col bg-background font-sans">
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-foreground transition-smooth">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/converters" className="hover:text-foreground transition-smooth">Converters</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium" aria-current="page">Currency Converter</span>
            </nav>

            <NavigationButtons />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
                Free Currency Converter Online
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-prose">
                Check live mid-market exchange rates and convert amounts across 150+ global currencies accurately and instantly.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Card className="mb-8 shadow-lg border-none">
                <CardHeader className="bg-muted/30 border-b pb-6">
                  <CardTitle>Convert Currency</CardTitle>
                  <CardDescription>Enter amount and select your base and target currencies.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {error && (
                    <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-end">
                    <div className="space-y-3">
                      <Label className="text-base">Amount & From</Label>
                      <div className="flex gap-2">
                        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-1/2 h-12 text-lg" />
                        <Select value={fromCurrency} onValueChange={setFromCurrency} disabled={loading}>
                          <SelectTrigger className="w-1/2 h-12 text-lg"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {rates && Object.keys(rates).map(currency => (
                              <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button variant="outline" size="icon" onClick={handleSwap} className="mb-1 h-12 w-12 rounded-full hidden md:flex shrink-0 border-primary/20 hover:bg-primary/10 transition-colors" disabled={loading}>
                      <ArrowRightLeft className="h-5 w-5 text-primary" />
                    </Button>

                    <div className="space-y-3">
                      <Label className="text-base">To Currency</Label>
                      <Select value={toCurrency} onValueChange={setToCurrency} disabled={loading}>
                        <SelectTrigger className="w-full h-12 text-lg"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {rates && Object.keys(rates).map(currency => (
                            <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-primary/10">
                    <div>
                      <div className="text-sm text-muted-foreground font-medium mb-2">{amount} {fromCurrency} is equivalent to</div>
                      <div className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                        {loading ? <span className="animate-pulse opacity-50">Calculating...</span> : `${result.toFixed(2)} ${toCurrency}`}
                      </div>
                      {lastUpdated && (
                        <div className="text-xs text-muted-foreground mt-4 flex items-center">
                          <Check className="h-3 w-3 mr-1 text-emerald-500" /> Live rates updated: {lastUpdated.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <Button variant="outline" onClick={handleCopy} disabled={loading} className="shrink-0 font-medium">
                      {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />} Copy Rate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <ExtraToolTips toolName="Currency Converter" />

            {/* Dynamic SEO Content Section using ToolContentDisplay */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <ToolContentDisplay toolName="Currency Converter" />
            </motion.div>

            <RelatedToolsSection currentCategory="Converters" currentPath="/finance/currency-converter" />
          </div>
        </main>
      </div>
    </>
  );
};

export default CurrencyConverterPage;