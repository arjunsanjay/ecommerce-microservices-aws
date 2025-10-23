// src/components/admin/ProductEditPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, Loader, AlertCircle, CheckCircle, Save, ImageIcon } from 'lucide-react';

const PRODUCT_API_URL = '/api/products';

const ProductEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        imageUrl: '',
        category: '',
        countInStock: 0,
        description: '',
    });

    const [loading, setLoading] = useState(id ? true : false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState('');

    const isNewProduct = !id;

    useEffect(() => {
        if (!isNewProduct) {
            const fetchProduct = async () => {
                try {
                    setLoading(true);
                    const { data } = await axios.get(`${PRODUCT_API_URL}/${id}`);
                    setFormData({
                        name: data.name,
                        price: data.price,
                        imageUrl: data.imageUrl,
                        category: data.category,
                        countInStock: data.countInStock,
                        description: data.description,
                    });
                    setImagePreview(data.imageUrl);
                    setMessage('');
                } catch (err) {
                    setMessage(err.response?.data?.message || err.message);
                    setMessageType('error');
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id, isNewProduct]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than 0';
        if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required';
        if (!formData.category.trim()) newErrors.category = 'Category is required';
        if (formData.countInStock < 0) newErrors.countInStock = 'Stock count cannot be negative';
        if (!formData.description.trim()) newErrors.description = 'Description is required';

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'countInStock' ? parseFloat(value) || 0 : value,
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleImageUrlChange = (e) => {
        const url = e.target.value;
        setFormData(prev => ({
            ...prev,
            imageUrl: url,
        }));
        setImagePreview(url);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setSubmitting(true);
        setMessage('');
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };

        try {
            if (isNewProduct) {
                await axios.post(PRODUCT_API_URL, formData, config);
                setMessage('Product created successfully!');
                setMessageType('success');
            } else {
                await axios.put(`${PRODUCT_API_URL}/${id}`, formData, config);
                setMessage('Product updated successfully!');
                setMessageType('success');
            }

            setTimeout(() => {
                navigate('/admin/products');
            }, 1500);
        } catch (err) {
            setMessage(err.response?.data?.message || err.message || 'Failed to save product');
            setMessageType('error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 font-medium">Loading product...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link 
                        to="/admin/products"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
                    >
                        <ChevronLeft size={20} />
                        Back to Products
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isNewProduct ? 'Create New Product' : 'Edit Product'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {isNewProduct ? 'Add a new product to your inventory' : 'Update product information'}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Message Alert */}
                {message && (
                    <div className={`mb-8 p-4 rounded-lg flex items-start space-x-3 ${
                        messageType === 'success' 
                            ? 'bg-green-50 border border-green-300' 
                            : 'bg-red-50 border border-red-300'
                    }`}>
                        {messageType === 'success' ? (
                            <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <p className={messageType === 'success' ? 'text-green-700' : 'text-red-700'}>
                            {message}
                        </p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={submitHandler} className="bg-white rounded-xl shadow-md p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Image Preview */}
                        <div className="lg:col-span-1">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Image Preview</h3>
                                <div className="w-full aspect-square bg-gray-100 rounded-lg border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                                    {imagePreview ? (
                                        <img 
                                            src={imagePreview} 
                                            alt="Product preview" 
                                            className="w-full h-full object-cover"
                                            onError={() => setImagePreview('')}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <ImageIcon size={48} />
                                            <p className="text-sm mt-2">No image</p>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-600">
                                    Image will update as you type the URL
                                </p>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Product Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter product name"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                                        errors.name
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                                />
                                {errors.name && (
                                    <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                                        <AlertCircle size={16} />
                                        <span>{errors.name}</span>
                                    </p>
                                )}
                            </div>

                            {/* Category & Price Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="e.g., Electronics"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                                            errors.category
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    />
                                    {errors.category && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                                            <AlertCircle size={16} />
                                            <span>{errors.category}</span>
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Price <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3 text-gray-500 font-semibold">$</span>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                            step="0.01"
                                            className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                                                errors.price
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                            }`}
                                        />
                                    </div>
                                    {errors.price && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                                            <AlertCircle size={16} />
                                            <span>{errors.price}</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Stock */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Stock Count <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="countInStock"
                                    value={formData.countInStock}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                                        errors.countInStock
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                                />
                                {errors.countInStock && (
                                    <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                                        <AlertCircle size={16} />
                                        <span>{errors.countInStock}</span>
                                    </p>
                                )}
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Image URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleImageUrlChange}
                                    placeholder="https://example.com/image.jpg"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                                        errors.imageUrl
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                                />
                                {errors.imageUrl && (
                                    <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                                        <AlertCircle size={16} />
                                        <span>{errors.imageUrl}</span>
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter detailed product description"
                                    rows="5"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all resize-none ${
                                        errors.description
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                    }`}
                                />
                                {errors.description && (
                                    <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                                        <AlertCircle size={16} />
                                        <span>{errors.description}</span>
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader size={20} className="animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            <span>{isNewProduct ? 'Create Product' : 'Update Product'}</span>
                                        </>
                                    )}
                                </button>
                                <Link
                                    to="/admin/products"
                                    className="py-3 px-6 bg-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductEditPage;