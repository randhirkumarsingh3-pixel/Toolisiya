/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("admin_users");
  collection.listRule = "@request.auth.collectionName = 'admin_users' && @request.auth.role = 'Admin'";
  collection.viewRule = "@request.auth.collectionName = 'admin_users' && (@request.auth.role = 'Admin' || @request.auth.id = id)";
  collection.createRule = "@request.auth.collectionName = 'admin_users' && @request.auth.role = 'Admin'";
  collection.updateRule = "@request.auth.collectionName = 'admin_users' && (@request.auth.role = 'Admin' || @request.auth.id = id)";
  collection.deleteRule = "@request.auth.collectionName = 'admin_users' && @request.auth.role = 'Admin'";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("admin_users");
  collection.listRule = "@request.auth.collectionName = 'admin_users' && @request.auth.role = 'super_admin'";
  collection.viewRule = "@request.auth.collectionName = 'admin_users' && (@request.auth.role = 'super_admin' || @request.auth.id = id)";
  collection.createRule = null;
  collection.updateRule = "@request.auth.collectionName = 'admin_users' && (@request.auth.role = 'super_admin' || @request.auth.id = id)";
  collection.deleteRule = "@request.auth.collectionName = 'admin_users' && @request.auth.role = 'super_admin'";
  return app.save(collection);
})