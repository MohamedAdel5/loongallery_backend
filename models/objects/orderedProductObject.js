const mongoose = require("mongoose");
const idValidator = require("mongoose-id-validator");

const OrderedProductSchema = new mongoose.Schema(
	{
		productID: {
			type: mongoose.Schema.ObjectId,
			ref: "Product",
		},
		skuCode: {
			type: String,
		},
		image: {
			type: String,
			// required: [true, "Order image url must be specified."],
		},
		// productCategories: {
		// 	type: [String],
		// 	required: [true, "Product categories must be specified."],
		// 	validate: [
		// 		{
		// 			validator: function (value) {
		// 				//Check for duplicates
		// 				if (new Set(value).size !== value.length) return false;
		// 				return true;
		// 			},
		// 			message: "Product categories must not have any duplicates.",
		// 		},
		// 		{
		// 			validator: function (value) {
		// 				if (!!this.productID) {
		// 					//If not custom product
		// 					//Check that input categories are subset of NON_CUSTOM_GENERAL_PRODUCTS_NAMES

		// 					return value.every(function (val) {
		// 						return NON_CUSTOM_GENERAL_PRODUCTS_NAMES.indexOf(val) >= 0;
		// 					});
		// 				}
		// 				return true;
		// 			},
		// 			message: `Product categories must be a subset of ${NON_CUSTOM_GENERAL_PRODUCTS_NAMES}.`,
		// 		},
		// 		{
		// 			validator: function (value) {
		// 				if (!this.productID) {
		// 					//If custom product
		// 					//Check that input categories are subset of CUSTOM_GENERAL_PRODUCTS_NAMES
		// 					return value.every(function (val) {
		// 						return CUSTOM_GENERAL_PRODUCTS_NAMES.indexOf(val) >= 0;
		// 					});
		// 				}
		// 				return true;
		// 			},
		// 			message: `Product categories must be a subset of ${CUSTOM_GENERAL_PRODUCTS_NAMES}.`,
		// 		},
		// 	],
		// },
		generalProduct:{
			type: mongoose.Schema.ObjectId,
			required: [true, "General product id must be specified."],
			ref: "GeneralProduct",
		},
		size: {
			type: String,
			required: [true, "Product size must be specified."],
			validate: {
				validator: function (value) {
					return /^[0-9]{1,3} x [0-9]{1,3}$|^One size$/.test(value);
				},
				message:
					"The size format is incorrect. It must be in this form: 'width1 x height1'. Width and height must be 1-3 digits and separated by ' x '",
			},
		},
		numberOfFaces: {
			type: Number,
			required: [true, "Number of faces must be specified."],
			min: 0,
		},
		quantity: {
			type: Number,
			required: [true, "Quantity must be specified."],
		},
		price: {
			type: Number,
			required: [true, "Price must be specified."],
			validate: {
				validator: function (value) {
					let correctPrice = 0;

					const facesCount = this.numberOfFaces === 0 ? 1 : this.numberOfFaces;
					if (!!this.productID) {
						correctPrice =
							(NON_CUSTOM_GENERAL_PRODUCTS[this.generalProduct].sizesPrices[this.size] +
								(facesCount - 1) * FACE_PRICE) *
							this.quantity;
					} else {
						correctPrice =
							(CUSTOM_GENERAL_PRODUCTS[this.generalProduct].sizesPrices[this.size] +
								(facesCount - 1) * FACE_PRICE) *
							this.quantity;
					}
					return value === correctPrice;
				},
				message: "The calculated price is incorrect",
			},
		},
	},
	{
		strict: "throw",
		_id: false
	}
);

//Plugins:-
//-----------------------------------------------------------------
OrderedProductSchema.plugin(idValidator, {
	message: "Bad ID value for {PATH}",
});



module.exports = OrderedProductSchema;
