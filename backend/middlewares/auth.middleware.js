const adminModel = require("../models/admin.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.authAdmin = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  console.log(token);
  if (!token) {
    return res.status(400).json({ message: "unauthorized 1" });
  }
  try {
    const decoded = jwt.verify(token, process.env.AUTH_TOKEN);

    const admin = await adminModel.findById(decoded._id);
    req.admin = admin;

    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "unauthorized 2" });
  }
};

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.AUTH_TOKEN);

    const user = await userModel.findById(decoded._id);
    req.user = user;

    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "unauthorized" });
  }
};
