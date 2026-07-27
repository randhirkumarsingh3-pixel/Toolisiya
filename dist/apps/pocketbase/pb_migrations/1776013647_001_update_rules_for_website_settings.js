/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("website_settings");
  collection.createRule = "@request.auth.collectionName = 'admin_users'";
  collection.updateRule = "@request.auth.collectionName = 'admin_users'";
  collection.deleteRule = "@request.auth.collectionName = 'admin_users'";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("website_settings");
  collection.createRule = "@request.auth.collectionName = 'admin_users'";
  collection.updateRule = "@request.auth.collectionName = 'admin_users'";
  collection.deleteRule = "@request.auth.collectionName = 'admin_users'";
  return app.save(collection);
})