/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("tools");

  // First, clear all existing tools to avoid duplicates from multiple inconsistent seeds
  const existing = app.findRecordsByFilter(collection, "id != ''", "", 0, 0);
  for (const rec of existing) {
    try { app.delete(rec); } catch(e) { /* ignore */ }
  }

  // Master list of all tools with correct categories and URLs
  const tools = [
    // === FINANCE (14 tools) ===
    { name: "GST Calculator", category: "Finance", description: "Calculate GST amount and total price with tax", url: "/finance/gst-calculator", status: "active" },
    { name: "EMI Calculator", category: "Finance", description: "Calculate monthly EMI for loans with interest rates and tenure", url: "/finance/emi-calculator", status: "active" },
    { name: "Loan Calculator", category: "Finance", description: "Calculate loan repayment schedules and total interest", url: "/finance/loan-calculator", status: "active" },
    { name: "Investment Calculator", category: "Finance", description: "Plan and calculate investment returns over time", url: "/finance/investment-calculator", status: "active" },
    { name: "Salary Calculator", category: "Finance", description: "Calculate net salary after deductions and taxes", url: "/finance/salary-calculator", status: "active" },
    { name: "SIP Calculator", category: "Finance", description: "Calculate Systematic Investment Plan returns", url: "/finance/sip-calculator", status: "active" },
    { name: "FD Calculator", category: "Finance", description: "Calculate Fixed Deposit maturity amount and interest earned", url: "/finance/fd-calculator", status: "active" },
    { name: "Discount Calculator", category: "Finance", description: "Calculate discount amount and final price", url: "/finance/discount-calculator", status: "active" },
    { name: "Percentage Calculator", category: "Finance", description: "Calculate percentages, percentage change, and percentage of total", url: "/finance/percentage-calculator", status: "active" },
    { name: "Income Tax Calculator", category: "Finance", description: "Calculate income tax based on salary and deductions", url: "/finance/income-tax-calculator", status: "active" },
    { name: "Currency Converter", category: "Finance", description: "Convert between different currencies with live rates", url: "/finance/currency-converter", status: "active" },
    { name: "Advanced Scientific Calculator", category: "Finance", description: "Advanced calculator with scientific functions", url: "/finance/advanced-scientific-calculator", status: "active" },
    { name: "Age Calculator", category: "Finance", description: "Calculate exact age in years, months, and days", url: "/finance/age-calculator", status: "active" },
    { name: "Budget Planner", category: "Finance", description: "Plan and manage your monthly budget efficiently", url: "/finance/budget-planner", status: "active" },

    // === CAREER (9 tools) ===
    { name: "Resume Builder", category: "Career", description: "Create professional resumes with customizable templates", url: "/career/resume-builder", status: "active" },
    { name: "Cover Letter Generator", category: "Career", description: "Generate personalized cover letters for job applications", url: "/career/cover-letter-generator", status: "active" },
    { name: "Job Application Tracker", category: "Career", description: "Track and manage job applications, interviews, and follow-ups", url: "/career/job-application-tracker", status: "active" },
    { name: "Salary Negotiation", category: "Career", description: "Get guidance on negotiating your salary package", url: "/career/salary-negotiation", status: "active" },
    { name: "LinkedIn Optimizer", category: "Career", description: "Optimize your LinkedIn profile for better visibility", url: "/career/linkedin-optimizer", status: "active" },
    { name: "Interview Preparation", category: "Career", description: "Prepare for interviews with tips and practice tools", url: "/career/interview-preparation", status: "active" },
    { name: "Career Path Planner", category: "Career", description: "Plan your career trajectory with goal setting", url: "/career/career-path-planner", status: "active" },
    { name: "Skills Assessment", category: "Career", description: "Assess your professional skills and identify gaps", url: "/career/skills-assessment", status: "active" },
    { name: "Portfolio Builder", category: "Career", description: "Build a professional portfolio to showcase your work", url: "/career/portfolio-builder", status: "active" },

    // === IMAGE (13 tools) ===
    { name: "Image Compressor", category: "Image", description: "Compress images to reduce file size without quality loss", url: "/image/image-compressor", status: "active" },
    { name: "Image Converter", category: "Image", description: "Convert images between JPG, PNG, WebP, GIF, and BMP", url: "/image/image-converter", status: "active" },
    { name: "Image Resizer", category: "Image", description: "Resize images to specific dimensions with aspect ratio lock", url: "/image/image-resizer", status: "active" },
    { name: "Image Cropper", category: "Image", description: "Crop images to custom or preset aspect ratios", url: "/image/image-cropper", status: "active" },
    { name: "Image Filter", category: "Image", description: "Apply stunning filters and adjust brightness, contrast", url: "/image/image-filter", status: "active" },
    { name: "Image Watermark", category: "Image", description: "Add custom text or image watermarks to protect photos", url: "/image/image-watermark", status: "active" },
    { name: "Metadata Remover", category: "Image", description: "Strip EXIF data from photos to protect privacy", url: "/image/image-metadata-remover", status: "active" },
    { name: "Batch Processor", category: "Image", description: "Process multiple images simultaneously", url: "/image/image-batch-processor", status: "active" },
    { name: "Photo Editor", category: "Image", description: "Edit photos with filters, brightness, contrast adjustments", url: "/image/photo-editor", status: "active" },
    { name: "QR Code Scanner", category: "Image", description: "Scan and decode QR codes from images", url: "/image/qr-code-scanner", status: "active" },
    { name: "Image Metadata Viewer", category: "Image", description: "View EXIF and metadata information from images", url: "/image/image-metadata-viewer", status: "active" },
    { name: "Batch Frame", category: "Image", description: "Apply frames and layouts to multiple images at once", url: "/image/batch-frame", status: "active" },
    { name: "Watermark Remover", category: "Image", description: "Remove watermarks from images", url: "/image/watermark-remover", status: "active" },

    // === DOCUMENT (8 tools) ===
    { name: "Receipt Generator", category: "Document", description: "Generate professional receipts for transactions", url: "/document/receipt-generator", status: "active" },
    { name: "Certificate Generator", category: "Document", description: "Create customizable certificates for achievements", url: "/document/certificate-generator", status: "active" },
    { name: "Letter Generator", category: "Document", description: "Generate professional letters with templates", url: "/document/letter-generator", status: "active" },
    { name: "Contract Generator", category: "Document", description: "Create legal contracts with customizable terms", url: "/document/contract-generator", status: "active" },
    { name: "Proposal Generator", category: "Document", description: "Generate professional business proposals", url: "/document/proposal-generator", status: "active" },
    { name: "Quote Generator", category: "Document", description: "Create professional quotes for products and services", url: "/document/quote-generator", status: "active" },
    { name: "Bill Generator", category: "Document", description: "Generate bills and statements for customers", url: "/document/bill-generator", status: "active" },
    { name: "Invoice Generator", category: "Document", description: "Create professional GST invoices online", url: "/document/invoice-generator", status: "active" },

    // === PDF (16 tools) ===
    { name: "Document Scanner", category: "PDF", description: "Scan physical documents to PDF using your camera", url: "/pdf/document-scanner", status: "active" },
    { name: "PDF Compressor", category: "PDF", description: "Reduce PDF file size without losing quality", url: "/pdf/pdf-compressor", status: "active" },
    { name: "PDF Merger", category: "PDF", description: "Combine multiple PDF files into one document", url: "/pdf/pdf-merger", status: "active" },
    { name: "PDF Splitter", category: "PDF", description: "Split PDF into multiple individual files", url: "/pdf/pdf-splitter", status: "active" },
    { name: "PDF Page Rotator", category: "PDF", description: "Rotate specific PDF pages", url: "/pdf/pdf-page-rotator", status: "active" },
    { name: "PDF Page Extractor", category: "PDF", description: "Extract specific pages from your PDF", url: "/pdf/pdf-page-extractor", status: "active" },
    { name: "PDF Watermark Adder", category: "PDF", description: "Add a watermark text or image to PDF", url: "/pdf/pdf-watermark-adder", status: "active" },
    { name: "PDF to Image Converter", category: "PDF", description: "Convert PDF pages into images", url: "/pdf/pdf-to-image-converter", status: "active" },
    { name: "PDF Blank Page Remover", category: "PDF", description: "Auto-remove blank pages from PDF", url: "/pdf/pdf-blank-page-remover", status: "active" },
    { name: "PDF Page Number", category: "PDF", description: "Add page numbers to your document", url: "/pdf/pdf-page-number", status: "active" },
    { name: "PDF Header Footer Adder", category: "PDF", description: "Add custom headers and footers to PDF", url: "/pdf/pdf-header-footer-adder", status: "active" },
    { name: "PDF QR Code Adder", category: "PDF", description: "Embed QR codes into PDF documents", url: "/pdf/pdf-qr-code-adder", status: "active" },
    { name: "PDF Bookmark Creator", category: "PDF", description: "Create internal navigation bookmarks in PDF", url: "/pdf/pdf-bookmark-creator", status: "active" },
    { name: "PDF Text Adder", category: "PDF", description: "Add text annotations to PDF documents", url: "/pdf/pdf-text-adder", status: "active" },
    { name: "Excel to PDF", category: "PDF", description: "Convert Excel spreadsheets to PDF format", url: "/pdf/excel-to-pdf", status: "active" },
    { name: "Word to PDF", category: "PDF", description: "Convert Word documents to PDF format", url: "/pdf/word-to-pdf", status: "active" },

    // === DEVELOPER TOOLS (12 tools) ===
    { name: "JSON Formatter", category: "Developer Tools", description: "Format, validate, and beautify JSON data", url: "/developer/json-formatter", status: "active" },
    { name: "XML Formatter", category: "Developer Tools", description: "Format and validate XML documents", url: "/developer/xml-formatter", status: "active" },
    { name: "Code Beautifier", category: "Developer Tools", description: "Format and beautify code in multiple languages", url: "/developer/code-beautifier", status: "active" },
    { name: "Color Picker", category: "Developer Tools", description: "Pick and convert colors between HEX, RGB, HSL", url: "/developer/color-picker", status: "active" },
    { name: "Base64 Encoder", category: "Developer Tools", description: "Encode and decode text using Base64 encoding", url: "/developer/base64-encoder-decoder", status: "active" },
    { name: "Markdown to HTML", category: "Developer Tools", description: "Convert Markdown text to HTML with preview", url: "/developer/markdown-to-html", status: "active" },
    { name: "HTML Preview", category: "Developer Tools", description: "Preview and validate HTML code in real-time", url: "/developer/html-preview", status: "active" },
    { name: "URL Encoder", category: "Developer Tools", description: "Encode and decode URLs and query parameters", url: "/developer/url-encoder", status: "active" },
    { name: "Word Counter", category: "Developer Tools", description: "Count words, characters, sentences in text", url: "/developer/word-counter", status: "active" },
    { name: "UUID Generator", category: "Developer Tools", description: "Generate unique identifiers (UUIDs)", url: "/developer/uuid-generator", status: "active" },
    { name: "Text to Speech", category: "Developer Tools", description: "Convert text to natural-sounding speech", url: "/developer/text-to-speech", status: "active" },
    { name: "Speech to Text", category: "Developer Tools", description: "Convert audio and speech to text", url: "/developer/speech-to-text", status: "active" },

    // === GENERATOR (7 tools) ===
    { name: "Barcode Generator", category: "Generators", description: "Generate barcodes in various formats", url: "/generator/barcode-generator", status: "active" },
    { name: "QR Code Generator", category: "Generators", description: "Create QR codes for URLs, text, and contact info", url: "/generator/qr-code-generator", status: "active" },
    { name: "Password Generator", category: "Generators", description: "Generate strong and secure passwords", url: "/generator/password-generator", status: "active" },
    { name: "Text Case Converter", category: "Generators", description: "Convert text between different cases", url: "/generator/text-case-generator", status: "active" },
    { name: "Slug Generator", category: "Generators", description: "Generate URL-friendly slugs from text", url: "/generator/slug-generator", status: "active" },
    { name: "Random Name Generator", category: "Generators", description: "Generate random names for characters and projects", url: "/generator/random-name-generator", status: "active" },
    { name: "Number to Words", category: "Generators", description: "Convert numbers to their word equivalents", url: "/generator/number-to-words", status: "active" },

    // === SCIENCE (16 tools) ===
    { name: "Molarity Calculator", category: "Science", description: "Calculate molarity of solutions", url: "/science/molarity-calculator", status: "active" },
    { name: "Normality Calculator", category: "Science", description: "Calculate normality of solutions for acid-base chemistry", url: "/science/normality-calculator", status: "active" },
    { name: "Dilution Calculator", category: "Science", description: "Calculate dilution ratios and concentrations", url: "/science/dilution-calculator", status: "active" },
    { name: "Mole Fraction Calculator", category: "Science", description: "Calculate mole fractions in chemical mixtures", url: "/science/mole-fraction-calculator", status: "active" },
    { name: "Molality Calculator", category: "Science", description: "Calculate molality of solutions", url: "/science/molality-calculator", status: "active" },
    { name: "pH Calculator", category: "Science", description: "Calculate pH and pOH values for acids and bases", url: "/science/ph-calculator", status: "active" },
    { name: "Velocity Calculator", category: "Science", description: "Calculate velocity, speed, and acceleration", url: "/science/velocity-calculator", status: "active" },
    { name: "Force Calculator", category: "Science", description: "Calculate force using Newton's laws of motion", url: "/science/force-calculator", status: "active" },
    { name: "Work Calculator", category: "Science", description: "Calculate work done by forces", url: "/science/work-calculator", status: "active" },
    { name: "Power Calculator", category: "Science", description: "Calculate power and energy consumption rates", url: "/science/power-calculator", status: "active" },
    { name: "Kinetic Energy Calculator", category: "Science", description: "Calculate kinetic energy of moving objects", url: "/science/kinetic-energy-calculator", status: "active" },
    { name: "Potential Energy Calculator", category: "Science", description: "Calculate gravitational and elastic potential energy", url: "/science/potential-energy-calculator", status: "active" },
    { name: "Ohm's Law Calculator", category: "Science", description: "Calculate voltage, current, and resistance", url: "/science/ohms-law-calculator", status: "active" },
    { name: "Pressure Calculator", category: "Science", description: "Calculate pressure, force, and area relationships", url: "/science/pressure-calculator", status: "active" },
    { name: "Wave Speed Calculator", category: "Science", description: "Calculate wave speed, frequency, and wavelength", url: "/science/wave-speed-calculator", status: "active" },
    { name: "DNA/RNA Converter", category: "Science", description: "Convert between DNA and RNA sequences", url: "/science/dna-rna-converter", status: "active" },

    // === PRODUCTIVITY (14 tools) ===
    { name: "Smart To-Do List", category: "Productivity", description: "Create and manage intelligent to-do lists", url: "/productivity/smart-todo-list", status: "active" },
    { name: "Task Board", category: "Productivity", description: "Organize tasks on a Kanban-style board", url: "/productivity/task-board", status: "active" },
    { name: "Daily Planner", category: "Productivity", description: "Plan your day with hourly schedules", url: "/productivity/daily-planner", status: "active" },
    { name: "Sticky Notes", category: "Productivity", description: "Create digital sticky notes for quick reminders", url: "/productivity/sticky-notes", status: "active" },
    { name: "Meeting Notes", category: "Productivity", description: "Take and organize meeting notes with action items", url: "/productivity/meeting-notes", status: "active" },
    { name: "Countdown Timer", category: "Productivity", description: "Set countdown timers for events and deadlines", url: "/productivity/countdown-timer", status: "active" },
    { name: "Pomodoro Timer", category: "Productivity", description: "Use the Pomodoro Technique for focused work", url: "/productivity/pomodoro-timer", status: "active" },
    { name: "Habit Streak", category: "Productivity", description: "Track daily habits and build streaks", url: "/productivity/habit-streak", status: "active" },
    { name: "Water Tracker", category: "Productivity", description: "Track daily water intake and stay hydrated", url: "/productivity/water-tracker", status: "active" },
    { name: "Mood Tracker", category: "Productivity", description: "Log and track your mood throughout the day", url: "/productivity/mood-tracker", status: "active" },
    { name: "Expense Reminder", category: "Productivity", description: "Set reminders for bills and expense tracking", url: "/productivity/expense-reminder", status: "active" },
    { name: "Medicine Reminder", category: "Productivity", description: "Get reminders for taking medicines on schedule", url: "/productivity/medicine-reminder", status: "active" },
    { name: "Meal Planner", category: "Productivity", description: "Plan meals for the week with recipes", url: "/productivity/meal-planner", status: "active" },
    { name: "Routine Builder", category: "Productivity", description: "Create and manage daily routines", url: "/productivity/routine-builder", status: "active" },

    // === CONVERTERS (9 tools) ===
    { name: "Length Converter", category: "Converters", description: "Convert between units of length and distance", url: "/converters/length-converter", status: "active" },
    { name: "Weight Converter", category: "Converters", description: "Convert between units of weight and mass", url: "/converters/weight-converter", status: "active" },
    { name: "Temperature Converter", category: "Converters", description: "Convert between Celsius, Fahrenheit, and Kelvin", url: "/converters/temperature-converter", status: "active" },
    { name: "Volume Converter", category: "Converters", description: "Convert between units of volume and capacity", url: "/converters/volume-converter", status: "active" },
    { name: "Speed Converter", category: "Converters", description: "Convert between units of speed", url: "/converters/speed-converter", status: "active" },
    { name: "Area Converter", category: "Converters", description: "Convert between units of area", url: "/converters/area-converter", status: "active" },
    { name: "Audio Converter", category: "Converters", description: "Convert audio files between different formats", url: "/converters/audio-converter", status: "active" },
    { name: "Video Converter", category: "Converters", description: "Convert video files between different formats", url: "/converters/video-converter", status: "active" },
    { name: "Subtitle Converter", category: "Converters", description: "Convert subtitle files between formats", url: "/converters/subtitle-converter", status: "active" },

    // === REAL ESTATE (4 tools) ===
    { name: "Construction Cost Calculator", category: "Real Estate", description: "Calculate construction costs for projects", url: "/real-estate/construction-cost-calculator", status: "active" },
    { name: "Paint Calculator", category: "Real Estate", description: "Calculate paint needed for rooms and walls", url: "/real-estate/paint-calculator", status: "active" },
    { name: "Tile Calculator", category: "Real Estate", description: "Calculate tiles needed for floors and walls", url: "/real-estate/tile-calculator", status: "active" },
    { name: "Carpet Area Calculator", category: "Real Estate", description: "Calculate carpet area from built-up area", url: "/real-estate/carpet-area-calculator", status: "active" },

    // === INVITATIONS (2 tools) ===
    { name: "Birthday Invitations", category: "Invitations", description: "Create beautiful birthday invitation cards", url: "/invitations/birthday-invitations", status: "active" },
    { name: "Wedding Invitations", category: "Invitations", description: "Design elegant wedding invitation cards", url: "/invitations/wedding-invitations", status: "active" },
  ];

  // Insert all tools
  let successCount = 0;
  for (const tool of tools) {
    const record = new Record(collection);
    record.set("name", tool.name);
    record.set("category", tool.category);
    record.set("description", tool.description);
    record.set("url", tool.url);
    record.set("status", tool.status);
    try {
      app.save(record);
      successCount++;
    } catch (e) {
      console.log(`Failed to save tool "${tool.name}": ${e.message}`);
    }
  }

  console.log(`Successfully seeded ${successCount} of ${tools.length} tools.`);
}, (app) => {
  // Rollback: cannot easily undo, manual cleanup needed
  console.log("Rollback not supported for this migration");
})
