import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Start() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // loader delay 2s
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
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
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="flex justify-between items-center p-5 sm:px-20 px-0">
        <div className="text-2xl font-bold text-gray-800 sm:p-0 pl-3">
          BagStore
        </div>
        <nav className="space-x-4">
          <Link to="/login">
            <button className="px-4 py-2 border border-gray-700 text-gray-700 rounded hover:bg-gray-700 hover:text-white cursor-pointer transition duration-300">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-4 sm:inline-block hidden py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition duration-300 cursor-pointer">
              Signup
            </button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-around px-8 md:px-20 sm:py-16 py-5 ">
        {/* Text Content */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-2xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            Discover the Perfect Bag for Every Occasion
          </h1>
          <p className="text-gray-600 sm:text-lg text-sm">
            Explore our latest collection of stylish, durable, and affordable
            bags designed to elevate your everyday look.
          </p>
          <Link to="/login">
            <button className="sm:mt-4 mt-2 mb-4 sm:px-6 px-3 sm:py-3 py-1 bg-gray-800 text-white text-lg rounded hover:bg-gray-900 transition duration-300 cursor-pointer">
              Shop Now
            </button>
          </Link>
        </div>

        {/* Image */}
        <div className="md:w-80 w-80">
          <img
            src="https://images.unsplash.com/photo-1622560482379-c9813322e95a?w=600&auto=format&fit=crop&q=60"
            alt="Bags Collection"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </section>
    </div>
  );
}

export default Start;
