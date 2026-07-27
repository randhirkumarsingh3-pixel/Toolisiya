import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SalaryBreakdownTable = ({ results }) => {
  const [view, setView] = useState('monthly');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  const renderTable = (multiplier) => (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="w-[60%] font-semibold">Component</TableHead>
          <TableHead className="text-right font-semibold">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Basic Salary</TableCell>
          <TableCell className="text-right">{formatCurrency(results.monthlyBasic * multiplier)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">House Rent Allowance (HRA)</TableCell>
          <TableCell className="text-right">{formatCurrency(results.monthlyHra * multiplier)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Special Allowance</TableCell>
          <TableCell className="text-right">{formatCurrency(results.monthlySpecialAllowance * multiplier)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Bonus / Variable</TableCell>
          <TableCell className="text-right">{formatCurrency(results.monthlyBonus * multiplier)}</TableCell>
        </TableRow>
        <TableRow className="bg-muted/20">
          <TableCell className="font-bold text-primary">Gross Salary</TableCell>
          <TableCell className="text-right font-bold text-primary">{formatCurrency(results.monthlyGross * multiplier)}</TableCell>
        </TableRow>
        
        <TableRow>
          <TableCell colSpan={2} className="h-4 p-0"></TableCell>
        </TableRow>
        
        <TableRow>
          <TableCell className="font-medium text-destructive">Employee PF</TableCell>
          <TableCell className="text-right text-destructive">-{formatCurrency(results.monthlyEmployeePf * multiplier)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium text-destructive">Professional Tax</TableCell>
          <TableCell className="text-right text-destructive">-{formatCurrency(results.monthlyPt * multiplier)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium text-destructive">Income Tax (TDS)</TableCell>
          <TableCell className="text-right text-destructive">-{formatCurrency(results.monthlyIt * multiplier)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium text-destructive">Other Deductions</TableCell>
          <TableCell className="text-right text-destructive">-{formatCurrency(results.monthlyOtherDeductions * multiplier)}</TableCell>
        </TableRow>
        <TableRow className="bg-destructive/10">
          <TableCell className="font-bold text-destructive">Total Deductions</TableCell>
          <TableCell className="text-right font-bold text-destructive">-{formatCurrency(results.monthlyDeductions * multiplier)}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell colSpan={2} className="h-4 p-0"></TableCell>
        </TableRow>

        <TableRow className="bg-primary/10 border-b-2 border-primary/20">
          <TableCell className="font-black text-lg">Net Take-Home Salary</TableCell>
          <TableCell className="text-right font-black text-lg">{formatCurrency(results.monthlyNet * multiplier)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  return (
    <Card className="shadow-md border-border">
      <CardHeader className="bg-muted/30 border-b pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Detailed Breakdown</CardTitle>
          <Tabs value={view} onValueChange={setView} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {view === 'monthly' ? renderTable(1) : renderTable(12)}
      </CardContent>
    </Card>
  );
};

export default SalaryBreakdownTable;