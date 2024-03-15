const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const jwt = require("jsonwebtoken");

const userDataSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isEmailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  isPhoneNumberVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

userDataSchema.methods.generateVerificationToken = () => {
  const user = this;

  const emailVerificationToken = jwt.sign(
    { userId: user._id },
    process.env.EMAIL_VERIFICATION_TOKEN,
    { expiresIn: "3d" }
  );

  return emailVerificationToken;
};

const userDataModel = model("userData", userDataSchema);

module.exports = userDataModel;
