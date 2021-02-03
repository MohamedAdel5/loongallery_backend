const express = require("express");
const globalVariablesController = require("./../controllers/globalVariablesController");
const authenticationController = require("./../controllers/authenticationController");

const router = express.Router();

router
	.route("/:globalVariableName")
	.get(globalVariablesController.getGlobalVariable)
	.patch(
		authenticationController.protect(),
		authenticationController.restrictTo( "Admin"),
		globalVariablesController.updateGlobalVariable
	);

module.exports = router;
