/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='code-beautifier'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "Code Beautifier \u2013 Format & Clean Code Online");
    record.set("h1_tag", "Code Beautifier for Developers");
    record.set("meta_description", "Beautify and format your code for better readability using our code beautifier tool.");
    record.set("meta_keywords", "code beautifier, code formatter online, format code tool, beautify javascript html css");
    record.set("og_title", "Code Beautifier \u2013 Format & Clean Code Online");
    record.set("og_description", "Beautify and format your code for better readability using our code beautifier tool.");
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