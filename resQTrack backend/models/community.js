const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the request or discussion
  description: { type: String, required: true }, // Issue or help request details
  user: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true }, // Store the user's name
  },
  location: {
    latitude: Number,
    longitude: Number,
  },
  category: {
    type: String,
    enum: ["Help Request", "Stolen Vehicle", "Discussion", "Alert"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Open", "Resolved"],
    default: "Open", // Tracks if the issue is still active
  },
  responses: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String, // Name of the user who responded
      message: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  timestamp: { type: Date, default: Date.now }, // When the post was created
});

module.exports = mongoose.model("Community", communitySchema);
