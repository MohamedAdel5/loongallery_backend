const express = require("express");
const authenticationController = require("./../controllers/authenticationController");
const userController = require("./../controllers/userController");

const router = express.Router();

router.get("/me", authenticationController.protect(), userController.me);
router.patch(
	"/change-addresses",
	authenticationController.protect(),
	userController.changeAddresses
);
router.patch(
	"/change-phone-numbers",
	authenticationController.protect(),
	userController.changePhoneNumbers
);

module.exports = router;
