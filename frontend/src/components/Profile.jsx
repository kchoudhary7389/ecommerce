import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEdit,
  FaSave,
  FaArrowCircleUp,
  FaArrowCircleLeft,
} from "react-icons/fa";
import { userDataContext } from "../context/userContext";

function Profile() {
  const { userData, setUserData } = useContext(userDataContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [password, setPassword] = useState("********");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [cancelMessage, setCancelMessage] = useState("");
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const data = response.data.user;
        setEmail(data.email);
        setContactNo(data.contactno);
        setName(data.name);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/order`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setOrders(response.data.orders);
        }
        setOrdersLoading(false);
      } catch (error) {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const dataToSend = {
        name,
        email,
        contactno: contactNo,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/updateprofile`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserData(response.data.user);
      setMessage("Profile updated successfully");
      setIsEditing(false);
      setPassword("********");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/order/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setOrders(
          orders.map((order) =>
            order._id === orderId
              ? { ...order, orderStatus: "cancelled" }
              : order
          )
        );
        setCancelMessage("Order cancelled successfully");

        // Clear success message after 3 seconds
        setTimeout(() => {
          setCancelMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      setCancelError(error.response?.data?.message || "Failed to cancel order");

      // Clear error message after 3 seconds
      setTimeout(() => {
        setCancelError("");
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <Link className="flex items-center gap-1 text-sm py-2" to="/home">
                <span>
                  <FaArrowCircleLeft />
                </span>
                Back to Home
              </Link>
              <div className="flex justify-between items-center mb-6">
                <h1 className="sm:text-2xl text-base font-bold text-gray-800">
                  Your Profile
                </h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex cursor-pointer sm:text-base text-sm items-center space-x-2 text-blue-500 hover:text-blue-600"
                >
                  {isEditing ? (
                    <>
                      <FaSave />
                      <span>Save Changes</span>
                    </>
                  ) : (
                    <>
                      <FaEdit />
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>
              </div>

              {message && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                  {message}
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <FaUser className="text-gray-400 text-xl" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600">
                      Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 sm:text-base text-sm p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 sm:text-base text-sm text-gray-900">
                        {name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <FaEnvelope className="text-gray-400 text-xl" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 sm:text-base text-sm block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 p-1 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 sm:text-base text-sm  text-gray-900">
                        {email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <FaPhone className="text-gray-400 text-xl" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600">
                      Contact Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={contactNo}
                        onChange={(e) => setContactNo(e.target.value)}
                        className="mt-1 sm:text-base text-sm p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 sm:text-base text-sm text-gray-900">
                        {contactNo}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <FaLock className="text-gray-400 text-xl" />
                  <div className="flex-1">
                    <label className="block  text-sm font-medium text-gray-600">
                      Password
                    </label>
                    {isEditing ? (
                      <input
                        type="password"
                        value={password}
                        disabled
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="mt-1 sm:text-base text-sm p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 sm:text-base text-sm text-gray-900">
                        {password}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleUpdateProfile}
                    className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-base text-xs"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Orders Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-2">
              <h2 className="sm:text-2xl text-lg font-bold text-gray-800 mb-6">
                My Orders
              </h2>

              {cancelMessage && (
                <div className="p-3 bg-green-100 text-green-700 rounded">
                  {cancelMessage}
                </div>
              )}
              {cancelError && (
                <div className="p-3 bg-red-100 text-red-700 rounded">
                  {cancelError}
                </div>
              )}

              {ordersLoading ? (
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
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-lg">No orders found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order._id} className="border rounded-lg p-4">
                      <div className="flex justify-between sm:items-start items-center mb-4">
                        <div>
                          <p className="text-sm text-gray-600 sm:block hidden">
                            Order ID: {order._id}
                          </p>
                          <p className="sm:text-sm text-xs text-gray-600">
                            Placed on:{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-3 py-1 sm:text-sm text-xs rounded-full ${
                              order.orderStatus === "processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.orderStatus === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.orderStatus === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.orderStatus === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                          {order.orderStatus === "processing" && (
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="flex cursor-pointer items-center px-3 py-1 sm:text-sm text-xs rounded-full space-x-1 bg-red-200 text-red-600 hover:text-red-700"
                            >
                              <span>Cancel</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {order.items &&
                          order.items.map((item) => (
                            <div
                              key={item._id}
                              className="flex items-center space-x-4"
                            >
                              {item.product && item.product.image && (
                                <img
                                  src={`data:image/jpeg;base64,${item.product.image}`}
                                  alt={item.product.name || "Product image"}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              )}
                              <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-900">
                                  {item.product
                                    ? item.product.name
                                    : "Product name not available"}
                                </h3>
                                <p className="text-xs text-gray-600">
                                  Quantity: {item.quantity}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Price: ${item.price}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between sm:flex-row flex-col sm:items-center items-end">
                          <p className="text-sm font-medium text-gray-900">
                            Total Amount: ${order.totalAmount}
                          </p>
                          <p className="sm:text-sm text-base  text-gray-600">
                            Payment Status: {order.paymentStatus}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
