const axios = require("axios"); // Import axios for API calls
const Request = require("../models/Request");
const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const SOS = require("../models/instantsos.js");
const sendEmergencyAlert = require("../utils.js/sendSMS.js");
const { generateaccesstoken } = require("../utils.js/generateAccesstoken.js");
const ServiceProvider = require("../models/serviceProvider.js");
const serviceProvider = require("../models/serviceProvider.js");
const { message } = require("telegraf/filters");

//telegram bot
const TELEGRAM_BOT_TOKEN = "8173766942:AAGMSVXE4efJYAMfQ-D7qglzu5HlrGtFFRQ";
const SERVICE_PROVIDER_CHAT_ID = "6095647111";

// const serviceProvider = require("../models/serviceProvider.js");
exports.createRequest = async (req, res) => {
  const userId = req.userId;
  const requestId = Math.floor(Math.random() * 100000).toString();
  console.log(requestId);

  const { location, issueType, vehicleType, additionalInfo } = req.body;

  if (!userId || !location || !issueType || !vehicleType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  function escapeMarkdownV2(text) {
    return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
  }

  // Ensure proper escaping for all user-provided inputs
  const escapedIssue = escapeMarkdownV2(issueType);
  const escapedVehicle = escapeMarkdownV2(vehicleType);
  const escapedAdditionalInfo = additionalInfo
    ? escapeMarkdownV2(additionalInfo)
    : "N/A";

  // Properly format Google Maps link
  const mapLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

  const sendmessage =
    `🚨 *New Service Request\\!* 🚨\n\n` + // Escape `!`
    `📍 Location: [Google Maps](${mapLink})\n` +
    `🔧 Issue: ${escapedIssue}\n` +
    `🚗 Vehicle: ${escapedVehicle}\n` +
    `ℹ️ Additional Info: ${escapedAdditionalInfo}\n` +
    `🔄 Accept Request: /accept\\_${userId}\n` + // Escape `_`
    `🆔 RequestId: *${requestId}*\n` +
    `⚠️ Emergency Level: *High*`;

  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: SERVICE_PROVIDER_CHAT_ID,
        text: sendmessage,
        parse_mode: "MarkdownV2",
      }
    );

    const newRequest = {
      userId,
      location,
      serviceType: issueType,
      vehicleType,
      RequestId: requestId,
      additionalInfo,
      status: "Pending",
      createdAt: new Date(),
    };

    const creates = new Request(newRequest);
    const saveit = await creates.save();

    res.status(201).json({ message: "Assistance request submitted", saveit });
  } catch (error) {
    console.error(
      "Error sending Telegram message:",
      error.response?.data || error
    );
    res.status(500).json({ error: "Failed to send request notification" });
  }
};

exports.registerUsercontroller = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: "Provide email, name, password, and phone",
        error: true,
        success: false,
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (userExists) {
      return res.status(400).json({
        message: "Email, phone, or license plate already exists",
        error: true,
        success: false,
      });
    }

    // Hash password
    const hashpassword = await bcryptjs.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashpassword,
      phone,
    });

    await newUser.save();

    return res.status(200).json({
      message: "User registered successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate field value exists",
        error: true,
        success: false,
      });
    }
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
        error: true,
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    // Corrected password comparison
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Incorrect password",
        success: false,
        error: true,
      });
    }

    const accesstoken = await generateaccesstoken(user._id);
    const cookieoption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };
    res.cookie("accessToken", accesstoken, cookieoption);
    return res.status(200).json({
      message: "Logged in successfully",
      success: true,
      data: {
        accesstoken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const cookieoption = {
      http: true,
      secure: true,
      sameSite: "None",
    };
    res.clearCookie("accessToken", cookieoption);

    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true,
    });
  }
};

