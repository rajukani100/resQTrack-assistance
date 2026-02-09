const express = require("express");
const router = express.Router();
const {
  createRequest,
  registerUsercontroller,
  loginController,
  logout,
  userdetails,
  updateLocation,
  assignResqtag,
  getResqtagdetails,
  updatevechicledetails,
  updatestatus,
  instantsos,
  getrequest,
  getallcompletedrequest,
  requeststatusupdate,
  acceptrequest,
  getacceptedrequest,
  searchrequest,
  getlocationofrequest,
  synctelebot,
  getvehicledetails,
  requesthistory,
  rateMechanic,
  getprofiledetails,
  getrequestdetails,
  getrecentrequet,
  changethestatus,
} = require("../controllers/request.controller");
const { auth } = require("../middleware/authMiddleware");
const { getUserProfile } = require("../controllers/user.controller");

const axios = require("axios");

router.post("/request", auth, createRequest);
router.post("/register", registerUsercontroller);
router.post("/login", loginController);
router.post("/logout", logout);
router.get("/user-details", auth, userdetails);
router.post("/update-location", auth, updateLocation);
router.post("/assign-resqtag", auth, assignResqtag);
router.get("/getresqtagdetails", auth, getResqtagdetails);
router.put("/update-vehicle", auth, updatevechicledetails);
router.get("/getvehicledetails", auth, getvehicledetails);
router.put("/update/:requestId", auth, updatestatus);
router.post("/sos", auth, instantsos);
router.get("/requesthistory", auth, requesthistory);
router.post("/ratemechanic/:mechId", auth, rateMechanic);
// dashboard get routes

router.get("/getallrequest", getrequest);
router.get("/getallcompletedrequest", auth, getallcompletedrequest);
router.put("/rejectrequest/:request_id", auth, requeststatusupdate);
router.put("/acceptrequest/:request_id", auth, acceptrequest);
router.get("/getacceptedrequest", auth, getacceptedrequest);
router.put("/handlerequeststatus/:request_id", auth, changethestatus);
router.get("/getrequestdetails", auth, getrequestdetails);
router.get("/searchrequest/:id", searchrequest);
router.get("/getlocationorequest/:id", auth, getlocationofrequest);
router.post("/synctelebot", auth, synctelebot);
router.get("/getprofiledetails", auth, getprofiledetails);
module.exports = router;
