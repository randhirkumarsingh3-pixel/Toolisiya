/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='image-watermark'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "Image Watermark \u2013 Add Watermark to Images Online");
    record.set("h1_tag", "Watermark Images Easily Online");
    record.set("meta_description", "Protect your images by adding watermarks online with our easy-to-use tool.");
    record.set("meta_keywords", "image watermark tool, add watermark online, watermark photos, protect images online");
    record.set("og_title", "Image Watermark \u2013 Add Watermark to Images Online");
    record.set("og_description", "Protect your images by adding watermarks online with our easy-to-use tool.");
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