const globalVariablesController = require("../controllers/globalVariablesController");
const generalProductController = require("../controllers/generalProductController");

module.exports = async function () {
	const globalVariables = await globalVariablesController.initializeGlobalVariables();
	global.FACE_PRICE = globalVariables.facePrice;
	global.GIFT_BOW_PRICE = globalVariables.giftBowPrice;
	global.GIFT_WRAP_PRICE = globalVariables.giftWrapPrice;



	const generalProductsGlobalVariables = await generalProductController.initializeGlobalVariables();
	global.NON_CUSTOM_GENERAL_PRODUCTS = generalProductsGlobalVariables.nonCustomGeneralProducts;
	global.CUSTOM_GENERAL_PRODUCTS = generalProductsGlobalVariables.customGeneralProducts;
	global.SHIPPING_FEES = globalVariables.shippingFees;


	// These variables are no longer used.
	// global.NON_CUSTOM_GENERAL_PRODUCTS_NAMES = Object.keys(NON_CUSTOM_GENERAL_PRODUCTS);
	// global.CUSTOM_GENERAL_PRODUCTS_NAMES = ["Custom", ...Object.keys(CUSTOM_GENERAL_PRODUCTS)];
};
