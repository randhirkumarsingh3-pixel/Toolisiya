/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='word-counter'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "Word Counter \u2013 Count Words, Characters & Sentences Online");
    record.set("h1_tag", "Word Counter Tool for Accurate Text Analysis");
    record.set("meta_description", "Count words, characters, and sentences instantly with our free word counter tool.");
    record.set("meta_keywords", "word counter online, character counter, text analysis tool, word count tool");
    record.set("og_title", "Word Counter \u2013 Count Words, Characters & Sentences Online");
    record.set("og_description", "Count words, characters, and sentences instantly with our free word counter tool.");
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