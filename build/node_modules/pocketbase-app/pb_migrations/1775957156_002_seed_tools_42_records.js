/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("tools");

  const record0 = new Record(collection);
    record0.set("name", "Simple Interest Calculator");
    record0.set("category", "Finance");
    record0.set("description", "Calculate simple interest on investments");
    record0.set("enabled", true);
    record0.set("url", "/simple-interest-calculator");
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
    record1.set("name", "Compound Interest Calculator");
    record1.set("category", "Finance");
    record1.set("description", "Calculate compound interest over time");
    record1.set("enabled", true);
    record1.set("url", "/compound-interest-calculator");
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
    record2.set("name", "EMI Calculator");
    record2.set("category", "Finance");
    record2.set("description", "Calculate monthly EMI for loans");
    record2.set("enabled", true);
    record2.set("url", "/emi-calculator");
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
    record3.set("category", "Finance");
    record3.set("description", "Calculate loan repayment schedules");
    record3.set("enabled", true);
    record3.set("url", "/loan-calculator");
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
    record4.set("name", "Investment Calculator");
    record4.set("category", "Finance");
    record4.set("description", "Calculate investment returns");
    record4.set("enabled", true);
    record4.set("url", "/investment-calculator");
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
    record5.set("category", "Finance");
    record5.set("description", "Calculate salary and deductions");
    record5.set("enabled", true);
    record5.set("url", "/salary-calculator");
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
    record6.set("name", "Tax Calculator");
    record6.set("category", "Finance");
    record6.set("description", "Calculate income tax");
    record6.set("enabled", true);
    record6.set("url", "/tax-calculator");
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
    record7.set("name", "Expense Tracker");
    record7.set("category", "Finance");
    record7.set("description", "Track daily expenses");
    record7.set("enabled", true);
    record7.set("url", "/expense-tracker");
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
    record8.set("name", "Budget Planner");
    record8.set("category", "Finance");
    record8.set("description", "Plan and manage budget");
    record8.set("enabled", true);
    record8.set("url", "/budget-planner");
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
    record9.set("name", "Cryptocurrency Converter");
    record9.set("category", "Finance");
    record9.set("description", "Convert cryptocurrency values");
    record9.set("enabled", true);
    record9.set("url", "/crypto-converter");
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
    record10.set("name", "Resume Builder");
    record10.set("category", "Career");
    record10.set("description", "Create professional resume");
    record10.set("enabled", true);
    record10.set("url", "/resume-builder");
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
    record11.set("name", "Cover Letter Generator");
    record11.set("category", "Career");
    record11.set("description", "Generate cover letters");
    record11.set("enabled", true);
    record11.set("url", "/cover-letter-generator");
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
    record12.set("name", "Interview Prep");
    record12.set("category", "Career");
    record12.set("description", "Prepare for interviews");
    record12.set("enabled", true);
    record12.set("url", "/interview-prep");
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
    record13.set("name", "Salary Negotiator");
    record13.set("category", "Career");
    record13.set("description", "Negotiate salary offers");
    record13.set("enabled", true);
    record13.set("url", "/salary-negotiator");
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
    record14.set("name", "Career Path Finder");
    record14.set("category", "Career");
    record14.set("description", "Find your career path");
    record14.set("enabled", true);
    record14.set("url", "/career-path-finder");
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
    record15.set("name", "Skill Assessment");
    record15.set("category", "Career");
    record15.set("description", "Assess your skills");
    record15.set("enabled", true);
    record15.set("url", "/skill-assessment");
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
    record16.set("category", "Image");
    record16.set("description", "Compress images");
    record16.set("enabled", true);
    record16.set("url", "/image-compressor");
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
    record17.set("category", "Image");
    record17.set("description", "Convert image formats");
    record17.set("enabled", true);
    record17.set("url", "/image-converter");
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
    record18.set("name", "Image Resizer");
    record18.set("category", "Image");
    record18.set("description", "Resize images");
    record18.set("enabled", true);
    record18.set("url", "/image-resizer");
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
    record19.set("name", "QR Code Generator");
    record19.set("category", "Image");
    record19.set("description", "Generate QR codes");
    record19.set("enabled", true);
    record19.set("url", "/qr-code-generator");
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
    record20.set("name", "Barcode Generator");
    record20.set("category", "Image");
    record20.set("description", "Generate barcodes");
    record20.set("enabled", true);
    record20.set("url", "/barcode-generator");
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
    record21.set("category", "Image");
    record21.set("description", "Add watermarks to images");
    record21.set("enabled", true);
    record21.set("url", "/image-watermark");
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
    record22.set("name", "Image Cropper");
    record22.set("category", "Image");
    record22.set("description", "Crop images");
    record22.set("enabled", true);
    record22.set("url", "/image-cropper");
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
    record23.set("name", "PDF Merger");
    record23.set("category", "Document");
    record23.set("description", "Merge PDF files");
    record23.set("enabled", true);
    record23.set("url", "/pdf-merger");
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
    record24.set("name", "PDF Splitter");
    record24.set("category", "Document");
    record24.set("description", "Split PDF files");
    record24.set("enabled", true);
    record24.set("url", "/pdf-splitter");
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
    record25.set("name", "PDF Converter");
    record25.set("category", "Document");
    record25.set("description", "Convert to/from PDF");
    record25.set("enabled", true);
    record25.set("url", "/pdf-converter");
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
    record26.set("name", "Document Translator");
    record26.set("category", "Document");
    record26.set("description", "Translate documents");
    record26.set("enabled", true);
    record26.set("url", "/document-translator");
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
    record27.set("name", "Receipt Generator");
    record27.set("category", "Document");
    record27.set("description", "Generate receipts");
    record27.set("enabled", true);
    record27.set("url", "/receipt-generator");
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
    record28.set("category", "Document");
    record28.set("description", "Generate invoices");
    record28.set("enabled", true);
    record28.set("url", "/invoice-generator");
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
    record29.set("name", "Certificate Generator");
    record29.set("category", "Document");
    record29.set("description", "Generate certificates");
    record29.set("enabled", true);
    record29.set("url", "/certificate-generator");
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
    record30.set("name", "Unit Converter");
    record30.set("category", "Utilities");
    record30.set("description", "Convert units of measurement");
    record30.set("enabled", true);
    record30.set("url", "/unit-converter");
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
    record31.set("name", "Temperature Converter");
    record31.set("category", "Utilities");
    record31.set("description", "Convert temperature units");
    record31.set("enabled", true);
    record31.set("url", "/temperature-converter");
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
    record32.set("name", "Password Generator");
    record32.set("category", "Utilities");
    record32.set("description", "Generate secure passwords");
    record32.set("enabled", true);
    record32.set("url", "/password-generator");
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
    record33.set("name", "UUID Generator");
    record33.set("category", "Utilities");
    record33.set("description", "Generate UUIDs");
    record33.set("enabled", true);
    record33.set("url", "/uuid-generator");
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
    record34.set("name", "JSON Formatter");
    record34.set("category", "Utilities");
    record34.set("description", "Format JSON data");
    record34.set("enabled", true);
    record34.set("url", "/json-formatter");
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
    record35.set("name", "Base64 Encoder/Decoder");
    record35.set("category", "Utilities");
    record35.set("description", "Encode/decode Base64");
    record35.set("enabled", true);
    record35.set("url", "/base64-encoder");
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
    record36.set("name", "URL Encoder/Decoder");
    record36.set("category", "Utilities");
    record36.set("description", "Encode/decode URLs");
    record36.set("enabled", true);
    record36.set("url", "/url-encoder");
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
    record37.set("name", "Markdown to HTML");
    record37.set("category", "Utilities");
    record37.set("description", "Convert Markdown to HTML");
    record37.set("enabled", true);
    record37.set("url", "/markdown-to-html");
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
    record38.set("name", "Science Calculator");
    record38.set("category", "Science");
    record38.set("description", "Perform scientific calculations");
    record38.set("enabled", true);
    record38.set("url", "/science-calculator");
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
    record39.set("name", "Word Counter");
    record39.set("category", "Productivity");
    record39.set("description", "Count words in text");
    record39.set("enabled", true);
    record39.set("url", "/word-counter");
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
    record40.set("name", "Text to Speech");
    record40.set("category", "Productivity");
    record40.set("description", "Convert text to speech");
    record40.set("enabled", true);
    record40.set("url", "/text-to-speech");
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
    record41.set("name", "Speech to Text");
    record41.set("category", "Productivity");
    record41.set("description", "Convert speech to text");
    record41.set("enabled", true);
    record41.set("url", "/speech-to-text");
  try {
    app.save(record41);
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