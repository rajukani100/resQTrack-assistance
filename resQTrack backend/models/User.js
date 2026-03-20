const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  location: {
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
  },

  vehicleDetails: {
    make: { type: String },
    model: { type: String },
    year: { type: Number },
    licensePlate: { type: String },
  },

  emergencyContacts: [
    {
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
  ],

  resQTagCardNo: { type: String, unique: true, sparse: true }, // Unique ResQTag Number
  serviceRequests: [
    {
      serviceType: { type: String, required: true }, // e.g., Towing, Flat Tire, Fuel
      requestTime: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ["pending", "in-progress", "completed", "cancelled"],
        default: "pending",
      },
    },
  ],

  communityChats: [
    {
      message: { type: String, required: true },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  otp: {
    type: String,
  },

  otpExpires: {
    type: Date,
  },

  role: {
    type: String,
    enum: ["user", "serviceprovider"],
    default: "user",
  },
  credits: {
    type: Number,
    default: 0, // You can set any default value you'd like, e.g., 10 or 100
  },
});

module.exports = mongoose.model("User", userSchema);
