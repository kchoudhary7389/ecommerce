const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectTodb = require("./db/db");
const adminRouter = require("./routes/admin.route");
const userRouter = require("./routes/user.route");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const cartRoutes = require("./routes/cartRoutes");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectTodb();

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.use("/admin", adminRouter);
app.use("/users", userRouter);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api/cart", cartRoutes);

module.exports = app;
