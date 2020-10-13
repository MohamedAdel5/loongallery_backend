const mongoose = require("mongoose");

const updateObjectSchema = new mongoose.Schema(
	{
		objectBeforeUpdate: {
			type: Object,
			required: [true, "Object before update must be specified."],
		},
		updateDate: {
			type: Date,
			required: [true, "Update date must be specified."],
		},
	},
	{
		strict: "throw",
		_id: false
	}
);
module.exports = updateObjectSchema;
