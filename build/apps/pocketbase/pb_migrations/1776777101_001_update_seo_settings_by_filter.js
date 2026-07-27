/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='qr-code-generator'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "QR Code Generator \u2013 Create QR Codes Online Free");
    record.set("h1_tag", "QR Code Generator for Instant Code Creation");
    record.set("meta_description", "Generate QR codes for URLs, text, and more instantly.");
    record.set("meta_keywords", "qr code generator, create qr code online, qr code maker free");
    record.set("og_title", "QR Code Generator \u2013 Create QR Codes Online Free");
    record.set("og_description", "Generate QR codes for URLs, text, and more instantly.");
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