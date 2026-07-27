/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='text-to-speech'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "Text to Speech \u2013 Convert Text to Voice Online");
    record.set("h1_tag", "Text to Speech Converter for Audio Output");
    record.set("meta_description", "Convert text into natural-sounding speech with our free TTS tool.");
    record.set("meta_keywords", "text to speech online, tts converter, text to voice tool");
    record.set("og_title", "Text to Speech \u2013 Convert Text to Voice Online");
    record.set("og_description", "Convert text into natural-sounding speech with our free TTS tool.");
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