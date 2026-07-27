/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "id": "pwa_stats_collection",
    "created": "2024-05-13 00:00:00.000Z",
    "updated": "2024-05-13 00:00:00.000Z",
    "name": "pwa_stats",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "event_type_field",
        "name": "event_type",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "user_agent_field",
        "name": "user_agent",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id != ''",
    "viewRule": "@request.auth.id != ''",
    "createRule": "",
    "updateRule": "@request.auth.id != ''",
    "deleteRule": "@request.auth.id != ''",
    "options": {}
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pwa_stats");
  return app.delete(collection);
})
