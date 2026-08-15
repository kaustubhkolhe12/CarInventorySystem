import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Authentication Page Component
 * Handles user login and registration UI and logic
 * Integrates with authentication service and storage utilities
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/authService';
import { saveUser } from '../utils/storage';
/**
 * Auth Page Component
 * Displays login/register form with error handling
 */
export default function AuthPage({ onLoginSuccess }) {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        emailId: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    /**
     * Handle form input changes
     */
    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    /**
     * Handle form submission (login or register)
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);
        try {
            if (isRegister) {
                // Register flow
                await registerUser(formData);
                setMessage('Registration successful. Please login.');
                setFormData({ username: '', emailId: '', password: '' });
                setIsRegister(false);
            }
            else {
                // Login flow
                const response = await loginUser(formData.emailId, formData.password);
                saveUser(response.user);
                if (onLoginSuccess) {
                    onLoginSuccess(response.user);
                }
                navigate('/dashboard');
            }
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-6", children: _jsxs("div", { className: "w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-sm p-8 shadow-2xl border border-white/20", children: [_jsxs("div", { className: "mb-8 text-center", children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Car Dealership" }), _jsx("p", { className: "mt-2 text-sm text-blue-100", children: "Inventory System Access" })] }), _jsxs("div", { className: "mb-6 flex rounded-xl bg-white/10 p-1", children: [_jsx("button", { type: "button", onClick: () => setIsRegister(false), className: `flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${!isRegister ? 'bg-white text-slate-900' : 'text-white'}`, children: "Login" }), _jsx("button", { type: "button", onClick: () => setIsRegister(true), className: `flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${isRegister ? 'bg-white text-slate-900' : 'text-white'}`, children: "Register" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [isRegister && (_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm font-medium text-white", children: "Username" }), _jsx("input", { type: "text", name: "username", value: formData.username, onChange: handleChange, required: isRegister, disabled: isLoading, className: "w-full rounded-lg border border-white/20 bg-slate-950/30 px-3 py-2 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50", placeholder: "Enter username" })] })), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm font-medium text-white", children: "Email" }), _jsx("input", { type: "email", name: "emailId", value: formData.emailId, onChange: handleChange, required: true, disabled: isLoading, className: "w-full rounded-lg border border-white/20 bg-slate-950/30 px-3 py-2 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50", placeholder: "Enter email" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm font-medium text-white", children: "Password" }), _jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleChange, required: true, disabled: isLoading, className: "w-full rounded-lg border border-white/20 bg-slate-950/30 px-3 py-2 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50", placeholder: "Enter password" })] }), message && _jsx("p", { className: "text-sm text-green-300", children: message }), error && _jsx("p", { className: "text-sm text-red-300", children: error }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full rounded-lg bg-blue-500 px-4 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed", children: isLoading ? 'Loading...' : isRegister ? 'Register' : 'Login' })] })] }) }));
}