exports.userdetails = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password -refresh_token");
    return res.json({
      message: "user details",
      data: user,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId);

    const { latitude, longitude } = req.body.location;

    if (!userId || !latitude || !longitude) {
      return res.status(400).json({
        message: "userId, latitude, and longitude are required",
        error: true,
        success: false,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    user.location = { latitude, longitude };
    await user.save();

    return res.status(200).json({
      message: "Location updated successfully",
      success: true,
      data: { latitude, longitude },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};

const generateResQTagCardNo = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 12-digit random number
};

exports.assignResqtag = async (req, res) => {
  try {
    const userId = req.userId;
    const resQTagCardNo = generateResQTagCardNo(); // Ensure this function is defined

    // ✅ Corrected: Find user by ID
    let existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(302).json({
        message: "User not found",
        success: false,
      });
    }

    // ✅ Fixed: Check if ResQTag is already assigned
    if (existingUser.resQTagCardNo) {
      return res.status(302).json({
        message: "Card number already assigned",
        cardnumber: existingUser.resQTagCardNo,
        error: true,
        success: false,
      });
    }

    // ✅ Corrected: Assign the ResQTag card number
    existingUser.resQTagCardNo = resQTagCardNo;
    await existingUser.save();

    res.status(200).json({
      message: "ResQTag Card Number assigned successfully",
      success: true,
      data: { resQTagCardNo: existingUser.resQTagCardNo },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

exports.getResqtagdetails = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("resQTagCardNo");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "ResQTag Card Number fetched successfully",
      success: true,
      data: { resQTagCardNo: user.resQTagCardNo },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

exports.updatevechicledetails = async (req, res) => {
  try {
    const { make, model, year, licensePlate } = req.body;
    const userId = req.userId;
    // Validate input
    if (!make || !model || !year || !licensePlate) {
      return res.status(400).json({
        message:
          "All vehicle details (make, model, year, license plate) are required",
        success: false,
      });
    }

    // Find the user and update their vehicle details
    const user = await User.findByIdAndUpdate(
      userId,
      { vehicleDetails: { make, model, year, licensePlate } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Vehicle details updated successfully",
      success: true,
      data: user.vehicleDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

exports.getvehicledetails = async (req, res) => {
  try {
    const userId = req.userId;
    // Validate input
    // Find the user and update their vehicle details
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Vehicle details updated successfully",
      success: true,
      data: user.vehicleDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

exports.requesthistory = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(400).json({
      message: "missing fields",
      success: false,
      error: true,
    });
  }
  const findrequest = await Request.find({
    userId: userId,
    assignedMechanic: { $exists: true, $ne: null },
  });
  if (!findrequest) {
    return res.json({
      message: "request not available",
    });
  }
  return res.status(200).json({
    message: "request found",
    success: "true",
    findrequest,
    error: false,
  });
};

exports.rateMechanic = async (req, res) => {
  try {
    const { mechId } = req.params; // Get mechanic ID from params
    const { rating } = req.body; // Get new rating from request body

    if (!mechId || rating == null) {
      return res.status(400).json({
        message: "Mechanic ID and rating are required",
        success: false,
        error: true,
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
        success: false,
        error: true,
      });
    }

    const mechanic = await serviceProvider.findById(mechId);
    if (!mechanic) {
      return res.status(404).json({
        message: "Mechanic not found",
        success: false,
        error: true,
      });
    }

    // Extract current rating details
    // let { totalReviews, averageRating } = mechanic.rating;
    const totalReviews = mechanic.rating.totalReviews || 0; // Ensure it's at least 0
    const averageRating = mechanic.rating.averageRating || 0; // Ensure it's at least 0
    console.log(totalReviews, averageRating);

    // Calculate new total reviews
    const newTotalReviews = totalReviews + 1;

    // Calculate new average rating (capped at 5)
    const newAverageRating = Math.floor(
      (averageRating * totalReviews + rating) / newTotalReviews
    );

    // Update the mechanic's rating
    mechanic.rating.totalReviews = newTotalReviews;
    mechanic.rating.averageRating = newAverageRating;
    await mechanic.save();

    return res.status(200).json({
      message: "Rating updated successfully",
      success: true,
      error: false,
      rating: mechanic.rating,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: true,
    });
  }
};

exports.updatestatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    request.status = status || request.status;
    await request.save();

    res.json({ message: "Request updated successfully", request });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.instantsos = async (req, res) => {
  const userId = req.userId;
  const { emergencyType, location } = req.body;

  if (!userId || !emergencyType || !location) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Save SOS request
    const sosRequest = new SOS({
      userId,
      emergencyType,
      location,
      emergencyContactsNotified: false,
      respondersNotified: false,
      status: "active",
      createdAt: new Date(),
    });

    await sosRequest.save();

    // Fetch user emergency contacts
    const user = await User.findById(userId);
    console.log(user);

    const emergencyContacts =
      user?.emergencyContacts.map((value) => {
        return value.phone;
      }) || [];
    console.log({ ...emergencyContacts });

    // Notify emergency contacts
    if (emergencyContacts.length > 0) {
      await sendEmergencyAlert(emergencyContacts, location, emergencyType);
      sosRequest.emergencyContactsNotified = true;
    }

    await sosRequest.save();

    res.status(201).json({
      message: "SOS alert sent successfully",
      sosId: sosRequest._id,
    });
  } catch (error) {
    console.error("SOS Error:", error);
    res.status(500).json({ error: "Failed to process SOS request" });
  }
};
//dashboard controllers
exports.registerserviceprovider = async (req, res) => {
  try {
    const { name, email, phone, password, servicesOffered, location } =
      req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
      });
    }

    // Ensure at least one service is provided
    if (!servicesOffered || servicesOffered.length === 0) {
      return res.status(400).json({
        message: "At least one service must be selected",
        error: true,
      });
    }

    // Check if email or phone already exists
    const existingProvider = await ServiceProvider.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingProvider) {
      return res.status(400).json({
        message: "Email or phone already in use",
        error: true,
      });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Validate location data
    if (!location || !location.latitude || !location.longitude) {
      return res.status(400).json({
        message: "Valid location data is required",
        error: true,
      });
    }

    // Create new service provider
    const newProvider = new ServiceProvider({
      name,
      email,
      phone,
      password: hashedPassword,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      servicesOffered,
    });

    await newProvider.save();

    return res.status(201).json({
      message: "Service provider registered successfully",
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
    });
  }
};

exports.logindashboard = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
        error: true,
      });
    }

    const user = await serviceProvider.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    // Corrected password comparison
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Incorrect password",
        success: false,
        error: true,
      });
    }

    const accesstoken = await generateaccesstoken(user._id);
    const cookieoption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };
    res.cookie("accessToken", accesstoken, cookieoption);
    return res.status(200).json({
      message: "Logged in successfully",
      success: true,
      data: {
        accesstoken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

exports.updateservicelocation = async (req, res) => {
  try {
    const userId = req.userId; // Extract service provider ID from auth middleware
    const { latitude, longitude } = req.body;
    console.log(latitude, longitude);

    // Validate input
    if (latitude == null || longitude == null) {
      return res
        .status(400)
        .json({ message: "Latitude & Longitude required", error: true });
    }

    // Find service provider and update location
    const response = await serviceProvider.findByIdAndUpdate(
      userId,
      { location: { latitude, longitude } },
      { new: true }
    );
    console.log(response);

    if (!response) {
      return res
        .status(404)
        .json({ message: "Service provider not found", error: true });
    }

    return res.status(200).json({
      message: "Location updated successfully",
      success: true,
      location: serviceProvider.location,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: true });
  }
};

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Function to fetch address from latitude & longitude
async function getAddress(latitude, longitude) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    const response = await axios.get(url);
    return response.data.display_name || "Address not found";
  } catch (error) {
    return "Address lookup failed";
  }
}

exports.nearbyMechanicFinder = async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.body;

    if (latitude == null || longitude == null) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required", error: true });
    }

    const maxDistance = radius || 10; // Default search radius: 10 km

    // Fetch all mechanics (service providers) with valid location data
    const mechanics = await serviceProvider.find({
      role: "serviceprovider",
      "location.latitude": { $exists: true, $ne: null },
      "location.longitude": { $exists: true, $ne: null },
    });

    if (!mechanics.length) {
      return res
        .status(404)
        .json({ message: "No mechanics found", error: true });
    }

    // Calculate distance and filter mechanics within radius
    let nearbyMechanics = mechanics
      .map((mechanic) => {
        const distance = getDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          mechanic.location.latitude,
          mechanic.location.longitude
        );
        return { ...mechanic._doc, distance };
      })
      .filter((mechanic) => mechanic.distance <= maxDistance) // ✅ Filter within radius
      .sort((a, b) => a.distance - b.distance); // ✅ Sort by nearest first

    // Fetch address for user location
    const userAddress = await getAddress(latitude, longitude);
    if (nearbyMechanics.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No nearby mechanics found",
        userLocation: { latitude, longitude, address: userAddress },
        mechanics: [],
      });
    }
    return res.status(200).json({
      success: true,
      userLocation: {
        latitude,
        longitude,
        address: userAddress, // ✅ User's Address
      },
      mechanics: nearbyMechanics,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: true });
  }
};

