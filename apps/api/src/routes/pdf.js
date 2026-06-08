import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { PDFParse } from 'pdf-parse';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// Configure multer for PDF, Excel, and Word uploads with MIME and size constraints
const uploadPdf = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF files are allowed.'));
    }
  }
});

const uploadExcel = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/octet-stream'
    ];
    if (allowed.includes(file.mimetype) || file.originalname.toLowerCase().endsWith('.xlsx') || file.originalname.toLowerCase().endsWith('.xls')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel spreadsheets (.xlsx, .xls) are allowed.'));
    }
  }
});

const uploadWord = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/octet-stream'
    ];
    if (allowed.includes(file.mimetype) || file.originalname.toLowerCase().endsWith('.docx') || file.originalname.toLowerCase().endsWith('.doc')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Word documents (.docx, .doc) are allowed.'));
    }
  }
});

// Helper function to validate PDF
const validatePDF = async (buffer) => {
  try {
    await PDFDocument.load(buffer);
    return true;
  } catch (error) {
    return false;
  }
};

// POST /pdf/merge
router.post('/merge', uploadPdf.array('files', 20), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'At least one PDF file is required' });
  }

  if (req.files.length < 2) {
    return res.status(400).json({ error: 'At least two PDF files are required to merge' });
  }

  logger.info(`Merging ${req.files.length} PDF files`);

  // Validate all PDFs
  for (let i = 0; i < req.files.length; i++) {
    const isValid = await validatePDF(req.files[i].buffer);
    if (!isValid) {
      throw new Error(`File ${i + 1} (${req.files[i].originalname}) is not a valid PDF`);
    }
  }

  // Create merged PDF
  const mergedPdf = await PDFDocument.create();

  for (const file of req.files) {
    const pdf = await PDFDocument.load(file.buffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach(page => mergedPdf.addPage(page));
  }

  const mergedBuffer = await mergedPdf.save();

  logger.info(`Successfully merged ${req.files.length} PDF files`);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="merged.pdf"');
  res.send(mergedBuffer);
});

// POST /pdf/split
router.post('/split', uploadPdf.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'PDF file is required' });
  }

  const { pages } = req.body;
  if (!pages) {
    return res.status(400).json({ error: 'Pages parameter is required (e.g., "1,3,5-7")' });
  }

  logger.info(`Splitting PDF with pages: ${pages}`);

  // Validate PDF
  const isValid = await validatePDF(req.file.buffer);
  if (!isValid) {
    throw new Error('Uploaded file is not a valid PDF');
  }

  // Load PDF
  const pdf = await PDFDocument.load(req.file.buffer);
  const totalPages = pdf.getPageCount();

  // Parse page numbers
  const pageIndices = new Set();
  const parts = pages.split(',');

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      // Handle range (e.g., "5-7")
      const [start, end] = trimmed.split('-').map(p => parseInt(p.trim(), 10));
      if (isNaN(start) || isNaN(end)) {
        throw new Error(`Invalid page range: ${trimmed}`);
      }
      for (let i = start; i <= end; i++) {
        if (i < 1 || i > totalPages) {
          throw new Error(`Page ${i} is out of range (1-${totalPages})`);
        }
        pageIndices.add(i - 1); // Convert to 0-based index
      }
    } else {
      // Handle single page
      const pageNum = parseInt(trimmed, 10);
      if (isNaN(pageNum)) {
        throw new Error(`Invalid page number: ${trimmed}`);
      }
      if (pageNum < 1 || pageNum > totalPages) {
        throw new Error(`Page ${pageNum} is out of range (1-${totalPages})`);
      }
      pageIndices.add(pageNum - 1); // Convert to 0-based index
    }
  }

  if (pageIndices.size === 0) {
    throw new Error('No valid pages specified');
  }

  // Create new PDF with selected pages
  const newPdf = await PDFDocument.create();
  const sortedIndices = Array.from(pageIndices).sort((a, b) => a - b);

  for (const index of sortedIndices) {
    const [copiedPage] = await newPdf.copyPages(pdf, [index]);
    newPdf.addPage(copiedPage);
  }

  const splitBuffer = await newPdf.save();

  logger.info(`Successfully split PDF with ${sortedIndices.length} pages`);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="split.pdf"');
  res.send(splitBuffer);
});

