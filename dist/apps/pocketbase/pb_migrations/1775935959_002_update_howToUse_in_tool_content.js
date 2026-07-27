/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("tool_content");
  const field = collection.fields.getByName("howToUse");
  field.min = 500;
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tool_content");
  const field = collection.fields.getByName("howToUse");
  field.min = 1000;
  return app.save(collection);
})