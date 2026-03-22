import twilio from "twilio";
import dotenv from "dotenv";
import { generateTowMessage } from "../utils/towMessage.js";
import User from "../models/user.js";

dotenv.config();

// Twilio setup
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const WHATSAPP_NUMBER = "whatsapp:+14155238886"; // Twilio sandbox number

export const sendTowAlert = async (req, res) => {
  const { cardNumber, latitude, longitude } = req.body;
   console.log(req.body);

  // const users = await User.findOne({ email: "vandanrangani21@gmail.com" });
  // console.log(users);

  const user = await User.findOne({ resQTagCardNo: cardNumber });
  // console.log(user.phone);

  if (!cardNumber || cardNumber.length < 6) {
    return res.status(400).json({ error: "Invalid card number." });
  }
  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Location not received." });
  }
  // if (!phoneNumber) {
  //   return res.status(400).json({ error: "Receiver's phone number is required." });
  // }

  // const RECEIVER_NUMBER = `whatsapp:+91${user.phone}`;
  // const RECEIVER_NUMBER = `whatsapp:+918849243397`;
  const message = generateTowMessage(cardNumber, latitude, longitude);
  

  try {
    await twilioClient.messages.create({
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+918849243397',
      body: `🚨 *PARKING ALERT* 🚨 Your vehicle ${cardNumber} is parked in a No Parking Zone. Please remove it within 5 minutes to avoid towing.📍 *Location:https://maps.google.com/?q=${latitude},${longitude} Sent by *ResQTrack Team`,
    });
    

    //  const RECEIVER_NUMBER = `+91${user.emergencyContacts[0].phone}`;
    
    // const response = await twilioClient.messages.create({
    //   from: "+12203561290",
    //   to: RECEIVER_NUMBER,
    //   body:`🚨 *PARKING ALERT* 🚨 Your vehicle ${cardNumber} is parked in a No Parking Zone. Please remove it within 5 minutes to avoid towing.📍 *Location:https://maps.google.com/?q=${latitude},${longitude} Sent by *ResQTrack Team`
    // });


    await twilioClient.messages
    .create({
        body: '🚨 *PARKING ALERT* 🚨our vehicle* is parked in a No Parking Zone. Please remove it within 5 minutes to avoid towing.',
        from: '+15512181571',
        to: '+918849243397'
    })
    .then(message => console.log(message.sid));



    res.json({ success: true, message: "Tow alert sent via WhatsApp", location: { latitude, longitude } });
  } catch (error) {
    console.log(error);
    console.error(error);
    res.status(500).json({ error: "Failed to send WhatsApp message." });
  }
};
