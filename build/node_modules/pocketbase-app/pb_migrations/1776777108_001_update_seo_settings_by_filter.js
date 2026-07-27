/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='speech-to-text'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "Speech to Text \u2013 Convert Voice to Text Online");
    record.set("h1_tag", "Speech to Text Converter for Transcription");
    record.set("meta_description", "Convert spoken words into text instantly with our speech recognition tool.");
    record.set("meta_keywords", "speech to text online, voice to text converter, audio transcription tool");
    record.set("og_title", "Speech to Text \u2013 Convert Voice to Text Online");
    record.set("og_description", "Convert spoken words into text instantly with our speech recognition tool.");
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