import React from 'react'
import { Link } from "react-router-dom";

function Start() {
  return (
    <div className="min-h-screen bg-white font-sans">
    {/* Header */}
    <header className="flex justify-between items-center p-5 sm:px-20 px-0">
      <div className="text-2xl font-bold text-gray-800">BagStore</div>
      <nav className="space-x-4">
        <Link to="/login">
          <button className="px-4 py-2 border border-gray-700 text-gray-700 rounded hover:bg-gray-700 hover:text-white cursor-pointer transition duration-300">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition duration-300 cursor-pointer">
            Signup
          </button>
        </Link>
      </nav>
    </header>

    {/* Hero Section */}
    <section className="flex flex-col-reverse md:flex-row items-center justify-around px-8 md:px-20 py-16 ">
      {/* Text Content */}
      <div className="md:w-1/2 space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
          Discover the Perfect Bag for Every Occasion
        </h1>
        <p className="text-gray-600 text-lg">
          Explore our latest collection of stylish, durable, and affordable
          bags designed to elevate your everyday look.
        </p>
        <Link to="/login">
          <button className="mt-4 px-6 py-3 bg-gray-800 text-white text-lg rounded hover:bg-gray-900 transition duration-300 cursor-pointer">
            Shop Now
          </button>
        </Link>
      </div>

      {/* Image */}
      <div className="md:w-80 w-80">
        <img
          src="https://images.unsplash.com/photo-1622560482379-c9813322e95a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmFnJTIwcGhvdG9zfGVufDB8fDB8fHww"
          alt="Bags Collection"
          className="w-full rounded-lg shadow-lg"
        />
      </div>
    </section>
  </div>
  )
}

export default Start