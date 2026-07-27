/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("seo_settings");

  const record0 = new Record(collection);
    record0.set("page_name", "Homepage");
    record0.set("meta_title", "Free Online Tools & Calculators | Productivity Suite");
    record0.set("meta_description", "Access 112+ free online tools including calculators, converters, generators, and productivity apps. No registration required.");
    record0.set("h1_tag", "Free Online Tools & Calculators for Everyone");
    record0.set("keywords", "free online tools, calculators, converters, generators, productivity apps");
    record0.set("og_title", "Free Online Tools & Calculators");
    record0.set("og_description", "112+ free tools to simplify your daily tasks");
    record0.set("twitter_title", "Free Online Tools & Calculators");
    record0.set("twitter_description", "112+ free tools to simplify your daily tasks");
    record0.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebSite', 'name': 'Free Online Tools', 'description': 'Collection of 112+ free online tools and calculators'}");
    record0.set("canonical_url", "https://example.com/");
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
    record1.set("page_name", "About");
    record1.set("meta_title", "About Us | Free Online Tools Platform");
    record1.set("meta_description", "Learn about our mission to provide free, accessible online tools for everyone.");
    record1.set("h1_tag", "About Our Platform");
    record1.set("keywords", "about us, online tools, free calculators, mission");
    record1.set("og_title", "About Us");
    record1.set("og_description", "Learn about our mission and vision");
    record1.set("twitter_title", "About Us");
    record1.set("twitter_description", "Learn about our mission and vision");
    record1.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'Organization', 'name': 'Free Online Tools', 'description': 'Platform providing free online tools'}");
    record1.set("canonical_url", "https://example.com/about");
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
    record2.set("page_name", "Contact");
    record2.set("meta_title", "Contact Us | Free Online Tools");
    record2.set("meta_description", "Get in touch with our team. We're here to help with any questions or feedback.");
    record2.set("h1_tag", "Contact Us");
    record2.set("keywords", "contact us, support, feedback, help");
    record2.set("og_title", "Contact Us");
    record2.set("og_description", "Get in touch with our support team");
    record2.set("twitter_title", "Contact Us");
    record2.set("twitter_description", "Get in touch with our support team");
    record2.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'ContactPage', 'name': 'Contact Us'}");
    record2.set("canonical_url", "https://example.com/contact");
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
    record3.set("page_name", "Privacy Policy");
    record3.set("meta_title", "Privacy Policy | Free Online Tools");
    record3.set("meta_description", "Read our privacy policy to understand how we protect your data.");
    record3.set("h1_tag", "Privacy Policy");
    record3.set("keywords", "privacy policy, data protection, privacy");
    record3.set("og_title", "Privacy Policy");
    record3.set("og_description", "Our privacy policy and data protection practices");
    record3.set("twitter_title", "Privacy Policy");
    record3.set("twitter_description", "Our privacy policy and data protection practices");
    record3.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebPage', 'name': 'Privacy Policy'}");
    record3.set("canonical_url", "https://example.com/privacy");
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
    record4.set("page_name", "Terms of Service");
    record4.set("meta_title", "Terms of Service | Free Online Tools");
    record4.set("meta_description", "Review our terms of service and conditions of use.");
    record4.set("h1_tag", "Terms of Service");
    record4.set("keywords", "terms of service, terms and conditions, legal");
    record4.set("og_title", "Terms of Service");
    record4.set("og_description", "Our terms of service and conditions");
    record4.set("twitter_title", "Terms of Service");
    record4.set("twitter_description", "Our terms of service and conditions");
    record4.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebPage', 'name': 'Terms of Service'}");
    record4.set("canonical_url", "https://example.com/terms");
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
    record5.set("page_name", "GST Calculator");
    record5.set("meta_title", "GST Calculator | Calculate Goods & Services Tax Online");
    record5.set("meta_description", "Free GST calculator to calculate tax, net price, and gross price. Supports all GST rates.");
    record5.set("h1_tag", "GST Calculator - Calculate Tax Instantly");
    record5.set("keywords", "GST calculator, goods and services tax, tax calculator, India GST");
    record5.set("og_title", "GST Calculator");
    record5.set("og_description", "Calculate GST tax instantly with our free calculator");
    record5.set("twitter_title", "GST Calculator");
    record5.set("twitter_description", "Calculate GST tax instantly");
    record5.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'GST Calculator', 'applicationCategory': 'FinanceApplication'}");
    record5.set("canonical_url", "https://example.com/gst-calculator");
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
    record6.set("page_name", "Income Tax Calculator");
    record6.set("meta_title", "Income Tax Calculator | Calculate Your Tax Liability");
    record6.set("meta_description", "Free income tax calculator for quick tax computation. Supports multiple tax brackets and deductions.");
    record6.set("h1_tag", "Income Tax Calculator - Know Your Tax");
    record6.set("keywords", "income tax calculator, tax calculator, tax liability, income tax");
    record6.set("og_title", "Income Tax Calculator");
    record6.set("og_description", "Calculate your income tax liability instantly");
    record6.set("twitter_title", "Income Tax Calculator");
    record6.set("twitter_description", "Calculate your income tax liability");
    record6.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Income Tax Calculator', 'applicationCategory': 'FinanceApplication'}");
    record6.set("canonical_url", "https://example.com/income-tax-calculator");
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
    record7.set("page_name", "Salary Calculator");
    record7.set("meta_title", "Salary Calculator | Calculate Net Salary & Deductions");
    record7.set("meta_description", "Free salary calculator to compute net salary, deductions, and take-home pay.");
    record7.set("h1_tag", "Salary Calculator - Calculate Your Net Pay");
    record7.set("keywords", "salary calculator, net salary, payroll calculator, deductions");
    record7.set("og_title", "Salary Calculator");
    record7.set("og_description", "Calculate your net salary and deductions");
    record7.set("twitter_title", "Salary Calculator");
    record7.set("twitter_description", "Calculate your net salary");
    record7.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Salary Calculator', 'applicationCategory': 'FinanceApplication'}");
    record7.set("canonical_url", "https://example.com/salary-calculator");
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
    record8.set("page_name", "Discount Calculator");
    record8.set("meta_title", "Discount Calculator | Calculate Discounts & Sale Price");
    record8.set("meta_description", "Free discount calculator to find discount amount, percentage, and final price.");
    record8.set("h1_tag", "Discount Calculator - Find Your Savings");
    record8.set("keywords", "discount calculator, sale price, discount percentage, savings");
    record8.set("og_title", "Discount Calculator");
    record8.set("og_description", "Calculate discounts and final prices instantly");
    record8.set("twitter_title", "Discount Calculator");
    record8.set("twitter_description", "Calculate discounts instantly");
    record8.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Discount Calculator', 'applicationCategory': 'FinanceApplication'}");
    record8.set("canonical_url", "https://example.com/discount-calculator");
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
    record9.set("page_name", "EMI Calculator");
    record9.set("meta_title", "EMI Calculator | Calculate Loan EMI & Interest");
    record9.set("meta_description", "Free EMI calculator for loans, mortgages, and credit. Calculate monthly payments and total interest.");
    record9.set("h1_tag", "EMI Calculator - Plan Your Loan Payments");
    record9.set("keywords", "EMI calculator, loan calculator, mortgage calculator, monthly payment");
    record9.set("og_title", "EMI Calculator");
    record9.set("og_description", "Calculate EMI and loan payments easily");
    record9.set("twitter_title", "EMI Calculator");
    record9.set("twitter_description", "Calculate EMI and loan payments");
    record9.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'EMI Calculator', 'applicationCategory': 'FinanceApplication'}");
    record9.set("canonical_url", "https://example.com/emi-calculator");
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
    record10.set("page_name", "SIP Calculator");
    record10.set("meta_title", "SIP Calculator | Calculate Systematic Investment Plan Returns");
    record10.set("meta_description", "Free SIP calculator to estimate returns on systematic investment plans.");
    record10.set("h1_tag", "SIP Calculator - Plan Your Investments");
    record10.set("keywords", "SIP calculator, investment calculator, mutual fund, returns");
    record10.set("og_title", "SIP Calculator");
    record10.set("og_description", "Calculate SIP returns and investment growth");
    record10.set("twitter_title", "SIP Calculator");
    record10.set("twitter_description", "Calculate SIP returns");
    record10.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'SIP Calculator', 'applicationCategory': 'FinanceApplication'}");
    record10.set("canonical_url", "https://example.com/sip-calculator");
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
    record11.set("page_name", "FD Calculator");
    record11.set("meta_title", "FD Calculator | Calculate Fixed Deposit Returns");
    record11.set("meta_description", "Free FD calculator to compute fixed deposit maturity amount and interest earned.");
    record11.set("h1_tag", "FD Calculator - Calculate Your Returns");
    record11.set("keywords", "FD calculator, fixed deposit, interest calculator, maturity amount");
    record11.set("og_title", "FD Calculator");
    record11.set("og_description", "Calculate fixed deposit returns instantly");
    record11.set("twitter_title", "FD Calculator");
    record11.set("twitter_description", "Calculate FD returns");
    record11.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'FD Calculator', 'applicationCategory': 'FinanceApplication'}");
    record11.set("canonical_url", "https://example.com/fd-calculator");
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
    record12.set("page_name", "Invoice Generator");
    record12.set("meta_title", "Invoice Generator | Create Professional Invoices Online");
    record12.set("meta_description", "Free invoice generator to create and download professional invoices in minutes.");
    record12.set("h1_tag", "Invoice Generator - Create Invoices Instantly");
    record12.set("keywords", "invoice generator, invoice maker, professional invoice, billing");
    record12.set("og_title", "Invoice Generator");
    record12.set("og_description", "Create professional invoices online for free");
    record12.set("twitter_title", "Invoice Generator");
    record12.set("twitter_description", "Create invoices instantly");
    record12.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Invoice Generator', 'applicationCategory': 'BusinessApplication'}");
    record12.set("canonical_url", "https://example.com/invoice-generator");
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
    record13.set("page_name", "Bill Generator");
    record13.set("meta_title", "Bill Generator | Create Bills & Receipts Online");
    record13.set("meta_description", "Free bill generator to create professional bills and receipts instantly.");
    record13.set("h1_tag", "Bill Generator - Create Bills Online");
    record13.set("keywords", "bill generator, receipt generator, billing software, invoice");
    record13.set("og_title", "Bill Generator");
    record13.set("og_description", "Generate bills and receipts online");
    record13.set("twitter_title", "Bill Generator");
    record13.set("twitter_description", "Generate bills online");
    record13.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Bill Generator', 'applicationCategory': 'BusinessApplication'}");
    record13.set("canonical_url", "https://example.com/bill-generator");
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
    record14.set("page_name", "Molarity Calculator");
    record14.set("meta_title", "Molarity Calculator | Calculate Molar Concentration");
    record14.set("meta_description", "Free molarity calculator for chemistry. Calculate molar concentration, moles, and volume.");
    record14.set("h1_tag", "Molarity Calculator - Chemistry Made Easy");
    record14.set("keywords", "molarity calculator, molar concentration, chemistry calculator, moles");
    record14.set("og_title", "Molarity Calculator");
    record14.set("og_description", "Calculate molarity and molar concentration");
    record14.set("twitter_title", "Molarity Calculator");
    record14.set("twitter_description", "Calculate molarity easily");
    record14.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Molarity Calculator', 'applicationCategory': 'EducationalApplication'}");
    record14.set("canonical_url", "https://example.com/molarity-calculator");
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
    record15.set("page_name", "Normality Calculator");
    record15.set("meta_title", "Normality Calculator | Calculate Normality of Solutions");
    record15.set("meta_description", "Free normality calculator for chemistry calculations. Compute normality, equivalents, and volume.");
    record15.set("h1_tag", "Normality Calculator - Chemistry Solutions");
    record15.set("keywords", "normality calculator, normality, chemistry, equivalents");
    record15.set("og_title", "Normality Calculator");
    record15.set("og_description", "Calculate normality of chemical solutions");
    record15.set("twitter_title", "Normality Calculator");
    record15.set("twitter_description", "Calculate normality");
    record15.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Normality Calculator', 'applicationCategory': 'EducationalApplication'}");
    record15.set("canonical_url", "https://example.com/normality-calculator");
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
    record16.set("page_name", "Dilution Calculator");
    record16.set("meta_title", "Dilution Calculator | Calculate Solution Dilution");
    record16.set("meta_description", "Free dilution calculator for chemistry. Calculate dilution ratios and final concentrations.");
    record16.set("h1_tag", "Dilution Calculator - Chemistry Calculations");
    record16.set("keywords", "dilution calculator, dilution ratio, concentration, chemistry");
    record16.set("og_title", "Dilution Calculator");
    record16.set("og_description", "Calculate solution dilution easily");
    record16.set("twitter_title", "Dilution Calculator");
    record16.set("twitter_description", "Calculate dilution");
    record16.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Dilution Calculator', 'applicationCategory': 'EducationalApplication'}");
    record16.set("canonical_url", "https://example.com/dilution-calculator");
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
    record17.set("page_name", "Mole Fraction Calculator");
    record17.set("meta_title", "Mole Fraction Calculator | Calculate Mole Fractions");
    record17.set("meta_description", "Free mole fraction calculator for chemistry. Calculate mole fractions and molar ratios.");
    record17.set("h1_tag", "Mole Fraction Calculator - Chemistry Tool");
    record17.set("keywords", "mole fraction calculator, mole fraction, chemistry, molar ratio");
    record17.set("og_title", "Mole Fraction Calculator");
    record17.set("og_description", "Calculate mole fractions in solutions");
    record17.set("twitter_title", "Mole Fraction Calculator");
    record17.set("twitter_description", "Calculate mole fractions");
    record17.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Mole Fraction Calculator', 'applicationCategory': 'EducationalApplication'}");
    record17.set("canonical_url", "https://example.com/mole-fraction-calculator");
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
    record18.set("page_name", "Molality Calculator");
    record18.set("meta_title", "Molality Calculator | Calculate Molal Concentration");
    record18.set("meta_description", "Free molality calculator for chemistry. Calculate molality and molar mass.");
    record18.set("h1_tag", "Molality Calculator - Chemistry Solutions");
    record18.set("keywords", "molality calculator, molal concentration, chemistry, molar mass");
    record18.set("og_title", "Molality Calculator");
    record18.set("og_description", "Calculate molality of solutions");
    record18.set("twitter_title", "Molality Calculator");
    record18.set("twitter_description", "Calculate molality");
    record18.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Molality Calculator', 'applicationCategory': 'EducationalApplication'}");
    record18.set("canonical_url", "https://example.com/molality-calculator");
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
    record19.set("page_name", "pH Calculator");
    record19.set("meta_title", "pH Calculator | Calculate pH & pOH Values");
    record19.set("meta_description", "Free pH calculator for chemistry. Calculate pH, pOH, and hydrogen ion concentration.");
    record19.set("h1_tag", "pH Calculator - Chemistry Calculations");
    record19.set("keywords", "pH calculator, pH value, pOH, hydrogen ion, chemistry");
    record19.set("og_title", "pH Calculator");
    record19.set("og_description", "Calculate pH and pOH values");
    record19.set("twitter_title", "pH Calculator");
    record19.set("twitter_description", "Calculate pH values");
    record19.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'pH Calculator', 'applicationCategory': 'EducationalApplication'}");
    record19.set("canonical_url", "https://example.com/ph-calculator");
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
    record20.set("page_name", "Velocity Calculator");
    record20.set("meta_title", "Velocity Calculator | Calculate Speed & Velocity");
    record20.set("meta_description", "Free velocity calculator for physics. Calculate velocity, speed, and distance.");
    record20.set("h1_tag", "Velocity Calculator - Physics Tool");
    record20.set("keywords", "velocity calculator, speed calculator, physics, distance, time");
    record20.set("og_title", "Velocity Calculator");
    record20.set("og_description", "Calculate velocity and speed");
    record20.set("twitter_title", "Velocity Calculator");
    record20.set("twitter_description", "Calculate velocity");
    record20.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Velocity Calculator', 'applicationCategory': 'EducationalApplication'}");
    record20.set("canonical_url", "https://example.com/velocity-calculator");
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
    record21.set("page_name", "Force Calculator");
    record21.set("meta_title", "Force Calculator | Calculate Force & Acceleration");
    record21.set("meta_description", "Free force calculator for physics. Calculate force, mass, and acceleration using Newton's laws.");
    record21.set("h1_tag", "Force Calculator - Physics Calculations");
    record21.set("keywords", "force calculator, Newton's law, acceleration, mass, physics");
    record21.set("og_title", "Force Calculator");
    record21.set("og_description", "Calculate force and acceleration");
    record21.set("twitter_title", "Force Calculator");
    record21.set("twitter_description", "Calculate force");
    record21.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Force Calculator', 'applicationCategory': 'EducationalApplication'}");
    record21.set("canonical_url", "https://example.com/force-calculator");
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
    record22.set("page_name", "Work Calculator");
    record22.set("meta_title", "Work Calculator | Calculate Work & Energy");
    record22.set("meta_description", "Free work calculator for physics. Calculate work, force, and distance.");
    record22.set("h1_tag", "Work Calculator - Physics Tool");
    record22.set("keywords", "work calculator, work physics, force, distance, energy");
    record22.set("og_title", "Work Calculator");
    record22.set("og_description", "Calculate work and energy");
    record22.set("twitter_title", "Work Calculator");
    record22.set("twitter_description", "Calculate work");
    record22.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Work Calculator', 'applicationCategory': 'EducationalApplication'}");
    record22.set("canonical_url", "https://example.com/work-calculator");
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
    record23.set("page_name", "Power Calculator");
    record23.set("meta_title", "Power Calculator | Calculate Power & Energy");
    record23.set("meta_description", "Free power calculator for physics. Calculate power, work, and time.");
    record23.set("h1_tag", "Power Calculator - Physics Calculations");
    record23.set("keywords", "power calculator, power physics, work, time, energy");
    record23.set("og_title", "Power Calculator");
    record23.set("og_description", "Calculate power and energy");
    record23.set("twitter_title", "Power Calculator");
    record23.set("twitter_description", "Calculate power");
    record23.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Power Calculator', 'applicationCategory': 'EducationalApplication'}");
    record23.set("canonical_url", "https://example.com/power-calculator");
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
    record24.set("page_name", "Kinetic Energy Calculator");
    record24.set("meta_title", "Kinetic Energy Calculator | Calculate KE");
    record24.set("meta_description", "Free kinetic energy calculator for physics. Calculate kinetic energy from mass and velocity.");
    record24.set("h1_tag", "Kinetic Energy Calculator - Physics Tool");
    record24.set("keywords", "kinetic energy calculator, KE, mass, velocity, physics");
    record24.set("og_title", "Kinetic Energy Calculator");
    record24.set("og_description", "Calculate kinetic energy");
    record24.set("twitter_title", "Kinetic Energy Calculator");
    record24.set("twitter_description", "Calculate kinetic energy");
    record24.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Kinetic Energy Calculator', 'applicationCategory': 'EducationalApplication'}");
    record24.set("canonical_url", "https://example.com/kinetic-energy-calculator");
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
    record25.set("page_name", "Potential Energy Calculator");
    record25.set("meta_title", "Potential Energy Calculator | Calculate PE");
    record25.set("meta_description", "Free potential energy calculator for physics. Calculate potential energy from mass, gravity, and height.");
    record25.set("h1_tag", "Potential Energy Calculator - Physics Calculations");
    record25.set("keywords", "potential energy calculator, PE, mass, height, gravity, physics");
    record25.set("og_title", "Potential Energy Calculator");
    record25.set("og_description", "Calculate potential energy");
    record25.set("twitter_title", "Potential Energy Calculator");
    record25.set("twitter_description", "Calculate potential energy");
    record25.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Potential Energy Calculator', 'applicationCategory': 'EducationalApplication'}");
    record25.set("canonical_url", "https://example.com/potential-energy-calculator");
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
    record26.set("page_name", "Ohm's Law Calculator");
    record26.set("meta_title", "Ohm's Law Calculator | Calculate Voltage, Current & Resistance");
    record26.set("meta_description", "Free Ohm's law calculator for electronics. Calculate voltage, current, and resistance.");
    record26.set("h1_tag", "Ohm's Law Calculator - Electronics Tool");
    record26.set("keywords", "Ohm's law calculator, voltage, current, resistance, electronics");
    record26.set("og_title", "Ohm's Law Calculator");
    record26.set("og_description", "Calculate voltage, current, and resistance");
    record26.set("twitter_title", "Ohm's Law Calculator");
    record26.set("twitter_description", "Calculate using Ohm's law");
    record26.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': \"Ohm's Law Calculator\", 'applicationCategory': 'EducationalApplication'}");
    record26.set("canonical_url", "https://example.com/ohms-law-calculator");
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
    record27.set("page_name", "Pressure Calculator");
    record27.set("meta_title", "Pressure Calculator | Calculate Pressure & Force");
    record27.set("meta_description", "Free pressure calculator for physics. Calculate pressure, force, and area.");
    record27.set("h1_tag", "Pressure Calculator - Physics Tool");
    record27.set("keywords", "pressure calculator, pressure physics, force, area, PSI");
    record27.set("og_title", "Pressure Calculator");
    record27.set("og_description", "Calculate pressure and force");
    record27.set("twitter_title", "Pressure Calculator");
    record27.set("twitter_description", "Calculate pressure");
    record27.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Pressure Calculator', 'applicationCategory': 'EducationalApplication'}");
    record27.set("canonical_url", "https://example.com/pressure-calculator");
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
    record28.set("page_name", "Wave Speed Calculator");
    record28.set("meta_title", "Wave Speed Calculator | Calculate Wave Velocity");
    record28.set("meta_description", "Free wave speed calculator for physics. Calculate wave speed, frequency, and wavelength.");
    record28.set("h1_tag", "Wave Speed Calculator - Physics Calculations");
    record28.set("keywords", "wave speed calculator, wave velocity, frequency, wavelength, physics");
    record28.set("og_title", "Wave Speed Calculator");
    record28.set("og_description", "Calculate wave speed and velocity");
    record28.set("twitter_title", "Wave Speed Calculator");
    record28.set("twitter_description", "Calculate wave speed");
    record28.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Wave Speed Calculator', 'applicationCategory': 'EducationalApplication'}");
    record28.set("canonical_url", "https://example.com/wave-speed-calculator");
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
    record29.set("page_name", "DNA/RNA Converter");
    record29.set("meta_title", "DNA/RNA Converter | Convert DNA to RNA & Protein");
    record29.set("meta_description", "Free DNA/RNA converter for biology. Convert DNA sequences to RNA and protein sequences.");
    record29.set("h1_tag", "DNA/RNA Converter - Biology Tool");
    record29.set("keywords", "DNA converter, RNA converter, protein sequence, biology, genetics");
    record29.set("og_title", "DNA/RNA Converter");
    record29.set("og_description", "Convert DNA to RNA and protein sequences");
    record29.set("twitter_title", "DNA/RNA Converter");
    record29.set("twitter_description", "Convert DNA sequences");
    record29.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'DNA/RNA Converter', 'applicationCategory': 'EducationalApplication'}");
    record29.set("canonical_url", "https://example.com/dna-rna-converter");
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
    record30.set("page_name", "Image Compressor");
    record30.set("meta_title", "Image Compressor | Compress Images Online");
    record30.set("meta_description", "Free image compressor to reduce image file size without losing quality.");
    record30.set("h1_tag", "Image Compressor - Reduce File Size");
    record30.set("keywords", "image compressor, compress images, image optimization, file size");
    record30.set("og_title", "Image Compressor");
    record30.set("og_description", "Compress images online for free");
    record30.set("twitter_title", "Image Compressor");
    record30.set("twitter_description", "Compress images online");
    record30.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Image Compressor', 'applicationCategory': 'MultimediaApplication'}");
    record30.set("canonical_url", "https://example.com/image-compressor");
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
    record31.set("page_name", "Image Converter");
    record31.set("meta_title", "Image Converter | Convert Images Between Formats");
    record31.set("meta_description", "Free image converter to convert images between PNG, JPG, GIF, WebP, and more formats.");
    record31.set("h1_tag", "Image Converter - Convert Image Formats");
    record31.set("keywords", "image converter, convert images, PNG to JPG, image format, conversion");
    record31.set("og_title", "Image Converter");
    record31.set("og_description", "Convert images between different formats");
    record31.set("twitter_title", "Image Converter");
    record31.set("twitter_description", "Convert image formats");
    record31.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Image Converter', 'applicationCategory': 'MultimediaApplication'}");
    record31.set("canonical_url", "https://example.com/image-converter");
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
    record32.set("page_name", "Image Resizer");
    record32.set("meta_title", "Image Resizer | Resize Images Online");
    record32.set("meta_description", "Free image resizer to resize images to custom dimensions.");
    record32.set("h1_tag", "Image Resizer - Resize Your Images");
    record32.set("keywords", "image resizer, resize images, image dimensions, crop, scale");
    record32.set("og_title", "Image Resizer");
    record32.set("og_description", "Resize images online easily");
    record32.set("twitter_title", "Image Resizer");
    record32.set("twitter_description", "Resize images");
    record32.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Image Resizer', 'applicationCategory': 'MultimediaApplication'}");
    record32.set("canonical_url", "https://example.com/image-resizer");
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
    record33.set("page_name", "Image Cropper");
    record33.set("meta_title", "Image Cropper | Crop Images Online");
    record33.set("meta_description", "Free image cropper to crop and trim images to desired size.");
    record33.set("h1_tag", "Image Cropper - Crop Images Easily");
    record33.set("keywords", "image cropper, crop images, image editing, trim, resize");
    record33.set("og_title", "Image Cropper");
    record33.set("og_description", "Crop images online for free");
    record33.set("twitter_title", "Image Cropper");
    record33.set("twitter_description", "Crop images");
    record33.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Image Cropper', 'applicationCategory': 'MultimediaApplication'}");
    record33.set("canonical_url", "https://example.com/image-cropper");
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
    record34.set("page_name", "Image Filter");
    record34.set("meta_title", "Image Filter | Apply Filters to Images");
    record34.set("meta_description", "Free image filter tool to apply effects and filters to your images.");
    record34.set("h1_tag", "Image Filter - Apply Effects to Images");
    record34.set("keywords", "image filter, image effects, photo filter, image editing, effects");
    record34.set("og_title", "Image Filter");
    record34.set("og_description", "Apply filters and effects to images");
    record34.set("twitter_title", "Image Filter");
    record34.set("twitter_description", "Apply image filters");
    record34.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Image Filter', 'applicationCategory': 'MultimediaApplication'}");
    record34.set("canonical_url", "https://example.com/image-filter");
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
    record35.set("page_name", "Image Watermark");
    record35.set("meta_title", "Image Watermark | Add Watermarks to Images");
    record35.set("meta_description", "Free image watermark tool to add text and image watermarks to your photos.");
    record35.set("h1_tag", "Image Watermark - Protect Your Images");
    record35.set("keywords", "image watermark, watermark tool, add watermark, image protection, copyright");
    record35.set("og_title", "Image Watermark");
    record35.set("og_description", "Add watermarks to images online");
    record35.set("twitter_title", "Image Watermark");
    record35.set("twitter_description", "Add watermarks to images");
    record35.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Image Watermark', 'applicationCategory': 'MultimediaApplication'}");
    record35.set("canonical_url", "https://example.com/image-watermark");
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
    record36.set("page_name", "Metadata Remover");
    record36.set("meta_title", "Metadata Remover | Remove Image Metadata");
    record36.set("meta_description", "Free metadata remover to strip EXIF and metadata from images for privacy.");
    record36.set("h1_tag", "Metadata Remover - Protect Your Privacy");
    record36.set("keywords", "metadata remover, EXIF remover, image metadata, privacy, remove metadata");
    record36.set("og_title", "Metadata Remover");
    record36.set("og_description", "Remove metadata from images");
    record36.set("twitter_title", "Metadata Remover");
    record36.set("twitter_description", "Remove image metadata");
    record36.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Metadata Remover', 'applicationCategory': 'UtilityApplication'}");
    record36.set("canonical_url", "https://example.com/metadata-remover");
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
    record37.set("page_name", "Batch Processor");
    record37.set("meta_title", "Batch Processor | Process Multiple Files");
    record37.set("meta_description", "Free batch processor to process multiple files at once.");
    record37.set("h1_tag", "Batch Processor - Process Files in Bulk");
    record37.set("keywords", "batch processor, batch processing, bulk processing, file processing");
    record37.set("og_title", "Batch Processor");
    record37.set("og_description", "Process multiple files at once");
    record37.set("twitter_title", "Batch Processor");
    record37.set("twitter_description", "Batch process files");
    record37.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Batch Processor', 'applicationCategory': 'UtilityApplication'}");
    record37.set("canonical_url", "https://example.com/batch-processor");
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
    record38.set("page_name", "Word Counter");
    record38.set("meta_title", "Word Counter | Count Words & Characters");
    record38.set("meta_description", "Free word counter to count words, characters, sentences, and paragraphs.");
    record38.set("h1_tag", "Word Counter - Analyze Your Text");
    record38.set("keywords", "word counter, character counter, word count, text analysis, statistics");
    record38.set("og_title", "Word Counter");
    record38.set("og_description", "Count words and characters in text");
    record38.set("twitter_title", "Word Counter");
    record38.set("twitter_description", "Count words and characters");
    record38.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Word Counter', 'applicationCategory': 'UtilityApplication'}");
    record38.set("canonical_url", "https://example.com/word-counter");
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
    record39.set("page_name", "XML Formatter");
    record39.set("meta_title", "XML Formatter | Format & Validate XML");
    record39.set("meta_description", "Free XML formatter to format, validate, and beautify XML code.");
    record39.set("h1_tag", "XML Formatter - Format XML Code");
    record39.set("keywords", "XML formatter, XML validator, format XML, beautify XML, XML tools");
    record39.set("og_title", "XML Formatter");
    record39.set("og_description", "Format and validate XML code");
    record39.set("twitter_title", "XML Formatter");
    record39.set("twitter_description", "Format XML code");
    record39.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'XML Formatter', 'applicationCategory': 'DeveloperApplication'}");
    record39.set("canonical_url", "https://example.com/xml-formatter");
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
    record40.set("page_name", "Code Beautifier");
    record40.set("meta_title", "Code Beautifier | Format & Beautify Code");
    record40.set("meta_description", "Free code beautifier to format and beautify HTML, CSS, JavaScript, and more.");
    record40.set("h1_tag", "Code Beautifier - Format Your Code");
    record40.set("keywords", "code beautifier, code formatter, beautify code, format code, developer tools");
    record40.set("og_title", "Code Beautifier");
    record40.set("og_description", "Beautify and format code online");
    record40.set("twitter_title", "Code Beautifier");
    record40.set("twitter_description", "Beautify code");
    record40.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Code Beautifier', 'applicationCategory': 'DeveloperApplication'}");
    record40.set("canonical_url", "https://example.com/code-beautifier");
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
    record41.set("page_name", "Color Picker");
    record41.set("meta_title", "Color Picker | Pick & Convert Colors");
    record41.set("meta_description", "Free color picker to select colors and convert between HEX, RGB, and HSL formats.");
    record41.set("h1_tag", "Color Picker - Find Perfect Colors");
    record41.set("keywords", "color picker, color converter, HEX color, RGB color, color tools");
    record41.set("og_title", "Color Picker");
    record41.set("og_description", "Pick and convert colors online");
    record41.set("twitter_title", "Color Picker");
    record41.set("twitter_description", "Pick colors");
    record41.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Color Picker', 'applicationCategory': 'DesignApplication'}");
    record41.set("canonical_url", "https://example.com/color-picker");
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
    record42.set("page_name", "Barcode Generator");
    record42.set("meta_title", "Barcode Generator | Generate Barcodes Online");
    record42.set("meta_description", "Free barcode generator to create barcodes for products and inventory.");
    record42.set("h1_tag", "Barcode Generator - Create Barcodes");
    record42.set("keywords", "barcode generator, barcode maker, product barcode, inventory, UPC");
    record42.set("og_title", "Barcode Generator");
    record42.set("og_description", "Generate barcodes online");
    record42.set("twitter_title", "Barcode Generator");
    record42.set("twitter_description", "Generate barcodes");
    record42.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Barcode Generator', 'applicationCategory': 'BusinessApplication'}");
    record42.set("canonical_url", "https://example.com/barcode-generator");
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
    record43.set("page_name", "QR Code Generator");
    record43.set("meta_title", "QR Code Generator | Create QR Codes Online");
    record43.set("meta_description", "Free QR code generator to create QR codes for URLs, text, and contact information.");
    record43.set("h1_tag", "QR Code Generator - Create QR Codes");
    record43.set("keywords", "QR code generator, QR code maker, QR code, barcode, mobile");
    record43.set("og_title", "QR Code Generator");
    record43.set("og_description", "Generate QR codes online");
    record43.set("twitter_title", "QR Code Generator");
    record43.set("twitter_description", "Generate QR codes");
    record43.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'QR Code Generator', 'applicationCategory': 'BusinessApplication'}");
    record43.set("canonical_url", "https://example.com/qr-code-generator");
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
    record44.set("page_name", "Text to Speech");
    record44.set("meta_title", "Text to Speech | Convert Text to Audio");
    record44.set("meta_description", "Free text to speech converter to convert text to audio with natural voices.");
    record44.set("h1_tag", "Text to Speech - Convert Text to Audio");
    record44.set("keywords", "text to speech, TTS, convert text, audio, voice, speech synthesis");
    record44.set("og_title", "Text to Speech");
    record44.set("og_description", "Convert text to speech online");
    record44.set("twitter_title", "Text to Speech");
    record44.set("twitter_description", "Convert text to speech");
    record44.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Text to Speech', 'applicationCategory': 'MultimediaApplication'}");
    record44.set("canonical_url", "https://example.com/text-to-speech");
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
    record45.set("page_name", "Speech to Text");
    record45.set("meta_title", "Speech to Text | Convert Audio to Text");
    record45.set("meta_description", "Free speech to text converter to transcribe audio and voice to text.");
    record45.set("h1_tag", "Speech to Text - Transcribe Audio");
    record45.set("keywords", "speech to text, STT, transcribe, audio to text, voice recognition, transcription");
    record45.set("og_title", "Speech to Text");
    record45.set("og_description", "Convert speech to text online");
    record45.set("twitter_title", "Speech to Text");
    record45.set("twitter_description", "Convert speech to text");
    record45.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Speech to Text', 'applicationCategory': 'MultimediaApplication'}");
    record45.set("canonical_url", "https://example.com/speech-to-text");
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
    record46.set("page_name", "Password Generator");
    record46.set("meta_title", "Password Generator | Generate Strong Passwords");
    record46.set("meta_description", "Free password generator to create strong, secure passwords.");
    record46.set("h1_tag", "Password Generator - Create Secure Passwords");
    record46.set("keywords", "password generator, strong password, secure password, password maker, security");
    record46.set("og_title", "Password Generator");
    record46.set("og_description", "Generate strong passwords online");
    record46.set("twitter_title", "Password Generator");
    record46.set("twitter_description", "Generate passwords");
    record46.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Password Generator', 'applicationCategory': 'UtilityApplication'}");
    record46.set("canonical_url", "https://example.com/password-generator");
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
    record47.set("page_name", "UUID Generator");
    record47.set("meta_title", "UUID Generator | Generate UUIDs Online");
    record47.set("meta_description", "Free UUID generator to create unique identifiers.");
    record47.set("h1_tag", "UUID Generator - Generate Unique IDs");
    record47.set("keywords", "UUID generator, GUID generator, unique ID, identifier, developer tools");
    record47.set("og_title", "UUID Generator");
    record47.set("og_description", "Generate UUIDs online");
    record47.set("twitter_title", "UUID Generator");
    record47.set("twitter_description", "Generate UUIDs");
    record47.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'UUID Generator', 'applicationCategory': 'DeveloperApplication'}");
    record47.set("canonical_url", "https://example.com/uuid-generator");
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
    record48.set("page_name", "Base64 Encoder");
    record48.set("meta_title", "Base64 Encoder | Encode & Decode Base64");
    record48.set("meta_description", "Free Base64 encoder to encode and decode text and files.");
    record48.set("h1_tag", "Base64 Encoder - Encode & Decode");
    record48.set("keywords", "Base64 encoder, Base64 decoder, encode, decode, text encoding");
    record48.set("og_title", "Base64 Encoder");
    record48.set("og_description", "Encode and decode Base64 online");
    record48.set("twitter_title", "Base64 Encoder");
    record48.set("twitter_description", "Encode Base64");
    record48.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Base64 Encoder', 'applicationCategory': 'DeveloperApplication'}");
    record48.set("canonical_url", "https://example.com/base64-encoder");
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
    record49.set("page_name", "JSON Formatter");
    record49.set("meta_title", "JSON Formatter | Format & Validate JSON");
    record49.set("meta_description", "Free JSON formatter to format, validate, and beautify JSON code.");
    record49.set("h1_tag", "JSON Formatter - Format JSON Code");
    record49.set("keywords", "JSON formatter, JSON validator, format JSON, beautify JSON, JSON tools");
    record49.set("og_title", "JSON Formatter");
    record49.set("og_description", "Format and validate JSON online");
    record49.set("twitter_title", "JSON Formatter");
    record49.set("twitter_description", "Format JSON");
    record49.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'JSON Formatter', 'applicationCategory': 'DeveloperApplication'}");
    record49.set("canonical_url", "https://example.com/json-formatter");
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
    record50.set("page_name", "Markdown to HTML");
    record50.set("meta_title", "Markdown to HTML | Convert Markdown");
    record50.set("meta_description", "Free Markdown to HTML converter to convert Markdown syntax to HTML.");
    record50.set("h1_tag", "Markdown to HTML - Convert Markdown");
    record50.set("keywords", "Markdown to HTML, Markdown converter, HTML converter, Markdown syntax");
    record50.set("og_title", "Markdown to HTML");
    record50.set("og_description", "Convert Markdown to HTML");
    record50.set("twitter_title", "Markdown to HTML");
    record50.set("twitter_description", "Convert Markdown");
    record50.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Markdown to HTML', 'applicationCategory': 'DeveloperApplication'}");
    record50.set("canonical_url", "https://example.com/markdown-to-html");
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
    record51.set("page_name", "Resume Builder");
    record51.set("meta_title", "Resume Builder | Create Professional Resumes");
    record51.set("meta_description", "Free resume builder to create professional resumes and download as PDF.");
    record51.set("h1_tag", "Resume Builder - Create Your Resume");
    record51.set("keywords", "resume builder, resume maker, CV builder, professional resume, job application");
    record51.set("og_title", "Resume Builder");
    record51.set("og_description", "Build professional resumes online");
    record51.set("twitter_title", "Resume Builder");
    record51.set("twitter_description", "Build resumes");
    record51.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Resume Builder', 'applicationCategory': 'BusinessApplication'}");
    record51.set("canonical_url", "https://example.com/resume-builder");
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
    record52.set("page_name", "Cover Letter Generator");
    record52.set("meta_title", "Cover Letter Generator | Create Cover Letters");
    record52.set("meta_description", "Free cover letter generator to create professional cover letters.");
    record52.set("h1_tag", "Cover Letter Generator - Write Cover Letters");
    record52.set("keywords", "cover letter generator, cover letter maker, job application, professional letter");
    record52.set("og_title", "Cover Letter Generator");
    record52.set("og_description", "Generate cover letters online");
    record52.set("twitter_title", "Cover Letter Generator");
    record52.set("twitter_description", "Generate cover letters");
    record52.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Cover Letter Generator', 'applicationCategory': 'BusinessApplication'}");
    record52.set("canonical_url", "https://example.com/cover-letter-generator");
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
    record53.set("page_name", "Job Application Tracker");
    record53.set("meta_title", "Job Application Tracker | Track Applications");
    record53.set("meta_description", "Free job application tracker to manage and track your job applications.");
    record53.set("h1_tag", "Job Application Tracker - Manage Applications");
    record53.set("keywords", "job application tracker, application tracker, job search, career management");
    record53.set("og_title", "Job Application Tracker");
    record53.set("og_description", "Track your job applications");
    record53.set("twitter_title", "Job Application Tracker");
    record53.set("twitter_description", "Track job applications");
    record53.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Job Application Tracker', 'applicationCategory': 'BusinessApplication'}");
    record53.set("canonical_url", "https://example.com/job-application-tracker");
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
    record54.set("page_name", "Interview Preparation");
    record54.set("meta_title", "Interview Preparation | Prepare for Interviews");
    record54.set("meta_description", "Free interview preparation tool with questions, tips, and guidance.");
    record54.set("h1_tag", "Interview Preparation - Get Ready");
    record54.set("keywords", "interview preparation, interview questions, job interview, career preparation");
    record54.set("og_title", "Interview Preparation");
    record54.set("og_description", "Prepare for job interviews");
    record54.set("twitter_title", "Interview Preparation");
    record54.set("twitter_description", "Prepare for interviews");
    record54.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Interview Preparation', 'applicationCategory': 'EducationalApplication'}");
    record54.set("canonical_url", "https://example.com/interview-preparation");
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
    record55.set("page_name", "Career Path Planner");
    record55.set("meta_title", "Career Path Planner | Plan Your Career");
    record55.set("meta_description", "Free career path planner to explore career options and plan your future.");
    record55.set("h1_tag", "Career Path Planner - Plan Your Future");
    record55.set("keywords", "career path planner, career planning, career guidance, career development");
    record55.set("og_title", "Career Path Planner");
    record55.set("og_description", "Plan your career path");
    record55.set("twitter_title", "Career Path Planner");
    record55.set("twitter_description", "Plan your career");
    record55.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Career Path Planner', 'applicationCategory': 'EducationalApplication'}");
    record55.set("canonical_url", "https://example.com/career-path-planner");
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
    record56.set("page_name", "Skills Assessment");
    record56.set("meta_title", "Skills Assessment | Assess Your Skills");
    record56.set("meta_description", "Free skills assessment tool to evaluate your professional skills.");
    record56.set("h1_tag", "Skills Assessment - Evaluate Your Skills");
    record56.set("keywords", "skills assessment, skill evaluation, professional skills, competency assessment");
    record56.set("og_title", "Skills Assessment");
    record56.set("og_description", "Assess your professional skills");
    record56.set("twitter_title", "Skills Assessment");
    record56.set("twitter_description", "Assess your skills");
    record56.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Skills Assessment', 'applicationCategory': 'EducationalApplication'}");
    record56.set("canonical_url", "https://example.com/skills-assessment");
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
    record57.set("page_name", "Receipt Generator");
    record57.set("meta_title", "Receipt Generator | Create Receipts Online");
    record57.set("meta_description", "Free receipt generator to create and download professional receipts.");
    record57.set("h1_tag", "Receipt Generator - Create Receipts");
    record57.set("keywords", "receipt generator, receipt maker, sales receipt, transaction receipt");
    record57.set("og_title", "Receipt Generator");
    record57.set("og_description", "Generate receipts online");
    record57.set("twitter_title", "Receipt Generator");
    record57.set("twitter_description", "Generate receipts");
    record57.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Receipt Generator', 'applicationCategory': 'BusinessApplication'}");
    record57.set("canonical_url", "https://example.com/receipt-generator");
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
    record58.set("page_name", "Certificate Generator");
    record58.set("meta_title", "Certificate Generator | Create Certificates");
    record58.set("meta_description", "Free certificate generator to create professional certificates.");
    record58.set("h1_tag", "Certificate Generator - Create Certificates");
    record58.set("keywords", "certificate generator, certificate maker, achievement certificate, diploma");
    record58.set("og_title", "Certificate Generator");
    record58.set("og_description", "Generate certificates online");
    record58.set("twitter_title", "Certificate Generator");
    record58.set("twitter_description", "Generate certificates");
    record58.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Certificate Generator', 'applicationCategory': 'BusinessApplication'}");
    record58.set("canonical_url", "https://example.com/certificate-generator");
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
    record59.set("page_name", "Letter Generator");
    record59.set("meta_title", "Letter Generator | Create Professional Letters");
    record59.set("meta_description", "Free letter generator to create professional letters and documents.");
    record59.set("h1_tag", "Letter Generator - Write Letters");
    record59.set("keywords", "letter generator, letter maker, professional letter, business letter");
    record59.set("og_title", "Letter Generator");
    record59.set("og_description", "Generate professional letters");
    record59.set("twitter_title", "Letter Generator");
    record59.set("twitter_description", "Generate letters");
    record59.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Letter Generator', 'applicationCategory': 'BusinessApplication'}");
    record59.set("canonical_url", "https://example.com/letter-generator");
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
    record60.set("page_name", "Contract Generator");
    record60.set("meta_title", "Contract Generator | Create Contracts Online");
    record60.set("meta_description", "Free contract generator to create legal contracts and agreements.");
    record60.set("h1_tag", "Contract Generator - Create Contracts");
    record60.set("keywords", "contract generator, contract maker, legal contract, agreement template");
    record60.set("og_title", "Contract Generator");
    record60.set("og_description", "Generate contracts online");
    record60.set("twitter_title", "Contract Generator");
    record60.set("twitter_description", "Generate contracts");
    record60.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Contract Generator', 'applicationCategory': 'BusinessApplication'}");
    record60.set("canonical_url", "https://example.com/contract-generator");
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
    record61.set("page_name", "Proposal Generator");
    record61.set("meta_title", "Proposal Generator | Create Business Proposals");
    record61.set("meta_description", "Free proposal generator to create professional business proposals.");
    record61.set("h1_tag", "Proposal Generator - Create Proposals");
    record61.set("keywords", "proposal generator, proposal maker, business proposal, project proposal");
    record61.set("og_title", "Proposal Generator");
    record61.set("og_description", "Generate business proposals");
    record61.set("twitter_title", "Proposal Generator");
    record61.set("twitter_description", "Generate proposals");
    record61.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Proposal Generator', 'applicationCategory': 'BusinessApplication'}");
    record61.set("canonical_url", "https://example.com/proposal-generator");
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
    record62.set("page_name", "Quote Generator");
    record62.set("meta_title", "Quote Generator | Create Quotes Online");
    record62.set("meta_description", "Free quote generator to create professional quotes and estimates.");
    record62.set("h1_tag", "Quote Generator - Create Quotes");
    record62.set("keywords", "quote generator, quote maker, sales quote, price quote, estimate");
    record62.set("og_title", "Quote Generator");
    record62.set("og_description", "Generate quotes online");
    record62.set("twitter_title", "Quote Generator");
    record62.set("twitter_description", "Generate quotes");
    record62.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Quote Generator', 'applicationCategory': 'BusinessApplication'}");
    record62.set("canonical_url", "https://example.com/quote-generator");
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
    record63.set("page_name", "PDF Merger");
    record63.set("meta_title", "PDF Merger | Merge PDF Files Online");
    record63.set("meta_description", "Free PDF merger to combine multiple PDF files into one.");
    record63.set("h1_tag", "PDF Merger - Combine PDF Files");
    record63.set("keywords", "PDF merger, merge PDF, combine PDF, PDF tools, document management");
    record63.set("og_title", "PDF Merger");
    record63.set("og_description", "Merge PDF files online");
    record63.set("twitter_title", "PDF Merger");
    record63.set("twitter_description", "Merge PDF files");
    record63.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'PDF Merger', 'applicationCategory': 'UtilityApplication'}");
    record63.set("canonical_url", "https://example.com/pdf-merger");
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
    record64.set("page_name", "PDF Splitter");
    record64.set("meta_title", "PDF Splitter | Split PDF Files Online");
    record64.set("meta_description", "Free PDF splitter to extract pages and split PDF files.");
    record64.set("h1_tag", "PDF Splitter - Split PDF Files");
    record64.set("keywords", "PDF splitter, split PDF, extract pages, PDF tools, document management");
    record64.set("og_title", "PDF Splitter");
    record64.set("og_description", "Split PDF files online");
    record64.set("twitter_title", "PDF Splitter");
    record64.set("twitter_description", "Split PDF files");
    record64.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'PDF Splitter', 'applicationCategory': 'UtilityApplication'}");
    record64.set("canonical_url", "https://example.com/pdf-splitter");
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
    record65.set("page_name", "Length Converter");
    record65.set("meta_title", "Length Converter | Convert Length Units");
    record65.set("meta_description", "Free length converter to convert between meters, feet, inches, kilometers, miles, and more.");
    record65.set("h1_tag", "Length Converter - Convert Units");
    record65.set("keywords", "length converter, unit converter, distance converter, measurement conversion");
    record65.set("og_title", "Length Converter");
    record65.set("og_description", "Convert length units online");
    record65.set("twitter_title", "Length Converter");
    record65.set("twitter_description", "Convert length units");
    record65.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Length Converter', 'applicationCategory': 'UtilityApplication'}");
    record65.set("canonical_url", "https://example.com/length-converter");
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
    record66.set("page_name", "Weight Converter");
    record66.set("meta_title", "Weight Converter | Convert Weight Units");
    record66.set("meta_description", "Free weight converter to convert between kilograms, pounds, grams, ounces, and more.");
    record66.set("h1_tag", "Weight Converter - Convert Units");
    record66.set("keywords", "weight converter, unit converter, mass converter, weight conversion");
    record66.set("og_title", "Weight Converter");
    record66.set("og_description", "Convert weight units online");
    record66.set("twitter_title", "Weight Converter");
    record66.set("twitter_description", "Convert weight units");
    record66.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Weight Converter', 'applicationCategory': 'UtilityApplication'}");
    record66.set("canonical_url", "https://example.com/weight-converter");
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
    record67.set("page_name", "Temperature Converter");
    record67.set("meta_title", "Temperature Converter | Convert Temperature");
    record67.set("meta_description", "Free temperature converter to convert between Celsius, Fahrenheit, and Kelvin.");
    record67.set("h1_tag", "Temperature Converter - Convert Units");
    record67.set("keywords", "temperature converter, Celsius to Fahrenheit, temperature conversion, unit converter");
    record67.set("og_title", "Temperature Converter");
    record67.set("og_description", "Convert temperature units");
    record67.set("twitter_title", "Temperature Converter");
    record67.set("twitter_description", "Convert temperature");
    record67.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Temperature Converter', 'applicationCategory': 'UtilityApplication'}");
    record67.set("canonical_url", "https://example.com/temperature-converter");
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
    record68.set("page_name", "Volume Converter");
    record68.set("meta_title", "Volume Converter | Convert Volume Units");
    record68.set("meta_description", "Free volume converter to convert between liters, gallons, milliliters, and more.");
    record68.set("h1_tag", "Volume Converter - Convert Units");
    record68.set("keywords", "volume converter, unit converter, liquid converter, volume conversion");
    record68.set("og_title", "Volume Converter");
    record68.set("og_description", "Convert volume units online");
    record68.set("twitter_title", "Volume Converter");
    record68.set("twitter_description", "Convert volume units");
    record68.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Volume Converter', 'applicationCategory': 'UtilityApplication'}");
    record68.set("canonical_url", "https://example.com/volume-converter");
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
    record69.set("page_name", "Currency Converter");
    record69.set("meta_title", "Currency Converter | Convert Currencies");
    record69.set("meta_description", "Free currency converter with real-time exchange rates.");
    record69.set("h1_tag", "Currency Converter - Convert Money");
    record69.set("keywords", "currency converter, exchange rate, money converter, forex, currency exchange");
    record69.set("og_title", "Currency Converter");
    record69.set("og_description", "Convert currencies with live rates");
    record69.set("twitter_title", "Currency Converter");
    record69.set("twitter_description", "Convert currencies");
    record69.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Currency Converter', 'applicationCategory': 'FinanceApplication'}");
    record69.set("canonical_url", "https://example.com/currency-converter");
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
    record70.set("page_name", "Audio Converter");
    record70.set("meta_title", "Audio Converter | Convert Audio Formats");
    record70.set("meta_description", "Free audio converter to convert between MP3, WAV, FLAC, and other audio formats.");
    record70.set("h1_tag", "Audio Converter - Convert Audio Files");
    record70.set("keywords", "audio converter, audio format converter, MP3 converter, music converter");
    record70.set("og_title", "Audio Converter");
    record70.set("og_description", "Convert audio formats online");
    record70.set("twitter_title", "Audio Converter");
    record70.set("twitter_description", "Convert audio formats");
    record70.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Audio Converter', 'applicationCategory': 'MultimediaApplication'}");
    record70.set("canonical_url", "https://example.com/audio-converter");
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
    record71.set("page_name", "Video Converter");
    record71.set("meta_title", "Video Converter | Convert Video Formats");
    record71.set("meta_description", "Free video converter to convert between MP4, AVI, MOV, and other video formats.");
    record71.set("h1_tag", "Video Converter - Convert Video Files");
    record71.set("keywords", "video converter, video format converter, MP4 converter, video compression");
    record71.set("og_title", "Video Converter");
    record71.set("og_description", "Convert video formats online");
    record71.set("twitter_title", "Video Converter");
    record71.set("twitter_description", "Convert video formats");
    record71.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Video Converter', 'applicationCategory': 'MultimediaApplication'}");
    record71.set("canonical_url", "https://example.com/video-converter");
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
    record72.set("page_name", "Word to PDF");
    record72.set("meta_title", "Word to PDF | Convert Word to PDF");
    record72.set("meta_description", "Free Word to PDF converter to convert DOCX and DOC files to PDF.");
    record72.set("h1_tag", "Word to PDF - Convert Documents");
    record72.set("keywords", "Word to PDF, DOCX to PDF, document converter, PDF conversion");
    record72.set("og_title", "Word to PDF");
    record72.set("og_description", "Convert Word documents to PDF");
    record72.set("twitter_title", "Word to PDF");
    record72.set("twitter_description", "Convert Word to PDF");
    record72.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Word to PDF', 'applicationCategory': 'UtilityApplication'}");
    record72.set("canonical_url", "https://example.com/word-to-pdf");
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
    record73.set("page_name", "Excel to PDF");
    record73.set("meta_title", "Excel to PDF | Convert Excel to PDF");
    record73.set("meta_description", "Free Excel to PDF converter to convert XLSX and XLS files to PDF.");
    record73.set("h1_tag", "Excel to PDF - Convert Spreadsheets");
    record73.set("keywords", "Excel to PDF, XLSX to PDF, spreadsheet converter, PDF conversion");
    record73.set("og_title", "Excel to PDF");
    record73.set("og_description", "Convert Excel spreadsheets to PDF");
    record73.set("twitter_title", "Excel to PDF");
    record73.set("twitter_description", "Convert Excel to PDF");
    record73.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Excel to PDF', 'applicationCategory': 'UtilityApplication'}");
    record73.set("canonical_url", "https://example.com/excel-to-pdf");
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
    record74.set("page_name", "Smart To-Do List");
    record74.set("meta_title", "Smart To-Do List | Manage Your Tasks");
    record74.set("meta_description", "Free smart to-do list app to organize and manage your daily tasks.");
    record74.set("h1_tag", "Smart To-Do List - Organize Tasks");
    record74.set("keywords", "to-do list, task manager, productivity app, task organization");
    record74.set("og_title", "Smart To-Do List");
    record74.set("og_description", "Manage your tasks with our smart to-do list");
    record74.set("twitter_title", "Smart To-Do List");
    record74.set("twitter_description", "Manage your tasks");
    record74.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Smart To-Do List', 'applicationCategory': 'ProductivityApplication'}");
    record74.set("canonical_url", "https://example.com/smart-todo-list");
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
    record75.set("page_name", "Task Board");
    record75.set("meta_title", "Task Board | Kanban Board for Tasks");
    record75.set("meta_description", "Free task board with Kanban view to manage projects and workflows.");
    record75.set("h1_tag", "Task Board - Organize Your Work");
    record75.set("keywords", "task board, Kanban board, project management, workflow management");
    record75.set("og_title", "Task Board");
    record75.set("og_description", "Manage tasks with Kanban board");
    record75.set("twitter_title", "Task Board");
    record75.set("twitter_description", "Organize tasks");
    record75.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Task Board', 'applicationCategory': 'ProductivityApplication'}");
    record75.set("canonical_url", "https://example.com/task-board");
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
    record76.set("page_name", "Daily Planner");
    record76.set("meta_title", "Daily Planner | Plan Your Day");
    record76.set("meta_description", "Free daily planner to schedule and organize your daily activities.");
    record76.set("h1_tag", "Daily Planner - Plan Your Day");
    record76.set("keywords", "daily planner, day planner, schedule, time management, productivity");
    record76.set("og_title", "Daily Planner");
    record76.set("og_description", "Plan your daily activities");
    record76.set("twitter_title", "Daily Planner");
    record76.set("twitter_description", "Plan your day");
    record76.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Daily Planner', 'applicationCategory': 'ProductivityApplication'}");
    record76.set("canonical_url", "https://example.com/daily-planner");
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
    record77.set("page_name", "Sticky Notes");
    record77.set("meta_title", "Sticky Notes | Digital Sticky Notes");
    record77.set("meta_description", "Free digital sticky notes app to jot down quick notes and ideas.");
    record77.set("h1_tag", "Sticky Notes - Quick Notes App");
    record77.set("keywords", "sticky notes, digital notes, note taking, quick notes, reminders");
    record77.set("og_title", "Sticky Notes");
    record77.set("og_description", "Create digital sticky notes");
    record77.set("twitter_title", "Sticky Notes");
    record77.set("twitter_description", "Create sticky notes");
    record77.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Sticky Notes', 'applicationCategory': 'ProductivityApplication'}");
    record77.set("canonical_url", "https://example.com/sticky-notes");
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
    record78.set("page_name", "Meeting Notes");
    record78.set("meta_title", "Meeting Notes | Take Meeting Notes");
    record78.set("meta_description", "Free meeting notes app to document and organize meeting discussions.");
    record78.set("h1_tag", "Meeting Notes - Document Meetings");
    record78.set("keywords", "meeting notes, meeting minutes, note taking, meeting documentation");
    record78.set("og_title", "Meeting Notes");
    record78.set("og_description", "Take and organize meeting notes");
    record78.set("twitter_title", "Meeting Notes");
    record78.set("twitter_description", "Take meeting notes");
    record78.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Meeting Notes', 'applicationCategory': 'ProductivityApplication'}");
    record78.set("canonical_url", "https://example.com/meeting-notes");
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
    record79.set("page_name", "Habit Streak");
    record79.set("meta_title", "Habit Streak | Track Your Habits");
    record79.set("meta_description", "Free habit tracker to build and maintain positive habits with streak tracking.");
    record79.set("h1_tag", "Habit Streak - Build Good Habits");
    record79.set("keywords", "habit tracker, habit building, streak tracking, daily habits, self-improvement");
    record79.set("og_title", "Habit Streak");
    record79.set("og_description", "Track and build your habits");
    record79.set("twitter_title", "Habit Streak");
    record79.set("twitter_description", "Track your habits");
    record79.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Habit Streak', 'applicationCategory': 'HealthApplication'}");
    record79.set("canonical_url", "https://example.com/habit-streak");
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
    record80.set("page_name", "Water Tracker");
    record80.set("meta_title", "Water Tracker | Track Water Intake");
    record80.set("meta_description", "Free water tracker to monitor daily water consumption and stay hydrated.");
    record80.set("h1_tag", "Water Tracker - Stay Hydrated");
    record80.set("keywords", "water tracker, hydration tracker, water intake, health tracking, wellness");
    record80.set("og_title", "Water Tracker");
    record80.set("og_description", "Track your water intake");
    record80.set("twitter_title", "Water Tracker");
    record80.set("twitter_description", "Track water intake");
    record80.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Water Tracker', 'applicationCategory': 'HealthApplication'}");
    record80.set("canonical_url", "https://example.com/water-tracker");
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
    record81.set("page_name", "Mood Tracker");
    record81.set("meta_title", "Mood Tracker | Track Your Mood");
    record81.set("meta_description", "Free mood tracker to log and analyze your emotional well-being.");
    record81.set("h1_tag", "Mood Tracker - Monitor Your Emotions");
    record81.set("keywords", "mood tracker, emotion tracker, mental health, wellness, emotional tracking");
    record81.set("og_title", "Mood Tracker");
    record81.set("og_description", "Track your mood and emotions");
    record81.set("twitter_title", "Mood Tracker");
    record81.set("twitter_description", "Track your mood");
    record81.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Mood Tracker', 'applicationCategory': 'HealthApplication'}");
    record81.set("canonical_url", "https://example.com/mood-tracker");
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
    record82.set("page_name", "Expense Reminder");
    record82.set("meta_title", "Expense Reminder | Track Expenses");
    record82.set("meta_description", "Free expense reminder to track spending and manage your budget.");
    record82.set("h1_tag", "Expense Reminder - Manage Spending");
    record82.set("keywords", "expense tracker, spending tracker, budget tracker, financial management");
    record82.set("og_title", "Expense Reminder");
    record82.set("og_description", "Track your expenses");
    record82.set("twitter_title", "Expense Reminder");
    record82.set("twitter_description", "Track expenses");
    record82.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Expense Reminder', 'applicationCategory': 'FinanceApplication'}");
    record82.set("canonical_url", "https://example.com/expense-reminder");
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
    record83.set("page_name", "Medicine Reminder");
    record83.set("meta_title", "Medicine Reminder | Medication Tracker");
    record83.set("meta_description", "Free medicine reminder app to track medication schedules and dosages.");
    record83.set("h1_tag", "Medicine Reminder - Never Miss Doses");
    record83.set("keywords", "medicine reminder, medication tracker, health reminder, prescription tracker");
    record83.set("og_title", "Medicine Reminder");
    record83.set("og_description", "Track your medication schedule");
    record83.set("twitter_title", "Medicine Reminder");
    record83.set("twitter_description", "Track medicine");
    record83.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Medicine Reminder', 'applicationCategory': 'HealthApplication'}");
    record83.set("canonical_url", "https://example.com/medicine-reminder");
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
    record84.set("page_name", "Meal Planner");
    record84.set("meta_title", "Meal Planner | Plan Your Meals");
    record84.set("meta_description", "Free meal planner to organize weekly meals and create shopping lists.");
    record84.set("h1_tag", "Meal Planner - Plan Your Nutrition");
    record84.set("keywords", "meal planner, meal planning, nutrition planning, recipe planning, diet");
    record84.set("og_title", "Meal Planner");
    record84.set("og_description", "Plan your meals and nutrition");
    record84.set("twitter_title", "Meal Planner");
    record84.set("twitter_description", "Plan your meals");
    record84.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Meal Planner', 'applicationCategory': 'HealthApplication'}");
    record84.set("canonical_url", "https://example.com/meal-planner");
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
    record85.set("page_name", "Routine Builder");
    record85.set("meta_title", "Routine Builder | Create Daily Routines");
    record85.set("meta_description", "Free routine builder to design and maintain productive daily routines.");
    record85.set("h1_tag", "Routine Builder - Build Your Routine");
    record85.set("keywords", "routine builder, daily routine, habit building, productivity, time management");
    record85.set("og_title", "Routine Builder");
    record85.set("og_description", "Build your daily routines");
    record85.set("twitter_title", "Routine Builder");
    record85.set("twitter_description", "Build routines");
    record85.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Routine Builder', 'applicationCategory': 'ProductivityApplication'}");
    record85.set("canonical_url", "https://example.com/routine-builder");
  try {
    app.save(record85);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record86 = new Record(collection);
    record86.set("page_name", "Countdown Timer");
    record86.set("meta_title", "Countdown Timer | Count Down to Events");
    record86.set("meta_description", "Free countdown timer to track time until important events and deadlines.");
    record86.set("h1_tag", "Countdown Timer - Track Time");
    record86.set("keywords", "countdown timer, event countdown, timer, time tracking, deadline");
    record86.set("og_title", "Countdown Timer");
    record86.set("og_description", "Count down to your events");
    record86.set("twitter_title", "Countdown Timer");
    record86.set("twitter_description", "Countdown timer");
    record86.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Countdown Timer', 'applicationCategory': 'UtilityApplication'}");
    record86.set("canonical_url", "https://example.com/countdown-timer");
  try {
    app.save(record86);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record87 = new Record(collection);
    record87.set("page_name", "Pomodoro Timer");
    record87.set("meta_title", "Pomodoro Timer | Boost Productivity");
    record87.set("meta_description", "Free Pomodoro timer to improve focus and productivity with timed work sessions.");
    record87.set("h1_tag", "Pomodoro Timer - Work Smarter");
    record87.set("keywords", "Pomodoro timer, productivity timer, focus timer, time management, work timer");
    record87.set("og_title", "Pomodoro Timer");
    record87.set("og_description", "Boost productivity with Pomodoro technique");
    record87.set("twitter_title", "Pomodoro Timer");
    record87.set("twitter_description", "Pomodoro timer");
    record87.set("schema_markup", "{'@context': 'https://schema.org', '@type': 'WebApplication', 'name': 'Pomodoro Timer', 'applicationCategory': 'ProductivityApplication'}");
    record87.set("canonical_url", "https://example.com/pomodoro-timer");
  try {
    app.save(record87);
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