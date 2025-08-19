import React, { useState } from "react";
import axios from "axios";
import { MdPassword } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";

const ChangePassword = () => {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [message, setMessage] = useState("");

  const toggleShow = (field) => {
    setShow({ ...show, [field]: !show[field] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!currentPass || !newPass || !confirmPass) {
      return setMessage("All fields are required.");
    }

    if (newPass !== confirmPass) {
      return setMessage("New passwords do not match.");
    }
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/changepassword`,
        {
          currentPassword: currentPass,
          newPassword: newPass,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message || "Password changed successfully!");
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className=" mt-10 p-6 sm:w-1/3 w-full rounded-xl shadow-lg bg-white">
        <div className="flex items-center justify-between mb-4">
          <Link className="flex items-center gap-1 text-sm " to="/home">
            <span>
              <FaArrowCircleLeft />
            </span>
            Back to Home
          </Link>
          <h2 className="sm:text-xl text-base font-bold  flex items-center gap-2">
            <MdPassword size={22} /> Change Password
          </h2>
        </div>

        {message && (
          <p
            className={`mb-4 text-sm  font-semibold ${
              message == "Password changed successfully"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="relative">
            <input
              type={show.current ? "text" : "password"}
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              placeholder="Current Password"
              className="w-full px-4 sm:py-2 py-1  border rounded-md focus:outline-none focus:ring-2"
            />
            <span
              onClick={() => toggleShow("current")}
              className="absolute right-3 top-2.5 cursor-pointer"
            >
              {show.current ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          {/* New Password */}
          <div className="relative">
            <input
              type={show.new ? "text" : "password"}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="New Password"
              className="w-full px-4 sm:py-2 py-1  border rounded-md focus:outline-none focus:ring-2"
            />
            <span
              onClick={() => toggleShow("new")}
              className="absolute right-3 top-2.5 cursor-pointer"
            >
              {show.new ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={show.confirm ? "text" : "password"}
              name="confirmPass"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Confirm New Password"
              className="w-full px-4 sm:py-2 py-1  border rounded-md focus:outline-none focus:ring-2"
            />
            <span
              onClick={() => toggleShow("confirm")}
              className="absolute right-3 top-2.5 cursor-pointer"
            >
              {show.confirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
