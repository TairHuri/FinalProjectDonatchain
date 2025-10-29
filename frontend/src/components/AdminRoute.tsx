import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("userData"); // ← אותו מפתח בדיוק כמו ב-AuthContext
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!token || !user?.roles?.includes("admin")) {
    return <Navigate to="/login/ngo" replace />; // אפשר לשנות לנתיב שאת רוצה
  }

  return children;
};

export default AdminRoute;
