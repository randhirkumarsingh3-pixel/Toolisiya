import PDFParse from 'pdf-parse/lib/pdf-parse.js';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType, PageBreak, ShadingType,
  Header, Footer,
} from 'docx';

// ── Heuristic helpers ────────────────────────────────────────────────────────

/**
 * Detect if a line looks like a heading.
 * Rules: short (≤120 chars), no trailing period, and either ALL-CAPS or
 * starts with a number followed by a dot/paren (e.g. "1. Introduction").
 */
function isHeadingLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 120) return false;
  if (trimmed.endsWith('.') || trimmed.endsWith(',') || trimmed.endsWith(';')) return false;

  // Numbered heading patterns: "1.", "1.1", "1)", "I.", "A."
  if (/^\d+[\.\)]\s/.test(trimmed)) return true;
  if (/^\d+\.\d+[\.\s]/.test(trimmed)) return true;
  if (/^[IVXLC]+\.\s/.test(trimmed)) return true;
  if (/^[A-Z]\.\s/.test(trimmed)) return true;

  // ALL-CAPS line (at least 3 chars, mostly uppercase letters)
  const letters = trimmed.replace(/[^a-zA-Z]/g, '');
  if (letters.length >= 3 && letters === letters.toUpperCase()) return true;

  return false;
}

/**
 * Detect if a line is a bullet or list item.
 */
function isBulletLine(line) {
  const trimmed = line.trim();
  return /^[\u2022\u2023\u25E6\u2043\u2219•\-\*]\s/.test(trimmed) ||
         /^\d+[\.\)]\s/.test(trimmed);
}

/**
 * Detect if a block of lines looks like a table (tab-separated or multi-space columns).
 */
function detectTableBlock(lines) {
  // A table needs at least 2 rows where each row has 2+ columns separated by tabs or 3+ spaces
  const splitRow = (line) => {
    const byTab = line.split('\t').map(c => c.trim()).filter(Boolean);
    if (byTab.length >= 2) return byTab;
    const bySpaces = line.split(/\s{3,}/).map(c => c.trim()).filter(Boolean);
    if (bySpaces.length >= 2) return bySpaces;
    return null;
  };

  const rows = [];
  for (const line of lines) {
    const cols = splitRow(line);
    if (cols) {
      rows.push(cols);
    } else {
      break;
    }
  }

  if (rows.length >= 2) {
    // Normalize column count to the maximum
    const maxCols = Math.max(...rows.map(r => r.length));
    const normalized = rows.map(r => {
      while (r.length < maxCols) r.push('');
      return r;
    });
    return { rows: normalized, consumed: rows.length };
  }
  return null;
}

// ── Structure extraction ─────────────────────────────────────────────────────

/**
 * Extract structured content from a PDF buffer.
 * Returns an array of page objects, each containing an array of content blocks.
 */
async function extractStructuredContent(pdfBuffer) {
  // pdf-parse extracts text page-by-page via the pagerender callback
  const pages = [];
  let currentPageLines = [];

  const options = {
    // Custom page renderer that preserves line breaks
    pagerender: async (pageData) => {
      const textContent = await pageData.getTextContent();
      const items = textContent.items;

      if (!items || items.length === 0) return '';

      // Group text items by their Y coordinate to reconstruct lines
      const lineMap = new Map();
      for (const item of items) {
        const y = Math.round(item.transform[5]); // Y coordinate
        if (!lineMap.has(y)) lineMap.set(y, []);
        lineMap.get(y).push({
          text: item.str,
          x: item.transform[4],
          width: item.width,
          fontName: item.fontName || '',
          height: item.height || 12,
        });
      }

      // Sort lines by Y (top to bottom = descending Y in PDF coordinates)
      const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);
      const lines = [];
      for (const y of sortedYs) {
        const lineItems = lineMap.get(y).sort((a, b) => a.x - b.x);
        const lineText = lineItems.map(i => i.text).join(' ').trim();
        if (lineText) {
          lines.push({
            text: lineText,
            avgHeight: lineItems.reduce((s, i) => s + i.height, 0) / lineItems.length,
            items: lineItems,
          });
        }
      }

      currentPageLines = lines;
      return lines.map(l => l.text).join('\n');
    }
  };

  // pdf-parse processes all pages; we capture per-page via the callback
  const parsed = await PDFParse(pdfBuffer, options);

  // If pagerender didn't populate (fallback), split by form feed
  if (pages.length === 0 && parsed.text) {
    const rawPages = parsed.text.split(/\f/);
    for (const rawPage of rawPages) {
      const lines = rawPage.split('\n').filter(l => l.trim());
      pages.push(lines.map(l => ({ text: l.trim(), avgHeight: 12 })));
    }
  }

  return {
    pages,
    totalPages: parsed.numpages || pages.length,
    info: parsed.info || {},
  };
}

