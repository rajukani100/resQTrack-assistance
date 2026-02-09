const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const requestRoutes = require("./routes/requestRoute.js");
const userRoutes = require("./routes/userRoutes.js");
const helmet = require("helmet");
const morgan = require("morgan");
// const pdf = require("pdfkit");
const emergency = require("./controllers/user.controller.js");
const communityRoutes = require("./routes/community.js");
const path = require("path");
const fs = require("fs");
const app = express();
const axios = require("axios");
const { Telegraf, Markup } = require("telegraf");
const bot = new Telegraf("8173766942:AAGMSVXE4efJYAMfQ-D7qglzu5HlrGtFFRQ");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dizxwrdv8",
  api_key: "852149552623953",
  api_secret: "oJH3ZiqflQ2_f26NQ1wy1dhzTWU",
});
const multer = require("multer");
const Imagecard = require("./models/Imagecard.js");
const storage = multer.memoryStorage();
const upload = multer({ storage });

bot.start((ctx) => {
  const chatId = ctx.chat.id;
  ctx.reply(
    `🚀 *Welcome to ResQTrack Assistance Bot!* 🚗🔧\n\n` +
      `Hello *${ctx.from.first_name}*,\n\n` +
      `*ResQTrack* connects drivers with **nearby service providers** for quick roadside assistance. With this bot, you can:\n\n` +
      `✅ Receive **real-time service requests** from drivers in need 🚘\n` +
      `✅ Accept or reject assistance requests with a single click ✅❌\n` +
      `✅ Get instant notifications for nearby breakdowns & emergencies 📍\n\n` +
      `🔹 *Your unique Chat ID:* \`${chatId}\`\n\n` +
      `📢 Stay ready to assist drivers in your area and provide seamless service! For help, type /help.`,
    { parse_mode: "Markdown" }
  );
});

const acceptRequest = async (reqId, chatId) => {
  try {
    // Find the request by ID
    const request = await Request.findOne({ RequestId: reqId });
    if (!request) {
      return { message: "Request not found", success: false };
    }

    // Ensure the request is not already assigned
    if (request.assignedMechanic) {
      return { message: "Request is already assigned", success: false };
    }

    const mechanic = await serviceProvider.findOne({ chatId: chatId });
    if (!mechanic) {
      return { message: "Mechanic not found", success: false };
    }

    // Update request to assign mechanic and change status
    request.assignedMechanic = mechanic._id;
    request.RequestStatus = "accept";
    request.status = "in_progress";
    request.estimatedArrivalTime = new Date(Date.now() + 15 * 60000);
    await request.save();

    return { message: "Request accepted successfully", success: true };
  } catch (error) {
    console.error("Error accepting request:", error);
    return { message: "Internal server error", success: false };
  }
};

bot.command("accept", async (ctx) => {
  const messageText = ctx.message.text;
  const commandParts = messageText.split(" ");
  const chatId = ctx.chat.id;

  if (commandParts.length === 2) {
    const requestId = commandParts[1]; // Get the request ID (e.g., "12345")
    const response = await acceptRequest(requestId, chatId);

    ctx.reply(
      response.success
        ? `✅ Success! Request with ID ${requestId} has been accepted.`
        : `⚠️ ${response.message}`
    );
  } else {
    ctx.reply("⚠️ Please use the correct format: `/accept <request_id>`");
  }
});

// bot.launch();
console.log("🤖 ResQTrack Bot is running...");

// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));

app.use(cors());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
connectDB();
app.get("/", (req, res) => {
  res.send("🚀 Your server is up and running!");
});

const pdf = require("pdfkit");
const serviceProvider = require("./models/serviceProvider.js");
const Request = require("./models/Request.js");
const Card = require("./models/Card.js");
const User = require("./models/User.js");
const ProductRoutes = require("./routes/ProductRoutes.js");
const { auth } = require("./middleware/authMiddleware.js");

app.post("/esp-time/:cardnumber", async (req, res) => {
  try {
    const cardnumber = req.params.cardnumber;
    console.log("Time from ESP32:", cardnumber);

    // const currentTime = new Date();

    // Create the card entry
    const createSosRequest = await Card.create({
      cardNumber: cardnumber,
      expiryDate: new Date(Date.now() + 30 * 60 * 1000),
    });

    res.status(200).json({
      message: "SOS request sent successfully",
      error: false,
      success: true,
      data: createSosRequest,
    });
  } catch (err) {
    console.error("Error saving card:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: true,
      success: false,
    });
  }
});

