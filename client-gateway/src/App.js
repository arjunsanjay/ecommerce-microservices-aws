import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/login';
import Register from './components/Register';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import ShippingPage from './components/ShippingPage';
import PlaceOrderPage from './components/PlaceOrderPage';
import OrderPage from './components/OrderPage';
import { useAuth } from './context/AuthContext';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import UserListPage from './components/admin/UserListPage';
import ProductListPage from './components/admin/ProductListPage';
import ProductEditPage from './components/admin/ProductEditPage';
import OrderListPage from './components/admin/OrderListPage'; // 1. Import OrderListPage

// Route protection components
const AdminRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    return isAuthenticated && user && user.isAdmin ? children : <Navigate to="/login" />;
};

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Navbar />
            <main>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<CartPage />} />

                    {/* Protected User Routes */}
                    <Route path="/shipping" element={<PrivateRoute><ShippingPage /></PrivateRoute>} />
                    <Route path="/placeorder" element={<PrivateRoute><PlaceOrderPage /></PrivateRoute>} />
                    <Route path="/order/:id" element={<PrivateRoute><OrderPage /></PrivateRoute>} />

                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/users" element={<AdminRoute><UserListPage /></AdminRoute>} />
                    <Route path="/admin/products" element={<AdminRoute><ProductListPage /></AdminRoute>} />
                    <Route path="/admin/product/create" element={<AdminRoute><ProductEditPage /></AdminRoute>} />
                    <Route path="/admin/product/:id/edit" element={<AdminRoute><ProductEditPage /></AdminRoute>} />
                    
                    {/* 2. Add the missing route for the admin order list */}
                    <Route path="/admin/orders" element={<AdminRoute><OrderListPage /></AdminRoute>} />
                    
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;