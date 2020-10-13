const express = require("express");
const authenticationController = require("./../controllers/authenticationController");
// const backup = require('mongodb-backup');
const exec = require("child_process").exec;
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

router.get("/", authenticationController.protect(), authenticationController.restrictTo("Admin"), catchAsync(async(req,res,next)=>{

	// backup({
	// 	uri: process.env.DATABASE,
	// 	root: `${__dirname}`,
	// 	tar: 'test.tar',
	// 	callback: function(err) {
	// 		if (err) {
	// 			console.error(err);
	// 		} else {
	// 			console.log('finish');
	// 		}
	// 	}
	// });
	exec(`mongodump --uri "${process.env.DATABASE}" --out "./databaseBackups/backup-${Date.now()}"`, function (error, stdout, stderr) {
		if (!error) {
			res.status(200).json({
				status: "success",
				message: "Backup completed successfully."
			});	
		}
		else{
			res.status(500).json({
				status: "fail",
				message: "Sorry, Backup failed."
			});	
		}
});
}));


module.exports = router;
