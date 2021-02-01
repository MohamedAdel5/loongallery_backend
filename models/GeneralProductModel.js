const mongoose = require("mongoose");
const updateObject = require("./objects/updateObject");

const generalProductSchema = new mongoose.Schema(
	{
		productName: {
			type: String,
			unique: [
				true,
				"This product name is a duplicate of an existing one. product names must be unique.",
			],
			required: [true, "The product name must be specified."],
		},
		productName_Ar: {
			type: String,
			required: [true, "The product name in arabic must be specified."],
		},
		sizesPrices: {
			type: Object,
			required: [true, "Product sizes prices object must be specified."],
			validate: {
				validator: function (value) {
					const sizes = Object.keys(value);
					//Check for duplicates
					if (new Set(sizes).size !== sizes.length) return false;

					//Check that input categories are subset of NON_CUSTOM_GENERAL_PRODUCTS_NAMES
					return sizes.every(function (size) {
						return /^[0-9]{1,3} x [0-9]{1,3}$|^One size$/.test(size) && !isNaN(value[size]);
					});
				},
				message: `Sizes and prices must be in this form: {"width1 x height1": price, "width2 x height2": price, ...}. width and height must be 1-3 digits and separated by ' x ' and the price has to be a number`,
			},
		},
		dateOfRelease: {
			type: Date,
			required: [true, "Date of release must be specified."],
		},
		updates: {
			type: [updateObject],
		},
		isCustomProduct: {
			type: Boolean,
			required: [true, "Custom product state must be specified"],
		},
	},
	{
		strict: "throw",
	}
);

const GeneralProduct = mongoose.model("GeneralProduct", generalProductSchema);
module.exports = GeneralProduct;
