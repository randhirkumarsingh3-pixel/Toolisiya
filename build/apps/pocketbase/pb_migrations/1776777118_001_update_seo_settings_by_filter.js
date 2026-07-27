/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='resume-builder'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "Resume Builder \u2013 Create Professional Resume Online Free");
    record.set("h1_tag", "Resume Builder for Job Seekers");
    record.set("meta_description", "Create professional resumes quickly with our free resume builder.");
    record.set("meta_keywords", "resume builder free, create resume online, cv maker tool");
    record.set("og_title", "Resume Builder \u2013 Create Professional Resume Online Free");
    record.set("og_description", "Create professional resumes quickly with our free resume builder.");
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