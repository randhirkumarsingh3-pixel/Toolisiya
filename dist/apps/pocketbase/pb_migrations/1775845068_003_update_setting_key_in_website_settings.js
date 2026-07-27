/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("website_settings");
  const field = collection.fields.getByName("setting_key");
  field.required = true;
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("website_settings");
  const field = collection.fields.getByName("setting_key");
  field.required = false;
  return app.save(collection);
})