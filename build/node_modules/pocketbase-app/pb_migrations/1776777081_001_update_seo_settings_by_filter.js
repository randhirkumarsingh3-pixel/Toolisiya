/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='image-filter'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "Image Filter \u2013 Apply Filters & Effects Online");
    record.set("h1_tag", "Image Filter Tool for Creative Editing");
    record.set("meta_description", "Enhance your images with filters and effects using our easy image filter tool.");
    record.set("meta_keywords", "image filter online, photo filter tool, image effects editor, apply filters to images");
    record.set("og_title", "Image Filter \u2013 Apply Filters & Effects Online");
    record.set("og_description", "Enhance your images with filters and effects using our easy image filter tool.");
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