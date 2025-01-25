import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

// Function to check if the user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem("token"); // Check token in localStorage
  return token ? true : false;
};

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
