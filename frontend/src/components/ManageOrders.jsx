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
  FaEdit,
  FaTrash,
  FaInfoCircle,
  FaTimes,
    FaBars,
} from "react-icons/fa";
import { adminLogout } from "../utils/logout";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const logoutHandler = adminLogout();
    const [sidebarOpen, setSidebarOpen] = useState(false);


  useEffect(() => {
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
        setOrders(response.data.orders);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      // Update order status
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/orders/${
          selectedOrder._id
        }/status`,
        { orderStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If order status is cancelled, automatically update payment status to failed
      if (newStatus === "cancelled") {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/orders/${
            selectedOrder._id
          }/payment`,
          { paymentStatus: "failed" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (newStatus === "delivered") {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/orders/${
            selectedOrder._id
          }/payment`,
          { paymentStatus: "completed" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setShowStatusModal(false);
      // Refresh orders list
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handlePaymentUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/orders/${
          selectedOrder._id
        }/payment`,
        { paymentStatus: newPaymentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowPaymentModal(false);
      // Refresh orders list
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/20 sm:px-0 px-4 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full sm:w-fit">
            <h2 className="sm:text-xl text-lg font-bold mb-4">Update Order Status</h2>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-4"
            >
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 cursor-pointer bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex px-4 sm:px-0 items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full sm:w-fit ">
            <h2 className="sm:text-xl text-lg font-bold mb-4">Update Payment Status</h2>
            <select
              value={newPaymentStatus}
              onChange={(e) => setNewPaymentStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-4"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 cursor-pointer bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentUpdate}
                className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full sm:max-h-[80vh] overflow-y-auto h-screen">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Order Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">Order Information</h3>
                <p className="text-sm text-gray-600">
                  Order ID: {selectedOrder._id}
                </p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      selectedOrder.orderStatus === "processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedOrder.orderStatus === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : selectedOrder.orderStatus === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedOrder.orderStatus}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Payment Status:{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      selectedOrder.paymentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedOrder.paymentStatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedOrder.paymentStatus}
                  </span>
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p className="text-sm text-gray-600">
                  Name: {selectedOrder.user.name}
                </p>
                <p className="text-sm text-gray-600">
                  Email: {selectedOrder.user.email}
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p className="text-sm text-gray-600">
                  {selectedOrder.shippingAddress.address}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedOrder.shippingAddress.city},{" "}
                  {selectedOrder.shippingAddress.state}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedOrder.shippingAddress.country} -{" "}
                  {selectedOrder.shippingAddress.pinCode}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center space-x-4 bg-gray-50 p-3 rounded"
                    >
                      {item.product && item.product.image && (
                        <img
                          src={`data:image/jpeg;base64,${item.product.image}`}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-xs text-gray-600">
                          Price: ₹{item.price}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="font-bold">
                    ₹{selectedOrder.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
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
        <div className="p-4 sm:p-8">
          <h1 className="sm:text-3xl text-2xl text-center sm:text-start font-bold text-gray-800 mb-8">
            Orders Management
          </h1>

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
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {order._id.substring(0, 8)}...
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {order.user?.name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.user?.email || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              ₹{order.totalAmount}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.orderStatus === "processing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.orderStatus === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.orderStatus === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.paymentStatus === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.paymentStatus === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowDetailsModal(true);
                              }}
                              className="text-green-600 cursor-pointer hover:text-green-900 mr-3"
                              title="View Details"
                            >
                              <FaInfoCircle />
                            </button>
                            <button
                              disabled={
                                order.orderStatus === "delivered" ||
                                order.orderStatus === "cancelled"
                              }
                              onClick={() => {
                                setSelectedOrder(order);
                                setNewStatus(order.orderStatus);
                                setShowStatusModal(true);
                              }}
                              className="text-indigo-600 cursor-pointer hover:text-indigo-900 mr-3"
                              title="Update Status"
                            >
                              <FaEdit />
                            </button>
                            <button
                              disabled={
                                order.paymentStatus === "completed" ||
                                order.paymentStatus === "failed"
                              }
                              onClick={() => {
                                setSelectedOrder(order);
                                setNewPaymentStatus(order.paymentStatus);
                                setShowPaymentModal(true);
                              }}
                              className="text-blue-600 cursor-pointer hover:text-blue-900"
                              title="Update Payment"
                            >
                              <FaEdit />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageOrders;
