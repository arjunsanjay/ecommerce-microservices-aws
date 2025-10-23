// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Make sure you have a basic index.css with Tailwind CSS setup
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // 1. I

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);