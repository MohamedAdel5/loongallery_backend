const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const exec = require("child_process").exec;
const fs = require("fs");
const logger = require("../utils/logger");

// const backup = require('mongodb-backup');


module.exports.databaseBackup = catchAsync(async(req,res,next)=>{

	if (!fs.existsSync("./databaseBackups")){
		fs.mkdirSync("./databaseBackups");
	}
	//For restore `mongorestore --uri "${process.env.DATABASE}" --gzip --archive="./databaseBackups/backup-${Date.now()}.archive"`
	const fileName = `backup-${Date.now()}.archive`;
	const filePath = `./databaseBackups/${fileName}`;
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
			res.download(`${filePath}`, ()=>{
				try {
					fs.unlinkSync(filePath)
					//file removed
				} catch(err) {
					logger.log('error', `Couldn't delete the backup file and the resulted error is ${err}`);
				}
			});
		}
		catch(err){
			res.status(500).json({
				status: "fail",
				message: "Sorry, Backup failed."
			});
		}
	});

});