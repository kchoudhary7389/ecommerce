import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/userContext";
import { adminDataContext } from "../context/adminContext";
import axios from "axios";

export const adminLogout = () => {
  const navigate = useNavigate();
  const { adminData, setAdminData } = useContext(adminDataContext);
  const logoutHandler = async () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/admin/logout`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status === 200) {
          navigate("/admin-login");
          setAdminData(null);
          localStorage.removeItem("token");
        }
      });
  };
  return logoutHandler;
};
export const userLogout = () => {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(userDataContext);
  const logoutHandler = async () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status === 200) {
          navigate("/login");
          setUserData(null);
          localStorage.removeItem("token");
        }
      });
  };
  return logoutHandler;
};
