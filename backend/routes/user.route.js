const Router = require("express");
const { body } = require("express-validator");
const {
  userRegister,
  userLogin,
  getUserProfile,
  userLogout,
  userChangePassword,
  forgetPassword,
  updateUserProfile,
} = require("../controllers/user.controller");
const { authUser } = require("../middlewares/auth.middleware");

const router = Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email Address"),
    body("name")
      .isLength({ min: 3 })
      .withMessage("Name should be at least 3 character long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should be 6 character long"),
    body("contactno")
      .isLength({ min: 9 })
      .withMessage("Contact no should be at least 10 character long"),
  ],
  userRegister
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email Address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should be 6 character long"),
  ],
  userLogin
);

router.get("/profile", authUser, getUserProfile);
router.get("/logout", authUser, userLogout);

router.post(
  "/changepassword",
  authUser,
  [
    body("currentPassword")
      .isLength({ min: 6 })
      .withMessage("Current password should be 6 character long"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password should be 6 character long"),
  ],
  userChangePassword
);

router.post(
  "/forgotpassword",
  [
    body("email").isEmail().withMessage("Invalid Email Address"),
    body("contactno")
      .isLength({ min: 9 })
      .withMessage("Contact no should be at least 10 character long"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password should be 6 character long"),
  ],
  forgetPassword
);

router.put(
  "/updateprofile",
  authUser,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid Email Address"),
    body("contactno")
      .isLength({ min: 9 })
      .withMessage("Contact no should be at least 10 character long"),
  ],
  updateUserProfile
);

module.exports = router;
