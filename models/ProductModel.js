const mongoose = require("mongoose");
const productCategories = require("./config/productCategories");

const productSchema = new mongoose.Schema(
	{
		skuCode: {
			type: String,
			unique: [true, "This SKU code is a duplicate of an existing one. SKU codes must be unique."],
			required: [true, "The SKU code must be specified."],
		},
		productCategories: {
			type: [String],
			required: [true, "Product categories must be specified."],
			validate: {
				validator: function (value) {
					//Check for duplicates
					if (new Set(value).size !== value.length) return false;

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
			required: [true, "Product image url must be specified."],
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

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
