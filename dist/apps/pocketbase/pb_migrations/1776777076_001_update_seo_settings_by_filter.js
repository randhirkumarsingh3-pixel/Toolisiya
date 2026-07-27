/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='image-resizer'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "Image Resizer \u2013 Resize Images Online Without Quality Loss");
    record.set("h1_tag", "Image Resizer for Perfect Dimensions");
    record.set("meta_description", "Resize images online to any dimension without losing quality. Ideal for websites, social media, and uploads.");
    record.set("meta_keywords", "image resizer, resize image online, change image size, photo resizer tool, image dimension tool");
    record.set("og_title", "Image Resizer \u2013 Resize Images Online Without Quality Loss");
    record.set("og_description", "Resize images online to any dimension without losing quality. Ideal for websites, social media, and uploads.");
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