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
		req.params.globalVariableName = "announcement";
		next();
	},globalVariablesController.getGlobalVariable)
	.delete(authenticationController.protect(),
	authenticationController.restrictTo("Admin"),
	catchAsync(async (req,res,next)=> {
		const currentAnnouncement = await globalVariablesController.getGlobalVariableService("announcement");
		if(currentAnnouncement){
			await deleteAwsImage(currentAnnouncement.globalObject.announcement.image);
			await globalVariablesController.deleteGlobalVariableService("announcement");
		}

		res.status(200).json({
			status: "success",
			message: "Announcement is deleted successfully."
		});
	}))
	.post(
		authenticationController.protect(),
		authenticationController.restrictTo("Admin"),
		fileUpload(),
		catchAsync(async (req,res,next)=> {
			if(!req.files || !req.files['announcementImage']) throw new AppError("There is no image file for the announcement found in your request.", 400);

			const image = req.files['announcementImage'];
			const id = `${Math.floor(Math.random() * 100000)}-${Date.now()}`;

			const imageUrl = await uploadAwsImage(
				image.data,
				image.mimetype,
				'announcements',
				id
			);
			if (!imageUrl) throw new AppError( 'There was a problem uploading the image to the server', 500);
			const newAnnouncement = {
				globalObject: {
					announcement: {
						image: imageUrl,
						text: req.body.announcementText ? req.body.announcementText: '',
						enabled: true
					}
				}
			}
			const currentAnnouncement = await globalVariablesController.getGlobalVariableService("announcement");
			if(!currentAnnouncement){
				await globalVariablesController.addGlobalVariableService(newAnnouncement)
			}
			else{
				await deleteAwsImage(currentAnnouncement.globalObject.announcement.image);
				await globalVariablesController.updateGlobalVariableService("announcement", newAnnouncement.globalObject);
			}
			res.status(200).json({
				status: "success",
				message: "Announcement updated successfully"
			})
		})
	);

module.exports = router;
