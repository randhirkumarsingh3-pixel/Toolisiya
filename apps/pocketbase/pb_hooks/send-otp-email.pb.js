/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // This hook sends OTP codes when a new OTP record is created
  // It's triggered after requestOTP is called
  if (e.collection.name === 'users') {
    e.next();
    return;
  }
  e.next();
}, "users");

// Hook to send OTP email when OTP code is created
onRecordAfterCreateSuccess((e) => {
  const email = e.record.get("email");
  const code = e.record.get("code");
  
  if (!email || !code) {
    e.next();
    return;
  }
  
  try {
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: email }],
      subject: "Your OTP Code",
      html: "<h1>Your One-Time Password</h1><p>Your OTP code is: <strong>" + code + "</strong></p><p>This code will expire in 5 minutes.</p><p>Do not share this code with anyone.</p>"
    });
    $app.newMailClient().send(message);
  } catch (err) {
    console.log("Error sending OTP email: " + err.message);
  }
  
  e.next();
}, "otp_codes");