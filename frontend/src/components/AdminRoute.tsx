import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token || !user.roles?.includes("admin")) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute; // ✅ חובה ה־default הזה
