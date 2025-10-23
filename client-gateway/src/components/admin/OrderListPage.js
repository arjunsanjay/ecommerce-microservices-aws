// src/components/admin/OrderListPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Eye, Loader, AlertCircle, TrendingUp, Clock, CheckCircle, Truck } from 'lucide-react';

const ORDER_API_URL = '/api/orders';

const OrderListPage = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, pending, delivered
    const { token } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(ORDER_API_URL, config);
                setOrders(data);
                setFilteredOrders(data);
                setError('');
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    useEffect(() => {
        let result = orders;

        // Filter by search term
        if (searchTerm) {
            result = result.filter(order =>
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (order.user && order.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (order.user && order.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filter by status
        if (filterStatus === 'pending') {
            result = result.filter(order => !order.isDelivered);
        } else if (filterStatus === 'delivered') {
            result = result.filter(order => order.isDelivered);
        }

        setFilteredOrders(result);
    }, [searchTerm, filterStatus, orders]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 font-medium">Loading orders...</p>
                </div>
            </div>
        );
    }

    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalPrice || 0), 0);
    const pendingOrders = orders.filter(o => !o.isDelivered).length;
    const deliveredOrders = orders.filter(o => o.isDelivered).length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
                            <p className="text-gray-600 mt-1">
                                Total orders: <span className="font-semibold">{orders.length}</span>
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <ShoppingCart size={32} className="text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg flex items-start space-x-3">
                        <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{orders.length}</p>
                            </div>
                            <ShoppingCart size={32} className="text-blue-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Pending</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{pendingOrders}</p>
                            </div>
                            <Clock size={32} className="text-yellow-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Delivered</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{deliveredOrders}</p>
                            </div>
                            <CheckCircle size={32} className="text-green-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">${totalRevenue.toFixed(2)}</p>
                            </div>
                            <TrendingUp size={32} className="text-purple-600 opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Search</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by order ID, customer name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Filter by Status */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Filter by Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="all">All Orders</option>
                                <option value="pending">Pending Delivery</option>
                                <option value="delivered">Delivered</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                {filteredOrders.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredOrders.map(order => {
                                        const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        });

                                        return (
                                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-mono text-gray-600">{order._id.substring(0, 12)}...</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{order.user && order.user.name}</p>
                                                        <p className="text-sm text-gray-600">{order.user && order.user.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-600">{orderDate}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-lg font-bold text-gray-900">${parseFloat(order.totalPrice).toFixed(2)}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {order.isDelivered ? (
                                                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                                            <CheckCircle size={16} />
                                                            <span>Delivered</span>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                                                            <Clock size={16} />
                                                            <span>Pending</span>
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link
                                                        to={`/order/${order._id}`}
                                                        className="inline-flex items-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                                                    >
                                                        <Eye size={16} />
                                                        <span>View</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {searchTerm ? 'No orders found' : 'No orders to display'}
                        </h3>
                        <p className="text-gray-600">
                            {searchTerm ? 'Try adjusting your search or filters' : 'There are no orders matching your criteria'}
                        </p>
                    </div>
                )}

                {/* Results Summary */}
                {filteredOrders.length > 0 && (
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Showing <span className="font-semibold text-gray-900">{filteredOrders.length}</span> of <span className="font-semibold text-gray-900">{orders.length}</span> orders
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderListPage;