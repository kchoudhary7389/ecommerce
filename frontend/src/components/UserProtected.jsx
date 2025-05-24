import React, { useContext, useEffect, useState } from "react";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        console.log(err);
        navigate("/login");
        localStorage.removeItem("token");
      });
  }, [token]);

  if (isLoading) {
    return <div className="">Loading...</div>;
  }

  return <>{children}</>;
}

export default UserProtected;
