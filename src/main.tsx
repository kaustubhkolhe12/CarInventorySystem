import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('car_dealership_user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
      setLoading(false);
    };

    checkUser();

    // Listen for storage changes (when user logs in from another tab or same tab)
    const handleStorageChange = () => checkUser();
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />} />
        <Route path="/dashboard" element={user ? <DashboardPage onLogout={() => setUser(null)} /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
