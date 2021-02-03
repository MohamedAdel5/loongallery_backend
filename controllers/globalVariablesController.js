const catchAsync = require("../utils/catchAsync");
const GlobalVariables = require("../models/GlobalVariablesModel");
const AppError = require("../utils/appError");


const addGlobalVariableService = async (globalVariableObject) => {
	await GlobalVariables.create(globalVariableObject);
};
module.exports.addGlobalVariableService = addGlobalVariableService;

const updateGlobalVariableService = async (globalVariableName, updatedGlobalVariableObject) => {
	const query = {};
	query[`globalObject.${globalVariableName}`] = { $exists: true };
	await GlobalVariables.findOneAndUpdate(
		query,
		{ globalObject: updatedGlobalVariableObject },
		{
			runValidators: true,
		}
	);
};
module.exports.updateGlobalVariableService = updateGlobalVariableService;

const deleteGlobalVariableService = async (globalVariableName) => {
	const query = {};
	query[`globalObject.${globalVariableName}`] = { $exists: true };
	await GlobalVariables.findOneAndDelete(query);
};
module.exports.deleteGlobalVariableService = deleteGlobalVariableService;

const getGlobalVariableService = async (globalVariableName) => {
	const query = {};
	query[`globalObject.${globalVariableName}`] = { $exists: true };
	return await GlobalVariables.findOne(query);
};
module.exports.getGlobalVariableService = getGlobalVariableService;






module.exports.getAllGlobalVariables = catchAsync(async (req, res, next) => {
	const globalVariables = await GlobalVariables.find();
	res.status(200).json({
		status: "success",
		globalVariables,
	});
});

module.exports.getGlobalVariable = catchAsync(async (req, res, next) => {
	const globalVariable = await getGlobalVariableService(req.params.globalVariableName);
	if(!globalVariable) throw new AppError("There is no global variable with this name", 400);
	res.status(200).json({
		status: "success",
		...globalVariable.globalObject,
	});
});

module.exports.updateGlobalVariable = catchAsync(async (req, res, next) => {

	await updateGlobalVariableService(req.params.globalVariableName, req.body.updatedGlobalVariableObject);
	res.status(200).json({
		status: "success",
		message: "Updated successfully.",
	});
});

module.exports.initializeGlobalVariables = async () => {
	const facePriceObject = await GlobalVariables.findOne({
		"globalObject.facePrice": { $exists: true },
	});
	const giftBowPriceObject = await GlobalVariables.findOne({
		"globalObject.giftBowPrice": { $exists: true },
	});
	const giftWrapPriceObject = await GlobalVariables.findOne({
		"globalObject.giftWrapPrice": { $exists: true },
	});
	const shippingFeesObject = await GlobalVariables.findOne({
		"globalObject.shippingFees": { $exists: true },
	});
	
	return {
		...facePriceObject.globalObject,
		...giftBowPriceObject.globalObject,
		...giftWrapPriceObject.globalObject,
		...shippingFeesObject.globalObject
	};
};
