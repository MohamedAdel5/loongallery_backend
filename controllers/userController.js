const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/UserModel");
const Order = require("../models/OrderModel");

module.exports.me = catchAsync(async (req, res, next) => {
	res.status(200).json({ success: true, user: req.user.toPublic() });
});

module.exports.changeAddresses = catchAsync(async (req, res, next) => {
	await User.updateOne({ _id: req.user._id }, { $set: { addresses: req.body.addresses } });
	res.status(200).json({ success: true, user: req.user.toPublic() });
});

module.exports.changePhoneNumbers = catchAsync(async (req, res, next) => {
	await User.updateOne({ _id: req.user._id }, { $set: { phoneNumbers: req.body.phoneNumbers } });
	res.status(200).json({ success: true, user: req.user.toPublic() });
});

module.exports.myOrders = catchAsync(async (req, res, next) => {
	const myOrders = await Order.find({ userID: req.user._id });
	res.status(200).json({ success: true, orders: myOrders });
});
