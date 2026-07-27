/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("seo_settings");

  const record0 = new Record(collection);
    record0.set("page_name", "molarity-calculator");
    record0.set("meta_title", "Molarity Calculator \u2013 Calculate Molar Concentration Online Easily");
    record0.set("h1_tag", "Molarity Calculator for Accurate Chemical Solutions");
    record0.set("meta_description", "Calculate molarity (moles per liter) quickly with our molarity calculator. Ideal for chemistry students and lab professionals.");
    record0.set("meta_keywords", "molarity calculator, molarity formula calculator, calculate molarity online, molar concentration calculator, chemistry calculator molarity");
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
    record1.set("page_name", "normality-calculator");
    record1.set("meta_title", "Normality Calculator \u2013 Calculate Solution Normality Online");
    record1.set("h1_tag", "Normality Calculator for Chemistry Calculations");
    record1.set("meta_description", "Easily calculate normality of a solution using our free normality calculator. Accurate and fast for chemistry applications.");
    record1.set("meta_keywords", "normality calculator, normality formula calculator, solution normality calculator, chemistry normality tool");
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
    record2.set("page_name", "dilution-calculator");
    record2.set("meta_title", "Dilution Calculator \u2013 Calculate Solution Dilution (C1V1 = C2V2)");
    record2.set("h1_tag", "Dilution Calculator for Accurate Lab Calculations");
    record2.set("meta_description", "Use our dilution calculator to determine final concentrations and volumes using the C1V1 = C2V2 formula.");
    record2.set("meta_keywords", "dilution calculator, c1v1 c2v2 calculator, dilution formula calculator, solution dilution calculator");
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
    record3.set("page_name", "mole-fraction-calculator");
    record3.set("meta_title", "Mole Fraction Calculator \u2013 Calculate Mole Fraction Online");
    record3.set("h1_tag", "Mole Fraction Calculator for Chemical Analysis");
    record3.set("meta_description", "Calculate mole fraction of components in a mixture quickly using our accurate mole fraction calculator.");
    record3.set("meta_keywords", "mole fraction calculator, mole fraction formula, chemistry mole fraction calculator, solution composition calculator");
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
    record4.set("page_name", "molality-calculator");
    record4.set("meta_title", "Molality Calculator \u2013 Calculate Molality of Solutions Easily");
    record4.set("h1_tag", "Molality Calculator for Chemistry Calculations");
    record4.set("meta_description", "Determine molality of a solution quickly with our free molality calculator. Ideal for lab and academic use.");
    record4.set("meta_keywords", "molality calculator, molality formula calculator, solution molality calculator, chemistry molality tool");
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
    record5.set("page_name", "ph-calculator");
    record5.set("meta_title", "pH Calculator \u2013 Calculate pH Value of Acidic & Basic Solutions");
    record5.set("h1_tag", "pH Calculator for Accurate pH Measurement");
    record5.set("meta_description", "Calculate pH values of acids and bases instantly using our pH calculator. Fast, accurate, and easy to use.");
    record5.set("meta_keywords", "ph calculator, ph value calculator, acidity calculator, basic solution calculator, ph formula calculator");
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
    record6.set("page_name", "velocity-calculator");
    record6.set("meta_title", "Velocity Calculator \u2013 Calculate Speed, Distance & Time Easily");
    record6.set("h1_tag", "Velocity Calculator for Motion Calculations");
    record6.set("meta_description", "Calculate velocity, speed, distance, and time using our free velocity calculator. Ideal for physics and real-life use.");
    record6.set("meta_keywords", "velocity calculator, speed distance time calculator, motion calculator, velocity formula calculator");
  try {
    app.save(record6);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record7 = new Record(collection);
    record7.set("page_name", "force-calculator");
    record7.set("meta_title", "Force Calculator \u2013 Calculate Force Using F = ma Formula");
    record7.set("h1_tag", "Force Calculator for Physics Calculations");
    record7.set("meta_description", "Calculate force using mass and acceleration with our easy-to-use force calculator based on Newton's law.");
    record7.set("meta_keywords", "force calculator, f=ma calculator, newton force calculator, physics force formula");
  try {
    app.save(record7);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record8 = new Record(collection);
    record8.set("page_name", "work-calculator");
    record8.set("meta_title", "Work Calculator \u2013 Calculate Work Done (W = F \u00d7 d)");
    record8.set("h1_tag", "Work Calculator for Physics Problems");
    record8.set("meta_description", "Calculate work done using force and displacement with our free work calculator.");
    record8.set("meta_keywords", "work calculator physics, work formula calculator, w=fd calculator, energy work calculator");
  try {
    app.save(record8);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record9 = new Record(collection);
    record9.set("page_name", "power-calculator");
    record9.set("meta_title", "Power Calculator \u2013 Calculate Power (P = Work/Time)");
    record9.set("h1_tag", "Power Calculator for Energy Calculations");
    record9.set("meta_description", "Calculate power using work and time with our easy power calculator. Ideal for physics and engineering.");
    record9.set("meta_keywords", "power calculator, power formula calculator, p=w/t calculator, energy power calculator");
  try {
    app.save(record9);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record10 = new Record(collection);
    record10.set("page_name", "kinetic-energy-calculator");
    record10.set("meta_title", "Kinetic Energy Calculator \u2013 Calculate KE (\u00bdmv\u00b2) Easily");
    record10.set("h1_tag", "Kinetic Energy Calculator for Physics");
    record10.set("meta_description", "Calculate kinetic energy using mass and velocity with our free KE calculator.");
    record10.set("meta_keywords", "kinetic energy calculator, ke formula calculator, 1/2mv2 calculator, motion energy calculator");
  try {
    app.save(record10);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record11 = new Record(collection);
    record11.set("page_name", "potential-energy-calculator");
    record11.set("meta_title", "Potential Energy Calculator \u2013 Calculate PE (mgh) Online");
    record11.set("h1_tag", "Potential Energy Calculator for Physics");
    record11.set("meta_description", "Calculate potential energy using mass, gravity, and height with our easy calculator.");
    record11.set("meta_keywords", "potential energy calculator, pe calculator, mgh calculator, gravitational energy calculator");
  try {
    app.save(record11);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record12 = new Record(collection);
    record12.set("page_name", "ohms-law-calculator");
    record12.set("meta_title", "Ohm's Law Calculator \u2013 Calculate Voltage, Current & Resistance");
    record12.set("h1_tag", "Ohm's Law Calculator for Electrical Calculations");
    record12.set("meta_description", "Calculate voltage, current, and resistance using Ohm's Law with our free calculator.");
    record12.set("meta_keywords", "ohms law calculator, voltage current resistance calculator, v=ir calculator, electrical calculator");
  try {
    app.save(record12);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record13 = new Record(collection);
    record13.set("page_name", "pressure-calculator");
    record13.set("meta_title", "Pressure Calculator \u2013 Calculate Pressure (P = F/A)");
    record13.set("h1_tag", "Pressure Calculator for Physics & Engineering");
    record13.set("meta_description", "Calculate pressure using force and area with our simple pressure calculator.");
    record13.set("meta_keywords", "pressure calculator, pressure formula calculator, p=f/a calculator, physics pressure calculator");
  try {
    app.save(record13);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record14 = new Record(collection);
    record14.set("page_name", "wave-speed-calculator");
    record14.set("meta_title", "Wave Speed Calculator \u2013 Calculate Speed of Waves Easily");
    record14.set("h1_tag", "Wave Speed Calculator for Physics");
    record14.set("meta_description", "Calculate wave speed using frequency and wavelength with our accurate calculator.");
    record14.set("meta_keywords", "wave speed calculator, wave formula calculator, frequency wavelength calculator");
  try {
    app.save(record14);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record15 = new Record(collection);
    record15.set("page_name", "dna-rna-converter");
    record15.set("meta_title", "DNA to RNA Converter \u2013 Convert Genetic Sequences Online");
    record15.set("h1_tag", "DNA/RNA Converter for Genetic Analysis");
    record15.set("meta_description", "Convert DNA sequences to RNA instantly using our accurate DNA/RNA converter tool.");
    record15.set("meta_keywords", "dna to rna converter, genetic sequence converter, dna rna tool, bioinformatics tool");
  try {
    app.save(record15);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record16 = new Record(collection);
    record16.set("page_name", "smart-todo-list");
    record16.set("meta_title", "Smart To-Do List \u2013 Manage Tasks Efficiently Online");
    record16.set("h1_tag", "Smart To-Do List for Daily Task Management");
    record16.set("meta_description", "Organize your daily tasks with our smart to-do list. Stay productive and manage work efficiently.");
    record16.set("meta_keywords", "todo list online, task manager, daily task tracker, productivity tool");
  try {
    app.save(record16);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record17 = new Record(collection);
    record17.set("page_name", "task-board");
    record17.set("meta_title", "Task Board \u2013 Organize Projects & Tasks Visually");
    record17.set("h1_tag", "Task Board for Project Management");
    record17.set("meta_description", "Manage tasks visually with our task board. Perfect for teams and personal productivity.");
    record17.set("meta_keywords", "task board, kanban board online, project management tool, task tracker");
  try {
    app.save(record17);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record18 = new Record(collection);
    record18.set("page_name", "daily-planner");
    record18.set("meta_title", "Daily Planner \u2013 Plan Your Day for Maximum Productivity");
    record18.set("h1_tag", "Daily Planner for Organized Living");
    record18.set("meta_description", "Plan your daily activities and boost productivity with our easy-to-use daily planner.");
    record18.set("meta_keywords", "daily planner online, day planner tool, productivity planner, schedule planner");
  try {
    app.save(record18);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record19 = new Record(collection);
    record19.set("page_name", "sticky-notes");
    record19.set("meta_title", "Sticky Notes Online \u2013 Quick Notes Anytime, Anywhere");
    record19.set("h1_tag", "Sticky Notes for Quick Reminders");
    record19.set("meta_description", "Create and manage quick notes online with our sticky notes tool.");
    record19.set("meta_keywords", "sticky notes online, note taking tool, quick notes app");
  try {
    app.save(record19);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record20 = new Record(collection);
    record20.set("page_name", "countdown-timer");
    record20.set("meta_title", "Countdown Timer \u2013 Track Time for Events & Deadlines");
    record20.set("h1_tag", "Countdown Timer for Time Tracking");
    record20.set("meta_description", "Track time for events and deadlines using our countdown timer.");
    record20.set("meta_keywords", "countdown timer online, event timer, deadline tracker");
  try {
    app.save(record20);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record21 = new Record(collection);
    record21.set("page_name", "pomodoro-timer");
    record21.set("meta_title", "Pomodoro Timer \u2013 Boost Focus & Productivity");
    record21.set("h1_tag", "Pomodoro Timer for Deep Focus");
    record21.set("meta_description", "Use Pomodoro technique to improve productivity with timed work sessions.");
    record21.set("meta_keywords", "pomodoro timer online, focus timer, productivity timer");
  try {
    app.save(record21);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record22 = new Record(collection);
    record22.set("page_name", "water-tracker");
    record22.set("meta_title", "Water Tracker \u2013 Track Daily Water Intake Easily");
    record22.set("h1_tag", "Water Tracker for Healthy Living");
    record22.set("meta_description", "Track your daily water intake and stay hydrated with our water tracker.");
    record22.set("meta_keywords", "water tracker, hydration tracker, daily water intake tool");
  try {
    app.save(record22);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record23 = new Record(collection);
    record23.set("page_name", "mood-tracker");
    record23.set("meta_title", "Mood Tracker \u2013 Track Your Daily Emotions & Wellbeing");
    record23.set("h1_tag", "Mood Tracker for Mental Wellness");
    record23.set("meta_description", "Monitor your mood and improve mental wellbeing with our mood tracker.");
    record23.set("meta_keywords", "mood tracker, mental health tracker, emotion tracker");
  try {
    app.save(record23);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record24 = new Record(collection);
    record24.set("page_name", "medicine-reminder");
    record24.set("meta_title", "Medicine Reminder \u2013 Never Miss Your Medication");
    record24.set("h1_tag", "Medicine Reminder for Daily Health");
    record24.set("meta_description", "Set reminders for medicines and stay on track with your health routine.");
    record24.set("meta_keywords", "medicine reminder, pill reminder, medication tracker");
  try {
    app.save(record24);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record25 = new Record(collection);
    record25.set("page_name", "meal-planner");
    record25.set("meta_title", "Meal Planner \u2013 Plan Healthy Meals Easily");
    record25.set("h1_tag", "Meal Planner for Healthy Lifestyle");
    record25.set("meta_description", "Plan your meals and maintain a healthy diet with our meal planner.");
    record25.set("meta_keywords", "meal planner, diet planner, weekly meal planner");
  try {
    app.save(record25);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record26 = new Record(collection);
    record26.set("page_name", "routine-builder");
    record26.set("meta_title", "Routine Builder \u2013 Build & Track Daily Habits");
    record26.set("h1_tag", "Routine Builder for Consistent Habits");
    record26.set("meta_description", "Create and track daily routines to improve productivity and discipline.");
    record26.set("meta_keywords", "routine builder, habit tracker, daily routine planner");
  try {
    app.save(record26);
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