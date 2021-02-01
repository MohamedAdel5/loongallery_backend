const GeneralProduct = require("../models/GeneralProductModel");
const GlobalVariables = require("../models/GlobalVariablesModel");
const Admin = require("../models/AdminModel");
const authenticationController = require("../controllers/authenticationController");

const generalProducts = require("../models/seeds/generalProductsSeeds");
const gobalVariables = require("../models/seeds/globalVariablesSeeds");

const logger = require("../utils/logger");


const initializeDB = async () => {
	logger.log('info', `⏳ Checking DB.`);
	const globalVariablesCount = (await GlobalVariables.find()).length;
	const generalProductsCount = (await GeneralProduct.find()).length;
	const adminsCount = (await Admin.find()).length;
	if(!(globalVariablesCount <= 0 || generalProductsCount  <= 0 || adminsCount  <= 0))
	{
		logger.log('info', `✅ DB is okay.`);
		return;
	}
	logger.log('info', `🏁 DB is not initialized. Started db seeding...`);

	if( globalVariablesCount <= 0)
	{
		logger.log('info', `✅ Global variables are seeded --> count = ${globalVariablesCount}`);
		await GlobalVariables.insertMany(gobalVariables.dbSeeds);
	}
	if(generalProductsCount  <= 0)
	{
		logger.log('info', `✅ General products are seeded --> count = ${generalProductsCount}`);
		await GeneralProduct.insertMany(generalProducts.dbSeeds);
	}

	if(adminsCount  <= 0)
	{
		logger.log('info', `✅ Admins are seeded --> count = ${adminsCount}`);
		await authenticationController.adminSignupService(process.env.ADMIN_DEFAULT_NAME, process.env.ADMIN_DEFAULT_EMAIL, process.env.ADMIN_DEFAULT_PASSWORD);
	}

	logger.log('info', `✅ Finished db seeding successfully`);
};
module.exports = initializeDB;

