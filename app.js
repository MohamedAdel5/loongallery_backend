//Include modules:-
//-----------------------------------------------------------------
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const errorController = require("./controllers/errorController");

//Globals:-
//-----------------------------------------------------------------
const app = express();

//Middlewares:-
//-----------------------------------------------------------------
//Limit requests ( 1] max: limits 1000 requests for each IP in one hour. | 2] windowMs: If the IP exceeds this limit then it would have to wait for an hour to pass. )
const limiter = rateLimit({
	max: 1000,
	windowMs: 60 * 60 * 1000,
	message: {
		status: "fail",
		message: "Too many requests from this IP. please try again in an hour.",
	},
});
app.use("/api", limiter);

//Adds security headers (Should be put at the top of the middleware stack)
app.use(helmet());

// Prevent parameter pollution (prevents duplicate query string parameters & duplicate keys in urlencoded body requests)
// Add a second HPP middleware to apply the whitelist only to this route. e.g: app.use('/search', hpp({ whitelist: [ 'filter' ] }));
app.use(hpp());

//Middleware for debugging [Displays each incoming request in the console]
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

//Reading data from the body of the request as json and converting it to javascript object into req.body
app.use(express.json({ limit: "10kb" }));

//Second: Data sanitization against NoSQL injection attacks.
app.use(mongoSanitize());

//Third: Data sanitization against XSS(cross-site scripting) attacks.
app.use(xss());

module.exports = app;
