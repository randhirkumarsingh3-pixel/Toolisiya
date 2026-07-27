/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("seo_settings");

  const existing = collection.fields.getByName("h1_tag");
  if (existing) {
    if (existing.type === "text") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("h1_tag"); // exists with wrong type, remove first
  }

  collection.fields.add(new TextField({
    name: "h1_tag",
    required: true,
    max: 70
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("seo_settings");
  collection.fields.removeByName("h1_tag");
  return app.save(collection);
})