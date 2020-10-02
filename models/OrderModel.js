const mongoose = require("mongoose");
const idValidator = require("mongoose-id-validator");
const orderedProductObject = require("./objects/orderedProductObject");
const productCategories = require("./config/productCategories");

const orderSchema = new mongoose.Schema(
	{
		userID: {
			//if signed up
			type: mongoose.Schema.ObjectId,
			ref: "User",
			default: null,
		},
		products: {
			type: [orderedProductObject],
			required: [true, "Products must be specified."],
		},
		customerName: {
			type: String,
			required: [true, "Customer name must be specified,"],
		},
		customerPhoneNumbers: {
			type: [String],
			required: [true, "Customer phone numbers must be specified."],
			validate: {
				validator: function (value) {
					//Check that input categories are subset of productCategories
					return value.every(function (val) {
						return productCategories.indexOf(val) >= 0;
					});
				},
				message: `Product categories must be a subset of ${productCategories} with no duplicates`,
			},
		},
		image: {
			type: String,
			required: [true, "Order image url must be specified."],
		},
		dateOfRelease: {
			type: Date,
			required: [true, "Date of release must be specified."],
		},
		dateOfUpdate: {
			type: Date,
			default: null,
		},
		availableForSale: {
			type: Boolean,
			default: true,
		},
		SalePercentage: {
			type: Number,
			default: null,
		},
	},
	{
		strict: "throw",
	}
);

//Plugins:-
//-----------------------------------------------------------------
orderSchema.plugin(idValidator, {
	message: "Bad ID value for {PATH}",
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
