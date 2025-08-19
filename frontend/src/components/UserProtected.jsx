import React, { useContext, useEffect, useState } from "react";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";


function UserProtected({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const { userData, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status === 200) {
          setUserData(res.data.admin);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        navigate("/login");
        localStorage.removeItem("token");
      });
  }, [token]);

  if (isLoading) {
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

  return <>{children}</>;
}

export default UserProtected;