exports.getmechanic = async (req, res) => {
  const { mechId } = req.params;
  if (!mechId) {
    return res.status(400).json({
      message: "mechanic Id not found ",
      error: true,
      success: false,
    });
  }
  const response = await serviceProvider.findById(mechId);
  if (!response) {
    return res.status(401).json({
      message: "mechanic not found",
      success: false,
      error: true,
    });
  }
  return res.status(200).json({
    message: "mechanic found",
    response,
    success: true,
    error: false,
  });
};

exports.nearbycompetitors = async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.body;

    if (latitude == null || longitude == null) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required", error: true });
    }

    const maxDistance = radius || 500; // Default search radius: 5 km

    // Fetch all mechanics (service providers) with valid location data
    const mechanics = await serviceProvider.find({
      role: "serviceprovider",
      "location.latitude": { $exists: true, $ne: null },
      "location.longitude": { $exists: true, $ne: null },
    });

    if (!mechanics.length) {
      return res
        .status(404)
        .json({ message: "No mechanics found", error: true });
    }

    // Function to get address using OpenStreetMap (Nominatim)
    const getAddress = async (lat, lon) => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        return response.data.display_name || "Address not found";
      } catch (error) {
        console.error("Error fetching address:", error);
        return "Address not available";
      }
    };

    // Get user address
    const userAddress = await getAddress(latitude, longitude);

    // Calculate distance and filter mechanics within radius
    let nearbyMechanics = await Promise.all(
      mechanics.map(async (mechanic) => {
        const distance = getDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          mechanic.location.latitude,
          mechanic.location.longitude
        );

        // Fetch mechanic's address
        const mechanicAddress = await getAddress(
          mechanic.location.latitude,
          mechanic.location.longitude
        );

        return {
          ...mechanic._doc,
          distance: Math.round(distance),
          address: mechanicAddress, // ✅ Added address for each mechanic
        };
      })
    );

    // Filter within radius & sort by nearest first
    nearbyMechanics = nearbyMechanics
      .filter((mechanic) => mechanic.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);

    if (nearbyMechanics.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No nearby mechanics found",
        userLocation: { latitude, longitude, address: userAddress },
        mechanics: [],
      });
    }

    return res.status(200).json({
      success: true,
      userLocation: {
        latitude,
        longitude,
        address: userAddress, // ✅ User's address
      },
      mechanics: nearbyMechanics, // ✅ Includes addresses for mechanics
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: true });
  }
};

