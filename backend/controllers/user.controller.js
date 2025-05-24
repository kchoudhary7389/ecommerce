const userModel = require("../models/user.model");
const { validationResult } = require("express-validator");

const userRegister = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(401).json({ errors: error.array() });
  }

  const { name, email, password, contactno } = req.body;

  if (!name || !email || !password || !contactno) {
    return res.status(400).json({ message: "All Fields are required" });
  }

  isUserExist = await userModel.findOne({ email: email });
  if (isUserExist) {
    return res.status(401).json({ message: "User already exist" });
  }

  const hashedPassword = await userModel.hashedPassword(password);

  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    contactno,
  });

  const token = await user.generateToken();

  return res.status(200).json({ token, user });
};

const userLogin = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(401).json({ errors: error.array() });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All Fields are required" });
  }

  user = await userModel.findOne({ email: email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Email or Password incorrect" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({ message: "Email or Password incorrect" });
  }

  const token = await user.generateToken();
  res.cookie("token", token);

  return res.status(200).json({ token, user });
};

const getUserProfile = async (req, res, next) => {
  return res.status(200).json({ user: req.user });
};

const userLogout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

const userChangePassword = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(401).json({ errors: error.array() });
  }
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password should be at least 6 characters long" });
    }

    const user = await userModel.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    const hashedPassword = await userModel.hashedPassword(newPassword);


    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

const forgetPassword = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(401).json({ errors: error.array() });
  }
  try {
    const { email, contactno, newPassword } = req.body;

    if (!email || !contactno || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password should be at least 6 characters long",
      });
    }

    const user = await userModel.findOne({ email, contactno });
    if (!user) {
      return res.status(404).json({
        message: "Email or contact number is incorrect",
      });
    }
    const hashedPassword = await userModel.hashedPassword(newPassword);

    // Update password directly
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(401).json({ errors: error.array() });
  }
  try {
    const { name, email, contactno } = req.body;
    const userId = req.user._id;

    if (!name || !email || !contactno) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email is already taken by another user
    const existingUser = await userModel.findOne({
      email,
      _id: { $ne: userId },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user data
    user.name = name;
    user.email = email;
    user.contactno = contactno;
    await user.save();

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  userRegister,
  userLogin,
  getUserProfile,
  userLogout,
  userChangePassword,
  forgetPassword,
  updateUserProfile,
};
