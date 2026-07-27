/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("website_settings");

  const existing = collection.fields.getByName("menu_items_config");
  if (existing) {
    if (existing.type === "json") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("menu_items_config"); // exists with wrong type, remove first
  }

  collection.fields.add(new JSONField({
    name: "menu_items_config",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("website_settings");
  collection.fields.removeByName("menu_items_config");
  return app.save(collection);
})