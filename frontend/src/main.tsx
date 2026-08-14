/**
 * React Application Entry Point
 * Sets up router, authentication state management, and page routing
 * Implements automatic redirect based on user authentication status
 */

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getUser } from './utils/storage';
import './index.css';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import type { User } from './types/auth';

/**
 * Main App Component
 * Manages authentication state and routing
 */
const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Initialize authentication state on component mount
   * Checks localStorage for existing user session
   * Listens for storage changes from other tabs
   */
  useEffect(() => {
    // Check for existing user session
    const checkUser = () => {
      const storedUser = getUser();
      setUser(storedUser);
      setLoading(false);
    };

    checkUser();

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = () => checkUser();
    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener on unmount
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="text-white text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page - Redirect to dashboard if logged in, else show auth */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />
            )
          }
        />

        {/* Login Page */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />
            )
          }
        />

        {/* Register Page */}
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />
            )
          }
        />

        {/* Dashboard Page */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <DashboardPage onLogout={() => setUser(null)} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

// Render app to DOM
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
