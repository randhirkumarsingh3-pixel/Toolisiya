/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("seo_settings");
  collection.listRule = "@request.auth.collectionName = 'admin_users'";
  collection.viewRule = "@request.auth.collectionName = 'admin_users'";
  collection.createRule = "@request.auth.collectionName = 'admin_users'";
  collection.updateRule = "@request.auth.collectionName = 'admin_users'";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("seo_settings");
  collection.listRule = "@request.auth.collectionName = 'admin_users'";
  collection.viewRule = "@request.auth.collectionName = 'admin_users'";
  collection.createRule = "@request.auth.collectionName = 'admin_users'";
  collection.updateRule = "@request.auth.collectionName = 'admin_users'";
  return app.save(collection);
})