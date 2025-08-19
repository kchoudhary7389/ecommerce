const adminModel = require("../models/admin.model");
const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");

const adminRegister = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(401).json({ message: error.array() });
  }

  const { name, email, password, contactno } = req.body;

  if (!name || !email || !password || !contactno) {
    return res.status(400).json({ message: "All Fields are required" });
  }

  isAdminExist = await adminModel.findOne({ email: email });
  if (isAdminExist) {
    return res.status(401).json({ message: "Admin already exist" });
  }

  const hashedPassword = await adminModel.hashedPassword(password);

  const admin = await adminModel.create({
    name,
    email,
    password: hashedPassword,
    contactno,
  });

  const token = await admin.generateToken();

  return res.status(200).json({ token, admin });
};

const adminLogin = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(401).json({ errors: error.array() });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All Fields are required" });
  }

  admin = await adminModel.findOne({ email: email }).select("+password");
  if (!admin) {
    return res.status(401).json({ message: "Email or Password incorrect" });
  }

  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({ message: "Email or Password incorrect" });
  }

  const token = await admin.generateToken();
  res.cookie("token", token);

  return res.status(200).json({ token, admin });
};

const getAdminProfile = async (req, res, next) => {
  return res.status(200).json({ admin: req.admin });
};

const adminLogout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const adminChangePassword = async (req, res, next) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(401).json({ message: error.array() });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters long" });
    }

    const admin = await adminModel.findById(req.admin._id).select("+password");

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await adminModel.hashedPassword(newPassword);
    admin.password = hashedPassword;
    await admin.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const adminForgetPassword = async (req, res, next) => {
  try {
    const { email, contactno, newPassword } = req.body;

    if (!email || !contactno || !newPassword) {
      return res.status(400).json({
        message: "Email, contact number and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters long" });
    }

    const admin = await adminModel.findOne({ email, contactno });
    if (!admin) {
      return res
        .status(404)
        .json({ message: "Email or contact number is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await adminModel.hashedPassword(newPassword);

    // Update the admin's password
    admin.password = hashedPassword;
    await admin.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find().select("-password");

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({
      message: "Users retrieved successfully",
      users: users,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  adminRegister,
  adminLogin,
  getAdminProfile,
  adminLogout,
  adminChangePassword,
  adminForgetPassword,
  getAllUsers,
};
