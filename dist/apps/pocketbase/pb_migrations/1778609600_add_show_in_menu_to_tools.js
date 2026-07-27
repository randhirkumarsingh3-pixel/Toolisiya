/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("tools");

  // Add the new field show_in_menu
  collection.fields.add(new BoolField({
    name: "show_in_menu",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("tools");

  // Remove the field show_in_menu
  collection.fields.removeByName("show_in_menu");

  return app.save(collection);
})
