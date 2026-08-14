import { useNavigate } from 'react-router-dom';

type User = {
  id: number;
  username: string;
  emailId: string;
};

interface DashboardPageProps {
  onLogout?: () => void;
}

export default function DashboardPage({ onLogout }: DashboardPageProps) {
  const navigate = useNavigate();
  const user: User = JSON.parse(localStorage.getItem('car_dealership_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('car_dealership_user');
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
          <div>
            <p className="text-sm text-slate-300">Welcome back</p>
            <h1 className="text-3xl font-bold">{user.username || 'User'}</h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-400"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-slate-800">Profile Information</h2>
            <div className="space-y-3 text-slate-700">
              <p><span className="font-semibold">User ID:</span> {user.id || 'N/A'}</p>
              <p><span className="font-semibold">Username:</span> {user.username || 'N/A'}</p>
              <p><span className="font-semibold">Email:</span> {user.emailId || 'N/A'}</p>
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
      </div>
    </div>
  );
}