exports.getrequest = async (req, res) => {
  try {
    // Get all requests sorted by newest first
    const getallrequest = await Request.find({})
      .sort({ createdAt: -1 }) // 🆕 sort recent first
      .populate(
        "userId",
        "-password -emergencyContacts -role -serviceRequests -communityChats -otp -otpExpires"
      );

    // Count only pending requests
    const getallrequests = await Request.countDocuments({
      RequestStatus: "pending",
    });

    res.status(200).json({
      message: "Assistance request list fetched successfully",
      getallrequest,
      totalrequest: getallrequests,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true,
    });
  }
};

exports.getlocation = async (req, res) => {
  const { latitude, longitude } = req.body;
  const response = await getAddress(latitude, longitude);
  return res.json({
    success: true,
    error: false,
    response,
  });
};

exports.getallcompletedrequest = async (req, res) => {
  const userId = req.userId;
  const completedrequest = await Request.find({
    status: "completed",
    assignedMechanic: userId,
  });
  const completedrequests = await Request.find({
    status: "completed",
    assignedMechanic: userId,
  }).countDocuments();
  return res.json({
    message: "sucessfully fetch",
    sucess: true,
    error: false,
    completedrequest,
    totalcompleted: completedrequests,
  });
};

exports.requeststatusupdate = async (req, res) => {
  const userId = req.userId;
  const request_id = req.params.request_id;
  // const { assignedMechanic } = req.body;
  const { status } = req.body;
  const updatestatus = await Request.findByIdAndUpdate(request_id, {
    RequestStatus: "Cancelled",
  });

  return res.json({
    updatestatus,
    success: true,
    error: false,
  });
};

exports.acceptrequest = async (req, res) => {
  try {
    const mechanicId = req.userId; // Mechanic's ID from auth middleware
    console.log(mechanicId);

    const request_id = req.params.request_id;

    console.log("Mechanic ID:", mechanicId);

    // Check if the mechanic exists in the Mechanic collection
    const mechanic = await serviceProvider.findById(mechanicId);
    if (!mechanic) {
      return res.status(403).json({
        message: "Unauthorized: Only mechanics can accept requests",
        success: false,
        error: true,
      });
    }

    // Find the request by ID
    const request = await Request.findOne({ RequestId: request_id });
    if (!request) {
      return res.status(404).json({
        message: "Request not found",
        success: false,
        error: true,
      });
    }

    // Ensure the request is not already assigned
    if (request.assignedMechanic) {
      return res.status(400).json({
        message: "Request is already assigned",
        success: false,
        error: true,
      });
    }

    // Update request to assign mechanic and change status
    const updatedRequest = await Request.findOneAndUpdate(
      { RequestId: request_id },
      {
        assignedMechanic: mechanicId,
        status: "in_progress",
        RequestStatus: "Accepted",
        estimatedArrivalTime: new Date(Date.now() + 15 * 60000), // ETA (15 mins)
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Request accepted successfully",
      request: updatedRequest,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error accepting request:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true,
    });
  }
};

