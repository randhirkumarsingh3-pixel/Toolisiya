import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports a DOM element to a PDF file using jsPDF and html2canvas.
 * @param {string} elementId - The ID of the DOM element to export.
 * @param {string} filename - The name of the downloaded PDF file.
 */
export const exportToPDF = async (elementId, filename = 'document.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Element not found');

  try {
    const canvas = await html2canvas(element, { 
      scale: 2, 
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw error;
  }
};