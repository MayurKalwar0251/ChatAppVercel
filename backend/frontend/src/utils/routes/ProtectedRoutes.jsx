import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/context";

const ProtectedRoutes = ({ children }) => {
  const location = useLocation();
  const { isAuthen, loading } = useContext(UserContext);

  if (loading) {
    return <div>Loading...</div>; // Show a spinner or placeholder
  }

  if (!isAuthen) {
    return <Navigate to="/login" state={{ from: location }} replace={true} />;
  }

  return children;
};

export default ProtectedRoutes;
