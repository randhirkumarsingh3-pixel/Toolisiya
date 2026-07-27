/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='image-cropper'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "Image Cropper \u2013 Crop Images Online Easily");
    record.set("h1_tag", "Image Cropper for Precise Editing");
    record.set("meta_description", "Crop images quickly and accurately using our free image cropper tool.");
    record.set("meta_keywords", "image cropper, crop image online, photo crop tool, image editing tool");
    record.set("og_title", "Image Cropper \u2013 Crop Images Online Easily");
    record.set("og_description", "Crop images quickly and accurately using our free image cropper tool.");
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