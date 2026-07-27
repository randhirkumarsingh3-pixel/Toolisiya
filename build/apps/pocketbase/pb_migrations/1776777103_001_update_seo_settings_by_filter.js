/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='json-formatter'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "JSON Formatter \u2013 Beautify & Validate JSON Online");
    record.set("h1_tag", "JSON Formatter for Clean Data");
    record.set("meta_description", "Format and validate JSON data instantly with our free tool.");
    record.set("meta_keywords", "json formatter, json beautifier, json validator online");
    record.set("og_title", "JSON Formatter \u2013 Beautify & Validate JSON Online");
    record.set("og_description", "Format and validate JSON data instantly with our free tool.");
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