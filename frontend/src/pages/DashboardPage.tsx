/**
 * Dashboard Page Component
 * Displays user profile and inventory information after login
 * Provides logout functionality
 */

import { useNavigate } from 'react-router-dom';
import { clearUser, getUser } from '../utils/storage';
import type { User } from '../types/auth';

interface DashboardPageProps {
  onLogout?: () => void;
}

/**
 * Dashboard Component
 * Shows user profile information and inventory summary
 */
export default function DashboardPage({ onLogout }: DashboardPageProps) {
  const navigate = useNavigate();
  
  // Retrieve current user from storage
  const user: User = getUser() || { id: 0, username: 'User', emailId: '' };

  /**
   * Handle user logout
   * Clears localStorage and redirects to login
   */
  const handleLogout = () => {
    clearUser();
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header with User Greeting and Logout */}
        <div className="mb-6 flex items-center justify-between rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
          <div>
            <p className="text-sm text-slate-300">Welcome back</p>
            <h1 className="text-3xl font-bold">{user.username}</h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-400 transition"
          >
            Logout
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Information Card */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-slate-800">Profile Information</h2>
            <div className="space-y-3 text-slate-700">
              <p>
                <span className="font-semibold">User ID:</span> {user.id || 'N/A'}
              </p>
              <p>
                <span className="font-semibold">Username:</span> {user.username || 'N/A'}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {user.emailId || 'N/A'}
              </p>
            </div>
          </div>

          {/* Inventory Summary Card */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-slate-800">Inventory Summary</h2>
            <div className="space-y-3 text-slate-700">
              <p>Available cars: 24</p>
              <p>New arrivals: 8</p>
              <p>Low stock alerts: 3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
