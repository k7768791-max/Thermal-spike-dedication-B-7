import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

import HomePage            from "./pages/HomePage";
import AboutPage           from "./pages/AboutPage";
import ContactPage         from "./pages/ContactPage";
import LoginPage           from "./pages/LoginPage";
import RegisterPage        from "./pages/RegisterPage";
import DataCenterDashboard from "./pages/DataCenterDashboard";
import AdminDashboard      from "./pages/AdminDashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#17243a",
              color: "#dde4f0",
              border: "1px solid rgba(0,229,255,0.2)",
              fontFamily: "Rajdhani, sans-serif",
              letterSpacing: "1px",
            },
            success: { iconTheme: { primary: "#00e676", secondary: "#080d18" } },
            error:   { iconTheme: { primary: "#ff3d57", secondary: "#080d18" } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/"        element={<HomePage />} />
          <Route path="/about"   element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login"   element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected – Data Centre user */}
          <Route path="/dashboard" element={
            <ProtectedRoute><DataCenterDashboard /></ProtectedRoute>
          } />

          {/* Protected – Admin only */}
          <Route path="/admin" element={
            <AdminRoute><AdminDashboard /></AdminRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
