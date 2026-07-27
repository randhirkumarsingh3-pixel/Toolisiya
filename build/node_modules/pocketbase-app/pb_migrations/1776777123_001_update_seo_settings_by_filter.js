/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='job-application-tracker'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "Job Application Tracker \u2013 Track Job Applications Easily");
    record.set("h1_tag", "Job Application Tracker for Career Management");
    record.set("meta_description", "Track job applications, interviews, and status in one place.");
    record.set("meta_keywords", "job tracker, application tracker, job application management tool");
    record.set("og_title", "Job Application Tracker \u2013 Track Job Applications Easily");
    record.set("og_description", "Track job applications, interviews, and status in one place.");
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