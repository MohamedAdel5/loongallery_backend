const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const Product = require("../models/ProductModel");
const DbQueryManager = require("../utils/dbQueryManager");
const uploadAWSImage = require('../utils/uploadAwsImage');

module.exports.addProduct = catchAsync(async (req, res, next) => {
	req.body.dateOfRelease = new Date();
	if(!Array.isArray(req.body.productCategories) && typeof req.body.productCategories === "string")
		req.body.productCategories = [req.body.productCategories];

	const newProduct = await Product.create(req.body);
	if(!newProduct) throw new AppError('There was a problem in making your product', 500);

	if (!req.files.image || !req.files.image.data) throw new AppError('Invalid file uploaded', 400);

	const image = await uploadAWSImage(
    req.files.image.data,
    'products',
    `${newProduct._id}`,
	);
	if (!image){
		await Product.findByIdAndDelete(newProduct._id);
		throw new AppError( 'There was a problem uploading the image to the server', 500);
	}

	newProduct.image = image;
	await newProduct.save();
	res.status(200).json({
		status: "success",
		product: newProduct,
	});
});

module.exports.getProduct = catchAsync(async (req, res, next) => {
	const product = await Product.findOne({ _id: req.params.id });
	res.status(200).json({
		status: "success",
		product: product,
	});
});

module.exports.getProducts = catchAsync(async (req, res, next) => {
	const productsQueryManager = new DbQueryManager(Product.find());

	const products = await productsQueryManager.all(req.query);

	const totalSize = await productsQueryManager.totalCount(req.query, Product, {
		availableForSale: { $ne: false },
	});

	res.status(200).json({
		status: "success",
		size: products.length,
		totalSize,
		products,
	});
});

module.exports.updateProduct = catchAsync(async (req, res, next) => {

	if(req.files && req.files.image && req.files.image.data){
		const image = await uploadAWSImage(
			req.files.image.data,
			'products',
			`${req.params.id}`,
		);
		if (!image) throw new AppError( 'There was a problem uploading the image to the server', 500);
		else req.body.image = image;
	}
	if(req.body.productCategories && !Array.isArray(req.body.productCategories) && typeof req.body.productCategories === "string")
		req.body.productCategories = [req.body.productCategories];
	
	const updatedProduct = await Product.findOneAndUpdate(
		{ _id: req.params.id },
		{ $set: { ...req.body } },
		{ new: true, runValidators: true }
	);
	res.status(200).json({
		status: "success",
		product: updatedProduct,
	});
});

module.exports.deleteProduct = catchAsync(async (req, res, next) => {
	const deletedProduct = await Product.findOneAndUpdate(
		{ _id: req.params.id },
		{ $set: { availableForSale: false } },
		{ new: true, runValidators: true }
	);
	res.status(200).json({
		status: "success",
		message: "Deleted successfully",
	});
});


module.exports.uploadProductImage = catchAsync(async (req, res, next) => {
	if (!req.files.image.data) throw new AppError('Invalid file uploaded', 400);

	const image = await uploadAWSImage(
    req.files.image.data,
    'products',
    product._id,
  );
  if (!image) throw new AppError( 'There was a problem uploading the images to the server', 500);
	res.status(200).json({
		status: 'success',
    message: 'Image Uploaded successfully'
	});
});
