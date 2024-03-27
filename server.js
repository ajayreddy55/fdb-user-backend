const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

const csrfDataModel = require("./database-models/csrfData");

const app = express();
app.use(express.json());
app.use(cors());
require("dotenv").config({ path: "./.env" });
app.use(helmet());
app.use(cookieParser());

const port = 5020 || process.env.PORT;

mongoose
  .connect(process.env.MONGO_CONNECTION_URL)
  .then(() => console.log("Db Connected"))
  .catch((error) => console.log(error.message));

app.use("/auth", require("./routes/authRoutes"));

// const generateCsrfToken = () => {
//   return crypto.randomBytes(32).toString("hex");
// };

// app.get("/fdb-csrf-token", async (request, response) => {
//   const csrfToken = generateCsrfToken();
//   const csrfSave = new csrfDataModel({
//     token: csrfToken,
//     expiryTime: new Date(new Date().setHours(new Date().getHours() + 5)),
//   });
//   const savedData = await csrfSave.save();
//   response.status(200).json({ csrfToken: savedData.token });
// });

app.listen(port, () => {
  console.log(`Server is Running at port ${port}`);
});
