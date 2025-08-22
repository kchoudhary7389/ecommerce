import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowCircleLeft } from "react-icons/fa";

const Checkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cart, setCart] = useState({ items: [] });
  const [cartLoading, setCartLoading] = useState(true);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  // Separate state variables for address
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pinCode, setPinCode] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/cart`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCart(response.data.cart || { items: [] });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch cart");
      } finally {
        setCartLoading(false);
      }
    };

    const fetchPreviousOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/order`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const uniqueAddressesMap = new Map();
        response.data.orders.forEach((order) => {
          if (order.shippingAddress) {
            const addressKey = `${order.shippingAddress.address}-${order.shippingAddress.city}-${order.shippingAddress.state}-${order.shippingAddress.country}-${order.shippingAddress.pinCode}`;
            if (!uniqueAddressesMap.has(addressKey)) {
              uniqueAddressesMap.set(addressKey, order);
            }
          }
        });

        // Convert Map values back to array
        const uniqueAddresses = Array.from(uniqueAddressesMap.values());
        setPreviousOrders(uniqueAddresses);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch previous orders"
        );
      }
    };

    fetchCart();
    fetchPreviousOrders();
  }, []);

  const handleAddressSelect = (orderId) => {
    const selectedOrder = previousOrders.find((order) => order._id === orderId);
    if (selectedOrder && selectedOrder.shippingAddress) {
      const shippingAddress = selectedOrder.shippingAddress;
      setAddress(shippingAddress.address || "");
      setCity(shippingAddress.city || "");
      setState(shippingAddress.state || "");
      setCountry(shippingAddress.country || "");
      setPinCode(shippingAddress.pinCode || "");
      setSelectedAddressId(orderId);
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const cashOnDeliverySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create the order
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/orders`,
        {
          shippingAddress: {
            address,
            city,
            state,
            country,
            pinCode,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (orderResponse.data) {
        try {
          await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/cart`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          navigate("/order-success");
        } catch (clearCartError) {
          navigate("/order-success");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const totalAmount = calculateTotal();

    try {
      // 1. Create Razorpay order on backend
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/create-razorpay-order`,
        {
          amount: totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const options = {
        key: import.meta.env.RAZORPAY_KEY, // Replace with your Razorpay key ID
        amount: orderResponse.data.amount,
        currency: "INR",
        name: "Bag Ecommerce",
        description: "Order Payment",
        order_id: orderResponse.data.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_BASE_URL}/api/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                totalAmount,
                shippingAddress: {
                  address,
                  city,
                  state,
                  country,
                  pinCode,
                },
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            navigate("/order-success");
          } catch (err) {
            setError("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to initiate payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate("/home")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shipping Address Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-3">
          <Link
            className="flex items-center gap-1 text-sm sm:text-lg "
            to="/cart"
          >
            <span>
              <FaArrowCircleLeft />
            </span>
            Back to Cart
          </Link>
        </div>
            <h2 className="sm:text-2xl text-lg font-semibold mb-6">Shipping Address</h2>

            {/* Previous Addresses Dropdown */}
            {previousOrders.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select from Previous Addresses
                </label>
                <select
                  value={selectedAddressId}
                  onChange={(e) => handleAddressSelect(e.target.value)}
                  className="mt-1 block w-full rounded-md py-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base text-sm"
                >
                  <option value="">Select an address</option>
                  {previousOrders.map((order) => (
                    <option key={order._id} value={order._id}>
                      {order.shippingAddress.address},{" "}
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="sm:space-y-4 space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 block w-full rounded-md py-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 block w-full rounded-md py-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base text-sm "
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="mt-1 block w-full rounded-md py-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-1 block w-full rounded-md py-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Pin Code
                  </label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="mt-1 block w-full rounded-md py-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base text-sm"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 text-red-600 text-sm">{error}</div>
              )}

              <div className="flex gap-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full disabled cursor-not-allowed bg-blue-600 text-white sm:py-2 sm:px-4 py-1 px-2 rounded-md hover:bg-blue-700 cursor-pointer disabled:opacity-50 sm:text-base text-sm"
                >
                  {loading ? "Processing..." : "Pay online"}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  onClick={cashOnDeliverySubmit}
                  className="mt-6 w-full bg-blue-600 text-white sm:py-2 sm:px-4 py-1 px-2 rounded-md hover:bg-blue-700 cursor-pointer disabled:opacity-50 sm:text-base text-sm"
                >
                  {loading ? "Processing..." : "Cash on Delivery"}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="sm:text-2xl text-lg font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center space-x-4"
                >
                  <img
                    src={`data:image/jpeg;base64,${item.product.image}`}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-gray-600 sm:text-base text-sm">Quantity: {item.quantity}</p>
                    <p className="text-gray-600 sm:text-base text-sm">
                      Price: ₹{item.product.price}
                    </p>
                  </div>
                  <div className="font-medium">
                    ₹{item.product.price * item.quantity}
                  </div>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between sm:text-lg text-base font-semibold">
                  <span>Total:</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="bg-green-50 p-4 rounded-md">
                  <h3 className="font-medium text-green-800 mb-2">
                    Available Payment Methods
                  </h3>
                  <ul className="text-gray-700 list-disc pl-5 space-y-1 sm:text-base text-sm">
                    <li>UPI (Google Pay, PhonePe, Paytm, etc.)</li>
                    <li>QR Code Scan</li>
                    <li>Net Banking (All Major Banks Supported)</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-md mt-4">
                  <h3 className="font-medium text-gray-800 mb-2">
                    More Coming Soon
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base">
                    We're constantly improving your payment experience. Support
                    for debit/credit cards and EMI options is coming soon!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
