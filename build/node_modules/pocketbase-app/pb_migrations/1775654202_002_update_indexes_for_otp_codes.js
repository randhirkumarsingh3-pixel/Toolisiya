/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("otp_codes");
  collection.indexes.push("CREATE INDEX idx_otp_codes_email ON otp_codes (email)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("otp_codes");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_otp_codes_email"));
  return app.save(collection);
})