import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

const AUTH_API_URL = '/api/auth';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success', 'error', 'loading'
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 4) {
            newErrors.password = 'Password must be at least 4 characters';
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setMessage('Logging in...');
        setMessageType('loading');

        try {
            const res = await axios.post(`${AUTH_API_URL}/login`, formData);
            const { token, ...userData } = res.data;
            login(userData, token);
            setMessage('Login successful! Redirecting...');
            setMessageType('success');
            setTimeout(() => {
                navigate('/products');
            }, 1000);
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Login failed. Please try again.';
            setMessage(errorMsg);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Left Decoration */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-8 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

                {/* Main Card */}
                <div className="relative bg-white rounded-2xl shadow-xl p-8 space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                            <Lock size={28} className="text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to your account to continue shopping</p>
                    </div>

                    {/* Message Alert */}
                    {message && (
                        <div className={`p-4 rounded-lg flex items-start space-x-3 ${
                            messageType === 'success' 
                                ? 'bg-green-50 border border-green-300' 
                                : messageType === 'error'
                                ? 'bg-red-50 border border-red-300'
                                : 'bg-blue-50 border border-blue-300'
                        }`}>
                            {messageType === 'success' && <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />}
                            {messageType === 'error' && <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />}
                            {messageType === 'loading' && <Loader size={20} className="text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />}
                            <p className={`text-sm ${
                                messageType === 'success' ? 'text-green-700' : messageType === 'error' ? 'text-red-700' : 'text-blue-700'
                            }`}>
                                {message}
                            </p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    name="email" type="email" value={formData.email} onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                                        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                                />
                            </div>
                            {errors.email && <p className="text-red-600 text-sm mt-1 flex items-center space-x-1"><AlertCircle size={16} /><span>{errors.email}</span></p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                                        errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors">
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-600 text-sm mt-1 flex items-center space-x-1"><AlertCircle size={16} /><span>{errors.password}</span></p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit" disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (<><Loader size={20} className="animate-spin" /><span>Signing in...</span></>) : (<><span>Sign In</span><ArrowRight size={20} /></>)}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center text-gray-700 pt-4">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                            Sign Up
                        </Link>
                    </p>

                    {/* Test Credentials - Optional */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs font-semibold text-gray-600 mb-2">Demo Credentials:</p>
                        <div className="space-y-1 text-xs text-gray-600">
                            <p><span className="font-mono bg-white px-2 py-1 rounded">admin@example.com</span> / <span className="font-mono bg-white px-2 py-1 rounded">password123</span></p>
                            <p><span className="font-mono bg-white px-2 py-1 rounded">user@example.com</span> / <span className="font-mono bg-white px-2 py-1 rounded">password123</span></p>
                        </div>
                    </div>
                </div>

                {/* Footer Link */}
                <p className="text-center text-sm text-gray-600 mt-8">
                    By signing in, you agree to our{' '}
                    <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{' '}and{' '}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
};

export default Login;