/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("seo_settings");

  const record0 = new Record(collection);
    record0.set("page_name", "pdf-page-rotator");
    record0.set("meta_title", "PDF Page Rotator \u2013 Rotate PDF Pages Online (90\u00b0, 180\u00b0, 270\u00b0)");
    record0.set("h1_tag", "Rotate PDF Pages Easily Online");
    record0.set("meta_description", "Rotate PDF pages instantly by 90\u00b0, 180\u00b0, or 270\u00b0 with our free online tool. No installation required.");
    record0.set("meta_keywords", "pdf page rotator, rotate pdf online, rotate pdf pages free, pdf rotate tool");
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
    record1.set("page_name", "pdf-page-extractor");
    record1.set("meta_title", "PDF Page Extractor \u2013 Extract Pages from PDF Online");
    record1.set("h1_tag", "Extract PDF Pages Quickly & Easily");
    record1.set("meta_description", "Extract specific pages from PDF files online with our fast and free PDF page extractor.");
    record1.set("meta_keywords", "pdf page extractor, extract pdf pages, split pdf pages, pdf page remover");
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
    record2.set("page_name", "pdf-text-adder");
    record2.set("meta_title", "PDF Text Adder \u2013 Add Text to PDF Online Free");
    record2.set("h1_tag", "Add Text to PDF Easily Online");
    record2.set("meta_description", "Insert custom text into PDF documents quickly with our free PDF text editor tool.");
    record2.set("meta_keywords", "add text to pdf, pdf text editor, edit pdf text online, write on pdf");
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
    record3.set("page_name", "pdf-watermark-adder");
    record3.set("meta_title", "PDF Watermark Adder \u2013 Add Watermark to PDF Online");
    record3.set("h1_tag", "Add Watermark to PDF Files");
    record3.set("meta_description", "Protect your documents by adding watermarks to PDFs online instantly.");
    record3.set("meta_keywords", "pdf watermark tool, add watermark to pdf, watermark pdf online");
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
    record4.set("page_name", "pdf-to-image-converter");
    record4.set("meta_title", "PDF to Image Converter \u2013 Convert PDF to JPG, PNG Online");
    record4.set("h1_tag", "Convert PDF to Images Easily");
    record4.set("meta_description", "Convert PDF pages into JPG or PNG images instantly with our free converter.");
    record4.set("meta_keywords", "pdf to image converter, pdf to jpg, pdf to png, convert pdf to image online");
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
    record5.set("page_name", "pdf-blank-page-remover");
    record5.set("meta_title", "PDF Blank Page Remover \u2013 Remove Blank Pages Online");
    record5.set("h1_tag", "Remove Blank Pages from PDF");
    record5.set("meta_description", "Clean your PDFs by removing blank pages instantly with our free tool.");
    record5.set("meta_keywords", "remove blank pages pdf, pdf cleaner tool, delete empty pages pdf");
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
    record6.set("page_name", "pdf-page-number");
    record6.set("meta_title", "Add Page Numbers to PDF \u2013 Number PDF Pages Online");
    record6.set("h1_tag", "Add Page Numbers to PDF Easily");
    record6.set("meta_description", "Insert page numbers into your PDF documents quickly and professionally.");
    record6.set("meta_keywords", "pdf page number tool, add page numbers pdf, pdf numbering tool");
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
    record7.set("page_name", "pdf-header-footer-adder");
    record7.set("meta_title", "Add Header & Footer to PDF \u2013 Online Tool");
    record7.set("h1_tag", "Add Header and Footer to PDF");
    record7.set("meta_description", "Add custom headers and footers to your PDF files easily online.");
    record7.set("meta_keywords", "pdf header footer tool, add header footer pdf, pdf editor online");
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
    record8.set("page_name", "pdf-qr-code-adder");
    record8.set("meta_title", "Add QR Code to PDF \u2013 Embed QR Codes Online");
    record8.set("h1_tag", "Add QR Code to PDF Files");
    record8.set("meta_description", "Insert QR codes into PDF documents easily using our free tool.");
    record8.set("meta_keywords", "pdf qr code tool, add qr code to pdf, embed qr in pdf");
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
    record9.set("page_name", "pdf-bookmark-creator");
    record9.set("meta_title", "PDF Bookmark Creator \u2013 Add Bookmarks to PDF Online");
    record9.set("h1_tag", "Create Bookmarks in PDF");
    record9.set("meta_description", "Organize your PDF files by adding bookmarks for easy navigation.");
    record9.set("meta_keywords", "pdf bookmark creator, add bookmarks pdf, pdf navigation tool");
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
    record10.set("page_name", "receipt-generator");
    record10.set("meta_title", "Receipt Generator \u2013 Create Professional Receipts Online");
    record10.set("h1_tag", "Receipt Generator for Quick Billing");
    record10.set("meta_description", "Generate professional receipts instantly for business and personal use.");
    record10.set("meta_keywords", "receipt generator, create receipt online, billing receipt tool");
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
    record11.set("page_name", "certificate-generator");
    record11.set("meta_title", "Certificate Generator \u2013 Create Custom Certificates Online");
    record11.set("h1_tag", "Certificate Generator for Custom Designs");
    record11.set("meta_description", "Create and download custom certificates easily with our online generator.");
    record11.set("meta_keywords", "certificate generator, create certificate online, certificate maker free");
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
    record12.set("page_name", "letter-generator");
    record12.set("meta_title", "Letter Generator \u2013 Create Professional Letters Online");
    record12.set("h1_tag", "Letter Generator for Formal Communication");
    record12.set("meta_description", "Generate professional letters for business and personal use instantly.");
    record12.set("meta_keywords", "letter generator, formal letter generator, create letter online");
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
    record13.set("page_name", "contract-generator");
    record13.set("meta_title", "Contract Generator \u2013 Create Legal Contracts Online");
    record13.set("h1_tag", "Contract Generator for Legal Documents");
    record13.set("meta_description", "Generate professional contracts quickly with customizable templates.");
    record13.set("meta_keywords", "contract generator, legal contract maker, create contract online");
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
    record14.set("page_name", "proposal-generator");
    record14.set("meta_title", "Proposal Generator \u2013 Create Business Proposals Online");
    record14.set("h1_tag", "Proposal Generator for Business Growth");
    record14.set("meta_description", "Create professional business proposals easily with our free tool.");
    record14.set("meta_keywords", "proposal generator, business proposal maker, create proposal online");
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
    record15.set("page_name", "quote-generator");
    record15.set("meta_title", "Quote Generator \u2013 Create Price Quotes Online Instantly");
    record15.set("h1_tag", "Quote Generator for Business Pricing");
    record15.set("meta_description", "Generate professional price quotes quickly and efficiently.");
    record15.set("meta_keywords", "quote generator, create quote online, pricing quote tool");
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
    record16.set("page_name", "pdf-merger");
    record16.set("meta_title", "PDF Merger \u2013 Merge Multiple PDFs Online Free");
    record16.set("h1_tag", "Merge PDF Files Easily Online");
    record16.set("meta_description", "Combine multiple PDF files into one document instantly.");
    record16.set("meta_keywords", "pdf merger, merge pdf online, combine pdf files free");
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
    record17.set("page_name", "pdf-splitter");
    record17.set("meta_title", "PDF Splitter \u2013 Split PDF Files Online Easily");
    record17.set("h1_tag", "Split PDF Files Quickly");
    record17.set("meta_description", "Split PDF into multiple files easily with our free PDF splitter.");
    record17.set("meta_keywords", "pdf splitter, split pdf online, divide pdf files");
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
    record18.set("page_name", "qr-code-generator-optimized");
    record18.set("meta_title", "QR Code Generator \u2013 Create QR Codes Online Free");
    record18.set("h1_tag", "QR Code Generator for Instant Creation");
    record18.set("meta_description", "Generate QR codes for URLs, text, and more instantly.");
    record18.set("meta_keywords", "qr code generator, create qr code online, qr code maker free, dynamic qr code generator");
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
    record19.set("page_name", "barcode-generator-optimized");
    record19.set("meta_title", "Barcode Generator \u2013 Create Barcodes Online Free");
    record19.set("h1_tag", "Barcode Generator for Products & Inventory");
    record19.set("meta_description", "Generate barcodes instantly for products and inventory management.");
    record19.set("meta_keywords", "barcode generator, create barcode online, barcode maker free, product barcode generator");
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
    record20.set("page_name", "password-generator-optimized");
    record20.set("meta_title", "Password Generator \u2013 Create Strong & Secure Passwords");
    record20.set("h1_tag", "Password Generator for Online Security");
    record20.set("meta_description", "Generate secure and strong passwords instantly to protect your accounts.");
    record20.set("meta_keywords", "password generator, strong password generator, secure password tool, random password generator");
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
    record21.set("page_name", "uuid-generator-optimized");
    record21.set("meta_title", "UUID Generator \u2013 Generate Unique Identifiers Online");
    record21.set("h1_tag", "UUID Generator for Developers");
    record21.set("meta_description", "Generate unique UUIDs instantly for development and database use.");
    record21.set("meta_keywords", "uuid generator, guid generator, unique id generator online");
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
    record22.set("page_name", "slug-generator");
    record22.set("meta_title", "Slug Generator \u2013 Create SEO-Friendly URLs Instantly");
    record22.set("h1_tag", "Slug Generator for Clean URLs");
    record22.set("meta_description", "Generate SEO-friendly URL slugs from text instantly.");
    record22.set("meta_keywords", "slug generator, seo url generator, url slug tool, clean url generator");
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
    record23.set("page_name", "random-name-generator");
    record23.set("meta_title", "Random Name Generator \u2013 Generate Names Instantly Online");
    record23.set("h1_tag", "Random Name Generator for Creative Ideas");
    record23.set("meta_description", "Generate random names for projects, characters, or businesses instantly.");
    record23.set("meta_keywords", "random name generator, name generator tool, business name generator, random names online");
  try {
    app.save(record23);
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