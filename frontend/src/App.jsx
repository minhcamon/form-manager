import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/common/Layout";
import LoginView from "./views/LoginView";
import DashboardView from "./views/DashboardView";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// Register toast globally to avoid importing it everywhere
window.toast = toast;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginView />} />

          {/* Protected Workspace Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardView />} />
            
            {/* Fallback under workspace */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}

export default App;
