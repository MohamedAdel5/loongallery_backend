const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const Order = require("../models/OrderModel");
const DbQueryManager = require("../utils/dbQueryManager");
const getQueryStringFilterFields = require("./../utils/getQueryStringFilterFields");
const uploadAWSImage = require("../utils/uploadAwsImage");

module.exports.addOrder = catchAsync(async (req, res, next) => {

		//If the user is logged in, the ids must match
	if (req.user && !req.user._id.equals(req.body.userID))
		throw new AppError("Unauthorized", 401);
	if(!req.body.body)throw new AppError("Body prop must be specified in request body.", 401);


	const order = JSON.parse(req.body.body);

	//Upload images to aws s3
	if(req.files){
		for(let i = 0; i < Object.keys(req.files).length; i++){
			const imageName = Object.keys(req.files)[i];
			const productIndex = Number(imageName.split('_')[1]);
			const image = req.files[imageName];
			const imageUrl = await uploadAWSImage(
				image.data,
				'custom-orders',
			);
			if (!imageUrl) throw new AppError( 'There was a problem uploading the image to the server', 500);
			else order.products[productIndex].image = imageUrl;
		}
	}

	order.date = new Date();
	if(order.shippingMethod) //Else will be caught by model validation
		order.shippingFees = SHIPPING_FEES[order.shippingMethod];
	order.code = (await Order.estimatedDocumentCount()) + 1;
	const newOrder = await Order.create(order);
	res.status(200).json({
		status: "success",
		order: newOrder.toPublic(),
	});
});

module.exports.getOrder = catchAsync(async (req, res, next) => {
	const order = await Order.findOne({ _id: req.params.id });
	res.status(200).json({
		status: "success",
		order: order.toPublic(),
	});
});

module.exports.getOrders = catchAsync(async (req, res, next) => {
	const ordersQueryManager = new DbQueryManager(Order.find().select(Order.publicOrder()));

	const orders = await ordersQueryManager.all(req.query);

	const totalSize = await ordersQueryManager.totalCount(req.query, Order, {
		deleted: { $ne: false },
	});

	const totalUnseen = await ordersQueryManager.totalCount(req.query, Order, {
		deleted: { $ne: false },
		seen: false
	});

	const totalUndelivered = await ordersQueryManager.totalCount(req.query, Order, {
		deleted: { $ne: false },
		delivered: false
	});

	res.status(200).json({
		status: "success",
		size: orders.length,
		totalSize,
		totalUnseen,
		totalUndelivered,
		orders,
	});
});

module.exports.deleteOrder = catchAsync(async (req, res, next) => {
	await Order.findOneAndUpdate({ _id: req.params.id }, { deleted: true });
	res.status(200).json({
		status: "success",
		message: "Deleted successfully",
	});
});

module.exports.setSeenStatus = catchAsync(async (req, res, next) => {
	await Order.findOneAndUpdate({ _id: req.params.id }, { seen: true });
	res.status(200).json({
		status: "success",
		message: "Seen status set successfully",
	});
});

module.exports.setDeliveredStatus = catchAsync(async (req, res, next) => {
	await Order.findOneAndUpdate({ _id: req.params.id }, { delivered: true });
	res.status(200).json({
		status: "success",
		message: "Delivered status set successfully",
	});
});
