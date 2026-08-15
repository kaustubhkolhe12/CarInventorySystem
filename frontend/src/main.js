import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * React Application Entry Point
 * Sets up router, authentication state management, and page routing
 * Implements automatic redirect based on user authentication status
 */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { clearUser, getUser } from './utils/storage';
import './index.css';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
/**
 * Main App Component
 * Manages authentication state and routing
 */
const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    /**
     * Initialize authentication state on component mount
     * Checks localStorage for existing user session
     * Listens for storage changes from other tabs
     */
    useEffect(() => {
        const shouldForceLoginScreen = window.location.pathname === '/' || window.location.pathname === '/login';
        if (shouldForceLoginScreen) {
            clearUser();
        }
        const checkUser = () => {
            const storedUser = getUser();
            setUser(storedUser);
            setLoading(false);
        };
        checkUser();
        const handleStorageChange = () => checkUser();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);
    // Show loading state while checking authentication
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800", children: _jsx("div", { className: "text-white text-center", children: _jsx("p", { className: "text-lg", children: "Loading..." }) }) }));
    }
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/login", replace: true }) }), _jsx(Route, { path: "/login", element: user ? (_jsx(Navigate, { to: "/dashboard", replace: true })) : (_jsx(AuthPage, { onLoginSuccess: (loggedInUser) => setUser(loggedInUser) })) }), _jsx(Route, { path: "/register", element: user ? (_jsx(Navigate, { to: "/dashboard", replace: true })) : (_jsx(AuthPage, { onLoginSuccess: (loggedInUser) => setUser(loggedInUser) })) }), _jsx(Route, { path: "/dashboard", element: user ? (_jsx(DashboardPage, { onLogout: () => setUser(null) })) : (_jsx(Navigate, { to: "/login", replace: true })) })] }) }));
};
// Render app to DOM
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
