/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='base64-encoder'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "Base64 Encoder & Decoder \u2013 Encode Text Online");
    record.set("h1_tag", "Base64 Encoder for Data Conversion");
    record.set("meta_description", "Encode and decode text using Base64 instantly.");
    record.set("meta_keywords", "base64 encoder, base64 decoder, encode text online");
    record.set("og_title", "Base64 Encoder & Decoder \u2013 Encode Text Online");
    record.set("og_description", "Encode and decode text using Base64 instantly.");
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