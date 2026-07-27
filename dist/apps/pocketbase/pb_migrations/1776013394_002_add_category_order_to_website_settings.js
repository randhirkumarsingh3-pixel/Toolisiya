/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("website_settings");

  const existing = collection.fields.getByName("category_order");
  if (existing) {
    if (existing.type === "json") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("category_order"); // exists with wrong type, remove first
  }

  collection.fields.add(new JSONField({
    name: "category_order",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("website_settings");
  collection.fields.removeByName("category_order");
  return app.save(collection);
})