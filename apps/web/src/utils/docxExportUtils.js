import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

/**
 * Exports structured data to a DOCX file.
 * @param {Array<{text: string, heading?: boolean, bold?: boolean}>} data - Content to export.
 * @param {string} filename - The name of the downloaded DOCX file.
 */
export const exportToDOCX = async (data, filename = 'document.docx') => {
  try {
    const children = data.map(item => {
      if (item.heading) {
        return new Paragraph({
          text: item.text,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 }
        });
      }
      return new Paragraph({
        children: [new TextRun({ text: item.text, bold: item.bold })],
        spacing: { before: 120, after: 120 }
      });
    });

    const doc = new Document({
      sections: [{ properties: {}, children }]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('DOCX Export Error:', error);
    throw error;
  }
};