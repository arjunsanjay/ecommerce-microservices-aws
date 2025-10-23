// src/components/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BarChart3, Users, Package, ShoppingCart, TrendingUp, Plus, ArrowRight, Loader, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                // Fetch products count
                const productsRes = await axios.get('/api/products');
                const productsCount = productsRes.data.length;

                // Fetch users count (if available)
                const usersRes = await axios.get('/api/users', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                const usersCount = usersRes.data.length;

                // Fetch orders count and calculate revenue (if available)
                const ordersRes = await axios.get('/api/orders', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                const ordersCount = ordersRes.data.length;
                const totalRevenue = ordersRes.data.reduce((sum, order) => sum + parseFloat(order.totalPrice || 0), 0);

                setStats({
                    totalProducts: productsCount,
                    totalUsers: usersCount,
                    totalOrders: ordersCount,
                    totalRevenue: totalRevenue,
                });
            } catch (err) {
                setError('Failed to load dashboard statistics');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: Package,
            color: 'blue',
            link: '/admin/products',
            action: 'Manage',
        },
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'purple',
            link: '/admin/users',
            action: 'View',
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingCart,
            color: 'green',
            link: '/admin/orders',
            action: 'Process',
        },
        {
            title: 'Revenue',
            value: `$${stats.totalRevenue.toFixed(2)}`,
            icon: TrendingUp,
            color: 'amber',
            link: '/admin/orders',
            action: 'View',
        },
    ];

    const quickActions = [
        {
            title: 'Add New Product',
            description: 'Create a new product',
            link: '/admin/product/create',
            icon: Plus,
            color: 'blue',
        },
        {
            title: 'View All Orders',
            description: 'Manage pending orders',
            link: '/admin/orders',
            icon: ShoppingCart,
            color: 'green',
        },
        {
            title: 'Manage Users',
            description: 'View all registered users',
            link: '/admin/users',
            icon: Users,
            color: 'purple',
        },
        {
            title: 'Edit Products',
            description: 'Manage existing products',
            link: '/admin/products',
            icon: Package,
            color: 'amber',
        },
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-50 border-blue-200 text-blue-600',
            purple: 'bg-purple-50 border-purple-200 text-purple-600',
            green: 'bg-green-50 border-green-200 text-green-600',
            amber: 'bg-amber-50 border-amber-200 text-amber-600',
        };
        return colors[color] || colors.blue;
    };

    const getIconBgColor = (color) => {
        const colors = {
            blue: 'bg-blue-100',
            purple: 'bg-purple-100',
            green: 'bg-green-100',
            amber: 'bg-amber-100',
        };
        return colors[color] || colors.blue;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600 mt-2">Welcome back! Here's your store overview.</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <BarChart3 size={32} className="text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Error Alert */}
                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-300 rounded-lg flex items-start space-x-3">
                        <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Link key={index} to={stat.link}>
                                <div className={`rounded-xl shadow-md p-6 border transition-all duration-300 hover:shadow-lg hover:border-opacity-50 cursor-pointer transform hover:-translate-y-1 ${getColorClasses(stat.color)}`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${getIconBgColor(stat.color)}`}>
                                            <Icon size={24} className={`text-${stat.color}-600`} />
                                        </div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase">Total</span>
                                    </div>
                                    <h3 className="text-gray-700 text-sm font-medium mb-1">{stat.title}</h3>
                                    <p className="text-3xl font-bold text-gray-900 mb-4">{stat.value}</p>
                                    <div className="flex items-center text-sm font-semibold hover:text-opacity-80 transition-all">
                                        <span>{stat.action}</span>
                                        <ArrowRight size={16} className="ml-2" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Quick Actions Section */}
                <div className="mb-12">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
                        <p className="text-gray-600 mt-1">Common admin tasks</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <Link key={index} to={action.link}>
                                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full">
                                        <div className={`w-12 h-12 rounded-lg ${getIconBgColor(action.color)} flex items-center justify-center mb-4`}>
                                            <Icon size={24} className={`text-${action.color}-600`} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                                        <div className="inline-flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                                            Go <ArrowRight size={16} className="ml-2" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Management Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Products Section */}
                    <Link to="/admin/products">
                        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Products</h2>
                                    <p className="text-gray-600">Create, update, and delete products from your inventory.</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Package size={28} className="text-blue-600" />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group">
                                    <span>View Products</span>
                                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Users Section */}
                    <Link to="/admin/users">
                        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Users</h2>
                                    <p className="text-gray-600">View and manage all registered users and their information.</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Users size={28} className="text-purple-600" />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors group">
                                    <span>View Users</span>
                                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Orders Section */}
                    <Link to="/admin/orders">
                        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Orders</h2>
                                    <p className="text-gray-600">View and process customer orders and track shipments.</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <ShoppingCart size={28} className="text-green-600" />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors group">
                                    <span>View Orders</span>
                                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;