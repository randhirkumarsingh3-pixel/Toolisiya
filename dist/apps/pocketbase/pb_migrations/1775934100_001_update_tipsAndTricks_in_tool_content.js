/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("tool_content");
  const field = collection.fields.getByName("tipsAndTricks");
  field.required = true;
  field.min = 500;
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tool_content");
  const field = collection.fields.getByName("tipsAndTricks");
  field.required = false;
  field.min = 0;
  return app.save(collection);
})