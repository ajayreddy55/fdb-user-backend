const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const csrfDataSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  expiryTime: {
    type: Date,
    expires: "2h",
    default: Date.now,
  },
});

const csrfDataModel = model("csrfData", csrfDataSchema);

module.exports = csrfDataModel;
