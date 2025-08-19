import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrash, FaMinus, FaPlus, FaArrowCircleLeft } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { motion } from "framer-motion";


function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCart(response.data.cart.items);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);

  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/cart/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    // setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/cart/update/${productId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      // setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/cart/clear`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-100 relative mb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            className="flex items-center gap-1 text-sm sm:text-lg "
            to="/home"
          >
            <span>
              <FaArrowCircleLeft />
            </span>
            Back to Home
          </Link>
          <h1 className="sm:text-3xl font-bold text-lg text-gray-800">
            Your Cart
          </h1>
        </div>
        {loading ? (
          <div className="h-screen flex items-center justify-center ">
            <div className="flex space-x-2">
              <motion.span
                className="w-4 h-4 bg-gray-800 rounded-full"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
              <motion.span
                className="w-4 h-4 bg-gray-800 rounded-full"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
              <motion.span
                className="w-4 h-4 bg-gray-800 rounded-full"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="text-center flex items-center justify-center flex-col h-[80vh] py-12">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link
              to="/home"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="sm:text-xl text-base font-semibold text-gray-800">
                  Cart Items ({cart.length})
                </h2>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600 sm:text-base text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center justify-between flex-col sm:flex-row p-4 border-b"
                  >
                    <div className="flex items-center sm:justify-start justify-between w-full space-x-4">
                      <div className="w-20 h-20 overflow-hidden rounded">
                        <img
                          src={`data:image/jpeg;base64,${item.product.image}`}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="text-right space-y-1">
                        <h3 className="sm:text-lg text-base font-medium text-gray-800">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-600 sm:text-base text-sm">
                          {item.product.category}
                        </p>
                        <p className="text-gray-900 font-semibold sm:text-base text-sm">
                          ₹{item.product.price}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center sm:justify-end justify-between w-full space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity - 1)
                          }
                          className="p-1 text-gray-600 hover:text-gray-800"
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity + 1)
                          }
                          className="p-1 text-gray-600 hover:text-gray-800"
                        >
                          <FaPlus />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="p-2 text-red-500 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 py-3 sm:shadow-none shadow-[0_-4px_10px_rgba(0,0,0,0.5)] px-5 sm:px-0 sm:static fixed bottom-0 w-full left-0 bg-gray-100 sm:bg-white z-10">
                <div className="flex sm:border-t sm:pt-6 pt-0 sm:flex-row flex-col justify-between items-center space-y-2">
                  <span className="sm:text-xl text-base font-bold text-gray-800">
                    Total: ₹{getCartTotal()}
                  </span>
                  <button
                    onClick={handleCheckout}
                    className="bg-blue-500 sm:text-base text-sm w-full sm:w-fit text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
