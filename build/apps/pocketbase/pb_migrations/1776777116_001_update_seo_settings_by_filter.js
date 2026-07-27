/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='markdown-to-html'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "Markdown to HTML Converter \u2013 Convert Markdown Online");
    record.set("h1_tag", "Markdown to HTML Converter Tool");
    record.set("meta_description", "Convert Markdown text into HTML instantly with our free converter.");
    record.set("meta_keywords", "markdown to html, md to html converter, markdown converter online");
    record.set("og_title", "Markdown to HTML Converter \u2013 Convert Markdown Online");
    record.set("og_description", "Convert Markdown text into HTML instantly with our free converter.");
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