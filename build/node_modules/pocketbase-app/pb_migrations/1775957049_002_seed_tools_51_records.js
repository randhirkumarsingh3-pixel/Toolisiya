/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("tools");

  const record0 = new Record(collection);
    record0.set("name", "EMI Calculator");
    record0.set("category", "FINANCE");
    record0.set("description", "Calculate monthly EMI for loans with interest rates and tenure");
    record0.set("enabled", true);
    record0.set("url", "/tools/emi-calculator");
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("name", "FD Calculator");
    record1.set("category", "FINANCE");
    record1.set("description", "Calculate Fixed Deposit maturity amount and interest earned");
    record1.set("enabled", true);
    record1.set("url", "/tools/fd-calculator");
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("name", "Investment Calculator");
    record2.set("category", "FINANCE");
    record2.set("description", "Plan and calculate investment returns over time");
    record2.set("enabled", true);
    record2.set("url", "/tools/investment-calculator");
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("name", "Loan Calculator");
    record3.set("category", "FINANCE");
    record3.set("description", "Calculate loan repayment schedules and total interest");
    record3.set("enabled", true);
    record3.set("url", "/tools/loan-calculator");
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("name", "SIP Calculator");
    record4.set("category", "FINANCE");
    record4.set("description", "Calculate Systematic Investment Plan returns");
    record4.set("enabled", true);
    record4.set("url", "/tools/sip-calculator");
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record5 = new Record(collection);
    record5.set("name", "Salary Calculator");
    record5.set("category", "FINANCE");
    record5.set("description", "Calculate net salary after deductions and taxes");
    record5.set("enabled", true);
    record5.set("url", "/tools/salary-calculator");
  try {
    app.save(record5);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record6 = new Record(collection);
    record6.set("name", "GST Calculator");
    record6.set("category", "FINANCE");
    record6.set("description", "Calculate GST amount and total price with tax");
    record6.set("enabled", true);
    record6.set("url", "/tools/gst-calculator");
  try {
    app.save(record6);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record7 = new Record(collection);
    record7.set("name", "Tax Calculator");
    record7.set("category", "FINANCE");
    record7.set("description", "Calculate income tax based on salary and deductions");
    record7.set("enabled", true);
    record7.set("url", "/tools/tax-calculator");
  try {
    app.save(record7);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record8 = new Record(collection);
    record8.set("name", "Discount Calculator");
    record8.set("category", "FINANCE");
    record8.set("description", "Calculate discount amount and final price");
    record8.set("enabled", true);
    record8.set("url", "/tools/discount-calculator");
  try {
    app.save(record8);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record9 = new Record(collection);
    record9.set("name", "Percentage Calculator");
    record9.set("category", "FINANCE");
    record9.set("description", "Calculate percentages, percentage change, and percentage of total");
    record9.set("enabled", true);
    record9.set("url", "/tools/percentage-calculator");
  try {
    app.save(record9);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record10 = new Record(collection);
    record10.set("name", "Currency Converter");
    record10.set("category", "FINANCE");
    record10.set("description", "Convert between different currencies with live rates");
    record10.set("enabled", true);
    record10.set("url", "/tools/currency-converter");
  try {
    app.save(record10);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record11 = new Record(collection);
    record11.set("name", "Interview Preparation");
    record11.set("category", "CAREER");
    record11.set("description", "Prepare for job interviews with questions and tips");
    record11.set("enabled", true);
    record11.set("url", "/tools/interview-preparation");
  try {
    app.save(record11);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record12 = new Record(collection);
    record12.set("name", "LinkedIn Optimizer");
    record12.set("category", "CAREER");
    record12.set("description", "Optimize your LinkedIn profile for better visibility");
    record12.set("enabled", true);
    record12.set("url", "/tools/linkedin-optimizer");
  try {
    app.save(record12);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record13 = new Record(collection);
    record13.set("name", "Salary Negotiation");
    record13.set("category", "CAREER");
    record13.set("description", "Get guidance on negotiating your salary package");
    record13.set("enabled", true);
    record13.set("url", "/tools/salary-negotiation");
  try {
    app.save(record13);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record14 = new Record(collection);
    record14.set("name", "Skills Assessment");
    record14.set("category", "CAREER");
    record14.set("description", "Assess your professional skills and identify gaps");
    record14.set("enabled", true);
    record14.set("url", "/tools/skills-assessment");
  try {
    app.save(record14);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record15 = new Record(collection);
    record15.set("name", "Career Path Planner");
    record15.set("category", "CAREER");
    record15.set("description", "Plan your career progression and development");
    record15.set("enabled", true);
    record15.set("url", "/tools/career-path-planner");
  try {
    app.save(record15);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record16 = new Record(collection);
    record16.set("name", "Image Compressor");
    record16.set("category", "IMAGE");
    record16.set("description", "Compress images to reduce file size without quality loss");
    record16.set("enabled", true);
    record16.set("url", "/tools/image-compressor");
  try {
    app.save(record16);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record17 = new Record(collection);
    record17.set("name", "Image Converter");
    record17.set("category", "IMAGE");
    record17.set("description", "Convert images between different formats (JPG, PNG, WebP, etc.)");
    record17.set("enabled", true);
    record17.set("url", "/tools/image-converter");
  try {
    app.save(record17);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record18 = new Record(collection);
    record18.set("name", "Image Cropper");
    record18.set("category", "IMAGE");
    record18.set("description", "Crop and resize images to desired dimensions");
    record18.set("enabled", true);
    record18.set("url", "/tools/image-cropper");
  try {
    app.save(record18);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record19 = new Record(collection);
    record19.set("name", "Image Filter");
    record19.set("category", "IMAGE");
    record19.set("description", "Apply filters and effects to images");
    record19.set("enabled", true);
    record19.set("url", "/tools/image-filter");
  try {
    app.save(record19);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record20 = new Record(collection);
    record20.set("name", "Image Resizer");
    record20.set("category", "IMAGE");
    record20.set("description", "Resize images to specific dimensions");
    record20.set("enabled", true);
    record20.set("url", "/tools/image-resizer");
  try {
    app.save(record20);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record21 = new Record(collection);
    record21.set("name", "Image Watermark");
    record21.set("category", "IMAGE");
    record21.set("description", "Add watermarks to protect your images");
    record21.set("enabled", true);
    record21.set("url", "/tools/image-watermark");
  try {
    app.save(record21);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record22 = new Record(collection);
    record22.set("name", "Image Batch Processor");
    record22.set("category", "IMAGE");
    record22.set("description", "Process multiple images at once");
    record22.set("enabled", true);
    record22.set("url", "/tools/image-batch-processor");
  try {
    app.save(record22);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record23 = new Record(collection);
    record23.set("name", "Photo Editor");
    record23.set("category", "IMAGE");
    record23.set("description", "Edit photos with various tools and effects");
    record23.set("enabled", true);
    record23.set("url", "/tools/photo-editor");
  try {
    app.save(record23);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record24 = new Record(collection);
    record24.set("name", "Barcode Generator");
    record24.set("category", "IMAGE");
    record24.set("description", "Generate barcodes for products and inventory");
    record24.set("enabled", true);
    record24.set("url", "/tools/barcode-generator");
  try {
    app.save(record24);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record25 = new Record(collection);
    record25.set("name", "QR Code Generator");
    record25.set("category", "IMAGE");
    record25.set("description", "Create QR codes for URLs, text, and contact info");
    record25.set("enabled", true);
    record25.set("url", "/tools/qr-code-generator");
  try {
    app.save(record25);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record26 = new Record(collection);
    record26.set("name", "Resume Builder");
    record26.set("category", "DOCUMENT");
    record26.set("description", "Create professional resumes with templates");
    record26.set("enabled", true);
    record26.set("url", "/tools/resume-builder");
  try {
    app.save(record26);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record27 = new Record(collection);
    record27.set("name", "Cover Letter Generator");
    record27.set("category", "DOCUMENT");
    record27.set("description", "Generate customized cover letters for job applications");
    record27.set("enabled", true);
    record27.set("url", "/tools/cover-letter-generator");
  try {
    app.save(record27);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record28 = new Record(collection);
    record28.set("name", "Invoice Generator");
    record28.set("category", "DOCUMENT");
    record28.set("description", "Create professional invoices for your business");
    record28.set("enabled", true);
    record28.set("url", "/tools/invoice-generator");
  try {
    app.save(record28);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record29 = new Record(collection);
    record29.set("name", "Bill Generator");
    record29.set("category", "DOCUMENT");
    record29.set("description", "Generate bills and receipts for transactions");
    record29.set("enabled", true);
    record29.set("url", "/tools/bill-generator");
  try {
    app.save(record29);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record30 = new Record(collection);
    record30.set("name", "Receipt Generator");
    record30.set("category", "DOCUMENT");
    record30.set("description", "Create receipts for sales and transactions");
    record30.set("enabled", true);
    record30.set("url", "/tools/receipt-generator");
  try {
    app.save(record30);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record31 = new Record(collection);
    record31.set("name", "Certificate Generator");
    record31.set("category", "DOCUMENT");
    record31.set("description", "Generate certificates for achievements and courses");
    record31.set("enabled", true);
    record31.set("url", "/tools/certificate-generator");
  try {
    app.save(record31);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record32 = new Record(collection);
    record32.set("name", "Contract Generator");
    record32.set("category", "DOCUMENT");
    record32.set("description", "Create legal contracts and agreements");
    record32.set("enabled", true);
    record32.set("url", "/tools/contract-generator");
  try {
    app.save(record32);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record33 = new Record(collection);
    record33.set("name", "Letter Generator");
    record33.set("category", "DOCUMENT");
    record33.set("description", "Generate formal and informal letters");
    record33.set("enabled", true);
    record33.set("url", "/tools/letter-generator");
  try {
    app.save(record33);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record34 = new Record(collection);
    record34.set("name", "Proposal Generator");
    record34.set("category", "DOCUMENT");
    record34.set("description", "Create professional business proposals");
    record34.set("enabled", true);
    record34.set("url", "/tools/proposal-generator");
  try {
    app.save(record34);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record35 = new Record(collection);
    record35.set("name", "Quote Generator");
    record35.set("category", "DOCUMENT");
    record35.set("description", "Generate quotes for products and services");
    record35.set("enabled", true);
    record35.set("url", "/tools/quote-generator");
  try {
    app.save(record35);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record36 = new Record(collection);
    record36.set("name", "Word Counter");
    record36.set("category", "UTILITIES");
    record36.set("description", "Count words, characters, and sentences in text");
    record36.set("enabled", true);
    record36.set("url", "/tools/word-counter");
  try {
    app.save(record36);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record37 = new Record(collection);
    record37.set("name", "Text Case Converter");
    record37.set("category", "UTILITIES");
    record37.set("description", "Convert text between different cases (uppercase, lowercase, title case)");
    record37.set("enabled", true);
    record37.set("url", "/tools/text-case-converter");
  try {
    app.save(record37);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record38 = new Record(collection);
    record38.set("name", "Password Generator");
    record38.set("category", "UTILITIES");
    record38.set("description", "Generate strong and secure passwords");
    record38.set("enabled", true);
    record38.set("url", "/tools/password-generator");
  try {
    app.save(record38);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record39 = new Record(collection);
    record39.set("name", "UUID Generator");
    record39.set("category", "UTILITIES");
    record39.set("description", "Generate unique identifiers (UUIDs)");
    record39.set("enabled", true);
    record39.set("url", "/tools/uuid-generator");
  try {
    app.save(record39);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record40 = new Record(collection);
    record40.set("name", "URL Encoder");
    record40.set("category", "UTILITIES");
    record40.set("description", "Encode and decode URLs");
    record40.set("enabled", true);
    record40.set("url", "/tools/url-encoder");
  try {
    app.save(record40);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record41 = new Record(collection);
    record41.set("name", "Base64 Encoder");
    record41.set("category", "UTILITIES");
    record41.set("description", "Encode and decode Base64 strings");
    record41.set("enabled", true);
    record41.set("url", "/tools/base64-encoder");
  try {
    app.save(record41);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record42 = new Record(collection);
    record42.set("name", "JSON Formatter");
    record42.set("category", "UTILITIES");
    record42.set("description", "Format and validate JSON data");
    record42.set("enabled", true);
    record42.set("url", "/tools/json-formatter");
  try {
    app.save(record42);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record43 = new Record(collection);
    record43.set("name", "XML Formatter");
    record43.set("category", "UTILITIES");
    record43.set("description", "Format and validate XML data");
    record43.set("enabled", true);
    record43.set("url", "/tools/xml-formatter");
  try {
    app.save(record43);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record44 = new Record(collection);
    record44.set("name", "Markdown to HTML");
    record44.set("category", "UTILITIES");
    record44.set("description", "Convert Markdown to HTML");
    record44.set("enabled", true);
    record44.set("url", "/tools/markdown-to-html");
  try {
    app.save(record44);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record45 = new Record(collection);
    record45.set("name", "HTML Preview");
    record45.set("category", "UTILITIES");
    record45.set("description", "Preview and validate HTML code");
    record45.set("enabled", true);
    record45.set("url", "/tools/html-preview");
  try {
    app.save(record45);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record46 = new Record(collection);
    record46.set("name", "Science Calculator");
    record46.set("category", "SCIENCE");
    record46.set("description", "Physics calculator for scientific calculations");
    record46.set("enabled", true);
    record46.set("url", "/tools/science-calculator");
  try {
    app.save(record46);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record47 = new Record(collection);
    record47.set("name", "Text to Speech");
    record47.set("category", "PRODUCTIVITY");
    record47.set("description", "Convert text to speech audio");
    record47.set("enabled", true);
    record47.set("url", "/tools/text-to-speech");
  try {
    app.save(record47);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record48 = new Record(collection);
    record48.set("name", "Speech to Text");
    record48.set("category", "PRODUCTIVITY");
    record48.set("description", "Convert speech to text transcription");
    record48.set("enabled", true);
    record48.set("url", "/tools/speech-to-text");
  try {
    app.save(record48);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record49 = new Record(collection);
    record49.set("name", "Countdown Timer");
    record49.set("category", "PRODUCTIVITY");
    record49.set("description", "Set countdown timers for tasks and events");
    record49.set("enabled", true);
    record49.set("url", "/tools/countdown-timer");
  try {
    app.save(record49);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record50 = new Record(collection);
    record50.set("name", "Pomodoro Timer");
    record50.set("category", "PRODUCTIVITY");
    record50.set("description", "Use Pomodoro technique for productivity management");
    record50.set("enabled", true);
    record50.set("url", "/tools/pomodoro-timer");
  try {
    app.save(record50);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})