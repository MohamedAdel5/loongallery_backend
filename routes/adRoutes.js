const express = require("express");
const fileUpload = require("express-fileupload");

const globalVariablesController = require("./../controllers/globalVariablesController");
const authenticationController = require("./../controllers/authenticationController");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const uploadAwsImage = require("../utils/uploadAwsImage");
const deleteAwsImage = require("../utils/deleteAwsImage");


const router = express.Router();

router
	.route("/")
	.get((req,res,next)=> {
		req.params.globalVariableName = "ad";
		next();
	},globalVariablesController.getGlobalVariable)
	.delete(authenticationController.protect(),
	authenticationController.restrictTo("Admin"),
	catchAsync(async (req,res,next)=> {
		const currentAd = await globalVariablesController.getGlobalVariableService("ad");
		if(currentAd){
			await deleteAwsImage(currentAd.globalObject.ad.image);
			await globalVariablesController.deleteGlobalVariableService("ad");
		}

		res.status(200).json({
			status: "success",
			message: "Ad is deleted successfully."
		});
	}))
	.post(
		authenticationController.protect(),
		authenticationController.restrictTo("Admin"),
		fileUpload(),
		catchAsync(async (req,res,next)=> {
			if(!req.files || !req.files['adImage']) throw new AppError("There is no image file for the ad found in your request.", 400);

			const image = req.files['adImage'];
			const id = `${Math.floor(Math.random() * 100000)}-${Date.now()}`;

			const imageUrl = await uploadAwsImage(
				image.data,
				image.mimetype,
				'ads',
				id
			);
			if (!imageUrl) throw new AppError( 'There was a problem uploading the image to the server', 500);
			const newAd = {
				globalObject: {
					ad: {
						image: imageUrl,
						text: req.body.adText ? req.body.adText: '',
						enabled: true
					}
				}
			}
			const currentAd = await globalVariablesController.getGlobalVariableService("ad");
			if(!currentAd){
				await globalVariablesController.addGlobalVariableService(newAd)
			}
			else{
				await deleteAwsImage(currentAd.globalObject.ad.image);
				await globalVariablesController.updateGlobalVariableService("ad", newAd.globalObject);
			}
			res.status(200).json({
				status: "success",
				message: "Ad updated successfully"
			})
		})
	);

module.exports = router;
