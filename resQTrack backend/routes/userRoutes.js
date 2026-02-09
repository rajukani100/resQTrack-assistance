const express = require("express");
const userRoutes = express.Router();
const { auth } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  getEmergencyContacts,
} = require("../controllers/user.controller");
const {
  registerserviceprovider,
  logindashboard,
  updateservicelocation,
  nearbyMechanicFinder,
  nearbycompetitors,
  getlocation,
  getmechanic,
} = require("../controllers/request.controller");
const { use } = require("./requestRoute");

userRoutes.get("/getuserprofile", auth, getUserProfile);
userRoutes.post("/addcontact", auth, addEmergencyContact);
userRoutes.get("/getcontact", auth, getEmergencyContacts);
userRoutes.put("/update/:contactId", auth, updateEmergencyContact);
userRoutes.delete("/delete/:contactId", auth, deleteEmergencyContact);

//nearby mechanic finder
userRoutes.post("/find-nearby-mechanics", nearbyMechanicFinder);
userRoutes.get("/mechanic/:mechId", getmechanic);
userRoutes.post("/nearbycompetitors", nearbycompetitors);
//service provider routes
userRoutes.post("/registerserviceprovider", registerserviceprovider);
userRoutes.put("/updateservicelocation", auth, updateservicelocation);
userRoutes.post("/serviceproviderlogin", logindashboard);
userRoutes.post("/getlocation", getlocation);
module.exports = userRoutes;