// POST /pdf/watermark
router.post('/watermark', uploadPdf.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'PDF file is required' });
  }

  const { text, fontSize = 48, opacity = 0.5, color = 'cccccc', rotation = -45, position = 'center' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Watermark text is required' });
  }

  logger.info(`Adding watermark to PDF: "${text}"`);

  // Validate PDF
  const isValid = await validatePDF(req.file.buffer);
  if (!isValid) {
    throw new Error('Uploaded file is not a valid PDF');
  }

  // Load PDF
  const pdf = await PDFDocument.load(req.file.buffer);
  const pages = pdf.getPages();

  // Parse color (hex format)
  const colorValue = color.startsWith('#') ? color.slice(1) : color;
  const r = parseInt(colorValue.substring(0, 2), 16) / 255;
  const g = parseInt(colorValue.substring(2, 4), 16) / 255;
  const b = parseInt(colorValue.substring(4, 6), 16) / 255;

  // Apply watermark to each page
  for (const page of pages) {
    const { width, height } = page.getSize();

    // Calculate position
    let x, y;
    switch (position) {
      case 'top-left':
        x = 50;
        y = height - 50;
        break;
      case 'top-right':
        x = width - 200;
        y = height - 50;
        break;
      case 'bottom-left':
        x = 50;
        y = 50;
        break;
      case 'bottom-right':
        x = width - 200;
        y = 50;
        break;
      case 'center':
      default:
        x = width / 2 - (text.length * fontSize) / 4;
        y = height / 2;
        break;
    }

    page.drawText(text, {
      x,
      y,
      size: parseInt(fontSize, 10),
      color: rgb(r, g, b),
      opacity: parseFloat(opacity),
      rotate: rotation ? degrees(parseInt(rotation, 10)) : undefined,
    });
  }

  const watermarkedBuffer = await pdf.save();

  logger.info(`Successfully added watermark to PDF`);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="watermarked.pdf"');
  res.send(watermarkedBuffer);
});

// POST /pdf/excel-to-pdf
router.post('/excel-to-pdf', uploadExcel.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Excel file is required' });
  }

  logger.info(`Converting Excel to PDF: ${req.file.originalname}`);

  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (data.length === 0) {
      throw new Error('Excel sheet is empty');
    }

    const doc = new jsPDF();
    autoTable(doc, {
      head: [data[0]],
      body: data.slice(1),
      startY: 10,
      margin: { horizontal: 10 },
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [66, 133, 244], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    logger.info(`Successfully converted Excel to PDF: ${req.file.originalname}`);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${req.file.originalname.split('.')[0]}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    logger.error('Excel to PDF conversion failed:', error);
    res.status(500).json({ error: 'Failed to convert Excel to PDF: ' + error.message });
  }
});

// POST /pdf/word-to-pdf
router.post('/word-to-pdf', uploadWord.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Word file is required' });
  }

  logger.info(`Converting Word to PDF: ${req.file.originalname}`);

  try {
    const result = await mammoth.extractRawText({ buffer: req.file.buffer });
    const text = result.value;

    if (!text.trim()) {
      throw new Error('Word document is empty or text could not be extracted');
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxLineWidth = pageWidth - (margin * 2);

    doc.setFontSize(12);
    const lines = doc.splitTextToSize(text, maxLineWidth);
    
    // Simple pagination
    let y = margin;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.getHeight();

    lines.forEach((line) => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    logger.info(`Successfully converted Word to PDF: ${req.file.originalname}`);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${req.file.originalname.split('.')[0]}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    logger.error('Word to PDF conversion failed:', error);
    res.status(500).json({ error: 'Failed to convert Word to PDF: ' + error.message });
  }
});
// POST /pdf/pdf-to-word
router.post('/pdf-to-word', uploadPdf.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'PDF file is required' });
  }

  logger.info(`Converting PDF to Word (Node native): ${req.file.originalname}`);

  try {
    // Validate PDF
    const isValid = await validatePDF(req.file.buffer);
    if (!isValid) {
      return res.status(400).json({ error: 'Uploaded file is not a valid PDF or is encrypted/corrupted.' });
    }

    // 1. Extract text using PDFParse class
    const parser = new PDFParse({ data: new Uint8Array(req.file.buffer) });
    await parser.load();
    const textResult = await parser.getText();
    const extractedText = textResult.text || '';

    if (!extractedText.trim()) {
      return res.status(400).json({ error: 'No text could be extracted from this PDF. It might be a scanned image.' });
    }

    // 2. Split text into paragraphs (double line breaks or multiple newlines)
    const paragraphs = extractedText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

    // 3. Build Word document
    const docChildren = paragraphs.map(text => {
      // Handle single line breaks within paragraphs
      const lines = text.split('\n');
      const runs = lines.map((line, index) => {
        return new TextRun({
          text: line.trim(),
          break: index > 0 ? 1 : 0
        });
      });

      return new Paragraph({
        children: runs,
        spacing: {
          after: 200, // Twip value (200 twips = 10 pt spacing after paragraph)
        }
      });
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children: docChildren,
      }],
    });

    // 4. Generate DOCX Buffer
    const docxBuffer = await Packer.toBuffer(doc);

    logger.info(`Successfully converted PDF to Word natively: ${req.file.originalname}`);

    const baseName = req.file.originalname.replace(/\.[^/.]+$/, "");
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(baseName)}.docx"`);
    res.send(docxBuffer);

  } catch (error) {
    logger.error('PDF to Word conversion failed natively:', error);
    res.status(500).json({ error: 'Failed to convert PDF to Word: ' + error.message });
  }
});

export default router;