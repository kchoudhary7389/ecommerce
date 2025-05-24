import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaTimes,
  FaKey 
} from "react-icons/fa";
import { userLogout } from "../utils/logout";
import { userDataContext } from "../context/userContext";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState(0);
  const [ratingMessage, setRatingMessage] = useState("");

  const logoutHandler = userLogout();
  const { userData } = useContext(userDataContext);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/products`
      );
      setProducts(response.data.products);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(response.data.products.map((product) => product.category)),
      ];
      setCategories(uniqueCategories);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/cart/add`,
        { productId: product._id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Added to Cart");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Filter logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    const matchesPrice =
      (minPrice === "" || product.price >= parseFloat(minPrice)) &&
      (maxPrice === "" || product.price <= parseFloat(maxPrice));

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleRatingSubmit = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/rating/${productId}`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRatingMessage("Rating submitted");
      await fetchProducts();

      setTimeout(() => {
        setRatingMessage("");
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Product Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Product Details</h2>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-gray-500 cursor-pointer text-2xl hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={`data:image/jpeg;base64,${selectedProduct.image}`}
                  alt={selectedProduct.name}
                  className="w-64 h-64 object-contain"
                />
              </div>
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-2">
                  {selectedProduct.name}
                </h3>
                <p className="text-gray-600">
                  Category: {selectedProduct.category}
                </p>
                <p className="text-xl font-bold text-gray-900 mt-2">
                  ₹{selectedProduct.price}
                </p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600">
                  {selectedProduct.description || "No description available"}
                </p>
              </div>
              <div className="border-b pb-4">
                <div className="text-sm font-semibold">
                  <span className="text-yellow-600">
                    {selectedProduct.numRatings}
                  </span>{" "}
                  People Already Rated this Product
                </div>
                <h3 className="font-semibold mb-2">Rate this product</h3>
                <div className="flex items-center gap-2">
                  <label htmlFor="rating" className="text-gray-700">
                    Rating:
                  </label>
                  <select
                    id="rating"
                    className="border rounded px-2 py-1 text-gray-700"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} Star{num > 1 && "s"}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      handleRatingSubmit(selectedProduct._id);
                      setShowProductModal(false);
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer"
                  >
                    Submit
                  </button>
                  {ratingMessage && (
                    <span className="text-white bg-green-600 inline-block px-3 py-1 rounded">
                      {ratingMessage}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setShowProductModal(false);
                  }}
                  disabled={selectedProduct.stock <= 0}
                  className={`px-6 py-2 rounded transition-colors duration-300 ${
                    selectedProduct.stock > 0
                      ? "bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {selectedProduct.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition-colors duration-300 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/home" className="text-2xl font-bold text-gray-800">
              E-Commerce
            </Link>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <Link to="/cart" className="text-gray-600 hover:text-gray-800">
                <FaShoppingCart className="text-2xl" />
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-gray-800">
                <FaUser className="text-2xl" />
              </Link>
              <Link to="/change-password" className="text-gray-600 hover:text-gray-800">
                <FaKey className="text-2xl" />
              </Link>
              <button
                onClick={logoutHandler}
                className="text-gray-600 cursor-pointer hover:text-gray-800"
              >
                <FaSignOutAlt className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {message && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 rounded text-xl bg-green-500 text-white px-4 py-2">
          {message}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Price Filter */}
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="px-4 py-2 border rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="px-4 py-2 border rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => {
                  setSelectedProduct(product);
                  setShowProductModal(true);
                }}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={`data:image/jpeg;base64,${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-yellow-600 text-sm mb-2">
                      ⭐ {product.ratings.toFixed(1)} / 5
                    </p>
                  </div>
                  <div className="text-xs text-right">
                    <span className="text-sm text-yellow-600">
                      {product.numRatings === 0 ? "No" : product.numRatings}
                    </span>{" "}
                    People Rated it
                  </div>

                  <p className="text-gray-600 text-sm mb-2">
                    {product.category}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xl font-bold text-gray-900 block">
                        ₹{product.price}
                      </span>
                      <span
                        className={`text-sm ${
                          product.stock > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {product.stock > 0
                          ? `In Stock (${product.stock})`
                          : "Out of Stock"}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      disabled={product.stock <= 0}
                      className={`px-4 py-2 rounded transition-colors duration-300 ${
                        product.stock > 0
                          ? "bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
