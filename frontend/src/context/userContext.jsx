import React, { useState, createContext } from "react";

export const userDataContext = createContext();

function userContext({ children }) {
  const [userData, setUserData] = useState({});
  return (
    <userDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </userDataContext.Provider>
  );
}

export default userContext;
