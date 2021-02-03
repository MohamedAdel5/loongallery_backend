const express = require("express");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/UserModel");

const authenticationController = require("./../controllers/authenticationController");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


const router = express.Router();

router.post("/broadcast",
		authenticationController.protect(),
		authenticationController.restrictTo( "Admin"),
		catchAsync(async (req,res,next)=> {
			if(!req.body.emailContent || !req.body.emailSubject) throw new AppError("There is no email text found in your request.", 400);
			const emailsArray = (await User.find({}, {email: 1, _id:0}).lean({virtuals:false})).map(obj=> obj.email);
			try {
				await sendEmail({
					email: "mouhammedadel1999@gmail.com",
					subject: req.body.emailSubject,
					message: req.body.emailContent
				});
			} catch (err) {
				throw new AppError(
					`There was an error sending the emails. Try again later.`,
					500
				);
			}

			res.status(200).json({
				status: "success",
				message: "Mails are sent successfully."
			});
		})
	);

module.exports = router;
