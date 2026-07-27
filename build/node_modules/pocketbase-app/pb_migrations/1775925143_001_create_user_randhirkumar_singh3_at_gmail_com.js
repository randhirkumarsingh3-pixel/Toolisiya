/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("admin_users");
  const record = new Record(collection);
  record.set("email", "randhirkumar.singh3@gmail.com");
  record.setPassword("TempPassword123!");
  record.set("name", "Randhir Kumar Singh");
  record.set("role", "super_admin");
  record.set("status", "Active");
  try {
    return app.save(record);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
      return;
    }
    throw e;
  }
}, (app) => {
  try {
    const record = app.findFirstRecordByData("admin_users", "email", "randhirkumar.singh3@gmail.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})