app.get("/generate-invoice", (req, res) => {
  const {
    mechanicName,
    serviceType,
    amount,
    customerName,
    location,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    vehicleLicensePlate,
  } = req.query;

  if (
    !mechanicName ||
    !serviceType ||
    !amount ||
    !customerName ||
    !location ||
    !vehicleMake ||
    !vehicleModel ||
    !vehicleYear ||
    !vehicleLicensePlate
  ) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  // Construct the vehicle details object
  const vehicleDetails = {
    make: vehicleMake,
    model: vehicleModel,
    year: vehicleYear,
    licensePlate: vehicleLicensePlate,
  };

  // Generate the invoice PDF
  generateInvoicePDF(
    mechanicName,
    serviceType,
    amount,
    customerName,
    location,
    vehicleDetails,
    res
  );
});

const generateInvoicePDF = (
  mechanicName,
  serviceType,
  amount,
  customerName,
  location,
  vehicleDetails,
  res
) => {
  const doc = new pdf();
  const filename = `invoice_${Date.now()}.pdf`;

  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  // Header Section
  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("ResQTrack", { align: "center" });
  doc
    .fontSize(16)
    .font("Helvetica")
    .text("Mechanic Service Invoice", { align: "center" });
  doc.moveDown(2);

  // Invoice Info
  doc.fontSize(12).text(`Invoice No: ${Date.now()}`, { align: "left" });
  doc.text(`Date: ${new Date().toLocaleString()}`, { align: "left" });
  doc.text("--------------------------------------------------", {
    align: "left",
  });
  doc.moveDown(1);

  // Customer Details
  doc.fontSize(14).text("Customer Details", { align: "left", underline: true });
  doc.fontSize(12).text(`Customer Name: ${customerName}`);
  doc.text(`Location: ${location}`);
  doc.text("--------------------------------------------------", {
    align: "left",
  });
  doc.moveDown(1);

  // Vehicle Details
  doc.fontSize(14).text("Vehicle Details", { align: "left", underline: true });
  doc.fontSize(12).text(`Make: ${vehicleDetails.make}`);
  doc.text(`Model: ${vehicleDetails.model}`);
  doc.text(`Year: ${vehicleDetails.year}`);
  doc.text(`License Plate: ${vehicleDetails.licensePlate}`);
  doc.text("--------------------------------------------------", {
    align: "left",
  });
  doc.moveDown(1);

  // Mechanic & Service Details
  doc.fontSize(14).text("Service Details", { align: "left", underline: true });
  doc.fontSize(12).text(`Mechanic Name: ${mechanicName}`);
  doc.text(`Service Type: ${serviceType}`);
  doc.text("--------------------------------------------------", {
    align: "left",
  });
  doc.moveDown(1);

  // Billing Section
  doc.fontSize(14).text("Billing Details", { align: "left", underline: true });
  doc.text(`Amount: ₹${amount}`);
  doc.text("--------------------------------------------------", {
    align: "left",
  });
  doc.moveDown(2);

  // Footer Section
  doc.fontSize(12).text("Thank you for using ResQTrack!", { align: "center" });
  doc
    .fontSize(10)
    .text("For inquiries, contact: support@resqtrack.com", { align: "center" });
  doc.text("--------------------------------------------------", {
    align: "center",
  });

  // Finalize the PDF
  doc.end();
};

app.post(
  "/createsosrequest",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      const userId = req.userId;
      const { cardnumber, description } = req.body;
      const currenttime = new Date();

      // Get card details
      const getcarddetails = await Card.findOne({
        cardNumber: cardnumber,
        status: "active",
      });
      console.log(getcarddetails);

      if (!getcarddetails) {
        return res.status(404).json({ message: "Card not found" });
      }
      console.log(getcarddetails.expiryDate, currenttime);

      if (new Date(getcarddetails.expiryDate) < currenttime) {
        return res.status(400).json({ message: "Card has expired" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }

      // Upload to Cloudinary
      const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
      };

      const result = await uploadToCloudinary();

      // Save to MongoDB
      const savedToDB = await Imagecard.create({
        image: result.secure_url,
        description,
        cardNumber: cardnumber,
      });
      console.log(userId);

      const increasecredits = await User.findOneAndUpdate(
        { _id: userId }, // ✅ Correct object format for filter
        { $inc: { credits: 100 } }, // ✅ Increment credits by 1
        { new: true } // ✅ Return the updated document
      );

      console.log(increasecredits);
      const changestatus = await Card.findOneAndUpdate(
        { cardNumber: cardnumber },
        {
          status: "inactive",
        }
      );
      res.status(201).json({
        message: "SOS request created successfully",
        data: savedToDB,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }
);

app.use("/api/user", requestRoutes);
app.use("/api/emergency", userRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/product", ProductRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
