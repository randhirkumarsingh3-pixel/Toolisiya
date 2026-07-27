import React, { useState, useMemo, useRef } from 'react';
import { Download, ShieldCheck, Lock, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';
import SalaryCalculatorUI from '@/components/finance/SalaryCalculatorUI.jsx';
import SalaryBreakdownCards from '@/components/finance/SalaryBreakdownCards.jsx';
import SalaryCharts from '@/components/finance/SalaryCharts.jsx';
import SalaryBreakdownTable from '@/components/finance/SalaryBreakdownTable.jsx';

const defaultInputs = {
  ctc: 1200000,
  basicPercent: 40,
  hraPercent: 15,
  specialAllowancePercent: 10,
  bonusPercent: 10,
  employerPfPercent: 12,
  gratuityPercent: 4.81,
  employeePfPercent: 12,
  professionalTax: 200,
  incomeTax: 0,
  otherDeductions: 0
};

const SalaryCalculatorPage = () => {
  const [inputs, setInputs] = useState(defaultInputs);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef(null);

  const results = useMemo(() => {
    const ctc = inputs.ctc || 0;
    const monthlyGross = ctc / 12;
    
    const monthlyBasic = (inputs.basicPercent / 100) * monthlyGross;
    const monthlyHra = (inputs.hraPercent / 100) * monthlyGross;
    const monthlySpecialAllowance = (inputs.specialAllowancePercent / 100) * monthlyGross;
    const monthlyBonus = (inputs.bonusPercent / 100) * monthlyGross;
    
    const monthlyEmployerPf = (inputs.employerPfPercent / 100) * monthlyBasic;
    const monthlyGratuity = (inputs.gratuityPercent / 100) * monthlyBasic;
    
    const monthlyEmployeePf = (inputs.employeePfPercent / 100) * monthlyBasic;
    const monthlyPt = inputs.professionalTax || 0;
    const monthlyIt = inputs.incomeTax || 0;
    const monthlyOtherDeductions = inputs.otherDeductions || 0;
    
    const monthlyDeductions = monthlyEmployeePf + monthlyPt + monthlyIt + monthlyOtherDeductions;
    
    // Actual gross received by employee before deductions (excluding employer contributions)
    const actualMonthlyGross = monthlyGross - monthlyEmployerPf - monthlyGratuity;
    const monthlyNet = actualMonthlyGross - monthlyDeductions;

    return {
      monthlyGross: actualMonthlyGross,
      monthlyBasic,
      monthlyHra,
      monthlySpecialAllowance,
      monthlyBonus,
      monthlyEmployerPf,
      monthlyGratuity,
      monthlyEmployeePf,
      monthlyPt,
      monthlyIt,
      monthlyOtherDeductions,
      monthlyDeductions,
      monthlyNet,
      annualGross: actualMonthlyGross * 12,
      annualDeductions: monthlyDeductions * 12,
      annualNet: monthlyNet * 12
    };
  }, [inputs]);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    toast.info('Generating PDF report...');
    
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Salary_Summary_Report.pdf');
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ToolPageTemplate toolData={toolPageData['salary-calculator']}>
      
      {/* Trust Section */}
      <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-muted-foreground mb-8 bg-muted/30 py-4 rounded-xl border border-border">
        <span className="flex items-center gap-2"><EyeOff className="w-4 h-4 text-primary" /> No salary data is stored</span>
        <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Secure browser-based calculation</span>
        <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> No signup required</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-4">
          <SalaryCalculatorUI 
            inputs={inputs} 
            setInputs={setInputs} 
            resetInputs={() => setInputs(defaultInputs)} 
          />
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-end mb-2">
            <Button onClick={handleExportPDF} disabled={isExporting || !inputs.ctc} className="shadow-sm">
              <Download className="w-4 h-4 mr-2" /> {isExporting ? 'Generating...' : 'Download Summary'}
            </Button>
          </div>

          <div ref={reportRef} className="space-y-6 bg-background p-1 rounded-xl">
            {isExporting && (
              <div className="text-center pb-4 border-b mb-4">
                <h2 className="text-2xl font-bold text-primary">Salary Breakdown Report</h2>
                <p className="text-sm text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
                <p className="text-xs text-muted-foreground mt-1 italic">*This is an estimation tool. Actual values may vary based on company policies.</p>
              </div>
            )}
            
            <SalaryBreakdownCards results={results} />
            <SalaryCharts results={results} />
            <SalaryBreakdownTable results={results} />
          </div>
        </div>
      </div>

    </ToolPageTemplate>
  );
};

export default SalaryCalculatorPage;