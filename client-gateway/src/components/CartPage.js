// src/components/CartPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react';

const CartPage = () => {
    const navigate = useNavigate();
    const { cartItems, addToCart, removeFromCart } = useCart();
    const [removingId, setRemovingId] = useState(null);

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const shippingCost = subtotal > 50 ? 0 : 10;
    const tax = subtotal * 0.1;
    const total = subtotal + shippingCost + tax;
    const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const handleQuantityChange = (item, newQty) => {
        if (newQty > 0 && newQty <= item.countInStock) {
            addToCart(item, newQty);
        }
    };

    const handleRemove = (productId) => {
        setRemovingId(productId);
        setTimeout(() => {
            removeFromCart(productId);
            setRemovingId(null);
        }, 300);
    };

    const checkoutHandler = () => {
        navigate('/shipping');
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
                    <div className="mb-6 inline-block p-4 bg-blue-100 rounded-full">
                        <ShoppingBag size={48} className="text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Your Cart is Empty</h1>
                    <p className="text-gray-600 mb-8 text-lg">
                        Looks like you haven't added anything yet. Let's change that!
                    </p>
                    <Link 
                        to="/" 
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 group"
                    >
                        Start Shopping
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
                    <p className="text-gray-600 mt-2">
                        You have <span className="font-semibold text-gray-900">{totalItems}</span> item{totalItems !== 1 ? 's' : ''} in your cart
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            {cartItems.map((item, index) => (
                                <div
                                    key={item.product}
                                    className={`border-b border-gray-200 last:border-b-0 transition-all duration-300 ${
                                        removingId === item.product ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                                    }`}
                                >
                                    <div className="p-6 flex gap-6 hover:bg-gray-50 transition-colors duration-200">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0">
                                            <Link to={`/products/${item.product}`}>
                                                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.name} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </Link>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-grow">
                                            <Link 
                                                to={`/products/${item.product}`}
                                                className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="text-gray-600 mt-1">
                                                ${item.price.toFixed(2)} each
                                            </p>
                                            <div className="mt-2 text-sm text-gray-500">
                                                Stock: <span className="font-medium text-gray-900">{item.countInStock}</span>
                                            </div>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex flex-col items-end justify-between">
                                            <div className="flex items-center border border-gray-300 rounded-lg">
                                                <button
                                                    onClick={() => handleQuantityChange(item, item.qty - 1)}
                                                    disabled={item.qty <= 1}
                                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <input
                                                    type="number"
                                                    value={item.qty}
                                                    onChange={(e) => handleQuantityChange(item, Number(e.target.value))}
                                                    min="1"
                                                    max={item.countInStock}
                                                    className="w-12 text-center py-1 border-0 focus:ring-0 focus:outline-none font-semibold text-gray-900"
                                                />
                                                <button
                                                    onClick={() => handleQuantityChange(item, item.qty + 1)}
                                                    disabled={item.qty >= item.countInStock}
                                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            <div className="text-right mt-4">
                                                <p className="text-sm text-gray-600">Subtotal</p>
                                                <p className="text-xl font-bold text-gray-900">
                                                    ${(item.qty * item.price).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <div className="flex items-start">
                                            <button
                                                onClick={() => handleRemove(item.product)}
                                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                title="Remove from cart"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Continue Shopping */}
                        <Link
                            to="/products"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors group"
                        >
                            <ArrowRight className="rotate-180 mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                            Continue Shopping
                        </Link>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-8 sticky top-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            {/* Summary Items */}
                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-medium">
                                        {shippingCost === 0 ? (
                                            <span className="text-green-600 font-semibold">FREE</span>
                                        ) : (
                                            `$${shippingCost.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (10%)</span>
                                    <span className="font-medium">${tax.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Shipping Alert */}
                            {shippingCost > 0 && (
                                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-2">
                                    <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-blue-700">
                                        Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                                    </p>
                                </div>
                            )}

                            {/* Total */}
                            <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">Total</span>
                                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={checkoutHandler}
                                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 group"
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </button>

                            {/* Trust Badges */}
                            <div className="mt-6 space-y-2 text-center text-sm text-gray-600">
                                <p>✓ Secure checkout</p>
                                <p>✓ SSL encrypted payment</p>
                                <p>✓ 30-day money back guarantee</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;