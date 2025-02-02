const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const Product = require("../models/ProductModel");
const DbQueryManager = require("../utils/dbQueryManager");
const uploadAwsImage = require('../utils/uploadAwsImage');

module.exports.addProduct = catchAsync(async (req, res, next) => {
	req.body.dateOfRelease = new Date();
	// if(!Array.isArray(req.body.productCategories) && typeof req.body.productCategories === "string")
	// 	req.body.productCategories = [req.body.productCategories];

	let newProduct = await Product.create(req.body);
	if(!newProduct) throw new AppError('There was a problem in making your product', 500);

	if (!req.files.image || !req.files.image.data) throw new AppError('Invalid file uploaded', 400);

	const image = await uploadAwsImage(
		req.files.image.data,
    req.files.image.mimetype,
    'products',
    `${newProduct._id}`,
	);
	if (!image){
		await Product.findByIdAndDelete(newProduct._id);
		throw new AppError('There was a problem uploading the image to the server', 500);
	}

	newProduct.image = image;
	newProduct = await newProduct.save();
	newProduct = await newProduct.populate({ path: 'generalProduct', select: 'productName productName_Ar' }).execPopulate();
	res.status(200).json({
		status: "success",
		product: newProduct,
	});
});

module.exports.getProduct = catchAsync(async (req, res, next) => {
	const product = await Product.findOne({ _id: req.params.id }).populate({ path: 'generalProduct', select: 'productName productName_Ar' });
	res.status(200).json({
		status: "success",
		product: product,
	});
});

module.exports.getProducts = catchAsync(async (req, res, next) => {
	// if(req.query_whitelist && Object.keys(req.query_whitelist).length > 0)
	// {
	// 	req.query['generalProduct.productName'] = req.query_whitelist['generalProduct.productName'];
	// }
	const productsQueryManager = new DbQueryManager(Product.find().populate({ path: 'generalProduct', select: 'productName productName_Ar' }));

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
		const image = await uploadAwsImage(
			req.files.image.data,
			req.files.image.mimetype,
			'products',
			`${req.params.id}`,
		);
		if (!image) throw new AppError( 'There was a problem uploading the image to the server', 500);
		else req.body.image = image;
	}
	// if(req.body.productCategories && !Array.isArray(req.body.productCategories) && typeof req.body.productCategories === "string")
	// 	req.body.productCategories = [req.body.productCategories];
	
	const updatedProduct = await Product.findOneAndUpdate(
		{ _id: req.params.id },
		{ $set: { ...req.body } },
		{ new: true, runValidators: true }
	).populate({ path: 'generalProduct', select: 'productName productName_Ar' });
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

	const image = await uploadAwsImage(
		req.files.image.data,
    req.files.image.mimetype,
    'products',
    product._id,
  );
  if (!image) throw new AppError( 'There was a problem uploading the images to the server', 500);
	res.status(200).json({
		status: 'success',
    message: 'Image Uploaded successfully'
	});
});
