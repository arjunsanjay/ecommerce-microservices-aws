// src/components/Products.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Search, Filter, X, Check, AlertCircle } from 'lucide-react';

const PRODUCT_API_URL = '/api/products';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [showAdminForm, setShowAdminForm] = useState(false);
    const [newProduct, setNewProduct] = useState({ 
        name: '', 
        description: '', 
        category: 'General', 
        price: 0, 
        countInStock: 0, 
        imageUrl: '' 
    });
    
    const { token, user } = useAuth();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(PRODUCT_API_URL);
            setProducts(res.data);
            setFilteredProducts(res.data);
        } catch (error) {
            setMessage(`Failed to fetch products: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter and sort products
    useEffect(() => {
        let result = products;

        // Filter by search term
        if (searchTerm) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Sort
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
            default:
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }

        setFilteredProducts(result);
    }, [searchTerm, selectedCategory, sortBy, products]);

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        setMessage('Creating product...');
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(PRODUCT_API_URL, newProduct, config);
            setMessage('Product created successfully!');
            fetchProducts();
            setNewProduct({ name: '', description: '', category: 'General', price: 0, countInStock: 0, imageUrl: '' });
            setShowAdminForm(false);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(`Product creation failed: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const categories = ['All', ...new Set(products.map(p => p.category))];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Products</h1>
                    <p className="text-lg text-gray-600">Discover our curated collection of premium items</p>
                </div>
            </div>

            {/* Admin Form Section */}
            {user && user.isAdmin && (
                <div className="bg-amber-50 border-b-2 border-amber-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        {!showAdminForm ? (
                            <button
                                onClick={() => setShowAdminForm(true)}
                                className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                            >
                                + Add New Product
                            </button>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900">Add a New Product</h2>
                                    <button
                                        onClick={() => setShowAdminForm(false)}
                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                                <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input 
                                        name="name" 
                                        value={newProduct.name} 
                                        onChange={handleChange} 
                                        placeholder="Product Name" 
                                        required 
                                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <input 
                                        name="category" 
                                        value={newProduct.category} 
                                        onChange={handleChange} 
                                        placeholder="Category" 
                                        required 
                                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <input 
                                        name="price" 
                                        value={newProduct.price} 
                                        type="number" 
                                        step="0.01"
                                        onChange={handleChange} 
                                        placeholder="Price" 
                                        required 
                                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <input 
                                        name="countInStock" 
                                        value={newProduct.countInStock} 
                                        type="number" 
                                        onChange={handleChange} 
                                        placeholder="Stock Count" 
                                        required 
                                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <textarea 
                                        name="description" 
                                        value={newProduct.description} 
                                        onChange={handleChange} 
                                        placeholder="Description" 
                                        required 
                                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                                        rows="3"
                                    />
                                    <input 
                                        name="imageUrl" 
                                        value={newProduct.imageUrl} 
                                        onChange={handleChange} 
                                        placeholder="Image URL" 
                                        required 
                                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                                    />
                                    <button 
                                        type="submit" 
                                        className="col-span-1 md:col-span-2 py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                                    >
                                        Create Product
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Messages */}
            {message && (
                <div className={`max-w-7xl mx-auto mx-4 sm:px-6 lg:px-8 my-4 p-4 rounded-lg flex items-center space-x-2 ${
                    message.includes('failed') || message.includes('Failed') 
                        ? 'bg-red-100 text-red-700 border border-red-300' 
                        : 'bg-green-100 text-green-700 border border-green-300'
                }`}>
                    {message.includes('failed') || message.includes('Failed') ? (
                        <AlertCircle size={20} />
                    ) : (
                        <Check size={20} />
                    )}
                    <span>{message}</span>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar - Filters */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-20">
                            <div className="flex items-center space-x-2 mb-6">
                                <Filter size={20} />
                                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-900 mb-3">Category</label>
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <label key={cat} className="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors">
                                            <input
                                                type="radio"
                                                name="category"
                                                value={cat}
                                                checked={selectedCategory === cat}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <span className="text-gray-700">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Sort */}
                            <div className="border-t pt-6">
                                <label className="block text-sm font-semibold text-gray-900 mb-3">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="newest">Newest</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map(product => (
                                    <Link 
                                        to={`/products/${product._id}`} 
                                        key={product._id} 
                                        className="group"
                                    >
                                        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                            {/* Image Container */}
                                            <div className="relative overflow-hidden bg-gray-100 h-48">
                                                <img 
                                                    src={product.imageUrl} 
                                                    alt={product.name} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                                {product.countInStock === 0 && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                                        <span className="text-white font-bold text-lg">Out of Stock</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-4 flex flex-col flex-grow">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                    {product.name}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
                                                    {product.description}
                                                </p>
                                                <div className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded mb-3">
                                                    {product.category}
                                                </div>

                                                {/* Footer */}
                                                <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                                                    <span className="text-2xl font-bold text-blue-600">
                                                        ${parseFloat(product.price).toFixed(2)}
                                                    </span>
                                                    {product.countInStock > 0 ? (
                                                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                                            {product.countInStock} left
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                                                            Out of stock
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow p-12 text-center">
                                <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-600">Try adjusting your filters or search terms</p>
                            </div>
                        )}

                        {/* Results Count */}
                        {filteredProducts.length > 0 && (
                            <div className="mt-8 text-center text-gray-600">
                                <p>Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;