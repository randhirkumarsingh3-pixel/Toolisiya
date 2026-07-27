/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("tool_content");

  const existing = collection.fields.getByName("faq");
  if (existing) {
    if (existing.type === "json") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("faq"); // exists with wrong type, remove first
  }

  collection.fields.add(new JSONField({
    name: "faq",
    required: true
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tool_content");
  collection.fields.removeByName("faq");
  return app.save(collection);
})