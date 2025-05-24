const Order = require("../models/order.model");
const Cart = require("../models/cartModel");
const Product = require("../models/product.model");
const { authAdmin } = require("../middlewares/auth.middleware");
const { validationResult } = require("express-validator");
const razorpay = require("../utils/razorpay");
const crypto = require("crypto");


// Create new order (User)
const createOrder = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  try {
    const { shippingAddress } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Check stock for each product in cart
    for (let i = 0; i < cart.items.length; i++) {
      const cartItem = cart.items[i];
      const product = await Product.findById(cartItem.product._id);

      // Check if product exists
      if (!product) {
        return res.status(404).json({
          message: `Product ${cartItem.product.name} not found`,
        });
      }

      // Check if enough stock is available
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.stock}, You want: ${cartItem.quantity}`,
        });
      }
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount,
      shippingAddress,
      paymentStatus: "pending",
      orderStatus: "processing",
    });

    // Update stock for each product
    for (let i = 0; i < cart.items.length; i++) {
      const cartItem = cart.items[i];
      const product = await Product.findById(cartItem.product._id);

      // Decrease stock by ordered quantity
      product.stock = product.stock - cartItem.quantity;
      await product.save();
    }

    // Clear the cart after successful order creation
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "name image")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const ordersWithBase64Image = orders.map((order) => {
      const orderObj = order.toObject();
      return {
        ...orderObj,
        items: orderObj.items.map((item) => ({
          ...item,
          product: {
            ...item.product,
            image: item.product.image
              ? item.product.image.toString("base64")
              : null,
          },
        })),
      };
    });

    res.status(200).json({ orders: ordersWithBase64Image });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name image")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(401).json({ message: "Orders not found" });
    }

    const ordersWithBase64Image = orders.map((order) => {
      const orderObj = order.toObject();
      return {
        ...orderObj,
        items: orderObj.items.map((item) => ({
          ...item,
          product: {
            ...item.product,
            image: item.product.image
              ? item.product.image.toString("base64")
              : null,
          },
        })),
      };
    });

    res.status(200).json({ orders: ordersWithBase64Image });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

// Get order by ID (Admin only)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name image");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
};

// Update payment status (Admin only)
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res
      .status(200)
      .json({ message: "Payment status updated successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating payment status", error: error.message });
  }
};

// Cancel order (User)
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow cancellation if order is in processing state
    if (order.orderStatus !== "processing") {
      return res.status(400).json({
        message: "Order can only be cancelled if it's in processing state",
      });
    }

    // Update both order status and payment status
    order.orderStatus = "cancelled";
    order.paymentStatus = "failed";
    await order.save();

    res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error cancelling order",
      error: error.message,
    });
  }
};

// controllers/payment.controller.js

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to create Razorpay order", error });
  }
};



const verifyRazorpay = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddress,
    } = req.body;

    const keySecret = process.env.RAZORPAY_SECRET_KEY; // Replace with your Razorpay key secret

    // Step 1: Generate expected signature
    const generated_signature = crypto
      .createHmac("sha256", keySecret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // Step 2: Compare signatures
    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Check stock for each product in cart
    for (let i = 0; i < cart.items.length; i++) {
      const cartItem = cart.items[i];
      const product = await Product.findById(cartItem.product._id);

      // Check if product exists
      if (!product) {
        return res.status(404).json({
          message: `Product ${cartItem.product.name} not found`,
        });
      }

      // Check if enough stock is available
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.stock}, You want: ${cartItem.quantity}`,
        });
      }
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      razorpay_order_id,
      razorpay_payment_id,
      totalAmount,
      shippingAddress,
      paymentStatus: "completed",
      orderStatus: "processing",
    });

    // Update stock for each product
    for (let i = 0; i < cart.items.length; i++) {
      const cartItem = cart.items[i];
      const product = await Product.findById(cartItem.product._id);

      // Decrease stock by ordered quantity
      product.stock = product.stock - cartItem.quantity;
      await product.save();
    }

    // Clear the cart after successful order creation
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });


    res.status(200).json({ message: "Payment verified and order placed" });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Server error during payment verification" });
  }
}



module.exports = {
  createOrder,
  getAllOrders,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  createRazorpayOrder,
  verifyRazorpay
};
