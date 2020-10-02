const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const generatePasswordHashAndSalt = require("../utils/generatePasswordHashAndSalt");
const verifyPassword = require("../utils/verifyPassword");
const signJwt = require("../utils/signJwt");
const User = require("../models/UserModel");
const passport = require("passport");

module.exports.login = catchAsync(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	console.log(user);
	if (!user) {
		//Invalid email
		throw new AppError("Invalid email or password", 401);
	}

	const isValid = verifyPassword(req.body.password, user.passwordHash, user.passwordSalt);
	if (!isValid) {
		//Invalid password
		throw new AppError("Invalid email or password", 401);
	}

	//Valid email & pass
	const tokenObject = signJwt(user._id);
	const publicUser = user.toPublic();
	res.status(200).json({
		success: true,
		token: tokenObject.token,
		expiresIn: tokenObject.expires,
		user: publicUser,
	});
});

module.exports.signup = catchAsync(async (req, res, next) => {
	const { name, phoneNumbers, addresses, email, password } = req.body;

	User.validatePassword(password); //If there is an error it would be caught by catchAsync.
	const passwordObject = generatePasswordHashAndSalt(password);
	const passwordSalt = passwordObject.salt;
	const passwordHash = passwordObject.hash;

	let newUser = new User({
		name,
		phoneNumbers,
		addresses,
		email,
		passwordHash,
		passwordSalt,
	});

	newUser = await newUser.save(); //If there is an error it would be caught by catchAsync.

	const tokenObject = signJwt(newUser._id);
	const publicUser = newUser.toPublic();
	res.status(200).json({
		success: true,
		token: tokenObject.token,
		expiresIn: tokenObject.expires,
		user: publicUser,
	});
});

module.exports.protect = () => {
	return passport.authenticate("jwt", { session: false });
};
