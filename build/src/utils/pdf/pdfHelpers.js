/**
 * Converts an image file to a base64 string.
 * @param {File|Blob} file - The image file to convert.
 * @returns {Promise<string>} - A promise that resolves with the base64 string.
 */
export const imageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Formats a number as currency for PDF display.
 * @param {number|string} amount - The amount to format.
 * @param {string} currency - The currency code (default: 'INR').
 * @returns {string} - The formatted currency string.
 */
export const formatCurrencyForPDF = (amount, currency = 'INR') => {
  const num = parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(num);
};

/**
 * Formats a date string consistently for PDF display.
 * @param {string|Date} date - The date to format.
 * @returns {string} - The formatted date string.
 */
export const formatDateForPDF = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(d);
};

/**
 * Calculates optimal page breaks for long HTML content.
 * (Placeholder for advanced logic; html2pdf handles basic page breaks via CSS page-break-inside)
 * @param {HTMLElement} contentElement - The DOM element containing the content.
 */
export const calculatePageBreaks = (contentElement) => {
  // html2pdf.js respects standard CSS page-break properties.
  // We ensure elements with class 'avoid-break' don't split across pages.
  const elements = contentElement.querySelectorAll('.avoid-break');
  elements.forEach(el => {
    el.style.pageBreakInside = 'avoid';
  });
};

/**
 * Optimizes PDF size by adjusting image quality and scale.
 * @param {Object} options - The html2pdf options object.
 * @returns {Object} - The optimized options object.
 */
export const optimizePDFSize = (options) => {
  return {
    ...options,
    image: { type: 'jpeg', quality: 0.85 },
    html2canvas: { scale: 2, useCORS: true, logging: false }
  };
};