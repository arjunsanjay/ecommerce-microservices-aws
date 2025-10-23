const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
// We import the protect and admin middleware from the file you have open
const { protect, admin } = require('../middleware/authMiddleware'); 

// @route   GET /api/products
// @desc    Fetch all products (accessible to everyone)
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Fetch all products
        const products = await Product.find({}); 
        res.json(products);
    } catch (error) {
        // If the database connection fails or another server error occurs
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Server error fetching products' });
    }
});

// @route   GET /api/products/:id
// @desc    Fetch single product by ID (accessible to everyone)
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        // Handle invalid ID format or server issues
        res.status(500).json({ message: 'Server error fetching product' });
    }
});


// =========================================================================
// ADMIN ROUTES (Protected by Authentication Middleware)
// =========================================================================

// @route   POST /api/products
// @desc    Create a new product (ONLY for Admin users, requires JWT)
// @access  Private/Admin
// Note: We apply 'protect' first to verify the token, then 'admin' (which currently just calls next()).
router.post('/', protect, admin, async (req, res) => {
    // req.user is set by the 'protect' middleware (the Canvas file)
    const { name, description, category, price, countInStock, imageUrl } = req.body;

    try {
        const product = new Product({
            user: req.user, // Use the authenticated user's ID from the token
            name,
            description,
            category,
            price,
            countInStock,
            imageUrl: imageUrl || 'https://placehold.co/600x400/000000/FFFFFF/png?text=Placeholder',
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({ message: 'Server error creating product' });
    }
});

router.put('/:id', protect, admin, async (req, res) => {
    const { name, description, category, price, countInStock, imageUrl } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.category = category || product.category;
            product.price = price || product.price;
            product.countInStock = countInStock || product.countInStock;
            product.imageUrl = imageUrl || product.imageUrl;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error("Error updating product:", error.message);
        res.status(500).json({ message: 'Server error updating product' });
    }
});


// @route   DELETE /api/products/:id
// @desc    Delete a product (ONLY for Admin users, requires JWT)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Use findByIdAndDelete or deleteOne as appropriate
            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Product removed successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: 'Server error deleting product' });
    }
});

module.exports = router;
