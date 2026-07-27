/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("seo_settings");

  const record0 = new Record(collection);
    record0.set("page_name", "global");
    record0.set("meta_title", "Toolisiya - Free Online Tools");
    record0.set("meta_description", "Collection of free online tools for productivity, calculations, and conversions");
    record0.set("meta_keywords", "tools, calculator, converter, generator");
    record0.set("is_published", true);
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
    record1.set("page_name", "homepage");
    record1.set("meta_title", "Toolisiya - Free Online Tools");
    record1.set("meta_description", "Collection of free online tools for productivity, calculations, and conversions");
    record1.set("meta_keywords", "tools, calculator, converter, generator");
    record1.set("is_published", true);
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
    record2.set("page_name", "about");
    record2.set("meta_title", "About Toolisiya");
    record2.set("meta_description", "Learn about Toolisiya and our mission to provide free online tools");
    record2.set("meta_keywords", "about, toolisiya, mission");
    record2.set("is_published", true);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("page_name", "contact");
    record3.set("meta_title", "Contact Toolisiya");
    record3.set("meta_description", "Get in touch with Toolisiya support team");
    record3.set("meta_keywords", "contact, support, help");
    record3.set("is_published", true);
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("page_name", "terms");
    record4.set("meta_title", "Terms of Service - Toolisiya");
    record4.set("meta_description", "Read our terms of service");
    record4.set("meta_keywords", "terms, service, legal");
    record4.set("is_published", true);
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record5 = new Record(collection);
    record5.set("page_name", "privacy");
    record5.set("meta_title", "Privacy Policy - Toolisiya");
    record5.set("meta_description", "Read our privacy policy");
    record5.set("meta_keywords", "privacy, policy, data");
    record5.set("is_published", true);
  try {
    app.save(record5);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record6 = new Record(collection);
    record6.set("page_name", "faq");
    record6.set("meta_title", "FAQ - Toolisiya");
    record6.set("meta_description", "Frequently asked questions about Toolisiya");
    record6.set("meta_keywords", "faq, questions, help");
    record6.set("is_published", true);
  try {
    app.save(record6);
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