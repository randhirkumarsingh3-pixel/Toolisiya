/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='uuid-generator'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "UUID Generator \u2013 Generate Unique IDs Online");
    record.set("h1_tag", "UUID Generator for Unique Identifiers");
    record.set("meta_description", "Generate UUIDs instantly for development and database use.");
    record.set("meta_keywords", "uuid generator, unique id generator, guid generator");
    record.set("og_title", "UUID Generator \u2013 Generate Unique IDs Online");
    record.set("og_description", "Generate UUIDs instantly for development and database use.");
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