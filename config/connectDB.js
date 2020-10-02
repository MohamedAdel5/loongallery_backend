/* istanbul ignore file */
const mongoose = require("mongoose");

// configuring .env

const connectDB = async () => {
	const DB = process.env.DATABASE;
	if (process.env.NODE_ENV === "development") console.log(`database string: ${DB}`);
	try {
		await mongoose.connect(DB, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		});
		console.log("✅ database connected successfully");
	} catch (err) {
		console.log(`❌ Error connecting to database     ${err.toString()}`);
		process.exit(1);
	}
};

module.exports = connectDB;
