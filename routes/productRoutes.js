const express = require("express");
const productController = require("./../controllers/productController");
const authenticationController = require("./../controllers/authenticationController");
const fileupload = require("express-fileupload");

const router = express.Router();

router
	.route("/")
	.post(
		authenticationController.protect(),
		authenticationController.restrictTo("Admin"),
		fileupload(),
		productController.addProduct
	)
	.get(productController.getProducts);

router
	.route("/:id")
	.get(productController.getProduct)
	.patch(
		authenticationController.protect(),
		authenticationController.restrictTo("Admin"),
		fileupload(),
		productController.updateProduct
	)
	.delete(
		authenticationController.protect(),
		authenticationController.restrictTo("Admin"),
		productController.deleteProduct
	);

module.exports = router;
