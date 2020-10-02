const VariableGlobals = require("../models/GlobalVariables");
const SizesPrices = require("../models/SizesPricesModel");

module.exports = async function () {
	process.env.facePrice = await VariableGlobals.findOne({
		"globalObject.facePrice": { $exists: true },
	}).globalObject.facePrice;

	const customProductsSizesPrices = await SizesPrices.find({ isCustomProduct: true }).select(
		"productName sizesPrices"
	);
	process.env.customProductsSizesPrices = {};
	customProductsSizesPrices.forEach((val) => {
		process.env.customProductsSizesPrices[val.productName] = {
			sizesPrices: val.sizesPrices,
		};
	});

	const productsSizesPrices = await SizesPrices.find({ isCustomProduct: false }).select(
		"productName sizesPrices"
	);
	process.env.productsSizesPrices = {};
	productsSizesPrices.forEach((val) => {
		process.env.productsSizesPrices[val.productName] = {
			sizesPrices: val.sizesPrices,
		};
	});
};
