const express = require("express");
const router = express.Router();
const { authUser } = require("../middlewares/auth.middleware");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

// Get user's cart
router.get("/", authUser, getCart);

// Add item to cart
router.post("/add", authUser, addToCart);

// Update cart item quantity
router.put("/update/:productId", authUser, updateCartItem);

// Remove item from cart
router.delete("/remove/:productId", authUser, removeFromCart);

// Clear cart
router.delete("/clear", authUser, clearCart);

module.exports = router;
