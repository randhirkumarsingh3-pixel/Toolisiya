/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name='cover-letter-generator'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("meta_title", "Cover Letter Generator \u2013 Create Professional Cover Letters");
    record.set("h1_tag", "Cover Letter Generator for Job Applications");
    record.set("meta_description", "Generate professional cover letters instantly for job applications.");
    record.set("meta_keywords", "cover letter generator, create cover letter online, job application letter tool");
    record.set("og_title", "Cover Letter Generator \u2013 Create Professional Cover Letters");
    record.set("og_description", "Generate professional cover letters instantly for job applications.");
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