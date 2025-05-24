const Product = require("../models/product.model");
const { validationResult } = require("express-validator");

exports.createProduct = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({
      errors: error.array(),
    });
  }
  try {
    const { name, description, price, category, stock, ratings } = req.body;
    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }
    const product = await Product.create({
      name,
      description,
      price,
      image: req.file.buffer,
      category,
      stock,
      ratings,
    });
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const productsWithBase64Image = products.map((product) => ({
      ...product.toObject(),
      image: product.image ? product.image.toString("base64") : null, // if image exists
    }));
    res.status(200).json({
      message: "Products fetched successfully",
      products: productsWithBase64Image,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({
      errors: error.array(),
    });
  }
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const { name, description, price, category, stock, ratings } = req.body;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.ratings = ratings || product.ratings;

    if (req.file) {
      product.image = req.file.buffer;
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.giveRating = async (req, res) => {
  try {
    const { rating } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(401).json({ message: "Product not found" });
    }
    console.log(product);
    const totalRating = product.ratings * product.numRatings;
    const newTotalRating = totalRating + rating;
    product.numRatings = product.numRatings + 1;
    product.ratings = newTotalRating / product.numRatings;

    await product.save();

    return res.status(200).json({
      message: "Rating submitted successfully",
      ratings: product.ratings.toFixed(1),
      numRatings: product.numRatings,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};
