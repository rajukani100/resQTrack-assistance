const User = require("../models/User");
// const User = require("../models/User");
const axios = require("axios");
async function getAddress(latitude, longitude) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    const response = await axios.get(url);
    return response.data.display_name || "Address not found";
  } catch (error) {
    return "Address lookup failed";
  }
}

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🚀 Add Emergency Contact
exports.addEmergencyContact = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone } = req.body;
    if (!name || !phone) {
      return res
        .status(400)
        .json({ message: "Name and phone are required", success: false });
    }

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    user.emergencyContacts.push({ name, phone });
    await user.save();

    res.status(201).json({
      message: "Emergency contact added successfully",
      success: true,
      contacts: user.emergencyContacts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// 🚀 Get Emergency Contacts
exports.getEmergencyContacts = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("emergencyContacts");
    // console.log(user);

    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    res.status(200).json({
      message: "Emergency contacts retrieved",
      success: true,
      contacts: user.emergencyContacts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// 🚀 Update Emergency Contact
exports.updateEmergencyContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { name, phone } = req.body;
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    const contact = user.emergencyContacts.id(contactId);
    if (!contact)
      return res
        .status(404)
        .json({ message: "Contact not found", success: false });

    if (name) contact.name = name;
    if (phone) contact.phone = phone;

    await user.save();
    res.status(200).json({
      message: "Emergency contact updated",
      success: true,
      contacts: user.emergencyContacts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// 🚀 Delete Emergency Contact
exports.deleteEmergencyContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    user.emergencyContacts = user.emergencyContacts.filter(
      (contact) => contact._id.toString() !== contactId
    );
    await user.save();

    res.status(200).json({
      message: "Emergency contact deleted",
      success: true,
      contacts: user.emergencyContacts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
