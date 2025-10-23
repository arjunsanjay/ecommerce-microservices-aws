// src/components/PlaceOrderPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CheckoutSteps from './CheckoutSteps';
import axios from 'axios';
import { MapPin, Package, Loader, Check, AlertCircle, ArrowRight } from 'lucide-react';

const ORDER_API_URL = '/api/orders';

const PlaceOrderPage = () => {
    const navigate = useNavigate();
    const { cartItems, shippingAddress, clearCart } = useCart();
    const { token } = useAuth();
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 50 ? 0 : 10;
    const taxPrice = itemsPrice * 0.1;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const placeOrderHandler = async () => {
        try {
            setLoading(true);
            setError('');
            const config = { 
                headers: { 
                    'Content-Type': 'application/json', 
                    Authorization: `Bearer ${token}` 
                } 
            };
            
            const { data } = await axios.post(ORDER_API_URL, {
                orderItems: cartItems,
                shippingAddress,
                paymentMethod: 'PayPal',
                itemsPrice: itemsPrice.toFixed(2),
                shippingPrice: shippingPrice.toFixed(2),
                taxPrice: taxPrice.toFixed(2),
                totalPrice: totalPrice.toFixed(2),
            }, config);
            
            clearCart();
            navigate(`/order/${data._id}`);

        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
                    <AlertCircle size={48} className="mx-auto text-yellow-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-6">Please add items to your cart before checking out.</p>
                    <Link 
                        to="/products"
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <CheckoutSteps step1={true} step2={true} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Review */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Address Section */}
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
                                        <p className="text-lg font-semibold text-gray-900">{shippingAddress.address}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">City</p>
                                        <p className="text-lg font-semibold text-gray-900">{shippingAddress.city}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Postal Code</p>
                                        <p className="text-lg font-semibold text-gray-900">{shippingAddress.postalCode}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Country</p>
                                        <p className="text-lg font-semibold text-gray-900">{shippingAddress.country}</p>
                                    </div>
                                </div>
                                <Link 
                                    to="/shipping"
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-4 inline-block"
                                >
                                    Edit Address
                                </Link>
                            </div>
                        </div>

                        {/* Order Items Section */}
                        <div className="bg-white rounded-xl shadow-md p-8">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <Package size={24} className="text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Order Items</h2>
                            </div>
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.product} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center space-x-4 flex-grow">
                                            <img 
                                                src={item.image} 
                                                alt={item.name} 
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div>
                                                <Link 
                                                    to={`/products/${item.product}`}
                                                    className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                                >
                                                    {item.name}
                                                </Link>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    ${item.price.toFixed(2)} × {item.qty} = <span className="font-semibold text-gray-900">${(item.price * item.qty).toFixed(2)}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-8 sticky top-32 space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>

                            {/* Price Breakdown */}
                            <div className="space-y-4 pb-6 border-b border-gray-200">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium">${itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-medium">
                                        {shippingPrice === 0 ? (
                                            <span className="text-green-600 font-semibold">FREE</span>
                                        ) : (
                                            `$${shippingPrice.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (10%)</span>
                                    <span className="font-medium">${taxPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-900">Total</span>
                                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        ${totalPrice.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-start space-x-3">
                                    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            {/* Place Order Button */}
                            <button
                                onClick={placeOrderHandler}
                                disabled={loading}
                                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {loading ? (
                                    <>
                                        <Loader size={20} className="animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check size={20} />
                                        <span>Place Order</span>
                                    </>
                                )}
                            </button>

                            {/* Trust Badges */}
                            <div className="space-y-3 text-center text-sm text-gray-600 border-t border-gray-200 pt-6">
                                <div className="flex items-center justify-center space-x-2">
                                    <Check size={16} className="text-green-600" />
                                    <span>Secure checkout</span>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <Check size={16} className="text-green-600" />
                                    <span>SSL encrypted</span>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <Check size={16} className="text-green-600" />
                                    <span>Money-back guarantee</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderPage;