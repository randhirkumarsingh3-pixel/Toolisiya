/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='image-compressor'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "Image Compressor \u2013 Compress Images Online Without Losing Quality");
    record.set("h1_tag", "Free Image Compressor for Fast & Efficient Optimization");
    record.set("meta_description", "Compress images online without losing quality. Reduce file size instantly for faster uploads and better performance.");
    record.set("meta_keywords", "image compressor, compress image online, reduce image size, image optimizer, photo compressor free, compress jpeg png online");
    record.set("og_title", "Image Compressor \u2013 Compress Images Online Without Losing Quality");
    record.set("og_description", "Compress images online without losing quality. Reduce file size instantly for faster uploads and better performance.");
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