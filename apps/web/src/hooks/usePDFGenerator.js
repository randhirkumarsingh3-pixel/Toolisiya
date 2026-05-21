import { useState, useCallback } from 'react';
import { optimizePDFSize } from '../utils/pdf/pdfHelpers.js';
import { resumeTemplate, invoiceTemplate } from '../utils/pdf/pdfTemplates.js';

export const usePDFGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateDocumentPDF = useCallback(async (htmlContent, filename) => {
    setLoading(true);
    setError(null);
    try {
      // Lazy load html2pdf
      const html2pdf = (await import('html2pdf.js')).default;
      
      const container = document.createElement('div');
      container.innerHTML = htmlContent;
      
      const opt = optimizePDFSize({
        margin: 10,
        filename: filename || 'document.pdf',
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      });

      const pdfBlob = await html2pdf().set(opt).from(container).output('blob');
      return pdfBlob;
    } catch (err) {
      console.error('PDF Generation Error:', err);
      setError('Failed to generate PDF. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateResumePDF = useCallback(async (resumeData, filename = 'Resume.pdf') => {
    const htmlContent = resumeTemplate(resumeData);
    return await generateDocumentPDF(htmlContent, filename);
  }, [generateDocumentPDF]);

  const generateInvoicePDF = useCallback(async (invoiceData, filename = 'Invoice.pdf') => {
    const htmlContent = invoiceTemplate(invoiceData);
    return await generateDocumentPDF(htmlContent, filename);
  }, [generateDocumentPDF]);

  return {
    generatePDF: generateDocumentPDF,
    generateResumePDF,
    generateInvoicePDF,
    loading,
    error
  };
};