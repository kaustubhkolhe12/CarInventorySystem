import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api/auth';

interface AuthPageProps {
  onLoginSuccess?: (user: any) => void;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    emailId: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const endpoint = isRegister ? `${API_URL}/register` : `${API_URL}/login`;
    const payload = isRegister
      ? formData
      : { emailId: formData.emailId, password: formData.password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Authentication failed.');
        return;
      }

      if (isRegister) {
        setMessage('Registration successful. Please login.');
        setFormData({ username: '', emailId: '', password: '' });
        setIsRegister(false);
        return;
      }

      localStorage.setItem('car_dealership_user', JSON.stringify(data.user));
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
      navigate('/dashboard');
    } catch (error) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-sm p-8 shadow-2xl border border-white/20">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Car Dealership</h1>
          <p className="mt-2 text-sm text-blue-100">Inventory System Access</p>
        </div>

        <div className="mb-6 flex rounded-xl bg-white/10 p-1">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
              !isRegister ? 'bg-white text-slate-900' : 'text-white'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
              isRegister ? 'bg-white text-slate-900' : 'text-white'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="mb-1 block text-sm font-medium text-white">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-white/20 bg-slate-950/30 px-3 py-2 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter username"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-white">Email</label>
            <input
              type="email"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-white/20 bg-slate-950/30 px-3 py-2 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-white">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-white/20 bg-slate-950/30 px-3 py-2 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter password"
            />
          </div>

          {message && <p className="text-sm text-green-300">{message}</p>}
          {error && <p className="text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 px-4 py-3 font-semibold text-white transition hover:bg-blue-400"
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
