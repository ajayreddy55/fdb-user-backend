const express = require("express");
const mongoose = require("mongoose");
const { signup } = require("../controller/controller");

const router = express.Router();

router.post("/register-user", signup);

module.exports = router;
