import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Dealership Dashboard Page
 * Shows a responsive vehicle listing, search/filter controls, and admin vehicle management
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addAdminUser } from '../services/authService';
import { createVehicle, deleteVehicle, fetchVehicles, purchaseVehicle, restockVehicle, updateVehicle, } from '../services/vehicleService';
import { clearUser, getUser } from '../utils/storage';
const initialVehicleForm = {
    make: '',
    model: '',
    category: 'Sedan',
    price: '',
    quantity: '',
    image: '',
};
export default function DashboardPage({ onLogout }) {
    const navigate = useNavigate();
    const user = getUser() || { id: 0, username: 'User', emailId: '', role: 'user' };
    const [vehicles, setVehicles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [maxPrice, setMaxPrice] = useState(100000);
    const [loading, setLoading] = useState(true);
    const [adminForm, setAdminForm] = useState({ username: '', emailId: '', password: '' });
    const [adminMessage, setAdminMessage] = useState('');
    const [adminError, setAdminError] = useState('');
    const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);
    const [vehicleForm, setVehicleForm] = useState(initialVehicleForm);
    const [editingVehicleId, setEditingVehicleId] = useState(null);
    const [vehicleMessage, setVehicleMessage] = useState('');
    const [vehicleError, setVehicleError] = useState('');
    const [processingVehicleId, setProcessingVehicleId] = useState(null);
    const vehicleListRef = useRef(null);
    const loadVehicles = async () => {
        try {
            const fetched = await fetchVehicles();
            setVehicles(fetched);
            if (fetched.length > 0) {
                const highestPrice = Math.max(...fetched.map((vehicle) => Number(vehicle.price || 0)), 100000);
                setMaxPrice((current) => Math.max(current, highestPrice));
            }
        }
        catch {
            setVehicles([]);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadVehicles();
    }, []);
    const categories = useMemo(() => ['All', ...new Set(vehicles.map((vehicle) => vehicle.category))], [vehicles]);
    const filteredVehicles = useMemo(() => {
        return vehicles.filter((vehicle) => {
            const searchValue = searchTerm.toLowerCase();
            const matchesSearch = !searchValue ||
                vehicle.make.toLowerCase().includes(searchValue) ||
                vehicle.model.toLowerCase().includes(searchValue) ||
                vehicle.category.toLowerCase().includes(searchValue);
            const matchesCategory = selectedCategory === 'All' || vehicle.category === selectedCategory;
            const matchesPrice = vehicle.price <= maxPrice;
            return matchesSearch && matchesCategory && matchesPrice;
        });
    }, [vehicles, searchTerm, selectedCategory, maxPrice]);
    const totalInventory = vehicles.reduce((sum, vehicle) => sum + vehicle.quantity, 0);
    const handleLogout = () => {
        clearUser();
        if (onLogout) {
            onLogout();
        }
        navigate('/login');
    };
    const resetVehicleForm = () => {
        setVehicleForm(initialVehicleForm);
        setEditingVehicleId(null);
    };
    const handleVehicleSubmit = async (event) => {
        event.preventDefault();
        setVehicleError('');
        setVehicleMessage('');
        try {
            const payload = {
                ...vehicleForm,
                price: Number(vehicleForm.price),
                quantity: Number(vehicleForm.quantity),
            };
            if (editingVehicleId !== null) {
                const updatedVehicle = await updateVehicle(editingVehicleId, payload);
                setVehicles((prev) => prev.map((vehicle) => (vehicle.id === editingVehicleId ? updatedVehicle : vehicle)));
                setVehicleMessage('Vehicle updated successfully.');
            }
            else {
                const createdVehicle = await createVehicle(payload);
                const nextMaxPrice = Math.max(100000, Number(createdVehicle.price || 0), Number(vehicleForm.price || 0));
                setVehicles((prev) => [createdVehicle, ...prev]);
                setSelectedCategory('All');
                setSearchTerm('');
                setMaxPrice(nextMaxPrice);
                setVehicleMessage('Vehicle created successfully.');
                await loadVehicles();
                window.setTimeout(() => {
                    vehicleListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 150);
            }
            resetVehicleForm();
        }
        catch (error) {
            setVehicleError(error instanceof Error ? error.message : 'Failed to save vehicle');
        }
    };
    const handleEditVehicle = (vehicle) => {
        setEditingVehicleId(vehicle.id);
        setVehicleForm({
            make: vehicle.make,
            model: vehicle.model,
            category: vehicle.category,
            price: vehicle.price,
            quantity: vehicle.quantity,
            image: vehicle.image || '',
        });
    };
    const handleDeleteVehicle = async (id) => {
        try {
            await deleteVehicle(id);
            setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));
            if (editingVehicleId === id) {
                resetVehicleForm();
            }
            setVehicleMessage('Vehicle deleted successfully.');
        }
        catch (error) {
            setVehicleError(error instanceof Error ? error.message : 'Failed to delete vehicle');
        }
    };
    const handlePurchaseVehicle = async (vehicle) => {
        if (vehicle.quantity <= 0) {
            return;
        }
        setProcessingVehicleId(vehicle.id);
        try {
            const updatedVehicle = await purchaseVehicle(vehicle.id, 1);
            setVehicles((prev) => prev.map((item) => (item.id === vehicle.id ? updatedVehicle : item)));
            setVehicleMessage(`${vehicle.make} ${vehicle.model} purchased successfully.`);
        }
        catch (error) {
            setVehicleError(error instanceof Error ? error.message : 'Purchase failed');
        }
        finally {
            setProcessingVehicleId(null);
        }
    };
    const handleRestockVehicle = async (vehicle) => {
        if (user.role !== 'admin') {
            return;
        }
        setProcessingVehicleId(vehicle.id);
        try {
            const updatedVehicle = await restockVehicle(vehicle.id, 1);
            setVehicles((prev) => prev.map((item) => (item.id === vehicle.id ? updatedVehicle : item)));
            setVehicleMessage(`${vehicle.make} ${vehicle.model} restocked successfully.`);
        }
        catch (error) {
            setVehicleError(error instanceof Error ? error.message : 'Restock failed');
        }
        finally {
            setProcessingVehicleId(null);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-slate-950 text-white", children: _jsxs("div", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", children: [_jsx("header", { className: "mb-8 rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 p-6 shadow-2xl shadow-blue-900/30", children: _jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-blue-200", children: "Premium Auto Market" }), _jsx("h1", { className: "mt-2 text-3xl font-bold md:text-4xl", children: "Car Dealership Dashboard" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "rounded-full border border-blue-400/40 bg-white/5 px-4 py-2 text-sm text-blue-100", children: [user.username, " \u00B7 ", user.role] }), _jsx("button", { onClick: handleLogout, className: "rounded-xl bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-400", children: "Logout" })] })] }) }), _jsxs("section", { className: "mb-8 grid gap-4 md:grid-cols-3", children: [_jsxs("div", { className: "rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-lg", children: [_jsx("p", { className: "text-sm text-slate-300", children: "Available Inventory" }), _jsx("p", { className: "mt-2 text-3xl font-bold text-blue-400", children: vehicles.length })] }), _jsxs("div", { className: "rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-lg", children: [_jsx("p", { className: "text-sm text-slate-300", children: "Cars in Stock" }), _jsx("p", { className: "mt-2 text-3xl font-bold text-emerald-400", children: totalInventory })] }), _jsxs("div", { className: "rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-lg", children: [_jsx("p", { className: "text-sm text-slate-300", children: "Market Range" }), _jsxs("p", { className: "mt-2 text-3xl font-bold text-amber-400", children: ["₹0 -  ₹", maxPrice.toLocaleString()] })] })] }), _jsxs("section", { className: "mb-8 rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl", children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-[1.4fr_0.8fr_0.8fr]", children: [_jsx("input", { type: "text", value: searchTerm, onChange: (event) => setSearchTerm(event.target.value), placeholder: "Search by make, model, or category", className: "rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400" }), _jsx("select", { value: selectedCategory, onChange: (event) => setSelectedCategory(event.target.value), className: "rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400", children: categories.map((category) => (_jsx("option", { value: category, className: "bg-slate-900", children: category }, category))) }), _jsx("input", { type: "range", min: 10000, max: Math.max(100000, ...vehicles.map((vehicle) => Number(vehicle.price || 0))), step: 5000, value: maxPrice, onChange: (event) => setMaxPrice(Number(event.target.value)), className: "w-full accent-blue-500" })] }), _jsxs("div", { className: "mt-3 text-sm text-slate-300", children: ["Max price:  ₹", maxPrice.toLocaleString()] })] }), user.role === 'admin' && (_jsxs("section", { className: "mb-8 rounded-3xl border border-sky-500/30 bg-slate-900/80 p-5 shadow-xl", children: [_jsxs("div", { className: "mb-5 flex items-center justify-between", children: [_jsx("h2", { className: "text-2xl font-bold text-white", children: editingVehicleId !== null ? 'Update Vehicle' : 'Add New Vehicle' }), editingVehicleId !== null && (_jsx("button", { type: "button", onClick: resetVehicleForm, className: "rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800", children: "Cancel edit" }))] }), _jsxs("form", { onSubmit: handleVehicleSubmit, className: "grid gap-4 md:grid-cols-2 xl:grid-cols-6", children: [_jsx("input", { type: "text", value: vehicleForm.make, onChange: (event) => setVehicleForm((prev) => ({ ...prev, make: event.target.value })), placeholder: "Make", className: "rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500", required: true }), _jsx("input", { type: "text", value: vehicleForm.model, onChange: (event) => setVehicleForm((prev) => ({ ...prev, model: event.target.value })), placeholder: "Model", className: "rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500", required: true }), _jsx("select", { value: vehicleForm.category, onChange: (event) => setVehicleForm((prev) => ({ ...prev, category: event.target.value })), className: "rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500", children: ['Sedan', 'SUV', 'Truck', 'Hatchback', 'Coupe', 'Luxury', 'Electric', 'Sport'].map((category) => (_jsx("option", { value: category, className: "bg-slate-900", children: category }, category))) }), _jsx("input", { type: "number", min: "0", value: vehicleForm.price, onChange: (event) => setVehicleForm((prev) => ({ ...prev, price: event.target.value })), placeholder: "Price", className: "rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500", required: true }), _jsx("input", { type: "number", min: "0", value: vehicleForm.quantity, onChange: (event) => setVehicleForm((prev) => ({ ...prev, quantity: event.target.value })), placeholder: "Quantity", className: "rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500", required: true }), _jsxs("div", { className: "md:col-span-2 xl:col-span-2", children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-slate-300", children: "Vehicle image" }), _jsx("input", { type: "file", accept: "image/*", onChange: (event) => {
                                                const file = event.target.files?.[0];
                                                if (!file) {
                                                    return;
                                                }
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    const imageDataUrl = typeof reader.result === 'string' ? reader.result : '';
                                                    setVehicleForm((prev) => ({ ...prev, image: imageDataUrl }));
                                                };
                                                reader.readAsDataURL(file);
                                            }, className: "w-full rounded-xl border border-dashed border-slate-600 bg-slate-950/60 px-3 py-3 text-sm text-slate-200 file:mr-3 file:rounded file:border-0 file:bg-sky-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white" }), vehicleForm.image && (_jsx("img", { src: vehicleForm.image, alt: "Vehicle preview", className: "mt-3 h-24 w-full rounded-xl object-cover" }))] }), _jsx("button", { type: "submit", className: "rounded-xl bg-sky-600 px-4 py-3 font-semibold text-white transition hover:bg-sky-500", children: editingVehicleId !== null ? 'Save changes' : 'Add vehicle' })] }), vehicleMessage && _jsx("p", { className: "mt-3 text-sm text-green-400", children: vehicleMessage }), vehicleError && _jsx("p", { className: "mt-3 text-sm text-red-400", children: vehicleError })] })), user.role === 'admin' && (_jsxs("section", { className: "mb-8 rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl", children: [_jsx("h2", { className: "mb-4 text-2xl font-bold text-white", children: "Admin Management" }), _jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [_jsx("input", { type: "text", value: adminForm.username, onChange: (event) => setAdminForm((prev) => ({ ...prev, username: event.target.value })), placeholder: "Admin name", className: "rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400" }), _jsx("input", { type: "email", value: adminForm.emailId, onChange: (event) => setAdminForm((prev) => ({ ...prev, emailId: event.target.value })), placeholder: "Admin email", className: "rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "password", value: adminForm.password, onChange: (event) => setAdminForm((prev) => ({ ...prev, password: event.target.value })), placeholder: "Password", className: "flex-1 rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400" }), _jsx("button", { type: "button", onClick: () => {
                                                setAdminError('');
                                                setAdminMessage('');
                                                setIsSubmittingAdmin(true);
                                                addAdminUser({
                                                    adminEmail: user.emailId,
                                                    username: adminForm.username,
                                                    emailId: adminForm.emailId,
                                                    password: adminForm.password,
                                                })
                                                    .then(() => {
                                                    setAdminMessage('Admin added successfully.');
                                                    setAdminForm({ username: '', emailId: '', password: '' });
                                                })
                                                    .catch((error) => setAdminError(error instanceof Error ? error.message : 'Unable to add admin'))
                                                    .finally(() => setIsSubmittingAdmin(false));
                                            }, disabled: isSubmittingAdmin || !adminForm.username || !adminForm.emailId || !adminForm.password, className: "rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50", children: isSubmittingAdmin ? 'Adding...' : 'Add Admin' })] })] }), adminMessage && _jsx("p", { className: "mt-3 text-sm text-green-400", children: adminMessage }), adminError && _jsx("p", { className: "mt-3 text-sm text-red-400", children: adminError })] })), _jsx("section", { ref: vehicleListRef, className: "grid gap-6 lg:grid-cols-2 xl:grid-cols-3", children: loading ? (_jsx("div", { className: "col-span-full rounded-2xl bg-slate-900/80 p-6 text-center text-slate-300", children: "Loading vehicles..." })) : filteredVehicles.length === 0 ? (_jsx("div", { className: "col-span-full rounded-2xl bg-slate-900/80 p-6 text-center text-slate-300", children: "No vehicles match your filter." })) : (filteredVehicles.map((vehicle) => (_jsxs("article", { className: "overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl transition hover:-translate-y-1 hover:border-blue-500/40", children: [_jsxs("div", { className: "relative h-56 overflow-hidden", children: [_jsx("img", { src: vehicle.image || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80', alt: `${vehicle.make} ${vehicle.model}`, className: "h-full w-full object-cover" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" }), _jsx("span", { className: "absolute left-4 top-4 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-200", children: vehicle.category })] }), _jsxs("div", { className: "space-y-4 p-5", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-slate-400", children: vehicle.make }), _jsx("h3", { className: "text-2xl font-bold text-white", children: vehicle.model })] }), _jsx("div", { className: "rounded-lg bg-emerald-500/10 px-2 py-1 text-sm font-semibold text-emerald-300", children: vehicle.quantity > 0 ? `${vehicle.quantity} in stock` : 'Sold out' })] }), _jsxs("div", { className: "flex items-center justify-between text-lg font-semibold text-blue-300", children: [_jsxs("span", { children: ["₹", vehicle.price.toLocaleString()] }), _jsxs("span", { className: "text-sm text-slate-300", children: ["ID #", vehicle.id] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", onClick: () => handlePurchaseVehicle(vehicle), disabled: vehicle.quantity === 0 || processingVehicleId === vehicle.id, className: "flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700", children: processingVehicleId === vehicle.id ? 'Processing...' : vehicle.quantity === 0 ? 'Out of Stock' : 'Purchase' }), user.role === 'admin' && (_jsx("button", { type: "button", onClick: () => handleRestockVehicle(vehicle), className: "rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-500", children: "Restock" }))] }), user.role === 'admin' && (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", onClick: () => handleEditVehicle(vehicle), className: "flex-1 rounded-xl border border-slate-600 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800", children: "Edit" }), _jsx("button", { type: "button", onClick: () => handleDeleteVehicle(vehicle.id), className: "flex-1 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20", children: "Delete" })] }))] })] }, vehicle.id)))) })] }) }));
}
