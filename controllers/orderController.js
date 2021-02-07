const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const Order = require("../models/OrderModel");
const DbQueryManager = require("../utils/dbQueryManager");
const getQueryStringFilterFields = require("./../utils/getQueryStringFilterFields");
const uploadAwsImage = require("../utils/uploadAwsImage");

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
			const id = `${Math.floor(Math.random() * 100000)}-${Date.now()}-${productIndex}`;
			const imageUrl = await uploadAwsImage(
				image.data,
				image.mimetype,
				'custom-orders',
				id

			);
			if (!imageUrl) throw new AppError( 'There was a problem uploading the image to the server', 500);
			else order.products[productIndex].image = imageUrl;
		}
	}

	order.date = new Date();
	if(order.shippingMethod || order.shippingMethod === 0) //Else will be caught by model validation
		order.shippingFees = SHIPPING_FEES[order.shippingMethod].fees;
	order.code = (await Order.estimatedDocumentCount()) + 1;
	order.deliveredStatus = "undelivered";
	const newOrder = await (await Order.create(order)).populate({ path: 'products.generalProduct', select: 'productName productName_Ar' }).execPopulate();
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
		deliveredStatus: "undelivered"
	});

	const totalInTransit = await ordersQueryManager.totalCount(req.query, Order, {
		deleted: { $ne: false },
		deliveredStatus: "in transit"
	});

	const totalRejected = await ordersQueryManager.totalCount(req.query, Order, {
		deleted: { $ne: false },
		deliveredStatus: "rejected"
	});

	res.status(200).json({
		status: "success",
		size: orders.length,
		totalSize,
		totalUnseen,
		totalUndelivered,
		totalInTransit,
		totalRejected,
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
	await Order.findOneAndUpdate({ _id: req.params.id }, { deliveredStatus: req.query.status });
	res.status(200).json({
		status: "success",
		message: "Delivered status set successfully",
	});
});

module.exports.setDesignerDoneStatus = catchAsync(async (req, res, next) => {
	await Order.findOneAndUpdate({ _id: req.params.id }, { designerDone: true });
	res.status(200).json({
		status: "success",
		message: "Designer done status set successfully",
	});
});

