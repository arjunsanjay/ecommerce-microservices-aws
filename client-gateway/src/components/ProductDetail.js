// src/components/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ChevronLeft, ShoppingCart, Heart, Share2, Check, AlertCircle, Minus, Plus } from 'lucide-react';

const PRODUCT_API_URL = '/api/products';

const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [qty, setQty] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const { id } = useParams();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const addToCartHandler = () => {
        addToCart(product, qty);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleQuantityChange = (value) => {
        const newQty = Math.max(1, Math.min(value, product.countInStock));
        setQty(newQty);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${PRODUCT_API_URL}/${id}`);
                setProduct(data);
                setError('');
            } catch (err) {
                setError(`Product not found or server error: ${err.message}`);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 font-medium">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
                    <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link 
                        to="/products" 
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ChevronLeft size={20} />
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
                    <Link 
                        to="/products" 
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ChevronLeft size={20} />
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    const inStock = product.countInStock > 0;
    const stockPercentage = ((product.countInStock / 100) * 100).toFixed(0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link 
                        to="/products" 
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        <ChevronLeft size={20} />
                        Back to Products
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div className="flex flex-col space-y-4">
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 aspect-square flex items-center justify-center group">
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {!inStock && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <span className="text-white font-bold text-2xl">Out of Stock</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Wishlist & Share Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-all ${
                                    isWishlisted 
                                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                                <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                            </button>
                            <button
                                onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check%20out%20${product.name}`, '_blank')}
                                className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium transition-all"
                            >
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-8">
                        {/* Header */}
                        <div>
                            <div className="inline-block mb-3">
                                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                                    {product.category}
                                </span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Price */}
                        <div className="bg-white rounded-xl p-6 shadow-md">
                            <div className="flex items-baseline space-x-3">
                                <span className="text-5xl font-bold text-blue-600">
                                    ${parseFloat(product.price).toFixed(2)}
                                </span>
                                <span className="text-lg text-gray-500">USD</span>
                            </div>
                            <p className="text-sm text-green-600 mt-2 font-medium">
                                ✓ Best price guarantee
                            </p>
                        </div>

                        {/* Stock Status */}
                        <div className="bg-white rounded-xl p-6 shadow-md">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-gray-700 font-medium">Availability</span>
                                <span className={`font-bold ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                                    {inStock ? `${product.countInStock} in stock` : 'Out of Stock'}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className={`h-2 rounded-full transition-all ${inStock ? 'bg-green-500' : 'bg-red-500'}`}
                                    style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Quantity & Add to Cart */}
                        {inStock && (
                            <div className="bg-white rounded-xl p-6 shadow-md space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        Quantity
                                    </label>
                                    <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                                        <button
                                            onClick={() => handleQuantityChange(qty - 1)}
                                            disabled={qty <= 1}
                                            className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <input
                                            type="number"
                                            value={qty}
                                            onChange={(e) => handleQuantityChange(Number(e.target.value))}
                                            min="1"
                                            max={product.countInStock}
                                            className="w-16 text-center py-2 border-0 focus:ring-0 focus:outline-none font-semibold"
                                        />
                                        <button
                                            onClick={() => handleQuantityChange(qty + 1)}
                                            disabled={qty >= product.countInStock}
                                            className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={addToCartHandler}
                                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    <ShoppingCart size={24} />
                                    <span>Add to Cart</span>
                                </button>

                                {addedToCart && (
                                    <div className="bg-green-100 border border-green-300 rounded-lg p-3 flex items-center space-x-2 text-green-700 font-medium">
                                        <Check size={20} />
                                        <span>Added to cart successfully!</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {!inStock && (
                            <div className="bg-white rounded-xl p-6 shadow-md">
                                <button
                                    disabled
                                    className="w-full py-4 px-6 bg-gray-400 text-white font-bold rounded-lg cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    <AlertCircle size={24} />
                                    <span>Out of Stock</span>
                                </button>
                            </div>
                        )}

                        {/* Info Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                                <div className="text-2xl font-bold text-blue-600 mb-1">Free</div>
                                <p className="text-sm text-gray-600 font-medium">Shipping on orders over $50</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                                <div className="text-2xl font-bold text-green-600 mb-1">30 Days</div>
                                <p className="text-sm text-gray-600 font-medium">Money-back guarantee</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;