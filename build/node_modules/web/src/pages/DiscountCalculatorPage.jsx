import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const DiscountCalculatorPage = () => {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [savings, setSavings] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (originalPrice && discountPercent && !isNaN(originalPrice) && !isNaN(discountPercent)) {
      const price = parseFloat(originalPrice);
      const discount = parseFloat(discountPercent);
      const calculatedDiscount = (price * discount) / 100;
      const final = price - calculatedDiscount;
      
      setDiscountAmount(calculatedDiscount);
      setFinalPrice(final);
      setSavings(calculatedDiscount);
    } else {
      setDiscountAmount(0);
      setFinalPrice(0);
      setSavings(0);
    }
  }, [originalPrice, discountPercent]);

  const handleCopy = () => {
    const result = `Original Price: ₹${originalPrice || 0}\nDiscount (${discountPercent}%): ₹${discountAmount.toFixed(2)}\nFinal Price: ₹${finalPrice.toFixed(2)}\nYou Save: ₹${savings.toFixed(2)}`;
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast('Result copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPageTemplate toolData={toolPageData['discount-calculator']}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-7">
          <Card className="shadow-lg border-border">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle>Calculate discount</CardTitle>
              <CardDescription>Enter original price and discount percentage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Original price</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g. 1000"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="h-12 text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    placeholder="e.g. 20"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="h-12 text-lg"
                  />
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-6 space-y-4 border border-border/50">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Original price</span>
                  <span className="text-xl font-semibold">₹{originalPrice || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Discount ({discountPercent || 0}%)</span>
                  <span className="text-xl font-semibold text-destructive">-₹{discountAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="text-lg font-medium">Final price</span>
                  <span className="text-3xl font-bold text-primary">₹{finalPrice.toFixed(2)}</span>
                </div>
                <div className="bg-primary/10 rounded-lg p-3 text-center border border-primary/20">
                  <span className="text-sm text-muted-foreground">You save </span>
                  <span className="text-lg font-bold text-primary">₹{savings.toFixed(2)}</span>
                </div>
              </div>

              <Button onClick={handleCopy} className="w-full h-11 transition-smooth active:scale-[0.98]">
                {copied ? <><Check className="mr-2 h-4 w-4" /> Copied</> : <><Copy className="mr-2 h-4 w-4" /> Copy result</>}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-sm border-border bg-card">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg">Formula</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-3">
                <p className="text-muted-foreground">Amount = (Price × Discount %) / 100</p>
                <p className="text-muted-foreground">Final = Price - Amount</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border bg-card">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg">Example calculation</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm">If an item costs ₹2,500 with a 25% discount:</p>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <p>Original Price: ₹2,500</p>
                <p>Discount (25%): ₹625</p>
                <p className="font-semibold pt-2 border-t">Final Price: ₹1,875</p>
                <p className="text-primary font-medium">You Save: ₹625</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default DiscountCalculatorPage;