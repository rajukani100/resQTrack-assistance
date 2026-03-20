const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  emergencyType: { type: String, required: true }, // 'accident', 'medical', 'security'
  location: {
    latitude: Number,
    longitude: Number,
  },
  emergencyContactsNotified: { type: Boolean, default: false },
  respondersNotified: { type: Boolean, default: false },
  status: { type: String, default: "active" }, // 'active', 'resolved'
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SOS", sosSchema);
