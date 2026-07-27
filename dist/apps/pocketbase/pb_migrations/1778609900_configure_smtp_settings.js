/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let settings = app.settings();

  settings.smtp.enabled = true;
  settings.smtp.host = "smtp.hostinger.com";
  settings.smtp.port = 465;
  settings.smtp.username = "admin@toolisiya.com";
  settings.smtp.password = "Singh@rk123";
  settings.smtp.tls = true;
  settings.smtp.authMethod = "LOGIN";

  settings.meta.senderName = "Toolisiya";
  settings.meta.senderAddress = "admin@toolisiya.com";

  app.save(settings);
}, (app) => {
  let settings = app.settings();
  settings.smtp.enabled = false;
  app.save(settings);
});
