/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "id": "pbc_categories",
    "name": "categories",
    "type": "base",
    "system": false,
    "listRule": "",
    "viewRule": "",
    "createRule": "@request.auth.collectionName = 'admin_users'",
    "updateRule": "@request.auth.collectionName = 'admin_users'",
    "deleteRule": "@request.auth.collectionName = 'admin_users'",
    "fields": [
      {
        "name": "id",
        "type": "text",
        "primaryKey": true,
        "required": true,
        "system": true
      },
      {
        "name": "name",
        "type": "text",
        "required": true
      },
      {
        "name": "slug",
        "type": "text",
        "required": true
      },
      {
        "name": "icon",
        "type": "text"
      },
      {
        "name": "description",
        "type": "text"
      },
      {
        "name": "is_active",
        "type": "bool",
        "defaultValue": true
      },
      {
        "name": "order",
        "type": "number",
        "defaultValue": 0
      }
    ]
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_categories");
  return app.delete(collection);
})
