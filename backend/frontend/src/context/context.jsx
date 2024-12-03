import { createContext, useState } from "react";

export const UserContext = createContext("");

import React from "react";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthen, setIsAuthen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthen,
        setIsAuthen,
        loading,
        setLoading,
        error,
        setError,
        onlineUsers,
        setOnlineUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
