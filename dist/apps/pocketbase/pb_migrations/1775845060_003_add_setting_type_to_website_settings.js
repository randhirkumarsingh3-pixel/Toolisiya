/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("website_settings");

  const existing = collection.fields.getByName("setting_type");
  if (existing) {
    if (existing.type === "select") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("setting_type"); // exists with wrong type, remove first
  }

  collection.fields.add(new SelectField({
    name: "setting_type",
    values: ["text", "number", "boolean", "json"]
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("website_settings");
  collection.fields.removeByName("setting_type");
  return app.save(collection);
})