const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      minLength: [3, "Fullname must be at least 3 characters long 1"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
      minLength: [3, "email must be valid"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    contactno: {
      type: String,
      required: [true, "Please provide a contact number"],
      trim: true,
      minlength: [10, "contact must be at least 6 characters long"],
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.AUTH_TOKEN);
  return token;
};

adminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.statics.hashedPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const adminModel = mongoose.model("admin", adminSchema);
module.exports = adminModel;
