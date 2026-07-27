/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("website_settings");

  const existing = collection.fields.getByName("category_visibility");
  if (existing) {
    if (existing.type === "json") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("category_visibility"); // exists with wrong type, remove first
  }

  collection.fields.add(new JSONField({
    name: "category_visibility",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("website_settings");
  collection.fields.removeByName("category_visibility");
  return app.save(collection);
})