// src/components/OrderPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Truck, MapPin, Package, User, Mail, Clock, Loader, AlertCircle, ArrowRight } from 'lucide-react';

const ORDER_API_URL = '/api/orders';

const OrderPage = () => {
    const { id: orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [delivering, setDelivering] = useState(false);
    const { token, user } = useAuth();

    const fetchOrder = useCallback(async () => {
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${ORDER_API_URL}/${orderId}`, config);
            setOrder(data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, [orderId, token]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const deliverHandler = async () => {
        try {
            setDelivering(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${ORDER_API_URL}/${orderId}/deliver`, {}, config);
            fetchOrder();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setDelivering(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 font-medium">Loading your order...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
                    <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Order</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link 
                        to="/products"
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
                    <AlertCircle size={48} className="mx-auto text-yellow-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                    <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
                    <Link 
                        to="/products"
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const deliveredDate = order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Success Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle size={32} className="text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Order Confirmed!</h1>
                            <p className="text-gray-600 mt-1">Thank you for your purchase</p>
                        </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-900">
                            Order ID: <span className="font-mono font-bold">{order._id}</span>
                        </p>
                        <p className="text-blue-800 text-sm mt-1">Order placed on {formattedDate}</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Status */}
                        <div className="bg-white rounded-xl shadow-md p-8">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className={`p-3 rounded-lg ${order.isDelivered ? 'bg-green-100' : 'bg-yellow-100'}`}>
                                    <Truck size={24} className={order.isDelivered ? 'text-green-600' : 'text-yellow-600'} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Delivery Status</h2>
                                    <p className="text-gray-600">Track your shipment</p>
                                </div>
                            </div>

                            <div className="relative">
                                {/* Status Timeline */}
                                <div className="space-y-6">
                                    {/* Order Placed */}
                                    <div className="flex items-start space-x-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle size={20} className="text-green-600" />
                                            </div>
                                            <div className="w-1 h-12 bg-green-200 my-2"></div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Order Placed</p>
                                            <p className="text-sm text-gray-600">{formattedDate}</p>
                                        </div>
                                    </div>

                                    {/* Processing */}
                                    <div className="flex items-start space-x-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <Package size={20} className="text-green-600" />
                                            </div>
                                            <div className="w-1 h-12 bg-green-200 my-2"></div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Processing</p>
                                            <p className="text-sm text-gray-600">Your order is being prepared</p>
                                        </div>
                                    </div>

                                    {/* Delivery */}
                                    <div className="flex items-start space-x-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                order.isDelivered 
                                                    ? 'bg-green-100' 
                                                    : 'bg-gray-100 border-2 border-gray-300'
                                            }`}>
                                                <Truck size={20} className={order.isDelivered ? 'text-green-600' : 'text-gray-600'} />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {order.isDelivered ? 'Delivered' : 'In Transit'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {order.isDelivered 
                                                    ? `Delivered on ${deliveredDate}` 
                                                    : 'Expected delivery in 5-7 business days'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Details */}
                        <div className="bg-white rounded-xl shadow-md p-8">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <MapPin size={24} className="text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Address</p>
                                        <p className="text-lg font-semibold text-gray-900">{order.shippingAddress.address}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">City</p>
                                        <p className="text-lg font-semibold text-gray-900">{order.shippingAddress.city}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Postal Code</p>
                                        <p className="text-lg font-semibold text-gray-900">{order.shippingAddress.postalCode}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Country</p>
                                        <p className="text-lg font-semibold text-gray-900">{order.shippingAddress.country}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-xl shadow-md p-8">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Package size={24} className="text-purple-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Order Items ({order.orderItems.length})</h2>
                            </div>
                            <div className="space-y-4">
                                {order.orderItems.map((item) => (
                                    <div key={item.product} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center space-x-4 flex-grow">
                                            <img 
                                                src={item.image} 
                                                alt={item.name} 
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                            <div className="flex-grow">
                                                <Link 
                                                    to={`/products/${item.product}`}
                                                    className="font-semibold text-gray-900 hover:text-blue-600 transition-colors block"
                                                >
                                                    {item.name}
                                                </Link>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Qty: <span className="font-medium">{item.qty}</span> × <span className="font-medium">${item.price.toFixed(2)}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-900">
                                                ${(item.qty * item.price).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Customer Info */}
                        <div className="bg-white rounded-xl shadow-md p-8 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Info</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <User size={20} className="text-gray-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-semibold text-gray-900">{order.user.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Mail size={20} className="text-gray-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-semibold text-gray-900 break-all">{order.user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Clock size={20} className="text-gray-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-600">Order Date</p>
                                        <p className="font-semibold text-gray-900">{formattedDate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-xl shadow-md p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>
                            <div className="space-y-4 pb-6 border-b border-gray-200">
                                {order.itemsPrice && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Items</span>
                                        <span className="font-medium">${parseFloat(order.itemsPrice).toFixed(2)}</span>
                                    </div>
                                )}
                                {order.shippingPrice !== undefined && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="font-medium">
                                            {parseFloat(order.shippingPrice) === 0 ? (
                                                <span className="text-green-600 font-semibold">FREE</span>
                                            ) : (
                                                `$${parseFloat(order.shippingPrice).toFixed(2)}`
                                            )}
                                        </span>
                                    </div>
                                )}
                                {order.taxPrice && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span className="font-medium">${parseFloat(order.taxPrice).toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 mt-6">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-900">Total</span>
                                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        ${parseFloat(order.totalPrice).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Admin Action */}
                        {user && user.isAdmin && !order.isDelivered && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                                <p className="text-sm text-amber-800 mb-4 font-medium">Admin Action</p>
                                <button
                                    onClick={deliverHandler}
                                    disabled={delivering}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg hover:shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {delivering ? (
                                        <>
                                            <Loader size={20} className="animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={20} />
                                            <span>Mark As Delivered</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* CTA */}
                        <Link
                            to="/products"
                            className="w-full inline-flex items-center justify-center px-6 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors group"
                        >
                            Continue Shopping
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;