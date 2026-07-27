import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports a specific HTML element to a PDF document
 * @param {string} elementId - The ID of the HTML element to capture
 * @param {string} filename - The desired output filename
 */
export const exportSeoReportPDF = async (elementId = 'seo-report-content', filename = 'SEO-Health-Report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found.`);
    return false;
  }

  try {
    // Temporarily add a class to adjust styling for print if needed
    element.classList.add('pdf-export-mode');
    
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    element.classList.remove('pdf-export-mode');

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    // Handle multi-page PDFs if the content is very long
    let heightLeft = pdfHeight;
    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    return false;
  }
};

/**
 * Exports an array of objects to a CSV file
 * @param {Array} data - Array of objects containing the SEO metrics
 * @param {string} filename - The desired output filename
 */
export const exportSeoDataCSV = (data, filename = 'seo-metrics-export.csv') => {
  if (!data || !data.length) {
    console.error('No data provided for CSV export');
    return false;
  }

  try {
    // Extract headers
    const headers = Object.keys(data[0]);
    
    // Convert to CSV string
    const csvRows = [];
    csvRows.push(headers.join(',')); // Add headers row

    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header];
        // Handle strings with commas, quotes, or newlines
        if (typeof val === 'string') {
          const escaped = val.replace(/"/g, '""');
          return `"${escaped}"`;
        }
        return val !== null && val !== undefined ? val : '';
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    return true;
  } catch (error) {
    console.error('Failed to generate CSV:', error);
    return false;
  }
};