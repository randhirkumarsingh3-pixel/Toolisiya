/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("tool_content");
  collection.fields.removeByName("faqSection");
  return app.save(collection);
}, (app) => {

  const collection = app.findCollectionByNameOrId("tool_content");
  collection.fields.add(new TextField({
    name: "faqSection",
    required: false
  }));
  return app.save(collection);
})