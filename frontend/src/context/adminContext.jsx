import React, { useState, createContext } from "react";

export const adminDataContext = createContext();

function adminContext({ children }) {
  const [adminData, setAdminData] = useState(null);
  return (
    <adminDataContext.Provider value={{ adminData, setAdminData }}>
      {children}
    </adminDataContext.Provider>
  );
}

export default adminContext;
