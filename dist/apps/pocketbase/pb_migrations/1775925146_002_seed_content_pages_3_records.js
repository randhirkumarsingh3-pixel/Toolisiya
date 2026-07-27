/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("content_pages");

  const record0 = new Record(collection);
    record0.set("page_type", "homepage_hero");
    record0.set("page_id", "hero_section");
    record0.set("title", "Welcome to Our Productivity Tools");
    record0.set("description", "Discover powerful tools to boost your productivity and simplify your daily tasks");
    record0.set("content", "{\"subtitle\": \"All-in-one platform for productivity\", \"cta_button_text\": \"Get Started\", \"cta_button_link\": \"/tools\", \"background\": \"linear-gradient(135deg, #667eea 0%, #764ba2 100%)\"}");
    record0.set("published", true);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("page_type", "homepage_features");
    record1.set("page_id", "features_section");
    record1.set("title", "Why Choose Our Platform");
    record1.set("description", "Experience the best features designed for your success");
    record1.set("content", "{\"features\": [{\"icon\": \"zap\", \"title\": \"Fast & Reliable\", \"description\": \"Lightning-fast calculations and instant results\"}, {\"icon\": \"shield\", \"title\": \"Secure & Private\", \"description\": \"Your data is encrypted and never shared\"}, {\"icon\": \"users\", \"title\": \"User Friendly\", \"description\": \"Intuitive interface anyone can use\"}, {\"icon\": \"trending-up\", \"title\": \"Always Updated\", \"description\": \"New tools and features added regularly\"}]}");
    record1.set("published", true);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("page_type", "about");
    record2.set("page_id", "about_page");
    record2.set("title", "About Us");
    record2.set("description", "Learn more about our mission and vision");
    record2.set("content", "{\"mission\": \"To empower individuals and businesses with innovative tools that simplify complex tasks\", \"vision\": \"To become the world's most trusted productivity platform\", \"values\": [\"Innovation\", \"Reliability\", \"User-Centric\", \"Transparency\"], \"history\": \"Founded in 2024, we started with a simple goal: make productivity tools accessible to everyone\", \"team\": \"Our team consists of passionate developers and designers dedicated to excellence\", \"contact\": \"contact@example.com\"}");
    record2.set("published", true);
  try {
    app.save(record2);
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