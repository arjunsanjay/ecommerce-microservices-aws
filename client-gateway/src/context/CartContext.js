import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const cartFromStorage = localStorage.getItem('cartItems') 
    ? JSON.parse(localStorage.getItem('cartItems')) 
    : [];

const shippingAddressFromStorage = localStorage.getItem('shippingAddress') 
    ? JSON.parse(localStorage.getItem('shippingAddress')) 
    : {};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(cartFromStorage);
    const [shippingAddress, setShippingAddress] = useState(shippingAddressFromStorage); // Corrected line

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty) => {
        const exist = cartItems.find((x) => x.product === product._id);

        if (exist) {
            setCartItems(
                cartItems.map((x) =>
                    x.product === exist.product ? { ...exist, qty } : x
                )
            );
        } else {
            const newItem = {
                product: product._id,
                name: product.name,
                image: product.imageUrl,
                price: product.price,
                countInStock: product.countInStock,
                qty,
            };
            setCartItems([...cartItems, newItem]);
        }
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((x) => x.product !== id));
    };

    const saveShippingAddress = (data) => {
        localStorage.setItem('shippingAddress', JSON.stringify(data));
        setShippingAddress(data);
    };
    
    const clearCart = () => {
        localStorage.removeItem('cartItems');
        setCartItems([]);
    };

    const value = {
        cartItems,
        shippingAddress, // Add to value
        addToCart,
        removeFromCart,
        saveShippingAddress, // Add to value
        clearCart, // Add to value
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};