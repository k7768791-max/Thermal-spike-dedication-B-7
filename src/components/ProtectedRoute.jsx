import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ background: "#080d18", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#00e5ff", fontFamily: "Share Tech Mono,monospace" }}>LOADING...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { user, userData, loading } = useAuth();
  if (loading) return <div style={{ background: "#080d18", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffab00", fontFamily: "Share Tech Mono,monospace" }}>LOADING...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (userData?.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}
