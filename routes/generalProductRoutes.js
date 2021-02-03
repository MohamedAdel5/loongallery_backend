const express = require("express");
const generalProductController = require("../controllers/generalProductController");
const authenticationController = require("../controllers/authenticationController");

const router = express.Router();

router
	.route("/")
	.post(
		authenticationController.protect(),
		authenticationController.restrictTo( "Admin"),
		generalProductController.addGeneralProduct
	);

router.route("/custom-products").get(generalProductController.getCustomProductsSizesPrices);

router.route("/non-custom-products").get(generalProductController.getNonCustomProductsSizesPrices);

router
	.route("/:productName")
	.get(generalProductController.getOneProductSizesPrices)
	.patch(
		authenticationController.protect(),
		authenticationController.restrictTo( "Admin"),
		generalProductController.updateProductSizesPrices
	);

module.exports = router;
