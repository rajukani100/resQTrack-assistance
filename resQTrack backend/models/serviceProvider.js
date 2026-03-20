const mongoose = require("mongoose");

const serviceProviderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password stored

    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    chatId: {
      type: String,
      default: null,
    },
    servicesOffered: [
      {
        type: String,
        enum: [
          "Towing",
          "Flat Tire",
          "Fuel Delivery",
          "Jump Start",
          "Mechanical Repair",
        ],
        required: true,
      },
    ],

    availabilityStatus: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "available",
    },

    rating: {
      totalReviews: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 }, // Rating out of 5
    },

    serviceHistory: [
      {
        serviceRequestId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ServiceRequest",
        },
        completedAt: { type: Date, default: Date.now },
      },
    ],

    role: {
      type: String,
      enum: ["serviceprovider"],
      default: "serviceprovider",
    },
  },
  { timestamps: true }
); // Adds createdAt & updatedAt

module.exports = mongoose.model("ServiceProvider", serviceProviderSchema);
