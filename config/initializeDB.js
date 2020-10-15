const GeneralProduct = require("../models/GeneralProductModel");
const GlobalVariables = require("../models/GlobalVariablesModel");
const Admin = require("../models/AdminModel");
const authenticationController = require("../controllers/authenticationController");

const generalProducts = require("../models/config/generalProducts");
const gobalVariables = require("../models/config/globalVariables");

const connectDB = require("./connectDB");
const disconnectDB = require("./disconnectDB");

const dotenv = require("dotenv");
dotenv.config({
	path: "./config.env",
});

const initializeDB = async () => {
	await connectDB();
	const globalVariablesCount = (await GlobalVariables.find()).length;
	if( globalVariablesCount <= 0)
	{
		console.log(`global variables count --> ${globalVariablesCount}✅`);
		await GlobalVariables.insertMany(gobalVariables.dbSeeds);
	}
	const generalProductsCount = (await GeneralProduct.find()).length
	if(generalProductsCount  <= 0)
	{
		console.log(`general products count --> ${generalProductsCount}✅✅`);
		await GeneralProduct.insertMany(generalProducts.dbSeeds);
	}

	const adminsCount = (await Admin.find()).length;
	if(adminsCount  <= 0)
	{
		console.log(`admins count --> ${adminsCount}✅✅✅`);
		await authenticationController.adminSignupService(process.env.ADMIN_DEFAULT_NAME, process.env.ADMIN_DEFAULT_EMAIL, process.env.ADMIN_DEFAULT_PASSWORD);
	}

	console.log("✅ Finished db seeding successfully");
	disconnectDB();
};
module.exports = initializeDB;

// initializeDB();
