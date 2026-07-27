/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("invoices");
  collection.indexes.push("CREATE UNIQUE INDEX idx_invoices_invoiceNumber ON invoices (invoiceNumber)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("invoices");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_invoices_invoiceNumber"));
  return app.save(collection);
})