/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("tools");

  const record0 = new Record(collection);
    record0.set("name", "Molarity Calculator");
    record0.set("category", "Science");
    record0.set("description", "Calculate molarity of solutions by determining moles of solute and volume of solution");
    record0.set("url", "/molarity-calculator");
    record0.set("status", "active");
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
    record1.set("name", "Normality Calculator");
    record1.set("category", "Science");
    record1.set("description", "Calculate normality of solutions for acid-base chemistry calculations");
    record1.set("url", "/normality-calculator");
    record1.set("status", "active");
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
    record2.set("name", "Dilution Calculator");
    record2.set("category", "Science");
    record2.set("description", "Calculate dilution ratios and concentrations for chemical solutions");
    record2.set("url", "/dilution-calculator");
    record2.set("status", "active");
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
    record3.set("name", "Mole Fraction Calculator");
    record3.set("category", "Science");
    record3.set("description", "Calculate mole fractions in chemical mixtures and solutions");
    record3.set("url", "/mole-fraction-calculator");
    record3.set("status", "active");
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
    record4.set("name", "Molality Calculator");
    record4.set("category", "Science");
    record4.set("description", "Calculate molality of solutions based on solute and solvent mass");
    record4.set("url", "/molality-calculator");
    record4.set("status", "active");
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
    record5.set("name", "pH Calculator");
    record5.set("category", "Science");
    record5.set("description", "Calculate pH and pOH values for acids and bases");
    record5.set("url", "/ph-calculator");
    record5.set("status", "active");
  try {
    app.save(record5);
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