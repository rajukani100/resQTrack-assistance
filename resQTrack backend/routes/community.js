const express = require("express");
const communityRoutes = express.Router();
const { auth } = require("../middleware/authMiddleware");
const {
  createpost,
  nearbypost,
  reply,
  resolved,
  searches,
} = require("../controllers/community.controller");

communityRoutes.post("/create", auth, createpost);
communityRoutes.get("/nearby", auth, nearbypost);
communityRoutes.post("/:postId/reply", auth, reply);
communityRoutes.patch("/:postId/resolve", auth, resolved);
communityRoutes.get("/nearby-services", auth, searches);

module.exports = communityRoutes;

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
