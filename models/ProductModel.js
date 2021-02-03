const mongoose = require("mongoose");

//Model for NON custom products

//Note that custom products do NOT have a separate model. They are included in the order directly.

const productSchema = new mongoose.Schema(
	{
		skuCode: {
			type: String,
			unique: [true, "This SKU code is a duplicate of an existing one. SKU codes must be unique."],
			required: [true, "The SKU code must be specified."],
		},
		//This field should be removed -- I am leaving it till i finish testing
		// productCategories: {
		// 	type: [String],
		// 	required: [true, "Product categories must be specified."],
		// 	validate: {
		// 		validator: function (value) {
		// 			//Check for duplicates
		// 			if (new Set(value).size !== value.length) return false;

		// 			//Check that input categories are subset of NON_CUSTOM_GENERAL_PRODUCTS_NAMES
		// 			return value.every(function (val) {
		// 				return NON_CUSTOM_GENERAL_PRODUCTS_NAMES.indexOf(val) >= 0;
		// 			});
		// 		},
		// 		message: `Product categories must be a subset of ${NON_CUSTOM_GENERAL_PRODUCTS_NAMES} with no duplicates`,
		// 	},
		// },
		generalProduct: {
			type: mongoose.Schema.ObjectId,
			required: [true, "General product id must be specified."],
			ref: "GeneralProduct",
		},
		image: {
			type: String,
			// required: [true, "Product image url must be specified."], //Because the product will be created first then if the product is created successfully, the image will be uploaded then the product image will be updated
		},
		description: {
			type: String
		},
		dateOfRelease: {
			type: Date,
			required: [true, "Date of release must be specified."],
		},
		availableForSale: {
			type: Boolean,
			default: true,
		},
		SalePercentage: {
			type: Number,
		},
	},
	{
		strict: "throw",
	}
);

productSchema.pre(/^find/, function (next) {
	this.find({
		availableForSale: {
			$ne: false,
		},
	});
	next();
});

productSchema.pre("count", function (next) {
	this.find({
		deleted: {
			$ne: true,
		},
	});
	next();
});

// productSchema.pre("findOne", function (next) {
// 	this.find({
// 		availableForSale: {
// 			$ne: false,
// 		},
// 	});
// 	next();
// });
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
