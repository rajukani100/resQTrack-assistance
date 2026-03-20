const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // This field enables automatic deletion after 30 minutes
    expires: 1800, // 30 minutes in seconds
  },
});

module.exports = mongoose.model("Card", CardSchema);
