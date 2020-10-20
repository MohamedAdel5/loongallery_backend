const express = require("express");
const authenticationController = require("./../controllers/authenticationController");
// const backup = require('mongodb-backup');
const exec = require("child_process").exec;
const fs = require("fs");

const catchAsync = require('../utils/catchAsync');

const router = express.Router();

router.get("/", authenticationController.protect(), authenticationController.restrictTo("Admin"), catchAsync(async(req,res,next)=>{


	if (!fs.existsSync("./databaseBackups")){
		fs.mkdirSync("./databaseBackups");
	}
	//For restore `mongorestore --uri "${process.env.DATABASE}" --gzip --archive="./databaseBackups/backup-${Date.now()}.archive"`
	const filePath = `./databaseBackups/backup-${Date.now()}.archive`;
	exec(`mongodump --uri "${process.env.DATABASE}" --gzip --archive="${filePath}"`, function (error, stdout, stderr) {
		if(error) {	
			res.status(500).json({
				status: "fail",
				message: "Sorry, Backup failed."
			});
			return;
		}

		try{
			// const readStream = fs.createReadStream(filePath);
			// readStream.pipe(res);
			// readStream.on('error', (err)=>{
			// 	throw new Error("fail");
			// });
			// res.on('error', (err) => {
			// 	throw new Error("fail");
			// });
			res.download(`${filePath}`);
		}
		catch(err){
			res.status(500).json({
				status: "fail",
				message: "Sorry, Backup failed."
			});
		}
});
}));


module.exports = router;
