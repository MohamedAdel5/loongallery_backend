const express = require("express");
const authenticationController = require("./../controllers/authenticationController");
const databaseBackupController = require("./../controllers/databaseBackupController");


const router = express.Router();

router.get("/", authenticationController.protect(), authenticationController.restrictTo("Admin"), databaseBackupController.databaseBackup);


module.exports = router;
