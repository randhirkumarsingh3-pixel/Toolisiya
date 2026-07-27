/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='batch-processor'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "Batch Image Processor \u2013 Process Multiple Images at Once");
    record.set("h1_tag", "Batch Processor for Bulk Image Editing");
    record.set("meta_description", "Process multiple images at once with batch editing tools for resizing, compressing, and converting.");
    record.set("meta_keywords", "batch image processor, bulk image editor, batch resize images, batch convert images");
    record.set("og_title", "Batch Image Processor \u2013 Process Multiple Images at Once");
    record.set("og_description", "Process multiple images at once with batch editing tools for resizing, compressing, and converting.");
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