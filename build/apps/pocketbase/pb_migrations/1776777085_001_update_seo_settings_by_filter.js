/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='metadata-remover'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "Metadata Remover \u2013 Remove Image Metadata Online");
    record.set("h1_tag", "Metadata Remover for Privacy Protection");
    record.set("meta_description", "Remove metadata from images to protect your privacy and reduce file size.");
    record.set("meta_keywords", "metadata remover, remove exif data, image metadata cleaner, photo privacy tool");
    record.set("og_title", "Metadata Remover \u2013 Remove Image Metadata Online");
    record.set("og_description", "Remove metadata from images to protect your privacy and reduce file size.");
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