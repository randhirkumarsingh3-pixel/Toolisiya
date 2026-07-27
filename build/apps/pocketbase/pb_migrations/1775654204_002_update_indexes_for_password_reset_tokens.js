/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("password_reset_tokens");
  collection.indexes.push("CREATE UNIQUE INDEX idx_password_reset_tokens_token ON password_reset_tokens (token)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("password_reset_tokens");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_password_reset_tokens_token"));
  return app.save(collection);
})