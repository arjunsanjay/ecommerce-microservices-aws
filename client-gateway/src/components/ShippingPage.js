// src/components/ShippingPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CheckoutSteps from './CheckoutSteps';
import { ArrowRight, MapPin, AlertCircle } from 'lucide-react';

const ShippingPage = () => {
    const { shippingAddress, saveShippingAddress } = useCart();
    const [formData, setFormData] = useState({
        address: shippingAddress.address || '',
        city: shippingAddress.city || '',
        postalCode: shippingAddress.postalCode || '',
        country: shippingAddress.country || '',
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';
        if (formData.address.length < 5) newErrors.address = 'Address must be at least 5 characters';
        if (formData.postalCode.length < 3) newErrors.postalCode = 'Postal code must be valid';
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

    const submitHandler = (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        
        if (Object.keys(newErrors).length === 0) {
            saveShippingAddress(formData);
            navigate('/placeorder');
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <CheckoutSteps step1={true} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md p-8">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <MapPin size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Shipping Address</h1>
                                    <p className="text-gray-600 mt-1">Where should we deliver your order?</p>
                                </div>
                            </div>

                            <form onSubmit={submitHandler} className="space-y-6">
                                {/* Address Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Street Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="123 Main Street"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                                            errors.address
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    />
                                    {errors.address && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                                            <AlertCircle size={16} />
                                            <span>{errors.address}</span>
                                        </p>
                                    )}
                                </div>

                                {/* City and Postal Code */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="San Francisco"
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                                                errors.city
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                            }`}
                                        />
                                        {errors.city && (
                                            <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                                                <AlertCircle size={16} />
                                                <span>{errors.city}</span>
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            placeholder="94102"
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                                                errors.postalCode
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                            }`}
                                        />
                                        {errors.postalCode && (
                                            <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                                                <AlertCircle size={16} />
                                                <span>{errors.postalCode}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Country */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        placeholder="United States"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                                            errors.country
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    />
                                    {errors.country && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                                            <AlertCircle size={16} />
                                            <span>{errors.country}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 group mt-8"
                                >
                                    <span>Continue to Review</span>
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Info Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-8 sticky top-32 space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Delivery Info</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start space-x-2">
                                        <span className="text-blue-600 mt-1">✓</span>
                                        <span>Standard shipping: 5-7 business days</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-blue-600 mt-1">✓</span>
                                        <span>Free shipping on orders over $50</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-blue-600 mt-1">✓</span>
                                        <span>Real-time tracking available</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Why accurate address?</h3>
                                <p className="text-sm text-gray-600">
                                    An accurate shipping address ensures your order arrives on time and to the right location.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingPage;