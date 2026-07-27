/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("tool_content");
  const field = collection.fields.getByName("relatedTools");
  field.required = true;
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tool_content");
  const field = collection.fields.getByName("relatedTools");
  field.required = false;
  return app.save(collection);
})