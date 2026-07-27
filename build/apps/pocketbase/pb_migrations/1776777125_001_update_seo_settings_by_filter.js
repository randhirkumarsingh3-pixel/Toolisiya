/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='salary-calculator-optimized'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "Salary Calculator India \u2013 Calculate In-Hand Salary & CTC");
    record.set("h1_tag", "Salary Calculator for Take-Home Salary");
    record.set("meta_description", "Calculate your in-hand salary from CTC with deductions and tax instantly.");
    record.set("meta_keywords", "salary calculator india, in hand salary calculator, ctc calculator");
    record.set("og_title", "Salary Calculator India \u2013 Calculate In-Hand Salary & CTC");
    record.set("og_description", "Calculate your in-hand salary from CTC with deductions and tax instantly.");
    record.set("structured_data", "{}");
    record.set("faq_schema", "{}");
    record.set("tool_schema", "{}");
    record.set("is_published", true);
    try {
      app.save(record);
    } catch (e) {
      if (e.message.includes("Value must be unique")) {
        console.log("Record with unique value already exists, skipping");
      } else {
        throw e;
      }
    }
  }
}, (app) => {
  // Rollback: original values not stored, manual restore needed
})