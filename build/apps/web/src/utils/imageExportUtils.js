import html2canvas from 'html2canvas';

/**
 * Exports a DOM element to a PNG image.
 * @param {string} elementId - The ID of the DOM element to export.
 * @param {string} filename - The name of the downloaded PNG file.
 */
export const exportToPNG = async (elementId, filename = 'document.png') => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Element not found');

  try {
    const canvas = await html2canvas(element, { 
      scale: 2, 
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('PNG Export Error:', error);
    throw error;
  }
};