/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='image-converter'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "Image Converter \u2013 Convert Images to JPG, PNG, WEBP Online");
    record.set("h1_tag", "Image Converter for Quick Format Conversion");
    record.set("meta_description", "Convert images between JPG, PNG, WEBP, and more formats easily with our free image converter.");
    record.set("meta_keywords", "image converter online, jpg to png converter, png to jpg converter, image format converter, convert images free");
    record.set("og_title", "Image Converter \u2013 Convert Images to JPG, PNG, WEBP Online");
    record.set("og_description", "Convert images between JPG, PNG, WEBP, and more formats easily with our free image converter.");
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