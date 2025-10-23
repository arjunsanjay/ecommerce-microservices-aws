// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, Loader, AlertCircle, CheckCircle, ArrowRight, Check } from 'lucide-react';

const AUTH_API_URL = '/api/auth';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nameRegex = /^[a-zA-Z\s]{2,}$/;

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (!nameRegex.test(formData.name)) {
            newErrors.name = 'Name must be at least 2 characters and contain only letters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!agreeTerms) {
            newErrors.terms = 'You must agree to the terms and conditions';
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
        setMessage('Creating your account...');
        setMessageType('loading');

        try {
            const { confirmPassword, ...dataToSend } = formData;
            const res = await axios.post(`${AUTH_API_URL}/register`, dataToSend);
            const { token, ...userData } = res.data;
            login(userData, token);
            setMessage('Registration successful! Redirecting...');
            setMessageType('success');
            setTimeout(() => {
                navigate('/products');
            }, 1000);
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
            setMessage(errorMsg);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg">
                {/* Decorative Elements */}
                <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-8 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

                {/* Main Card */}
                <div className="relative bg-white rounded-2xl shadow-xl p-8 space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="inline-block p-3 bg-purple-100 rounded-full mb-4">
                            <User size={28} className="text-purple-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                        <p className="text-gray-600">Join ShopHub and start shopping today</p>
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
                            {messageType === 'success' && (
                                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                            )}
                            {messageType === 'error' && (
                                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                            )}
                            {messageType === 'loading' && (
                                <Loader size={20} className="text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
                            )}
                            <p className={`text-sm ${
                                messageType === 'success' 
                                    ? 'text-green-700' 
                                    : messageType === 'error'
                                    ? 'text-red-700'
                                    : 'text-blue-700'
                            }`}>
                                {message}
                            </p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                                        errors.name
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-purple-500 focus:border-transparent'
                                    }`}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                                    <AlertCircle size={16} />
                                    <span>{errors.name}</span>
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                                        errors.email
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-purple-500 focus:border-transparent'
                                    }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                                    <AlertCircle size={16} />
                                    <span>{errors.email}</span>
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                                        errors.password
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-purple-500 focus:border-transparent'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                                    <AlertCircle size={16} />
                                    <span>{errors.password}</span>
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                                        errors.confirmPassword
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-purple-500 focus:border-transparent'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                                    <AlertCircle size={16} />
                                    <span>{errors.confirmPassword}</span>
                                </p>
                            )}
                        </div>

                        {/* Terms & Conditions */}
                        <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start space-x-3 cursor-pointer group" onClick={() => {
                                setAgreeTerms(!agreeTerms);
                                if (errors.terms) {
                                    setErrors(prev => ({
                                        ...prev,
                                        terms: '',
                                    }));
                                }
                            }}>
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                    agreeTerms 
                                        ? 'bg-purple-600 border-purple-600' 
                                        : 'border-gray-300 group-hover:border-purple-400'
                                }`}>
                                    {agreeTerms && <Check size={14} className="text-white" />}
                                </div>
                                <span className="text-sm text-gray-700">
                                    I agree to the <a href="#" className="text-purple-600 hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-purple-600 hover:underline font-medium">Privacy Policy</a>
                                </span>
                            </div>
                            {errors.terms && (
                                <p className="text-red-600 text-sm flex items-center space-x-1">
                                    <AlertCircle size={16} />
                                    <span>{errors.terms}</span>
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader size={20} className="animate-spin" />
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <p className="text-center text-gray-700">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-purple-600 hover:text-purple-700 font-bold transition-colors"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>

                {/* Footer Link */}
                <p className="text-center text-sm text-gray-600 mt-8">
                    By creating an account, you agree to our{' '}
                    <a href="#" className="text-purple-600 hover:underline">
                        Terms of Service
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;