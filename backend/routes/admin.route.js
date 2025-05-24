const Router = require("express");
const { body } = require("express-validator");
const {
  adminRegister,
  adminLogin,
  getAdminProfile,
  adminLogout,
  adminChangePassword,
  adminForgetPassword,
  getAllUsers,
} = require("../controllers/admin.controller");
const { authAdmin } = require("../middlewares/auth.middleware");

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
  adminRegister
);
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email Address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Email or Password incorrect"),
  ],
  adminLogin
);

router.get("/profile", authAdmin, getAdminProfile);
router.get("/logout", authAdmin, adminLogout);
router.get("/users", authAdmin, getAllUsers);


router.post(
  "/changepassword",
  authAdmin,
  [
    body("currentPassword")
      .isLength({ min: 6 })
      .withMessage("Current password should be 6 character long"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password should be 6 character long"),
  ],
  adminChangePassword
);
router.post(
  "/forgetpassword",
  [
    body("email").isEmail().withMessage("Invalid Email Address"),
    body("contactno")
      .isLength({ min: 9 })
      .withMessage("Contact no should be at least 10 character long"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password should be 6 character long"),
  ],
  adminForgetPassword
);

module.exports = router;
