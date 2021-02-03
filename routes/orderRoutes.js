const express = require("express");
const orderController = require("./../controllers/orderController");
const authenticationController = require("./../controllers/authenticationController");
const fileUpload = require("express-fileupload");

const router = express.Router();

router
	.route("/")
	.post(
		// authenticationController.protect(),	//Any one can order.
		// authenticationController.restrictTo( "User"),
		fileUpload(),
		orderController.addOrder
	)
	.get(
		authenticationController.protect(),
		authenticationController.restrictTo( "Admin"),
		orderController.getOrders
	);

router
	.route("/:id")
	.get(orderController.getOrder)
	.delete(
		authenticationController.protect(),
		authenticationController.restrictTo( "Admin"),
		orderController.deleteOrder
	);

router.patch(
	"/:id/seen",
	authenticationController.protect(),
	authenticationController.restrictTo( "Admin"),
	orderController.setSeenStatus
);

router.patch(
	"/:id/delivered",
	authenticationController.protect(),
	authenticationController.restrictTo( "Admin"),
	orderController.setDeliveredStatus
);

module.exports = router;
