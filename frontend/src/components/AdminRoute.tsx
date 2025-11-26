import React from "react";
import { Navigate } from "react-router-dom";

// AdminRoute component: protects admin-only routes
// Accepts `children` prop which is the content to render if user is admin
const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  // Get authentication token from local storage
  const token = localStorage.getItem("token");

  // Get user data from local storage (must match key used in AuthContext)
  const storedUser = localStorage.getItem("userData");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // If there is no token or the user is not an admin, redirect to admin login
  if (!token || !(user.role == "admin")) {
    return <Navigate to="/admin/login" replace />;
  }

  // Otherwise, allow access and render the child component
  return children;
};

export default AdminRoute;
