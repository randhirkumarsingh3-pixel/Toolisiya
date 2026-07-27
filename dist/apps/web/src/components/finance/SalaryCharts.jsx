import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SalaryCharts = ({ results }) => {
  const [view, setView] = useState('monthly');
  const multiplier = view === 'monthly' ? 1 : 12;

  const componentData = [
    { name: 'Basic', value: results.monthlyBasic * multiplier, color: 'hsl(180, 100%, 25%)' },
    { name: 'HRA', value: results.monthlyHra * multiplier, color: 'hsl(180, 70%, 40%)' },
    { name: 'Special Allowance', value: results.monthlySpecialAllowance * multiplier, color: 'hsl(180, 50%, 60%)' },
    { name: 'Bonus', value: results.monthlyBonus * multiplier, color: 'hsl(180, 30%, 80%)' },
    { name: 'Gratuity', value: results.monthlyGratuity * multiplier, color: 'hsl(210, 40%, 90%)' }
  ].filter(item => item.value > 0);

  const deductionData = [
    { name: 'Employee PF', value: results.monthlyEmployeePf * multiplier, color: 'hsl(0, 84%, 60%)' },
    { name: 'Prof. Tax', value: results.monthlyPt * multiplier, color: 'hsl(0, 60%, 50%)' },
    { name: 'Income Tax', value: results.monthlyIt * multiplier, color: 'hsl(0, 40%, 40%)' },
    { name: 'Other', value: results.monthlyOtherDeductions * multiplier, color: 'hsl(0, 20%, 30%)' }
  ].filter(item => item.value > 0);

  const formatTooltip = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <Card className="shadow-md border-border">
      <CardHeader className="bg-muted/30 border-b pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Visual Breakdown</CardTitle>
        <Tabs value={view} onValueChange={setView} className="w-[200px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-[300px] flex flex-col items-center">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Salary Components</h4>
            {componentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={componentData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                    {componentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatTooltip} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">No data to display</div>
            )}
          </div>

          <div className="h-[300px] flex flex-col items-center">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Deductions</h4>
            {deductionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deductionData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                    {deductionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatTooltip} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">No deductions</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalaryCharts;