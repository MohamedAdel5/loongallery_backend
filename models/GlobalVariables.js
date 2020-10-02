const mongoose = require("mongoose");

const globalVariablesSchema = new mongoose.Schema(
	{
		globalObject: {
			type: Object,
		},
	},
	{
		strict: "throw",
	}
);

const GlobalVariables = mongoose.model("GlobalVariables", globalVariablesSchema);
module.exports = GlobalVariables;
