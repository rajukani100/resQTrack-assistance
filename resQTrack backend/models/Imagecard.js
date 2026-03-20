const mongoose = require("mongoose");

const ImageCardSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1800, // 30 minutes auto-delete
  },
});

module.exports = mongoose.model("Imagecard", ImageCardSchema);
