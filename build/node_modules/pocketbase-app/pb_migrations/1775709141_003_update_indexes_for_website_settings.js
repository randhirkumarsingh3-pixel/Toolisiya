/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("website_settings");
  collection.indexes.push("CREATE UNIQUE INDEX idx_website_settings_setting_key ON website_settings (setting_key)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("website_settings");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_website_settings_setting_key"));
  return app.save(collection);
})