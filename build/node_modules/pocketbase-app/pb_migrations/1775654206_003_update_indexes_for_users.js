/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");
  collection.indexes.push("CREATE UNIQUE INDEX idx_users_username ON users (username)");
  collection.indexes.push("CREATE UNIQUE INDEX idx_users_mobile ON users (mobile)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("users");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_users_username"));
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_users_mobile"));
  return app.save(collection);
})