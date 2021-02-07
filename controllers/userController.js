const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const DbQueryManager = require("../utils/dbQueryManager");

const User = require("../models/UserModel");
const Order = require("../models/OrderModel");

module.exports.me = catchAsync(async (req, res, next) => {
	res.status(200).json({ status: "success", user: req.user.toPublic() });
});

module.exports.changeAddresses = catchAsync(async (req, res, next) => {
	await User.updateOne(
		{ _id: req.user._id },
		{ $set: { addresses: req.body.addresses } },
		{ runValidators: true }
	);
	res.status(200).json({ status: "success", message: "Updated successfully." });
});

module.exports.changePhoneNumbers = catchAsync(async (req, res, next) => {
	await User.updateOne(
		{ _id: req.user._id },
		{ $set: { phoneNumbers: req.body.phoneNumbers } },
		{ new: true }
	);
	res.status(200).json({ status: "success", message: "Updated successfully." });
});

module.exports.myOrders = catchAsync(async (req, res, next) => {
	const ordersQueryManager = new DbQueryManager(Order.find({ userID: req.user._id }));
	const myOrders = await ordersQueryManager.all(req.query);
	const totalSize = await ordersQueryManager.totalCount(req.query, Order, {
		userID: req.user._id,
		deleted: { $ne: false },
	});

	const totalUnseen = await ordersQueryManager.totalCount(req.query, Order, {
		userID: req.user._id,
		deleted: { $ne: false },
		seen: false
	});

	const totalUndelivered = await ordersQueryManager.totalCount(req.query, Order, {
		userID: req.user._id,
		deleted: { $ne: false },
		delivered: {$ne: "delivered"}
	});
	res.status(200).json({ 
		status: "success",
		size: myOrders.length,
		totalSize,
		totalUnseen,
		totalUndelivered,
		orders: myOrders });
});

module.exports.getUserOrders = catchAsync(async (req, res, next) => {
	const ordersQueryManager = new DbQueryManager(Order.find({ userID: req.params.id }));
	const userOrders = await ordersQueryManager.all(req.query);

	const totalSize = await ordersQueryManager.totalCount(req.query, Order, {
		userID: req.params.id,
		deleted: { $ne: false },
	});

	const totalUnseen = await ordersQueryManager.totalCount(req.query, Order, {
		userID: req.params.id,
		deleted: { $ne: false },
		seen: false
	});

	const totalUndelivered = await ordersQueryManager.totalCount(req.query, Order, {
		userID: req.params.id,
		deleted: { $ne: false },
		delivered: {$ne: "delivered"}
	});
	res.status(200).json({ 
		status: "success",
		size: userOrders.length,
		totalSize,
		totalUnseen,
		totalUndelivered,
		orders: userOrders });
});
