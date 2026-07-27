/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='color-picker'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "Color Picker \u2013 Pick Colors & Get HEX, RGB Codes Online");
    record.set("h1_tag", "Color Picker Tool for Designers");
    record.set("meta_description", "Pick colors and get HEX, RGB values instantly with our online color picker.");
    record.set("meta_keywords", "color picker online, hex color picker, rgb color tool, color code generator");
    record.set("og_title", "Color Picker \u2013 Pick Colors & Get HEX, RGB Codes Online");
    record.set("og_description", "Pick colors and get HEX, RGB values instantly with our online color picker.");
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