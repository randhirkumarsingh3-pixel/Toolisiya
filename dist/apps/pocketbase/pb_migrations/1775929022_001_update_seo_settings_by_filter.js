/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let records;
  try {
    records = app.findRecordsByFilter("seo_settings", "page_name ~ 'tool'");
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("No records found, skipping");
      return;
    }
    throw e;
  }
  
  for (const record of records) {
    record.set("canonical_url", "{'_replace': {'from': '/tools/', 'to': '/'}}");
    record.set("meta_description", "{'_replace': {'from': '/tools/', 'to': '/'}}");
    record.set("og_title", "{'_replace': {'from': '/tools/', 'to': '/'}}");
    record.set("og_description", "{'_replace': {'from': '/tools/', 'to': '/'}}");
    record.set("twitter_title", "{'_replace': {'from': '/tools/', 'to': '/'}}");
    record.set("twitter_description", "{'_replace': {'from': '/tools/', 'to': '/'}}");
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