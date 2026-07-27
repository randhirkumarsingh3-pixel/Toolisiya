/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("website_settings");

  const record0 = new Record(collection);
    record0.set("setting_key", "logo_url");
    record0.set("setting_value", "https://horizons-cdn.hostinger.com/bdd6546f-fbd6-4325-a50e-17d2da2d4211/b0ad41527084c4ba034f6e8eea1bc176.png");
    record0.set("setting_type", "text");
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})