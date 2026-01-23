import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import alertRoutes from "./routes/alertRoutes.js";
import accidentRoutes from "./routes/accidentRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB(); // Connect to MongoDB
const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: " http://localhost:5174",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// API Routes
app.get("/", (req, res) => {
  res.send("Backend is running on Render!");
});

app.use("/api", alertRoutes);
app.use("/api", accidentRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port:${PORT}`);
});
