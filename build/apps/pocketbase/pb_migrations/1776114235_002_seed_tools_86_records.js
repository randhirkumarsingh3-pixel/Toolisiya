/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("tools");

  const record0 = new Record(collection);
    record0.set("name", "Molarity Calculator");
    record0.set("category", "Science");
    record0.set("description", "Calculate molarity of solutions by determining moles of solute and volume of solution");
    record0.set("url", "/molarity-calculator");
    record0.set("status", "active");
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
    record1.set("name", "Normality Calculator");
    record1.set("category", "Science");
    record1.set("description", "Calculate normality of solutions for acid-base chemistry calculations");
    record1.set("url", "/normality-calculator");
    record1.set("status", "active");
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
    record2.set("name", "Dilution Calculator");
    record2.set("category", "Science");
    record2.set("description", "Calculate dilution ratios and concentrations for chemical solutions");
    record2.set("url", "/dilution-calculator");
    record2.set("status", "active");
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
    record3.set("name", "Mole Fraction Calculator");
    record3.set("category", "Science");
    record3.set("description", "Calculate mole fractions in chemical mixtures and solutions");
    record3.set("url", "/mole-fraction-calculator");
    record3.set("status", "active");
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
    record4.set("name", "Molality Calculator");
    record4.set("category", "Science");
    record4.set("description", "Calculate molality of solutions based on solute and solvent mass");
    record4.set("url", "/molality-calculator");
    record4.set("status", "active");
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
    record5.set("name", "pH Calculator");
    record5.set("category", "Science");
    record5.set("description", "Calculate pH and pOH values for acids and bases");
    record5.set("url", "/ph-calculator");
    record5.set("status", "active");
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
    record6.set("name", "Velocity Calculator");
    record6.set("category", "Science");
    record6.set("description", "Calculate velocity, speed, and acceleration in physics problems");
    record6.set("url", "/velocity-calculator");
    record6.set("status", "active");
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
    record7.set("name", "Force Calculator");
    record7.set("category", "Science");
    record7.set("description", "Calculate force using Newton's laws of motion");
    record7.set("url", "/force-calculator");
    record7.set("status", "active");
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
    record8.set("name", "Work Calculator");
    record8.set("category", "Science");
    record8.set("description", "Calculate work done by forces in physics applications");
    record8.set("url", "/work-calculator");
    record8.set("status", "active");
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
    record9.set("name", "Power Calculator");
    record9.set("category", "Science");
    record9.set("description", "Calculate power and energy consumption rates");
    record9.set("url", "/power-calculator");
    record9.set("status", "active");
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
    record10.set("name", "Kinetic Energy Calculator");
    record10.set("category", "Science");
    record10.set("description", "Calculate kinetic energy of moving objects");
    record10.set("url", "/kinetic-energy-calculator");
    record10.set("status", "active");
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
    record11.set("name", "Potential Energy Calculator");
    record11.set("category", "Science");
    record11.set("description", "Calculate gravitational and elastic potential energy");
    record11.set("url", "/potential-energy-calculator");
    record11.set("status", "active");
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
    record12.set("name", "Ohm's Law Calculator");
    record12.set("category", "Science");
    record12.set("description", "Calculate voltage, current, and resistance using Ohm's Law");
    record12.set("url", "/ohms-law-calculator");
    record12.set("status", "active");
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
    record13.set("name", "Pressure Calculator");
    record13.set("category", "Science");
    record13.set("description", "Calculate pressure, force, and area relationships");
    record13.set("url", "/pressure-calculator");
    record13.set("status", "active");
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
    record14.set("name", "Wave Speed Calculator");
    record14.set("category", "Science");
    record14.set("description", "Calculate wave speed, frequency, and wavelength");
    record14.set("url", "/wave-speed-calculator");
    record14.set("status", "active");
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
    record15.set("name", "DNA/RNA Converter");
    record15.set("category", "Science");
    record15.set("description", "Convert between DNA and RNA sequences with complementary strand generation");
    record15.set("url", "/dna-rna-converter");
    record15.set("status", "active");
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
    record16.set("name", "Resume Builder");
    record16.set("category", "Career");
    record16.set("description", "Create professional resumes with customizable templates and formatting");
    record16.set("url", "/resume-builder");
    record16.set("status", "active");
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
    record17.set("name", "Cover Letter Generator");
    record17.set("category", "Career");
    record17.set("description", "Generate personalized cover letters for job applications");
    record17.set("url", "/cover-letter-generator");
    record17.set("status", "active");
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
    record18.set("name", "Job Application Tracker");
    record18.set("category", "Career");
    record18.set("description", "Track and manage job applications, interviews, and follow-ups");
    record18.set("url", "/job-application-tracker");
    record18.set("status", "active");
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
    record19.set("name", "Interview Preparation");
    record19.set("category", "Career");
    record19.set("description", "Prepare for interviews with tips, common questions, and practice tools");
    record19.set("url", "/interview-preparation");
    record19.set("status", "active");
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
    record20.set("name", "Salary Calculator");
    record20.set("category", "Career");
    record20.set("description", "Calculate salary, benefits, and take-home pay based on gross income");
    record20.set("url", "/salary-calculator");
    record20.set("status", "active");
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
    record21.set("name", "Career Path Planner");
    record21.set("category", "Career");
    record21.set("description", "Plan your career trajectory with goal setting and skill development");
    record21.set("url", "/career-path-planner");
    record21.set("status", "active");
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
    record22.set("name", "Skills Assessment");
    record22.set("category", "Career");
    record22.set("description", "Assess your professional skills and identify development areas");
    record22.set("url", "/skills-assessment");
    record22.set("status", "active");
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
    record23.set("name", "Length Converter");
    record23.set("category", "Converters");
    record23.set("description", "Convert between different units of length and distance");
    record23.set("url", "/length-converter");
    record23.set("status", "active");
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
    record24.set("name", "Weight Converter");
    record24.set("category", "Converters");
    record24.set("description", "Convert between different units of weight and mass");
    record24.set("url", "/weight-converter");
    record24.set("status", "active");
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
    record25.set("name", "Temperature Converter");
    record25.set("category", "Converters");
    record25.set("description", "Convert between Celsius, Fahrenheit, and Kelvin temperature scales");
    record25.set("url", "/temperature-converter");
    record25.set("status", "active");
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
    record26.set("name", "Volume Converter");
    record26.set("category", "Converters");
    record26.set("description", "Convert between different units of volume and capacity");
    record26.set("url", "/volume-converter");
    record26.set("status", "active");
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
    record27.set("name", "Currency Converter");
    record27.set("category", "Converters");
    record27.set("description", "Convert between different currencies with real-time exchange rates");
    record27.set("url", "/currency-converter");
    record27.set("status", "active");
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
    record28.set("name", "Image Converter");
    record28.set("category", "Converters");
    record28.set("description", "Convert images between different formats (JPG, PNG, WebP, etc.)");
    record28.set("url", "/image-converter");
    record28.set("status", "active");
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
    record29.set("name", "Audio Converter");
    record29.set("category", "Converters");
    record29.set("description", "Convert audio files between different formats and codecs");
    record29.set("url", "/audio-converter");
    record29.set("status", "active");
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
    record30.set("name", "Video Converter");
    record30.set("category", "Converters");
    record30.set("description", "Convert video files between different formats and resolutions");
    record30.set("url", "/video-converter");
    record30.set("status", "active");
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
    record31.set("name", "Word to PDF");
    record31.set("category", "Converters");
    record31.set("description", "Convert Word documents to PDF format with formatting preservation");
    record31.set("url", "/word-to-pdf");
    record31.set("status", "active");
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
    record32.set("name", "Excel to PDF");
    record32.set("category", "Converters");
    record32.set("description", "Convert Excel spreadsheets to PDF with layout options");
    record32.set("url", "/excel-to-pdf");
    record32.set("status", "active");
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
    record33.set("name", "Word Counter");
    record33.set("category", "Developer Tools");
    record33.set("description", "Count words, characters, sentences, and paragraphs in text");
    record33.set("url", "/word-counter");
    record33.set("status", "active");
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
    record34.set("name", "XML Formatter");
    record34.set("category", "Developer Tools");
    record34.set("description", "Format and validate XML documents with syntax highlighting");
    record34.set("url", "/xml-formatter");
    record34.set("status", "active");
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
    record35.set("name", "Code Beautifier");
    record35.set("category", "Developer Tools");
    record35.set("description", "Format and beautify code in multiple programming languages");
    record35.set("url", "/code-beautifier");
    record35.set("status", "active");
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
    record36.set("name", "Color Picker");
    record36.set("category", "Developer Tools");
    record36.set("description", "Pick and convert colors between HEX, RGB, and HSL formats");
    record36.set("url", "/color-picker");
    record36.set("status", "active");
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
    record37.set("name", "Barcode Generator");
    record37.set("category", "Developer Tools");
    record37.set("description", "Generate barcodes in various formats for products and inventory");
    record37.set("url", "/barcode-generator");
    record37.set("status", "active");
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
    record38.set("name", "QR Code Generator");
    record38.set("category", "Developer Tools");
    record38.set("description", "Generate QR codes for URLs, text, and contact information");
    record38.set("url", "/qr-code-generator");
    record38.set("status", "active");
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
    record39.set("name", "Text to Speech");
    record39.set("category", "Developer Tools");
    record39.set("description", "Convert text to natural-sounding speech with multiple voices");
    record39.set("url", "/text-to-speech");
    record39.set("status", "active");
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
    record40.set("name", "Speech to Text");
    record40.set("category", "Developer Tools");
    record40.set("description", "Convert audio and speech to text with high accuracy");
    record40.set("url", "/speech-to-text");
    record40.set("status", "active");
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
    record41.set("name", "Password Generator");
    record41.set("category", "Developer Tools");
    record41.set("description", "Generate secure random passwords with customizable criteria");
    record41.set("url", "/password-generator");
    record41.set("status", "active");
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
    record42.set("name", "UUID Generator");
    record42.set("category", "Developer Tools");
    record42.set("description", "Generate unique identifiers (UUIDs) for applications and databases");
    record42.set("url", "/uuid-generator");
    record42.set("status", "active");
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
    record43.set("name", "Base64 Encoder");
    record43.set("category", "Developer Tools");
    record43.set("description", "Encode and decode text and files using Base64 encoding");
    record43.set("url", "/base64-encoder");
    record43.set("status", "active");
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
    record44.set("name", "JSON Formatter");
    record44.set("category", "Developer Tools");
    record44.set("description", "Format, validate, and minify JSON data with syntax highlighting");
    record44.set("url", "/json-formatter");
    record44.set("status", "active");
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
    record45.set("name", "Markdown to HTML");
    record45.set("category", "Developer Tools");
    record45.set("description", "Convert Markdown text to HTML with preview functionality");
    record45.set("url", "/markdown-to-html");
    record45.set("status", "active");
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
    record46.set("name", "Scientific Calculators");
    record46.set("category", "Developer Tools");
    record46.set("description", "Advanced calculator with scientific functions and operations");
    record46.set("url", "/scientific-calculator");
    record46.set("status", "active");
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
    record47.set("name", "Receipt Generator");
    record47.set("category", "Documents");
    record47.set("description", "Generate professional receipts for transactions and sales");
    record47.set("url", "/receipt-generator");
    record47.set("status", "active");
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
    record48.set("name", "Certificate Generator");
    record48.set("category", "Documents");
    record48.set("description", "Create customizable certificates for achievements and completion");
    record48.set("url", "/certificate-generator");
    record48.set("status", "active");
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
    record49.set("name", "Letter Generator");
    record49.set("category", "Documents");
    record49.set("description", "Generate professional letters with templates and formatting");
    record49.set("url", "/letter-generator");
    record49.set("status", "active");
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
    record50.set("name", "Contract Generator");
    record50.set("category", "Documents");
    record50.set("description", "Create legal contracts with customizable terms and conditions");
    record50.set("url", "/contract-generator");
    record50.set("status", "active");
  try {
    app.save(record50);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record51 = new Record(collection);
    record51.set("name", "Proposal Generator");
    record51.set("category", "Documents");
    record51.set("description", "Generate professional business proposals with templates");
    record51.set("url", "/proposal-generator");
    record51.set("status", "active");
  try {
    app.save(record51);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record52 = new Record(collection);
    record52.set("name", "Quote Generator");
    record52.set("category", "Documents");
    record52.set("description", "Create professional quotes for products and services");
    record52.set("url", "/quote-generator");
    record52.set("status", "active");
  try {
    app.save(record52);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record53 = new Record(collection);
    record53.set("name", "PDF Merger");
    record53.set("category", "Documents");
    record53.set("description", "Merge multiple PDF files into a single document");
    record53.set("url", "/pdf-merger");
    record53.set("status", "active");
  try {
    app.save(record53);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record54 = new Record(collection);
    record54.set("name", "PDF Splitter");
    record54.set("category", "Documents");
    record54.set("description", "Split PDF files into individual pages or custom ranges");
    record54.set("url", "/pdf-splitter");
    record54.set("status", "active");
  try {
    app.save(record54);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record55 = new Record(collection);
    record55.set("name", "GST Calculator");
    record55.set("category", "Finance");
    record55.set("description", "Calculate GST (Goods and Services Tax) on products and services");
    record55.set("url", "/gst-calculator");
    record55.set("status", "active");
  try {
    app.save(record55);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record56 = new Record(collection);
    record56.set("name", "Income Tax Calculator");
    record56.set("category", "Finance");
    record56.set("description", "Calculate income tax based on salary and deductions");
    record56.set("url", "/income-tax-calculator");
    record56.set("status", "active");
  try {
    app.save(record56);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record57 = new Record(collection);
    record57.set("name", "Discount Calculator");
    record57.set("category", "Finance");
    record57.set("description", "Calculate discounts, sale prices, and percentage reductions");
    record57.set("url", "/discount-calculator");
    record57.set("status", "active");
  try {
    app.save(record57);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record58 = new Record(collection);
    record58.set("name", "EMI Calculator");
    record58.set("category", "Finance");
    record58.set("description", "Calculate Equated Monthly Installments for loans");
    record58.set("url", "/emi-calculator");
    record58.set("status", "active");
  try {
    app.save(record58);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record59 = new Record(collection);
    record59.set("name", "SIP Calculator");
    record59.set("category", "Finance");
    record59.set("description", "Calculate returns on Systematic Investment Plans");
    record59.set("url", "/sip-calculator");
    record59.set("status", "active");
  try {
    app.save(record59);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record60 = new Record(collection);
    record60.set("name", "FD Calculator");
    record60.set("category", "Finance");
    record60.set("description", "Calculate Fixed Deposit maturity amount and interest");
    record60.set("url", "/fd-calculator");
    record60.set("status", "active");
  try {
    app.save(record60);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record61 = new Record(collection);
    record61.set("name", "Invoice Generator");
    record61.set("category", "Finance");
    record61.set("description", "Create professional invoices for billing and payments");
    record61.set("url", "/invoice-generator");
    record61.set("status", "active");
  try {
    app.save(record61);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record62 = new Record(collection);
    record62.set("name", "Bill Generator");
    record62.set("category", "Finance");
    record62.set("description", "Generate bills and statements for customers");
    record62.set("url", "/bill-generator");
    record62.set("status", "active");
  try {
    app.save(record62);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record63 = new Record(collection);
    record63.set("name", "Slug Generator");
    record63.set("category", "Finance");
    record63.set("description", "Generate URL-friendly slugs from text and titles");
    record63.set("url", "/slug-generator");
    record63.set("status", "active");
  try {
    app.save(record63);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record64 = new Record(collection);
    record64.set("name", "Random Name Generator");
    record64.set("category", "Generators");
    record64.set("description", "Generate random names for characters, businesses, and projects");
    record64.set("url", "/random-name-generator");
    record64.set("status", "active");
  try {
    app.save(record64);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record65 = new Record(collection);
    record65.set("name", "Image Compressor");
    record65.set("category", "Generators");
    record65.set("description", "Compress images to reduce file size while maintaining quality");
    record65.set("url", "/image-compressor");
    record65.set("status", "active");
  try {
    app.save(record65);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record66 = new Record(collection);
    record66.set("name", "Image Resizer");
    record66.set("category", "Generators");
    record66.set("description", "Resize images to specific dimensions and aspect ratios");
    record66.set("url", "/image-resizer");
    record66.set("status", "active");
  try {
    app.save(record66);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record67 = new Record(collection);
    record67.set("name", "Image Cropper");
    record67.set("category", "Generators");
    record67.set("description", "Crop images to custom sizes and aspect ratios");
    record67.set("url", "/image-cropper");
    record67.set("status", "active");
  try {
    app.save(record67);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record68 = new Record(collection);
    record68.set("name", "Image Filter");
    record68.set("category", "Generators");
    record68.set("description", "Apply filters and effects to images for enhancement");
    record68.set("url", "/image-filter");
    record68.set("status", "active");
  try {
    app.save(record68);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record69 = new Record(collection);
    record69.set("name", "Image Watermark");
    record69.set("category", "Generators");
    record69.set("description", "Add watermarks and text overlays to images");
    record69.set("url", "/image-watermark");
    record69.set("status", "active");
  try {
    app.save(record69);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record70 = new Record(collection);
    record70.set("name", "Metadata Remover");
    record70.set("category", "Image Tools");
    record70.set("description", "Remove metadata and EXIF data from images and documents");
    record70.set("url", "/metadata-remover");
    record70.set("status", "active");
  try {
    app.save(record70);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record71 = new Record(collection);
    record71.set("name", "Batch Processor");
    record71.set("category", "Image Tools");
    record71.set("description", "Process multiple images in batch with various operations");
    record71.set("url", "/batch-processor");
    record71.set("status", "active");
  try {
    app.save(record71);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record72 = new Record(collection);
    record72.set("name", "Smart To-Do List");
    record72.set("category", "Productivity");
    record72.set("description", "Create and manage intelligent to-do lists with priorities");
    record72.set("url", "/smart-todo-list");
    record72.set("status", "active");
  try {
    app.save(record72);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record73 = new Record(collection);
    record73.set("name", "Task Board");
    record73.set("category", "Productivity");
    record73.set("description", "Organize tasks on a Kanban-style board with drag-and-drop");
    record73.set("url", "/task-board");
    record73.set("status", "active");
  try {
    app.save(record73);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record74 = new Record(collection);
    record74.set("name", "Daily Planner");
    record74.set("category", "Productivity");
    record74.set("description", "Plan your day with hourly schedules and task management");
    record74.set("url", "/daily-planner");
    record74.set("status", "active");
  try {
    app.save(record74);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record75 = new Record(collection);
    record75.set("name", "Sticky Notes");
    record75.set("category", "Productivity");
    record75.set("description", "Create digital sticky notes for quick notes and reminders");
    record75.set("url", "/sticky-notes");
    record75.set("status", "active");
  try {
    app.save(record75);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record76 = new Record(collection);
    record76.set("name", "Meeting Notes");
    record76.set("category", "Productivity");
    record76.set("description", "Take and organize meeting notes with action items");
    record76.set("url", "/meeting-notes");
    record76.set("status", "active");
  try {
    app.save(record76);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record77 = new Record(collection);
    record77.set("name", "Countdown Timer");
    record77.set("category", "Productivity");
    record77.set("description", "Set countdown timers for events and deadlines");
    record77.set("url", "/countdown-timer");
    record77.set("status", "active");
  try {
    app.save(record77);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record78 = new Record(collection);
    record78.set("name", "Pomodoro Timer");
    record78.set("category", "Productivity");
    record78.set("description", "Use the Pomodoro Technique for focused work sessions");
    record78.set("url", "/pomodoro-timer");
    record78.set("status", "active");
  try {
    app.save(record78);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record79 = new Record(collection);
    record79.set("name", "Habit Streak");
    record79.set("category", "Productivity");
    record79.set("description", "Track daily habits and build streaks for consistency");
    record79.set("url", "/habit-streak");
    record79.set("status", "active");
  try {
    app.save(record79);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record80 = new Record(collection);
    record80.set("name", "Water Tracker");
    record80.set("category", "Productivity");
    record80.set("description", "Track daily water intake and stay hydrated");
    record80.set("url", "/water-tracker");
    record80.set("status", "active");
  try {
    app.save(record80);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record81 = new Record(collection);
    record81.set("name", "Mood Tracker");
    record81.set("category", "Productivity");
    record81.set("description", "Log and track your mood throughout the day");
    record81.set("url", "/mood-tracker");
    record81.set("status", "active");
  try {
    app.save(record81);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record82 = new Record(collection);
    record82.set("name", "Expense Reminder");
    record82.set("category", "Productivity");
    record82.set("description", "Set reminders for bills and expense tracking");
    record82.set("url", "/expense-reminder");
    record82.set("status", "active");
  try {
    app.save(record82);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record83 = new Record(collection);
    record83.set("name", "Medicine Reminder");
    record83.set("category", "Productivity");
    record83.set("description", "Get reminders for taking medicines on schedule");
    record83.set("url", "/medicine-reminder");
    record83.set("status", "active");
  try {
    app.save(record83);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record84 = new Record(collection);
    record84.set("name", "Meal Planner");
    record84.set("category", "Productivity");
    record84.set("description", "Plan meals for the week with recipes and shopping lists");
    record84.set("url", "/meal-planner");
    record84.set("status", "active");
  try {
    app.save(record84);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record85 = new Record(collection);
    record85.set("name", "Routine Builder");
    record85.set("category", "Productivity");
    record85.set("description", "Create and manage daily routines for productivity");
    record85.set("url", "/routine-builder");
    record85.set("status", "active");
  try {
    app.save(record85);
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