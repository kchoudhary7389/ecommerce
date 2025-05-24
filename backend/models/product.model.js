const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    image: {
      type: Buffer,
      required: [true, "Product is Required"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: ["handbag", "backpack", "tote", "clutch", "shoulder-bag"],
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      default: 0,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numRatings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
