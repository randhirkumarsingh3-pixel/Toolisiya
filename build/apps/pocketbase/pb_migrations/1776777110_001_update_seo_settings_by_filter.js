/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='password-generator'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "Password Generator \u2013 Create Secure Passwords Online");
    record.set("h1_tag", "Password Generator for Strong Security");
    record.set("meta_description", "Generate strong and secure passwords instantly with our free tool.");
    record.set("meta_keywords", "password generator, secure password generator, random password tool");
    record.set("og_title", "Password Generator \u2013 Create Secure Passwords Online");
    record.set("og_description", "Generate strong and secure passwords instantly with our free tool.");
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