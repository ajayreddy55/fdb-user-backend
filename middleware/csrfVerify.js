const session = require("express-session");
const csrfDataModel = require("../database-models/csrfData");

const csrfVerifyFdb = async (request, response, next) => {
  let csrfToken;

  const csrfHeader = request.headers["fdb-csrf-token"];
  console.log(csrfHeader);

  if (csrfHeader !== undefined) {
    csrfToken = csrfHeader;
  }

  if (csrfHeader === undefined) {
    return response.status(401).json({ message: "UnAuthorized Request" });
  } else {
    const resObject = await csrfDataModel.findOne({ token: csrfToken });
    console.log(resObject);

    if (resObject) {
      next();
    } else {
      return response.status(401).json({ message: "UnAuthorized Request" });
    }
  }
};

module.exports = csrfVerifyFdb;
