import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const TOOLS_MAPPING = {
  'Developer': [
    { name: 'JSON Formatter', url: '/developer/json-formatter' },
    { name: 'XML Formatter', url: '/developer/xml-formatter' },
    { name: 'Code Beautifier', url: '/developer/code-beautifier' },
    { name: 'Color Picker', url: '/developer/color-picker' },
    { name: 'Base64 Encoder', url: '/developer/base64-encoder-decoder' },
    { name: 'Markdown to HTML', url: '/developer/markdown-to-html' },
    { name: 'HTML Preview', url: '/developer/html-preview' },
    { name: 'URL Encoder', url: '/developer/url-encoder' }
  ],
  'Document': [
    { name: 'Receipt Generator', url: '/document/receipt-generator' },
    { name: 'Certificate Generator', url: '/document/certificate-generator' },
    { name: 'Letter Generator', url: '/document/letter-generator' },
    { name: 'Contract Generator', url: '/document/contract-generator' },
    { name: 'Proposal Generator', url: '/document/proposal-generator' },
    { name: 'Quote Generator', url: '/document/quote-generator' },
    { name: 'Bill Generator', url: '/document/bill-generator' },
    { name: 'Invoice Generator', url: '/document/invoice-generator' }
  ],
  'PDF': [
    { name: 'Document Scanner', url: '/pdf/document-scanner' },
    { name: 'PDF Compressor', url: '/pdf/pdf-compressor' },
    { name: 'PDF Merger', url: '/pdf/pdf-merger' },
    { name: 'PDF Splitter', url: '/pdf/pdf-splitter' },
    { name: 'PDF Page Rotator', url: '/pdf/pdf-page-rotator' },
    { name: 'PDF Page Extractor', url: '/pdf/pdf-page-extractor' },
    { name: 'PDF Watermark Adder', url: '/pdf/pdf-watermark-adder' },
    { name: 'PDF to Image', url: '/pdf/pdf-to-image-converter' },
    { name: 'PDF Blank Page Remover', url: '/pdf/pdf-blank-page-remover' },
    { name: 'PDF Page Number', url: '/pdf/pdf-page-number' },
    { name: 'PDF Header Footer', url: '/pdf/pdf-header-footer-adder' },
    { name: 'PDF QR Code Adder', url: '/pdf/pdf-qr-code-adder' },
    { name: 'PDF Bookmark Creator', url: '/pdf/pdf-bookmark-creator' }
  ],
  'Finance': [
    { name: 'GST Calculator', url: '/finance/gst-calculator' },
    { name: 'EMI Calculator', url: '/finance/emi-calculator' },
    { name: 'Loan Calculator', url: '/finance/loan-calculator' },
    { name: 'Investment Calculator', url: '/finance/investment-calculator' },
    { name: 'Salary Calculator', url: '/finance/salary-calculator' },
    { name: 'SIP Calculator', url: '/finance/sip-calculator' },
    { name: 'FD Calculator', url: '/finance/fd-calculator' },
    { name: 'Discount Calculator', url: '/finance/discount-calculator' },
    { name: 'Percentage Calculator', url: '/finance/percentage-calculator' },
    { name: 'Income Tax', url: '/finance/income-tax-calculator' },
    { name: 'Currency Converter', url: '/finance/currency-converter' },
    { name: 'Scientific Calc', url: '/finance/advanced-scientific-calculator' }
  ],
  'Image': [
    { name: 'Photo Editor', url: '/image/photo-editor' },
    { name: 'Metadata Viewer', url: '/image/image-metadata-viewer' },
    { name: 'QR Code Scanner', url: '/image/qr-code-scanner' },
    { name: 'Image Compressor', url: '/image/image-compressor' },
    { name: 'Image Converter', url: '/image/image-converter' },
    { name: 'Image Resizer', url: '/image/image-resizer' },
    { name: 'Image Cropper', url: '/image/image-cropper' },
    { name: 'Image Filter', url: '/image/image-filter' },
    { name: 'Image Watermark', url: '/image/image-watermark' },
    { name: 'Metadata Remover', url: '/image/image-metadata-remover' },
    { name: 'Batch Processor', url: '/image/image-batch-processor' },
    { name: 'Batch Frame', url: '/image/batch-frame' }
  ],
  'Generator': [
    { name: 'Barcode Generator', url: '/generator/barcode-generator' },
    { name: 'QR Code Generator', url: '/generator/qr-code-generator' },
    { name: 'Password Generator', url: '/generator/password-generator' },
    { name: 'Text Case Generator', url: '/generator/text-case-generator' },
    { name: 'Slug Generator', url: '/generator/slug-generator' }
  ],
  'Career': [
    { name: 'Resume Builder', url: '/career/resume-builder' },
    { name: 'Cover Letter Generator', url: '/career/cover-letter-generator' },
    { name: 'Job Application Tracker', url: '/career/job-application-tracker' }
  ]
};

export function CategoryDropdown({ category, isActive }) {
  const categoryKey = Object.keys(TOOLS_MAPPING).find(
    k => k.toLowerCase() === category?.toLowerCase()
  );
  
  const tools = categoryKey ? TOOLS_MAPPING[categoryKey] : [];

  if (!categoryKey) return null;

  return (
    <li className="relative group">
      <button className={`flex items-center text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md ${isActive ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}>
        {category}
      </button>
      
      <div className="absolute top-full left-0 pt-2 hidden group-hover:block z-[9999]">
        <div className="bg-background border border-border rounded-xl shadow-xl w-[260px] p-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="mb-2 px-3 py-2 flex items-center justify-between border-b border-border">
            <h4 className="text-sm font-bold text-foreground">{categoryKey}</h4>
            <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {tools.length}
            </span>
          </div>
          
          {tools.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No tools found.
            </div>
          ) : (
            <ul className="flex flex-col max-h-[60vh] overflow-y-auto custom-scrollbar pb-1">
              {tools.map(tool => (
                <li key={tool.url}>
                  <Link
                    to={tool.url}
                    className="flex items-center justify-between select-none rounded-md px-3 py-2.5 text-sm font-medium leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground group/link"
                  >
                    <span className="truncate pr-2">{tool.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-muted-foreground shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}

export default CategoryDropdown;