// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    
    const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsOpen(false);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="hidden sm:inline text-xl font-bold text-gray-900">ShopHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link 
                            to="/products" 
                            className="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
                        >
                            Products
                        </Link>

                        {isAuthenticated && user?.isAdmin && (
                            <Link 
                                to="/admin/dashboard" 
                                className="flex items-center space-x-1 text-amber-600 hover:text-amber-700 font-medium transition duration-200"
                            >
                                <LayoutDashboard size={18} />
                                <span>Admin</span>
                            </Link>
                        )}
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Cart Icon */}
                        <Link 
                            to="/cart" 
                            className="relative p-2 text-gray-700 hover:text-blue-600 transition duration-200"
                        >
                            <ShoppingCart size={24} />
                            {cartItems.length > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* Desktop Auth Links */}
                        <div className="hidden md:flex items-center space-x-4">
                            {isAuthenticated ? (
                                <>
                                    <span className="text-sm text-gray-600">
                                        Hi, <span className="font-semibold text-gray-900">{user?.name}</span>
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-1 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition duration-200 font-medium"
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/login" 
                                        className="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition duration-200"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden pb-4 border-t border-gray-200 pt-4 space-y-4">
                        <Link 
                            to="/products"
                            onClick={() => setIsOpen(false)}
                            className="block text-gray-700 hover:text-blue-600 font-medium transition duration-200"
                        >
                            Products
                        </Link>

                        {isAuthenticated && user?.isAdmin && (
                            <Link 
                                to="/admin/dashboard"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center space-x-1 text-amber-600 hover:text-amber-700 font-medium transition duration-200"
                            >
                                <LayoutDashboard size={18} />
                                <span>Admin Dashboard</span>
                            </Link>
                        )}

                        <div className="border-t border-gray-200 pt-4 space-y-3">
                            {isAuthenticated ? (
                                <>
                                    <p className="text-sm text-gray-600 font-medium">Hi, {user?.name}</p>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition duration-200 font-medium"
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full text-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition duration-200"
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/register"
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;