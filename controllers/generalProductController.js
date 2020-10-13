const catchAsync = require("../utils/catchAsync");
const GeneralProduct = require("../models/GeneralProductModel");
const AppError = require("../utils/appError");

module.exports.addGeneralProduct = catchAsync(async (req, res, next) => {
	req.body.dateOfRelease = new Date();
	await GeneralProduct.create(req.body);
	res.status(200).json({
		status: "success",
		message: "Sizes prices are set successfully.",
	});
});

module.exports.getOneProductSizesPrices = catchAsync(async (req, res, next) => {
	const generalProduct = await GeneralProduct.findOne({ productName: req.params.productName });

	if (!generalProduct) throw new AppError("Cannot find this product", 400);

	res.status(200).json({
		status: "success",
		productName: generalProduct.productName,
		sizesPrices: generalProduct.sizesPrices,
	});
});

module.exports.getNonCustomProductsSizesPrices = catchAsync(async (req, res, next) => {
	const generalProducts = await GeneralProduct.find({ isCustomProduct: false }).select(
		"productName sizesPrices"
	);
	res.status(200).json({
		status: "success",
		products: generalProducts,
	});
});

module.exports.getCustomProductsSizesPrices = catchAsync(async (req, res, next) => {
	const generalProducts = await GeneralProduct.find({ isCustomProduct: true }).select(
		"productName sizesPrices"
	);
	res.status(200).json({
		status: "success",
		products: generalProducts,
	});
});

module.exports.updateProductSizesPrices = catchAsync(async (req, res, next) => {
	const tmpGeneralProduct = await GeneralProduct.findOne({ productName: req.params.productName });
	const oldSizesPrices = JSON.parse(JSON.stringify(tmpGeneralProduct.sizesPrices));
	await GeneralProduct.findOneAndUpdate(
		{ productName: req.params.productName },
		{
			sizesPrices: req.body.sizesPrices,
			$push: {
				updates: {
					objectBeforeUpdate: oldSizesPrices,
					updateDate: new Date(),
				},
			},
		},
		{
			runValidators: true,
		}
	);
	res.status(200).json({
		status: "success",
		message: "Updated successfully.",
	});
});

module.exports.initializeGlobalVariables = async () => {
	const tmpnonCustomGeneralProducts = JSON.parse(
		JSON.stringify(
			await GeneralProduct.find({ isCustomProduct: false }).select("productName sizesPrices")
		)
	);

	const tmpcustomGeneralProducts = JSON.parse(
		JSON.stringify(
			await GeneralProduct.find({ isCustomProduct: true }).select("productName sizesPrices")
		)
	);

	const nonCustomGeneralProducts = {};
	for (let val of tmpnonCustomGeneralProducts) {
		nonCustomGeneralProducts[val.productName] = {
			sizesPrices: val.sizesPrices,
		};
	}

	const customGeneralProducts = {};
	for (let val of tmpcustomGeneralProducts) {
		customGeneralProducts[val.productName] = {
			sizesPrices: val.sizesPrices,
		};
	}
	return {
		nonCustomGeneralProducts,
		customGeneralProducts,
	};
};
