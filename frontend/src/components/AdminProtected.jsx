import React, { useContext, useEffect, useState } from "react";
import { adminDataContext } from "../context/adminContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminProtected({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const { adminData, setAdminData } = useContext(adminDataContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/admin/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status === 200) {
          setAdminData(res.data.admin);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        navigate("/admin-login");
        localStorage.removeItem("token");
      });
  }, [token]);

  if (isLoading) {
    return <div className="">Loading...</div>;
  }

  return <>{children}</>;
}

export default AdminProtected;
