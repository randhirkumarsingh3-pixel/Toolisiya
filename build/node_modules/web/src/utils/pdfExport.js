import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

const setupDoc = (title) => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(title, 20, 20);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
  doc.line(20, 35, 190, 35);
  return doc;
};

export const exportCalculationResultsPDF = (data, calculatorName) => {
  try {
    const doc = setupDoc(`${calculatorName} Report`);
    let y = 50;

    Object.entries(data).forEach(([key, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${key}:`, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(value), 80, y);
      y += 10;
    });

    doc.save(`${calculatorName.replace(/\s+/g, '_').toLowerCase()}_report.pdf`);
    toast.success('PDF downloaded successfully');
  } catch (error) {
    console.error(error);
    toast.error('Failed to generate PDF');
  }
};

export const exportAmortizationSchedulePDF = (schedule, loanDetails) => {
  try {
    const doc = setupDoc('Loan Amortization Schedule');
    
    let y = 45;
    doc.setFont("helvetica", "bold");
    doc.text("Loan Summary", 20, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    Object.entries(loanDetails).forEach(([k, v]) => {
      doc.text(`${k}: ${v}`, 20, y);
      y += 8;
    });

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFillColor(240, 244, 248);
    doc.rect(20, y - 6, 170, 10, 'F');
    doc.text("Year", 25, y);
    doc.text("Principal Paid", 60, y);
    doc.text("Interest Paid", 110, y);
    doc.text("Balance", 155, y);
    
    y += 10;
    doc.setFont("helvetica", "normal");
    
    schedule.forEach(row => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(String(row.year), 25, y);
      doc.text(String(row.principal.toLocaleString()), 60, y);
      doc.text(String(row.interest.toLocaleString()), 110, y);
      doc.text(String(row.balance.toLocaleString()), 155, y);
      y += 8;
    });

    doc.save('amortization_schedule.pdf');
    toast.success('Schedule downloaded successfully');
  } catch (error) {
    console.error(error);
    toast.error('Failed to generate schedule PDF');
  }
};

export const exportTableReportPDF = (title, summary, tableHeaders, tableData) => {
  try {
    const doc = setupDoc(title);
    
    let y = 45;
    if (summary) {
      doc.setFont("helvetica", "bold");
      doc.text("Summary", 20, y);
      y += 10;
      doc.setFont("helvetica", "normal");
      Object.entries(summary).forEach(([k, v]) => {
        doc.text(`${k}: ${v}`, 20, y);
        y += 8;
      });
      y += 10;
    }

    doc.setFont("helvetica", "bold");
    doc.setFillColor(240, 244, 248);
    doc.rect(20, y - 6, 170, 10, 'F');
    let xOffset = 25;
    tableHeaders.forEach(h => {
      doc.text(h, xOffset, y);
      xOffset += 40;
    });
    
    y += 10;
    doc.setFont("helvetica", "normal");
    
    tableData.forEach(row => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      xOffset = 25;
      row.forEach(cell => {
        doc.text(String(cell), xOffset, y);
        xOffset += 40;
      });
      y += 8;
    });

    doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    toast.success('Report downloaded successfully');
  } catch (error) {
    console.error(error);
    toast.error('Failed to generate report PDF');
  }
};