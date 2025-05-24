import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Start from "./components/Start";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import CreateProduct from "./components/CreateProduct";
import EditProduct from "./components/EditProduct";
import AdminProducts from "./components/AdminProducts";
import ManageUsers from "./components/ManageUsers";
import ManageOrders from "./components/ManageOrders";
import Cart from "./components/Cart";
import Profile from "./components/Profile";
import AdminProtected from "./components/AdminProtected";
import UserProtected from "./components/UserProtected";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import ChangePassword from "./components/ChangePassword";
import ForgetPassword from "./components/ForgetPassword";
import AdminForgetPassword from "./components/AdminForgetPassword";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <main>
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/home"
              element={
                <UserProtected>
                  <Home />
                </UserProtected>
              }
            />
            <Route
              path="/cart"
              element={
                <UserProtected>
                  <Cart />
                </UserProtected>
              }
            />
            <Route
              path="/change-password"
              element={
                <UserProtected>
                  <ChangePassword />
                </UserProtected>
              }
            />
            <Route
              path="/forget-password"
              element={
                  <ForgetPassword />
              }
            />
            <Route
              path="/admin-forget-password"
              element={
                  <AdminForgetPassword />
              }
            />
            <Route
              path="/profile"
              element={
                <UserProtected>
                  <Profile />
                </UserProtected>
              }
            />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtected>
                  <AdminDashboard />
                </AdminProtected>
              }
            />
            <Route
              path="/admin/products/create"
              element={
                <AdminProtected>
                  <CreateProduct />
                </AdminProtected>
              }
            />
            <Route
              path="/admin/edit-product/:id"
              element={
                <AdminProtected>
                  <EditProduct />
                </AdminProtected>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminProtected>
                  <AdminProducts />
                </AdminProtected>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminProtected>
                  <ManageUsers />
                </AdminProtected>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminProtected>
                  <ManageOrders />
                </AdminProtected>
              }
            />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
