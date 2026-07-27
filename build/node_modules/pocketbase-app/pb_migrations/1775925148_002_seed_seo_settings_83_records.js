/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("seo_settings");

  const record0 = new Record(collection);
    record0.set("page_name", "global");
    record0.set("meta_title", "Productivity Tools - All-in-One Platform");
    record0.set("meta_description", "Discover powerful productivity tools to simplify your daily tasks. Free calculators, generators, and utilities for everyone.");
    record0.set("meta_keywords", "productivity tools, calculators, generators, utilities, online tools");
    record0.set("canonical_url", "https://example.com");
    record0.set("og_title", "Productivity Tools Platform");
    record0.set("og_description", "All-in-one platform with 50+ productivity tools");
    record0.set("twitter_title", "Productivity Tools");
    record0.set("twitter_description", "Discover powerful productivity tools");
    record0.set("structured_data", "{\"@context\": \"https://schema.org\", \"@type\": \"Organization\", \"name\": \"Productivity Tools\", \"url\": \"https://example.com\"}");
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
    record1.set("page_name", "homepage");
    record1.set("meta_title", "Home - Productivity Tools Platform");
    record1.set("meta_description", "Welcome to our productivity tools platform. Access 50+ free tools to boost your productivity.");
    record1.set("meta_keywords", "productivity, tools, calculators, generators");
    record1.set("canonical_url", "https://example.com/");
    record1.set("og_title", "Productivity Tools - Home");
    record1.set("og_description", "Discover 50+ productivity tools");
    record1.set("twitter_title", "Productivity Tools Home");
    record1.set("twitter_description", "Access free productivity tools");
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
    record2.set("page_name", "about");
    record2.set("meta_title", "About Us - Productivity Tools");
    record2.set("meta_description", "Learn about our mission to empower individuals with innovative productivity tools.");
    record2.set("meta_keywords", "about, mission, vision, productivity");
    record2.set("canonical_url", "https://example.com/about");
    record2.set("og_title", "About Productivity Tools");
    record2.set("og_description", "Our mission and vision");
    record2.set("twitter_title", "About Us");
    record2.set("twitter_description", "Learn about our mission");
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
    record3.set("page_name", "contact");
    record3.set("meta_title", "Contact Us - Productivity Tools");
    record3.set("meta_description", "Get in touch with our team. We'd love to hear from you.");
    record3.set("meta_keywords", "contact, support, help");
    record3.set("canonical_url", "https://example.com/contact");
    record3.set("og_title", "Contact Us");
    record3.set("og_description", "Get in touch with our team");
    record3.set("twitter_title", "Contact Us");
    record3.set("twitter_description", "Reach out to our support team");
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
    record4.set("page_name", "category_productivity");
    record4.set("meta_title", "Productivity Tools - Boost Your Efficiency");
    record4.set("meta_description", "Explore our collection of productivity tools designed to help you manage tasks, time, and goals effectively.");
    record4.set("meta_keywords", "productivity tools, task management, time management, goal tracking");
    record4.set("canonical_url", "https://example.com/category/productivity");
    record4.set("og_title", "Productivity Tools Category");
    record4.set("og_description", "Boost your productivity with our tools");
    record4.set("twitter_title", "Productivity Category");
    record4.set("twitter_description", "Productivity tools collection");
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
    record5.set("page_name", "category_finance");
    record5.set("meta_title", "Finance Tools - Calculate & Manage Your Money");
    record5.set("meta_description", "Financial calculators and tools to help you manage budgets, investments, loans, and more.");
    record5.set("meta_keywords", "finance tools, calculators, budget, investment, loan");
    record5.set("canonical_url", "https://example.com/category/finance");
    record5.set("og_title", "Finance Tools Category");
    record5.set("og_description", "Financial calculators and tools");
    record5.set("twitter_title", "Finance Category");
    record5.set("twitter_description", "Finance tools collection");
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
    record6.set("page_name", "category_converters");
    record6.set("meta_title", "Converter Tools - Convert Units & Formats");
    record6.set("meta_description", "Convert between different units, currencies, and file formats with our easy-to-use converter tools.");
    record6.set("meta_keywords", "converter, unit converter, currency converter, file converter");
    record6.set("canonical_url", "https://example.com/category/converters");
    record6.set("og_title", "Converter Tools Category");
    record6.set("og_description", "Convert units and formats easily");
    record6.set("twitter_title", "Converters Category");
    record6.set("twitter_description", "Converter tools collection");
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
    record7.set("page_name", "category_utilities");
    record7.set("meta_title", "Utility Tools - Essential Tools for Daily Use");
    record7.set("meta_description", "Handy utility tools for everyday tasks including text processing, QR codes, and more.");
    record7.set("meta_keywords", "utility tools, text tools, QR code, daily tools");
    record7.set("canonical_url", "https://example.com/category/utilities");
    record7.set("og_title", "Utility Tools Category");
    record7.set("og_description", "Essential utility tools");
    record7.set("twitter_title", "Utilities Category");
    record7.set("twitter_description", "Utility tools collection");
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
    record8.set("page_name", "category_science");
    record8.set("meta_title", "Science Tools - Scientific Calculators & Tools");
    record8.set("meta_description", "Scientific calculators and tools for physics, chemistry, mathematics, and more.");
    record8.set("meta_keywords", "science tools, scientific calculator, physics, chemistry, math");
    record8.set("canonical_url", "https://example.com/category/science");
    record8.set("og_title", "Science Tools Category");
    record8.set("og_description", "Scientific calculators and tools");
    record8.set("twitter_title", "Science Category");
    record8.set("twitter_description", "Science tools collection");
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
    record9.set("page_name", "category_developer");
    record9.set("meta_title", "Developer Tools - Code & Development Utilities");
    record9.set("meta_description", "Developer tools for coding, debugging, and development tasks including JSON, regex, and more.");
    record9.set("meta_keywords", "developer tools, code tools, JSON, regex, programming");
    record9.set("canonical_url", "https://example.com/category/developer");
    record9.set("og_title", "Developer Tools Category");
    record9.set("og_description", "Developer tools and utilities");
    record9.set("twitter_title", "Developer Category");
    record9.set("twitter_description", "Developer tools collection");
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
    record10.set("page_name", "category_image");
    record10.set("meta_title", "Image Tools - Edit & Convert Images");
    record10.set("meta_description", "Image editing and conversion tools for resizing, compressing, and converting images.");
    record10.set("meta_keywords", "image tools, image editor, image converter, resize, compress");
    record10.set("canonical_url", "https://example.com/category/image");
    record10.set("og_title", "Image Tools Category");
    record10.set("og_description", "Image editing and conversion tools");
    record10.set("twitter_title", "Image Category");
    record10.set("twitter_description", "Image tools collection");
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
    record11.set("page_name", "category_document");
    record11.set("meta_title", "Document Tools - Create & Convert Documents");
    record11.set("meta_description", "Document tools for creating, converting, and managing PDFs, Word documents, and more.");
    record11.set("meta_keywords", "document tools, PDF tools, Word converter, document converter");
    record11.set("canonical_url", "https://example.com/category/document");
    record11.set("og_title", "Document Tools Category");
    record11.set("og_description", "Document creation and conversion tools");
    record11.set("twitter_title", "Document Category");
    record11.set("twitter_description", "Document tools collection");
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
    record12.set("page_name", "category_generators");
    record12.set("meta_title", "Generator Tools - Generate Content & Data");
    record12.set("meta_description", "Content and data generators including password generators, QR codes, and more.");
    record12.set("meta_keywords", "generator tools, password generator, QR code, content generator");
    record12.set("canonical_url", "https://example.com/category/generators");
    record12.set("og_title", "Generator Tools Category");
    record12.set("og_description", "Content and data generators");
    record12.set("twitter_title", "Generators Category");
    record12.set("twitter_description", "Generator tools collection");
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
    record13.set("page_name", "category_real_estate");
    record13.set("meta_title", "Real Estate Tools - Property & Investment Calculators");
    record13.set("meta_description", "Real estate tools for property valuation, mortgage calculation, and investment analysis.");
    record13.set("meta_keywords", "real estate tools, property calculator, mortgage, investment");
    record13.set("canonical_url", "https://example.com/category/real_estate");
    record13.set("og_title", "Real Estate Tools Category");
    record13.set("og_description", "Real estate and property tools");
    record13.set("twitter_title", "Real Estate Category");
    record13.set("twitter_description", "Real estate tools collection");
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
    record14.set("page_name", "category_career");
    record14.set("meta_title", "Career Tools - Resume & Job Search Tools");
    record14.set("meta_description", "Career tools including resume builder, cover letter generator, and job search utilities.");
    record14.set("meta_keywords", "career tools, resume builder, cover letter, job search");
    record14.set("canonical_url", "https://example.com/category/career");
    record14.set("og_title", "Career Tools Category");
    record14.set("og_description", "Career and job search tools");
    record14.set("twitter_title", "Career Category");
    record14.set("twitter_description", "Career tools collection");
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
    record15.set("page_name", "gst_calculator");
    record15.set("meta_title", "GST Calculator - Calculate Goods & Services Tax");
    record15.set("meta_description", "Free GST calculator to calculate tax on goods and services. Easy to use and accurate.");
    record15.set("meta_keywords", "GST calculator, tax calculator, goods and services tax");
    record15.set("canonical_url", "https://example.com/tools/gst-calculator");
    record15.set("og_title", "GST Calculator");
    record15.set("og_description", "Calculate GST easily");
    record15.set("twitter_title", "GST Calculator");
    record15.set("twitter_description", "Free GST calculation tool");
    record15.set("structured_data", "{\"@context\": \"https://schema.org\", \"@type\": \"WebApplication\", \"name\": \"GST Calculator\", \"description\": \"Calculate GST on goods and services\"}");
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
    record16.set("page_name", "emi_calculator");
    record16.set("meta_title", "EMI Calculator - Calculate Loan EMI");
    record16.set("meta_description", "Free EMI calculator to calculate monthly loan payments. Supports various loan types.");
    record16.set("meta_keywords", "EMI calculator, loan calculator, monthly payment");
    record16.set("canonical_url", "https://example.com/tools/emi-calculator");
    record16.set("og_title", "EMI Calculator");
    record16.set("og_description", "Calculate loan EMI easily");
    record16.set("twitter_title", "EMI Calculator");
    record16.set("twitter_description", "Free EMI calculation tool");
    record16.set("structured_data", "{\"@context\": \"https://schema.org\", \"@type\": \"WebApplication\", \"name\": \"EMI Calculator\", \"description\": \"Calculate monthly loan payments\"}");
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
    record17.set("page_name", "resume_builder");
    record17.set("meta_title", "Resume Builder - Create Professional Resumes");
    record17.set("meta_description", "Free resume builder to create professional resumes. Multiple templates and easy customization.");
    record17.set("meta_keywords", "resume builder, CV builder, resume template, job application");
    record17.set("canonical_url", "https://example.com/tools/resume-builder");
    record17.set("og_title", "Resume Builder");
    record17.set("og_description", "Create professional resumes");
    record17.set("twitter_title", "Resume Builder");
    record17.set("twitter_description", "Free resume creation tool");
    record17.set("structured_data", "{\"@context\": \"https://schema.org\", \"@type\": \"WebApplication\", \"name\": \"Resume Builder\", \"description\": \"Create professional resumes\"}");
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
    record18.set("page_name", "cover_letter_generator");
    record18.set("meta_title", "Cover Letter Generator - Create Cover Letters");
    record18.set("meta_description", "Free cover letter generator to create professional cover letters for job applications.");
    record18.set("meta_keywords", "cover letter generator, cover letter template, job application");
    record18.set("canonical_url", "https://example.com/tools/cover-letter-generator");
    record18.set("og_title", "Cover Letter Generator");
    record18.set("og_description", "Generate professional cover letters");
    record18.set("twitter_title", "Cover Letter Generator");
    record18.set("twitter_description", "Free cover letter creation tool");
    record18.set("structured_data", "{\"@context\": \"https://schema.org\", \"@type\": \"WebApplication\", \"name\": \"Cover Letter Generator\", \"description\": \"Create professional cover letters\"}");
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
    record19.set("page_name", "compound_interest_calculator");
    record19.set("meta_title", "Compound Interest Calculator - Calculate Investment Returns");
    record19.set("meta_description", "Calculate compound interest on investments. See how your money grows over time.");
    record19.set("meta_keywords", "compound interest, investment calculator, interest calculator");
    record19.set("canonical_url", "https://example.com/tools/compound-interest-calculator");
    record19.set("og_title", "Compound Interest Calculator");
    record19.set("og_description", "Calculate investment returns");
    record19.set("twitter_title", "Compound Interest Calculator");
    record19.set("twitter_description", "Free compound interest calculator");
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
    record20.set("page_name", "simple_interest_calculator");
    record20.set("meta_title", "Simple Interest Calculator - Calculate Interest");
    record20.set("meta_description", "Free simple interest calculator. Calculate interest on loans and investments.");
    record20.set("meta_keywords", "simple interest, interest calculator, loan calculator");
    record20.set("canonical_url", "https://example.com/tools/simple-interest-calculator");
    record20.set("og_title", "Simple Interest Calculator");
    record20.set("og_description", "Calculate simple interest");
    record20.set("twitter_title", "Simple Interest Calculator");
    record20.set("twitter_description", "Free simple interest calculator");
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
    record21.set("page_name", "percentage_calculator");
    record21.set("meta_title", "Percentage Calculator - Calculate Percentages");
    record21.set("meta_description", "Free percentage calculator for all your percentage calculation needs.");
    record21.set("meta_keywords", "percentage calculator, percent, calculation");
    record21.set("canonical_url", "https://example.com/tools/percentage-calculator");
    record21.set("og_title", "Percentage Calculator");
    record21.set("og_description", "Calculate percentages easily");
    record21.set("twitter_title", "Percentage Calculator");
    record21.set("twitter_description", "Free percentage calculator");
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
    record22.set("page_name", "discount_calculator");
    record22.set("meta_title", "Discount Calculator - Calculate Discounts");
    record22.set("meta_description", "Free discount calculator to calculate discounts and sale prices.");
    record22.set("meta_keywords", "discount calculator, sale price, discount percentage");
    record22.set("canonical_url", "https://example.com/tools/discount-calculator");
    record22.set("og_title", "Discount Calculator");
    record22.set("og_description", "Calculate discounts and sale prices");
    record22.set("twitter_title", "Discount Calculator");
    record22.set("twitter_description", "Free discount calculator");
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
    record23.set("page_name", "profit_loss_calculator");
    record23.set("meta_title", "Profit Loss Calculator - Calculate Business Profit");
    record23.set("meta_description", "Calculate profit and loss for your business. Track revenue and expenses.");
    record23.set("meta_keywords", "profit loss calculator, business calculator, revenue");
    record23.set("canonical_url", "https://example.com/tools/profit-loss-calculator");
    record23.set("og_title", "Profit Loss Calculator");
    record23.set("og_description", "Calculate business profit and loss");
    record23.set("twitter_title", "Profit Loss Calculator");
    record23.set("twitter_description", "Free profit loss calculator");
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
    record24.set("page_name", "age_calculator");
    record24.set("meta_title", "Age Calculator - Calculate Your Age");
    record24.set("meta_description", "Free age calculator to calculate your exact age in years, months, and days.");
    record24.set("meta_keywords", "age calculator, age in days, birthday calculator");
    record24.set("canonical_url", "https://example.com/tools/age-calculator");
    record24.set("og_title", "Age Calculator");
    record24.set("og_description", "Calculate your exact age");
    record24.set("twitter_title", "Age Calculator");
    record24.set("twitter_description", "Free age calculator");
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
    record25.set("page_name", "bmi_calculator");
    record25.set("meta_title", "BMI Calculator - Calculate Body Mass Index");
    record25.set("meta_description", "Free BMI calculator to calculate your body mass index and health status.");
    record25.set("meta_keywords", "BMI calculator, body mass index, health calculator");
    record25.set("canonical_url", "https://example.com/tools/bmi-calculator");
    record25.set("og_title", "BMI Calculator");
    record25.set("og_description", "Calculate your BMI");
    record25.set("twitter_title", "BMI Calculator");
    record25.set("twitter_description", "Free BMI calculator");
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
    record26.set("page_name", "calorie_calculator");
    record26.set("meta_title", "Calorie Calculator - Calculate Daily Calories");
    record26.set("meta_description", "Calculate your daily calorie needs based on your activity level and goals.");
    record26.set("meta_keywords", "calorie calculator, daily calories, nutrition");
    record26.set("canonical_url", "https://example.com/tools/calorie-calculator");
    record26.set("og_title", "Calorie Calculator");
    record26.set("og_description", "Calculate daily calorie needs");
    record26.set("twitter_title", "Calorie Calculator");
    record26.set("twitter_description", "Free calorie calculator");
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
    record27.set("page_name", "currency_converter");
    record27.set("meta_title", "Currency Converter - Convert Currencies");
    record27.set("meta_description", "Free currency converter with real-time exchange rates. Convert between any currencies.");
    record27.set("meta_keywords", "currency converter, exchange rate, money converter");
    record27.set("canonical_url", "https://example.com/tools/currency-converter");
    record27.set("og_title", "Currency Converter");
    record27.set("og_description", "Convert currencies with live rates");
    record27.set("twitter_title", "Currency Converter");
    record27.set("twitter_description", "Free currency converter");
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
    record28.set("page_name", "unit_converter");
    record28.set("meta_title", "Unit Converter - Convert Units");
    record28.set("meta_description", "Free unit converter for length, weight, temperature, volume, and more.");
    record28.set("meta_keywords", "unit converter, length converter, weight converter");
    record28.set("canonical_url", "https://example.com/tools/unit-converter");
    record28.set("og_title", "Unit Converter");
    record28.set("og_description", "Convert between different units");
    record28.set("twitter_title", "Unit Converter");
    record28.set("twitter_description", "Free unit converter");
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
    record29.set("page_name", "temperature_converter");
    record29.set("meta_title", "Temperature Converter - Convert Temperature");
    record29.set("meta_description", "Convert between Celsius, Fahrenheit, and Kelvin easily.");
    record29.set("meta_keywords", "temperature converter, celsius, fahrenheit");
    record29.set("canonical_url", "https://example.com/tools/temperature-converter");
    record29.set("og_title", "Temperature Converter");
    record29.set("og_description", "Convert temperature units");
    record29.set("twitter_title", "Temperature Converter");
    record29.set("twitter_description", "Free temperature converter");
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
    record30.set("page_name", "password_generator");
    record30.set("meta_title", "Password Generator - Generate Strong Passwords");
    record30.set("meta_description", "Free password generator to create strong, secure passwords for your accounts.");
    record30.set("meta_keywords", "password generator, strong password, security");
    record30.set("canonical_url", "https://example.com/tools/password-generator");
    record30.set("og_title", "Password Generator");
    record30.set("og_description", "Generate secure passwords");
    record30.set("twitter_title", "Password Generator");
    record30.set("twitter_description", "Free password generator");
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
    record31.set("page_name", "qr_code_generator");
    record31.set("meta_title", "QR Code Generator - Create QR Codes");
    record31.set("meta_description", "Free QR code generator to create QR codes for URLs, text, and more.");
    record31.set("meta_keywords", "QR code generator, QR code, barcode");
    record31.set("canonical_url", "https://example.com/tools/qr-code-generator");
    record31.set("og_title", "QR Code Generator");
    record31.set("og_description", "Generate QR codes easily");
    record31.set("twitter_title", "QR Code Generator");
    record31.set("twitter_description", "Free QR code generator");
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
    record32.set("page_name", "json_formatter");
    record32.set("meta_title", "JSON Formatter - Format & Validate JSON");
    record32.set("meta_description", "Free JSON formatter and validator. Format, validate, and beautify JSON code.");
    record32.set("meta_keywords", "JSON formatter, JSON validator, code formatter");
    record32.set("canonical_url", "https://example.com/tools/json-formatter");
    record32.set("og_title", "JSON Formatter");
    record32.set("og_description", "Format and validate JSON");
    record32.set("twitter_title", "JSON Formatter");
    record32.set("twitter_description", "Free JSON formatter");
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
    record33.set("page_name", "regex_tester");
    record33.set("meta_title", "Regex Tester - Test Regular Expressions");
    record33.set("meta_description", "Free regex tester to test and validate regular expressions.");
    record33.set("meta_keywords", "regex tester, regular expression, pattern matching");
    record33.set("canonical_url", "https://example.com/tools/regex-tester");
    record33.set("og_title", "Regex Tester");
    record33.set("og_description", "Test regular expressions");
    record33.set("twitter_title", "Regex Tester");
    record33.set("twitter_description", "Free regex tester");
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
    record34.set("page_name", "base64_encoder");
    record34.set("meta_title", "Base64 Encoder - Encode & Decode Base64");
    record34.set("meta_description", "Free Base64 encoder and decoder. Encode text to Base64 and decode Base64 strings.");
    record34.set("meta_keywords", "Base64 encoder, Base64 decoder, encoding");
    record34.set("canonical_url", "https://example.com/tools/base64-encoder");
    record34.set("og_title", "Base64 Encoder");
    record34.set("og_description", "Encode and decode Base64");
    record34.set("twitter_title", "Base64 Encoder");
    record34.set("twitter_description", "Free Base64 encoder");
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
    record35.set("page_name", "url_encoder");
    record35.set("meta_title", "URL Encoder - Encode & Decode URLs");
    record35.set("meta_description", "Free URL encoder and decoder. Encode URLs and decode URL-encoded strings.");
    record35.set("meta_keywords", "URL encoder, URL decoder, URL encoding");
    record35.set("canonical_url", "https://example.com/tools/url-encoder");
    record35.set("og_title", "URL Encoder");
    record35.set("og_description", "Encode and decode URLs");
    record35.set("twitter_title", "URL Encoder");
    record35.set("twitter_description", "Free URL encoder");
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
    record36.set("page_name", "hash_generator");
    record36.set("meta_title", "Hash Generator - Generate Hash Values");
    record36.set("meta_description", "Free hash generator for MD5, SHA1, SHA256, and more.");
    record36.set("meta_keywords", "hash generator, MD5, SHA256, encryption");
    record36.set("canonical_url", "https://example.com/tools/hash-generator");
    record36.set("og_title", "Hash Generator");
    record36.set("og_description", "Generate hash values");
    record36.set("twitter_title", "Hash Generator");
    record36.set("twitter_description", "Free hash generator");
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
    record37.set("page_name", "text_to_speech");
    record37.set("meta_title", "Text to Speech - Convert Text to Audio");
    record37.set("meta_description", "Free text to speech converter. Convert text to audio with natural voices.");
    record37.set("meta_keywords", "text to speech, TTS, audio converter");
    record37.set("canonical_url", "https://example.com/tools/text-to-speech");
    record37.set("og_title", "Text to Speech");
    record37.set("og_description", "Convert text to audio");
    record37.set("twitter_title", "Text to Speech");
    record37.set("twitter_description", "Free text to speech converter");
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
    record38.set("page_name", "word_counter");
    record38.set("meta_title", "Word Counter - Count Words & Characters");
    record38.set("meta_description", "Free word counter tool. Count words, characters, sentences, and paragraphs.");
    record38.set("meta_keywords", "word counter, character counter, text analysis");
    record38.set("canonical_url", "https://example.com/tools/word-counter");
    record38.set("og_title", "Word Counter");
    record38.set("og_description", "Count words and characters");
    record38.set("twitter_title", "Word Counter");
    record38.set("twitter_description", "Free word counter");
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
    record39.set("page_name", "text_case_converter");
    record39.set("meta_title", "Text Case Converter - Change Text Case");
    record39.set("meta_description", "Free text case converter. Convert text to uppercase, lowercase, title case, and more.");
    record39.set("meta_keywords", "text case converter, uppercase, lowercase, case converter");
    record39.set("canonical_url", "https://example.com/tools/text-case-converter");
    record39.set("og_title", "Text Case Converter");
    record39.set("og_description", "Convert text case");
    record39.set("twitter_title", "Text Case Converter");
    record39.set("twitter_description", "Free text case converter");
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
    record40.set("page_name", "image_resizer");
    record40.set("meta_title", "Image Resizer - Resize Images Online");
    record40.set("meta_description", "Free image resizer to resize images to any dimensions. Supports multiple formats.");
    record40.set("meta_keywords", "image resizer, resize image, image tool");
    record40.set("canonical_url", "https://example.com/tools/image-resizer");
    record40.set("og_title", "Image Resizer");
    record40.set("og_description", "Resize images online");
    record40.set("twitter_title", "Image Resizer");
    record40.set("twitter_description", "Free image resizer");
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
    record41.set("page_name", "image_compressor");
    record41.set("meta_title", "Image Compressor - Compress Images");
    record41.set("meta_description", "Free image compressor to reduce image file size without losing quality.");
    record41.set("meta_keywords", "image compressor, compress image, image optimization");
    record41.set("canonical_url", "https://example.com/tools/image-compressor");
    record41.set("og_title", "Image Compressor");
    record41.set("og_description", "Compress images online");
    record41.set("twitter_title", "Image Compressor");
    record41.set("twitter_description", "Free image compressor");
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
    record42.set("page_name", "image_converter");
    record42.set("meta_title", "Image Converter - Convert Image Formats");
    record42.set("meta_description", "Free image converter to convert between PNG, JPG, GIF, WebP, and more.");
    record42.set("meta_keywords", "image converter, format converter, image tool");
    record42.set("canonical_url", "https://example.com/tools/image-converter");
    record42.set("og_title", "Image Converter");
    record42.set("og_description", "Convert image formats");
    record42.set("twitter_title", "Image Converter");
    record42.set("twitter_description", "Free image converter");
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
    record43.set("page_name", "pdf_merger");
    record43.set("meta_title", "PDF Merger - Merge PDF Files");
    record43.set("meta_description", "Free PDF merger to combine multiple PDF files into one.");
    record43.set("meta_keywords", "PDF merger, merge PDF, PDF tool");
    record43.set("canonical_url", "https://example.com/tools/pdf-merger");
    record43.set("og_title", "PDF Merger");
    record43.set("og_description", "Merge PDF files");
    record43.set("twitter_title", "PDF Merger");
    record43.set("twitter_description", "Free PDF merger");
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
    record44.set("page_name", "pdf_splitter");
    record44.set("meta_title", "PDF Splitter - Split PDF Files");
    record44.set("meta_description", "Free PDF splitter to extract pages from PDF files.");
    record44.set("meta_keywords", "PDF splitter, split PDF, PDF tool");
    record44.set("canonical_url", "https://example.com/tools/pdf-splitter");
    record44.set("og_title", "PDF Splitter");
    record44.set("og_description", "Split PDF files");
    record44.set("twitter_title", "PDF Splitter");
    record44.set("twitter_description", "Free PDF splitter");
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
    record45.set("page_name", "pdf_to_image");
    record45.set("meta_title", "PDF to Image - Convert PDF to Images");
    record45.set("meta_description", "Free PDF to image converter. Convert PDF pages to PNG, JPG, or other image formats.");
    record45.set("meta_keywords", "PDF to image, PDF converter, image converter");
    record45.set("canonical_url", "https://example.com/tools/pdf-to-image");
    record45.set("og_title", "PDF to Image");
    record45.set("og_description", "Convert PDF to images");
    record45.set("twitter_title", "PDF to Image");
    record45.set("twitter_description", "Free PDF to image converter");
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
    record46.set("page_name", "image_to_pdf");
    record46.set("meta_title", "Image to PDF - Convert Images to PDF");
    record46.set("meta_description", "Free image to PDF converter. Convert multiple images to a single PDF file.");
    record46.set("meta_keywords", "image to PDF, PDF converter, image converter");
    record46.set("canonical_url", "https://example.com/tools/image-to-pdf");
    record46.set("og_title", "Image to PDF");
    record46.set("og_description", "Convert images to PDF");
    record46.set("twitter_title", "Image to PDF");
    record46.set("twitter_description", "Free image to PDF converter");
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
    record47.set("page_name", "word_to_pdf");
    record47.set("meta_title", "Word to PDF - Convert Word to PDF");
    record47.set("meta_description", "Free Word to PDF converter. Convert DOC, DOCX files to PDF format.");
    record47.set("meta_keywords", "Word to PDF, document converter, PDF converter");
    record47.set("canonical_url", "https://example.com/tools/word-to-pdf");
    record47.set("og_title", "Word to PDF");
    record47.set("og_description", "Convert Word to PDF");
    record47.set("twitter_title", "Word to PDF");
    record47.set("twitter_description", "Free Word to PDF converter");
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
    record48.set("page_name", "excel_to_pdf");
    record48.set("meta_title", "Excel to PDF - Convert Excel to PDF");
    record48.set("meta_description", "Free Excel to PDF converter. Convert XLS, XLSX files to PDF format.");
    record48.set("meta_keywords", "Excel to PDF, spreadsheet converter, PDF converter");
    record48.set("canonical_url", "https://example.com/tools/excel-to-pdf");
    record48.set("og_title", "Excel to PDF");
    record48.set("og_description", "Convert Excel to PDF");
    record48.set("twitter_title", "Excel to PDF");
    record48.set("twitter_description", "Free Excel to PDF converter");
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
    record49.set("page_name", "mortgage_calculator");
    record49.set("meta_title", "Mortgage Calculator - Calculate Home Loan");
    record49.set("meta_description", "Free mortgage calculator to calculate monthly payments and total interest on home loans.");
    record49.set("meta_keywords", "mortgage calculator, home loan, loan calculator");
    record49.set("canonical_url", "https://example.com/tools/mortgage-calculator");
    record49.set("og_title", "Mortgage Calculator");
    record49.set("og_description", "Calculate mortgage payments");
    record49.set("twitter_title", "Mortgage Calculator");
    record49.set("twitter_description", "Free mortgage calculator");
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
    record50.set("page_name", "property_tax_calculator");
    record50.set("meta_title", "Property Tax Calculator - Calculate Property Tax");
    record50.set("meta_description", "Free property tax calculator to estimate property taxes based on property value.");
    record50.set("meta_keywords", "property tax calculator, tax calculator, real estate");
    record50.set("canonical_url", "https://example.com/tools/property-tax-calculator");
    record50.set("og_title", "Property Tax Calculator");
    record50.set("og_description", "Calculate property taxes");
    record50.set("twitter_title", "Property Tax Calculator");
    record50.set("twitter_description", "Free property tax calculator");
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
    record51.set("page_name", "investment_calculator");
    record51.set("meta_title", "Investment Calculator - Calculate Investment Returns");
    record51.set("meta_description", "Free investment calculator to calculate returns on your investments.");
    record51.set("meta_keywords", "investment calculator, return calculator, investment analysis");
    record51.set("canonical_url", "https://example.com/tools/investment-calculator");
    record51.set("og_title", "Investment Calculator");
    record51.set("og_description", "Calculate investment returns");
    record51.set("twitter_title", "Investment Calculator");
    record51.set("twitter_description", "Free investment calculator");
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
    record52.set("page_name", "retirement_calculator");
    record52.set("meta_title", "Retirement Calculator - Plan Your Retirement");
    record52.set("meta_description", "Free retirement calculator to plan your retirement and calculate savings needed.");
    record52.set("meta_keywords", "retirement calculator, retirement planning, savings calculator");
    record52.set("canonical_url", "https://example.com/tools/retirement-calculator");
    record52.set("og_title", "Retirement Calculator");
    record52.set("og_description", "Plan your retirement");
    record52.set("twitter_title", "Retirement Calculator");
    record52.set("twitter_description", "Free retirement calculator");
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
    record53.set("page_name", "loan_calculator");
    record53.set("meta_title", "Loan Calculator - Calculate Loan Payments");
    record53.set("meta_description", "Free loan calculator to calculate monthly payments and total interest on loans.");
    record53.set("meta_keywords", "loan calculator, payment calculator, interest calculator");
    record53.set("canonical_url", "https://example.com/tools/loan-calculator");
    record53.set("og_title", "Loan Calculator");
    record53.set("og_description", "Calculate loan payments");
    record53.set("twitter_title", "Loan Calculator");
    record53.set("twitter_description", "Free loan calculator");
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
    record54.set("page_name", "savings_calculator");
    record54.set("meta_title", "Savings Calculator - Calculate Savings Growth");
    record54.set("meta_description", "Free savings calculator to calculate how your savings will grow over time.");
    record54.set("meta_keywords", "savings calculator, savings growth, financial planning");
    record54.set("canonical_url", "https://example.com/tools/savings-calculator");
    record54.set("og_title", "Savings Calculator");
    record54.set("og_description", "Calculate savings growth");
    record54.set("twitter_title", "Savings Calculator");
    record54.set("twitter_description", "Free savings calculator");
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
    record55.set("page_name", "tax_calculator");
    record55.set("meta_title", "Tax Calculator - Calculate Income Tax");
    record55.set("meta_description", "Free tax calculator to estimate your income tax liability.");
    record55.set("meta_keywords", "tax calculator, income tax, tax estimation");
    record55.set("canonical_url", "https://example.com/tools/tax-calculator");
    record55.set("og_title", "Tax Calculator");
    record55.set("og_description", "Calculate income tax");
    record55.set("twitter_title", "Tax Calculator");
    record55.set("twitter_description", "Free tax calculator");
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
    record56.set("page_name", "tip_calculator");
    record56.set("meta_title", "Tip Calculator - Calculate Tips");
    record56.set("meta_description", "Free tip calculator to calculate tips and split bills easily.");
    record56.set("meta_keywords", "tip calculator, bill splitter, gratuity calculator");
    record56.set("canonical_url", "https://example.com/tools/tip-calculator");
    record56.set("og_title", "Tip Calculator");
    record56.set("og_description", "Calculate tips easily");
    record56.set("twitter_title", "Tip Calculator");
    record56.set("twitter_description", "Free tip calculator");
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
    record57.set("page_name", "grade_calculator");
    record57.set("meta_title", "Grade Calculator - Calculate Your Grade");
    record57.set("meta_description", "Free grade calculator to calculate your GPA and final grades.");
    record57.set("meta_keywords", "grade calculator, GPA calculator, academic calculator");
    record57.set("canonical_url", "https://example.com/tools/grade-calculator");
    record57.set("og_title", "Grade Calculator");
    record57.set("og_description", "Calculate your grades");
    record57.set("twitter_title", "Grade Calculator");
    record57.set("twitter_description", "Free grade calculator");
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
    record58.set("page_name", "cgpa_calculator");
    record58.set("meta_title", "CGPA Calculator - Calculate CGPA");
    record58.set("meta_description", "Free CGPA calculator to calculate cumulative GPA.");
    record58.set("meta_keywords", "CGPA calculator, GPA calculator, academic calculator");
    record58.set("canonical_url", "https://example.com/tools/cgpa-calculator");
    record58.set("og_title", "CGPA Calculator");
    record58.set("og_description", "Calculate CGPA");
    record58.set("twitter_title", "CGPA Calculator");
    record58.set("twitter_description", "Free CGPA calculator");
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
    record59.set("page_name", "time_calculator");
    record59.set("meta_title", "Time Calculator - Calculate Time Differences");
    record59.set("meta_description", "Free time calculator to calculate time differences and durations.");
    record59.set("meta_keywords", "time calculator, duration calculator, time difference");
    record59.set("canonical_url", "https://example.com/tools/time-calculator");
    record59.set("og_title", "Time Calculator");
    record59.set("og_description", "Calculate time differences");
    record59.set("twitter_title", "Time Calculator");
    record59.set("twitter_description", "Free time calculator");
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
    record60.set("page_name", "date_calculator");
    record60.set("meta_title", "Date Calculator - Calculate Date Differences");
    record60.set("meta_description", "Free date calculator to calculate days between dates and add/subtract days.");
    record60.set("meta_keywords", "date calculator, date difference, day calculator");
    record60.set("canonical_url", "https://example.com/tools/date-calculator");
    record60.set("og_title", "Date Calculator");
    record60.set("og_description", "Calculate date differences");
    record60.set("twitter_title", "Date Calculator");
    record60.set("twitter_description", "Free date calculator");
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
    record61.set("page_name", "fibonacci_calculator");
    record61.set("meta_title", "Fibonacci Calculator - Generate Fibonacci Sequence");
    record61.set("meta_description", "Free Fibonacci calculator to generate Fibonacci sequences.");
    record61.set("meta_keywords", "Fibonacci calculator, Fibonacci sequence, math calculator");
    record61.set("canonical_url", "https://example.com/tools/fibonacci-calculator");
    record61.set("og_title", "Fibonacci Calculator");
    record61.set("og_description", "Generate Fibonacci sequences");
    record61.set("twitter_title", "Fibonacci Calculator");
    record61.set("twitter_description", "Free Fibonacci calculator");
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
    record62.set("page_name", "prime_number_checker");
    record62.set("meta_title", "Prime Number Checker - Check Prime Numbers");
    record62.set("meta_description", "Free prime number checker to determine if a number is prime.");
    record62.set("meta_keywords", "prime number checker, prime number, math tool");
    record62.set("canonical_url", "https://example.com/tools/prime-number-checker");
    record62.set("og_title", "Prime Number Checker");
    record62.set("og_description", "Check if numbers are prime");
    record62.set("twitter_title", "Prime Number Checker");
    record62.set("twitter_description", "Free prime number checker");
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
    record63.set("page_name", "gcd_lcm_calculator");
    record63.set("meta_title", "GCD LCM Calculator - Calculate GCD and LCM");
    record63.set("meta_description", "Free GCD and LCM calculator for finding greatest common divisor and least common multiple.");
    record63.set("meta_keywords", "GCD calculator, LCM calculator, math calculator");
    record63.set("canonical_url", "https://example.com/tools/gcd-lcm-calculator");
    record63.set("og_title", "GCD LCM Calculator");
    record63.set("og_description", "Calculate GCD and LCM");
    record63.set("twitter_title", "GCD LCM Calculator");
    record63.set("twitter_description", "Free GCD LCM calculator");
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
    record64.set("page_name", "factorial_calculator");
    record64.set("meta_title", "Factorial Calculator - Calculate Factorials");
    record64.set("meta_description", "Free factorial calculator to calculate factorials of numbers.");
    record64.set("meta_keywords", "factorial calculator, factorial, math calculator");
    record64.set("canonical_url", "https://example.com/tools/factorial-calculator");
    record64.set("og_title", "Factorial Calculator");
    record64.set("og_description", "Calculate factorials");
    record64.set("twitter_title", "Factorial Calculator");
    record64.set("twitter_description", "Free factorial calculator");
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
    record65.set("page_name", "square_root_calculator");
    record65.set("meta_title", "Square Root Calculator - Calculate Square Roots");
    record65.set("meta_description", "Free square root calculator to calculate square roots and other roots.");
    record65.set("meta_keywords", "square root calculator, root calculator, math calculator");
    record65.set("canonical_url", "https://example.com/tools/square-root-calculator");
    record65.set("og_title", "Square Root Calculator");
    record65.set("og_description", "Calculate square roots");
    record65.set("twitter_title", "Square Root Calculator");
    record65.set("twitter_description", "Free square root calculator");
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
    record66.set("page_name", "power_calculator");
    record66.set("meta_title", "Power Calculator - Calculate Powers");
    record66.set("meta_description", "Free power calculator to calculate powers and exponents.");
    record66.set("meta_keywords", "power calculator, exponent calculator, math calculator");
    record66.set("canonical_url", "https://example.com/tools/power-calculator");
    record66.set("og_title", "Power Calculator");
    record66.set("og_description", "Calculate powers");
    record66.set("twitter_title", "Power Calculator");
    record66.set("twitter_description", "Free power calculator");
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
    record67.set("page_name", "logarithm_calculator");
    record67.set("meta_title", "Logarithm Calculator - Calculate Logarithms");
    record67.set("meta_description", "Free logarithm calculator to calculate logarithms.");
    record67.set("meta_keywords", "logarithm calculator, log calculator, math calculator");
    record67.set("canonical_url", "https://example.com/tools/logarithm-calculator");
    record67.set("og_title", "Logarithm Calculator");
    record67.set("og_description", "Calculate logarithms");
    record67.set("twitter_title", "Logarithm Calculator");
    record67.set("twitter_description", "Free logarithm calculator");
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
    record68.set("page_name", "trigonometry_calculator");
    record68.set("meta_title", "Trigonometry Calculator - Calculate Trigonometric Functions");
    record68.set("meta_description", "Free trigonometry calculator for sine, cosine, tangent, and other functions.");
    record68.set("meta_keywords", "trigonometry calculator, sin cos tan, math calculator");
    record68.set("canonical_url", "https://example.com/tools/trigonometry-calculator");
    record68.set("og_title", "Trigonometry Calculator");
    record68.set("og_description", "Calculate trigonometric functions");
    record68.set("twitter_title", "Trigonometry Calculator");
    record68.set("twitter_description", "Free trigonometry calculator");
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
    record69.set("page_name", "matrix_calculator");
    record69.set("meta_title", "Matrix Calculator - Perform Matrix Operations");
    record69.set("meta_description", "Free matrix calculator for matrix addition, multiplication, and other operations.");
    record69.set("meta_keywords", "matrix calculator, matrix operations, math calculator");
    record69.set("canonical_url", "https://example.com/tools/matrix-calculator");
    record69.set("og_title", "Matrix Calculator");
    record69.set("og_description", "Perform matrix operations");
    record69.set("twitter_title", "Matrix Calculator");
    record69.set("twitter_description", "Free matrix calculator");
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
    record70.set("page_name", "statistics_calculator");
    record70.set("meta_title", "Statistics Calculator - Calculate Statistics");
    record70.set("meta_description", "Free statistics calculator for mean, median, mode, standard deviation, and more.");
    record70.set("meta_keywords", "statistics calculator, mean median mode, data analysis");
    record70.set("canonical_url", "https://example.com/tools/statistics-calculator");
    record70.set("og_title", "Statistics Calculator");
    record70.set("og_description", "Calculate statistics");
    record70.set("twitter_title", "Statistics Calculator");
    record70.set("twitter_description", "Free statistics calculator");
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
    record71.set("page_name", "probability_calculator");
    record71.set("meta_title", "Probability Calculator - Calculate Probabilities");
    record71.set("meta_description", "Free probability calculator for calculating probabilities and combinations.");
    record71.set("meta_keywords", "probability calculator, probability, statistics");
    record71.set("canonical_url", "https://example.com/tools/probability-calculator");
    record71.set("og_title", "Probability Calculator");
    record71.set("og_description", "Calculate probabilities");
    record71.set("twitter_title", "Probability Calculator");
    record71.set("twitter_description", "Free probability calculator");
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
    record72.set("page_name", "permutation_combination_calculator");
    record72.set("meta_title", "Permutation Combination Calculator");
    record72.set("meta_description", "Free permutation and combination calculator for calculating nPr and nCr.");
    record72.set("meta_keywords", "permutation combination, nPr nCr, math calculator");
    record72.set("canonical_url", "https://example.com/tools/permutation-combination-calculator");
    record72.set("og_title", "Permutation Combination Calculator");
    record72.set("og_description", "Calculate permutations and combinations");
    record72.set("twitter_title", "Permutation Combination Calculator");
    record72.set("twitter_description", "Free permutation combination calculator");
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
    record73.set("page_name", "standard_deviation_calculator");
    record73.set("meta_title", "Standard Deviation Calculator");
    record73.set("meta_description", "Free standard deviation calculator to calculate standard deviation and variance.");
    record73.set("meta_keywords", "standard deviation calculator, variance, statistics");
    record73.set("canonical_url", "https://example.com/tools/standard-deviation-calculator");
    record73.set("og_title", "Standard Deviation Calculator");
    record73.set("og_description", "Calculate standard deviation");
    record73.set("twitter_title", "Standard Deviation Calculator");
    record73.set("twitter_description", "Free standard deviation calculator");
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
    record74.set("page_name", "average_calculator");
    record74.set("meta_title", "Average Calculator - Calculate Average");
    record74.set("meta_description", "Free average calculator to calculate mean, median, and mode.");
    record74.set("meta_keywords", "average calculator, mean calculator, statistics");
    record74.set("canonical_url", "https://example.com/tools/average-calculator");
    record74.set("og_title", "Average Calculator");
    record74.set("og_description", "Calculate averages");
    record74.set("twitter_title", "Average Calculator");
    record74.set("twitter_description", "Free average calculator");
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
    record75.set("page_name", "ratio_calculator");
    record75.set("meta_title", "Ratio Calculator - Calculate Ratios");
    record75.set("meta_description", "Free ratio calculator to simplify and calculate ratios.");
    record75.set("meta_keywords", "ratio calculator, ratio simplifier, math calculator");
    record75.set("canonical_url", "https://example.com/tools/ratio-calculator");
    record75.set("og_title", "Ratio Calculator");
    record75.set("og_description", "Calculate ratios");
    record75.set("twitter_title", "Ratio Calculator");
    record75.set("twitter_description", "Free ratio calculator");
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
    record76.set("page_name", "proportion_calculator");
    record76.set("meta_title", "Proportion Calculator - Calculate Proportions");
    record76.set("meta_description", "Free proportion calculator to solve proportion problems.");
    record76.set("meta_keywords", "proportion calculator, ratio proportion, math calculator");
    record76.set("canonical_url", "https://example.com/tools/proportion-calculator");
    record76.set("og_title", "Proportion Calculator");
    record76.set("og_description", "Calculate proportions");
    record76.set("twitter_title", "Proportion Calculator");
    record76.set("twitter_description", "Free proportion calculator");
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
    record77.set("page_name", "fraction_calculator");
    record77.set("meta_title", "Fraction Calculator - Calculate Fractions");
    record77.set("meta_description", "Free fraction calculator for adding, subtracting, multiplying, and dividing fractions.");
    record77.set("meta_keywords", "fraction calculator, fraction operations, math calculator");
    record77.set("canonical_url", "https://example.com/tools/fraction-calculator");
    record77.set("og_title", "Fraction Calculator");
    record77.set("og_description", "Calculate fractions");
    record77.set("twitter_title", "Fraction Calculator");
    record77.set("twitter_description", "Free fraction calculator");
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
    record78.set("page_name", "decimal_to_fraction");
    record78.set("meta_title", "Decimal to Fraction - Convert Decimals");
    record78.set("meta_description", "Free decimal to fraction converter to convert decimal numbers to fractions.");
    record78.set("meta_keywords", "decimal to fraction, fraction converter, math converter");
    record78.set("canonical_url", "https://example.com/tools/decimal-to-fraction");
    record78.set("og_title", "Decimal to Fraction");
    record78.set("og_description", "Convert decimals to fractions");
    record78.set("twitter_title", "Decimal to Fraction");
    record78.set("twitter_description", "Free decimal to fraction converter");
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
    record79.set("page_name", "binary_converter");
    record79.set("meta_title", "Binary Converter - Convert Binary Numbers");
    record79.set("meta_description", "Free binary converter to convert between binary, decimal, hexadecimal, and octal.");
    record79.set("meta_keywords", "binary converter, number converter, base converter");
    record79.set("canonical_url", "https://example.com/tools/binary-converter");
    record79.set("og_title", "Binary Converter");
    record79.set("og_description", "Convert binary numbers");
    record79.set("twitter_title", "Binary Converter");
    record79.set("twitter_description", "Free binary converter");
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
    record80.set("page_name", "hex_converter");
    record80.set("meta_title", "Hex Converter - Convert Hexadecimal Numbers");
    record80.set("meta_description", "Free hexadecimal converter to convert between hex and other number systems.");
    record80.set("meta_keywords", "hex converter, hexadecimal, number converter");
    record80.set("canonical_url", "https://example.com/tools/hex-converter");
    record80.set("og_title", "Hex Converter");
    record80.set("og_description", "Convert hexadecimal numbers");
    record80.set("twitter_title", "Hex Converter");
    record80.set("twitter_description", "Free hex converter");
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
    record81.set("page_name", "roman_numeral_converter");
    record81.set("meta_title", "Roman Numeral Converter - Convert Roman Numerals");
    record81.set("meta_description", "Free roman numeral converter to convert between roman numerals and arabic numbers.");
    record81.set("meta_keywords", "roman numeral converter, roman numerals, number converter");
    record81.set("canonical_url", "https://example.com/tools/roman-numeral-converter");
    record81.set("og_title", "Roman Numeral Converter");
    record81.set("og_description", "Convert roman numerals");
    record81.set("twitter_title", "Roman Numeral Converter");
    record81.set("twitter_description", "Free roman numeral converter");
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
    record82.set("page_name", "scientific_notation_calculator");
    record82.set("meta_title", "Scientific Notation Calculator");
    record82.set("meta_description", "Free scientific notation calculator to convert to and from scientific notation.");
    record82.set("meta_keywords", "scientific notation, notation converter, math calculator");
    record82.set("canonical_url", "https://example.com/tools/scientific-notation-calculator");
    record82.set("og_title", "Scientific Notation Calculator");
    record82.set("og_description", "Convert scientific notation");
    record82.set("twitter_title", "Scientific Notation Calculator");
    record82.set("twitter_description", "Free scientific notation calculator");
  try {
    app.save(record82);
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