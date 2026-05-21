import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, TrendingDown, Landmark, PiggyBank } from 'lucide-react';

const SalaryBreakdownCards = ({ results }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-primary text-primary-foreground shadow-lg border-none overflow-hidden relative">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
          <Wallet className="w-32 h-32" />
        </div>
        <CardContent className="p-6 relative z-10">
          <p className="text-primary-foreground/80 font-medium mb-1 uppercase tracking-wider text-sm">Monthly In-Hand Salary</p>
          <h3 className="text-4xl font-black tracking-tight mb-4">{formatCurrency(results.monthlyNet)}</h3>
          <div className="flex items-center gap-2 text-sm bg-primary-foreground/10 w-fit px-3 py-1.5 rounded-full">
            <Landmark className="w-4 h-4" />
            <span>Gross: {formatCurrency(results.monthlyGross)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-md border-border overflow-hidden relative">
        <div className="absolute right-0 top-0 opacity-5 transform translate-x-4 -translate-y-4">
          <PiggyBank className="w-32 h-32 text-foreground" />
        </div>
        <CardContent className="p-6 relative z-10">
          <p className="text-muted-foreground font-medium mb-1 uppercase tracking-wider text-sm">Annual In-Hand Salary</p>
          <h3 className="text-3xl font-bold tracking-tight mb-4 text-foreground">{formatCurrency(results.annualNet)}</h3>
          <div className="flex items-center gap-2 text-sm bg-muted w-fit px-3 py-1.5 rounded-full text-muted-foreground">
            <TrendingDown className="w-4 h-4 text-destructive" />
            <span>Total Deductions: {formatCurrency(results.annualDeductions)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalaryBreakdownCards;