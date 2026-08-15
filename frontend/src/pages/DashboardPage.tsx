/**
 * Dashboard Page Component
 * Displays user profile and inventory information after login
 * Provides logout functionality
 */

import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addAdminUser } from '../services/authService';
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
  const user: User = getUser() || { id: 0, username: 'User', emailId: '', role: 'user' };
  const [adminForm, setAdminForm] = useState({ username: '', emailId: '', password: '' });
  const [adminMessage, setAdminMessage] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);

  const handleLogout = () => {
    clearUser();
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  const handleAddAdmin = async (event: FormEvent) => {
    event.preventDefault();
    setAdminError('');
    setAdminMessage('');
    setIsSubmittingAdmin(true);

    try {
      await addAdminUser({
        adminEmail: user.emailId,
        username: adminForm.username,
        emailId: adminForm.emailId,
        password: adminForm.password,
      });

      setAdminMessage('Admin added successfully.');
      setAdminForm({ username: '', emailId: '', password: '' });
    } catch (error) {
      setAdminError(error instanceof Error ? error.message : 'Unable to add admin');
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
          <div>
            <p className="text-sm text-slate-300">Welcome back</p>
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <p className="mt-1 text-sm text-slate-300">Role: {user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-400 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
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
              <p>
                <span className="font-semibold">Role:</span> {user.role || 'user'}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-slate-800">Inventory Summary</h2>
            <div className="space-y-3 text-slate-700">
              <p>Available cars: 24</p>
              <p>New arrivals: 8</p>
              <p>Low stock alerts: 3</p>
            </div>
          </div>
        </div>

        {user.role === 'admin' && (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-slate-800">Add Admin</h2>
            <form onSubmit={handleAddAdmin} className="grid gap-4 md:grid-cols-3">
              <input
                type="text"
                value={adminForm.username}
                onChange={(event) => setAdminForm((prev) => ({ ...prev, username: event.target.value }))}
                placeholder="Full name"
                className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="email"
                value={adminForm.emailId}
                onChange={(event) => setAdminForm((prev) => ({ ...prev, emailId: event.target.value }))}
                placeholder="Admin email"
                className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="password"
                value={adminForm.password}
                onChange={(event) => setAdminForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="Password"
                className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="submit"
                disabled={isSubmittingAdmin}
                className="md:col-span-3 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {isSubmittingAdmin ? 'Adding admin...' : 'Add admin'}
              </button>
            </form>
            {adminMessage && <p className="mt-3 text-sm text-green-600">{adminMessage}</p>}
            {adminError && <p className="mt-3 text-sm text-red-600">{adminError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
