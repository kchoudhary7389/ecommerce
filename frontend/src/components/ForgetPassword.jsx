import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { userDataContext } from "../context/userContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contactno, setContactno] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { userData, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email,
      newPassword: password,
      contactno,
    };
    // console.log(userData);
    if (password === confirmPassword) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/users/forgotpassword`,
          userData
        );
        console.log(response);
        if (response.status === 200) {
          const data = response.data;
          console.log(userData);
          setMessage(data.message);
        }
      } catch (error) {
        console.log(error);
        if (error.response) {
          setError(
            error.response.data.message || error.response.data.errors[0].msg
          );
        } else {
          setError(error.message);
        }
      }
    } else {
      setError("New and Confirm Password does not match");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        {error && (
          <div className="bg-red-500 text-white text-center rounded-lg p-1 mb-4">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-500 text-white text-center rounded-lg p-1 mb-4">
            {message}
          </div>
        )}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Password Recovery
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />

          <input
            type="text"
            placeholder="Contact Number"
            value={contactno}
            onChange={(e) => setContactno(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute cursor-pointer top-3 right-3 text-xl"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute cursor-pointer top-3 right-3 text-xl"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="flex justify-end">
            <div className="text-blue-500 text-sm">
              <Link to="/login">Back to Login</Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition duration-300 cursor-pointer"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
