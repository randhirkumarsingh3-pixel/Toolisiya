import React from 'react';
import { IndianRupee, RefreshCw, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const SalaryCalculatorUI = ({ inputs, setInputs, resetInputs }) => {
  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const applyTemplate = (template) => {
    setInputs(prev => ({ ...prev, ...template }));
  };

  const templates = {
    standard: { basicPercent: 40, hraPercent: 15, specialAllowancePercent: 10, bonusPercent: 10, employerPfPercent: 12 },
    manufacturing: { basicPercent: 50, hraPercent: 10, specialAllowancePercent: 15, bonusPercent: 5, employerPfPercent: 12 },
    startup: { basicPercent: 35, hraPercent: 20, specialAllowancePercent: 20, bonusPercent: 15, employerPfPercent: 12 }
  };

  const LabelWithTooltip = ({ label, tooltip }) => (
    <div className="flex items-center gap-2">
      <Label className="text-sm font-semibold">{label}</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger type="button" tabIndex={-1}>
            <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-sm">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  return (
    <Card className="shadow-lg border-border h-full">
      <CardHeader className="bg-muted/30 border-b pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Salary Components</CardTitle>
        <Button variant="ghost" size="sm" onClick={resetInputs} className="text-muted-foreground hover:text-primary">
          <RefreshCw className="h-4 w-4 mr-2" /> Reset
        </Button>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        
        <div className="space-y-3">
          <LabelWithTooltip label="Total Annual CTC (₹)" tooltip="Cost to Company: The total amount the company spends on you annually." />
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="number" 
              value={inputs.ctc || ''} 
              onChange={(e) => handleInputChange('ctc', e.target.value)} 
              className="pl-10 h-12 text-lg font-semibold" 
              placeholder="e.g. 1200000" 
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quick Templates</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => applyTemplate(templates.standard)} className="text-xs">Standard IT</Button>
            <Button variant="outline" size="sm" onClick={() => applyTemplate(templates.manufacturing)} className="text-xs">Manufacturing</Button>
            <Button variant="outline" size="sm" onClick={() => applyTemplate(templates.startup)} className="text-xs">Startup</Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <LabelWithTooltip label="Basic Salary (%)" tooltip="Core component of your salary, usually 40-50% of CTC." />
              <span className="text-sm font-medium text-primary">{inputs.basicPercent}%</span>
            </div>
            <Slider value={[inputs.basicPercent]} min={0} max={100} step={1} onValueChange={(v) => handleInputChange('basicPercent', v[0])} />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <LabelWithTooltip label="HRA (%)" tooltip="House Rent Allowance, typically 40-50% of Basic Salary." />
              <span className="text-sm font-medium text-primary">{inputs.hraPercent}%</span>
            </div>
            <Slider value={[inputs.hraPercent]} min={0} max={100} step={1} onValueChange={(v) => handleInputChange('hraPercent', v[0])} />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <LabelWithTooltip label="Special Allowance (%)" tooltip="Remaining allowance to balance the CTC structure." />
              <span className="text-sm font-medium text-primary">{inputs.specialAllowancePercent}%</span>
            </div>
            <Slider value={[inputs.specialAllowancePercent]} min={0} max={100} step={1} onValueChange={(v) => handleInputChange('specialAllowancePercent', v[0])} />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <LabelWithTooltip label="Bonus / Variable (%)" tooltip="Performance-based pay included in CTC." />
              <span className="text-sm font-medium text-primary">{inputs.bonusPercent}%</span>
            </div>
            <Slider value={[inputs.bonusPercent]} min={0} max={100} step={1} onValueChange={(v) => handleInputChange('bonusPercent', v[0])} />
          </div>
        </div>

        <div className="pt-6 border-t space-y-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Deductions & Contributions</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <LabelWithTooltip label="Employer PF (%)" tooltip="Employer's contribution to Provident Fund (usually 12% of Basic)." />
              <Input type="number" value={inputs.employerPfPercent} onChange={(e) => handleInputChange('employerPfPercent', e.target.value)} />
            </div>
            <div className="space-y-2">
              <LabelWithTooltip label="Employee PF (%)" tooltip="Your contribution to Provident Fund (usually 12% of Basic)." />
              <Input type="number" value={inputs.employeePfPercent} onChange={(e) => handleInputChange('employeePfPercent', e.target.value)} />
            </div>
            <div className="space-y-2">
              <LabelWithTooltip label="Gratuity (%)" tooltip="Statutory benefit, usually 4.81% of Basic." />
              <Input type="number" value={inputs.gratuityPercent} onChange={(e) => handleInputChange('gratuityPercent', e.target.value)} />
            </div>
            <div className="space-y-2">
              <LabelWithTooltip label="Prof. Tax (₹/mo)" tooltip="State-level tax, typically ₹200/month." />
              <Input type="number" value={inputs.professionalTax} onChange={(e) => handleInputChange('professionalTax', e.target.value)} />
            </div>
            <div className="space-y-2">
              <LabelWithTooltip label="Income Tax (₹/mo)" tooltip="Estimated monthly TDS deduction." />
              <Input type="number" value={inputs.incomeTax} onChange={(e) => handleInputChange('incomeTax', e.target.value)} />
            </div>
            <div className="space-y-2">
              <LabelWithTooltip label="Other Deductions (₹/mo)" tooltip="Any other monthly deductions." />
              <Input type="number" value={inputs.otherDeductions} onChange={(e) => handleInputChange('otherDeductions', e.target.value)} />
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default SalaryCalculatorUI;