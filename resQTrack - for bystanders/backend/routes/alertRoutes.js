import express from "express";
import { sendTowAlert } from "../controllers/alertController.js";

const router = express.Router();

// Route for sending Tow Alert
router.post("/send-tow-alert", sendTowAlert);

export default router;
