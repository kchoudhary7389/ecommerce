import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userDataContext } from "../context/userContext";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // <-- new loading state
  const { setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading when button clicked
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        { email, password }
      );
      if (response.status === 200) {
        const data = response.data;
        setUserData(data.user);
        localStorage.setItem("token", data.token);
        navigate("/home");
      }
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message || error.response.data.errors?.[0]?.msg
        );
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false); // stop loading after response or error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 sm:px-4 px-2">
      <div className="w-full max-w-md bg-white sm:p-8 p-3 rounded-lg shadow-md">
        {error && (
          <div className="bg-red-500 text-white text-center rounded-lg p-1 mb-4">
            {error}
          </div>
        )}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login to Your Account
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-3 text-xl cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="flex justify-between">
            <div className="text-blue-500 text-sm">
              <Link to="/">Back to home</Link>
            </div>
            <div className="text-blue-500 text-sm">
              <Link to="/forget-password">Forgot Password?</Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading} // disable while loading
            className={`w-full py-2 rounded text-white transition duration-300 cursor-pointer ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-900"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-gray-800 font-medium hover:underline"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
