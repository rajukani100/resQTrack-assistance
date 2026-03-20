const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
  serviceType: {
    type: String,
    // enum: ["towing", "flat_tire", "emergency", "out_of_fuel", "vehicle_issue"],
    required: true,
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  status: {
    type: String,
    // enum: ["pending", "in_progress", "completed", "cancelled"],
    default: "pending",
  },
  RequestStatus: {
    type: String,
    // enum: ["pending", "accept", "reject"],
    default: "pending",
  },
  assignedMechanic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mechanic",
    default: null,
  },
  RequestId: {
    type: String,
    default: null,
  },
  additionalInfo: {
    type: String,
  },
  vehicleType: {
    type: String,
  },
  estimatedArrivalTime: { type: Date, default: null }, // Mechanic's ETA
  createdAt: { type: Date, default: Date.now }, // Request creation time
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update 'updatedAt' before saving
requestSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Request", requestSchema);
