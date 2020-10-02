const mongoose = require("mongoose");
const idValidator = require("mongoose-id-validator");
const productCategories = require("../config/productCategories");
const customProductCategories = require("../config/customProductCategories");

const OrderedProductSchema = new mongoose.Schema(
	{
		productID: {
			type: mongoose.Schema.ObjectId,
			ref: "Product",
			default: null,
		},
		size: {
			type: String,
			required: [true, "Product size must be specified."],
			validate: {
				validator: function (value) {
					/^[0-9]{1,3} x [0-9]{1,3}$/.test(value);
				},
				message:
					"The size format is incorrect. It must be in this form: 'width1 x height1'. Width and height must be 1-3 digits and separated by ' x '",
			},
		},
		quantity: {
			type: Number,
			required: [true, "Quantity must be specified."],
		},
		numberOfFaces: {
			type: Number,
			required: [true, "Number of faces must be specified."],
			default: 1,
		},
		price: {
			type: Number,
			required: [true, "Price must be specified."],
			validate: {
				validator: function (value) {
					let correctPrice = 0;
					if (!!this.productID) {
						correctPrice =
							(process.env.productsSizesPrices[this.categories[0]].sizesPrices[this.size] +
								(this.numberOfFaces - 1) * process.env.facePrice) *
							this.quantity;
					} else {
						correctPrice =
							(process.env.customProductsSizesPrices[this.categories[0]].sizesPrices[this.size] +
								(this.numberOfFaces - 1) * process.env.facePrice) *
							this.quantity;
					}
					return value === correctPrice;
				},
				message: "The calculate price is incorrect",
			},
		},
		categories: {
			type: [String],
			required: [true, "Product categories must be specified."],
			validate: [
				{
					validator: function (value) {
						//Check for duplicates
						if (new Set(value).size !== value.length) return false;
						return true;
					},
					message: "Product categories must not have any duplicates.",
				},
				{
					validator: function (value) {
						if (!!this.productID) {
							//If not custom product
							//Check that input categories are subset of productCategories
							return value.every(function (val) {
								return productCategories.indexOf(val) >= 0;
							});
						}
						return true;
					},
					message: `Product categories must be a subset of ${productCategories}.`,
				},
				{
					validator: function (value) {
						if (!this.productID) {
							//If custom product
							//Check that input categories are subset of customProductCategories
							return value.every(function (val) {
								return customProductCategories.indexOf(val) >= 0;
							});
						}
						return true;
					},
					message: `Product categories must be a subset of ${customProductCategories}.`,
				},
			],
		},
		image: {
			type: String,
			required: [true, "Order image url must be specified."],
		},
	},
	{
		strict: "throw",
	}
);

//Plugins:-
//-----------------------------------------------------------------
OrderedProductSchema.plugin(idValidator, {
	message: "Bad ID value for {PATH}",
});

module.exports = OrderedProductSchema;
