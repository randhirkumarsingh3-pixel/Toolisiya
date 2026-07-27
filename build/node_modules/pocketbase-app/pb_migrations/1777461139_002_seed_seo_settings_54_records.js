/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("seo_settings");

  const record0 = new Record(collection);
    record0.set("page_name", "Income Tax Calculator");
    record0.set("meta_title", "Free Income Tax Calculator | Calculate Your Tax Instantly");
    record0.set("meta_description", "Calculate your income tax with our free online calculator. Supports multiple tax brackets, deductions, and credits. Get accurate tax estimates in seconds.");
    record0.set("meta_keywords", "income tax calculator, tax calculator, income tax, tax estimation, free tax calculator");
    record0.set("h1_tag", "Income Tax Calculator - Calculate Your Tax Liability Instantly");
    record0.set("og_title", "Free Income Tax Calculator");
    record0.set("og_description", "Calculate your income tax instantly with our free calculator.");
    record0.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Income Tax Calculator', 'description': 'Free online income tax calculator for accurate tax estimation', 'applicationCategory': 'FinanceApplication'}");
    record0.set("is_published", true);
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
    record1.set("page_name", "GST Calculator");
    record1.set("meta_title", "Free GST Calculator | Calculate GST Online Instantly");
    record1.set("meta_description", "Calculate GST (Goods and Services Tax) with our free online calculator. Supports multiple tax rates and provides instant calculations for business and personal use.");
    record1.set("meta_keywords", "GST calculator, goods and services tax, tax calculator, GST rate, free GST calculator");
    record1.set("h1_tag", "GST Calculator - Calculate Goods and Services Tax Online");
    record1.set("og_title", "Free GST Calculator");
    record1.set("og_description", "Calculate GST instantly with our free online calculator.");
    record1.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'GST Calculator', 'description': 'Free online GST calculator for tax calculations', 'applicationCategory': 'FinanceApplication'}");
    record1.set("is_published", true);
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
    record2.set("page_name", "Salary Calculator");
    record2.set("meta_title", "Free Salary Calculator | Calculate Net Salary Online");
    record2.set("meta_description", "Calculate your net salary with our free online calculator. Includes tax deductions, benefits, and provides detailed salary breakdowns instantly.");
    record2.set("meta_keywords", "salary calculator, net salary, gross salary, salary tax, payroll calculator, free salary calculator");
    record2.set("h1_tag", "Salary Calculator - Calculate Your Net Salary Instantly");
    record2.set("og_title", "Free Salary Calculator");
    record2.set("og_description", "Calculate your net salary instantly with our free calculator.");
    record2.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Salary Calculator', 'description': 'Free online salary calculator for net salary estimation', 'applicationCategory': 'FinanceApplication'}");
    record2.set("is_published", true);
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
    record3.set("page_name", "Compound Interest Calculator");
    record3.set("meta_title", "Free Compound Interest Calculator | Calculate Returns");
    record3.set("meta_description", "Calculate compound interest with our free online calculator. See how your investments grow over time with different compounding frequencies.");
    record3.set("meta_keywords", "compound interest calculator, interest calculator, investment calculator, compound interest, free calculator");
    record3.set("h1_tag", "Compound Interest Calculator - Calculate Investment Returns");
    record3.set("og_title", "Free Compound Interest Calculator");
    record3.set("og_description", "Calculate compound interest instantly with our free calculator.");
    record3.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Compound Interest Calculator', 'description': 'Free online compound interest calculator for investment planning', 'applicationCategory': 'FinanceApplication'}");
    record3.set("is_published", true);
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
    record4.set("page_name", "Simple Interest Calculator");
    record4.set("meta_title", "Free Simple Interest Calculator | Calculate Interest Online");
    record4.set("meta_description", "Calculate simple interest with our free online calculator. Perfect for loans, savings, and investments. Get instant results with detailed breakdowns.");
    record4.set("meta_keywords", "simple interest calculator, interest calculator, loan calculator, simple interest, free calculator");
    record4.set("h1_tag", "Simple Interest Calculator - Calculate Interest Instantly");
    record4.set("og_title", "Free Simple Interest Calculator");
    record4.set("og_description", "Calculate simple interest instantly with our free calculator.");
    record4.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Simple Interest Calculator', 'description': 'Free online simple interest calculator for financial planning', 'applicationCategory': 'FinanceApplication'}");
    record4.set("is_published", true);
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
    record5.set("page_name", "Loan Calculator");
    record5.set("meta_title", "Free Loan Calculator | Calculate EMI & Loan Payments");
    record5.set("meta_description", "Calculate loan payments with our free online calculator. Get EMI, total interest, and amortization schedules for any loan amount and duration.");
    record5.set("meta_keywords", "loan calculator, EMI calculator, loan payment, loan interest, free loan calculator");
    record5.set("h1_tag", "Loan Calculator - Calculate EMI and Loan Payments");
    record5.set("og_title", "Free Loan Calculator");
    record5.set("og_description", "Calculate loan payments instantly with our free calculator.");
    record5.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Loan Calculator', 'description': 'Free online loan calculator for EMI and payment calculations', 'applicationCategory': 'FinanceApplication'}");
    record5.set("is_published", true);
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
    record6.set("page_name", "EMI Calculator");
    record6.set("meta_title", "Free EMI Calculator | Calculate Monthly Loan Payments");
    record6.set("meta_description", "Calculate EMI (Equated Monthly Installment) with our free online calculator. Get accurate monthly payments for home loans, car loans, and personal loans.");
    record6.set("meta_keywords", "EMI calculator, equated monthly installment, loan payment, monthly payment, free EMI calculator");
    record6.set("h1_tag", "EMI Calculator - Calculate Monthly Loan Installments");
    record6.set("og_title", "Free EMI Calculator");
    record6.set("og_description", "Calculate EMI instantly with our free online calculator.");
    record6.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'EMI Calculator', 'description': 'Free online EMI calculator for loan payment calculations', 'applicationCategory': 'FinanceApplication'}");
    record6.set("is_published", true);
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
    record7.set("page_name", "Retirement Calculator");
    record7.set("meta_title", "Free Retirement Calculator | Plan Your Retirement");
    record7.set("meta_description", "Plan your retirement with our free online calculator. Calculate retirement savings needed, investment returns, and retirement income projections.");
    record7.set("meta_keywords", "retirement calculator, retirement planning, retirement savings, retirement income, free calculator");
    record7.set("h1_tag", "Retirement Calculator - Plan Your Financial Future");
    record7.set("og_title", "Free Retirement Calculator");
    record7.set("og_description", "Plan your retirement instantly with our free calculator.");
    record7.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Retirement Calculator', 'description': 'Free online retirement calculator for retirement planning', 'applicationCategory': 'FinanceApplication'}");
    record7.set("is_published", true);
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
    record8.set("page_name", "Investment Calculator");
    record8.set("meta_title", "Free Investment Calculator | Calculate Investment Returns");
    record8.set("meta_description", "Calculate investment returns with our free online calculator. Plan your investments, see growth projections, and make informed financial decisions.");
    record8.set("meta_keywords", "investment calculator, investment returns, investment planning, portfolio calculator, free calculator");
    record8.set("h1_tag", "Investment Calculator - Calculate Your Investment Returns");
    record8.set("og_title", "Free Investment Calculator");
    record8.set("og_description", "Calculate investment returns instantly with our free calculator.");
    record8.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Investment Calculator', 'description': 'Free online investment calculator for return calculations', 'applicationCategory': 'FinanceApplication'}");
    record8.set("is_published", true);
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
    record9.set("page_name", "Profit Margin Calculator");
    record9.set("meta_title", "Free Profit Margin Calculator | Calculate Profit Instantly");
    record9.set("meta_description", "Calculate profit margin with our free online calculator. Determine markup, profit percentage, and revenue for your business instantly.");
    record9.set("meta_keywords", "profit margin calculator, profit calculator, markup calculator, business calculator, free calculator");
    record9.set("h1_tag", "Profit Margin Calculator - Calculate Business Profit");
    record9.set("og_title", "Free Profit Margin Calculator");
    record9.set("og_description", "Calculate profit margin instantly with our free calculator.");
    record9.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Profit Margin Calculator', 'description': 'Free online profit margin calculator for business calculations', 'applicationCategory': 'FinanceApplication'}");
    record9.set("is_published", true);
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
    record10.set("page_name", "Image Converter");
    record10.set("meta_title", "Free Image Converter | Convert Images Online Instantly");
    record10.set("meta_description", "Convert images between formats with our free online converter. Supports JPG, PNG, GIF, WebP, and more. Fast, secure, and no registration required.");
    record10.set("meta_keywords", "image converter, convert image, image format, JPG to PNG, free image converter");
    record10.set("h1_tag", "Image Converter - Convert Images Between Formats");
    record10.set("og_title", "Free Image Converter");
    record10.set("og_description", "Convert images instantly with our free online converter.");
    record10.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Image Converter', 'description': 'Free online image converter for format conversion', 'applicationCategory': 'MultimediaApplication'}");
    record10.set("is_published", true);
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
    record11.set("page_name", "Image Resizer");
    record11.set("meta_title", "Free Image Resizer | Resize Images Online Instantly");
    record11.set("meta_description", "Resize images with our free online tool. Maintain aspect ratio, batch resize, and download in multiple formats. Perfect for web and social media.");
    record11.set("meta_keywords", "image resizer, resize image, image size, batch resize, free image resizer");
    record11.set("h1_tag", "Image Resizer - Resize Images Online Instantly");
    record11.set("og_title", "Free Image Resizer");
    record11.set("og_description", "Resize images instantly with our free online tool.");
    record11.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Image Resizer', 'description': 'Free online image resizer for dimension adjustment', 'applicationCategory': 'MultimediaApplication'}");
    record11.set("is_published", true);
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
    record12.set("page_name", "Image Cropper");
    record12.set("meta_title", "Free Image Cropper | Crop Images Online Instantly");
    record12.set("meta_description", "Crop images with our free online tool. Precise cropping, multiple aspect ratios, and instant preview. Perfect for profile pictures and thumbnails.");
    record12.set("meta_keywords", "image cropper, crop image, image crop, photo cropper, free image cropper");
    record12.set("h1_tag", "Image Cropper - Crop Images Online Instantly");
    record12.set("og_title", "Free Image Cropper");
    record12.set("og_description", "Crop images instantly with our free online tool.");
    record12.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Image Cropper', 'description': 'Free online image cropper for precise image cropping', 'applicationCategory': 'MultimediaApplication'}");
    record12.set("is_published", true);
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
    record13.set("page_name", "Image Compressor");
    record13.set("meta_title", "Free Image Compressor | Compress Images Online");
    record13.set("meta_description", "Compress images with our free online tool. Reduce file size without losing quality. Perfect for web optimization and faster loading times.");
    record13.set("meta_keywords", "image compressor, compress image, image compression, reduce image size, free compressor");
    record13.set("h1_tag", "Image Compressor - Compress Images Without Quality Loss");
    record13.set("og_title", "Free Image Compressor");
    record13.set("og_description", "Compress images instantly with our free online tool.");
    record13.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Image Compressor', 'description': 'Free online image compressor for file size reduction', 'applicationCategory': 'MultimediaApplication'}");
    record13.set("is_published", true);
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
    record14.set("page_name", "Image Filter");
    record14.set("meta_title", "Free Image Filter | Apply Filters to Images Online");
    record14.set("meta_description", "Apply filters to images with our free online tool. Enhance, blur, sharpen, and apply artistic effects. No installation required.");
    record14.set("meta_keywords", "image filter, photo filter, image effects, photo effects, free image filter");
    record14.set("h1_tag", "Image Filter - Apply Filters and Effects to Images");
    record14.set("og_title", "Free Image Filter");
    record14.set("og_description", "Apply filters to images instantly with our free tool.");
    record14.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Image Filter', 'description': 'Free online image filter tool for photo enhancement', 'applicationCategory': 'MultimediaApplication'}");
    record14.set("is_published", true);
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
    record15.set("page_name", "Image Watermark");
    record15.set("meta_title", "Free Image Watermark | Add Watermark to Images");
    record15.set("meta_description", "Add watermarks to images with our free online tool. Protect your photos with text or image watermarks. Batch processing available.");
    record15.set("meta_keywords", "image watermark, add watermark, watermark tool, photo watermark, free watermark");
    record15.set("h1_tag", "Image Watermark - Add Watermarks to Images Online");
    record15.set("og_title", "Free Image Watermark");
    record15.set("og_description", "Add watermarks to images instantly with our free tool.");
    record15.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Image Watermark', 'description': 'Free online image watermark tool for photo protection', 'applicationCategory': 'MultimediaApplication'}");
    record15.set("is_published", true);
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
    record16.set("page_name", "Metadata Remover");
    record16.set("meta_title", "Free Metadata Remover | Remove Image Metadata Online");
    record16.set("meta_description", "Remove metadata from images with our free online tool. Strip EXIF data, location info, and other metadata for privacy and security.");
    record16.set("meta_keywords", "metadata remover, remove EXIF, EXIF remover, image metadata, privacy tool");
    record16.set("h1_tag", "Metadata Remover - Remove Image Metadata Online");
    record16.set("og_title", "Free Metadata Remover");
    record16.set("og_description", "Remove metadata from images instantly with our free tool.");
    record16.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Metadata Remover', 'description': 'Free online metadata remover for privacy protection', 'applicationCategory': 'UtilityApplication'}");
    record16.set("is_published", true);
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
    record17.set("page_name", "Batch Processor");
    record17.set("meta_title", "Free Batch Processor | Process Multiple Images Online");
    record17.set("meta_description", "Process multiple images at once with our free batch processor. Resize, convert, compress, and apply filters to hundreds of images instantly.");
    record17.set("meta_keywords", "batch processor, batch image processing, bulk image, image batch, free processor");
    record17.set("h1_tag", "Batch Processor - Process Multiple Images at Once");
    record17.set("og_title", "Free Batch Processor");
    record17.set("og_description", "Process multiple images instantly with our free batch tool.");
    record17.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Batch Processor', 'description': 'Free online batch processor for bulk image processing', 'applicationCategory': 'MultimediaApplication'}");
    record17.set("is_published", true);
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
    record18.set("page_name", "Word Counter");
    record18.set("meta_title", "Free Word Counter | Count Words & Characters Online");
    record18.set("meta_description", "Count words, characters, sentences, and paragraphs with our free online tool. Perfect for writers, students, and content creators.");
    record18.set("meta_keywords", "word counter, character counter, word count, text counter, free word counter");
    record18.set("h1_tag", "Word Counter - Count Words and Characters Online");
    record18.set("og_title", "Free Word Counter");
    record18.set("og_description", "Count words and characters instantly with our free tool.");
    record18.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Word Counter', 'description': 'Free online word counter for text analysis', 'applicationCategory': 'UtilityApplication'}");
    record18.set("is_published", true);
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
    record19.set("page_name", "XML Formatter");
    record19.set("meta_title", "Free XML Formatter | Format XML Online Instantly");
    record19.set("meta_description", "Format and validate XML with our free online tool. Pretty print, minify, and check XML syntax. Perfect for developers and data processing.");
    record19.set("meta_keywords", "XML formatter, XML validator, format XML, XML tool, free XML formatter");
    record19.set("h1_tag", "XML Formatter - Format and Validate XML Online");
    record19.set("og_title", "Free XML Formatter");
    record19.set("og_description", "Format XML instantly with our free online tool.");
    record19.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'XML Formatter', 'description': 'Free online XML formatter for code formatting', 'applicationCategory': 'DeveloperApplication'}");
    record19.set("is_published", true);
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
    record20.set("page_name", "Code Beautifier");
    record20.set("meta_title", "Free Code Beautifier | Format Code Online Instantly");
    record20.set("meta_description", "Beautify and format code with our free online tool. Supports HTML, CSS, JavaScript, and more. Improve code readability instantly.");
    record20.set("meta_keywords", "code beautifier, code formatter, format code, beautify code, free code formatter");
    record20.set("h1_tag", "Code Beautifier - Format and Beautify Code Online");
    record20.set("og_title", "Free Code Beautifier");
    record20.set("og_description", "Beautify code instantly with our free online tool.");
    record20.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Code Beautifier', 'description': 'Free online code beautifier for code formatting', 'applicationCategory': 'DeveloperApplication'}");
    record20.set("is_published", true);
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
    record21.set("page_name", "Color Picker");
    record21.set("meta_title", "Free Color Picker | Pick Colors Online Instantly");
    record21.set("meta_description", "Pick colors with our free online color picker. Get hex, RGB, and HSL values. Perfect for designers and developers.");
    record21.set("meta_keywords", "color picker, pick color, color tool, hex color, RGB color, free color picker");
    record21.set("h1_tag", "Color Picker - Pick and Convert Colors Online");
    record21.set("og_title", "Free Color Picker");
    record21.set("og_description", "Pick colors instantly with our free online tool.");
    record21.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Color Picker', 'description': 'Free online color picker for color selection', 'applicationCategory': 'DesignApplication'}");
    record21.set("is_published", true);
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
    record22.set("page_name", "Barcode Generator");
    record22.set("meta_title", "Free Barcode Generator | Generate Barcodes Online");
    record22.set("meta_description", "Generate barcodes with our free online tool. Create Code128, EAN, UPC, and more. Download as PNG or SVG instantly.");
    record22.set("meta_keywords", "barcode generator, generate barcode, barcode maker, free barcode, barcode tool");
    record22.set("h1_tag", "Barcode Generator - Generate Barcodes Online");
    record22.set("og_title", "Free Barcode Generator");
    record22.set("og_description", "Generate barcodes instantly with our free online tool.");
    record22.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Barcode Generator', 'description': 'Free online barcode generator for barcode creation', 'applicationCategory': 'UtilityApplication'}");
    record22.set("is_published", true);
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
    record23.set("page_name", "QR Code Generator");
    record23.set("meta_title", "Free QR Code Generator | Create QR Codes Online");
    record23.set("meta_description", "Create QR codes with our free online generator. Customize colors, add logos, and download as PNG or SVG. Perfect for marketing and tracking.");
    record23.set("meta_keywords", "QR code generator, create QR code, QR code maker, free QR code, QR code tool");
    record23.set("h1_tag", "QR Code Generator - Create QR Codes Online");
    record23.set("og_title", "Free QR Code Generator");
    record23.set("og_description", "Create QR codes instantly with our free online tool.");
    record23.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'QR Code Generator', 'description': 'Free online QR code generator for code creation', 'applicationCategory': 'UtilityApplication'}");
    record23.set("is_published", true);
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
    record24.set("page_name", "JSON Formatter");
    record24.set("meta_title", "Free JSON Formatter | Format JSON Online Instantly");
    record24.set("meta_description", "Format and validate JSON with our free online tool. Pretty print, minify, and check JSON syntax. Essential for developers.");
    record24.set("meta_keywords", "JSON formatter, JSON validator, format JSON, JSON tool, free JSON formatter");
    record24.set("h1_tag", "JSON Formatter - Format and Validate JSON Online");
    record24.set("og_title", "Free JSON Formatter");
    record24.set("og_description", "Format JSON instantly with our free online tool.");
    record24.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'JSON Formatter', 'description': 'Free online JSON formatter for code formatting', 'applicationCategory': 'DeveloperApplication'}");
    record24.set("is_published", true);
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
    record25.set("page_name", "Text to Speech");
    record25.set("meta_title", "Free Text to Speech | Convert Text to Audio Online");
    record25.set("meta_description", "Convert text to speech with our free online tool. Multiple voices, languages, and download options. Perfect for accessibility and content creation.");
    record25.set("meta_keywords", "text to speech, TTS, convert text to audio, speech synthesis, free TTS");
    record25.set("h1_tag", "Text to Speech - Convert Text to Audio Online");
    record25.set("og_title", "Free Text to Speech");
    record25.set("og_description", "Convert text to speech instantly with our free tool.");
    record25.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Text to Speech', 'description': 'Free online text to speech converter for audio generation', 'applicationCategory': 'MultimediaApplication'}");
    record25.set("is_published", true);
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
    record26.set("page_name", "Speech to Text");
    record26.set("meta_title", "Free Speech to Text | Convert Audio to Text Online");
    record26.set("meta_description", "Convert speech to text with our free online tool. Accurate transcription, multiple languages, and instant results. Perfect for transcription.");
    record26.set("meta_keywords", "speech to text, STT, convert audio to text, transcription, free speech to text");
    record26.set("h1_tag", "Speech to Text - Convert Audio to Text Online");
    record26.set("og_title", "Free Speech to Text");
    record26.set("og_description", "Convert speech to text instantly with our free tool.");
    record26.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Speech to Text', 'description': 'Free online speech to text converter for transcription', 'applicationCategory': 'MultimediaApplication'}");
    record26.set("is_published", true);
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
    record27.set("page_name", "Password Generator");
    record27.set("meta_title", "Free Password Generator | Generate Strong Passwords");
    record27.set("meta_description", "Generate strong, secure passwords with our free online tool. Customize length, characters, and complexity. Perfect for account security.");
    record27.set("meta_keywords", "password generator, generate password, strong password, secure password, free password generator");
    record27.set("h1_tag", "Password Generator - Create Strong Passwords Online");
    record27.set("og_title", "Free Password Generator");
    record27.set("og_description", "Generate strong passwords instantly with our free tool.");
    record27.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Password Generator', 'description': 'Free online password generator for security', 'applicationCategory': 'SecurityApplication'}");
    record27.set("is_published", true);
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
    record28.set("page_name", "UUID Generator");
    record28.set("meta_title", "Free UUID Generator | Generate UUIDs Online");
    record28.set("meta_description", "Generate UUIDs with our free online tool. Create v1, v4, and other UUID versions. Perfect for developers and database management.");
    record28.set("meta_keywords", "UUID generator, generate UUID, GUID generator, UUID tool, free UUID generator");
    record28.set("h1_tag", "UUID Generator - Generate Unique Identifiers Online");
    record28.set("og_title", "Free UUID Generator");
    record28.set("og_description", "Generate UUIDs instantly with our free online tool.");
    record28.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'UUID Generator', 'description': 'Free online UUID generator for identifier creation', 'applicationCategory': 'DeveloperApplication'}");
    record28.set("is_published", true);
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
    record29.set("page_name", "Base64 Encoder");
    record29.set("meta_title", "Free Base64 Encoder | Encode Text to Base64");
    record29.set("meta_description", "Encode and decode Base64 with our free online tool. Perfect for data transmission, email, and API integration.");
    record29.set("meta_keywords", "Base64 encoder, encode Base64, decode Base64, Base64 tool, free encoder");
    record29.set("h1_tag", "Base64 Encoder - Encode and Decode Base64 Online");
    record29.set("og_title", "Free Base64 Encoder");
    record29.set("og_description", "Encode Base64 instantly with our free online tool.");
    record29.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Base64 Encoder', 'description': 'Free online Base64 encoder for data encoding', 'applicationCategory': 'DeveloperApplication'}");
    record29.set("is_published", true);
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
    record30.set("page_name", "Markdown to HTML");
    record30.set("meta_title", "Free Markdown to HTML | Convert Markdown Online");
    record30.set("meta_description", "Convert Markdown to HTML with our free online tool. Perfect for bloggers, developers, and content creators. Instant preview available.");
    record30.set("meta_keywords", "Markdown to HTML, convert Markdown, Markdown converter, HTML converter, free converter");
    record30.set("h1_tag", "Markdown to HTML - Convert Markdown to HTML Online");
    record30.set("og_title", "Free Markdown to HTML");
    record30.set("og_description", "Convert Markdown to HTML instantly with our free tool.");
    record30.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Markdown to HTML', 'description': 'Free online Markdown to HTML converter', 'applicationCategory': 'DeveloperApplication'}");
    record30.set("is_published", true);
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
    record31.set("page_name", "Resume Builder");
    record31.set("meta_title", "Free Resume Builder | Create Professional Resumes");
    record31.set("meta_description", "Build professional resumes with our free online resume builder. Multiple templates, instant download, and ATS-friendly formats.");
    record31.set("meta_keywords", "resume builder, create resume, resume maker, professional resume, free resume builder");
    record31.set("h1_tag", "Resume Builder - Create Professional Resumes Online");
    record31.set("og_title", "Free Resume Builder");
    record31.set("og_description", "Create professional resumes instantly with our free builder.");
    record31.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Resume Builder', 'description': 'Free online resume builder for career documents', 'applicationCategory': 'UtilityApplication'}");
    record31.set("is_published", true);
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
    record32.set("page_name", "Cover Letter Generator");
    record32.set("meta_title", "Free Cover Letter Generator | Create Cover Letters");
    record32.set("meta_description", "Generate professional cover letters with our free online tool. Customizable templates and instant download. Perfect for job applications.");
    record32.set("meta_keywords", "cover letter generator, create cover letter, cover letter maker, free cover letter, job application");
    record32.set("h1_tag", "Cover Letter Generator - Create Professional Cover Letters");
    record32.set("og_title", "Free Cover Letter Generator");
    record32.set("og_description", "Create cover letters instantly with our free generator.");
    record32.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Cover Letter Generator', 'description': 'Free online cover letter generator for job applications', 'applicationCategory': 'UtilityApplication'}");
    record32.set("is_published", true);
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
    record33.set("page_name", "Job Application Tracker");
    record33.set("meta_title", "Free Job Application Tracker | Track Job Applications");
    record33.set("meta_description", "Track job applications with our free online tool. Monitor status, deadlines, and follow-ups. Organize your job search effectively.");
    record33.set("meta_keywords", "job application tracker, track applications, job tracker, application tracker, free tracker");
    record33.set("h1_tag", "Job Application Tracker - Track Your Job Search");
    record33.set("og_title", "Free Job Application Tracker");
    record33.set("og_description", "Track job applications instantly with our free tool.");
    record33.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Job Application Tracker', 'description': 'Free online job application tracker for career management', 'applicationCategory': 'UtilityApplication'}");
    record33.set("is_published", true);
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
    record34.set("page_name", "PDF Merger");
    record34.set("meta_title", "Free PDF Merger | Merge PDF Files Online");
    record34.set("meta_description", "Merge PDF files with our free online tool. Combine multiple PDFs into one. Fast, secure, and no registration required.");
    record34.set("meta_keywords", "PDF merger, merge PDF, combine PDF, PDF tool, free PDF merger");
    record34.set("h1_tag", "PDF Merger - Merge PDF Files Online");
    record34.set("og_title", "Free PDF Merger");
    record34.set("og_description", "Merge PDF files instantly with our free online tool.");
    record34.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'PDF Merger', 'description': 'Free online PDF merger for document combination', 'applicationCategory': 'UtilityApplication'}");
    record34.set("is_published", true);
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
    record35.set("page_name", "PDF Splitter");
    record35.set("meta_title", "Free PDF Splitter | Split PDF Files Online");
    record35.set("meta_description", "Split PDF files with our free online tool. Extract pages, remove pages, and reorganize PDFs. Fast and secure.");
    record35.set("meta_keywords", "PDF splitter, split PDF, extract PDF pages, PDF tool, free PDF splitter");
    record35.set("h1_tag", "PDF Splitter - Split PDF Files Online");
    record35.set("og_title", "Free PDF Splitter");
    record35.set("og_description", "Split PDF files instantly with our free online tool.");
    record35.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'PDF Splitter', 'description': 'Free online PDF splitter for document splitting', 'applicationCategory': 'UtilityApplication'}");
    record35.set("is_published", true);
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
    record36.set("page_name", "PDF Page Rotator");
    record36.set("meta_title", "Free PDF Page Rotator | Rotate PDF Pages Online");
    record36.set("meta_description", "Rotate PDF pages with our free online tool. Rotate individual pages or entire documents. Instant download available.");
    record36.set("meta_keywords", "PDF rotator, rotate PDF, rotate pages, PDF tool, free PDF rotator");
    record36.set("h1_tag", "PDF Page Rotator - Rotate PDF Pages Online");
    record36.set("og_title", "Free PDF Page Rotator");
    record36.set("og_description", "Rotate PDF pages instantly with our free online tool.");
    record36.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'PDF Page Rotator', 'description': 'Free online PDF page rotator for document rotation', 'applicationCategory': 'UtilityApplication'}");
    record36.set("is_published", true);
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
    record37.set("page_name", "PDF Page Extractor");
    record37.set("meta_title", "Free PDF Page Extractor | Extract PDF Pages Online");
    record37.set("meta_description", "Extract pages from PDF with our free online tool. Select specific pages and download as new PDF. Fast and secure.");
    record37.set("meta_keywords", "PDF extractor, extract PDF pages, PDF tool, page extractor, free PDF extractor");
    record37.set("h1_tag", "PDF Page Extractor - Extract Pages from PDF Online");
    record37.set("og_title", "Free PDF Page Extractor");
    record37.set("og_description", "Extract PDF pages instantly with our free online tool.");
    record37.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'PDF Page Extractor', 'description': 'Free online PDF page extractor for page extraction', 'applicationCategory': 'UtilityApplication'}");
    record37.set("is_published", true);
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
    record38.set("page_name", "PDF Text Adder");
    record38.set("meta_title", "Free PDF Text Adder | Add Text to PDF Online");
    record38.set("meta_description", "Add text to PDF with our free online tool. Customize font, size, and position. Perfect for annotations and form filling.");
    record38.set("meta_keywords", "PDF text adder, add text to PDF, PDF tool, text annotation, free PDF editor");
    record38.set("h1_tag", "PDF Text Adder - Add Text to PDF Online");
    record38.set("og_title", "Free PDF Text Adder");
    record38.set("og_description", "Add text to PDF instantly with our free online tool.");
    record38.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'PDF Text Adder', 'description': 'Free online PDF text adder for document annotation', 'applicationCategory': 'UtilityApplication'}");
    record38.set("is_published", true);
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
    record39.set("page_name", "PDF Watermark Adder");
    record39.set("meta_title", "Free PDF Watermark Adder | Add Watermark to PDF");
    record39.set("meta_description", "Add watermarks to PDF with our free online tool. Protect documents with text or image watermarks. Batch processing available.");
    record39.set("meta_keywords", "PDF watermark, add watermark to PDF, watermark tool, PDF protection, free watermark");
    record39.set("h1_tag", "PDF Watermark Adder - Add Watermarks to PDF Online");
    record39.set("og_title", "Free PDF Watermark Adder");
    record39.set("og_description", "Add watermarks to PDF instantly with our free tool.");
    record39.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'PDF Watermark Adder', 'description': 'Free online PDF watermark adder for document protection', 'applicationCategory': 'UtilityApplication'}");
    record39.set("is_published", true);
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
    record40.set("page_name", "PDF to Image Converter");
    record40.set("meta_title", "Free PDF to Image Converter | Convert PDF to Images");
    record40.set("meta_description", "Convert PDF to images with our free online tool. Export as JPG, PNG, or GIF. Fast conversion with high quality.");
    record40.set("meta_keywords", "PDF to image, convert PDF, image converter, PDF converter, free converter");
    record40.set("h1_tag", "PDF to Image Converter - Convert PDF to Images Online");
    record40.set("og_title", "Free PDF to Image Converter");
    record40.set("og_description", "Convert PDF to images instantly with our free tool.");
    record40.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'PDF to Image Converter', 'description': 'Free online PDF to image converter for format conversion', 'applicationCategory': 'UtilityApplication'}");
    record40.set("is_published", true);
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
    record41.set("page_name", "PDF Blank Page Remover");
    record41.set("meta_title", "Free PDF Blank Page Remover | Remove Blank Pages");
    record41.set("meta_description", "Remove blank pages from PDF with our free online tool. Clean up documents automatically. Fast and secure.");
    record41.set("meta_keywords", "PDF blank page remover, remove blank pages, PDF tool, page remover, free PDF editor");
    record41.set("h1_tag", "PDF Blank Page Remover - Remove Blank Pages from PDF");
    record41.set("og_title", "Free PDF Blank Page Remover");
    record41.set("og_description", "Remove blank pages from PDF instantly with our free tool.");
    record41.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'PDF Blank Page Remover', 'description': 'Free online PDF blank page remover for document cleanup', 'applicationCategory': 'UtilityApplication'}");
    record41.set("is_published", true);
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
    record42.set("page_name", "PDF Page Number");
    record42.set("meta_title", "Free PDF Page Number | Add Page Numbers to PDF");
    record42.set("meta_description", "Add page numbers to PDF with our free online tool. Customize position, format, and style. Perfect for professional documents.");
    record42.set("meta_keywords", "PDF page number, add page numbers, page numbering, PDF tool, free PDF editor");
    record42.set("h1_tag", "PDF Page Number - Add Page Numbers to PDF Online");
    record42.set("og_title", "Free PDF Page Number");
    record42.set("og_description", "Add page numbers to PDF instantly with our free tool.");
    record42.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'PDF Page Number', 'description': 'Free online PDF page number adder for document formatting', 'applicationCategory': 'UtilityApplication'}");
    record42.set("is_published", true);
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
    record43.set("page_name", "PDF Header Footer Adder");
    record43.set("meta_title", "Free PDF Header Footer Adder | Add Headers and Footers");
    record43.set("meta_description", "Add headers and footers to PDF with our free online tool. Customize text, position, and style. Perfect for professional documents.");
    record43.set("meta_keywords", "PDF header footer, add header footer, PDF tool, document formatting, free PDF editor");
    record43.set("h1_tag", "PDF Header Footer Adder - Add Headers and Footers to PDF");
    record43.set("og_title", "Free PDF Header Footer Adder");
    record43.set("og_description", "Add headers and footers to PDF instantly with our free tool.");
    record43.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'PDF Header Footer Adder', 'description': 'Free online PDF header footer adder for document formatting', 'applicationCategory': 'UtilityApplication'}");
    record43.set("is_published", true);
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
    record44.set("page_name", "PDF QR Code Adder");
    record44.set("meta_title", "Free PDF QR Code Adder | Add QR Codes to PDF");
    record44.set("meta_description", "Add QR codes to PDF with our free online tool. Customize position, size, and content. Perfect for marketing and tracking.");
    record44.set("meta_keywords", "PDF QR code, add QR code to PDF, QR code tool, PDF editor, free QR code");
    record44.set("h1_tag", "PDF QR Code Adder - Add QR Codes to PDF Online");
    record44.set("og_title", "Free PDF QR Code Adder");
    record44.set("og_description", "Add QR codes to PDF instantly with our free tool.");
    record44.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'PDF QR Code Adder', 'description': 'Free online PDF QR code adder for document enhancement', 'applicationCategory': 'UtilityApplication'}");
    record44.set("is_published", true);
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
    record45.set("page_name", "PDF Bookmark Creator");
    record45.set("meta_title", "Free PDF Bookmark Creator | Create PDF Bookmarks");
    record45.set("meta_description", "Create bookmarks in PDF with our free online tool. Improve navigation and user experience. Perfect for long documents.");
    record45.set("meta_keywords", "PDF bookmark, create bookmarks, PDF navigation, PDF tool, free PDF editor");
    record45.set("h1_tag", "PDF Bookmark Creator - Create Bookmarks in PDF Online");
    record45.set("og_title", "Free PDF Bookmark Creator");
    record45.set("og_description", "Create bookmarks in PDF instantly with our free tool.");
    record45.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'PDF Bookmark Creator', 'description': 'Free online PDF bookmark creator for document navigation', 'applicationCategory': 'UtilityApplication'}");
    record45.set("is_published", true);
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
    record46.set("page_name", "Receipt Generator");
    record46.set("meta_title", "Free Receipt Generator | Create Receipts Online");
    record46.set("meta_description", "Generate professional receipts with our free online tool. Customizable templates, instant download, and print-ready formats.");
    record46.set("meta_keywords", "receipt generator, create receipt, receipt maker, free receipt, business receipt");
    record46.set("h1_tag", "Receipt Generator - Create Professional Receipts Online");
    record46.set("og_title", "Free Receipt Generator");
    record46.set("og_description", "Create receipts instantly with our free online tool.");
    record46.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Receipt Generator', 'description': 'Free online receipt generator for business documents', 'applicationCategory': 'UtilityApplication'}");
    record46.set("is_published", true);
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
    record47.set("page_name", "Certificate Generator");
    record47.set("meta_title", "Free Certificate Generator | Create Certificates Online");
    record47.set("meta_description", "Create professional certificates with our free online tool. Customizable designs, instant download, and print-ready formats.");
    record47.set("meta_keywords", "certificate generator, create certificate, certificate maker, free certificate, award certificate");
    record47.set("h1_tag", "Certificate Generator - Create Professional Certificates");
    record47.set("og_title", "Free Certificate Generator");
    record47.set("og_description", "Create certificates instantly with our free online tool.");
    record47.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Certificate Generator', 'description': 'Free online certificate generator for document creation', 'applicationCategory': 'UtilityApplication'}");
    record47.set("is_published", true);
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
    record48.set("page_name", "Letter Generator");
    record48.set("meta_title", "Free Letter Generator | Create Letters Online");
    record48.set("meta_description", "Generate professional letters with our free online tool. Multiple templates, instant download, and customizable formats.");
    record48.set("meta_keywords", "letter generator, create letter, letter maker, free letter, business letter");
    record48.set("h1_tag", "Letter Generator - Create Professional Letters Online");
    record48.set("og_title", "Free Letter Generator");
    record48.set("og_description", "Create letters instantly with our free online tool.");
    record48.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Letter Generator', 'description': 'Free online letter generator for document creation', 'applicationCategory': 'UtilityApplication'}");
    record48.set("is_published", true);
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
    record49.set("page_name", "Contract Generator");
    record49.set("meta_title", "Free Contract Generator | Create Contracts Online");
    record49.set("meta_description", "Generate legal contracts with our free online tool. Customizable templates, instant download, and legally sound formats.");
    record49.set("meta_keywords", "contract generator, create contract, contract maker, free contract, legal contract");
    record49.set("h1_tag", "Contract Generator - Create Legal Contracts Online");
    record49.set("og_title", "Free Contract Generator");
    record49.set("og_description", "Create contracts instantly with our free online tool.");
    record49.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Contract Generator', 'description': 'Free online contract generator for legal documents', 'applicationCategory': 'UtilityApplication'}");
    record49.set("is_published", true);
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
    record50.set("page_name", "Proposal Generator");
    record50.set("meta_title", "Free Proposal Generator | Create Proposals Online");
    record50.set("meta_description", "Generate professional proposals with our free online tool. Customizable templates, instant download, and business-ready formats.");
    record50.set("meta_keywords", "proposal generator, create proposal, proposal maker, free proposal, business proposal");
    record50.set("h1_tag", "Proposal Generator - Create Professional Proposals Online");
    record50.set("og_title", "Free Proposal Generator");
    record50.set("og_description", "Create proposals instantly with our free online tool.");
    record50.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Proposal Generator', 'description': 'Free online proposal generator for business documents', 'applicationCategory': 'UtilityApplication'}");
    record50.set("is_published", true);
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
    record51.set("page_name", "Quote Generator");
    record51.set("meta_title", "Free Quote Generator | Create Quotes Online");
    record51.set("meta_description", "Generate professional quotes with our free online tool. Customizable templates, instant download, and business-ready formats.");
    record51.set("meta_keywords", "quote generator, create quote, quote maker, free quote, business quote");
    record51.set("h1_tag", "Quote Generator - Create Professional Quotes Online");
    record51.set("og_title", "Free Quote Generator");
    record51.set("og_description", "Create quotes instantly with our free online tool.");
    record51.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Quote Generator', 'description': 'Free online quote generator for business documents', 'applicationCategory': 'UtilityApplication'}");
    record51.set("is_published", true);
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
    record52.set("page_name", "Slug Generator");
    record52.set("meta_title", "Free Slug Generator | Generate URL Slugs Online");
    record52.set("meta_description", "Generate URL-friendly slugs with our free online tool. Perfect for SEO and web development. Instant conversion available.");
    record52.set("meta_keywords", "slug generator, generate slug, URL slug, slug maker, free slug generator");
    record52.set("h1_tag", "Slug Generator - Generate URL-Friendly Slugs Online");
    record52.set("og_title", "Free Slug Generator");
    record52.set("og_description", "Generate slugs instantly with our free online tool.");
    record52.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Slug Generator', 'description': 'Free online slug generator for URL creation', 'applicationCategory': 'UtilityApplication'}");
    record52.set("is_published", true);
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
    record53.set("page_name", "Random Name Generator");
    record53.set("meta_title", "Free Random Name Generator | Generate Names Online");
    record53.set("meta_description", "Generate random names with our free online tool. Perfect for characters, businesses, and creative projects. Multiple name types available.");
    record53.set("meta_keywords", "random name generator, generate names, name maker, random names, free name generator");
    record53.set("h1_tag", "Random Name Generator - Generate Random Names Online");
    record53.set("og_title", "Free Random Name Generator");
    record53.set("og_description", "Generate random names instantly with our free tool.");
    record53.set("structured_data", "{'@context': 'https://schema.org', '@type': 'SoftwareApplication', 'name': 'Random Name Generator', 'description': 'Free online random name generator for creative projects', 'applicationCategory': 'UtilityApplication'}");
    record53.set("is_published", true);
  try {
    app.save(record53);
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