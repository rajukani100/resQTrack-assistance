import twilio from "twilio";
import dotenv from "dotenv";
import { generateAccidentMessage } from "../utils/accidentMessage.js"; // Import message generator
import User from "../models/user.js";
import { generateTowMessage } from "../utils/towMessage.js";
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000)};

dotenv.config();

// Twilio configuration
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
// const TWILIO_WHATSAPP_NUMBER = "whatsapp:+14155238886"; // Twilio Sandbox Number

export const sendAccidentAlert = async (req, res) => {
  const { cardNumber,latitude,longitude } = req.body;
  const user = await User.findOne({ resQTagCardNo: cardNumber });
  const generatedOTP = generateOTP();
  
    console.log(user);
  if (!user) {
    return res.status(404).json({ error: "User not found. Please check the card number." });
  }
  if (!user.phone) {
    return res.status(400).json({ error: "User's phone number not found. Please check the card number." });
  }
  
  

  if (!cardNumber || cardNumber.length < 6) {
    return res.status(400).json({ error: "Invalid card number. Please enter a valid 16-digit number." });
  }

  

  const RECEIVER_NUMBER =  `+91${user.phone}`;
  // const message = generateAccidentMessage(cardNumber, latitude, longitude);
  
  try {
    const generatedOTP = generateOTP();
    user.otp = generatedOTP;
    user.otpExpires = new Date(Date.now() + 5 * 60000); // OTP expires in 5 minutes
    const vandan=await user.save();
    const message= `🚨 EMERGENCY ALERT 🚨 - Your verification OTP is: ${generatedOTP}. Please use it within 5 minutes.`;
    console.log(message);
    // console.log("Receiver Number", RECEIVER_NUMBER);
  
    const response = await twilioClient.messages.create({
      from: '+15512181571',
      to: '+918849243397',
      body: message,
    });
    console.log(response);
   
    res.json({ success: true, message: "Accident alert sent successfully!", location: { latitude, longitude } });
  } catch (error) {
    console.error("Twilio Error:", error);
    res.status(500).json({ error: "Failed to send WhatsApp message. Please try again later." });
  }
};
export const verifyOTP = async (req, res) => {
  const { otp, latitude, longitude } = req.body;
  const { cardNumber } = req.body;
  console.log(cardNumber);
  if (!otp) {
    return res.status(400).json({ error: "OTP are required." });
  }

  const user = await User.findOne({resQTagCardNo:cardNumber});
  const dbotp =  user.otp;
  console.log("asd",dbotp);
  
  console.log(otp);

  
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }
  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Location not received. Ensure location access is enabled." });
  }
  if (user.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP. Please try again." });
  }

  if (new Date() > user.otpExpires) {
    return res.status(400).json({ error: "OTP has expired. Please request a new one." });
  }
     const RECEIVER_NUMBER = `+91${user.emergencyContacts[0].phone}`;
      
      const response = await twilioClient.messages.create({
        from: "+15512181571",
        to: RECEIVER_NUMBER,
      body:`Accident detected for vehicle ${cardNumber}. Assistance may be needed.Location: https://maps.google.com/?q=${latitude},${longitude}`
    });
    console.log(response);
    console.log("RECEIVER_NUMBER  is :" ,RECEIVER_NUMBER );

   
    
  res.json({ success: true, message: "OTP verified successfully!" });
  // OTP is valid, proceed with sending the accident alert
 
};
