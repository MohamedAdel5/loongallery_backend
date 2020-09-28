const mongoose = require("mongoose");

const disconnectDB = async () => {
	try {
		await mongoose.disconnect();
		console.log("✅ database disconnected successfully.");
	} catch (err) {
		console.log("❌ Failed during disconnecting database");
	}
};

module.exports = disconnectDB;
