export const toolPageContent = [
  // Document Tools
  {
    toolName: "Receipt Generator",
    slug: "receipt-generator",
    category: "document",
    description: "Generate professional business receipts quickly and securely.",
    howItWorks: "Fill in the required fields and instantly download a formatted PDF receipt.",
    features: ["Custom branding", "PDF export", "Local processing"],
    faqs: [{ question: "Is it free?", answer: "Yes, totally free." }]
  },
  {
    toolName: "Certificate Generator",
    slug: "certificate-generator",
    category: "document",
    description: "Create beautiful, custom certificates for courses and achievements.",
    howItWorks: "Select a template, customize the text, and download your certificate.",
    features: ["Multiple templates", "High-res export", "No watermarks"],
    faqs: [{ question: "Can I use my own logo?", answer: "Yes, logo upload is supported." }]
  },
  {
    toolName: "Letter Generator",
    slug: "letter-generator",
    category: "document",
    description: "Draft formal business letters and correspondence effortlessly.",
    howItWorks: "Use structured templates to build a professional letter.",
    features: ["Standard formats", "PDF export", "Privacy focused"],
    faqs: [{ question: "Are my letters saved?", answer: "No, everything is processed locally." }]
  },
  {
    toolName: "Contract Generator",
    slug: "contract-generator",
    category: "document",
    description: "Generate standard legal contracts for freelancing or services.",
    howItWorks: "Fill in the variables to produce a formatted contract PDF.",
    features: ["Standard clauses", "Digital signature ready", "Fast generation"],
    faqs: [{ question: "Is this legal advice?", answer: "No, these are templates. Consult a lawyer for final contracts." }]
  },
  {
    toolName: "Proposal Generator",
    slug: "proposal-generator",
    category: "document",
    description: "Create compelling business proposals to win new clients.",
    howItWorks: "Input project scope, pricing, and timelines into our generator.",
    features: ["Clean layout", "Pricing tables", "PDF output"],
    faqs: [{ question: "Can I edit sections?", answer: "Yes, you can fully customize the content." }]
  },
  {
    toolName: "Quote Generator",
    slug: "quote-generator",
    category: "document",
    description: "Send accurate, professional price quotes to potential clients.",
    howItWorks: "Add your items, adjust taxes, and export as a PDF.",
    features: ["Auto-calculation", "Tax support", "Professional design"],
    faqs: [{ question: "Is it the same as an invoice?", answer: "A quote is an estimate before work begins, an invoice is for payment." }]
  },
  {
    toolName: "Bill Generator",
    slug: "bill-generator",
    category: "document",
    description: "Create professional bills and invoices for your business.",
    howItWorks: "Enter your business details, client info, and line items to generate a PDF bill.",
    features: ["Auto-calculation", "Tax support", "PDF export"],
    faqs: [{ question: "Can I add my logo?", answer: "Yes, you can upload a custom logo for your bills." }]
  },
  {
    toolName: "Invoice Generator",
    slug: "invoice-generator",
    category: "document",
    description: "Generate detailed, professional invoices for clients.",
    howItWorks: "Fill in the invoice details, add items, and download as a PDF.",
    features: ["Professional templates", "Tax calculation", "Instant PDF download"],
    faqs: [{ question: "Are my invoices saved?", answer: "No, they are generated locally for your privacy." }]
  },
  
  // PDF Tools
  {
    toolName: "Document Scanner",
    slug: "document-scanner",
    category: "pdf",
    description: "Scan physical documents using your device camera and convert to PDF.",
    howItWorks: "Use your camera to capture pages, adjust crop and filters, then export as PDF.",
    features: ["Camera integration", "Auto-enhance", "Multi-page PDF export"],
    faqs: [{ question: "Does it work on mobile?", answer: "Yes, it is optimized for mobile device cameras." }]
  },
  {
    toolName: "PDF Compressor",
    slug: "pdf-compressor",
    category: "pdf",
    description: "Reduce PDF file size without losing quality.",
    howItWorks: "Our local engine optimizes internal images and structure.",
    features: ["High compression ratio", "Local processing", "Secure"],
    faqs: [{ question: "Is my PDF uploaded?", answer: "No, compressed entirely in your browser." }]
  },
  {
    toolName: "PDF Merger",
    slug: "pdf-merger",
    category: "pdf",
    description: "Combine multiple PDF files into a single document.",
    howItWorks: "Drag and drop PDFs, arrange order, and merge.",
    features: ["Drag and drop", "Reorder files", "Fast processing"],
    faqs: [{ question: "Is there a limit to how many files?", answer: "Limited only by your browser's memory." }]
  },
  {
    toolName: "PDF Splitter",
    slug: "pdf-splitter",
    category: "pdf",
    description: "Split a large PDF into individual pages or sections.",
    howItWorks: "Select page ranges to extract into separate PDF files.",
    features: ["Custom ranges", "Extract all pages", "Fast export"],
    faqs: [{ question: "Does it alter the original?", answer: "No, it creates new extracted files." }]
  },
  {
    toolName: "PDF Page Rotator",
    slug: "pdf-page-rotator",
    category: "pdf",
    description: "Rotate specific pages or entire PDF documents easily.",
    howItWorks: "Select pages and apply 90, 180, or 270 degree rotation.",
    features: ["Visual preview", "Batch rotation", "Lossless"],
    faqs: [{ question: "Is the rotation permanent?", answer: "Yes, the exported PDF will have the new rotation." }]
  },
  {
    toolName: "PDF Page Extractor",
    slug: "pdf-page-extractor",
    category: "pdf",
    description: "Extract specific pages from a PDF to create a new document.",
    howItWorks: "Click the thumbnails of pages you want to keep and export.",
    features: ["Thumbnail preview", "Multi-select", "Instant export"],
    faqs: [{ question: "Can I extract non-consecutive pages?", answer: "Yes, you can select any pages you want." }]
  },
  {
    toolName: "PDF Watermark Adder",
    slug: "pdf-watermark-adder",
    category: "pdf",
    description: "Add text or image watermarks to protect your PDF documents.",
    howItWorks: "Upload your PDF, customize watermark text/opacity, and apply.",
    features: ["Custom text", "Adjustable opacity", "Local rendering"],
    faqs: [{ question: "Can the watermark be removed?", answer: "It is flattened into the PDF making it difficult to remove." }]
  },
  {
    toolName: "PDF to Image Converter",
    slug: "pdf-to-image-converter",
    category: "pdf",
    description: "Convert PDF pages into high-quality JPEG or PNG images.",
    howItWorks: "Renders each PDF page as an image canvas and zips them for download.",
    features: ["High resolution", "ZIP export", "Multiple formats"],
    faqs: [{ question: "Does it convert all pages?", answer: "Yes, it creates an image for every page." }]
  },
  {
    toolName: "PDF Blank Page Remover",
    slug: "pdf-blank-page-remover",
    category: "pdf",
    description: "Automatically detect and remove blank pages from your PDF.",
    howItWorks: "Scans the document for empty pages and generates a clean version.",
    features: ["Auto-detection", "Manual review", "Fast cleanup"],
    faqs: [{ question: "Will it delete pages with very little text?", answer: "You can adjust the sensitivity of the detection." }]
  },
  {
    toolName: "PDF Page Number",
    slug: "pdf-page-number",
    category: "pdf",
    description: "Add page numbers to your PDF document easily.",
    howItWorks: "Choose positioning, font size, and style to stamp numbers on pages.",
    features: ["Custom positioning", "Start number offset", "Various styles"],
    faqs: [{ question: "Can I skip the first page?", answer: "Yes, you can configure it to start numbering on page 2." }]
  },
  {
    toolName: "PDF Header Footer Adder",
    slug: "pdf-header-footer-adder",
    category: "pdf",
    description: "Add custom headers and footers to every page of your PDF.",
    howItWorks: "Type your text, set alignment and margins, and apply to document.",
    features: ["Custom margins", "Date stamps", "File name stamps"],
    faqs: [{ question: "Is it applied to all pages?", answer: "Yes, it stamps every page uniformly." }]
  },
  {
    toolName: "PDF QR Code Adder",
    slug: "pdf-qr-code-adder",
    category: "pdf",
    description: "Generate and embed QR codes into your PDF pages.",
    howItWorks: "Input URL or text, generate QR, position it on the document.",
    features: ["Custom payload", "Drag positioning", "High-quality QR"],
    faqs: [{ question: "Are the QR codes scannable?", answer: "Yes, they are high-contrast and easily scannable." }]
  },
  {
    toolName: "PDF Bookmark Creator",
    slug: "pdf-bookmark-creator",
    category: "pdf",
    description: "Create internal navigation bookmarks for your PDF.",
    howItWorks: "Map page numbers to titles to generate a navigational outline.",
    features: ["Outline generation", "Hierarchical structure", "Fast processing"],
    faqs: [{ question: "Do these work in standard PDF readers?", answer: "Yes, they create standard PDF outlines." }]
  },

  // Image Tools
  {
    toolName: "Batch Frame",
    slug: "batch-frame",
    category: "image",
    description: "Apply beautiful frames to multiple images at once.",
    howItWorks: "Upload images, select a frame layout, customize borders and colors, and export.",
    features: ["Multiple layouts", "Drag and drop", "Custom borders"],
    faqs: [{ question: "Can I export as PNG?", answer: "Yes, you can choose between JPG and PNG export formats." }]
  },

  // Generator Tools
  {
    toolName: "Barcode Generator",
    slug: "barcode-generator",
    category: "generator",
    description: "Generate standard barcodes for products and inventory.",
    howItWorks: "Enter your code, select the barcode format, and download the image.",
    features: ["Multiple formats", "High resolution", "Instant generation"],
    faqs: [{ question: "Are these barcodes scannable?", answer: "Yes, they follow standard encoding rules." }]
  },
  {
    toolName: "QR Code Generator",
    slug: "qr-code-generator",
    category: "generator",
    description: "Create custom QR codes for URLs, text, or contact info.",
    howItWorks: "Input your data, customize colors, and download the QR code.",
    features: ["Custom colors", "Logo embedding", "Vector export"],
    faqs: [{ question: "Do these QR codes expire?", answer: "No, static QR codes never expire." }]
  },
  {
    toolName: "Password Generator",
    slug: "password-generator",
    category: "generator",
    description: "Generate strong, secure, and random passwords.",
    howItWorks: "Select length and character types to generate a secure password.",
    features: ["Custom length", "Special characters", "Local generation"],
    faqs: [{ question: "Are passwords saved?", answer: "No, they are generated locally and never stored." }]
  },
  {
    toolName: "Text Case Generator",
    slug: "text-case-generator",
    category: "generator",
    description: "Convert text between uppercase, lowercase, title case, and more.",
    howItWorks: "Paste your text and click the desired case format.",
    features: ["Multiple cases", "Instant conversion", "Copy to clipboard"],
    faqs: [{ question: "Is there a character limit?", answer: "No, you can convert large blocks of text." }]
  },
  {
    toolName: "Slug Generator",
    slug: "slug-generator",
    category: "generator",
    description: "Convert text into URL-friendly slugs instantly.",
    howItWorks: "Enter your text, select separator options, and copy the clean slug.",
    features: ["Custom separators", "Remove numbers", "SEO friendly"],
    faqs: [{ question: "Does it support special characters?", answer: "Special characters are automatically removed for URL safety." }]
  }
];