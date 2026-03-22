import express from "express";
import { sendAccidentAlert,verifyOTP } from "../controllers/accidentAlert.js"; // Import the accident alert controller

const router = express.Router();

// Define accident alert route
router.post("/send-accident-alert", sendAccidentAlert);
router.post("/verify", verifyOTP); // Route for OTP verification
export default router;
