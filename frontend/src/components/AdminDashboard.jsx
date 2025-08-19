import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

import {
  FaBox,
  FaChartLine,
  FaUsers,
  FaShoppingCart,
  FaSignOutAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { adminLogout } from "../utils/logout";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const logoutHandler = adminLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Fetch products from your backend
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/products`
        );
        const data = response.data;
        setProducts(data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [products]);

  useEffect(() => {
    // Fetch products from your backend
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        setUsers(data.users);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [users]);

  useEffect(() => {
    // Fetch products from your backend
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setOrders(response.data.orders);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [users]);

  const handleDelete = async (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/products/${productToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowDeleteModal(false);
      setProductToDelete(null);
      // Refresh products list
      const productsResponse = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/products`
      );
      setProducts(productsResponse.data.products);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 p-4 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <>
        {/* Mobile Top Navbar */}
        <div className="md:hidden fixed top-0 left-0 w-full bg-white shadow z-20 flex items-center justify-between px-4 py-3">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          <button
            className="text-gray-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow-lg z-30 transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 md:translate-x-0`}
        >
          <div className="p-4 hidden md:block">
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="mt-6">
            <Link
              to="/admin/dashboard"
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100"
            >
              <FaChartLine className="mr-3" />
              Dashboard
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <FaBox className="mr-3" />
              Products
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <FaUsers className="mr-3" />
              Users
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <FaShoppingCart className="mr-3" />
              Orders
            </Link>
            <button
              onClick={logoutHandler}
              className="flex items-center cursor-pointer w-full px-4 py-2 mt-4 text-gray-700 hover:bg-gray-100"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </nav>
        </div>
      </>

      {/* Main Content */}
      <div className="flex-1 overflow-auto mt-10">
        <div className="sm:p-8 p-4">
          <h1 className="sm:text-3xl text-2xl text-center sm:text-start font-bold text-gray-800 mb-8">
            Dashboard Overview
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white sm:p-6 p-3 rounded-lg shadow flex items-center justify-between">
              <h3 className="sm:text-lg text-base font-semibold text-gray-600 hover:text-blue-500">
                <Link to="/admin/products">Total Products</Link>
              </h3>
              <p className="sm:text-3xl text-xl font-bold text-gray-800">
                {products.length}
              </p>
            </div>
            <div className="bg-white sm:p-6 p-3 rounded-lg shadow flex items-center justify-between">
              <h3 className="sm:text-lg text-base font-semibold text-gray-600 hover:text-blue-500">
                <Link to="/admin/orders"> Total Orders</Link>
              </h3>
              <p className="sm:text-3xl text-xl font-bold text-gray-800">
                {orders.length}
              </p>
            </div>
            <div className="bg-white sm:p-6 p-3 rounded-lg shadow flex items-center justify-between">
              <h3 className="sm:text-lg text-base font-semibold text-gray-600 hover:text-blue-500">
                <Link to="/admin/users">Total Users</Link>
              </h3>
              <p className="sm:text-3xl text-xl font-bold text-gray-800">
                {users.length}
              </p>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="sm:text-2xl text-lg font-bold text-gray-800">
                  Products
                </h2>
                <Link
                  to="/admin/products/create"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
                >
                  <FaPlus className="sm:mr-2" />
                  <span className="hidden sm:block">Add Product</span>
                </Link>
              </div>

              {loading ? (
                <div className="h-[20vh] flex items-center justify-center ">
                  <div className="flex space-x-2">
                    <motion.span
                      className="w-4 h-4 bg-gray-800 rounded-full"
                      animate={{ y: [0, -15, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    />
                    <motion.span
                      className="w-4 h-4 bg-gray-800 rounded-full"
                      animate={{ y: [0, -15, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0.2,
                      }}
                    />
                    <motion.span
                      className="w-4 h-4 bg-gray-800 rounded-full"
                      animate={{ y: [0, -15, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0.4,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={`data:image/jpeg;base64,${product.image}`}
                                  alt={product.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {product.category}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              ₹{product.price}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {product.stock}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link
                              to={`/admin/edit-product/${product._id}`}
                              className="text-indigo-600 inline-block cursor-pointer hover:text-indigo-900 mr-3"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() => {
                                handleDelete(product._id);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 cursor-pointer hover:text-red-900"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
