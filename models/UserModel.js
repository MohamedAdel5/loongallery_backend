const mongoose = require("mongoose");
const validator = require("validator");
const AppError = require("../utils/appError");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, "Name must be specified."],
			validate: [
				{
					validator: function (v) {
						return /^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF- ]*$|^[a-zA-Z]+[a-zA-Z-' ]*$/.test(
							v
						);
					},
					message:
						"Name must use only English or Arabic letters and special characters(space, ',  -)",
				},
				{
					validator: function (v) {
						return (v && v.length) <= 50;
					},
					message: "Name must not exceed 50 characters",
				},
			],
		},
		phoneNumbers: {
			type: [String],
			required: [true, "Phone numbers array must be specified."],
			validate: [
				{
					validator: (v) => new Set(v).size === v.length,
					message: `Phone numbers must not contain duplicates`,
				},
				{
					validator: (v) => v.every((val) => /^(01)[0-9]{9}$/.test(val)),
					message: `Phone numbers are in the wrong format`,
				},
			],
		},
		addresses: {
			type: [String],
			required: [true, "Addresses array must be specified."],
		},
		email: {
			type: String,
			unique: true,
			trim: true,
			required: [true, "Email is required."],
			validate: [validator.isEmail, "Email is invalid."],
		},
		passwordHash: {
			type: String,
			required: [true, "Password hash is required."],
		},
		passwordSalt: {
			type: String,
			required: [true, "Password salt is required."],
		},
		passwordLastChangedAt: {
			type: Date,
			default: Date.now(),
		},
		passwordResetToken: {
			type: String,
			default: null,
		},
		passwordResetExpiresAt: {
			type: Date,
			default: null,
		},
		emailConfirmationToken: {
			type: String,
			default: null,
		},
		created_at: {
			type: Date,
			default: Date.now(),
		},
		active: {
			// The user's account is active --> not deleted
			type: Boolean,
			default: true,
		},
	},
	{
		strict: "throw",
	}
);

userSchema.statics.validatePassword = (password) => {
	if (!password) throw new AppError("Password must be specifed.", 400);
	if (typeof password !== "string") throw new AppError("Password must be string.", 400);
	if (password.length < 8 || password.length > 50)
		throw new AppError("Password must be 8-50 characters.", 400);
	return true;
};
//Returns a select options object for private user
userSchema.statics.privateUser = () => {
	return {
		__v: 0,
	};
};

//Returns a select options object for public user
userSchema.statics.publicUser = () => {
	return {
		passwordHash: 0,
		passwordSalt: 0,
		passwordLastChangedAt: 0,
		passwordResetToken: 0,
		passwordResetExpiresAt: 0,
		emailConfirmationToken: 0,
		created_at: 0,
		active: 0,
		__v: 0,
	};
};

//Returns an object contains the public user info.
userSchema.methods.toPublic = function () {
	const publicUser = this.toObject({
		virtuals: true,
	});
	const fieldsToExclude = userSchema.statics.publicUser();

	Object.keys(publicUser).forEach((el) => {
		if (fieldsToExclude[el] === 0) {
			delete publicUser[el];
		}
	});
	return publicUser;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
