//Include modules:-
//-----------------------------------------------------------------
const dotenv = require("dotenv");
const connectDB = require("./utils/connectDB");

//Read config file
//-----------------------------------------------------------------
dotenv.config({
	path: "./config.env",
});

//Handle unhandled errors:-
//-----------------------------------------------------------------
process.on("unhandledRejection", (err) => {
	console.log(` An unhandled rejection is thrown but caught by process.on('unhandledRejection') `);
	console.log(err);
	server.close(() => {
		process.exit(1);
	});
});

process.on("uncaughtException", (err) => {
	console.log(` An uncaught exception is thrown but caught by process.on('uncaughtException') `);
	console.log(err);
	server.close(() => {
		process.exit(1);
	});
});

process.on("warning", (e) => {
	console.log(` A warning is thrown but caught by process.on('warn') `);
	console.warn(e.stack);
});

process.on("SIGTERM", () => {
	console.log(` SIGTERM caught by process.on('SIGTERM') `);

	server.close(() => {
		process.exit(0);
	});
});

//Main
//-----------------------------------------------------------------
(async () => {
	await connectDB();
	const app = require("./app");
	const port = process.env.PORT || 3000;

	const server = app.listen(port, () => {
		console.log(`App is running now on port ${port}...`);
	});
})();
