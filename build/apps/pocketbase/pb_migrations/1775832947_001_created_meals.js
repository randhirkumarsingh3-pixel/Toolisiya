/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "",
    "deleteRule": "userId = @request.auth.id || userId = null",
    "fields":     [
          {
                "autogeneratePattern": "[a-z0-9]{15}",
                "hidden": false,
                "id": "text7776104990",
                "max": 15,
                "min": 15,
                "name": "id",
                "pattern": "^[a-z0-9]+$",
                "presentable": false,
                "primaryKey": true,
                "required": true,
                "system": true,
                "type": "text"
          },
          {
                "hidden": false,
                "id": "text0861285370",
                "name": "userId",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "text",
                "autogeneratePattern": "",
                "max": 0,
                "min": 0,
                "pattern": ""
          },
          {
                "hidden": false,
                "id": "date1556085148",
                "name": "mealDate",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "date",
                "max": "",
                "min": ""
          },
          {
                "hidden": false,
                "id": "select2039393533",
                "name": "dayOfWeek",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday"
                ]
          },
          {
                "hidden": false,
                "id": "select2491725257",
                "name": "mealType",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                      "Breakfast",
                      "Lunch",
                      "Dinner",
                      "Snacks"
                ]
          },
          {
                "hidden": false,
                "id": "text7786551332",
                "name": "mealName",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "text",
                "autogeneratePattern": "",
                "max": 0,
                "min": 0,
                "pattern": ""
          },
          {
                "hidden": false,
                "id": "json3588166102",
                "name": "ingredients",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "json",
                "maxSize": 0
          },
          {
                "hidden": false,
                "id": "autodate3947883228",
                "name": "created",
                "onCreate": true,
                "onUpdate": false,
                "presentable": false,
                "system": false,
                "type": "autodate"
          },
          {
                "hidden": false,
                "id": "autodate4106056273",
                "name": "updated",
                "onCreate": true,
                "onUpdate": true,
                "presentable": false,
                "system": false,
                "type": "autodate"
          }
    ],
    "id": "pbc_5767340897",
    "indexes": [],
    "listRule": "userId = @request.auth.id || userId = null",
    "name": "meals",
    "system": false,
    "type": "base",
    "updateRule": "userId = @request.auth.id || userId = null",
    "viewRule": "userId = @request.auth.id || userId = null"
  });

  try {
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("Collection name must be unique")) {
      console.log("Collection already exists, skipping");
      return;
    }
    throw e;
  }
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("pbc_5767340897");
    return app.delete(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})