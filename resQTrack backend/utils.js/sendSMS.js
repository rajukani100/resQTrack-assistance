require("dotenv").config();
const twilio = require("twilio");

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Function to send an SMS alert
const sendEmergencyAlert = async (phoneNumbers, location, emergencyType) => {
  const message = `🚨 EMERGENCY ALERT 🚨\nType: ${emergencyType}\nLocation: https://maps.google.com/?q=${location.latitude},${location.longitude}\nPlease respond immediately!`;

  try {
    const promises = phoneNumbers.map((phone) =>
      client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phone}`,
      })
    );

    await Promise.all(promises);
    console.log("✅ Emergency alert sent successfully!");
  } catch (error) {
    console.error("❌ Failed to send emergency SMS:", error.message);
  }
};

module.exports = sendEmergencyAlert;
