const express = require("express");
const router = express.Router();
const { authAdmin } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const { body } = require("express-validator");
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  giveRating,
} = require("../controllers/product.controller");

router.get("/products", getAllProducts);
router.get("/products/:id", getProduct);
router.post("/rating/:id", giveRating);

router.post(
  "/products",
  upload.single("image"),
  authAdmin,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").notEmpty().withMessage("Price is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("stock").notEmpty().withMessage("Stock is required"),
    body("ratings").notEmpty().withMessage("Ratings are required"),
  ],
  createProduct
);
router.put(
  "/products/:id",
  upload.single("image"),
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("Description cannot be empty"),
    body("price").optional().isNumeric().withMessage("Price must be a number"),
    body("category")
      .optional()
      .isIn(["handbag", "backpack", "tote", "clutch", "shoulder-bag"])
      .withMessage("Invalid category"),
    body("stock").optional().isNumeric().withMessage("Stock must be a number"),
    body("ratings")
      .optional()
      .isNumeric()
      .withMessage("Ratings must be a number"),
  ],
  authAdmin,
  updateProduct
);
router.delete("/products/:id", authAdmin, deleteProduct);

module.exports = router;
