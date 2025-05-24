import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminDataContext } from "../context/adminContext";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { adminData, setAdminData } = useContext(adminDataContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminData = {
      email,
      password,
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/login`,
        adminData
      );
      if (response.status === 200) {
        const data = response.data;
        setAdminData(data.admin);
        localStorage.setItem("token", data.token);
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        setError(
          error.response.data.message[0].msg || error.response.data.errors[0].msg
        );
      } else {
        setError(error.message);
      }
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
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Admin Login
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
                       className="absolute top-3 right-3 text-xl"
                     >
                       {showPassword ? <FaEyeSlash /> : <FaEye />}
                     </span>
                   </div>
          <div className="flex justify-between">
            <div className="text-blue-500 text-sm">
              <Link to="/">Back to home</Link>
            </div>
            <div className="text-blue-500 text-sm">
              <Link to="/admin-forget-password">Forgot Password?</Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
