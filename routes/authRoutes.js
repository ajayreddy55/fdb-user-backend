const express = require("express");
const mongoose = require("mongoose");
const { signup, userSignupMailVerify } = require("../controller/controller");

const router = express.Router();

router.post("/register-user", signup);

router.post("/verify-user-email", userSignupMailVerify);

module.exports = router;