exports.changethestatus = async (req, res) => {
  const { request_id } = req.params;
  const { status } = req.body;
  const userId = req.userId;
  // Validate required fields
  console.log(request_id, status, userId);

  if (!request_id || !status || !userId) {
    return res.status(400).json({
      message: "Missing required fields",
      success: false,
      error: true,
    });
  }

  try {
    // Update the request status if it belongs to the logged-in mechanic
    const updatedRequest = await Request.findOneAndUpdate(
      {
        RequestId: request_id,
        assignedMechanic: userId,
        RequestStatus: "Accepted",
      },
      {
        $set: { status: status },
      },
      {
        new: true, // return the updated document
      }
    );

    if (!updatedRequest) {
      return res.status(404).json({
        message: "Request not found or not eligible for status change",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Status updated successfully",
      success: true,
      error: false,
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({
      message: "Internal server error while updating status",
      success: false,
      error: true,
    });
  }
};

exports.getacceptedrequest = async (req, res) => {
  const userId = req.userId;
  const getallrequest = await Request.find({
    assignedMechanic: userId,
    RequestStatus: "Accepted",
  }).sort({ createdAt: -1 });

  const getallrequests = await Request.findById(userId, {
    RequestStatus: "Accepted",
  }).countDocuments();
  res.status(201).json({
    message: "Assistance request submitted",
    getallrequest,
    totalrequest: getallrequests,
  });
};

exports.getrequestdetails = async (req, res) => {
  const userId = req.userId;
  const recentRequest = await Request.find()
    .populate("userId")
    .sort({ createdAt: -1 })
    .limit(7);

  const finduser = await serviceProvider.findById(userId);
  const totalrequest = await Request.find().countDocuments();
  const acceptedrequest = await Request.find({
    RequestStatus: "Accepted",
    assignedMechanic: userId,
  }).countDocuments();
  const Cancelledrequest = await Request.find({
    RequestStatus: "Cancelled",
  }).countDocuments();
  const pendingrequest = await Request.find({
    status: "in_progress",
    assignedMechanic: userId,
  }).countDocuments();

  return res.status(200).json({
    recentRequest,
    updatedAt: finduser.updatedAt,
    totalrequest,
    acceptedrequest,
    Cancelledrequest,
    pendingrequest,
  });
};

exports.searchrequest = async (req, res) => {
  const id = req.params.id;
  const response = await Request.findById(id);
  return res.json({
    success: true,
    error: false,
    response,
  });
};

exports.getlocationofrequest = async (req, res) => {
  try {
    const request_id = req.params.id; // User's request ID
    const userId = req.userId; // Mechanic's ID

    const findlocationofuser = await Request.findById(request_id);
    if (!findlocationofuser || !findlocationofuser.location) {
      return res.status(404).json({
        success: false,
        message: "Request not found or location missing",
      });
    }

    const mechanic = await ServiceProvider.findById(userId);
    if (!mechanic || !mechanic.location) {
      return res.status(404).json({
        success: false,
        message: "Mechanic not found or location missing",
      });
    }

    res.json({
      success: true,
      userlocation: findlocationofuser.location, // User's location
      mechaniclocation: mechanic.location, // Mechanic's location
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getprofiledetails = async (req, res) => {
  const userId = req.userId;
  const finduser = await serviceProvider.findById(userId).select("-password");
  return res.status(200).json({
    message: "user details fetched succesfully",
    finduser,
    success: true,
    error: false,
  });
};

exports.synctelebot = async (req, res) => {
  const { chatId } = req.body;
  const userId = req.userId;
  if (!chatId) {
    return res.status(400).json({
      message: "all fields are required",
    });
  }
  const updatechatId = await serviceProvider.findByIdAndUpdate(userId, {
    chatId: chatId,
  });
  return res.json({
    message: "chatId added succesfully",
    updatechatId,
    success: true,
  });
};
