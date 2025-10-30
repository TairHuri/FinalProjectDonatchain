import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("userData"); // ← אותו מפתח בדיוק כמו ב-AuthContext
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!token || !(user.role == "admin")) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
