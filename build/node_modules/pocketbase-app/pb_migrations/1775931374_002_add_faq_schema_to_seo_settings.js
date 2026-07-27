/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("seo_settings");

  const existing = collection.fields.getByName("faq_schema");
  if (existing) {
    if (existing.type === "json") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("faq_schema"); // exists with wrong type, remove first
  }

  collection.fields.add(new JSONField({
    name: "faq_schema",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("seo_settings");
  collection.fields.removeByName("faq_schema");
  return app.save(collection);
})