// ── DOCX builder ─────────────────────────────────────────────────────────────

/**
 * Build a DOCX document from extracted PDF content.
 * @param {Buffer} pdfBuffer - The raw PDF file buffer
 * @param {Object} options - { mode: 'high' | 'fast' }
 * @returns {Promise<Buffer>} - The generated .docx file as a Buffer
 */
export async function convertPdfToDocx(pdfBuffer, options = {}) {
  const mode = options.mode || 'high';

  // Extract text using pdf-parse with form-feed page splitting
  const parsed = await PDFParse(pdfBuffer);
  const rawPages = parsed.text.split(/\f/);
  const totalPages = parsed.numpages || rawPages.length;

  const sections = [];

  for (let pageIdx = 0; pageIdx < rawPages.length; pageIdx++) {
    const pageText = rawPages[pageIdx];
    const lines = pageText.split('\n').filter(l => l.trim());
    const children = [];

    if (lines.length === 0) {
      children.push(new Paragraph({ children: [new TextRun('')] }));
      sections.push({
        properties: pageIdx > 0 ? { page: { pageBreakBefore: true } } : {},
        children,
      });
      continue;
    }

    if (mode === 'fast') {
      // Fast mode: simple paragraphs, no structure analysis
      for (const line of lines) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: line.trim(), size: 24, font: 'Calibri' })],
            spacing: { after: 120 },
          })
        );
      }
    } else {
      // High mode: detect headings, bullets, tables
      let i = 0;
      while (i < lines.length) {
        const line = lines[i].trim();

        // Try to detect a table block starting at this line
        const tableResult = detectTableBlock(lines.slice(i));
        if (tableResult) {
          const table = new Table({
            rows: tableResult.rows.map((cols, rowIdx) =>
              new TableRow({
                children: cols.map(cell =>
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: cell,
                            size: 22,
                            font: 'Calibri',
                            bold: rowIdx === 0,
                          }),
                        ],
                      }),
                    ],
                    width: { size: Math.floor(9000 / cols.length), type: WidthType.DXA },
                    shading: rowIdx === 0
                      ? { type: ShadingType.SOLID, color: 'E8E8E8' }
                      : undefined,
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' },
                      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' },
                      left: { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' },
                      right: { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' },
                    },
                  })
                ),
              })
            ),
            width: { size: 9000, type: WidthType.DXA },
          });
          children.push(table);
          children.push(new Paragraph({ spacing: { after: 200 } })); // gap after table
          i += tableResult.consumed;
          continue;
        }

        // Heading detection
        if (isHeadingLine(line)) {
          // Determine heading level
          let level = HeadingLevel.HEADING_2;
          const letters = line.replace(/[^a-zA-Z]/g, '');
          if (letters.length >= 3 && letters === letters.toUpperCase()) {
            level = HeadingLevel.HEADING_1;
          }
          children.push(
            new Paragraph({
              children: [new TextRun({ text: line, font: 'Calibri', bold: true })],
              heading: level,
              spacing: { before: 240, after: 120 },
            })
          );
          i++;
          continue;
        }

        // Bullet / list item
        if (isBulletLine(line)) {
          // Strip the bullet character
          const bulletText = line.replace(/^[\u2022\u2023\u25E6\u2043\u2219•\-\*]\s*/, '')
                                 .replace(/^\d+[\.\)]\s*/, '');
          children.push(
            new Paragraph({
              children: [new TextRun({ text: bulletText, size: 24, font: 'Calibri' })],
              bullet: { level: 0 },
              spacing: { after: 60 },
            })
          );
          i++;
          continue;
        }

        // Regular paragraph
        children.push(
          new Paragraph({
            children: [new TextRun({ text: line, size: 24, font: 'Calibri' })],
            spacing: { after: 120 },
          })
        );
        i++;
      }
    }

    // Add page break before every page except the first
    if (pageIdx > 0 && children.length > 0) {
      children[0] = new Paragraph({
        children: [
          new PageBreak(),
          ...(children[0].root?.[1]?.root || []),
        ],
      });
      // Simpler approach: just prepend a page-break paragraph
      children.unshift(
        new Paragraph({ children: [new PageBreak()] })
      );
      // Remove the malformed paragraph we just created above
      children.splice(1, 1);
    }

    sections.push({ children });
  }

  // If no content was extracted at all, add a notice
  if (sections.length === 0) {
    sections.push({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: 'No extractable text was found in this PDF. The document may contain only scanned images.',
              italics: true,
              size: 24,
              font: 'Calibri',
              color: '888888',
            }),
          ],
        }),
      ],
    });
  }

  // Build the final document
  const doc = new Document({
    creator: 'Toolisiya PDF Converter',
    title: options.filename || 'Converted Document',
    description: `Converted from PDF (${totalPages} pages)`,
    sections,
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
