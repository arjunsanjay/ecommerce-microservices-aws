// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Zap, Star } from 'lucide-react';

const Home = () => {
    const features = [
        {
            icon: Truck,
            title: 'Free Shipping',
            description: 'On orders over $50. Fast delivery to your doorstep.',
        },
        {
            icon: Shield,
            title: 'Secure Payment',
            description: 'Your transactions are protected with SSL encryption.',
        },
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Experience our optimized checkout in seconds.',
        },
        {
            icon: Star,
            title: 'Quality Guaranteed',
            description: 'All products backed by our satisfaction guarantee.',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-28 sm:pt-32 lg:pt-40 lg:pb-40">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-20 -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-100 rounded-full opacity-20 -ml-40 -mb-40"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="inline-block">
                                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                        ✨ Welcome to ShopHub
                                    </span>
                                </div>
                                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                                    Discover Your
                                    <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Next Favorite
                                    </span>
                                </h1>
                                <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                                    Explore our curated collection of premium products handpicked just for you. Quality, style, and value in one place.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/products"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-200 font-semibold group"
                                >
                                    Shop Now
                                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                                </Link>
                                <Link
                                    to="/products"
                                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-900 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all duration-200 font-semibold"
                                >
                                    Browse Collection
                                </Link>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap gap-6 pt-4">
                                <div className="flex items-center space-x-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600 font-medium">4.9/5 Rating</span>
                                </div>
                                <div className="text-sm text-gray-600 font-medium">
                                    <span className="font-bold text-gray-900">10K+</span> Happy Customers
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Hero Image Placeholder */}
                        <div className="relative hidden lg:block">
                            <div className="relative w-full aspect-square bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-3xl shadow-2xl opacity-80 hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <div className="text-7xl font-bold mb-4">🛍️</div>
                                        <p className="text-xl font-semibold">Amazing Products</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Why Shop With Us?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            We're committed to providing the best shopping experience with quality products and exceptional service.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:bg-blue-50 transition-all duration-300 group"
                                >
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                                        <Icon size={24} className="text-blue-600 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Ready to Start Shopping?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Browse through thousands of premium products and find exactly what you're looking for.
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold hover:shadow-xl hover:-translate-y-1 group"
                    >
                        Explore Products
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;