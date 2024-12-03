import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/context";

const AlreadySignIn = ({ children }) => {
  const location = useLocation();
  const { isAuthen, loading } = useContext(UserContext);

  // Show loading spinner or placeholder while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is already authenticated, redirect to the home page
  if (isAuthen) {
    return <Navigate to="/" replace={true} />;
  }

  // If not authenticated, render the children (e.g., Login or Sign Up pages)
  return children;
};

export default AlreadySignIn;
