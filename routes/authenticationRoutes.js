const express = require("express");
const authenticationController = require("./../controllers/authenticationController");

const router = express.Router();

router.post("/signup", authenticationController.protect(), authenticationController.restrictTo("Admin"), authenticationController.signup);

router.post("/login", authenticationController.login);

router.post("/admin-signup", authenticationController.adminSignup);

router.post("/admin-login", authenticationController.adminLogin);

module.exports = router;
