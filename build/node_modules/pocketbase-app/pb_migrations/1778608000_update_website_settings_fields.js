/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("website_settings");

  const fieldsToAdd = [
    { name: "site_name", type: "text" },
    { name: "site_description", type: "text" },
    { name: "contact_email", type: "text" },
    { name: "contact_phone", type: "text" },
    { name: "contact_address", type: "text" },
    { name: "ga4_measurement_id", type: "text" },
    { name: "adsense_publisher_id", type: "text" },
    { name: "search_console_verification", type: "text" },
    { name: "facebook_url", type: "text" },
    { name: "twitter_url", type: "text" },
    { name: "instagram_url", type: "text" },
    { name: "linkedin_url", type: "text" },
    { name: "youtube_url", type: "text" },
    { name: "maintenance_mode", type: "bool" },
    { name: "site_logo", type: "file", options: {
        maxSelect: 1,
        maxSize: 5242880,
        mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"],
        thumbs: []
    }}
  ];

  fieldsToAdd.forEach(f => {
    const existing = collection.fields.getByName(f.name);
    if (existing) return;

    let field;
    switch(f.type) {
      case "text": field = new TextField({ name: f.name }); break;
      case "bool": field = new BoolField({ name: f.name }); break;
      case "file": field = new FileField({ name: f.name, ...f.options }); break;
      default: return;
    }
    collection.fields.add(field);
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("website_settings");
  const fieldsToRemove = [
    "site_name", "site_description", "contact_email", "contact_phone", 
    "contact_address", "ga4_measurement_id", "adsense_publisher_id", 
    "search_console_verification", "facebook_url", "twitter_url", 
    "instagram_url", "linkedin_url", "youtube_url", "maintenance_mode", "site_logo"
  ];
  fieldsToRemove.forEach(name => collection.fields.removeByName(name));
  return app.save(collection);
})
