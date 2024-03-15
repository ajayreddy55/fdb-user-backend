const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
require("dotenv").config({ path: "./.env" });

const port = 5020 || process.env.PORT;

mongoose
  .connect(process.env.MONGO_CONNECTION_URL)
  .then(() => console.log("Db Connected"))
  .catch((error) => console.log(error.message));

app.use("/auth", require("./routes/authRoutes"));

app.listen(port, () => {
  console.log(`Server is Running at port ${port}`);
});
