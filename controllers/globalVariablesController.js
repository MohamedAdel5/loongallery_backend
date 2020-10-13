const catchAsync = require("../utils/catchAsync");
const GlobalVariables = require("../models/GlobalVariablesModel");

module.exports.addGlobalVariable = async (globalVariableObject) => {
	await GlobalVariables.create(globalVariableObject);
};

module.exports.getAllGlobalVariables = catchAsync(async (req, res, next) => {
	const globalVariables = await GlobalVariables.find();
	res.status(200).json({
		status: "success",
		globalVariables,
	});
});

module.exports.getGlobalVariable = catchAsync(async (req, res, next) => {
	const query = {};
	query[`globalObject.${req.params.globalVariableName}`] = { $exists: true };
	const globalVariable = await GlobalVariables.findOne(query);
	res.status(200).json({
		status: "success",
		...globalVariable.globalObject,
	});
});

module.exports.updateGlobalVariable = catchAsync(async (req, res, next) => {
	const query = {};
	query[`globalObject.${req.params.globalVariableName}`] = { $exists: true };
	await GlobalVariables.findOneAndUpdate(
		query,
		{ globalObject: req.body.updatedGlobalVariableObject },
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
	const facePriceObject = await GlobalVariables.findOne({
		"globalObject.facePrice": { $exists: true },
	});
	const shippingFeesObject = await GlobalVariables.findOne({
		"globalObject.shippingFees": { $exists: true },
	});
	return {
		...facePriceObject.globalObject,
		...shippingFeesObject.globalObject
	};
};
