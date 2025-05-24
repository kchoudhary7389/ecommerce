const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { authAdmin, authUser } = require("../middlewares/auth.middleware");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  getOrders,
  cancelOrder,
  createRazorpayOrder,
  verifyRazorpay
} = require("../controllers/order.controller");

// Create new order (User)
router.post(
  "/orders",
  authUser,
  [
    body("shippingAddress.address")
      .notEmpty()
      .withMessage("Address is required"),
    body("shippingAddress.city").notEmpty().withMessage("City is required"),
    body("shippingAddress.state").notEmpty().withMessage("State is required"),
    body("shippingAddress.country")
      .notEmpty()
      .withMessage("Country is required"),
    body("shippingAddress.pinCode")
      .notEmpty()
      .withMessage("Pin code is required"),
  ],
  createOrder
);

// Get all orders (Admin only)
router.get("/orders", authAdmin, getAllOrders);
router.get("/order", authUser, getOrders);

// Get order by ID (Admin only)
router.get("/orders/:id", authAdmin, getOrderById);

// Update order status (Admin only)
router.put("/orders/:id/status", authAdmin, updateOrderStatus);

// Update payment status (Admin only)
router.put("/orders/:id/payment", authAdmin, updatePaymentStatus);

// Cancel order (User)
router.put("/order/:id/cancel", authUser, cancelOrder);

router.post("/create-razorpay-order", authUser, createRazorpayOrder);
router.post("/verify", authUser, verifyRazorpay);

module.exports = router;
