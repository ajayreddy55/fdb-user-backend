const userDataModel = require("../database-models/userData");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const nodemailer = require("nodemailer");
const { isValidPhoneNumber } = require("libphonenumber-js");

const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{6,12}$/;

  if (passwordRegex.test(password)) {
    return true;
  }

  return false;
};

const validatePhoneNumber = (number) => {
  const splitedNum = number.split("-");
  const joinedNum = splitedNum.join("");
  return isValidPhoneNumber(joinedNum);
};

const sendEmailToVerify = (verificationToken, email, name) => {
  const transporter = nodemailer.createTransport({
    service: "outlook",
    secure: false,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.USER_EMAIL}`,
    to: `${email}`,
    subject: "Regarding Your Mail Verification",
    text: email,
    html: `<p>Hi ${name}, Please Verify Your Mail</p><a href=${`http://localhost:3000/user-mail-verify/${verificationToken}`}>Click Here</a>`,
  };

  const messageRes = transporter.sendMail(message);
  return;
};

exports.signup = async (request, response) => {
  const { email, password, name, phoneNumber } = request.body;
  if (!email) {
    return response.status(422).json({ message: "Email is Empty" });
  }

  try {
    const isMailExists = await userDataModel.findOne({ email: email }).exec();
    const isPhoneNumberExists = await userDataModel.findOne({
      phoneNumber: phoneNumber,
    });

    if (isMailExists) {
      return response.status(400).json({ message: "Email Already Exists" });
    } else if (isPhoneNumberExists) {
      return response
        .status(400)
        .json({ message: "Phone Number Already Exists" });
    } else {
      if (validator.isEmail(email) && validatePhoneNumber(phoneNumber)) {
        const isPasswordValid = validatePassword(password);
        if (isPasswordValid) {
          const hashedPassword = await bcrypt.hash(password, 10);
          const userDetails = new userDataModel({
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            password: hashedPassword,
          });
          const isSaved = await userDetails.save();

          const verificationToken = userDetails.generateVerificationToken();

          sendEmailToVerify(verificationToken, email, name);
          return response
            .status(200)
            .json({ message: `Mail sent to ${email}, Please Verify` });
        } else {
          return response.status(400).json({
            message:
              "Password must contain at least one lowercase alphabet, uppercase alphabet, Numeric digit and special character, Length between 6 and 12",
          });
        }
      } else {
        return response.status(400).json({
          message: "Invalid Email or Phone Number",
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: error.message });
  }
};
